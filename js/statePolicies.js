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
  },

  madhyapradesh: {
    stateName: "Madhya Pradesh",
    regulator: "MPERC",
    sldcName: "MADHYA PRADESH LOAD DESPATCH CENTRE (MP SLDC, JABALPUR)",
    regulationName: "MPERC (Deviation Settlement Mechanism) Regulations & Open Access Terms",
    netMeteringCapKW: 1000,
    netMeteringCapPctSanctioned: 100,
    concurrentNetMeteringOA: false,
    btmZeroExportAllowed: true,
    rprMandatory: true,
    baseIndustrialTariff: 7.15,
    openAccessPpaRate: 3.55,
    dsmToleranceBandPct: 10.0,
    dsmReferenceRate: 3.25,
    penaltyTiers: [
      { minDeviationPct: 0, maxDeviationPct: 10.0, penaltyFactor: 0.0, label: "Band 1: Tolerance (±10%)" },
      { minDeviationPct: 10.0, maxDeviationPct: 20.0, penaltyFactor: 0.10, label: "Band 2: 10% - 20%" },
      { minDeviationPct: 20.0, maxDeviationPct: 999.0, penaltyFactor: 0.25, label: "Band 3: > 20%" }
    ],
    inadvertentExportPenaltyRate: 1.75,
    contractDemandExceedancePenaltyMultiplier: 1.5,
    crossSubsidySurcharge: 1.45,
    additionalSurcharge: 1.05,
    wheelingChargePerKWh: 0.35,
    transmissionChargePerKWh: 0.38,
    sldcFeesPerDay: 1100,
    electricityDutyPct: 8.5,
    bankingChargePct: 2.5,
    bankingType: "Monthly banking (2.5% loss)",
    todSlabs: [
      { name: "Night Off-Peak", startHour: 22, endHour: 6, surchargePct: -12 },
      { name: "Morning Peak", startHour: 6, endHour: 9, surchargePct: 10 },
      { name: "Day Normal", startHour: 9, endHour: 18, surchargePct: 0 },
      { name: "Evening Peak", startHour: 18, endHour: 22, surchargePct: 20 }
    ],
    captiveExemptions: { cssExempt: true, asExempt: true, rule3EquityMinPct: 26.0, rule3ConsumptionMinPct: 51.0 },
    transmissionLossesByVoltage: { "11": 6.50, "22": 5.60, "33": 4.20, "66": 3.50, "132": 3.00 },
    policyNotes: "MP has attractive solar policies with GUVNL solar park incentives."
  },

  punjab: {
    stateName: "Punjab",
    regulator: "PSERC",
    sldcName: "PUNJAB STATE LOAD DESPATCH CENTRE (PSLDC, PATIALA)",
    regulationName: "PSERC (Deviation Settlement) Regulations & OA Terms",
    netMeteringCapKW: 1000,
    netMeteringCapPctSanctioned: 100,
    concurrentNetMeteringOA: true,
    btmZeroExportAllowed: true,
    rprMandatory: false,
    baseIndustrialTariff: 7.45,
    openAccessPpaRate: 3.90,
    dsmToleranceBandPct: 12.0,
    dsmReferenceRate: 3.60,
    penaltyTiers: [
      { minDeviationPct: 0, maxDeviationPct: 12.0, penaltyFactor: 0.0, label: "Band 1: Tolerance (±12%)" },
      { minDeviationPct: 12.0, maxDeviationPct: 25.0, penaltyFactor: 0.15, label: "Band 2: 12% - 25%" },
      { minDeviationPct: 25.0, maxDeviationPct: 999.0, penaltyFactor: 0.30, label: "Band 3: > 25%" }
    ],
    inadvertentExportPenaltyRate: 2.00,
    contractDemandExceedancePenaltyMultiplier: 1.4,
    crossSubsidySurcharge: 1.85,
    additionalSurcharge: 1.30,
    wheelingChargePerKWh: 0.42,
    transmissionChargePerKWh: 0.48,
    sldcFeesPerDay: 1350,
    electricityDutyPct: 10.0,
    bankingChargePct: 3.0,
    bankingType: "Monthly banking with 3% deduction",
    todSlabs: [
      { name: "Night", startHour: 22, endHour: 6, surchargePct: -20 },
      { name: "Peak", startHour: 17, endHour: 22, surchargePct: 25 },
      { name: "Normal", startHour: 6, endHour: 17, surchargePct: 0 }
    ],
    captiveExemptions: { cssExempt: true, asExempt: true, rule3EquityMinPct: 26.0, rule3ConsumptionMinPct: 51.0 },
    transmissionLossesByVoltage: { "11": 5.80, "22": 5.00, "33": 3.90, "66": 3.20, "132": 2.85 },
    policyNotes: "PSERC allows concurrent Net Metering and Open Access."
  },

  westbengal: {
    stateName: "West Bengal",
    regulator: "WBERC",
    sldcName: "WEST BENGAL STATE LOAD DESPATCH CENTRE (WBSLDC, KOLKATA)",
    regulationName: "WBERC (Deviation Settlement) Regulations & OA Framework",
    netMeteringCapKW: 1000,
    netMeteringCapPctSanctioned: 100,
    concurrentNetMeteringOA: false,
    btmZeroExportAllowed: true,
    rprMandatory: true,
    baseIndustrialTariff: 7.65,
    openAccessPpaRate: 4.10,
    dsmToleranceBandPct: 10.0,
    dsmReferenceRate: 3.80,
    penaltyTiers: [
      { minDeviationPct: 0, maxDeviationPct: 10.0, penaltyFactor: 0.0 },
      { minDeviationPct: 10.0, maxDeviationPct: 20.0, penaltyFactor: 0.12 },
      { minDeviationPct: 20.0, maxDeviationPct: 999.0, penaltyFactor: 0.25 }
    ],
    inadvertentExportPenaltyRate: 1.80,
    contractDemandExceedancePenaltyMultiplier: 1.55,
    crossSubsidySurcharge: 2.10,
    additionalSurcharge: 1.40,
    wheelingChargePerKWh: 0.45,
    transmissionChargePerKWh: 0.52,
    sldcFeesPerDay: 1400,
    electricityDutyPct: 10.0,
    bankingChargePct: 2.5,
    bankingType: "Monthly banking (2.5% loss)",
    todSlabs: [
      { name: "Night", startHour: 22, endHour: 6, surchargePct: -15 },
      { name: "Morning Peak", startHour: 8, endHour: 12, surchargePct: 15 },
      { name: "Evening Peak", startHour: 18, endHour: 22, surchargePct: 22 }
    ],
    captiveExemptions: { cssExempt: true, asExempt: true, rule3EquityMinPct: 26.0, rule3ConsumptionMinPct: 51.0 },
    transmissionLossesByVoltage: { "11": 6.80, "22": 5.90, "33": 4.50, "66": 3.80, "132": 3.20 },
    policyNotes: "WBERC mandates RPR for BTM installations."
  },

  odisha: {
    stateName: "Odisha",
    regulator: "OERC",
    sldcName: "ODISHA STATE LOAD DESPATCH CENTRE (OSLDC, BHUBANESWAR)",
    regulationName: "OERC (Deviation Settlement Mechanism) Regulations",
    netMeteringCapKW: 1000,
    netMeteringCapPctSanctioned: 100,
    concurrentNetMeteringOA: true,
    btmZeroExportAllowed: true,
    rprMandatory: false,
    baseIndustrialTariff: 6.85,
    openAccessPpaRate: 3.45,
    dsmToleranceBandPct: 10.0,
    dsmReferenceRate: 3.15,
    penaltyTiers: [
      { minDeviationPct: 0, maxDeviationPct: 10.0, penaltyFactor: 0.0 },
      { minDeviationPct: 10.0, maxDeviationPct: 20.0, penaltyFactor: 0.10 },
      { minDeviationPct: 20.0, maxDeviationPct: 999.0, penaltyFactor: 0.22 }
    ],
    inadvertentExportPenaltyRate: 1.60,
    contractDemandExceedancePenaltyMultiplier: 1.45,
    crossSubsidySurcharge: 1.35,
    additionalSurcharge: 0.95,
    wheelingChargePerKWh: 0.28,
    transmissionChargePerKWh: 0.32,
    sldcFeesPerDay: 950,
    electricityDutyPct: 7.0,
    bankingChargePct: 1.5,
    bankingType: "Monthly banking (1.5% deduction)",
    todSlabs: [
      { name: "Night", startHour: 21, endHour: 6, surchargePct: -18 },
      { name: "Peak", startHour: 17, endHour: 21, surchargePct: 18 },
      { name: "Normal", startHour: 6, endHour: 17, surchargePct: 0 }
    ],
    captiveExemptions: { cssExempt: true, asExempt: true, rule3EquityMinPct: 26.0, rule3ConsumptionMinPct: 51.0 },
    transmissionLossesByVoltage: { "11": 7.20, "22": 6.30, "33": 4.80, "66": 4.00, "132": 3.50 },
    policyNotes: "Lowest OA charges in eastern India."
  },

  bihar: {
    stateName: "Bihar",
    regulator: "BERC",
    sldcName: "BIHAR STATE LOAD DESPATCH CENTRE (BSLDC, PATNA)",
    regulationName: "BERC (Deviation Settlement) Regulations & OA Framework",
    netMeteringCapKW: 1000,
    netMeteringCapPctSanctioned: 100,
    concurrentNetMeteringOA: false,
    btmZeroExportAllowed: true,
    rprMandatory: true,
    baseIndustrialTariff: 7.95,
    openAccessPpaRate: 4.25,
    dsmToleranceBandPct: 10.0,
    dsmReferenceRate: 3.95,
    penaltyTiers: [
      { minDeviationPct: 0, maxDeviationPct: 10.0, penaltyFactor: 0.0 },
      { minDeviationPct: 10.0, maxDeviationPct: 20.0, penaltyFactor: 0.15 },
      { minDeviationPct: 20.0, maxDeviationPct: 999.0, penaltyFactor: 0.30 }
    ],
    inadvertentExportPenaltyRate: 2.20,
    contractDemandExceedancePenaltyMultiplier: 1.6,
    crossSubsidySurcharge: 2.40,
    additionalSurcharge: 1.55,
    wheelingChargePerKWh: 0.52,
    transmissionChargePerKWh: 0.58,
    sldcFeesPerDay: 1600,
    electricityDutyPct: 12.0,
    bankingChargePct: 4.0,
    bankingType: "Monthly banking (4% loss)",
    todSlabs: [
      { name: "Night", startHour: 22, endHour: 6, surchargePct: -12 },
      { name: "Peak", startHour: 17, endHour: 22, surchargePct: 20 }
    ],
    captiveExemptions: { cssExempt: true, asExempt: true, rule3EquityMinPct: 26.0, rule3ConsumptionMinPct: 51.0 },
    transmissionLossesByVoltage: { "11": 8.50, "22": 7.40, "33": 5.60, "66": 4.80, "132": 4.20 },
    policyNotes: "Higher OA charges due to transmission losses."
  },

  jharkhand: {
    stateName: "Jharkhand",
    regulator: "JSERC",
    sldcName: "JHARKHAND STATE LOAD DESPATCH CENTRE (JSLDC, RANCHI)",
    regulationName: "JSERC (Deviation Settlement) Regulations",
    netMeteringCapKW: 1000,
    netMeteringCapPctSanctioned: 100,
    concurrentNetMeteringOA: false,
    btmZeroExportAllowed: true,
    rprMandatory: true,
    baseIndustrialTariff: 7.35,
    openAccessPpaRate: 3.75,
    dsmToleranceBandPct: 10.0,
    dsmReferenceRate: 3.45,
    penaltyTiers: [
      { minDeviationPct: 0, maxDeviationPct: 10.0, penaltyFactor: 0.0 },
      { minDeviationPct: 10.0, maxDeviationPct: 20.0, penaltyFactor: 0.12 },
      { minDeviationPct: 20.0, maxDeviationPct: 999.0, penaltyFactor: 0.25 }
    ],
    inadvertentExportPenaltyRate: 1.85,
    contractDemandExceedancePenaltyMultiplier: 1.5,
    crossSubsidySurcharge: 1.75,
    additionalSurcharge: 1.20,
    wheelingChargePerKWh: 0.40,
    transmissionChargePerKWh: 0.45,
    sldcFeesPerDay: 1250,
    electricityDutyPct: 9.0,
    bankingChargePct: 2.5,
    todSlabs: [
      { name: "Night", startHour: 22, endHour: 6, surchargePct: -15 },
      { name: "Peak", startHour: 18, endHour: 22, surchargePct: 18 },
      { name: "Normal", startHour: 6, endHour: 18, surchargePct: 0 }
    ],
    captiveExemptions: { cssExempt: true, asExempt: true, rule3EquityMinPct: 26.0, rule3ConsumptionMinPct: 51.0 },
    transmissionLossesByVoltage: { "11": 7.80, "22": 6.80, "33": 5.20, "66": 4.40, "132": 3.90 },
    policyNotes: "Emerging solar framework in mineral-rich industrial zones."
  },

  chhattisgarh: {
    stateName: "Chhattisgarh",
    regulator: "CSERC",
    sldcName: "CHHATTISGARH STATE LOAD DESPATCH CENTRE (CSLDC, RAIPUR)",
    regulationName: "CSERC (Deviation Settlement Mechanism) Regulations",
    netMeteringCapKW: 1000,
    netMeteringCapPctSanctioned: 100,
    concurrentNetMeteringOA: true,
    btmZeroExportAllowed: true,
    rprMandatory: false,
    baseIndustrialTariff: 7.05,
    openAccessPpaRate: 3.50,
    dsmToleranceBandPct: 10.0,
    dsmReferenceRate: 3.20,
    penaltyTiers: [
      { minDeviationPct: 0, maxDeviationPct: 10.0, penaltyFactor: 0.0 },
      { minDeviationPct: 10.0, maxDeviationPct: 20.0, penaltyFactor: 0.10 },
      { minDeviationPct: 20.0, maxDeviationPct: 999.0, penaltyFactor: 0.22 }
    ],
    inadvertentExportPenaltyRate: 1.65,
    contractDemandExceedancePenaltyMultiplier: 1.45,
    crossSubsidySurcharge: 1.40,
    additionalSurcharge: 0.90,
    wheelingChargePerKWh: 0.30,
    transmissionChargePerKWh: 0.35,
    sldcFeesPerDay: 1000,
    electricityDutyPct: 8.0,
    bankingChargePct: 2.0,
    todSlabs: [
      { name: "Night", startHour: 22, endHour: 6, surchargePct: -15 },
      { name: "Peak", startHour: 18, endHour: 22, surchargePct: 18 },
      { name: "Normal", startHour: 6, endHour: 18, surchargePct: 0 }
    ],
    captiveExemptions: { cssExempt: true, asExempt: true, rule3EquityMinPct: 26.0, rule3ConsumptionMinPct: 51.0 },
    transmissionLossesByVoltage: { "11": 6.40, "22": 5.50, "33": 4.15, "66": 3.45, "132": 3.00 },
    policyNotes: "Lowest industrial tariffs in central India."
  },

  uttarakhand: {
    stateName: "Uttarakhand",
    regulator: "UERC",
    sldcName: "UTTARAKHAND STATE LOAD DESPATCH CENTRE (USLDC, DEHRADUN)",
    regulationName: "UERC (Deviation Settlement) Regulations",
    netMeteringCapKW: 1000,
    netMeteringCapPctSanctioned: 100,
    concurrentNetMeteringOA: true,
    btmZeroExportAllowed: true,
    rprMandatory: false,
    baseIndustrialTariff: 7.25,
    openAccessPpaRate: 3.65,
    dsmToleranceBandPct: 10.0,
    dsmReferenceRate: 3.35,
    penaltyTiers: [
      { minDeviationPct: 0, maxDeviationPct: 10.0, penaltyFactor: 0.0 },
      { minDeviationPct: 10.0, maxDeviationPct: 20.0, penaltyFactor: 0.11 },
      { minDeviationPct: 20.0, maxDeviationPct: 999.0, penaltyFactor: 0.24 }
    ],
    inadvertentExportPenaltyRate: 1.70,
    contractDemandExceedancePenaltyMultiplier: 1.5,
    crossSubsidySurcharge: 1.55,
    additionalSurcharge: 1.00,
    wheelingChargePerKWh: 0.36,
    transmissionChargePerKWh: 0.40,
    sldcFeesPerDay: 1150,
    electricityDutyPct: 8.5,
    bankingChargePct: 2.5,
    todSlabs: [
      { name: "Night", startHour: 22, endHour: 6, surchargePct: -15 },
      { name: "Peak", startHour: 17, endHour: 21, surchargePct: 20 },
      { name: "Normal", startHour: 6, endHour: 17, surchargePct: 0 }
    ],
    captiveExemptions: { cssExempt: true, asExempt: true, rule3EquityMinPct: 26.0, rule3ConsumptionMinPct: 51.0 },
    transmissionLossesByVoltage: { "11": 6.10, "22": 5.30, "33": 4.00, "66": 3.30, "132": 2.90 },
    policyNotes: "Allows concurrent Net Metering + OA."
  },

  kerala: {
    stateName: "Kerala",
    regulator: "KSERC",
    sldcName: "KERALA STATE LOAD DESPATCH CENTRE (KSLDC, THIRUVANANTHAPURAM)",
    regulationName: "KSERC (Deviation Settlement) Regulations & OA Terms",
    netMeteringCapKW: 500,
    netMeteringCapPctSanctioned: 50,
    concurrentNetMeteringOA: false,
    btmZeroExportAllowed: true,
    rprMandatory: true,
    baseIndustrialTariff: 7.55,
    openAccessPpaRate: 4.00,
    dsmToleranceBandPct: 10.0,
    dsmReferenceRate: 3.70,
    penaltyTiers: [
      { minDeviationPct: 0, maxDeviationPct: 10.0, penaltyFactor: 0.0 },
      { minDeviationPct: 10.0, maxDeviationPct: 20.0, penaltyFactor: 0.13 },
      { minDeviationPct: 20.0, maxDeviationPct: 999.0, penaltyFactor: 0.26 }
    ],
    inadvertentExportPenaltyRate: 1.90,
    contractDemandExceedancePenaltyMultiplier: 1.55,
    crossSubsidySurcharge: 2.05,
    additionalSurcharge: 1.35,
    wheelingChargePerKWh: 0.48,
    transmissionChargePerKWh: 0.55,
    sldcFeesPerDay: 1450,
    electricityDutyPct: 11.0,
    bankingChargePct: 3.5,
    todSlabs: [
      { name: "Night", startHour: 22, endHour: 6, surchargePct: -18 },
      { name: "Morning Peak", startHour: 6, endHour: 10, surchargePct: 10 },
      { name: "Evening Peak", startHour: 17, endHour: 22, surchargePct: 25 }
    ],
    captiveExemptions: { cssExempt: true, asExempt: true, rule3EquityMinPct: 26.0, rule3ConsumptionMinPct: 51.0 },
    transmissionLossesByVoltage: { "11": 5.50, "22": 4.80, "33": 3.70, "66": 3.10, "110": 2.75 },
    policyNotes: "Lower net metering cap, requires RPR."
  },

  goa: {
    stateName: "Goa",
    regulator: "GSERC",
    sldcName: "GOA STATE LOAD DESPATCH CENTRE (GSLDC, PANAJI)",
    regulationName: "GSERC (Deviation Settlement) Regulations",
    netMeteringCapKW: 1000,
    netMeteringCapPctSanctioned: 100,
    concurrentNetMeteringOA: true,
    btmZeroExportAllowed: false,
    rprMandatory: false,
    baseIndustrialTariff: 7.40,
    openAccessPpaRate: 3.85,
    dsmToleranceBandPct: 12.0,
    dsmReferenceRate: 3.55,
    penaltyTiers: [
      { minDeviationPct: 0, maxDeviationPct: 12.0, penaltyFactor: 0.0 },
      { minDeviationPct: 12.0, maxDeviationPct: 24.0, penaltyFactor: 0.12 },
      { minDeviationPct: 24.0, maxDeviationPct: 999.0, penaltyFactor: 0.25 }
    ],
    inadvertentExportPenaltyRate: 1.75,
    contractDemandExceedancePenaltyMultiplier: 1.45,
    crossSubsidySurcharge: 1.60,
    additionalSurcharge: 1.10,
    wheelingChargePerKWh: 0.38,
    transmissionChargePerKWh: 0.42,
    sldcFeesPerDay: 1050,
    electricityDutyPct: 10.0,
    bankingChargePct: 2.0,
    todSlabs: [
      { name: "Night", startHour: 22, endHour: 6, surchargePct: -15 },
      { name: "Peak", startHour: 18, endHour: 22, surchargePct: 18 },
      { name: "Normal", startHour: 6, endHour: 18, surchargePct: 0 }
    ],
    captiveExemptions: { cssExempt: true, asExempt: true, rule3EquityMinPct: 26.0, rule3ConsumptionMinPct: 51.0 },
    transmissionLossesByVoltage: { "11": 5.20, "22": 4.50, "33": 3.40 },
    policyNotes: "Small market with wider 12% DSM tolerance band."
  },

  chandigarh: {
    stateName: "Chandigarh (UT)",
    regulator: "UTERC",
    sldcName: "CHANDIGARH LOAD DESPATCH CENTRE",
    regulationName: "UTERC (Deviation Settlement) Regulations",
    netMeteringCapKW: 1000,
    netMeteringCapPctSanctioned: 100,
    concurrentNetMeteringOA: true,
    btmZeroExportAllowed: true,
    rprMandatory: false,
    baseIndustrialTariff: 7.30,
    openAccessPpaRate: 3.70,
    dsmToleranceBandPct: 10.0,
    dsmReferenceRate: 3.40,
    penaltyTiers: [
      { minDeviationPct: 0, maxDeviationPct: 10.0, penaltyFactor: 0.0 },
      { minDeviationPct: 10.0, maxDeviationPct: 20.0, penaltyFactor: 0.12 },
      { minDeviationPct: 20.0, maxDeviationPct: 999.0, penaltyFactor: 0.25 }
    ],
    inadvertentExportPenaltyRate: 1.75,
    contractDemandExceedancePenaltyMultiplier: 1.5,
    crossSubsidySurcharge: 1.50,
    additionalSurcharge: 1.00,
    wheelingChargePerKWh: 0.35,
    transmissionChargePerKWh: 0.38,
    sldcFeesPerDay: 1000,
    electricityDutyPct: 8.0,
    bankingChargePct: 2.0,
    todSlabs: [
      { name: "Night", startHour: 22, endHour: 6, surchargePct: -15 },
      { name: "Peak", startHour: 17, endHour: 22, surchargePct: 18 },
      { name: "Normal", startHour: 6, endHour: 17, surchargePct: 0 }
    ],
    captiveExemptions: { cssExempt: true, asExempt: true, rule3EquityMinPct: 26.0, rule3ConsumptionMinPct: 51.0 },
    transmissionLossesByVoltage: { "11": 5.00, "22": 4.30, "33": 3.20 },
    policyNotes: "Union Territory with pro-solar policies."
  }
};

// Export to window
if (typeof window !== "undefined") {
  window.STATE_POLICIES = STATE_POLICIES;
}
