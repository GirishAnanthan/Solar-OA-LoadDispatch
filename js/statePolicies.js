/**
 * Indian State Electricity Regulatory Commissions (SERC) Policy Database
 * Covers Net Metering caps, Behind-The-Meter (BTM) Zero-Export rules, 
 * Open Access regulations, DSM (Deviation Settlement Mechanism) formulas, and Grid Tariffs.
 */

const STATE_POLICIES = {
  maharashtra: {
    stateName: "Maharashtra",
    regulator: "MERC",
    sldcName: "MAHARASHTRA STATE LOAD DESPATCH CENTRE (MSLDC, KALWA / AIROLI)",
    regulationName: "MERC (Forecasting, Scheduling & DSM) Regulations & GEOA Orders",
    netMeteringCapKW: 1000, // 1 MW cap for C&I
    netMeteringCapPctSanctioned: 100,
    concurrentNetMeteringOA: false, // Strict Discom restriction on concurrent Net Metering + OA
    btmZeroExportAllowed: true,
    rprMandatory: true, // Reverse Power Relay (RPR) mandatory for BTM
    baseIndustrialTariff: 7.85, // ₹/kWh for HT-I Industrial Continuous
    openAccessPpaRate: 3.80, // Typical Captive Solar PPA ₹/kWh
    dsmToleranceBandPct: 10.0, // ±10% error band without penalty
    dsmReferenceRate: 3.50, // Average Power Purchase Cost (APPC) ₹/kWh
    penaltyTiers: [
      { minDeviationPct: 0, maxDeviationPct: 10.0, penaltyFactor: 0.0, label: "Band 1: Free Tolerance (±10%)" },
      { minDeviationPct: 10.0, maxDeviationPct: 20.0, penaltyFactor: 0.10, label: "Band 2: 10% - 20% (10% Surcharge on APPC)" },
      { minDeviationPct: 20.0, maxDeviationPct: 30.0, penaltyFactor: 0.20, label: "Band 3: 20% - 30% (20% Surcharge on APPC)" },
      { minDeviationPct: 30.0, maxDeviationPct: 999.0, penaltyFactor: 0.40, label: "Band 4: > 30% (40% Surcharge + Peak Penalty)" }
    ],
    inadvertentExportPenaltyRate: 1.50, // ₹/kWh penalty for unauthorized grid injection
    contractDemandExceedancePenaltyMultiplier: 1.5, // 150% tariff if actual load > sanctioned load
    bankingType: "15-minute / Monthly (Cap at 30% of consumption)",
    transmissionLossesByVoltage: {
      "11": 6.20,
      "22": 5.40,
      "33": 4.10,
      "66": 3.40,
      "110": 3.00,
      "132": 2.80
    },
    policyNotes: "MERC restricts concurrent Net-Metering and Open Access on the same connection. Converting Rooftop Solar to BTM with Zero Export (using Class 0.2s RPR) enables full self-consumption while Captive Solar supplies the remaining demand with zero CSS."
  },

  gujarat: {
    stateName: "Gujarat",
    regulator: "GERC",
    sldcName: "GUJARAT ENERGY TRANSMISSION CORP. LTD. (SLDC, GOTRI, VADODARA)",
    regulationName: "GERC (Forecasting, Scheduling and Deviation Settlement) Regulations",
    netMeteringCapKW: 1000,
    netMeteringCapPctSanctioned: 50, // Generally 50% of sanctioned load for large C&I (100% for MSME)
    concurrentNetMeteringOA: false,
    btmZeroExportAllowed: true,
    rprMandatory: true,
    baseIndustrialTariff: 7.20,
    openAccessPpaRate: 3.65,
    dsmToleranceBandPct: 10.0,
    dsmReferenceRate: 3.35,
    penaltyTiers: [
      { minDeviationPct: 0, maxDeviationPct: 10.0, penaltyFactor: 0.0, label: "Band 1: Tolerance (±10%)" },
      { minDeviationPct: 10.0, maxDeviationPct: 20.0, penaltyFactor: 0.12, label: "Band 2: 10% - 20% (12% Surcharge)" },
      { minDeviationPct: 20.0, maxDeviationPct: 30.0, penaltyFactor: 0.25, label: "Band 3: 20% - 30% (25% Surcharge)" },
      { minDeviationPct: 30.0, maxDeviationPct: 999.0, penaltyFactor: 0.50, label: "Band 4: > 30% (50% Surcharge)" }
    ],
    inadvertentExportPenaltyRate: 2.00,
    contractDemandExceedancePenaltyMultiplier: 1.6,
    bankingType: "15-minute time block TOD settlement",
    transmissionLossesByVoltage: {
      "11": 5.90,
      "22": 5.10,
      "33": 3.85,
      "66": 3.20,
      "110": 2.90,
      "132": 2.65
    },
    policyNotes: "Under Gujarat Solar Policy, dual benefit of Net Metering and Open Access on a single consumer meter is prohibited. BTM zero-export conversion requires DISCOM non-export certification."
  },

  karnataka: {
    stateName: "Karnataka",
    regulator: "KERC",
    sldcName: "KARNATAKA POWER TRANSMISSION CORP. LTD. (SLDC, RACE COURSE RD, BENGALURU)",
    regulationName: "KERC (Forecasting, Scheduling, DSM for RE Sources) Regulations",
    netMeteringCapKW: 500, // Capped at 500 kW
    netMeteringCapPctSanctioned: 80,
    concurrentNetMeteringOA: false,
    btmZeroExportAllowed: true,
    rprMandatory: true,
    baseIndustrialTariff: 7.45,
    openAccessPpaRate: 3.75,
    dsmToleranceBandPct: 10.0,
    dsmReferenceRate: 3.40,
    penaltyTiers: [
      { minDeviationPct: 0, maxDeviationPct: 10.0, penaltyFactor: 0.0, label: "Band 1: Free Tolerance (±10%)" },
      { minDeviationPct: 10.0, maxDeviationPct: 20.0, penaltyFactor: 0.10, label: "Band 2: 10% - 20% (10% DSM Charge)" },
      { minDeviationPct: 20.0, maxDeviationPct: 30.0, penaltyFactor: 0.20, label: "Band 3: 20% - 30% (20% DSM Charge)" },
      { minDeviationPct: 30.0, maxDeviationPct: 999.0, penaltyFactor: 0.40, label: "Band 4: > 30% (40% DSM Charge)" }
    ],
    inadvertentExportPenaltyRate: 1.80,
    contractDemandExceedancePenaltyMultiplier: 1.5,
    bankingType: "15-minute banking (Banking charges 8.5% in kind)",
    transmissionLossesByVoltage: {
      "11": 6.10,
      "22": 5.25,
      "33": 4.00,
      "66": 3.35,
      "110": 2.95,
      "132": 2.70
    },
    policyNotes: "Karnataka limits rooftop net metering to 500 kW. C&I consumers transitioning to Captive Open Access solar must isolate rooftop solar behind the meter to prevent conflicts with KPTCL SLDC scheduling."
  },

  tamilnadu: {
    stateName: "Tamil Nadu",
    regulator: "TNERC",
    sldcName: "STATE LOAD DESPATCH CENTRE, TANTRANSCO (CHENNAI / MADURAI)",
    regulationName: "TNERC (Forecasting, Scheduling & DSM) and Grid Interactive Solar PV",
    netMeteringCapKW: 1000,
    netMeteringCapPctSanctioned: 100,
    concurrentNetMeteringOA: false,
    btmZeroExportAllowed: true,
    rprMandatory: true,
    baseIndustrialTariff: 8.35, // High HT industrial tariff
    openAccessPpaRate: 3.90,
    dsmToleranceBandPct: 10.0,
    dsmReferenceRate: 3.60,
    penaltyTiers: [
      { minDeviationPct: 0, maxDeviationPct: 10.0, penaltyFactor: 0.0, label: "Band 1: Free Tolerance (±10%)" },
      { minDeviationPct: 10.0, maxDeviationPct: 20.0, penaltyFactor: 0.15, label: "Band 2: 10% - 20% (15% Surcharge)" },
      { minDeviationPct: 20.0, maxDeviationPct: 30.0, penaltyFactor: 0.30, label: "Band 3: 20% - 30% (30% Surcharge)" },
      { minDeviationPct: 30.0, maxDeviationPct: 999.0, penaltyFactor: 0.50, label: "Band 4: > 30% (50% Surcharge)" }
    ],
    inadvertentExportPenaltyRate: 2.20,
    contractDemandExceedancePenaltyMultiplier: 1.75, // Severe penalty in TANGEDCO
    bankingType: "Slot-to-slot TOD settlement (Peak/Off-Peak/Normal)",
    transmissionLossesByVoltage: {
      "11": 6.40,
      "22": 5.60,
      "33": 4.25,
      "66": 3.50,
      "110": 3.10,
      "132": 2.85
    },
    policyNotes: "TANGEDCO has high TOD peak surcharges (20-25%). Dual settlement (Net Metering + OA) is strictly rejected by TANGEDCO. BTM Zero Export provides 100% daytime load peak shaving without risking grid feed-in charges."
  },

  rajasthan: {
    stateName: "Rajasthan",
    regulator: "RERC",
    sldcName: "RAJASTHAN RAJYA VIDYUT PRASARAN NIGAM LTD. (SLDC, HEERAPURA, JAIPUR)",
    regulationName: "RERC (Forecasting, Scheduling and Deviation Settlement) Regulations",
    netMeteringCapKW: 1000,
    netMeteringCapPctSanctioned: 100,
    concurrentNetMeteringOA: false,
    btmZeroExportAllowed: true,
    rprMandatory: true,
    baseIndustrialTariff: 7.90,
    openAccessPpaRate: 3.55,
    dsmToleranceBandPct: 15.0, // Wider 15% tolerance band in Rajasthan due to vast solar capacity
    dsmReferenceRate: 3.25,
    penaltyTiers: [
      { minDeviationPct: 0, maxDeviationPct: 15.0, penaltyFactor: 0.0, label: "Band 1: Free Tolerance (±15%)" },
      { minDeviationPct: 15.0, maxDeviationPct: 25.0, penaltyFactor: 0.10, label: "Band 2: 15% - 25% (10% Surcharge)" },
      { minDeviationPct: 25.0, maxDeviationPct: 35.0, penaltyFactor: 0.20, label: "Band 3: 25% - 35% (20% Surcharge)" },
      { minDeviationPct: 35.0, maxDeviationPct: 999.0, penaltyFactor: 0.35, label: "Band 4: > 35% (35% Surcharge)" }
    ],
    inadvertentExportPenaltyRate: 1.40,
    contractDemandExceedancePenaltyMultiplier: 1.5,
    bankingType: "15-minute billing block",
    transmissionLossesByVoltage: {
      "11": 5.80,
      "22": 5.00,
      "33": 3.75,
      "66": 3.15,
      "110": 2.80,
      "132": 2.50
    },
    policyNotes: "RERC allows wide ±15% band for solar dispatch. Large solar parks in Bikaner and Jodhpur feed OA consumers, but local factory rooftop solar must not back-feed if OA is scheduled simultaneously."
  },

  uttarpradesh: {
    stateName: "Uttar Pradesh",
    regulator: "UPERC",
    sldcName: "UP POWER TRANSMISSION CORP. LTD. (SLDC, SHAKTI BHAWAN, LUCKNOW)",
    regulationName: "UPERC (Captive and Renewable Energy Generating Plants) Regulations",
    netMeteringCapKW: 10, // UP restricted C&I net metering severely to 10 kW!
    netMeteringCapPctSanctioned: 100,
    concurrentNetMeteringOA: false,
    btmZeroExportAllowed: true,
    rprMandatory: true,
    baseIndustrialTariff: 8.15,
    openAccessPpaRate: 3.85,
    dsmToleranceBandPct: 12.0,
    dsmReferenceRate: 3.45,
    penaltyTiers: [
      { minDeviationPct: 0, maxDeviationPct: 12.0, penaltyFactor: 0.0, label: "Band 1: Free Tolerance (±12%)" },
      { minDeviationPct: 12.0, maxDeviationPct: 20.0, penaltyFactor: 0.12, label: "Band 2: 12% - 20% (12% Surcharge)" },
      { minDeviationPct: 20.0, maxDeviationPct: 30.0, penaltyFactor: 0.25, label: "Band 3: 20% - 30% (25% Surcharge)" },
      { minDeviationPct: 30.0, maxDeviationPct: 999.0, penaltyFactor: 0.45, label: "Band 4: > 30% (45% Surcharge)" }
    ],
    inadvertentExportPenaltyRate: 1.90,
    contractDemandExceedancePenaltyMultiplier: 1.6,
    bankingType: "15-minute banking (Unbanked energy lapses)",
    transmissionLossesByVoltage: {
      "11": 6.50,
      "22": 5.70,
      "33": 4.30,
      "66": 3.60,
      "110": 3.20,
      "132": 2.90
    },
    policyNotes: "UPERC restricts C&I Net-Metering almost completely, compelling industrial consumers to install Behind-The-Meter Zero-Export systems or procure power via Open Access. Zero-export compliance is strictly audited."
  },

  haryana: {
    stateName: "Haryana",
    regulator: "HERC",
    sldcName: "HVPNL STATE LOAD DESPATCH CENTRE (SEWAH, PANIPAT)",
    regulationName: "HERC (Forecasting, Scheduling & Deviation Settlement) Regulations",
    netMeteringCapKW: 500,
    netMeteringCapPctSanctioned: 85,
    concurrentNetMeteringOA: false,
    btmZeroExportAllowed: true,
    rprMandatory: true,
    baseIndustrialTariff: 7.70,
    openAccessPpaRate: 3.70,
    dsmToleranceBandPct: 12.0,
    dsmReferenceRate: 3.40,
    penaltyTiers: [
      { minDeviationPct: 0, maxDeviationPct: 12.0, penaltyFactor: 0.0, label: "Band 1: Free Tolerance (±12%)" },
      { minDeviationPct: 12.0, maxDeviationPct: 22.0, penaltyFactor: 0.10, label: "Band 2: 12% - 22% (10% Surcharge)" },
      { minDeviationPct: 22.0, maxDeviationPct: 32.0, penaltyFactor: 0.20, label: "Band 3: 22% - 32% (20% Surcharge)" },
      { minDeviationPct: 32.0, maxDeviationPct: 999.0, penaltyFactor: 0.40, label: "Band 4: > 32% (40% Surcharge)" }
    ],
    inadvertentExportPenaltyRate: 1.70,
    contractDemandExceedancePenaltyMultiplier: 1.5,
    bankingType: "Monthly banking with withdrawal restrictions during peak hours",
    transmissionLossesByVoltage: {
      "11": 6.30,
      "22": 5.50,
      "33": 4.15,
      "66": 3.45,
      "110": 3.05,
      "132": 2.80
    },
    policyNotes: "HERC mandates that consumers operating captive/open access must not cause under-drawl that destabilizes the 66/33kV sub-transmission network. BTM Zero Export provides guaranteed stability."
  },

  telangana: {
    stateName: "Telangana",
    regulator: "TSERC",
    sldcName: "TSTRANSCO STATE LOAD DESPATCH CENTRE (VIDYUT SOUDHA, HYDERABAD)",
    regulationName: "TSERC (Forecasting, Scheduling & Deviation Settlement) Regulations",
    netMeteringCapKW: 1000,
    netMeteringCapPctSanctioned: 100,
    concurrentNetMeteringOA: false,
    btmZeroExportAllowed: true,
    rprMandatory: true,
    baseIndustrialTariff: 7.80,
    openAccessPpaRate: 3.75,
    dsmToleranceBandPct: 12.0,
    dsmReferenceRate: 3.40,
    penaltyTiers: [
      { minDeviationPct: 0, maxDeviationPct: 12.0, penaltyFactor: 0.0, label: "Band 1: Tolerance (±12%)" },
      { minDeviationPct: 12.0, maxDeviationPct: 22.0, penaltyFactor: 0.12, label: "Band 2: 12% - 22% (12% Surcharge)" },
      { minDeviationPct: 22.0, maxDeviationPct: 32.0, penaltyFactor: 0.25, label: "Band 3: 22% - 32% (25% Surcharge)" },
      { minDeviationPct: 32.0, maxDeviationPct: 999.0, penaltyFactor: 0.45, label: "Band 4: > 32% (45% Surcharge)" }
    ],
    inadvertentExportPenaltyRate: 1.85,
    contractDemandExceedancePenaltyMultiplier: 1.6,
    bankingType: "15-minute billing block",
    transmissionLossesByVoltage: {
      "11": 6.25,
      "22": 5.45,
      "33": 4.10,
      "66": 3.40,
      "110": 3.00,
      "132": 2.75
    },
    policyNotes: "TSERC rules mandate non-export certifications for rooftop installations when Open Access is availed at 11kV or 33kV to preserve TSSPDCL distribution feeder stability."
  },

  andhrapradesh: {
    stateName: "Andhra Pradesh",
    regulator: "APERC",
    sldcName: "APTRANSCO STATE LOAD DESPATCH CENTRE (VIDYUT SOUDHA, VIJAYAWADA)",
    regulationName: "APERC (Forecasting, Scheduling & Deviation Settlement) Regulations",
    netMeteringCapKW: 1000,
    netMeteringCapPctSanctioned: 100,
    concurrentNetMeteringOA: false,
    btmZeroExportAllowed: true,
    rprMandatory: true,
    baseIndustrialTariff: 7.85,
    openAccessPpaRate: 3.70,
    dsmToleranceBandPct: 12.0,
    dsmReferenceRate: 3.35,
    penaltyTiers: [
      { minDeviationPct: 0, maxDeviationPct: 12.0, penaltyFactor: 0.0, label: "Band 1: Tolerance (±12%)" },
      { minDeviationPct: 12.0, maxDeviationPct: 20.0, penaltyFactor: 0.10, label: "Band 2: 12% - 20% (10% Surcharge)" },
      { minDeviationPct: 20.0, maxDeviationPct: 30.0, penaltyFactor: 0.20, label: "Band 3: 20% - 30% (20% Surcharge)" },
      { minDeviationPct: 30.0, maxDeviationPct: 999.0, penaltyFactor: 0.40, label: "Band 4: > 30% (40% Surcharge)" }
    ],
    inadvertentExportPenaltyRate: 1.80,
    contractDemandExceedancePenaltyMultiplier: 1.55,
    bankingType: "Monthly TOD settlement",
    transmissionLossesByVoltage: {
      "11": 6.20,
      "22": 5.40,
      "33": 4.05,
      "66": 3.35,
      "110": 2.95,
      "132": 2.70
    },
    policyNotes: "APTRANSCO requires high-resolution 15-minute AMR (Automated Meter Reading) data. Unscheduled power injection into the AP grid is settled at zero tariff plus penal charges."
  }
};

// Export to window
if (typeof window !== "undefined") {
  window.STATE_POLICIES = STATE_POLICIES;
}
