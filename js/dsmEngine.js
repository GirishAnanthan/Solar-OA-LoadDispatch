/**
 * Deviation Settlement Mechanism (DSM) & SERC Regulatory Settlement Engine
 * Evaluates real-time 15-minute deviations against State Regulations,
 * calculates multi-tier penalties, inadvertent export losses, and net bill savings.
 */

class DSMEngine {
  constructor() {
    this.solarModel = new SolarModel();
  }

  /**
   * Evaluates 96-block dispatch against state regulatory rules
   * 
   * @param {Object} inputParams - Configuration and slider inputs
   * @param {string} stateKey - State key (e.g. "maharashtra", "gujarat")
   * @returns {Object} Comprehensive evaluation results (blocks, KPIs, financial totals)
   */
  evaluateDispatch(inputParams, stateKey = "maharashtra") {
    const statePolicy = STATE_POLICIES[stateKey] || STATE_POLICIES.maharashtra;
    const blocks = this.solarModel.compute96BlockDispatch(inputParams);

    const toleranceBandPct = statePolicy.dsmToleranceBandPct;
    const refRate = statePolicy.dsmReferenceRate;
    const gridTariff = inputParams.customGridTariff || statePolicy.baseIndustrialTariff;
    const oaPpaRate = inputParams.customOaRate || statePolicy.openAccessPpaRate;

    let totalActualConsumptionKWh = 0;
    let totalScheduledLoadKWh = 0;
    let totalBTMUtilizedKWh = 0;
    let totalBTMCurtailedKWh = 0;
    let totalOAConsumedKWh = 0;
    let totalActualGridImportKWh = 0;
    let totalScheduledGridImportKWh = 0;
    let totalDeviationKWh = 0;
    let totalInadvertentExportKWh = 0;

    let totalDsmPenaltyINR = 0;
    let totalInadvertentExportPenaltyINR = 0;
    let totalDemandBreachPenaltyINR = 0;

    let penaltyBlockCount = 0;
    let warningBlockCount = 0;
    let okBlockCount = 0;

    const evaluatedBlocks = blocks.map(block => {
      const devPctAbs = Math.abs(block.deviationPct);
      let status = "BALANCED";
      let statusBadgeClass = "badge-ok";
      let blockPenaltyINR = 0;
      let penaltyBreakdownText = "Within allowable error band (No penalty)";
      let appliedTierLabel = "Band 1: Free Tolerance";

      // 1. Evaluate Deviation Penalties
      if (devPctAbs <= toleranceBandPct) {
        // Within free tolerance band
        status = "WITHIN_BAND";
        statusBadgeClass = "badge-ok";
        okBlockCount++;
      } else {
        // Exceeds allowable band!
        warningBlockCount++;
        
        // Find applicable tier in state policy
        let tierFactor = 0.10;
        for (const tier of statePolicy.penaltyTiers) {
          if (devPctAbs > tier.minDeviationPct && devPctAbs <= tier.maxDeviationPct) {
            tierFactor = tier.penaltyFactor;
            appliedTierLabel = tier.label;
            break;
          }
        }

        // Penalty applies to the energy deviating outside the allowable tolerance band
        // Energy in kWh for this 15-min block
        const excessDeviationKWh = (Math.abs(block.deviationKW) - (block.scheduledGridDrawl * (toleranceBandPct / 100))) * 0.25;
        const penalizableKWh = Math.max(0, excessDeviationKWh);

        if (block.deviationKW > 0) {
          // Over-drawl: Drawing excess unexpected power from Discom grid
          status = "OVER_DRAWL";
          statusBadgeClass = "badge-danger";
          penaltyBlockCount++;

          // Surcharge on reference APPC/DSM pool rate
          blockPenaltyINR = penalizableKWh * (refRate * (1 + tierFactor));
          penaltyBreakdownText = `Over-drawl by ${Math.abs(block.deviationKW).toFixed(1)} kW (${block.deviationPct.toFixed(1)}%). Surcharge: ${(tierFactor * 100).toFixed(0)}% on ₹${refRate}/kWh`;
        } else {
          // Under-drawl: Drawing less power than scheduled
          status = "UNDER_DRAWL";
          statusBadgeClass = "badge-warning";
          // Under-drawl settlement penalty: penalizable energy settled at reduced rate or penalty charge
          blockPenaltyINR = penalizableKWh * (refRate * tierFactor);
          penaltyBreakdownText = `Under-drawl by ${Math.abs(block.deviationKW).toFixed(1)} kW (${Math.abs(block.deviationPct).toFixed(1)}%). DSM Charge: ${(tierFactor * 100).toFixed(0)}% on ₹${refRate}/kWh`;
        }
      }

      // 2. Inadvertent Grid Export Evaluation
      // When solar delivery exceeds residual load and no export schedule exists
      let inadvertentPenaltyINR = 0;
      if (block.inadvertentExportKW > 0) {
        status = "INADVERTENT_EXPORT";
        statusBadgeClass = "badge-danger";
        penaltyBlockCount++;
        inadvertentPenaltyINR = block.energyInadvertentExportKWh * statePolicy.inadvertentExportPenaltyRate;
        penaltyBreakdownText = `Inadvertent Grid Export: ${block.inadvertentExportKW.toFixed(1)} kW! Zero tariff credit + ₹${statePolicy.inadvertentExportPenaltyRate}/kWh penal levy`;
      }

      // 3. Contract Demand Breach Check
      let demandBreachPenaltyINR = 0;
      if (block.contractDemandBreachKW > 0) {
        status = "DEMAND_EXCEEDED";
        statusBadgeClass = "badge-danger";
        // Discom penal tariff on breached demand
        const breachKWh = block.contractDemandBreachKW * 0.25;
        demandBreachPenaltyINR = breachKWh * (gridTariff * (statePolicy.contractDemandExceedancePenaltyMultiplier - 1));
        penaltyBreakdownText += ` | Exceeded Sanctioned Load by ${block.contractDemandBreachKW.toFixed(1)} kW!`;
      }

      const totalBlockPenaltyINR = blockPenaltyINR + inadvertentPenaltyINR + demandBreachPenaltyINR;

      // Accumulate daily totals
      totalActualConsumptionKWh += block.energyActualLoadKWh;
      totalScheduledLoadKWh += (block.scheduledConnectedLoad * 0.25);
      totalBTMUtilizedKWh += block.energyBTMUtilizedKWh;
      totalBTMCurtailedKWh += block.energyBTMCurtailedKWh;
      totalOAConsumedKWh += block.energyOAConsumedKWh;
      totalActualGridImportKWh += block.energyActualGridImportKWh;
      totalScheduledGridImportKWh += block.energyScheduledGridImportKWh;
      totalDeviationKWh += block.energyDeviationKWh;
      totalInadvertentExportKWh += block.energyInadvertentExportKWh;

      totalDsmPenaltyINR += blockPenaltyINR;
      totalInadvertentExportPenaltyINR += inadvertentPenaltyINR;
      totalDemandBreachPenaltyINR += demandBreachPenaltyINR;

      return {
        ...block,
        status,
        statusBadgeClass,
        appliedTierLabel,
        toleranceBandPct,
        allowableLowerBandKW: Math.max(0, block.scheduledGridDrawl * (1 - toleranceBandPct / 100)),
        allowableUpperBandKW: block.scheduledGridDrawl * (1 + toleranceBandPct / 100),
        blockPenaltyINR: Math.round(totalBlockPenaltyINR * 100) / 100,
        penaltyBreakdownText
      };
    });

    // Financial & Energy Balance Calculations
    // 1. Baseline Cost without Solar (100% Discom import)
    const baselineDailyCostINR = totalActualConsumptionKWh * gridTariff;

    // 2. Solar Cost (OA PPA rate for OA energy consumed; BTM has zero marginal cost after CAPEX)
    const dailyOASolarCostINR = totalOAConsumedKWh * oaPpaRate;

    // 3. Discom Grid Import Cost
    const dailyDiscomEnergyCostINR = totalActualGridImportKWh * gridTariff;

    // 4. Total Penalties
    const dailyTotalPenaltiesINR = totalDsmPenaltyINR + totalInadvertentExportPenaltyINR + totalDemandBreachPenaltyINR;

    // 5. Net Total Energy Bill with Solar & DSM
    const netActualDailyCostINR = dailyOASolarCostINR + dailyDiscomEnergyCostINR + dailyTotalPenaltiesINR;

    // 6. Net Daily Savings vs Baseline
    const netDailySavingsINR = Math.max(0, baselineDailyCostINR - netActualDailyCostINR);
    const savingsPct = baselineDailyCostINR > 0 ? (netDailySavingsINR / baselineDailyCostINR) * 100 : 0;

    // 7. Renewable Energy Share (% of consumption met by Green Energy)
    const totalGreenEnergyKWh = totalBTMUtilizedKWh + totalOAConsumedKWh;
    const greenEnergySharePct = totalActualConsumptionKWh > 0 ? (totalGreenEnergyKWh / totalActualConsumptionKWh) * 100 : 0;

    return {
      statePolicy,
      blocks: evaluatedBlocks,
      summary: {
        totalActualConsumptionKWh: Math.round(totalActualConsumptionKWh),
        totalBTMUtilizedKWh: Math.round(totalBTMUtilizedKWh),
        totalBTMCurtailedKWh: Math.round(totalBTMCurtailedKWh),
        totalOAConsumedKWh: Math.round(totalOAConsumedKWh),
        totalActualGridImportKWh: Math.round(totalActualGridImportKWh),
        totalScheduledGridImportKWh: Math.round(totalScheduledGridImportKWh),
        totalDeviationKWh: Math.round(totalDeviationKWh),
        totalInadvertentExportKWh: Math.round(totalInadvertentExportKWh),
        greenEnergySharePct: Math.round(greenEnergySharePct * 10) / 10,
        
        // Financials
        gridTariff,
        oaPpaRate,
        baselineDailyCostINR: Math.round(baselineDailyCostINR),
        dailyOASolarCostINR: Math.round(dailyOASolarCostINR),
        dailyDiscomEnergyCostINR: Math.round(dailyDiscomEnergyCostINR),
        dailyDsmPenaltyINR: Math.round(totalDsmPenaltyINR),
        dailyInadvertentExportPenaltyINR: Math.round(totalInadvertentExportPenaltyINR),
        dailyDemandBreachPenaltyINR: Math.round(totalDemandBreachPenaltyINR),
        dailyTotalPenaltiesINR: Math.round(dailyTotalPenaltiesINR),
        netActualDailyCostINR: Math.round(netActualDailyCostINR),
        netDailySavingsINR: Math.round(netDailySavingsINR),
        savingsPct: Math.round(savingsPct * 10) / 10,

        // Block Statistics
        penaltyBlockCount,
        warningBlockCount,
        okBlockCount,
        complianceScorePct: Math.round((okBlockCount / 96) * 100)
      }
    };
  }
}

// Export to window
if (typeof window !== "undefined") {
  window.DSMEngine = DSMEngine;
}
