/**
 * Battery Energy Storage System (BESS) & Time-of-Day (TOD) Arbitrage Engine
 * Simulates on-site Lithium Iron Phosphate (LiFePO4 / LFP) battery storage,
 * capturing zero-export curtailed solar during midday and discharging during
 * high-cost Discom evening peak hours (18:00 - 22:00) to maximize TOD arbitrage.
 */

class BESSModel {
  constructor() {
    this.DEFAULT_CONFIG = {
      capacityKWh: 0, // 0 = disabled by default, or e.g. 500 kWh
      maxPowerKW: 0,  // Max charge/discharge inverter rating (kW), e.g. 250 kW (0.5C)
      roundTripEfficiencyPct: 88.0, // 88% AC-to-AC round-trip efficiency
      depthOfDischargePct: 85.0,    // 85% usable DoD to protect cell longevity
      minSoCPct: 15.0,              // 15% reserve buffer
      initialSoCPct: 20.0,          // Initial SoC at 00:00 midnight
      capexPerKWh: 22000,           // ₹22,000/kWh turnkey containerized BESS Capex
      cycleLife: 6000               // 6,000 cycles (~15 years at 1.1 cycles/day)
    };
  }

  /**
   * Dispatches BESS across all 96 blocks in coordination with solar & load
   * 
   * Strategy:
   * 1. Solar Curtailment Capture: When BTM solar potential > load, charge battery instead of curtailing.
   * 2. Daytime Charging: If battery has remaining capacity before 16:00 and solar is abundant, charge.
   * 3. Evening Peak Discharge: During Discom Evening TOD Peak (typically 18:00 - 22:00), discharge to plant.
   * 4. Demand Breach Shaving: If plant load exceeds Sanctioned Load, discharge to prevent penalty.
   * 
   * @param {Array<Object>} blocks - 96 block dispatch array from SolarModel
   * @param {Object} bessConfig - BESS configuration parameters
   * @param {Object} statePolicy - State policy with TOD slabs
   * @returns {Object} Updated 96 blocks with BESS telemetry, and summary statistics
   */
  dispatch96BlockBESS(blocks, bessConfig = {}, statePolicy = {}) {
    const config = { ...this.DEFAULT_CONFIG, ...bessConfig };

    if (!config.capacityKWh || config.capacityKWh <= 0 || !config.maxPowerKW || config.maxPowerKW <= 0) {
      // BESS is disabled: Return unmodified blocks with zero BESS activity
      return {
        hasBESS: false,
        blocks: blocks.map(b => ({
          ...b,
          bessChargeKW: 0,
          bessDischargeKW: 0,
          bessSoCKWh: 0,
          bessSoCPct: 0
        })),
        summary: {
          bessCapacityKWh: 0,
          totalChargedKWh: 0,
          totalDischargedKWh: 0,
          curtailmentSavedKWh: 0,
          dailyTodSavingsINR: 0
        }
      };
    }

    const maxCapacity = config.capacityKWh;
    const minEnergy = maxCapacity * (config.minSoCPct / 100);
    const maxEnergy = maxCapacity * (config.depthOfDischargePct / 100);
    const usableCapacity = maxEnergy - minEnergy;
    const oneWayEff = Math.sqrt(config.roundTripEfficiencyPct / 100); // ~0.938 for 88% RTE
    const maxKW = config.maxPowerKW;

    let currentEnergy = maxCapacity * (config.initialSoCPct / 100);
    let totalChargedKWh = 0;
    let totalDischargedKWh = 0;
    let curtailmentSavedKWh = 0;
    let dailyTodSavingsINR = 0;

    const baseTariff = statePolicy.baseIndustrialTariff || 7.85;

    const updatedBlocks = blocks.map(block => {
      const hour = block.hourDecimal; // 0.0 to 23.75
      let chargeKW = 0;
      let dischargeKW = 0;

      // Determine TOD slot multiplier
      let todMultiplier = 1.0;
      const todSlabs = statePolicy.todSlabs || [];
      for (const slab of todSlabs) {
        if (slab.startHour > slab.endHour) {
          // Crosses midnight, e.g. 22:00 to 06:00
          if (hour >= slab.startHour || hour < slab.endHour) {
            todMultiplier = 1 + (slab.surchargePct / 100);
            break;
          }
        } else {
          if (hour >= slab.startHour && hour < slab.endHour) {
            todMultiplier = 1 + (slab.surchargePct / 100);
            break;
          }
        }
      }
      const currentGridTariff = baseTariff * todMultiplier;

      // Condition 1: Solar Curtailment Capture (Midday Solar Peak)
      // If BTM solar was curtailed because generation exceeded load
      const availableCurtailmentKW = block.actualBTMCurtailed || 0;
      if (availableCurtailmentKW > 0 && currentEnergy < maxEnergy) {
        const headroomKWh = maxEnergy - currentEnergy;
        const maxChargeKWByHeadroom = (headroomKWh / 0.25) / oneWayEff;
        chargeKW = Math.min(availableCurtailmentKW, maxKW, maxChargeKWByHeadroom);
        curtailmentSavedKWh += (chargeKW * 0.25);
      }

      // Condition 2: Peak Shaving / Evening TOD Discharge (18:00 - 22:00)
      // Discharge when tariff is high and battery has stored energy
      const isEveningPeak = (hour >= 18 && hour < 22);
      const isDemandBreach = (block.contractDemandBreachKW > 0);

      if ((isEveningPeak || isDemandBreach) && chargeKW === 0 && currentEnergy > minEnergy) {
        const availableStoredKWh = currentEnergy - minEnergy;
        const maxDischargeKWByEnergy = (availableStoredKWh / 0.25) * oneWayEff;
        
        // Discharge up to plant grid drawl or contract breach
        const targetDischargeKW = isDemandBreach 
          ? block.actualGridDrawl 
          : Math.min(block.actualGridDrawl, maxKW);

        dischargeKW = Math.min(targetDischargeKW, maxKW, maxDischargeKWByEnergy);
      }

      // Update State of Charge (SoC)
      if (chargeKW > 0) {
        const energyAdded = chargeKW * 0.25 * oneWayEff;
        currentEnergy = Math.min(maxEnergy, currentEnergy + energyAdded);
        totalChargedKWh += (chargeKW * 0.25);
      } else if (dischargeKW > 0) {
        const energyRemoved = (dischargeKW * 0.25) / oneWayEff;
        currentEnergy = Math.max(minEnergy, currentEnergy - energyRemoved);
        totalDischargedKWh += (dischargeKW * 0.25);
        dailyTodSavingsINR += (dischargeKW * 0.25 * currentGridTariff);
      }

      // Net impact on grid drawl
      const netGridDrawlWithBESS = Math.max(0, block.actualGridDrawl - dischargeKW + (chargeKW > availableCurtailmentKW ? (chargeKW - availableCurtailmentKW) : 0));
      const netBTMUtilizedWithBESS = block.actualBTMUtilized + (chargeKW <= availableCurtailmentKW ? chargeKW : 0);
      const netBTMCurtailedWithBESS = Math.max(0, block.actualBTMCurtailed - chargeKW);

      return {
        ...block,
        bessChargeKW: Math.round(chargeKW * 10) / 10,
        bessDischargeKW: Math.round(dischargeKW * 10) / 10,
        bessSoCKWh: Math.round(currentEnergy * 10) / 10,
        bessSoCPct: Math.round((currentEnergy / maxCapacity) * 100),
        actualGridDrawl: Math.round(netGridDrawlWithBESS * 10) / 10,
        actualBTMUtilized: Math.round(netBTMUtilizedWithBESS * 10) / 10,
        actualBTMCurtailed: Math.round(netBTMCurtailedWithBESS * 10) / 10,
        currentGridTariff: Math.round(currentGridTariff * 100) / 100
      };
    });

    return {
      hasBESS: true,
      blocks: updatedBlocks,
      summary: {
        bessCapacityKWh: config.capacityKWh,
        bessPowerKW: config.maxPowerKW,
        totalChargedKWh: Math.round(totalChargedKWh),
        totalDischargedKWh: Math.round(totalDischargedKWh),
        curtailmentSavedKWh: Math.round(curtailmentSavedKWh),
        dailyTodSavingsINR: Math.round(dailyTodSavingsINR),
        annualTodSavingsINR: Math.round(dailyTodSavingsINR * 365),
        usableCapacityKWh: Math.round(usableCapacity),
        equivalentCyclesPerDay: Math.round((totalDischargedKWh / usableCapacity) * 100) / 100
      }
    };
  }
}

// Export to window
if (typeof window !== "undefined") {
  window.BESSModel = BESSModel;
}
