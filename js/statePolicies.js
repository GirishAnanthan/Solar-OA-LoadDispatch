/**
 * Indian State Electricity Regulatory Commissions (SERC) Policy Database
 * Institutional & Bankable Regulatory Data for Indian C&I Open Access Solar
 * Covers Net Metering caps, Behind-The-Meter (BTM) Zero-Export rules, 
 * Open Access regulations, DSM (Deviation Settlement Mechanism) formulas,
 * Cross Subsidy Surcharges (CSS), Additional Surcharges (AS), Wheeling & Transmission,
 * Banking in-kind charges, Electricity Duty, and 4-Slot Time-of-Day (TOD) Tariffs.
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
    baseIndustrialTariff: 7.85, // ₹/kWh for HT-I Industrial Continuous (MSEDCL)
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
    
    // Open Access Charges (MERC MYT Tariff Order)
    crossSubsidySurcharge: 1.64, // ₹/kWh for HT Industry (exempt for Captive)
    additionalSurcharge: 1.25, // ₹/kWh for HT Industry (exempt for Captive)
    wheelingChargePerKWh: 0.38, // ₹/kWh at 33kV HT
    transmissionChargePerKWh: 0.44, // ₹/kWh (InSTS MSETCL transmission)
    sldcFeesPerDay: 1500, // ₹/day SLDC operating & scheduling fee
    electricityDutyPct: 9.3, // % of Discom power charges (7.5% - 9.3% in Maharashtra)
    bankingChargePct: 2.0, // 2% in-kind energy deduction for monthly banking
    bankingType: "Monthly banking (Cap at 30% of total consumption, lapses at FY end)",
    
    // TOD Tariff Slots (MSEDCL HT-I Industrial)
    todSlabs: [
      { name: "Night Off-Peak", startHour: 22, endHour: 6, surchargePct: -15, label: "22:00 - 06:00 (Rebate ₹-1.50/kWh)" },
      { name: "Morning Peak", startHour: 9, endHour: 12, surchargePct: 15, label: "09:00 - 12:00 (Surcharge +₹1.18/kWh)" },
      { name: "Evening Peak", startHour: 18, endHour: 22, surchargePct: 25, label: "18:00 - 22:00 (Surcharge +₹1.96/kWh)" },
      { name: "Normal Day", startHour: 6, endHour: 9, surchargePct: 0, label: "06:00 - 09:00 (Normal Tariff)" },
      { name: "Normal Afternoon", startHour: 12, endHour: 18, surchargePct: 0, label: "12:00 - 18:00 (Normal Tariff)" }
    ],

    // Captive Rule 3 Exemptions
    captiveExemptions: {
      cssExempt: true,
      asExempt: true,
      rule3EquityMinPct: 26.0,
      rule3ConsumptionMinPct: 51.0
    },

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
    netMeteringCapPctSanctioned: 50, // 50% sanctioned load cap for large C&I
    concurrentNetMeteringOA: false,
    btmZeroExportAllowed: true,
    rprMandatory: true,
    baseIndustrialTariff: 7.20, // HTP-I Industrial (GETCO/MGVCL/UGVCL/DGVCL/PGVCL)
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

    crossSubsidySurcharge: 1.95, // ₹/kWh for HT Industry (exempt for Captive)
    additionalSurcharge: 1.10, // ₹/kWh (exempt for Captive)
    wheelingChargePerKWh: 0.32, // ₹/kWh at 33kV/66kV
    transmissionChargePerKWh: 0.40, // ₹/kWh GETCO transmission
    sldcFeesPerDay: 1200,
    electricityDutyPct: 15.0, // High electricity duty in Gujarat (15% for C&I)
    bankingChargePct: 0.0, // 15-minute billing block TOD settlement
    bankingType: "15-minute time block TOD settlement (No seasonal banking permitted)",

    todSlabs: [
      { name: "Night Off-Peak", startHour: 22, endHour: 6, surchargePct: -12, label: "22:00 - 06:00 (Rebate ₹-0.85/kWh)" },
      { name: "Morning Peak", startHour: 7, endHour: 11, surchargePct: 18, label: "07:00 - 11:00 (Surcharge +₹1.30/kWh)" },
      { name: "Evening Peak", startHour: 18, endHour: 22, surchargePct: 20, label: "18:00 - 22:00 (Surcharge +₹1.44/kWh)" },
      { name: "Normal Day", startHour: 6, endHour: 7, surchargePct: 0, label: "06:00 - 07:00 (Normal Tariff)" },
      { name: "Normal Afternoon", startHour: 11, endHour: 18, surchargePct: 0, label: "11:00 - 18:00 (Normal Tariff)" }
    ],

    captiveExemptions: {
      cssExempt: true,
      asExempt: true,
      rule3EquityMinPct: 26.0,
      rule3ConsumptionMinPct: 51.0
    },

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
    baseIndustrialTariff: 7.45, // BESCOM/HESCOM/MESCOM HT-2(a)
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

    crossSubsidySurcharge: 2.15, // ₹/kWh for HT Industrial (exempt for Captive)
    additionalSurcharge: 1.35, // ₹/kWh (exempt for Captive)
    wheelingChargePerKWh: 0.42, // ₹/kWh
    transmissionChargePerKWh: 0.48, // ₹/kWh KPTCL transmission
    sldcFeesPerDay: 1800,
    electricityDutyPct: 9.0, // 9% electricity tax
    bankingChargePct: 8.5, // 8.5% in-kind energy deduction (KERC solar banking order)
    bankingType: "15-minute / Monthly banking (Banking charges 8.5% in kind, no peak withdrawal)",

    todSlabs: [
      { name: "Night Off-Peak", startHour: 22, endHour: 6, surchargePct: -15, label: "22:00 - 06:00 (Rebate ₹-1.12/kWh)" },
      { name: "Evening Peak", startHour: 18, endHour: 22, surchargePct: 25, label: "18:00 - 22:00 (Surcharge +₹1.86/kWh)" },
      { name: "Normal Day", startHour: 6, endHour: 18, surchargePct: 0, label: "06:00 - 18:00 (Normal Tariff)" }
    ],

    captiveExemptions: {
      cssExempt: true,
      asExempt: true,
      rule3EquityMinPct: 26.0,
      rule3ConsumptionMinPct: 51.0
    },

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
    baseIndustrialTariff: 8.35, // High HT industrial tariff (TANGEDCO HT-IA)
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

    crossSubsidySurcharge: 2.28, // ₹/kWh for HT Industry (exempt for Captive)
    additionalSurcharge: 1.15, // ₹/kWh
    wheelingChargePerKWh: 0.40,
    transmissionChargePerKWh: 0.52, // TANTRANSCO transmission
    sldcFeesPerDay: 2000,
    electricityDutyPct: 5.0, // 5% electricity tax
    bankingChargePct: 14.0, // 14% high banking charge in Tamil Nadu
    bankingType: "Slot-to-slot TOD settlement (Peak/Off-Peak/Normal, 14% in-kind banking charge)",

    todSlabs: [
      { name: "Morning Peak", startHour: 6, endHour: 9, surchargePct: 20, label: "06:00 - 09:00 (Peak +20%)" },
      { name: "Evening Peak", startHour: 18, endHour: 22, surchargePct: 25, label: "18:00 - 22:00 (Peak +25%)" },
      { name: "Night Off-Peak", startHour: 22, endHour: 6, surchargePct: -10, label: "22:00 - 06:00 (Rebate -10%)" },
      { name: "Normal Day", startHour: 9, endHour: 18, surchargePct: 0, label: "09:00 - 18:00 (Normal Tariff)" }
    ],

    captiveExemptions: {
      cssExempt: true,
      asExempt: true,
      rule3EquityMinPct: 26.0,
      rule3ConsumptionMinPct: 51.0
    },

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
    baseIndustrialTariff: 7.90, // JVVNL/AVVNL/JdVVNL HT Large Industry
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

    crossSubsidySurcharge: 1.82, // ₹/kWh for HT Industry (exempt for Captive)
    additionalSurcharge: 0.80, // ₹/kWh
    wheelingChargePerKWh: 0.28,
    transmissionChargePerKWh: 0.38, // RVPNL transmission
    sldcFeesPerDay: 1100,
    electricityDutyPct: 8.0, // 8% duty
    bankingChargePct: 0.0, // 15-minute billing block
    bankingType: "15-minute billing block (Unutilized solar energy settled at APPC)",

    todSlabs: [
      { name: "Night Off-Peak", startHour: 23, endHour: 6, surchargePct: -15, label: "23:00 - 06:00 (Rebate -15%)" },
      { name: "Evening Peak", startHour: 18, endHour: 23, surchargePct: 20, label: "18:00 - 23:00 (Surcharge +20%)" },
      { name: "Normal Day", startHour: 6, endHour: 18, surchargePct: 0, label: "06:00 - 18:00 (Normal Tariff)" }
    ],

    captiveExemptions: {
      cssExempt: true,
      asExempt: true,
      rule3EquityMinPct: 26.0,
      rule3ConsumptionMinPct: 51.0
    },

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
    baseIndustrialTariff: 8.15, // UPPCL HV-2 Large Industry
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

    crossSubsidySurcharge: 2.10, // ₹/kWh for HV Industry (exempt for Captive)
    additionalSurcharge: 1.05, // ₹/kWh
    wheelingChargePerKWh: 0.45,
    transmissionChargePerKWh: 0.48, // UPPTCL transmission
    sldcFeesPerDay: 1600,
    electricityDutyPct: 7.5,
    bankingChargePct: 2.5,
    bankingType: "15-minute / Monthly banking (Unbanked energy lapses at month end)",

    todSlabs: [
      { name: "Night Off-Peak", startHour: 22, endHour: 6, surchargePct: -15, label: "22:00 - 06:00 (Rebate -15%)" },
      { name: "Evening Peak", startHour: 17, endHour: 22, surchargePct: 20, label: "17:00 - 22:00 (Surcharge +20%)" },
      { name: "Normal Day", startHour: 6, endHour: 17, surchargePct: 0, label: "06:00 - 17:00 (Normal Tariff)" }
    ],

    captiveExemptions: {
      cssExempt: true,
      asExempt: true,
      rule3EquityMinPct: 26.0,
      rule3ConsumptionMinPct: 51.0
    },

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
    baseIndustrialTariff: 7.70, // UHBVN/DHBVN HT Industry
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

    crossSubsidySurcharge: 1.74, // ₹/kWh for HT Industry (exempt for Captive)
    additionalSurcharge: 1.12, // ₹/kWh
    wheelingChargePerKWh: 0.35,
    transmissionChargePerKWh: 0.42, // HVPNL transmission
    sldcFeesPerDay: 1400,
    electricityDutyPct: 9.0,
    bankingChargePct: 2.0,
    bankingType: "Monthly banking with withdrawal restrictions during peak hours",

    todSlabs: [
      { name: "Night Off-Peak", startHour: 22, endHour: 6, surchargePct: -15, label: "22:00 - 06:00 (Rebate -15%)" },
      { name: "Evening Peak", startHour: 18, endHour: 22, surchargePct: 20, label: "18:00 - 22:00 (Surcharge +20%)" },
      { name: "Normal Day", startHour: 6, endHour: 18, surchargePct: 0, label: "06:00 - 18:00 (Normal Tariff)" }
    ],

    captiveExemptions: {
      cssExempt: true,
      asExempt: true,
      rule3EquityMinPct: 26.0,
      rule3ConsumptionMinPct: 51.0
    },

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
    baseIndustrialTariff: 7.80, // TSSPDCL/TSNPDCL HT-I
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

    crossSubsidySurcharge: 1.98, // ₹/kWh for HT Industry (exempt for Captive)
    additionalSurcharge: 1.45, // ₹/kWh
    wheelingChargePerKWh: 0.36,
    transmissionChargePerKWh: 0.44, // TSTRANSCO transmission
    sldcFeesPerDay: 1500,
    electricityDutyPct: 6.0,
    bankingChargePct: 2.0,
    bankingType: "15-minute billing block",

    todSlabs: [
      { name: "Night Off-Peak", startHour: 22, endHour: 6, surchargePct: -15, label: "22:00 - 06:00 (Rebate -15%)" },
      { name: "Evening Peak", startHour: 18, endHour: 22, surchargePct: 20, label: "18:00 - 22:00 (Surcharge +20%)" },
      { name: "Normal Day", startHour: 6, endHour: 18, surchargePct: 0, label: "06:00 - 18:00 (Normal Tariff)" }
    ],

    captiveExemptions: {
      cssExempt: true,
      asExempt: true,
      rule3EquityMinPct: 26.0,
      rule3ConsumptionMinPct: 51.0
    },

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
    baseIndustrialTariff: 7.85, // APSPDCL/APEPDCL HT-I
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

    crossSubsidySurcharge: 2.05, // ₹/kWh for HT Industry (exempt for Captive)
    additionalSurcharge: 1.20, // ₹/kWh
    wheelingChargePerKWh: 0.38,
    transmissionChargePerKWh: 0.46, // APTRANSCO transmission
    sldcFeesPerDay: 1500,
    electricityDutyPct: 6.0,
    bankingChargePct: 2.0,
    bankingType: "Monthly TOD settlement",

    todSlabs: [
      { name: "Night Off-Peak", startHour: 22, endHour: 6, surchargePct: -15, label: "22:00 - 06:00 (Rebate -15%)" },
      { name: "Evening Peak", startHour: 18, endHour: 22, surchargePct: 20, label: "18:00 - 22:00 (Surcharge +20%)" },
      { name: "Normal Day", startHour: 6, endHour: 18, surchargePct: 0, label: "06:00 - 18:00 (Normal Tariff)" }
    ],

    captiveExemptions: {
      cssExempt: true,
      asExempt: true,
      rule3EquityMinPct: 26.0,
      rule3ConsumptionMinPct: 51.0
    },

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
