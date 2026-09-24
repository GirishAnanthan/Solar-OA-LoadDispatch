/**
 * Solar Modeling & 96-Time-Block Load Dispatch Engine
 * Calculates 15-minute generation profiles, BTM zero-export dynamics, 
 * wheeling/transmission losses, and load curves.
 */

class SolarModel {
  constructor() {
    this.TOTAL_BLOCKS = 96; // 15-min intervals in 24 hours
    this.timeLabels = this.generateTimeLabels();
    this.normalizedSolarProfile = this.generateNormalizedSolarProfile();
  }

  /**
   * Generates readable 15-minute time strings for all 96 blocks
   * e.g., "00:00 - 00:15", "12:00 - 12:15"
   */
  generateTimeLabels() {
    const labels = [];
    for (let i = 0; i < this.TOTAL_BLOCKS; i++) {
      const startMinutes = i * 15;
      const endMinutes = (i + 1) * 15;

      const startH = String(Math.floor(startMinutes / 60)).padStart(2, "0");
      const startM = String(startMinutes % 60).padStart(2, "0");
      const endH = String(Math.floor(endMinutes / 60) % 24).padStart(2, "0");
      const endM = String(endMinutes % 60).padStart(2, "0");

      labels.push({
        blockIndex: i + 1,
        timeRange: `${startH}:${startM} - ${endH}:${endM}`,
        startTime: `${startH}:${startM}`,
        hourDecimal: startMinutes / 60
      });
    }
    return labels;
  }

  /**
   * Builds realistic Indian standard solar irradiance bell curve
   * Dawn starts at ~06:00 (Block 24), peaks at ~12:30 (Block 50), sets at ~18:15 (Block 73)
   * Peak instantaneous generation efficiency normalized ~0.80 kW per kWp under ambient heat
   */
  generateNormalizedSolarProfile() {
    const profile = new Array(this.TOTAL_BLOCKS).fill(0);
    const sunriseBlock = 24; // 06:00
    const sunsetBlock = 73;  // 18:15
    const peakBlock = 49;    // 12:15

    for (let i = sunriseBlock; i <= sunsetBlock; i++) {
      // Half-sine solar bell curve
      const angle = ((i - sunriseBlock) / (sunsetBlock - sunriseBlock)) * Math.PI;
      const baseIrradiance = Math.sin(angle);
      
      // Solar profile peaked with minor atmospheric clarity exponent
      const normalizedOutput = Math.pow(baseIrradiance, 1.15) * 0.82;
      profile[i] = Math.max(0, normalizedOutput);
    }
    return profile;
  }

  /**
   * Generates 96-block base industrial load shape (normalized between 0 and 1)
   * @param {string} profileType - "continuous", "twoshift", "commercial"
   */
  getBaseLoadShape(profileType = "continuous") {
    const shape = new Array(this.TOTAL_BLOCKS).fill(1.0);

    for (let i = 0; i < this.TOTAL_BLOCKS; i++) {
      const hour = i / 4; // 0.0 to 23.75

      if (profileType === "continuous") {
        // Continuous 24x7 3-shift chemical/textile/foundry industrial load
        // Slight fluctuation around shift changeover (06:00, 14:00, 22:00)
        let factor = 0.92;
        if (hour >= 9 && hour <= 18) factor = 0.98; // Day shift full capacity
        if (Math.abs(hour - 6) < 0.5 || Math.abs(hour - 14) < 0.5 || Math.abs(hour - 22) < 0.5) {
          factor -= 0.08; // Shift change handoff dip
        }
        shape[i] = factor;
      } else if (profileType === "twoshift") {
        // 2-shift manufacturing (08:00 - 20:00)
        if (hour < 7.5 || hour > 21) {
          shape[i] = 0.32; // Night baseload (chillers, lighting, critical lines)
        } else if (hour >= 8 && hour <= 20) {
          shape[i] = 0.95;
          if (hour >= 13 && hour <= 13.75) shape[i] = 0.80; // Lunch hour drop
        } else {
          shape[i] = 0.60; // Ramp up / ramp down
        }
      } else if (profileType === "commercial") {
        // Commercial / Data Center / Office
        if (hour < 7 || hour > 20) {
          shape[i] = 0.22; // Night standby
        } else if (hour >= 9 && hour <= 18) {
          shape[i] = 0.96; // Peak HVAC, lighting, workstation load
        } else {
          shape[i] = 0.55;
        }
      }
    }
    return shape;
  }

  /**
   * Computes Day-Ahead vs Actual Real-Time Dispatch simulation for all 96 blocks
   * 
   * @param {Object} params
   * @param {number} params.sanctionedLoadKW - Contract Demand / Sanctioned load in kW
   * @param {number} params.baseConnectedLoadKW - Reference connected load in kW
   * @param {number} params.loadMultiplier - Slider adjustment (e.g. 0.50 to 1.50)
   * @param {string} params.loadProfileType - "continuous", "twoshift", "commercial"
   * @param {number} params.rooftopKWp - Existing rooftop solar capacity (kWp) - converted to BTM Zero-Export
   * @param {number} params.openAccessKWp - Captive Open Access Solar capacity (kWp)
   * @param {number} params.lossPct - Transmission and wheeling loss percentage
   * @param {number} params.actualIrradiancePct - Real-time cloud/irradiance factor (0% to 120%)
   * @param {number} params.dayAheadIrradiancePct - Day-ahead forecast irradiance factor (default 100%)
   * @returns {Array<Object>} 96 block dispatch schedule records
   */
  compute96BlockDispatch(params) {
    const {
      sanctionedLoadKW,
      baseConnectedLoadKW,
      loadMultiplier = 1.0,
      loadProfileType = "continuous",
      rooftopKWp = 500,
      openAccessKWp = 1500,
      lossPct = 4.10,
      actualIrradiancePct = 100,
      dayAheadIrradiancePct = 100
    } = params;

    const baseShape = this.getBaseLoadShape(loadProfileType);
    const deliveryLossFactor = 1 - (lossPct / 100);

    const blocks = [];

    for (let i = 0; i < this.TOTAL_BLOCKS; i++) {
      const timeInfo = this.timeLabels[i];
      const normGen = this.normalizedSolarProfile[i];

      // 1. Connected Load
      // Day-ahead baseline scheduled load
      const scheduledConnectedLoad = baseConnectedLoadKW * baseShape[i];
      // Real-time actual connected load after user slider variation
      const actualConnectedLoad = baseConnectedLoadKW * baseShape[i] * loadMultiplier;

      // 2. Solar Generation Potentials
      // Day-ahead forecast solar (used for Day-Ahead Schedule submitted to SLDC)
      const daRooftopGenPotential = rooftopKWp * normGen * (dayAheadIrradiancePct / 100);
      const daOAGenAtSource = openAccessKWp * normGen * (dayAheadIrradiancePct / 100);
      const daOADelivered = daOAGenAtSource * deliveryLossFactor;

      // Real-time actual solar (reflects current irradiance / cloud cover)
      const actualRooftopGenPotential = rooftopKWp * normGen * (actualIrradiancePct / 100);
      const actualOAGenAtSource = openAccessKWp * normGen * (actualIrradiancePct / 100);
      const actualOADelivered = actualOAGenAtSource * deliveryLossFactor;

      // 3. Behind-The-Meter (BTM) Zero-Export Behavior
      // Day-Ahead Planned BTM: Cannot export. Dispatched up to load.
      const daBTMUtilized = Math.min(daRooftopGenPotential, scheduledConnectedLoad);
      const daBTMCurtailed = Math.max(0, daRooftopGenPotential - scheduledConnectedLoad);

      // Real-Time Actual BTM: Zero-Export Reverse Power Relay restricts generation to instantaneous load!
      const actualBTMUtilized = Math.min(actualRooftopGenPotential, actualConnectedLoad);
      const actualBTMCurtailed = Math.max(0, actualRooftopGenPotential - actualConnectedLoad);

      // 4. Net Demand remaining before Open Access
      const daResidualDemand = scheduledConnectedLoad - daBTMUtilized;
      const actualResidualDemand = actualConnectedLoad - actualBTMUtilized;

      // 5. Day-Ahead Open Access Scheduled Delivery
      // In Indian SLDC practice, consumer schedules OA drawl up to planned residual demand.
      // (Any surplus at offsite solar park is curtailed at source or banked if state permits).
      const daOAScheduledDrawl = Math.min(daOADelivered, daResidualDemand);

      // Day-Ahead Scheduled Grid Drawl (submitted to SLDC)
      // Discom scheduled import to meet remaining shortfall
      const scheduledGridDrawl = Math.max(0, daResidualDemand - daOAScheduledDrawl);

      // 6. Real-Time Actual Grid Drawl & OA Absorption
      // Consumer draws scheduled OA power (or actual available from generator if cloudy)
      const effectiveOADelivery = Math.min(actualOADelivered, daOAScheduledDrawl);

      let actualGridDrawl = 0;
      let inadvertentExportKW = 0;

      if (actualResidualDemand >= effectiveOADelivery) {
        // Factory absorbs the full scheduled green power and draws remaining deficit from Discom
        actualGridDrawl = actualResidualDemand - effectiveOADelivery;
        inadvertentExportKW = 0;
      } else {
        // Factory load dropped below scheduled OA delivery!
        // Factory draws 0 from Discom.
        actualGridDrawl = 0;
        // The scheduled green power delivered that the factory could not absorb spills toward Discom:
        inadvertentExportKW = effectiveOADelivery - actualResidualDemand;
      }

      // 7. Deviation Calculation
      // Deviation = Actual Grid Drawl - Scheduled Grid Drawl
      // Positive deviation: Over-drawl from DISCOM (consumer drew more grid power than scheduled)
      // Negative deviation: Under-drawl from DISCOM (consumer drew less than scheduled)
      const deviationKW = actualGridDrawl - scheduledGridDrawl;

      // Reference denominator for percentage calculation:
      // In CERC/SERC DSM rules, % deviation is calculated against Scheduled Drawl
      // If Scheduled Drawl is very low (< 50 kW), deviation is assessed against Contract Demand
      const referenceCapacity = scheduledGridDrawl > 50 ? scheduledGridDrawl : sanctionedLoadKW;
      const deviationPct = referenceCapacity > 0 ? (deviationKW / referenceCapacity) * 100 : 0;

      // Check for Sanctioned Load (Contract Demand) breach
      const contractDemandBreachKW = Math.max(0, actualConnectedLoad - sanctionedLoadKW);

      blocks.push({
        blockNumber: i + 1,
        timeRange: timeInfo.timeRange,
        startTime: timeInfo.startTime,
        hourDecimal: timeInfo.hourDecimal,
        isSolarHour: normGen > 0.01,
        
        // Load metrics (kW)
        scheduledConnectedLoad: Math.round(scheduledConnectedLoad * 10) / 10,
        actualConnectedLoad: Math.round(actualConnectedLoad * 10) / 10,
        contractDemandBreachKW: Math.round(contractDemandBreachKW * 10) / 10,

        // Solar generation metrics (kW)
        normGenFactor: normGen,
        actualRooftopGenPotential: Math.round(actualRooftopGenPotential * 10) / 10,
        actualBTMUtilized: Math.round(actualBTMUtilized * 10) / 10,
        actualBTMCurtailed: Math.round(actualBTMCurtailed * 10) / 10,
        
        actualOAGenAtSource: Math.round(actualOAGenAtSource * 10) / 10,
        actualOADelivered: Math.round(actualOADelivered * 10) / 10,
        daOADelivered: Math.round(daOADelivered * 10) / 10,

        // Dispatch & Grid Drawl metrics (kW)
        scheduledGridDrawl: Math.round(scheduledGridDrawl * 10) / 10,
        actualGridDrawl: Math.round(actualGridDrawl * 10) / 10,
        deviationKW: Math.round(deviationKW * 10) / 10,
        deviationPct: Math.round(deviationPct * 10) / 10,
        inadvertentExportKW: Math.round(inadvertentExportKW * 10) / 10,

        // Energy for 15-minute block (kWh) = kW * (15 / 60) = kW * 0.25
        energyActualLoadKWh: actualConnectedLoad * 0.25,
        energyBTMUtilizedKWh: actualBTMUtilized * 0.25,
        energyBTMCurtailedKWh: actualBTMCurtailed * 0.25,
        energyOAConsumedKWh: Math.min(actualOADelivered, actualResidualDemand) * 0.25,
        energyActualGridImportKWh: actualGridDrawl * 0.25,
        energyScheduledGridImportKWh: scheduledGridDrawl * 0.25,
        energyDeviationKWh: Math.abs(deviationKW) * 0.25,
        energyInadvertentExportKWh: inadvertentExportKW * 0.25
      });
    }

    return blocks;
  }
}

// Export to window
if (typeof window !== "undefined") {
  window.SolarModel = SolarModel;
}
