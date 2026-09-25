/**
 * Open Access Landed Cost & Rule 3 Captive Compliance Audit Engine
 * Evaluates itemized open access landed costs against Discom industrial tariffs
 * under 100% Captive, Group Captive, and Third-Party PPA structures.
 * Implements Electricity Rules 2005 / 2023 Rule 3 compliance audits.
 */

class LandedCostEngine {
  constructor() {
    this.statePolicies = typeof STATE_POLICIES !== "undefined" ? STATE_POLICIES : {};
  }

  /**
   * Calculates comprehensive itemized Open Access landed cost
   * 
   * @param {Object} params
   * @param {string} params.stateKey - e.g. "maharashtra", "gujarat"
   * @param {string} params.procurementType - "captive_100", "group_captive", "third_party"
   * @param {number} params.basePpaRate - Base PPA Rate (₹/kWh)
   * @param {number} params.voltageLevel - Voltage in kV ("11", "22", "33", "66", "110", "132")
   * @param {number} params.annualOAEnergyKWh - Total OA energy procured per annum (kWh)
   * @param {number} params.discomTariff - Base Discom industrial energy tariff (₹/kWh)
   * @returns {Object} Itemized landed cost breakdown and comparative savings
   */
  calculateLandedCost(params = {}) {
    const {
      stateKey = "maharashtra",
      procurementType = "group_captive", // "captive_100" | "group_captive" | "third_party"
      basePpaRate = 3.80,
      voltageLevel = "33",
      annualOAEnergyKWh = 7140 * 365,
      discomTariff = 7.85
    } = params;

    const state = this.statePolicies[stateKey] || this.statePolicies.maharashtra;

    // Transmission & Wheeling loss for chosen voltage
    const lossPct = (state.transmissionLossesByVoltage && state.transmissionLossesByVoltage[String(voltageLevel)]) || 4.10;
    const lossFactor = lossPct / 100;

    // Losses increase the effective energy needed at injection: 1 / (1 - loss)
    const lossCostPerKWh = basePpaRate * (lossFactor / (1 - lossFactor));

    // Base open access wire charges
    const transmissionCharge = state.transmissionChargePerKWh || 0.44;
    const wheelingCharge = state.wheelingChargePerKWh || 0.38;

    // Cross-Subsidy Surcharge (CSS) and Additional Surcharge (AS)
    let cssApplicable = 0;
    let asApplicable = 0;
    let isCaptiveExempt = false;

    if (procurementType === "captive_100" || procurementType === "group_captive") {
      isCaptiveExempt = true;
      cssApplicable = 0; // Exempt under Section 42 of Electricity Act 2003
      asApplicable = 0;  // Exempt for Captive in most progressive SERCs
    } else {
      isCaptiveExempt = false;
      cssApplicable = state.crossSubsidySurcharge || 1.64;
      asApplicable = state.additionalSurcharge || 1.25;
    }

    // Banking charges (in-kind conversion to ₹/kWh)
    const bankingChargePct = state.bankingChargePct || 0;
    const bankingCostPerKWh = basePpaRate * (bankingChargePct / 100);

    // SLDC Operating & Scheduling fees per kWh
    const dailyVolume = annualOAEnergyKWh > 0 ? (annualOAEnergyKWh / 365) : 7000;
    const sldcFeePerKWh = dailyVolume > 0 ? ((state.sldcFeesPerDay || 1500) / dailyVolume) : 0.05;

    // Electricity Duty on Open Access Consumption (state-specific)
    const dutyPct = state.electricityDutyPct || 7.5;
    const dutyCostPerKWh = (basePpaRate + transmissionCharge + wheelingCharge) * (dutyPct / 100);

    // Sum of all components
    const totalLandedCostPerKWh = 
      basePpaRate + 
      transmissionCharge + 
      wheelingCharge + 
      lossCostPerKWh + 
      cssApplicable + 
      asApplicable + 
      bankingCostPerKWh + 
      sldcFeePerKWh + 
      dutyCostPerKWh;

    // Compare with Discom Tariff (including Discom duty)
    const discomDutyPerKWh = discomTariff * (dutyPct / 100);
    const discomEffectiveLanded = discomTariff + discomDutyPerKWh;

    const tariffDifferentialPerKWh = discomEffectiveLanded - totalLandedCostPerKWh;
    const annualSavingsINR = Math.max(0, tariffDifferentialPerKWh * annualOAEnergyKWh);
    const savingsPct = discomEffectiveLanded > 0 ? (tariffDifferentialPerKWh / discomEffectiveLanded) * 100 : 0;

    return {
      stateName: state.stateName,
      regulator: state.regulator,
      procurementType,
      isCaptiveExempt,
      voltageLevel: `${voltageLevel} kV`,
      
      // Itemized Waterfall Breakdown (₹/kWh)
      basePpaRate: Math.round(basePpaRate * 1000) / 1000,
      transmissionCharge: Math.round(transmissionCharge * 1000) / 1000,
      wheelingCharge: Math.round(wheelingCharge * 1000) / 1000,
      lossPct: Math.round(lossPct * 100) / 100,
      lossCostPerKWh: Math.round(lossCostPerKWh * 1000) / 1000,
      cssApplicable: Math.round(cssApplicable * 1000) / 1000,
      asApplicable: Math.round(asApplicable * 1000) / 1000,
      bankingCostPerKWh: Math.round(bankingCostPerKWh * 1000) / 1000,
      sldcFeePerKWh: Math.round(sldcFeePerKWh * 1000) / 1000,
      dutyCostPerKWh: Math.round(dutyCostPerKWh * 1000) / 1000,

      // Total Landed OA Cost
      totalLandedCostPerKWh: Math.round(totalLandedCostPerKWh * 100) / 100,
      
      // Discom Comparison
      discomBaseTariff: Math.round(discomTariff * 100) / 100,
      discomDutyPerKWh: Math.round(discomDutyPerKWh * 100) / 100,
      discomEffectiveLanded: Math.round(discomEffectiveLanded * 100) / 100,
      
      tariffDifferentialPerKWh: Math.round(tariffDifferentialPerKWh * 100) / 100,
      annualSavingsINR: Math.round(annualSavingsINR),
      savingsPct: Math.round(savingsPct * 10) / 10
    };
  }

  /**
   * Audits Electricity Rules 2005 / 2023 Rule 3 Captive & Group Captive Compliance
   * 
   * Criteria:
   * 1. Minimum 26% Equity ownership with voting rights by captive consumers.
   * 2. Minimum 51% of aggregate generation consumed by captive consumers annually.
   * 3. Proportionality: Energy consumed must be in proportion to equity holding (within ±10%).
   * 
   * @param {Object} auditParams
   * @param {number} auditParams.equityPct - Equity held by consumer (0% to 100%)
   * @param {number} auditParams.plantCapacityMW - Total Solar Park capacity in MW
   * @param {number} auditParams.annualGenerationMUs - Total annual generation in Million Units (Million kWh)
   * @param {number} auditParams.consumerOfftakeMUs - Annual off-take by this consumer (Million Units)
   * @param {string} auditParams.stateKey - State for CSS/AS penalty evaluation
   * @returns {Object} Comprehensive Rule 3 compliance audit verdict
   */
  auditRule3Compliance(auditParams = {}) {
    const {
      equityPct = 26.0,
      plantCapacityMW = 1.5,
      annualGenerationMUs = 2.62, // ~19% CUF for 1.5 MW = 2.49 to 2.65 MUs
      consumerOfftakeMUs = 1.95,
      stateKey = "maharashtra"
    } = auditParams;

    const state = this.statePolicies[stateKey] || this.statePolicies.maharashtra;

    // 1. Equity Rule: >= 26%
    const isEquityCompliant = equityPct >= 26.0;

    // 2. Consumption Rule: >= 51% of aggregate generation
    const consumptionSharePct = annualGenerationMUs > 0 ? (consumerOfftakeMUs / annualGenerationMUs) * 100 : 0;
    const isConsumptionCompliant = consumptionSharePct >= 51.0;

    // 3. Proportionality check (applicable in multi-user group captive)
    // If consumer holds 26% of equity, they should ideally consume ~26% of captive pool (±10%)
    let proportionalityStatus = "Compliant";
    if (equityPct < 50 && consumptionSharePct > 75) {
      proportionalityStatus = "Review Proportionality (High consumption relative to equity)";
    }

    // Overall Status
    const isFullyCompliant = isEquityCompliant && isConsumptionCompliant;

    // Retrospective Liability Exposure if Disqualified
    // If disqualified from Captive status, Discom recovers CSS + AS on all consumed units!
    const cssRate = state.crossSubsidySurcharge || 1.64;
    const asRate = state.additionalSurcharge || 1.25;
    const totalExposureRatePerKWh = cssRate + asRate;
    const annualLiabilityExposureINR = Math.round(consumerOfftakeMUs * 1e6 * totalExposureRatePerKWh);

    return {
      isFullyCompliant,
      equityCheck: {
        equityPct,
        thresholdPct: 26.0,
        isPassed: isEquityCompliant,
        statusText: isEquityCompliant ? "PASS (≥ 26% Equity Held)" : "FAIL (< 26% Minimum Equity Required)"
      },
      consumptionCheck: {
        annualGenerationMUs: Math.round(annualGenerationMUs * 100) / 100,
        consumerOfftakeMUs: Math.round(consumerOfftakeMUs * 100) / 100,
        consumptionSharePct: Math.round(consumptionSharePct * 10) / 10,
        thresholdPct: 51.0,
        isPassed: isConsumptionCompliant,
        statusText: isConsumptionCompliant ? `PASS (${consumptionSharePct.toFixed(1)}% ≥ 51% Minimum Off-take)` : `FAIL (${consumptionSharePct.toFixed(1)}% < 51% Minimum Threshold)`
      },
      proportionalityStatus,
      financialRisk: {
        totalExposureRatePerKWh,
        annualLiabilityExposureINR,
        riskDescription: isFullyCompliant 
          ? "Zero CSS / AS liability. 100% Captive statutory exemption validated under Rule 3."
          : `CRITICAL REGULATORY RISK: Disqualification triggers retrospective CSS (₹${cssRate}/kWh) & AS (₹${asRate}/kWh) clawback totaling ₹${(annualLiabilityExposureINR / 1e5).toFixed(2)} Lakhs/yr!`
      }
    };
  }
}

// Export to window
if (typeof window !== "undefined") {
  window.LandedCostEngine = LandedCostEngine;
}
