/**
 * Deviation Settlement Mechanism (DSM), BESS Dispatch & Institutional Settlement Engine
 * Evaluates real-time 15-minute deviations against State Regulations,
 * simulates on-site BESS storage and TOD peak shaving,
 * calculates multi-tier penalties, inadvertent export losses,
 * and coordinates 25-Year Project Finance and Landed Cost analytics.
 */

class DSMEngine {
  constructor() {
    this.solarModel = new SolarModel();
    this.bessModel = typeof BESSModel !== "undefined" ? new BESSModel() : null;
    this.landedCostEngine = typeof LandedCostEngine !== "undefined" ? new LandedCostEngine() : null;
    this.financialModel = typeof FinancialModel !== "undefined" ? new FinancialModel() : null;
  }

  /**
   * Evaluates 96-block dispatch against state regulatory rules, TOD tariffs, and BESS
   * 
   * @param {Object} inputParams - Configuration and slider inputs
   * @param {string} stateKey - State key (e.g. "maharashtra", "gujarat")
   * @returns {Object} Comprehensive evaluation results (blocks, KPIs, financial totals, 25-yr model)
   */
  evaluateDispatch(inputParams, stateKey = "maharashtra") {
    const statePolicy = STATE_POLICIES[stateKey] || STATE_POLICIES.maharashtra;
    let rawBlocks = this.solarModel.compute96BlockDispatch(inputParams);

    // 1. Dispatch BESS (Battery Energy Storage System) if configured
    let bessSummary = null;
    if (this.bessModel && inputParams.bessCapacityKWh > 0 && inputParams.bessPowerKW > 0) {
      const bessDispatch = this.bessModel.dispatch96BlockBESS(rawBlocks, {
        capacityKWh: inputParams.bessCapacityKWh,
        maxPowerKW: inputParams.bessPowerKW,
        roundTripEfficiencyPct: inputParams.bessRTEPct || 88.0,
        depthOfDischargePct: inputParams.bessDoDPct || 85.0
      }, statePolicy);
      rawBlocks = bessDispatch.blocks;
      bessSummary = bessDispatch.summary;
    }

    const toleranceBandPct = statePolicy.dsmToleranceBandPct;
    const refRate = statePolicy.dsmReferenceRate;
    const baseGridTariff = inputParams.customGridTariff || statePolicy.baseIndustrialTariff;
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
    let totalBaselineDiscomCostINR = 0;
    let totalActualDiscomCostINR = 0;

    let penaltyBlockCount = 0;
    let warningBlockCount = 0;
    let okBlockCount = 0;

    const evaluatedBlocks = rawBlocks.map(block => {
      const devPctAbs = Math.abs(block.deviationPct);
      let status = "BALANCED";
      let statusBadgeClass = "badge-ok";
      let blockPenaltyINR = 0;
      let penaltyBreakdownText = "Within allowable error band (No penalty)";
      let appliedTierLabel = "Band 1: Free Tolerance";

      // Calculate Block-Specific TOD Tariff
      const hour = block.hourDecimal;
      let todMultiplier = 1.0;
      let todSlotName = "Normal";
      const todSlabs = statePolicy.todSlabs || [];
      for (const slab of todSlabs) {
        if (slab.startHour > slab.endHour) {
          // Crosses midnight (e.g., 22:00 to 06:00)
          if (hour >= slab.startHour || hour < slab.endHour) {
            todMultiplier = 1 + (slab.surchargePct / 100);
            todSlotName = slab.name;
            break;
          }
        } else {
          if (hour >= slab.startHour && hour < slab.endHour) {
            todMultiplier = 1 + (slab.surchargePct / 100);
            todSlotName = slab.name;
            break;
          }
        }
      }
      const blockGridTariff = baseGridTariff * todMultiplier;

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
          blockPenaltyINR = penalizableKWh * (refRate * tierFactor);
          penaltyBreakdownText = `Under-drawl by ${Math.abs(block.deviationKW).toFixed(1)} kW (${Math.abs(block.deviationPct).toFixed(1)}%). DSM Charge: ${(tierFactor * 100).toFixed(0)}% on ₹${refRate}/kWh`;
        }
      }

      // 2. Inadvertent Grid Export Evaluation
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
        const breachKWh = block.contractDemandBreachKW * 0.25;
        demandBreachPenaltyINR = breachKWh * (blockGridTariff * (statePolicy.contractDemandExceedancePenaltyMultiplier - 1));
        penaltyBreakdownText += ` | Exceeded Sanctioned Load by ${block.contractDemandBreachKW.toFixed(1)} kW!`;
      }

      const totalBlockPenaltyINR = blockPenaltyINR + inadvertentPenaltyINR + demandBreachPenaltyINR;

      // Accumulate energy and TOD costs
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

      // TOD Cost calculations
      totalBaselineDiscomCostINR += (block.energyActualLoadKWh * blockGridTariff);
      totalActualDiscomCostINR += (block.energyActualGridImportKWh * blockGridTariff);

      return {
        ...block,
        status,
        statusBadgeClass,
        appliedTierLabel,
        toleranceBandPct,
        todSlotName,
        blockGridTariff: Math.round(blockGridTariff * 100) / 100,
        allowableLowerBandKW: Math.max(0, block.scheduledGridDrawl * (1 - toleranceBandPct / 100)),
        allowableUpperBandKW: block.scheduledGridDrawl * (1 + toleranceBandPct / 100),
        blockPenaltyINR: Math.round(totalBlockPenaltyINR * 100) / 100,
        penaltyBreakdownText
      };
    });

    // 2. Financial & Energy Balance Calculations
    // Baseline Cost without Solar (100% Discom import using TOD tariffs)
    const baselineDailyCostINR = totalBaselineDiscomCostINR;

    // Solar Cost (OA PPA rate for OA energy consumed; BTM has zero marginal cost after CAPEX)
    const dailyOASolarCostINR = totalOAConsumedKWh * oaPpaRate;

    // Discom Grid Import Cost (TOD Weighted)
    const dailyDiscomEnergyCostINR = totalActualDiscomCostINR;

    // Total Penalties
    const dailyTotalPenaltiesINR = totalDsmPenaltyINR + totalInadvertentExportPenaltyINR + totalDemandBreachPenaltyINR;

    // Net Total Energy Bill with Solar, TOD & DSM
    const netActualDailyCostINR = dailyOASolarCostINR + dailyDiscomEnergyCostINR + dailyTotalPenaltiesINR;

    // Net Daily Savings vs Baseline
    const netDailySavingsINR = Math.max(0, baselineDailyCostINR - netActualDailyCostINR);
    const savingsPct = baselineDailyCostINR > 0 ? (netDailySavingsINR / baselineDailyCostINR) * 100 : 0;

    // Renewable Energy Share
    const totalGreenEnergyKWh = totalBTMUtilizedKWh + totalOAConsumedKWh;
    const greenEnergySharePct = totalActualConsumptionKWh > 0 ? (totalGreenEnergyKWh / totalActualConsumptionKWh) * 100 : 0;

    // 3. Itemized Open Access Landed Cost Evaluation
    let landedCostReport = null;
    let rule3AuditReport = null;
    if (this.landedCostEngine) {
      landedCostReport = this.landedCostEngine.calculateLandedCost({
        stateKey,
        procurementType: inputParams.procurementType || "group_captive",
        basePpaRate: oaPpaRate,
        voltageLevel: inputParams.voltageLevel || "33",
        annualOAEnergyKWh: totalOAConsumedKWh * 365,
        discomTariff: baseGridTariff
      });

      rule3AuditReport = this.landedCostEngine.auditRule3Compliance({
        equityPct: inputParams.captiveEquityPct || 26.0,
        plantCapacityMW: (inputParams.openAccessKWp || 1500) / 1000,
        annualGenerationMUs: ((inputParams.openAccessKWp || 1500) * 1620) / 1e6,
        consumerOfftakeMUs: (totalOAConsumedKWh * 365) / 1e6,
        stateKey
      });
    }

    // 4. 25-Year Project Finance & DSCR/IRR Evaluation
    let projectFinanceReport = null;
    if (this.financialModel) {
      projectFinanceReport = this.financialModel.evaluateProjectFinance({
        rooftopKWp: inputParams.rooftopKWp || 500,
        openAccessKWp: inputParams.openAccessKWp || 1500,
        bessKWh: inputParams.bessCapacityKWh || 0,
        procurementType: inputParams.procurementType || "group_captive",
        year1RooftopGenKWh: totalBTMUtilizedKWh * 365,
        year1OAGenKWh: totalOAConsumedKWh * 365,
        discomTariff: baseGridTariff,
        oaPpaRate: oaPpaRate,
        oaLandedCost: landedCostReport ? landedCostReport.totalLandedCostPerKWh : (oaPpaRate * 1.25),
        customAssumptions: inputParams.customFinanceAssumptions || {}
      });
    }

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
        
        // Financials (TOD Integrated)
        gridTariff: baseGridTariff,
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
      },
      bessSummary,
      landedCostReport,
      rule3AuditReport,
      projectFinanceReport,
      solarTelemetry: this.solarModel.lastSolarTelemetry
    };
  }
}

// Export to window
if (typeof window !== "undefined") {
  window.DSMEngine = DSMEngine;
}
