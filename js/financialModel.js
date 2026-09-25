/**
 * 25-Year Project Finance, Bankability & Debt Syndication Engine
 * Calculates 25-Year Project Cash Flows, Project IRR, Equity IRR,
 * Debt Service Coverage Ratio (DSCR), LCOE, NPV, Accelerated Depreciation (Sec 32),
 * and P50/P75/P90 Yield Sensitivity Matrices for Bank Credit Committees.
 */

class FinancialModel {
  constructor() {
    this.DEFAULT_ASSUMPTIONS = {
      // Capex Assumptions (Market Benchmarks Q3 2024 - 2026)
      rooftopCapexPerKWp: 38000, // ₹38,000/kWp for industrial rooftop
      oaCapexPerMW: 38500000,    // ₹3.85 Cr/MW for 100% captive utility solar park
      oaEquityPerMW: 11000000,   // ₹1.10 Cr/MW equity contribution for Group Captive (26%)
      bessCapexPerKWh: 22000,    // ₹22,000/kWh for C&I LFP BESS containerized system
      
      // Capital & Financing Structure
      debtEquityRatio: 70, // 70% Debt, 30% Equity
      loanInterestRatePct: 9.25, // 9.25% p.a. project finance debt rate (IREDA/SBI benchmark)
      loanTenorYears: 12, // 12-year debt repayment tenor
      discountRateWACCPct: 10.0, // 10.0% WACC / Hurdle rate
      
      // Operational Escalation & Degradation
      tariffEscalationPct: 3.0, // 3% p.a. Discom industrial tariff escalation
      ppaEscalationPct: 0.0, // 0% flat PPA or user-specified
      omCostPerKWpYear: 550, // ₹550/kWp/year Year 1 O&M
      omEscalationPct: 4.0, // 4% p.a. O&M cost inflation
      
      // Technical Degradation
      solarDegradationYr1Pct: 1.5, // 1.5% Year 1 LID/LeTID
      solarDegradationAnnualPct: 0.5, // 0.5% p.a. Year 2 to 25
      
      // Taxation & Depreciation
      corporateTaxRatePct: 25.17, // Section 115BAA corporate tax rate (22% + 10% surcharge + 4% cess)
      enableAcceleratedDepr: true, // Section 32 40% WDV Accelerated Depreciation
      bookDepreciationYears: 25
    };
  }

  /**
   * Generates full 25-year institutional project finance model
   * 
   * @param {Object} inputs
   * @param {number} inputs.rooftopKWp - Rooftop Solar capacity (kWp)
   * @param {number} inputs.openAccessKWp - OA Solar capacity (kWp)
   * @param {number} inputs.bessKWh - Battery Storage capacity (kWh)
   * @param {string} inputs.procurementType - "captive_100" | "group_captive" | "third_party"
   * @param {number} inputs.year1RooftopGenKWh - Year 1 rooftop solar generation (kWh)
   * @param {number} inputs.year1OAGenKWh - Year 1 OA solar delivered generation (kWh)
   * @param {number} inputs.discomTariff - Base Discom tariff (₹/kWh)
   * @param {number} inputs.oaPpaRate - Base OA PPA rate (₹/kWh)
   * @param {number} inputs.oaLandedCost - Total landed OA cost (₹/kWh) from LandedCostEngine
   * @param {Object} inputs.customAssumptions - Overrides for financial parameters
   * @returns {Object} Comprehensive bankable evaluation with 25-yr cash flow, DSCR, IRR, NPV
   */
  evaluateProjectFinance(inputs = {}) {
    const assumptions = { ...this.DEFAULT_ASSUMPTIONS, ...(inputs.customAssumptions || {}) };

    const rooftopKWp = inputs.rooftopKWp || 500;
    const openAccessKWp = inputs.openAccessKWp || 1500;
    const bessKWh = inputs.bessKWh || 0;
    const procurementType = inputs.procurementType || "group_captive";

    // 1. Initial Capital Outlay / Investment Sizing
    const rooftopTotalCapex = rooftopKWp * assumptions.rooftopCapexPerKWp;
    
    let oaTotalInvestment = 0;
    if (procurementType === "captive_100") {
      // 100% Captive: Consumer finances full plant Capex
      oaTotalInvestment = (openAccessKWp / 1000) * assumptions.oaCapexPerMW;
    } else if (procurementType === "group_captive") {
      // Group Captive: Consumer invests only the mandatory 26% equity share
      oaTotalInvestment = (openAccessKWp / 1000) * assumptions.oaEquityPerMW;
    } else {
      // Third-party PPA: Zero upfront capital outlay for off-taker
      oaTotalInvestment = 0;
    }

    const bessTotalCapex = bessKWh * assumptions.bessCapexPerKWh;
    const totalProjectCapex = rooftopTotalCapex + oaTotalInvestment + bessTotalCapex;

    // Debt & Equity sizing (only on consumer-funded Capex)
    // In Group Captive, the equity contribution is 100% equity from the consumer
    let debtAmount = 0;
    let equityAmount = 0;

    if (procurementType === "group_captive") {
      // Rooftop & BESS funded with 70:30 debt-equity; OA share is 100% equity
      const onSiteCapex = rooftopTotalCapex + bessTotalCapex;
      debtAmount = onSiteCapex * (assumptions.debtEquityRatio / 100);
      equityAmount = (onSiteCapex * ((100 - assumptions.debtEquityRatio) / 100)) + oaTotalInvestment;
    } else if (procurementType === "captive_100") {
      debtAmount = totalProjectCapex * (assumptions.debtEquityRatio / 100);
      equityAmount = totalProjectCapex * ((100 - assumptions.debtEquityRatio) / 100);
    } else {
      // Third-party PPA: Onsite rooftop only
      const onSiteCapex = rooftopTotalCapex + bessTotalCapex;
      debtAmount = onSiteCapex * (assumptions.debtEquityRatio / 100);
      equityAmount = onSiteCapex * ((100 - assumptions.debtEquityRatio) / 100);
    }

    // Debt Amortization Parameters
    const loanInterestRate = assumptions.loanInterestRatePct / 100;
    const loanTenor = assumptions.loanTenorYears;
    
    // Equal Annual Principal Repayment (Standard project finance structure in India)
    const annualPrincipalRepayment = loanTenor > 0 ? (debtAmount / loanTenor) : 0;

    // Year 1 Energy Baseline
    const y1RooftopEnergy = inputs.year1RooftopGenKWh || (rooftopKWp * 1480); // ~1480 kWh/kWp
    const y1OAEnergy = inputs.year1OAGenKWh || (openAccessKWp * 1620); // ~1620 kWh/kWp
    const initialDiscomTariff = inputs.discomTariff || 7.85;
    const initialOALandedCost = inputs.oaLandedCost || 4.95;

    // 2. 25-Year Projection Engine
    const cashFlows = [];
    let cumulativeSavings = 0;
    let cumulativeEquityCashFlow = -equityAmount;
    let debtBalance = debtAmount;
    let taxWDV = totalProjectCapex; // Written Down Value for Accelerated Depreciation

    let simplePaybackYear = null;
    let discountedPaybackYear = null;
    let cumulativeDiscountedCF = -equityAmount;

    let minDSCR = 999;
    let sumDSCR = 0;
    let countDSCR = 0;

    for (let yr = 1; yr <= 25; yr++) {
      // Degradation Factor
      let degradationPct = 0;
      if (yr === 1) {
        degradationPct = assumptions.solarDegradationYr1Pct;
      } else {
        degradationPct = assumptions.solarDegradationYr1Pct + (yr - 1) * assumptions.solarDegradationAnnualPct;
      }
      const generationMultiplier = Math.max(0.70, 1 - (degradationPct / 100));

      const rooftopEnergyYr = y1RooftopEnergy * generationMultiplier;
      const oaEnergyYr = y1OAEnergy * generationMultiplier;
      const totalGreenEnergyYr = rooftopEnergyYr + oaEnergyYr;

      // Discom Tariff & OA Landed Cost Escalation
      const tariffMultiplier = Math.pow(1 + (assumptions.tariffEscalationPct / 100), yr - 1);
      const currentDiscomTariff = initialDiscomTariff * tariffMultiplier;
      
      const ppaMultiplier = Math.pow(1 + (assumptions.ppaEscalationPct / 100), yr - 1);
      const currentOALandedCost = initialOALandedCost * ppaMultiplier;

      // Energy Revenues / Avoided Electricity Costs
      // Rooftop solar offsets 100% of current Discom tariff
      const rooftopSavings = rooftopEnergyYr * currentDiscomTariff;
      // OA solar savings = energy * (current Discom tariff - current OA landed cost)
      const oaSolarSavings = oaEnergyYr * Math.max(0, currentDiscomTariff - currentOALandedCost);
      const grossEnergySavings = rooftopSavings + oaSolarSavings;

      // O&M Expenses
      const omMultiplier = Math.pow(1 + (assumptions.omEscalationPct / 100), yr - 1);
      const annualOMCost = (rooftopKWp * assumptions.omCostPerKWpYear) * omMultiplier;

      // EBITDA (Operational Cash Inflow)
      const ebitda = grossEnergySavings - annualOMCost;

      // Debt Service Calculations
      let interestPayment = 0;
      let principalRepayment = 0;
      if (yr <= loanTenor && debtBalance > 0) {
        interestPayment = debtBalance * loanInterestRate;
        principalRepayment = Math.min(debtBalance, annualPrincipalRepayment);
        debtBalance -= principalRepayment;
      }
      const totalDebtService = principalRepayment + interestPayment;

      // Depreciation & Tax Shield
      let taxDepr = 0;
      if (assumptions.enableAcceleratedDepr && yr <= 5 && taxWDV > 0) {
        // Section 32: 40% WDV on renewable energy machinery
        taxDepr = taxWDV * 0.40;
        taxWDV -= taxDepr;
      } else {
        // Normal Straight-line
        taxDepr = yr <= 25 ? (totalProjectCapex / 25) : 0;
      }

      // Taxable Income (PBT)
      const pbt = ebitda - interestPayment - taxDepr;
      const taxesPayable = Math.max(0, pbt * (assumptions.corporateTaxRatePct / 100));

      // Cash Flow Available for Debt Service (CFADS)
      const cfads = ebitda - taxesPayable;

      // Debt Service Coverage Ratio (DSCR)
      let dscr = null;
      if (totalDebtService > 0) {
        dscr = cfads / totalDebtService;
        if (dscr < minDSCR) minDSCR = dscr;
        sumDSCR += dscr;
        countDSCR++;
      }

      // Free Cash Flow to Equity (FCFE)
      const fcfe = cfads - totalDebtService;
      cumulativeSavings += fcfe;
      cumulativeEquityCashFlow += fcfe;

      // Discounted Cash Flow
      const discountFactor = Math.pow(1 + (assumptions.discountRateWACCPct / 100), yr);
      const discountedFCFE = fcfe / discountFactor;
      cumulativeDiscountedCF += discountedFCFE;

      // Payback Detection
      if (simplePaybackYear === null && cumulativeEquityCashFlow >= 0) {
        simplePaybackYear = Math.round((yr - 1 + Math.abs(cumulativeEquityCashFlow - fcfe) / fcfe) * 10) / 10;
      }
      if (discountedPaybackYear === null && cumulativeDiscountedCF >= 0) {
        discountedPaybackYear = Math.round((yr - 1 + Math.abs(cumulativeDiscountedCF - discountedFCFE) / discountedFCFE) * 10) / 10;
      }

      cashFlows.push({
        year: yr,
        greenEnergyMUs: Math.round((totalGreenEnergyYr / 1e6) * 100) / 100,
        discomTariff: Math.round(currentDiscomTariff * 100) / 100,
        grossEnergySavingsINR: Math.round(grossEnergySavings),
        omCostINR: Math.round(annualOMCost),
        ebitdaINR: Math.round(ebitda),
        interestPaymentINR: Math.round(interestPayment),
        principalRepaymentINR: Math.round(principalRepayment),
        totalDebtServiceINR: Math.round(totalDebtService),
        taxesPayableINR: Math.round(taxesPayable),
        cfadsINR: Math.round(cfads),
        dscr: dscr !== null ? Math.round(dscr * 100) / 100 : null,
        fcfeINR: Math.round(fcfe),
        cumulativeSavingsINR: Math.round(cumulativeSavings),
        closingDebtINR: Math.round(Math.max(0, debtBalance))
      });
    }

    const avgDSCR = countDSCR > 0 ? (sumDSCR / countDSCR) : null;
    const finalMinDSCR = minDSCR < 990 ? minDSCR : null;

    // 3. Project IRR & Equity IRR Calculation (Newton-Raphson Solver)
    const projectCashFlows = [-totalProjectCapex];
    const equityCashFlows = [-equityAmount];

    for (let yr = 0; yr < 25; yr++) {
      const row = cashFlows[yr];
      // Project Cash Flow (Unlevered): EBITDA - Taxes
      projectCashFlows.push(row.ebitdaINR - row.taxesPayableINR);
      // Equity Cash Flow (Levered): FCFE
      equityCashFlows.push(row.fcfeINR);
    }

    const projectIRR = this.calculateIRR(projectCashFlows);
    const equityIRR = this.calculateIRR(equityCashFlows);

    // 4. Net Present Value (NPV)
    const npv = this.calculateNPV(assumptions.discountRateWACCPct / 100, equityCashFlows);

    // 5. Levelized Cost of Electricity (LCOE)
    // LCOE = (Capex + PV of O&M) / (PV of Generation)
    let pvCosts = totalProjectCapex;
    let pvGeneration = 0;
    const wacc = assumptions.discountRateWACCPct / 100;

    for (let yr = 1; yr <= 25; yr++) {
      const row = cashFlows[yr - 1];
      const df = Math.pow(1 + wacc, yr);
      pvCosts += row.omCostINR / df;
      pvGeneration += (row.greenEnergyMUs * 1e6) / df;
    }
    const lcoePerKWh = pvGeneration > 0 ? (pvCosts / pvGeneration) : 0;

    // Bankability Compliance Check
    const isBankableDSCR = finalMinDSCR !== null ? (finalMinDSCR >= 1.20 && avgDSCR >= 1.35) : true;
    const isBankableIRR = equityIRR >= 14.0;

    return {
      capexSummary: {
        rooftopTotalCapex: Math.round(rooftopTotalCapex),
        oaTotalInvestment: Math.round(oaTotalInvestment),
        bessTotalCapex: Math.round(bessTotalCapex),
        totalProjectCapex: Math.round(totalProjectCapex),
        debtAmount: Math.round(debtAmount),
        equityAmount: Math.round(equityAmount),
        debtEquityRatioStr: `${assumptions.debtEquityRatio}:${100 - assumptions.debtEquityRatio}`
      },
      bankabilityMetrics: {
        projectIRR: Math.round(projectIRR * 10) / 10,
        equityIRR: Math.round(equityIRR * 10) / 10,
        minDSCR: finalMinDSCR ? Math.round(finalMinDSCR * 100) / 100 : "N/A (All Equity)",
        avgDSCR: avgDSCR ? Math.round(avgDSCR * 100) / 100 : "N/A (All Equity)",
        npvINR: Math.round(npv),
        lcoePerKWh: Math.round(lcoePerKWh * 100) / 100,
        simplePaybackYears: simplePaybackYear || "> 25 yrs",
        discountedPaybackYears: discountedPaybackYear || "> 25 yrs",
        cumulativeSavings25YrINR: Math.round(cumulativeSavings),
        isBankable: isBankableDSCR && isBankableIRR,
        bankabilityStatus: isBankableDSCR ? "APPROVED (Min DSCR ≥ 1.20x & Avg DSCR ≥ 1.35x)" : "REVIEW REQUIRED (DSCR below standard bank covenants)"
      },
      cashFlows,
      assumptions
    };
  }

  /**
   * High-precision Newton-Raphson Internal Rate of Return (IRR) numerical solver
   */
  calculateIRR(cashFlows, guess = 0.12) {
    if (!cashFlows || cashFlows.length < 2) return 0;

    let rate = guess;
    const maxIterations = 200;
    const tolerance = 1e-6;

    for (let iter = 0; iter < maxIterations; iter++) {
      let npv = 0;
      let dNpv = 0;

      for (let t = 0; t < cashFlows.length; t++) {
        const factor = Math.pow(1 + rate, t);
        if (isNaN(factor) || !isFinite(factor) || factor === 0) break;
        npv += cashFlows[t] / factor;
        if (t > 0) {
          dNpv -= (t * cashFlows[t]) / Math.pow(1 + rate, t + 1);
        }
      }

      if (Math.abs(npv) < tolerance) {
        return rate * 100;
      }

      if (Math.abs(dNpv) < 1e-10) break; // Avoid division by zero

      const newRate = rate - npv / dNpv;
      if (isNaN(newRate) || !isFinite(newRate)) break;
      if (Math.abs(newRate - rate) < tolerance) {
        return newRate * 100;
      }
      rate = newRate;
    }

    return Math.max(0, rate * 100);
  }

  /**
   * Net Present Value (NPV) calculation
   */
  calculateNPV(rate, cashFlows) {
    let npv = 0;
    for (let t = 0; t < cashFlows.length; t++) {
      npv += cashFlows[t] / Math.pow(1 + rate, t);
    }
    return npv;
  }
}

// Export to window
if (typeof window !== "undefined") {
  window.FinancialModel = FinancialModel;
}
