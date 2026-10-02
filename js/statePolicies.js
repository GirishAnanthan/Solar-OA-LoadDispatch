/**
 * State Solar Open Access & Regulatory Policy Parameters for India
 * Covers 36 Indian States and Union Territories with institutional SERC/JERC data.
 */

const STATE_POLICIES = {
  "maharashtra": {
    "stateName": "Maharashtra",
    "regulator": "MERC",
    "sldcName": "MAHARASHTRA STATE LOAD DESPATCH CENTRE (MSLDC, KALWA / AIROLI)",
    "regulationName": "MERC (Forecasting, Scheduling & DSM) Regulations & GEOA Orders",
    "netMeteringCapKW": 1000,
    "netMeteringCapPctSanctioned": 100,
    "concurrentNetMeteringOA": false,
    "btmZeroExportAllowed": true,
    "rprMandatory": true,
    "baseIndustrialTariff": 7.85,
    "openAccessPpaRate": 3.8,
    "dsmToleranceBandPct": 10,
    "dsmReferenceRate": 3.5,
    "penaltyTiers": [
      {
        "minDeviationPct": 0,
        "maxDeviationPct": 10,
        "penaltyFactor": 0,
        "label": "Band 1: Free Tolerance (±10%)"
      },
      {
        "minDeviationPct": 10,
        "maxDeviationPct": 20,
        "penaltyFactor": 0.1,
        "label": "Band 2: 10% - 20% (10% Surcharge on APPC)"
      },
      {
        "minDeviationPct": 20,
        "maxDeviationPct": 30,
        "penaltyFactor": 0.2,
        "label": "Band 3: 20% - 30% (20% Surcharge on APPC)"
      },
      {
        "minDeviationPct": 30,
        "maxDeviationPct": 999,
        "penaltyFactor": 0.4,
        "label": "Band 4: > 30% (40% Surcharge + Peak Penalty)"
      }
    ],
    "inadvertentExportPenaltyRate": 1.5,
    "contractDemandExceedancePenaltyMultiplier": 1.5,
    "crossSubsidySurcharge": 1.64,
    "additionalSurcharge": 1.25,
    "wheelingChargePerKWh": 0.38,
    "transmissionChargePerKWh": 0.44,
    "sldcFeesPerDay": 1500,
    "electricityDutyPct": 9.3,
    "bankingChargePct": 2,
    "bankingType": "Monthly banking (Cap at 30% of total consumption, lapses at FY end)",
    "todSlabs": [
      {
        "name": "Night Off-Peak",
        "startHour": 22,
        "endHour": 6,
        "surchargePct": -15,
        "label": "22:00 - 06:00 (Rebate ₹-1.50/kWh)"
      },
      {
        "name": "Morning Peak",
        "startHour": 9,
        "endHour": 12,
        "surchargePct": 15,
        "label": "09:00 - 12:00 (Surcharge +₹1.18/kWh)"
      },
      {
        "name": "Evening Peak",
        "startHour": 18,
        "endHour": 22,
        "surchargePct": 25,
        "label": "18:00 - 22:00 (Surcharge +₹1.96/kWh)"
      },
      {
        "name": "Normal Day",
        "startHour": 6,
        "endHour": 9,
        "surchargePct": 0,
        "label": "06:00 - 09:00 (Normal Tariff)"
      },
      {
        "name": "Normal Afternoon",
        "startHour": 12,
        "endHour": 18,
        "surchargePct": 0,
        "label": "12:00 - 18:00 (Normal Tariff)"
      }
    ],
    "captiveExemptions": {
      "cssExempt": true,
      "asExempt": true,
      "rule3EquityMinPct": 26,
      "rule3ConsumptionMinPct": 51
    },
    "transmissionLossesByVoltage": {
      "11": 6.2,
      "22": 5.4,
      "33": 4.1,
      "66": 3.4,
      "110": 3,
      "132": 2.8
    },
    "policyNotes": "MERC restricts concurrent Net-Metering and Open Access on the same connection. Converting Rooftop Solar to BTM with Zero Export (using Class 0.2s RPR) enables full self-consumption while Captive Solar supplies the remaining demand with zero CSS."
  },
  "gujarat": {
    "stateName": "Gujarat",
    "regulator": "GERC",
    "sldcName": "GUJARAT ENERGY TRANSMISSION CORP. LTD. (SLDC, GOTRI, VADODARA)",
    "regulationName": "GERC (Forecasting, Scheduling and Deviation Settlement) Regulations",
    "netMeteringCapKW": 1000,
    "netMeteringCapPctSanctioned": 50,
    "concurrentNetMeteringOA": false,
    "btmZeroExportAllowed": true,
    "rprMandatory": true,
    "baseIndustrialTariff": 7.2,
    "openAccessPpaRate": 3.65,
    "dsmToleranceBandPct": 10,
    "dsmReferenceRate": 3.35,
    "penaltyTiers": [
      {
        "minDeviationPct": 0,
        "maxDeviationPct": 10,
        "penaltyFactor": 0,
        "label": "Band 1: Tolerance (±10%)"
      },
      {
        "minDeviationPct": 10,
        "maxDeviationPct": 20,
        "penaltyFactor": 0.12,
        "label": "Band 2: 10% - 20% (12% Surcharge)"
      },
      {
        "minDeviationPct": 20,
        "maxDeviationPct": 30,
        "penaltyFactor": 0.25,
        "label": "Band 3: 20% - 30% (25% Surcharge)"
      },
      {
        "minDeviationPct": 30,
        "maxDeviationPct": 999,
        "penaltyFactor": 0.5,
        "label": "Band 4: > 30% (50% Surcharge)"
      }
    ],
    "inadvertentExportPenaltyRate": 2,
    "contractDemandExceedancePenaltyMultiplier": 1.6,
    "crossSubsidySurcharge": 1.95,
    "additionalSurcharge": 1.1,
    "wheelingChargePerKWh": 0.32,
    "transmissionChargePerKWh": 0.4,
    "sldcFeesPerDay": 1200,
    "electricityDutyPct": 15,
    "bankingChargePct": 0,
    "bankingType": "15-minute time block TOD settlement (No seasonal banking permitted)",
    "todSlabs": [
      {
        "name": "Night Off-Peak",
        "startHour": 22,
        "endHour": 6,
        "surchargePct": -12,
        "label": "22:00 - 06:00 (Rebate ₹-0.85/kWh)"
      },
      {
        "name": "Morning Peak",
        "startHour": 7,
        "endHour": 11,
        "surchargePct": 18,
        "label": "07:00 - 11:00 (Surcharge +₹1.30/kWh)"
      },
      {
        "name": "Evening Peak",
        "startHour": 18,
        "endHour": 22,
        "surchargePct": 20,
        "label": "18:00 - 22:00 (Surcharge +₹1.44/kWh)"
      },
      {
        "name": "Normal Day",
        "startHour": 6,
        "endHour": 7,
        "surchargePct": 0,
        "label": "06:00 - 07:00 (Normal Tariff)"
      },
      {
        "name": "Normal Afternoon",
        "startHour": 11,
        "endHour": 18,
        "surchargePct": 0,
        "label": "11:00 - 18:00 (Normal Tariff)"
      }
    ],
    "captiveExemptions": {
      "cssExempt": true,
      "asExempt": true,
      "rule3EquityMinPct": 26,
      "rule3ConsumptionMinPct": 51
    },
    "transmissionLossesByVoltage": {
      "11": 5.9,
      "22": 5.1,
      "33": 3.85,
      "66": 3.2,
      "110": 2.9,
      "132": 2.65
    },
    "policyNotes": "Under Gujarat Solar Policy, dual benefit of Net Metering and Open Access on a single consumer meter is prohibited. BTM zero-export conversion requires DISCOM non-export certification."
  },
  "karnataka": {
    "stateName": "Karnataka",
    "regulator": "KERC",
    "sldcName": "KARNATAKA POWER TRANSMISSION CORP. LTD. (SLDC, RACE COURSE RD, BENGALURU)",
    "regulationName": "KERC (Forecasting, Scheduling, DSM for RE Sources) Regulations",
    "netMeteringCapKW": 500,
    "netMeteringCapPctSanctioned": 80,
    "concurrentNetMeteringOA": false,
    "btmZeroExportAllowed": true,
    "rprMandatory": true,
    "baseIndustrialTariff": 7.45,
    "openAccessPpaRate": 3.75,
    "dsmToleranceBandPct": 10,
    "dsmReferenceRate": 3.4,
    "penaltyTiers": [
      {
        "minDeviationPct": 0,
        "maxDeviationPct": 10,
        "penaltyFactor": 0,
        "label": "Band 1: Free Tolerance (±10%)"
      },
      {
        "minDeviationPct": 10,
        "maxDeviationPct": 20,
        "penaltyFactor": 0.1,
        "label": "Band 2: 10% - 20% (10% DSM Charge)"
      },
      {
        "minDeviationPct": 20,
        "maxDeviationPct": 30,
        "penaltyFactor": 0.2,
        "label": "Band 3: 20% - 30% (20% DSM Charge)"
      },
      {
        "minDeviationPct": 30,
        "maxDeviationPct": 999,
        "penaltyFactor": 0.4,
        "label": "Band 4: > 30% (40% DSM Charge)"
      }
    ],
    "inadvertentExportPenaltyRate": 1.8,
    "contractDemandExceedancePenaltyMultiplier": 1.5,
    "crossSubsidySurcharge": 2.15,
    "additionalSurcharge": 1.35,
    "wheelingChargePerKWh": 0.42,
    "transmissionChargePerKWh": 0.48,
    "sldcFeesPerDay": 1800,
    "electricityDutyPct": 9,
    "bankingChargePct": 8.5,
    "bankingType": "15-minute / Monthly banking (Banking charges 8.5% in kind, no peak withdrawal)",
    "todSlabs": [
      {
        "name": "Night Off-Peak",
        "startHour": 22,
        "endHour": 6,
        "surchargePct": -15,
        "label": "22:00 - 06:00 (Rebate ₹-1.12/kWh)"
      },
      {
        "name": "Evening Peak",
        "startHour": 18,
        "endHour": 22,
        "surchargePct": 25,
        "label": "18:00 - 22:00 (Surcharge +₹1.86/kWh)"
      },
      {
        "name": "Normal Day",
        "startHour": 6,
        "endHour": 18,
        "surchargePct": 0,
        "label": "06:00 - 18:00 (Normal Tariff)"
      }
    ],
    "captiveExemptions": {
      "cssExempt": true,
      "asExempt": true,
      "rule3EquityMinPct": 26,
      "rule3ConsumptionMinPct": 51
    },
    "transmissionLossesByVoltage": {
      "11": 6.1,
      "22": 5.25,
      "33": 4,
      "66": 3.35,
      "110": 2.95,
      "132": 2.7
    },
    "policyNotes": "Karnataka limits rooftop net metering to 500 kW. C&I consumers transitioning to Captive Open Access solar must isolate rooftop solar behind the meter to prevent conflicts with KPTCL SLDC scheduling."
  },
  "tamilnadu": {
    "stateName": "Tamil Nadu",
    "regulator": "TNERC",
    "sldcName": "STATE LOAD DESPATCH CENTRE, TANTRANSCO (CHENNAI / MADURAI)",
    "regulationName": "TNERC (Forecasting, Scheduling & DSM) and Grid Interactive Solar PV",
    "netMeteringCapKW": 1000,
    "netMeteringCapPctSanctioned": 100,
    "concurrentNetMeteringOA": false,
    "btmZeroExportAllowed": true,
    "rprMandatory": true,
    "baseIndustrialTariff": 8.35,
    "openAccessPpaRate": 3.9,
    "dsmToleranceBandPct": 10,
    "dsmReferenceRate": 3.6,
    "penaltyTiers": [
      {
        "minDeviationPct": 0,
        "maxDeviationPct": 10,
        "penaltyFactor": 0,
        "label": "Band 1: Free Tolerance (±10%)"
      },
      {
        "minDeviationPct": 10,
        "maxDeviationPct": 20,
        "penaltyFactor": 0.15,
        "label": "Band 2: 10% - 20% (15% Surcharge)"
      },
      {
        "minDeviationPct": 20,
        "maxDeviationPct": 30,
        "penaltyFactor": 0.3,
        "label": "Band 3: 20% - 30% (30% Surcharge)"
      },
      {
        "minDeviationPct": 30,
        "maxDeviationPct": 999,
        "penaltyFactor": 0.5,
        "label": "Band 4: > 30% (50% Surcharge)"
      }
    ],
    "inadvertentExportPenaltyRate": 2.2,
    "contractDemandExceedancePenaltyMultiplier": 1.75,
    "crossSubsidySurcharge": 2.28,
    "additionalSurcharge": 1.15,
    "wheelingChargePerKWh": 0.4,
    "transmissionChargePerKWh": 0.52,
    "sldcFeesPerDay": 2000,
    "electricityDutyPct": 5,
    "bankingChargePct": 14,
    "bankingType": "Slot-to-slot TOD settlement (Peak/Off-Peak/Normal, 14% in-kind banking charge)",
    "todSlabs": [
      {
        "name": "Morning Peak",
        "startHour": 6,
        "endHour": 9,
        "surchargePct": 20,
        "label": "06:00 - 09:00 (Peak +20%)"
      },
      {
        "name": "Evening Peak",
        "startHour": 18,
        "endHour": 22,
        "surchargePct": 25,
        "label": "18:00 - 22:00 (Peak +25%)"
      },
      {
        "name": "Night Off-Peak",
        "startHour": 22,
        "endHour": 6,
        "surchargePct": -10,
        "label": "22:00 - 06:00 (Rebate -10%)"
      },
      {
        "name": "Normal Day",
        "startHour": 9,
        "endHour": 18,
        "surchargePct": 0,
        "label": "09:00 - 18:00 (Normal Tariff)"
      }
    ],
    "captiveExemptions": {
      "cssExempt": true,
      "asExempt": true,
      "rule3EquityMinPct": 26,
      "rule3ConsumptionMinPct": 51
    },
    "transmissionLossesByVoltage": {
      "11": 6.4,
      "22": 5.6,
      "33": 4.25,
      "66": 3.5,
      "110": 3.1,
      "132": 2.85
    },
    "policyNotes": "TANGEDCO has high TOD peak surcharges (20-25%). Dual settlement (Net Metering + OA) is strictly rejected by TANGEDCO. BTM Zero Export provides 100% daytime load peak shaving without risking grid feed-in charges."
  },
  "rajasthan": {
    "stateName": "Rajasthan",
    "regulator": "RERC",
    "sldcName": "RAJASTHAN RAJYA VIDYUT PRASARAN NIGAM LTD. (SLDC, HEERAPURA, JAIPUR)",
    "regulationName": "RERC (Forecasting, Scheduling and Deviation Settlement) Regulations",
    "netMeteringCapKW": 1000,
    "netMeteringCapPctSanctioned": 100,
    "concurrentNetMeteringOA": false,
    "btmZeroExportAllowed": true,
    "rprMandatory": true,
    "baseIndustrialTariff": 7.9,
    "openAccessPpaRate": 3.55,
    "dsmToleranceBandPct": 15,
    "dsmReferenceRate": 3.25,
    "penaltyTiers": [
      {
        "minDeviationPct": 0,
        "maxDeviationPct": 15,
        "penaltyFactor": 0,
        "label": "Band 1: Free Tolerance (±15%)"
      },
      {
        "minDeviationPct": 15,
        "maxDeviationPct": 25,
        "penaltyFactor": 0.1,
        "label": "Band 2: 15% - 25% (10% Surcharge)"
      },
      {
        "minDeviationPct": 25,
        "maxDeviationPct": 35,
        "penaltyFactor": 0.2,
        "label": "Band 3: 25% - 35% (20% Surcharge)"
      },
      {
        "minDeviationPct": 35,
        "maxDeviationPct": 999,
        "penaltyFactor": 0.35,
        "label": "Band 4: > 35% (35% Surcharge)"
      }
    ],
    "inadvertentExportPenaltyRate": 1.4,
    "contractDemandExceedancePenaltyMultiplier": 1.5,
    "crossSubsidySurcharge": 1.82,
    "additionalSurcharge": 0.8,
    "wheelingChargePerKWh": 0.28,
    "transmissionChargePerKWh": 0.38,
    "sldcFeesPerDay": 1100,
    "electricityDutyPct": 8,
    "bankingChargePct": 0,
    "bankingType": "15-minute billing block (Unutilized solar energy settled at APPC)",
    "todSlabs": [
      {
        "name": "Night Off-Peak",
        "startHour": 23,
        "endHour": 6,
        "surchargePct": -15,
        "label": "23:00 - 06:00 (Rebate -15%)"
      },
      {
        "name": "Evening Peak",
        "startHour": 18,
        "endHour": 23,
        "surchargePct": 20,
        "label": "18:00 - 23:00 (Surcharge +20%)"
      },
      {
        "name": "Normal Day",
        "startHour": 6,
        "endHour": 18,
        "surchargePct": 0,
        "label": "06:00 - 18:00 (Normal Tariff)"
      }
    ],
    "captiveExemptions": {
      "cssExempt": true,
      "asExempt": true,
      "rule3EquityMinPct": 26,
      "rule3ConsumptionMinPct": 51
    },
    "transmissionLossesByVoltage": {
      "11": 5.8,
      "22": 5,
      "33": 3.75,
      "66": 3.15,
      "110": 2.8,
      "132": 2.5
    },
    "policyNotes": "RERC allows wide ±15% band for solar dispatch. Large solar parks in Bikaner and Jodhpur feed OA consumers, but local factory rooftop solar must not back-feed if OA is scheduled simultaneously."
  },
  "uttarpradesh": {
    "stateName": "Uttar Pradesh",
    "regulator": "UPERC",
    "sldcName": "UP POWER TRANSMISSION CORP. LTD. (SLDC, SHAKTI BHAWAN, LUCKNOW)",
    "regulationName": "UPERC (Captive and Renewable Energy Generating Plants) Regulations",
    "netMeteringCapKW": 10,
    "netMeteringCapPctSanctioned": 100,
    "concurrentNetMeteringOA": false,
    "btmZeroExportAllowed": true,
    "rprMandatory": true,
    "baseIndustrialTariff": 8.15,
    "openAccessPpaRate": 3.85,
    "dsmToleranceBandPct": 12,
    "dsmReferenceRate": 3.45,
    "penaltyTiers": [
      {
        "minDeviationPct": 0,
        "maxDeviationPct": 12,
        "penaltyFactor": 0,
        "label": "Band 1: Free Tolerance (±12%)"
      },
      {
        "minDeviationPct": 12,
        "maxDeviationPct": 20,
        "penaltyFactor": 0.12,
        "label": "Band 2: 12% - 20% (12% Surcharge)"
      },
      {
        "minDeviationPct": 20,
        "maxDeviationPct": 30,
        "penaltyFactor": 0.25,
        "label": "Band 3: 20% - 30% (25% Surcharge)"
      },
      {
        "minDeviationPct": 30,
        "maxDeviationPct": 999,
        "penaltyFactor": 0.45,
        "label": "Band 4: > 30% (45% Surcharge)"
      }
    ],
    "inadvertentExportPenaltyRate": 1.9,
    "contractDemandExceedancePenaltyMultiplier": 1.6,
    "crossSubsidySurcharge": 2.1,
    "additionalSurcharge": 1.05,
    "wheelingChargePerKWh": 0.45,
    "transmissionChargePerKWh": 0.48,
    "sldcFeesPerDay": 1600,
    "electricityDutyPct": 7.5,
    "bankingChargePct": 2.5,
    "bankingType": "15-minute / Monthly banking (Unbanked energy lapses at month end)",
    "todSlabs": [
      {
        "name": "Night Off-Peak",
        "startHour": 22,
        "endHour": 6,
        "surchargePct": -15,
        "label": "22:00 - 06:00 (Rebate -15%)"
      },
      {
        "name": "Evening Peak",
        "startHour": 17,
        "endHour": 22,
        "surchargePct": 20,
        "label": "17:00 - 22:00 (Surcharge +20%)"
      },
      {
        "name": "Normal Day",
        "startHour": 6,
        "endHour": 17,
        "surchargePct": 0,
        "label": "06:00 - 17:00 (Normal Tariff)"
      }
    ],
    "captiveExemptions": {
      "cssExempt": true,
      "asExempt": true,
      "rule3EquityMinPct": 26,
      "rule3ConsumptionMinPct": 51
    },
    "transmissionLossesByVoltage": {
      "11": 6.5,
      "22": 5.7,
      "33": 4.3,
      "66": 3.6,
      "110": 3.2,
      "132": 2.9
    },
    "policyNotes": "UPERC restricts C&I Net-Metering almost completely, compelling industrial consumers to install Behind-The-Meter Zero-Export systems or procure power via Open Access. Zero-export compliance is strictly audited."
  },
  "haryana": {
    "stateName": "Haryana",
    "regulator": "HERC",
    "sldcName": "HVPNL STATE LOAD DESPATCH CENTRE (SEWAH, PANIPAT)",
    "regulationName": "HERC (Forecasting, Scheduling & Deviation Settlement) Regulations",
    "netMeteringCapKW": 500,
    "netMeteringCapPctSanctioned": 85,
    "concurrentNetMeteringOA": false,
    "btmZeroExportAllowed": true,
    "rprMandatory": true,
    "baseIndustrialTariff": 7.7,
    "openAccessPpaRate": 3.7,
    "dsmToleranceBandPct": 12,
    "dsmReferenceRate": 3.4,
    "penaltyTiers": [
      {
        "minDeviationPct": 0,
        "maxDeviationPct": 12,
        "penaltyFactor": 0,
        "label": "Band 1: Free Tolerance (±12%)"
      },
      {
        "minDeviationPct": 12,
        "maxDeviationPct": 22,
        "penaltyFactor": 0.1,
        "label": "Band 2: 12% - 22% (10% Surcharge)"
      },
      {
        "minDeviationPct": 22,
        "maxDeviationPct": 32,
        "penaltyFactor": 0.2,
        "label": "Band 3: 22% - 32% (20% Surcharge)"
      },
      {
        "minDeviationPct": 32,
        "maxDeviationPct": 999,
        "penaltyFactor": 0.4,
        "label": "Band 4: > 32% (40% Surcharge)"
      }
    ],
    "inadvertentExportPenaltyRate": 1.7,
    "contractDemandExceedancePenaltyMultiplier": 1.5,
    "crossSubsidySurcharge": 1.74,
    "additionalSurcharge": 1.12,
    "wheelingChargePerKWh": 0.35,
    "transmissionChargePerKWh": 0.42,
    "sldcFeesPerDay": 1400,
    "electricityDutyPct": 9,
    "bankingChargePct": 2,
    "bankingType": "Monthly banking with withdrawal restrictions during peak hours",
    "todSlabs": [
      {
        "name": "Night Off-Peak",
        "startHour": 22,
        "endHour": 6,
        "surchargePct": -15,
        "label": "22:00 - 06:00 (Rebate -15%)"
      },
      {
        "name": "Evening Peak",
        "startHour": 18,
        "endHour": 22,
        "surchargePct": 20,
        "label": "18:00 - 22:00 (Surcharge +20%)"
      },
      {
        "name": "Normal Day",
        "startHour": 6,
        "endHour": 18,
        "surchargePct": 0,
        "label": "06:00 - 18:00 (Normal Tariff)"
      }
    ],
    "captiveExemptions": {
      "cssExempt": true,
      "asExempt": true,
      "rule3EquityMinPct": 26,
      "rule3ConsumptionMinPct": 51
    },
    "transmissionLossesByVoltage": {
      "11": 6.3,
      "22": 5.5,
      "33": 4.15,
      "66": 3.45,
      "110": 3.05,
      "132": 2.8
    },
    "policyNotes": "HERC mandates that consumers operating captive/open access must not cause under-drawl that destabilizes the 66/33kV sub-transmission network. BTM Zero Export provides guaranteed stability."
  },
  "telangana": {
    "stateName": "Telangana",
    "regulator": "TSERC",
    "sldcName": "TSTRANSCO STATE LOAD DESPATCH CENTRE (VIDYUT SOUDHA, HYDERABAD)",
    "regulationName": "TSERC (Forecasting, Scheduling & Deviation Settlement) Regulations",
    "netMeteringCapKW": 1000,
    "netMeteringCapPctSanctioned": 100,
    "concurrentNetMeteringOA": false,
    "btmZeroExportAllowed": true,
    "rprMandatory": true,
    "baseIndustrialTariff": 7.8,
    "openAccessPpaRate": 3.75,
    "dsmToleranceBandPct": 12,
    "dsmReferenceRate": 3.4,
    "penaltyTiers": [
      {
        "minDeviationPct": 0,
        "maxDeviationPct": 12,
        "penaltyFactor": 0,
        "label": "Band 1: Tolerance (±12%)"
      },
      {
        "minDeviationPct": 12,
        "maxDeviationPct": 22,
        "penaltyFactor": 0.12,
        "label": "Band 2: 12% - 22% (12% Surcharge)"
      },
      {
        "minDeviationPct": 22,
        "maxDeviationPct": 32,
        "penaltyFactor": 0.25,
        "label": "Band 3: 22% - 32% (25% Surcharge)"
      },
      {
        "minDeviationPct": 32,
        "maxDeviationPct": 999,
        "penaltyFactor": 0.45,
        "label": "Band 4: > 32% (45% Surcharge)"
      }
    ],
    "inadvertentExportPenaltyRate": 1.85,
    "contractDemandExceedancePenaltyMultiplier": 1.6,
    "crossSubsidySurcharge": 1.98,
    "additionalSurcharge": 1.45,
    "wheelingChargePerKWh": 0.36,
    "transmissionChargePerKWh": 0.44,
    "sldcFeesPerDay": 1500,
    "electricityDutyPct": 6,
    "bankingChargePct": 2,
    "bankingType": "15-minute billing block",
    "todSlabs": [
      {
        "name": "Night Off-Peak",
        "startHour": 22,
        "endHour": 6,
        "surchargePct": -15,
        "label": "22:00 - 06:00 (Rebate -15%)"
      },
      {
        "name": "Evening Peak",
        "startHour": 18,
        "endHour": 22,
        "surchargePct": 20,
        "label": "18:00 - 22:00 (Surcharge +20%)"
      },
      {
        "name": "Normal Day",
        "startHour": 6,
        "endHour": 18,
        "surchargePct": 0,
        "label": "06:00 - 18:00 (Normal Tariff)"
      }
    ],
    "captiveExemptions": {
      "cssExempt": true,
      "asExempt": true,
      "rule3EquityMinPct": 26,
      "rule3ConsumptionMinPct": 51
    },
    "transmissionLossesByVoltage": {
      "11": 6.25,
      "22": 5.45,
      "33": 4.1,
      "66": 3.4,
      "110": 3,
      "132": 2.75
    },
    "policyNotes": "TSERC rules mandate non-export certifications for rooftop installations when Open Access is availed at 11kV or 33kV to preserve TSSPDCL distribution feeder stability."
  },
  "andhrapradesh": {
    "stateName": "Andhra Pradesh",
    "regulator": "APERC",
    "sldcName": "APTRANSCO STATE LOAD DESPATCH CENTRE (VIDYUT SOUDHA, VIJAYAWADA)",
    "regulationName": "APERC (Forecasting, Scheduling & Deviation Settlement) Regulations",
    "netMeteringCapKW": 1000,
    "netMeteringCapPctSanctioned": 100,
    "concurrentNetMeteringOA": false,
    "btmZeroExportAllowed": true,
    "rprMandatory": true,
    "baseIndustrialTariff": 7.85,
    "openAccessPpaRate": 3.7,
    "dsmToleranceBandPct": 12,
    "dsmReferenceRate": 3.35,
    "penaltyTiers": [
      {
        "minDeviationPct": 0,
        "maxDeviationPct": 12,
        "penaltyFactor": 0,
        "label": "Band 1: Tolerance (±12%)"
      },
      {
        "minDeviationPct": 12,
        "maxDeviationPct": 20,
        "penaltyFactor": 0.1,
        "label": "Band 2: 12% - 20% (10% Surcharge)"
      },
      {
        "minDeviationPct": 20,
        "maxDeviationPct": 30,
        "penaltyFactor": 0.2,
        "label": "Band 3: 20% - 30% (20% Surcharge)"
      },
      {
        "minDeviationPct": 30,
        "maxDeviationPct": 999,
        "penaltyFactor": 0.4,
        "label": "Band 4: > 30% (40% Surcharge)"
      }
    ],
    "inadvertentExportPenaltyRate": 1.8,
    "contractDemandExceedancePenaltyMultiplier": 1.55,
    "crossSubsidySurcharge": 2.05,
    "additionalSurcharge": 1.2,
    "wheelingChargePerKWh": 0.38,
    "transmissionChargePerKWh": 0.46,
    "sldcFeesPerDay": 1500,
    "electricityDutyPct": 6,
    "bankingChargePct": 2,
    "bankingType": "Monthly TOD settlement",
    "todSlabs": [
      {
        "name": "Night Off-Peak",
        "startHour": 22,
        "endHour": 6,
        "surchargePct": -15,
        "label": "22:00 - 06:00 (Rebate -15%)"
      },
      {
        "name": "Evening Peak",
        "startHour": 18,
        "endHour": 22,
        "surchargePct": 20,
        "label": "18:00 - 22:00 (Surcharge +20%)"
      },
      {
        "name": "Normal Day",
        "startHour": 6,
        "endHour": 18,
        "surchargePct": 0,
        "label": "06:00 - 18:00 (Normal Tariff)"
      }
    ],
    "captiveExemptions": {
      "cssExempt": true,
      "asExempt": true,
      "rule3EquityMinPct": 26,
      "rule3ConsumptionMinPct": 51
    },
    "transmissionLossesByVoltage": {
      "11": 6.2,
      "22": 5.4,
      "33": 4.05,
      "66": 3.35,
      "110": 2.95,
      "132": 2.7
    },
    "policyNotes": "APTRANSCO requires high-resolution 15-minute AMR (Automated Meter Reading) data. Unscheduled power injection into the AP grid is settled at zero tariff plus penal charges."
  },
  "madhyapradesh": {
    "stateName": "Madhya Pradesh",
    "regulator": "MPERC",
    "sldcName": "MADHYA PRADESH LOAD DESPATCH CENTRE (MP SLDC, JABALPUR)",
    "regulationName": "MPERC (Deviation Settlement Mechanism) Regulations & Open Access Terms",
    "netMeteringCapKW": 1000,
    "netMeteringCapPctSanctioned": 100,
    "concurrentNetMeteringOA": false,
    "btmZeroExportAllowed": true,
    "rprMandatory": true,
    "baseIndustrialTariff": 7.15,
    "openAccessPpaRate": 3.55,
    "dsmToleranceBandPct": 10,
    "dsmReferenceRate": 3.25,
    "penaltyTiers": [
      {
        "minDeviationPct": 0,
        "maxDeviationPct": 10,
        "penaltyFactor": 0,
        "label": "Band 1: Tolerance (±10%)"
      },
      {
        "minDeviationPct": 10,
        "maxDeviationPct": 20,
        "penaltyFactor": 0.1,
        "label": "Band 2: 10% - 20%"
      },
      {
        "minDeviationPct": 20,
        "maxDeviationPct": 999,
        "penaltyFactor": 0.25,
        "label": "Band 3: > 20%"
      }
    ],
    "inadvertentExportPenaltyRate": 1.75,
    "contractDemandExceedancePenaltyMultiplier": 1.5,
    "crossSubsidySurcharge": 1.45,
    "additionalSurcharge": 1.05,
    "wheelingChargePerKWh": 0.35,
    "transmissionChargePerKWh": 0.38,
    "sldcFeesPerDay": 1100,
    "electricityDutyPct": 8.5,
    "bankingChargePct": 2.5,
    "bankingType": "Monthly banking (2.5% loss)",
    "todSlabs": [
      {
        "name": "Night Off-Peak",
        "startHour": 22,
        "endHour": 6,
        "surchargePct": -12,
        "label": "22:00 - 06:00 (-12% Off-Peak Rebate)"
      },
      {
        "name": "Morning Peak",
        "startHour": 6,
        "endHour": 9,
        "surchargePct": 10,
        "label": "06:00 - 09:00 (+10% Peak Surcharge)"
      },
      {
        "name": "Day Normal",
        "startHour": 9,
        "endHour": 18,
        "surchargePct": 0,
        "label": "09:00 - 18:00 (Normal Tariff)"
      },
      {
        "name": "Evening Peak",
        "startHour": 18,
        "endHour": 22,
        "surchargePct": 20,
        "label": "18:00 - 22:00 (+20% Peak Surcharge)"
      }
    ],
    "captiveExemptions": {
      "cssExempt": true,
      "asExempt": true,
      "rule3EquityMinPct": 26,
      "rule3ConsumptionMinPct": 51
    },
    "transmissionLossesByVoltage": {
      "11": 6.5,
      "22": 5.6,
      "33": 4.2,
      "66": 3.5,
      "110": 3.2,
      "132": 3
    },
    "policyNotes": "MP has attractive solar policies with GUVNL solar park incentives."
  },
  "punjab": {
    "stateName": "Punjab",
    "regulator": "PSERC",
    "sldcName": "PUNJAB STATE LOAD DESPATCH CENTRE (PSLDC, PATIALA)",
    "regulationName": "PSERC (Deviation Settlement) Regulations & OA Terms",
    "netMeteringCapKW": 1000,
    "netMeteringCapPctSanctioned": 100,
    "concurrentNetMeteringOA": true,
    "btmZeroExportAllowed": true,
    "rprMandatory": false,
    "baseIndustrialTariff": 7.45,
    "openAccessPpaRate": 3.9,
    "dsmToleranceBandPct": 12,
    "dsmReferenceRate": 3.6,
    "penaltyTiers": [
      {
        "minDeviationPct": 0,
        "maxDeviationPct": 12,
        "penaltyFactor": 0,
        "label": "Band 1: Tolerance (±12%)"
      },
      {
        "minDeviationPct": 12,
        "maxDeviationPct": 25,
        "penaltyFactor": 0.15,
        "label": "Band 2: 12% - 25%"
      },
      {
        "minDeviationPct": 25,
        "maxDeviationPct": 999,
        "penaltyFactor": 0.3,
        "label": "Band 3: > 25%"
      }
    ],
    "inadvertentExportPenaltyRate": 2,
    "contractDemandExceedancePenaltyMultiplier": 1.4,
    "crossSubsidySurcharge": 1.85,
    "additionalSurcharge": 1.3,
    "wheelingChargePerKWh": 0.42,
    "transmissionChargePerKWh": 0.48,
    "sldcFeesPerDay": 1350,
    "electricityDutyPct": 10,
    "bankingChargePct": 3,
    "bankingType": "Monthly banking with 3% deduction",
    "todSlabs": [
      {
        "name": "Night",
        "startHour": 22,
        "endHour": 6,
        "surchargePct": -20,
        "label": "22:00 - 06:00 (-20% Off-Peak Rebate)"
      },
      {
        "name": "Peak",
        "startHour": 17,
        "endHour": 22,
        "surchargePct": 25,
        "label": "17:00 - 22:00 (+25% Peak Surcharge)"
      },
      {
        "name": "Normal",
        "startHour": 6,
        "endHour": 17,
        "surchargePct": 0,
        "label": "06:00 - 17:00 (Normal Tariff)"
      }
    ],
    "captiveExemptions": {
      "cssExempt": true,
      "asExempt": true,
      "rule3EquityMinPct": 26,
      "rule3ConsumptionMinPct": 51
    },
    "transmissionLossesByVoltage": {
      "11": 5.8,
      "22": 5,
      "33": 3.9,
      "66": 3.2,
      "110": 3,
      "132": 2.85
    },
    "policyNotes": "PSERC allows concurrent Net Metering and Open Access."
  },
  "westbengal": {
    "stateName": "West Bengal",
    "regulator": "WBERC",
    "sldcName": "WEST BENGAL STATE LOAD DESPATCH CENTRE (WBSLDC, KOLKATA)",
    "regulationName": "WBERC (Deviation Settlement) Regulations & OA Framework",
    "netMeteringCapKW": 1000,
    "netMeteringCapPctSanctioned": 100,
    "concurrentNetMeteringOA": false,
    "btmZeroExportAllowed": true,
    "rprMandatory": true,
    "baseIndustrialTariff": 7.65,
    "openAccessPpaRate": 4.1,
    "dsmToleranceBandPct": 10,
    "dsmReferenceRate": 3.8,
    "penaltyTiers": [
      {
        "minDeviationPct": 0,
        "maxDeviationPct": 10,
        "penaltyFactor": 0,
        "label": "Band 1: Free Tolerance (±10%)"
      },
      {
        "minDeviationPct": 10,
        "maxDeviationPct": 20,
        "penaltyFactor": 0.12,
        "label": "Band 2: 10% - 20% (12% Surcharge)"
      },
      {
        "minDeviationPct": 20,
        "maxDeviationPct": 999,
        "penaltyFactor": 0.25,
        "label": "Band 3: > 20% (25% Surcharge)"
      }
    ],
    "inadvertentExportPenaltyRate": 1.8,
    "contractDemandExceedancePenaltyMultiplier": 1.55,
    "crossSubsidySurcharge": 2.1,
    "additionalSurcharge": 1.4,
    "wheelingChargePerKWh": 0.45,
    "transmissionChargePerKWh": 0.52,
    "sldcFeesPerDay": 1400,
    "electricityDutyPct": 10,
    "bankingChargePct": 2.5,
    "bankingType": "Monthly banking (2.5% loss)",
    "todSlabs": [
      {
        "name": "Night",
        "startHour": 22,
        "endHour": 6,
        "surchargePct": -15,
        "label": "22:00 - 06:00 (-15% Off-Peak Rebate)"
      },
      {
        "name": "Morning Peak",
        "startHour": 8,
        "endHour": 12,
        "surchargePct": 15,
        "label": "08:00 - 12:00 (+15% Peak Surcharge)"
      },
      {
        "name": "Evening Peak",
        "startHour": 18,
        "endHour": 22,
        "surchargePct": 22,
        "label": "18:00 - 22:00 (+22% Peak Surcharge)"
      }
    ],
    "captiveExemptions": {
      "cssExempt": true,
      "asExempt": true,
      "rule3EquityMinPct": 26,
      "rule3ConsumptionMinPct": 51
    },
    "transmissionLossesByVoltage": {
      "11": 6.8,
      "22": 5.9,
      "33": 4.5,
      "66": 3.8,
      "110": 3.4,
      "132": 3.2
    },
    "policyNotes": "WBERC mandates RPR for BTM installations."
  },
  "odisha": {
    "stateName": "Odisha",
    "regulator": "OERC",
    "sldcName": "ODISHA STATE LOAD DESPATCH CENTRE (OSLDC, BHUBANESWAR)",
    "regulationName": "OERC (Deviation Settlement Mechanism) Regulations",
    "netMeteringCapKW": 1000,
    "netMeteringCapPctSanctioned": 100,
    "concurrentNetMeteringOA": true,
    "btmZeroExportAllowed": true,
    "rprMandatory": false,
    "baseIndustrialTariff": 6.85,
    "openAccessPpaRate": 3.45,
    "dsmToleranceBandPct": 10,
    "dsmReferenceRate": 3.15,
    "penaltyTiers": [
      {
        "minDeviationPct": 0,
        "maxDeviationPct": 10,
        "penaltyFactor": 0,
        "label": "Band 1: Free Tolerance (±10%)"
      },
      {
        "minDeviationPct": 10,
        "maxDeviationPct": 20,
        "penaltyFactor": 0.1,
        "label": "Band 2: 10% - 20% (10% Surcharge)"
      },
      {
        "minDeviationPct": 20,
        "maxDeviationPct": 999,
        "penaltyFactor": 0.22,
        "label": "Band 3: > 20% (22% Surcharge)"
      }
    ],
    "inadvertentExportPenaltyRate": 1.6,
    "contractDemandExceedancePenaltyMultiplier": 1.45,
    "crossSubsidySurcharge": 1.35,
    "additionalSurcharge": 0.95,
    "wheelingChargePerKWh": 0.28,
    "transmissionChargePerKWh": 0.32,
    "sldcFeesPerDay": 950,
    "electricityDutyPct": 7,
    "bankingChargePct": 1.5,
    "bankingType": "Monthly banking (1.5% deduction)",
    "todSlabs": [
      {
        "name": "Night",
        "startHour": 21,
        "endHour": 6,
        "surchargePct": -18,
        "label": "21:00 - 06:00 (-18% Off-Peak Rebate)"
      },
      {
        "name": "Peak",
        "startHour": 17,
        "endHour": 21,
        "surchargePct": 18,
        "label": "17:00 - 21:00 (+18% Peak Surcharge)"
      },
      {
        "name": "Normal",
        "startHour": 6,
        "endHour": 17,
        "surchargePct": 0,
        "label": "06:00 - 17:00 (Normal Tariff)"
      }
    ],
    "captiveExemptions": {
      "cssExempt": true,
      "asExempt": true,
      "rule3EquityMinPct": 26,
      "rule3ConsumptionMinPct": 51
    },
    "transmissionLossesByVoltage": {
      "11": 7.2,
      "22": 6.3,
      "33": 4.8,
      "66": 4,
      "110": 3.3,
      "132": 3.5
    },
    "policyNotes": "Lowest OA charges in eastern India."
  },
  "bihar": {
    "stateName": "Bihar",
    "regulator": "BERC",
    "sldcName": "BIHAR STATE LOAD DESPATCH CENTRE (BSLDC, PATNA)",
    "regulationName": "BERC (Deviation Settlement) Regulations & OA Framework",
    "netMeteringCapKW": 1000,
    "netMeteringCapPctSanctioned": 100,
    "concurrentNetMeteringOA": false,
    "btmZeroExportAllowed": true,
    "rprMandatory": true,
    "baseIndustrialTariff": 7.95,
    "openAccessPpaRate": 4.25,
    "dsmToleranceBandPct": 10,
    "dsmReferenceRate": 3.95,
    "penaltyTiers": [
      {
        "minDeviationPct": 0,
        "maxDeviationPct": 10,
        "penaltyFactor": 0,
        "label": "Band 1: Free Tolerance (±10%)"
      },
      {
        "minDeviationPct": 10,
        "maxDeviationPct": 20,
        "penaltyFactor": 0.15,
        "label": "Band 2: 10% - 20% (15% Surcharge)"
      },
      {
        "minDeviationPct": 20,
        "maxDeviationPct": 999,
        "penaltyFactor": 0.3,
        "label": "Band 3: > 20% (30% Surcharge)"
      }
    ],
    "inadvertentExportPenaltyRate": 2.2,
    "contractDemandExceedancePenaltyMultiplier": 1.6,
    "crossSubsidySurcharge": 2.4,
    "additionalSurcharge": 1.55,
    "wheelingChargePerKWh": 0.52,
    "transmissionChargePerKWh": 0.58,
    "sldcFeesPerDay": 1600,
    "electricityDutyPct": 12,
    "bankingChargePct": 4,
    "bankingType": "Monthly banking (4% loss)",
    "todSlabs": [
      {
        "name": "Night",
        "startHour": 22,
        "endHour": 6,
        "surchargePct": -12,
        "label": "22:00 - 06:00 (-12% Off-Peak Rebate)"
      },
      {
        "name": "Peak",
        "startHour": 17,
        "endHour": 22,
        "surchargePct": 20,
        "label": "17:00 - 22:00 (+20% Peak Surcharge)"
      }
    ],
    "captiveExemptions": {
      "cssExempt": true,
      "asExempt": true,
      "rule3EquityMinPct": 26,
      "rule3ConsumptionMinPct": 51
    },
    "transmissionLossesByVoltage": {
      "11": 8.5,
      "22": 7.4,
      "33": 5.6,
      "66": 4.8,
      "110": 3.5,
      "132": 4.2
    },
    "policyNotes": "Higher OA charges due to transmission losses."
  },
  "jharkhand": {
    "stateName": "Jharkhand",
    "regulator": "JSERC",
    "sldcName": "JHARKHAND STATE LOAD DESPATCH CENTRE (JSLDC, RANCHI)",
    "regulationName": "JSERC (Deviation Settlement) Regulations",
    "netMeteringCapKW": 1000,
    "netMeteringCapPctSanctioned": 100,
    "concurrentNetMeteringOA": false,
    "btmZeroExportAllowed": true,
    "rprMandatory": true,
    "baseIndustrialTariff": 7.35,
    "openAccessPpaRate": 3.75,
    "dsmToleranceBandPct": 10,
    "dsmReferenceRate": 3.45,
    "penaltyTiers": [
      {
        "minDeviationPct": 0,
        "maxDeviationPct": 10,
        "penaltyFactor": 0,
        "label": "Band 1: Free Tolerance (±10%)"
      },
      {
        "minDeviationPct": 10,
        "maxDeviationPct": 20,
        "penaltyFactor": 0.12,
        "label": "Band 2: 10% - 20% (12% Surcharge)"
      },
      {
        "minDeviationPct": 20,
        "maxDeviationPct": 999,
        "penaltyFactor": 0.25,
        "label": "Band 3: > 20% (25% Surcharge)"
      }
    ],
    "inadvertentExportPenaltyRate": 1.85,
    "contractDemandExceedancePenaltyMultiplier": 1.5,
    "crossSubsidySurcharge": 1.75,
    "additionalSurcharge": 1.2,
    "wheelingChargePerKWh": 0.4,
    "transmissionChargePerKWh": 0.45,
    "sldcFeesPerDay": 1250,
    "electricityDutyPct": 9,
    "bankingChargePct": 2.5,
    "todSlabs": [
      {
        "name": "Night",
        "startHour": 22,
        "endHour": 6,
        "surchargePct": -15,
        "label": "22:00 - 06:00 (-15% Off-Peak Rebate)"
      },
      {
        "name": "Peak",
        "startHour": 18,
        "endHour": 22,
        "surchargePct": 18,
        "label": "18:00 - 22:00 (+18% Peak Surcharge)"
      },
      {
        "name": "Normal",
        "startHour": 6,
        "endHour": 18,
        "surchargePct": 0,
        "label": "06:00 - 18:00 (Normal Tariff)"
      }
    ],
    "captiveExemptions": {
      "cssExempt": true,
      "asExempt": true,
      "rule3EquityMinPct": 26,
      "rule3ConsumptionMinPct": 51
    },
    "transmissionLossesByVoltage": {
      "11": 7.8,
      "22": 6.8,
      "33": 5.2,
      "66": 4.4,
      "110": 3.6,
      "132": 3.9
    },
    "policyNotes": "Emerging solar framework in mineral-rich industrial zones.",
    "bankingType": "Monthly banking (2.5% in-kind energy deduction)"
  },
  "chhattisgarh": {
    "stateName": "Chhattisgarh",
    "regulator": "CSERC",
    "sldcName": "CHHATTISGARH STATE LOAD DESPATCH CENTRE (CSLDC, RAIPUR)",
    "regulationName": "CSERC (Deviation Settlement Mechanism) Regulations",
    "netMeteringCapKW": 1000,
    "netMeteringCapPctSanctioned": 100,
    "concurrentNetMeteringOA": true,
    "btmZeroExportAllowed": true,
    "rprMandatory": false,
    "baseIndustrialTariff": 7.05,
    "openAccessPpaRate": 3.5,
    "dsmToleranceBandPct": 10,
    "dsmReferenceRate": 3.2,
    "penaltyTiers": [
      {
        "minDeviationPct": 0,
        "maxDeviationPct": 10,
        "penaltyFactor": 0,
        "label": "Band 1: Free Tolerance (±10%)"
      },
      {
        "minDeviationPct": 10,
        "maxDeviationPct": 20,
        "penaltyFactor": 0.1,
        "label": "Band 2: 10% - 20% (10% Surcharge)"
      },
      {
        "minDeviationPct": 20,
        "maxDeviationPct": 999,
        "penaltyFactor": 0.22,
        "label": "Band 3: > 20% (22% Surcharge)"
      }
    ],
    "inadvertentExportPenaltyRate": 1.65,
    "contractDemandExceedancePenaltyMultiplier": 1.45,
    "crossSubsidySurcharge": 1.4,
    "additionalSurcharge": 0.9,
    "wheelingChargePerKWh": 0.3,
    "transmissionChargePerKWh": 0.35,
    "sldcFeesPerDay": 1000,
    "electricityDutyPct": 8,
    "bankingChargePct": 2,
    "todSlabs": [
      {
        "name": "Night",
        "startHour": 22,
        "endHour": 6,
        "surchargePct": -15,
        "label": "22:00 - 06:00 (-15% Off-Peak Rebate)"
      },
      {
        "name": "Peak",
        "startHour": 18,
        "endHour": 22,
        "surchargePct": 18,
        "label": "18:00 - 22:00 (+18% Peak Surcharge)"
      },
      {
        "name": "Normal",
        "startHour": 6,
        "endHour": 18,
        "surchargePct": 0,
        "label": "06:00 - 18:00 (Normal Tariff)"
      }
    ],
    "captiveExemptions": {
      "cssExempt": true,
      "asExempt": true,
      "rule3EquityMinPct": 26,
      "rule3ConsumptionMinPct": 51
    },
    "transmissionLossesByVoltage": {
      "11": 6.4,
      "22": 5.5,
      "33": 4.15,
      "66": 3.45,
      "110": 3.2,
      "132": 3
    },
    "policyNotes": "Lowest industrial tariffs in central India.",
    "bankingType": "Monthly banking (2.0% in-kind energy deduction)"
  },
  "uttarakhand": {
    "stateName": "Uttarakhand",
    "regulator": "UERC",
    "sldcName": "UTTARAKHAND STATE LOAD DESPATCH CENTRE (USLDC, DEHRADUN)",
    "regulationName": "UERC (Deviation Settlement) Regulations",
    "netMeteringCapKW": 1000,
    "netMeteringCapPctSanctioned": 100,
    "concurrentNetMeteringOA": true,
    "btmZeroExportAllowed": true,
    "rprMandatory": false,
    "baseIndustrialTariff": 7.25,
    "openAccessPpaRate": 3.65,
    "dsmToleranceBandPct": 10,
    "dsmReferenceRate": 3.35,
    "penaltyTiers": [
      {
        "minDeviationPct": 0,
        "maxDeviationPct": 10,
        "penaltyFactor": 0,
        "label": "Band 1: Free Tolerance (±10%)"
      },
      {
        "minDeviationPct": 10,
        "maxDeviationPct": 20,
        "penaltyFactor": 0.11,
        "label": "Band 2: 10% - 20% (11% Surcharge)"
      },
      {
        "minDeviationPct": 20,
        "maxDeviationPct": 999,
        "penaltyFactor": 0.24,
        "label": "Band 3: > 20% (24% Surcharge)"
      }
    ],
    "inadvertentExportPenaltyRate": 1.7,
    "contractDemandExceedancePenaltyMultiplier": 1.5,
    "crossSubsidySurcharge": 1.55,
    "additionalSurcharge": 1,
    "wheelingChargePerKWh": 0.36,
    "transmissionChargePerKWh": 0.4,
    "sldcFeesPerDay": 1150,
    "electricityDutyPct": 8.5,
    "bankingChargePct": 2.5,
    "todSlabs": [
      {
        "name": "Night",
        "startHour": 22,
        "endHour": 6,
        "surchargePct": -15,
        "label": "22:00 - 06:00 (-15% Off-Peak Rebate)"
      },
      {
        "name": "Peak",
        "startHour": 17,
        "endHour": 21,
        "surchargePct": 20,
        "label": "17:00 - 21:00 (+20% Peak Surcharge)"
      },
      {
        "name": "Normal",
        "startHour": 6,
        "endHour": 17,
        "surchargePct": 0,
        "label": "06:00 - 17:00 (Normal Tariff)"
      }
    ],
    "captiveExemptions": {
      "cssExempt": true,
      "asExempt": true,
      "rule3EquityMinPct": 26,
      "rule3ConsumptionMinPct": 51
    },
    "transmissionLossesByVoltage": {
      "11": 6.1,
      "22": 5.3,
      "33": 4,
      "66": 3.3,
      "110": 3.1,
      "132": 2.9
    },
    "policyNotes": "Allows concurrent Net Metering + OA.",
    "bankingType": "Monthly banking (2.5% in-kind energy deduction)"
  },
  "kerala": {
    "stateName": "Kerala",
    "regulator": "KSERC",
    "sldcName": "KERALA STATE LOAD DESPATCH CENTRE (KSLDC, THIRUVANANTHAPURAM)",
    "regulationName": "KSERC (Deviation Settlement) Regulations & OA Terms",
    "netMeteringCapKW": 500,
    "netMeteringCapPctSanctioned": 50,
    "concurrentNetMeteringOA": false,
    "btmZeroExportAllowed": true,
    "rprMandatory": true,
    "baseIndustrialTariff": 7.55,
    "openAccessPpaRate": 4,
    "dsmToleranceBandPct": 10,
    "dsmReferenceRate": 3.7,
    "penaltyTiers": [
      {
        "minDeviationPct": 0,
        "maxDeviationPct": 10,
        "penaltyFactor": 0,
        "label": "Band 1: Free Tolerance (±10%)"
      },
      {
        "minDeviationPct": 10,
        "maxDeviationPct": 20,
        "penaltyFactor": 0.13,
        "label": "Band 2: 10% - 20% (13% Surcharge)"
      },
      {
        "minDeviationPct": 20,
        "maxDeviationPct": 999,
        "penaltyFactor": 0.26,
        "label": "Band 3: > 20% (26% Surcharge)"
      }
    ],
    "inadvertentExportPenaltyRate": 1.9,
    "contractDemandExceedancePenaltyMultiplier": 1.55,
    "crossSubsidySurcharge": 2.05,
    "additionalSurcharge": 1.35,
    "wheelingChargePerKWh": 0.48,
    "transmissionChargePerKWh": 0.55,
    "sldcFeesPerDay": 1450,
    "electricityDutyPct": 11,
    "bankingChargePct": 3.5,
    "todSlabs": [
      {
        "name": "Night",
        "startHour": 22,
        "endHour": 6,
        "surchargePct": -18,
        "label": "22:00 - 06:00 (-18% Off-Peak Rebate)"
      },
      {
        "name": "Morning Peak",
        "startHour": 6,
        "endHour": 10,
        "surchargePct": 10,
        "label": "06:00 - 10:00 (+10% Peak Surcharge)"
      },
      {
        "name": "Evening Peak",
        "startHour": 17,
        "endHour": 22,
        "surchargePct": 25,
        "label": "17:00 - 22:00 (+25% Peak Surcharge)"
      }
    ],
    "captiveExemptions": {
      "cssExempt": true,
      "asExempt": true,
      "rule3EquityMinPct": 26,
      "rule3ConsumptionMinPct": 51
    },
    "transmissionLossesByVoltage": {
      "11": 5.5,
      "22": 4.8,
      "33": 3.7,
      "66": 3.1,
      "110": 2.75,
      "132": 2.5
    },
    "policyNotes": "Lower net metering cap, requires RPR.",
    "bankingType": "Monthly banking (3.5% in-kind energy deduction)"
  },
  "goa": {
    "stateName": "Goa",
    "regulator": "GSERC",
    "sldcName": "GOA STATE LOAD DESPATCH CENTRE (GSLDC, PANAJI)",
    "regulationName": "GSERC (Deviation Settlement) Regulations",
    "netMeteringCapKW": 1000,
    "netMeteringCapPctSanctioned": 100,
    "concurrentNetMeteringOA": true,
    "btmZeroExportAllowed": false,
    "rprMandatory": false,
    "baseIndustrialTariff": 7.4,
    "openAccessPpaRate": 3.85,
    "dsmToleranceBandPct": 12,
    "dsmReferenceRate": 3.55,
    "penaltyTiers": [
      {
        "minDeviationPct": 0,
        "maxDeviationPct": 12,
        "penaltyFactor": 0,
        "label": "Band 1: Free Tolerance (±12%)"
      },
      {
        "minDeviationPct": 12,
        "maxDeviationPct": 24,
        "penaltyFactor": 0.12,
        "label": "Band 2: 12% - 24% (12% Surcharge)"
      },
      {
        "minDeviationPct": 24,
        "maxDeviationPct": 999,
        "penaltyFactor": 0.25,
        "label": "Band 3: > 24% (25% Surcharge)"
      }
    ],
    "inadvertentExportPenaltyRate": 1.75,
    "contractDemandExceedancePenaltyMultiplier": 1.45,
    "crossSubsidySurcharge": 1.6,
    "additionalSurcharge": 1.1,
    "wheelingChargePerKWh": 0.38,
    "transmissionChargePerKWh": 0.42,
    "sldcFeesPerDay": 1050,
    "electricityDutyPct": 10,
    "bankingChargePct": 2,
    "todSlabs": [
      {
        "name": "Night",
        "startHour": 22,
        "endHour": 6,
        "surchargePct": -15,
        "label": "22:00 - 06:00 (-15% Off-Peak Rebate)"
      },
      {
        "name": "Peak",
        "startHour": 18,
        "endHour": 22,
        "surchargePct": 18,
        "label": "18:00 - 22:00 (+18% Peak Surcharge)"
      },
      {
        "name": "Normal",
        "startHour": 6,
        "endHour": 18,
        "surchargePct": 0,
        "label": "06:00 - 18:00 (Normal Tariff)"
      }
    ],
    "captiveExemptions": {
      "cssExempt": true,
      "asExempt": true,
      "rule3EquityMinPct": 26,
      "rule3ConsumptionMinPct": 51
    },
    "transmissionLossesByVoltage": {
      "11": 5.2,
      "22": 4.5,
      "33": 3.4,
      "66": 3.3,
      "110": 2.9,
      "132": 2.6
    },
    "policyNotes": "Small market with wider 12% DSM tolerance band.",
    "bankingType": "Monthly banking (2.0% in-kind energy deduction)"
  },
  "chandigarh": {
    "stateName": "Chandigarh (UT)",
    "regulator": "UTERC",
    "sldcName": "CHANDIGARH LOAD DESPATCH CENTRE",
    "regulationName": "UTERC (Deviation Settlement) Regulations",
    "netMeteringCapKW": 1000,
    "netMeteringCapPctSanctioned": 100,
    "concurrentNetMeteringOA": true,
    "btmZeroExportAllowed": true,
    "rprMandatory": false,
    "baseIndustrialTariff": 7.3,
    "openAccessPpaRate": 3.7,
    "dsmToleranceBandPct": 10,
    "dsmReferenceRate": 3.4,
    "penaltyTiers": [
      {
        "minDeviationPct": 0,
        "maxDeviationPct": 10,
        "penaltyFactor": 0,
        "label": "Band 1: Free Tolerance (±10%)"
      },
      {
        "minDeviationPct": 10,
        "maxDeviationPct": 20,
        "penaltyFactor": 0.12,
        "label": "Band 2: 10% - 20% (12% Surcharge)"
      },
      {
        "minDeviationPct": 20,
        "maxDeviationPct": 999,
        "penaltyFactor": 0.25,
        "label": "Band 3: > 20% (25% Surcharge)"
      }
    ],
    "inadvertentExportPenaltyRate": 1.75,
    "contractDemandExceedancePenaltyMultiplier": 1.5,
    "crossSubsidySurcharge": 1.5,
    "additionalSurcharge": 1,
    "wheelingChargePerKWh": 0.35,
    "transmissionChargePerKWh": 0.38,
    "sldcFeesPerDay": 1000,
    "electricityDutyPct": 8,
    "bankingChargePct": 2,
    "todSlabs": [
      {
        "name": "Night",
        "startHour": 22,
        "endHour": 6,
        "surchargePct": -15,
        "label": "22:00 - 06:00 (-15% Off-Peak Rebate)"
      },
      {
        "name": "Peak",
        "startHour": 17,
        "endHour": 22,
        "surchargePct": 18,
        "label": "17:00 - 22:00 (+18% Peak Surcharge)"
      },
      {
        "name": "Normal",
        "startHour": 6,
        "endHour": 17,
        "surchargePct": 0,
        "label": "06:00 - 17:00 (Normal Tariff)"
      }
    ],
    "captiveExemptions": {
      "cssExempt": true,
      "asExempt": true,
      "rule3EquityMinPct": 26,
      "rule3ConsumptionMinPct": 51
    },
    "transmissionLossesByVoltage": {
      "11": 5,
      "22": 4.3,
      "33": 3.2,
      "66": 3.2,
      "110": 2.8,
      "132": 2.5
    },
    "policyNotes": "Union Territory with pro-solar policies.",
    "bankingType": "Monthly banking (2.0% in-kind energy deduction)"
  },
  "assam": {
    "stateName": "Assam",
    "regulator": "AERC",
    "sldcName": "ASSAM ELECTRICITY GRID CORPORATION LTD (SLDC, GUWAHATI)",
    "regulationName": "AERC (Deviation Settlement) Regulations",
    "netMeteringCapKW": 1000,
    "netMeteringCapPctSanctioned": 100,
    "concurrentNetMeteringOA": false,
    "btmZeroExportAllowed": true,
    "rprMandatory": true,
    "baseIndustrialTariff": 7.45,
    "openAccessPpaRate": 3.9,
    "dsmToleranceBandPct": 12,
    "dsmReferenceRate": 3.65,
    "penaltyTiers": [
      {
        "minDeviationPct": 0,
        "maxDeviationPct": 12,
        "penaltyFactor": 0,
        "label": "Band 1: Free Tolerance (±12%)"
      },
      {
        "minDeviationPct": 12,
        "maxDeviationPct": 24,
        "penaltyFactor": 0.1,
        "label": "Band 2: 12% - 24% (10% Surcharge)"
      },
      {
        "minDeviationPct": 24,
        "maxDeviationPct": 999,
        "penaltyFactor": 0.25,
        "label": "Band 3: > 24% (25% Surcharge)"
      }
    ],
    "inadvertentExportPenaltyRate": 1.85,
    "contractDemandExceedancePenaltyMultiplier": 1.5,
    "crossSubsidySurcharge": 1.7,
    "additionalSurcharge": 1.15,
    "wheelingChargePerKWh": 0.42,
    "transmissionChargePerKWh": 0.48,
    "sldcFeesPerDay": 1200,
    "electricityDutyPct": 9,
    "bankingChargePct": 3,
    "bankingType": "Monthly banking (3% loss)",
    "todSlabs": [
      {
        "name": "Night",
        "startHour": 22,
        "endHour": 6,
        "surchargePct": -15,
        "label": "22:00 - 06:00 (-15% Off-Peak Rebate)"
      },
      {
        "name": "Peak",
        "startHour": 17,
        "endHour": 22,
        "surchargePct": 20,
        "label": "17:00 - 22:00 (+20% Peak Surcharge)"
      },
      {
        "name": "Normal",
        "startHour": 6,
        "endHour": 17,
        "surchargePct": 0,
        "label": "06:00 - 17:00 (Normal Tariff)"
      }
    ],
    "captiveExemptions": {
      "cssExempt": true,
      "asExempt": true,
      "rule3EquityMinPct": 26,
      "rule3ConsumptionMinPct": 51
    },
    "transmissionLossesByVoltage": {
      "11": 6.8,
      "22": 5.9,
      "33": 4.5,
      "66": 3.8,
      "110": 3.4,
      "132": 3.4
    },
    "policyNotes": "Emerging market for distributed renewables in North East."
  },
  "hp": {
    "stateName": "Himachal Pradesh",
    "regulator": "HPERC",
    "sldcName": "HIMACHAL PRADESH STATE LOAD DESPATCH CENTRE (HPSLDC, SHIMLA)",
    "regulationName": "HPERC (Deviation Settlement Mechanism) Regulations",
    "netMeteringCapKW": 1000,
    "netMeteringCapPctSanctioned": 80,
    "concurrentNetMeteringOA": true,
    "btmZeroExportAllowed": true,
    "rprMandatory": false,
    "baseIndustrialTariff": 6.95,
    "openAccessPpaRate": 3.55,
    "dsmToleranceBandPct": 15,
    "dsmReferenceRate": 3.3,
    "penaltyTiers": [
      {
        "minDeviationPct": 0,
        "maxDeviationPct": 15,
        "penaltyFactor": 0,
        "label": "Band 1: Free Tolerance (±15%)"
      },
      {
        "minDeviationPct": 15,
        "maxDeviationPct": 30,
        "penaltyFactor": 0.1,
        "label": "Band 2: 15% - 30% (10% Surcharge)"
      },
      {
        "minDeviationPct": 30,
        "maxDeviationPct": 999,
        "penaltyFactor": 0.2,
        "label": "Band 3: > 30% (20% Surcharge)"
      }
    ],
    "inadvertentExportPenaltyRate": 1.65,
    "contractDemandExceedancePenaltyMultiplier": 1.4,
    "crossSubsidySurcharge": 1.45,
    "additionalSurcharge": 0.95,
    "wheelingChargePerKWh": 0.36,
    "transmissionChargePerKWh": 0.4,
    "sldcFeesPerDay": 1100,
    "electricityDutyPct": 8.5,
    "bankingChargePct": 2,
    "bankingType": "Monthly banking (2% loss)",
    "todSlabs": [
      {
        "name": "Night",
        "startHour": 22,
        "endHour": 6,
        "surchargePct": -20,
        "label": "22:00 - 06:00 (-20% Off-Peak Rebate)"
      },
      {
        "name": "Peak",
        "startHour": 18,
        "endHour": 22,
        "surchargePct": 15,
        "label": "18:00 - 22:00 (+15% Peak Surcharge)"
      },
      {
        "name": "Normal",
        "startHour": 6,
        "endHour": 18,
        "surchargePct": 0,
        "label": "06:00 - 18:00 (Normal Tariff)"
      }
    ],
    "captiveExemptions": {
      "cssExempt": true,
      "asExempt": true,
      "rule3EquityMinPct": 26,
      "rule3ConsumptionMinPct": 51
    },
    "transmissionLossesByVoltage": {
      "11": 5.9,
      "22": 5.2,
      "33": 3.9,
      "66": 3.3,
      "110": 3.1,
      "132": 2.9
    },
    "policyNotes": "Favorable policies for hydro and solar. Wider 15% DSM tolerance."
  },
  "delhi": {
    "stateName": "Delhi",
    "regulator": "DERC",
    "sldcName": "STATE LOAD DESPATCH CENTRE, DELHI",
    "regulationName": "DERC (Deviation Settlement Mechanism) Regulations",
    "netMeteringCapKW": 1000,
    "netMeteringCapPctSanctioned": 100,
    "concurrentNetMeteringOA": true,
    "btmZeroExportAllowed": true,
    "rprMandatory": false,
    "baseIndustrialTariff": 8.1,
    "openAccessPpaRate": 4.2,
    "dsmToleranceBandPct": 10,
    "dsmReferenceRate": 3.9,
    "penaltyTiers": [
      {
        "minDeviationPct": 0,
        "maxDeviationPct": 10,
        "penaltyFactor": 0,
        "label": "Band 1: Free Tolerance (±10%)"
      },
      {
        "minDeviationPct": 10,
        "maxDeviationPct": 20,
        "penaltyFactor": 0.15,
        "label": "Band 2: 10% - 20% (15% Surcharge)"
      },
      {
        "minDeviationPct": 20,
        "maxDeviationPct": 999,
        "penaltyFactor": 0.3,
        "label": "Band 3: > 20% (30% Surcharge)"
      }
    ],
    "inadvertentExportPenaltyRate": 2.1,
    "contractDemandExceedancePenaltyMultiplier": 1.6,
    "crossSubsidySurcharge": 2.15,
    "additionalSurcharge": 1.45,
    "wheelingChargePerKWh": 0.5,
    "transmissionChargePerKWh": 0.55,
    "sldcFeesPerDay": 1500,
    "electricityDutyPct": 10.5,
    "bankingChargePct": 2.5,
    "bankingType": "Monthly banking (2.5% loss)",
    "todSlabs": [
      {
        "name": "Night",
        "startHour": 23,
        "endHour": 6,
        "surchargePct": -15,
        "label": "23:00 - 06:00 (-15% Off-Peak Rebate)"
      },
      {
        "name": "Peak Summer",
        "startHour": 13,
        "endHour": 17,
        "surchargePct": 20,
        "label": "13:00 - 17:00 (+20% Peak Surcharge)"
      },
      {
        "name": "Peak Evening",
        "startHour": 21,
        "endHour": 23,
        "surchargePct": 15,
        "label": "21:00 - 23:00 (+15% Peak Surcharge)"
      },
      {
        "name": "Normal",
        "startHour": 6,
        "endHour": 13,
        "surchargePct": 0,
        "label": "06:00 - 13:00 (Normal Tariff)"
      }
    ],
    "captiveExemptions": {
      "cssExempt": true,
      "asExempt": true,
      "rule3EquityMinPct": 26,
      "rule3ConsumptionMinPct": 51
    },
    "transmissionLossesByVoltage": {
      "11": 5.4,
      "22": 4.2,
      "33": 3.8,
      "66": 3.2,
      "110": 2.6,
      "132": 2.3
    },
    "policyNotes": "Complex seasonal TOD structures and high OA charges."
  },
  "jnk": {
    "stateName": "Jammu & Kashmir",
    "regulator": "JKSERC",
    "sldcName": "J&K STATE LOAD DESPATCH CENTRE (JKSLDC, GLADNI)",
    "regulationName": "JKSERC (Deviation Settlement Mechanism) Regulations",
    "netMeteringCapKW": 1000,
    "netMeteringCapPctSanctioned": 100,
    "concurrentNetMeteringOA": true,
    "btmZeroExportAllowed": true,
    "rprMandatory": false,
    "baseIndustrialTariff": 6.8,
    "openAccessPpaRate": 3.4,
    "dsmToleranceBandPct": 15,
    "dsmReferenceRate": 3.2,
    "penaltyTiers": [
      {
        "minDeviationPct": 0,
        "maxDeviationPct": 15,
        "penaltyFactor": 0,
        "label": "Band 1: Free Tolerance (±15%)"
      },
      {
        "minDeviationPct": 15,
        "maxDeviationPct": 30,
        "penaltyFactor": 0.12,
        "label": "Band 2: 15% - 30% (12% Surcharge)"
      },
      {
        "minDeviationPct": 30,
        "maxDeviationPct": 999,
        "penaltyFactor": 0.25,
        "label": "Band 3: > 30% (25% Surcharge)"
      }
    ],
    "inadvertentExportPenaltyRate": 1.6,
    "contractDemandExceedancePenaltyMultiplier": 1.45,
    "crossSubsidySurcharge": 1.35,
    "additionalSurcharge": 1,
    "wheelingChargePerKWh": 0.35,
    "transmissionChargePerKWh": 0.4,
    "sldcFeesPerDay": 1050,
    "electricityDutyPct": 8,
    "bankingChargePct": 2,
    "bankingType": "Monthly banking (2% loss)",
    "todSlabs": [
      {
        "name": "Night",
        "startHour": 22,
        "endHour": 6,
        "surchargePct": -15,
        "label": "22:00 - 06:00 (-15% Off-Peak Rebate)"
      },
      {
        "name": "Peak",
        "startHour": 18,
        "endHour": 22,
        "surchargePct": 15,
        "label": "18:00 - 22:00 (+15% Peak Surcharge)"
      },
      {
        "name": "Normal",
        "startHour": 6,
        "endHour": 18,
        "surchargePct": 0,
        "label": "06:00 - 18:00 (Normal Tariff)"
      }
    ],
    "captiveExemptions": {
      "cssExempt": true,
      "asExempt": true,
      "rule3EquityMinPct": 26,
      "rule3ConsumptionMinPct": 51
    },
    "transmissionLossesByVoltage": {
      "11": 6.8,
      "22": 5.9,
      "33": 4.5,
      "66": 3.8,
      "110": 3.3,
      "132": 3.4
    },
    "policyNotes": "Favorable conditions for C&I OA to stimulate industrial growth."
  },
  "puducherry": {
    "stateName": "Puducherry (UT)",
    "regulator": "JERC (UTs)",
    "sldcName": "PUDUCHERRY SLDC (ELECTRICITY DEPT, PUDUCHERRY)",
    "regulationName": "JERC (Open Access in Transmission and Distribution) Regulations & DSM Orders",
    "netMeteringCapKW": 1000,
    "netMeteringCapPctSanctioned": 100,
    "concurrentNetMeteringOA": true,
    "btmZeroExportAllowed": true,
    "rprMandatory": false,
    "baseIndustrialTariff": 7.1,
    "openAccessPpaRate": 3.6,
    "dsmToleranceBandPct": 10,
    "dsmReferenceRate": 3.3,
    "penaltyTiers": [
      {
        "minDeviationPct": 0,
        "maxDeviationPct": 10,
        "penaltyFactor": 0,
        "label": "Band 1: Free Band (±10%)"
      },
      {
        "minDeviationPct": 10,
        "maxDeviationPct": 20,
        "penaltyFactor": 0.1,
        "label": "Band 2: 10% - 20%"
      },
      {
        "minDeviationPct": 20,
        "maxDeviationPct": 999,
        "penaltyFactor": 0.25,
        "label": "Band 3: > 20%"
      }
    ],
    "inadvertentExportPenaltyRate": 1.65,
    "contractDemandExceedancePenaltyMultiplier": 1.5,
    "crossSubsidySurcharge": 1.55,
    "additionalSurcharge": 0.9,
    "wheelingChargePerKWh": 0.32,
    "transmissionChargePerKWh": 0.38,
    "sldcFeesPerDay": 950,
    "electricityDutyPct": 5,
    "bankingChargePct": 2,
    "bankingType": "Monthly banking (2% deduction)",
    "todSlabs": [
      {
        "name": "Night Off-Peak",
        "startHour": 22,
        "endHour": 6,
        "surchargePct": -15,
        "label": "22:00 - 06:00 (-15% Off-Peak Rebate)"
      },
      {
        "name": "Evening Peak",
        "startHour": 18,
        "endHour": 22,
        "surchargePct": 20,
        "label": "18:00 - 22:00 (+20% Peak Surcharge)"
      },
      {
        "name": "Normal Day",
        "startHour": 6,
        "endHour": 18,
        "surchargePct": 0,
        "label": "06:00 - 18:00 (Normal Tariff)"
      }
    ],
    "captiveExemptions": {
      "cssExempt": true,
      "asExempt": true,
      "rule3EquityMinPct": 26,
      "rule3ConsumptionMinPct": 51
    },
    "transmissionLossesByVoltage": {
      "11": 5.1,
      "22": 4.4,
      "33": 3.3,
      "66": 2.8,
      "110": 2.5,
      "132": 2.3
    },
    "policyNotes": "Low electricity duty (5%) and streamlined JERC open access processing."
  },
  "dnh_dd": {
    "stateName": "Dadra & Nagar Haveli and Daman & Diu (UT)",
    "regulator": "JERC (UTs)",
    "sldcName": "DNH & DD LOAD DESPATCH CENTRE (SILVASSA)",
    "regulationName": "JERC (Open Access Regulations) & GEOA Adoption Orders",
    "netMeteringCapKW": 1000,
    "netMeteringCapPctSanctioned": 100,
    "concurrentNetMeteringOA": true,
    "btmZeroExportAllowed": true,
    "rprMandatory": false,
    "baseIndustrialTariff": 6.45,
    "openAccessPpaRate": 3.5,
    "dsmToleranceBandPct": 10,
    "dsmReferenceRate": 3.2,
    "penaltyTiers": [
      {
        "minDeviationPct": 0,
        "maxDeviationPct": 10,
        "penaltyFactor": 0,
        "label": "Band 1: Free Band (±10%)"
      },
      {
        "minDeviationPct": 10,
        "maxDeviationPct": 20,
        "penaltyFactor": 0.1,
        "label": "Band 2: 10% - 20%"
      },
      {
        "minDeviationPct": 20,
        "maxDeviationPct": 999,
        "penaltyFactor": 0.22,
        "label": "Band 3: > 20%"
      }
    ],
    "inadvertentExportPenaltyRate": 1.5,
    "contractDemandExceedancePenaltyMultiplier": 1.4,
    "crossSubsidySurcharge": 1.25,
    "additionalSurcharge": 0.8,
    "wheelingChargePerKWh": 0.26,
    "transmissionChargePerKWh": 0.32,
    "sldcFeesPerDay": 850,
    "electricityDutyPct": 3,
    "bankingChargePct": 2,
    "bankingType": "Monthly banking (2% deduction)",
    "todSlabs": [
      {
        "name": "Night Off-Peak",
        "startHour": 22,
        "endHour": 6,
        "surchargePct": -12,
        "label": "22:00 - 06:00 (-12% Off-Peak Rebate)"
      },
      {
        "name": "Evening Peak",
        "startHour": 18,
        "endHour": 22,
        "surchargePct": 15,
        "label": "18:00 - 22:00 (+15% Peak Surcharge)"
      },
      {
        "name": "Normal Day",
        "startHour": 6,
        "endHour": 18,
        "surchargePct": 0,
        "label": "06:00 - 18:00 (Normal Tariff)"
      }
    ],
    "captiveExemptions": {
      "cssExempt": true,
      "asExempt": true,
      "rule3EquityMinPct": 26,
      "rule3ConsumptionMinPct": 51
    },
    "transmissionLossesByVoltage": {
      "11": 4.8,
      "22": 4.1,
      "33": 3,
      "66": 2.5,
      "110": 2.3,
      "132": 2.1
    },
    "policyNotes": "Major industrial hub with lowest electricity duty (3%) and competitive industrial tariffs."
  },
  "arunachal": {
    "stateName": "Arunachal Pradesh",
    "regulator": "APSERC",
    "sldcName": "ARUNACHAL PRADESH SLDC (ITANAGAR)",
    "regulationName": "APSERC (Open Access & DSM) Regulations",
    "netMeteringCapKW": 500,
    "netMeteringCapPctSanctioned": 80,
    "concurrentNetMeteringOA": false,
    "btmZeroExportAllowed": true,
    "rprMandatory": true,
    "baseIndustrialTariff": 6.9,
    "openAccessPpaRate": 3.6,
    "dsmToleranceBandPct": 15,
    "dsmReferenceRate": 3.25,
    "penaltyTiers": [
      {
        "minDeviationPct": 0,
        "maxDeviationPct": 15,
        "penaltyFactor": 0,
        "label": "Band 1: Free Tolerance (±15%)"
      },
      {
        "minDeviationPct": 15,
        "maxDeviationPct": 30,
        "penaltyFactor": 0.1,
        "label": "Band 2: 15% - 30% (10% Surcharge)"
      },
      {
        "minDeviationPct": 30,
        "maxDeviationPct": 999,
        "penaltyFactor": 0.2,
        "label": "Band 3: > 30% (20% Surcharge)"
      }
    ],
    "inadvertentExportPenaltyRate": 1.6,
    "contractDemandExceedancePenaltyMultiplier": 1.4,
    "crossSubsidySurcharge": 1.4,
    "additionalSurcharge": 0.9,
    "wheelingChargePerKWh": 0.38,
    "transmissionChargePerKWh": 0.44,
    "sldcFeesPerDay": 900,
    "electricityDutyPct": 6,
    "bankingChargePct": 3,
    "bankingType": "Monthly banking (3% loss)",
    "todSlabs": [
      {
        "name": "Night",
        "startHour": 22,
        "endHour": 6,
        "surchargePct": -15,
        "label": "22:00 - 06:00 (-15% Off-Peak Rebate)"
      },
      {
        "name": "Peak",
        "startHour": 17,
        "endHour": 22,
        "surchargePct": 15,
        "label": "17:00 - 22:00 (+15% Peak Surcharge)"
      },
      {
        "name": "Normal",
        "startHour": 6,
        "endHour": 17,
        "surchargePct": 0,
        "label": "06:00 - 17:00 (Normal Tariff)"
      }
    ],
    "captiveExemptions": {
      "cssExempt": true,
      "asExempt": true,
      "rule3EquityMinPct": 26,
      "rule3ConsumptionMinPct": 51
    },
    "transmissionLossesByVoltage": {
      "11": 7.5,
      "22": 6.2,
      "33": 5.2,
      "66": 4.2,
      "110": 3.8,
      "132": 3.6
    },
    "policyNotes": "Hilly terrain distribution network with higher technical distribution losses."
  },
  "meghalaya": {
    "stateName": "Meghalaya",
    "regulator": "MSERC",
    "sldcName": "MEGHALAYA SLDC (MEPTCL, SHILLONG)",
    "regulationName": "MSERC (Deviation Settlement Mechanism & OA) Regulations",
    "netMeteringCapKW": 1000,
    "netMeteringCapPctSanctioned": 100,
    "concurrentNetMeteringOA": false,
    "btmZeroExportAllowed": true,
    "rprMandatory": true,
    "baseIndustrialTariff": 7.2,
    "openAccessPpaRate": 3.75,
    "dsmToleranceBandPct": 12,
    "dsmReferenceRate": 3.4,
    "penaltyTiers": [
      {
        "minDeviationPct": 0,
        "maxDeviationPct": 12,
        "penaltyFactor": 0,
        "label": "Band 1: Free Tolerance (±12%)"
      },
      {
        "minDeviationPct": 12,
        "maxDeviationPct": 25,
        "penaltyFactor": 0.12,
        "label": "Band 2: 12% - 25% (12% Surcharge)"
      },
      {
        "minDeviationPct": 25,
        "maxDeviationPct": 999,
        "penaltyFactor": 0.25,
        "label": "Band 3: > 25% (25% Surcharge)"
      }
    ],
    "inadvertentExportPenaltyRate": 1.7,
    "contractDemandExceedancePenaltyMultiplier": 1.45,
    "crossSubsidySurcharge": 1.6,
    "additionalSurcharge": 1.05,
    "wheelingChargePerKWh": 0.4,
    "transmissionChargePerKWh": 0.46,
    "sldcFeesPerDay": 1000,
    "electricityDutyPct": 7,
    "bankingChargePct": 3,
    "bankingType": "Monthly banking (3% loss)",
    "todSlabs": [
      {
        "name": "Night",
        "startHour": 22,
        "endHour": 6,
        "surchargePct": -15,
        "label": "22:00 - 06:00 (-15% Off-Peak Rebate)"
      },
      {
        "name": "Peak",
        "startHour": 17,
        "endHour": 22,
        "surchargePct": 18,
        "label": "17:00 - 22:00 (+18% Peak Surcharge)"
      },
      {
        "name": "Normal",
        "startHour": 6,
        "endHour": 17,
        "surchargePct": 0,
        "label": "06:00 - 17:00 (Normal Tariff)"
      }
    ],
    "captiveExemptions": {
      "cssExempt": true,
      "asExempt": true,
      "rule3EquityMinPct": 26,
      "rule3ConsumptionMinPct": 51
    },
    "transmissionLossesByVoltage": {
      "11": 7,
      "22": 5.8,
      "33": 4.8,
      "66": 3.9,
      "110": 3.5,
      "132": 3.3
    },
    "policyNotes": "Byrnihat industrial corridor is a major center for C&I OA solar adoption."
  },
  "manipur": {
    "stateName": "Manipur",
    "regulator": "JERC (Manipur & Mizoram)",
    "sldcName": "MANIPUR SLDC (MSPDCL, IMPHAL)",
    "regulationName": "JERC-M&M (Open Access & DSM) Regulations",
    "netMeteringCapKW": 500,
    "netMeteringCapPctSanctioned": 80,
    "concurrentNetMeteringOA": false,
    "btmZeroExportAllowed": true,
    "rprMandatory": true,
    "baseIndustrialTariff": 7.1,
    "openAccessPpaRate": 3.7,
    "dsmToleranceBandPct": 15,
    "dsmReferenceRate": 3.3,
    "penaltyTiers": [
      {
        "minDeviationPct": 0,
        "maxDeviationPct": 15,
        "penaltyFactor": 0,
        "label": "Band 1: Free Tolerance (±15%)"
      },
      {
        "minDeviationPct": 15,
        "maxDeviationPct": 30,
        "penaltyFactor": 0.1,
        "label": "Band 2: 15% - 30% (10% Surcharge)"
      },
      {
        "minDeviationPct": 30,
        "maxDeviationPct": 999,
        "penaltyFactor": 0.22,
        "label": "Band 3: > 30% (22% Surcharge)"
      }
    ],
    "inadvertentExportPenaltyRate": 1.65,
    "contractDemandExceedancePenaltyMultiplier": 1.4,
    "crossSubsidySurcharge": 1.45,
    "additionalSurcharge": 0.95,
    "wheelingChargePerKWh": 0.42,
    "transmissionChargePerKWh": 0.48,
    "sldcFeesPerDay": 850,
    "electricityDutyPct": 6,
    "bankingChargePct": 3,
    "bankingType": "Monthly banking (3% loss)",
    "todSlabs": [
      {
        "name": "Night",
        "startHour": 22,
        "endHour": 6,
        "surchargePct": -12,
        "label": "22:00 - 06:00 (-12% Off-Peak Rebate)"
      },
      {
        "name": "Peak",
        "startHour": 17,
        "endHour": 22,
        "surchargePct": 15,
        "label": "17:00 - 22:00 (+15% Peak Surcharge)"
      },
      {
        "name": "Normal",
        "startHour": 6,
        "endHour": 17,
        "surchargePct": 0,
        "label": "06:00 - 17:00 (Normal Tariff)"
      }
    ],
    "captiveExemptions": {
      "cssExempt": true,
      "asExempt": true,
      "rule3EquityMinPct": 26,
      "rule3ConsumptionMinPct": 51
    },
    "transmissionLossesByVoltage": {
      "11": 7.4,
      "22": 5.9,
      "33": 5.1,
      "66": 4.1,
      "110": 3.6,
      "132": 3.5
    },
    "policyNotes": "Joint regulatory commission with Mizoram."
  },
  "mizoram": {
    "stateName": "Mizoram",
    "regulator": "JERC (Manipur & Mizoram)",
    "sldcName": "MIZORAM SLDC (POWER & ELECTRICITY DEPT, AIZAWL)",
    "regulationName": "JERC-M&M (Open Access & DSM) Regulations",
    "netMeteringCapKW": 500,
    "netMeteringCapPctSanctioned": 80,
    "concurrentNetMeteringOA": false,
    "btmZeroExportAllowed": true,
    "rprMandatory": true,
    "baseIndustrialTariff": 7,
    "openAccessPpaRate": 3.65,
    "dsmToleranceBandPct": 15,
    "dsmReferenceRate": 3.25,
    "penaltyTiers": [
      {
        "minDeviationPct": 0,
        "maxDeviationPct": 15,
        "penaltyFactor": 0,
        "label": "Band 1: Free Tolerance (±15%)"
      },
      {
        "minDeviationPct": 15,
        "maxDeviationPct": 30,
        "penaltyFactor": 0.1,
        "label": "Band 2: 15% - 30% (10% Surcharge)"
      },
      {
        "minDeviationPct": 30,
        "maxDeviationPct": 999,
        "penaltyFactor": 0.22,
        "label": "Band 3: > 30% (22% Surcharge)"
      }
    ],
    "inadvertentExportPenaltyRate": 1.6,
    "contractDemandExceedancePenaltyMultiplier": 1.4,
    "crossSubsidySurcharge": 1.4,
    "additionalSurcharge": 0.9,
    "wheelingChargePerKWh": 0.4,
    "transmissionChargePerKWh": 0.45,
    "sldcFeesPerDay": 800,
    "electricityDutyPct": 5.5,
    "bankingChargePct": 3,
    "bankingType": "Monthly banking (3% loss)",
    "todSlabs": [
      {
        "name": "Night",
        "startHour": 22,
        "endHour": 6,
        "surchargePct": -12,
        "label": "22:00 - 06:00 (-12% Off-Peak Rebate)"
      },
      {
        "name": "Peak",
        "startHour": 17,
        "endHour": 22,
        "surchargePct": 15,
        "label": "17:00 - 22:00 (+15% Peak Surcharge)"
      },
      {
        "name": "Normal",
        "startHour": 6,
        "endHour": 17,
        "surchargePct": 0,
        "label": "06:00 - 17:00 (Normal Tariff)"
      }
    ],
    "captiveExemptions": {
      "cssExempt": true,
      "asExempt": true,
      "rule3EquityMinPct": 26,
      "rule3ConsumptionMinPct": 51
    },
    "transmissionLossesByVoltage": {
      "11": 7.2,
      "22": 6,
      "33": 5,
      "66": 4.2,
      "110": 3.7,
      "132": 3.4
    },
    "policyNotes": "Promotion of distributed rooftop and hydro-solar hybrid microgrids."
  },
  "nagaland": {
    "stateName": "Nagaland",
    "regulator": "NERC",
    "sldcName": "NAGALAND SLDC (KOHIMA / DIMAPUR)",
    "regulationName": "NERC (Open Access & DSM) Regulations",
    "netMeteringCapKW": 500,
    "netMeteringCapPctSanctioned": 80,
    "concurrentNetMeteringOA": false,
    "btmZeroExportAllowed": true,
    "rprMandatory": true,
    "baseIndustrialTariff": 7.15,
    "openAccessPpaRate": 3.7,
    "dsmToleranceBandPct": 15,
    "dsmReferenceRate": 3.3,
    "penaltyTiers": [
      {
        "minDeviationPct": 0,
        "maxDeviationPct": 15,
        "penaltyFactor": 0,
        "label": "Band 1: Free Tolerance (±15%)"
      },
      {
        "minDeviationPct": 15,
        "maxDeviationPct": 30,
        "penaltyFactor": 0.1,
        "label": "Band 2: 15% - 30% (10% Surcharge)"
      },
      {
        "minDeviationPct": 30,
        "maxDeviationPct": 999,
        "penaltyFactor": 0.22,
        "label": "Band 3: > 30% (22% Surcharge)"
      }
    ],
    "inadvertentExportPenaltyRate": 1.65,
    "contractDemandExceedancePenaltyMultiplier": 1.4,
    "crossSubsidySurcharge": 1.45,
    "additionalSurcharge": 0.95,
    "wheelingChargePerKWh": 0.42,
    "transmissionChargePerKWh": 0.48,
    "sldcFeesPerDay": 850,
    "electricityDutyPct": 6,
    "bankingChargePct": 3,
    "bankingType": "Monthly banking (3% loss)",
    "todSlabs": [
      {
        "name": "Night",
        "startHour": 22,
        "endHour": 6,
        "surchargePct": -12,
        "label": "22:00 - 06:00 (-12% Off-Peak Rebate)"
      },
      {
        "name": "Peak",
        "startHour": 17,
        "endHour": 22,
        "surchargePct": 15,
        "label": "17:00 - 22:00 (+15% Peak Surcharge)"
      },
      {
        "name": "Normal",
        "startHour": 6,
        "endHour": 17,
        "surchargePct": 0,
        "label": "06:00 - 17:00 (Normal Tariff)"
      }
    ],
    "captiveExemptions": {
      "cssExempt": true,
      "asExempt": true,
      "rule3EquityMinPct": 26,
      "rule3ConsumptionMinPct": 51
    },
    "transmissionLossesByVoltage": {
      "11": 7.6,
      "22": 6.4,
      "33": 5.3,
      "66": 4.3,
      "110": 3.9,
      "132": 3.6
    },
    "policyNotes": "Dimapur industrial belt is the primary consumer for C&I OA."
  },
  "tripura": {
    "stateName": "Tripura",
    "regulator": "TERC",
    "sldcName": "TRIPURA SLDC (TSECL, AGARTALA)",
    "regulationName": "TERC (Deviation Settlement Mechanism & OA) Regulations",
    "netMeteringCapKW": 1000,
    "netMeteringCapPctSanctioned": 100,
    "concurrentNetMeteringOA": false,
    "btmZeroExportAllowed": true,
    "rprMandatory": true,
    "baseIndustrialTariff": 7.25,
    "openAccessPpaRate": 3.75,
    "dsmToleranceBandPct": 12,
    "dsmReferenceRate": 3.4,
    "penaltyTiers": [
      {
        "minDeviationPct": 0,
        "maxDeviationPct": 12,
        "penaltyFactor": 0,
        "label": "Band 1: Free Tolerance (±12%)"
      },
      {
        "minDeviationPct": 12,
        "maxDeviationPct": 25,
        "penaltyFactor": 0.12,
        "label": "Band 2: 12% - 25% (12% Surcharge)"
      },
      {
        "minDeviationPct": 25,
        "maxDeviationPct": 999,
        "penaltyFactor": 0.24,
        "label": "Band 3: > 25% (24% Surcharge)"
      }
    ],
    "inadvertentExportPenaltyRate": 1.7,
    "contractDemandExceedancePenaltyMultiplier": 1.45,
    "crossSubsidySurcharge": 1.5,
    "additionalSurcharge": 1,
    "wheelingChargePerKWh": 0.38,
    "transmissionChargePerKWh": 0.44,
    "sldcFeesPerDay": 900,
    "electricityDutyPct": 6.5,
    "bankingChargePct": 2.5,
    "bankingType": "Monthly banking (2.5% loss)",
    "todSlabs": [
      {
        "name": "Night",
        "startHour": 22,
        "endHour": 6,
        "surchargePct": -15,
        "label": "22:00 - 06:00 (-15% Off-Peak Rebate)"
      },
      {
        "name": "Peak",
        "startHour": 17,
        "endHour": 22,
        "surchargePct": 18,
        "label": "17:00 - 22:00 (+18% Peak Surcharge)"
      },
      {
        "name": "Normal",
        "startHour": 6,
        "endHour": 17,
        "surchargePct": 0,
        "label": "06:00 - 17:00 (Normal Tariff)"
      }
    ],
    "captiveExemptions": {
      "cssExempt": true,
      "asExempt": true,
      "rule3EquityMinPct": 26,
      "rule3ConsumptionMinPct": 51
    },
    "transmissionLossesByVoltage": {
      "11": 6.9,
      "22": 5.7,
      "33": 4.7,
      "66": 3.8,
      "110": 3.4,
      "132": 3.2
    },
    "policyNotes": "TERC supports solar-gas hybrid generation and open access integration."
  },
  "sikkim": {
    "stateName": "Sikkim",
    "regulator": "SSERC",
    "sldcName": "SIKKIM SLDC (ENERGY & POWER DEPT, GANGTOK)",
    "regulationName": "SSERC (Open Access in Transmission & Distribution) Regulations",
    "netMeteringCapKW": 500,
    "netMeteringCapPctSanctioned": 80,
    "concurrentNetMeteringOA": false,
    "btmZeroExportAllowed": true,
    "rprMandatory": true,
    "baseIndustrialTariff": 6.75,
    "openAccessPpaRate": 3.5,
    "dsmToleranceBandPct": 15,
    "dsmReferenceRate": 3.2,
    "penaltyTiers": [
      {
        "minDeviationPct": 0,
        "maxDeviationPct": 15,
        "penaltyFactor": 0,
        "label": "Band 1: Free Tolerance (±15%)"
      },
      {
        "minDeviationPct": 15,
        "maxDeviationPct": 30,
        "penaltyFactor": 0.1,
        "label": "Band 2: 15% - 30% (10% Surcharge)"
      },
      {
        "minDeviationPct": 30,
        "maxDeviationPct": 999,
        "penaltyFactor": 0.2,
        "label": "Band 3: > 30% (20% Surcharge)"
      }
    ],
    "inadvertentExportPenaltyRate": 1.55,
    "contractDemandExceedancePenaltyMultiplier": 1.4,
    "crossSubsidySurcharge": 1.3,
    "additionalSurcharge": 0.85,
    "wheelingChargePerKWh": 0.35,
    "transmissionChargePerKWh": 0.4,
    "sldcFeesPerDay": 800,
    "electricityDutyPct": 5,
    "bankingChargePct": 2,
    "bankingType": "Monthly banking (2% loss)",
    "todSlabs": [
      {
        "name": "Night",
        "startHour": 22,
        "endHour": 6,
        "surchargePct": -15,
        "label": "22:00 - 06:00 (-15% Off-Peak Rebate)"
      },
      {
        "name": "Peak",
        "startHour": 18,
        "endHour": 22,
        "surchargePct": 15,
        "label": "18:00 - 22:00 (+15% Peak Surcharge)"
      },
      {
        "name": "Normal",
        "startHour": 6,
        "endHour": 18,
        "surchargePct": 0,
        "label": "06:00 - 18:00 (Normal Tariff)"
      }
    ],
    "captiveExemptions": {
      "cssExempt": true,
      "asExempt": true,
      "rule3EquityMinPct": 26,
      "rule3ConsumptionMinPct": 51
    },
    "transmissionLossesByVoltage": {
      "11": 6.5,
      "22": 5.4,
      "33": 4.5,
      "66": 3.6,
      "110": 3.2,
      "132": 3
    },
    "policyNotes": "Hydro-rich state with growing rooftop and pharmaceutical C&I solar interest."
  },
  "ladakh": {
    "stateName": "Ladakh (UT)",
    "regulator": "JERC (UTs)",
    "sldcName": "LADAKH POWER LOAD DESPATCH CENTRE (LPDD, LEH)",
    "regulationName": "JERC (Open Access Regulations) & Solar Development Directives",
    "netMeteringCapKW": 1000,
    "netMeteringCapPctSanctioned": 100,
    "concurrentNetMeteringOA": true,
    "btmZeroExportAllowed": true,
    "rprMandatory": false,
    "baseIndustrialTariff": 6.5,
    "openAccessPpaRate": 3.3,
    "dsmToleranceBandPct": 15,
    "dsmReferenceRate": 3.1,
    "penaltyTiers": [
      {
        "minDeviationPct": 0,
        "maxDeviationPct": 15,
        "penaltyFactor": 0,
        "label": "Band 1: Free Tolerance (±15%)"
      },
      {
        "minDeviationPct": 15,
        "maxDeviationPct": 30,
        "penaltyFactor": 0.1,
        "label": "Band 2: 15% - 30%"
      },
      {
        "minDeviationPct": 30,
        "maxDeviationPct": 999,
        "penaltyFactor": 0.2,
        "label": "Band 3: > 30%"
      }
    ],
    "inadvertentExportPenaltyRate": 1.5,
    "contractDemandExceedancePenaltyMultiplier": 1.4,
    "crossSubsidySurcharge": 1.2,
    "additionalSurcharge": 0.8,
    "wheelingChargePerKWh": 0.3,
    "transmissionChargePerKWh": 0.35,
    "sldcFeesPerDay": 800,
    "electricityDutyPct": 4,
    "bankingChargePct": 2,
    "bankingType": "Monthly banking (2% deduction)",
    "todSlabs": [
      {
        "name": "Night",
        "startHour": 22,
        "endHour": 6,
        "surchargePct": -15,
        "label": "22:00 - 06:00 (-15% Off-Peak Rebate)"
      },
      {
        "name": "Peak",
        "startHour": 18,
        "endHour": 22,
        "surchargePct": 15,
        "label": "18:00 - 22:00 (+15% Peak Surcharge)"
      },
      {
        "name": "Normal",
        "startHour": 6,
        "endHour": 18,
        "surchargePct": 0,
        "label": "06:00 - 18:00 (Normal Tariff)"
      }
    ],
    "captiveExemptions": {
      "cssExempt": true,
      "asExempt": true,
      "rule3EquityMinPct": 26,
      "rule3ConsumptionMinPct": 51
    },
    "transmissionLossesByVoltage": {
      "11": 7,
      "22": 5.8,
      "33": 4.8,
      "66": 3.8,
      "110": 3.4,
      "132": 3.2
    },
    "policyNotes": "Pang Mega Solar Hub zone with world-class DNI solar irradiance (2200+ kWh/m²)."
  },
  "andaman": {
    "stateName": "Andaman & Nicobar Islands (UT)",
    "regulator": "JERC (UTs)",
    "sldcName": "ANDAMAN & NICOBAR SLDC (ELECTRICITY DEPT, PORT BLAIR)",
    "regulationName": "JERC (Electricity Distribution & OA) Regulations",
    "netMeteringCapKW": 500,
    "netMeteringCapPctSanctioned": 80,
    "concurrentNetMeteringOA": false,
    "btmZeroExportAllowed": true,
    "rprMandatory": true,
    "baseIndustrialTariff": 8.2,
    "openAccessPpaRate": 4.5,
    "dsmToleranceBandPct": 12,
    "dsmReferenceRate": 4,
    "penaltyTiers": [
      {
        "minDeviationPct": 0,
        "maxDeviationPct": 12,
        "penaltyFactor": 0,
        "label": "Band 1: Free Tolerance (±12%)"
      },
      {
        "minDeviationPct": 12,
        "maxDeviationPct": 25,
        "penaltyFactor": 0.12,
        "label": "Band 2: 12% - 25% (12% Surcharge)"
      },
      {
        "minDeviationPct": 25,
        "maxDeviationPct": 999,
        "penaltyFactor": 0.25,
        "label": "Band 3: > 25% (25% Surcharge)"
      }
    ],
    "inadvertentExportPenaltyRate": 2.2,
    "contractDemandExceedancePenaltyMultiplier": 1.6,
    "crossSubsidySurcharge": 2.2,
    "additionalSurcharge": 1.5,
    "wheelingChargePerKWh": 0.55,
    "transmissionChargePerKWh": 0.6,
    "sldcFeesPerDay": 1000,
    "electricityDutyPct": 6,
    "bankingChargePct": 3,
    "bankingType": "Monthly banking (3% deduction)",
    "todSlabs": [
      {
        "name": "Night",
        "startHour": 22,
        "endHour": 6,
        "surchargePct": -12,
        "label": "22:00 - 06:00 (-12% Off-Peak Rebate)"
      },
      {
        "name": "Peak",
        "startHour": 17,
        "endHour": 22,
        "surchargePct": 20,
        "label": "17:00 - 22:00 (+20% Peak Surcharge)"
      },
      {
        "name": "Normal",
        "startHour": 6,
        "endHour": 17,
        "surchargePct": 0,
        "label": "06:00 - 17:00 (Normal Tariff)"
      }
    ],
    "captiveExemptions": {
      "cssExempt": true,
      "asExempt": true,
      "rule3EquityMinPct": 26,
      "rule3ConsumptionMinPct": 51
    },
    "transmissionLossesByVoltage": {
      "11": 6.8,
      "22": 5.6,
      "33": 4.6,
      "66": 3.7,
      "110": 3.2,
      "132": 2.8
    },
    "policyNotes": "Island grid system with high diesel displacement value for rooftop solar."
  },
  "lakshadweep": {
    "stateName": "Lakshadweep (UT)",
    "regulator": "JERC (UTs)",
    "sldcName": "LAKSHADWEEP SLDC (ELECTRICITY DEPT, KAVARATTI)",
    "regulationName": "JERC (Distribution & Green Power) Regulations",
    "netMeteringCapKW": 250,
    "netMeteringCapPctSanctioned": 80,
    "concurrentNetMeteringOA": false,
    "btmZeroExportAllowed": true,
    "rprMandatory": true,
    "baseIndustrialTariff": 8.5,
    "openAccessPpaRate": 4.8,
    "dsmToleranceBandPct": 15,
    "dsmReferenceRate": 4.2,
    "penaltyTiers": [
      {
        "minDeviationPct": 0,
        "maxDeviationPct": 15,
        "penaltyFactor": 0,
        "label": "Band 1: Free Tolerance (±15%)"
      },
      {
        "minDeviationPct": 15,
        "maxDeviationPct": 30,
        "penaltyFactor": 0.12,
        "label": "Band 2: 15% - 30% (12% Surcharge)"
      },
      {
        "minDeviationPct": 30,
        "maxDeviationPct": 999,
        "penaltyFactor": 0.25,
        "label": "Band 3: > 30% (25% Surcharge)"
      }
    ],
    "inadvertentExportPenaltyRate": 2.5,
    "contractDemandExceedancePenaltyMultiplier": 1.6,
    "crossSubsidySurcharge": 2.3,
    "additionalSurcharge": 1.6,
    "wheelingChargePerKWh": 0.6,
    "transmissionChargePerKWh": 0.65,
    "sldcFeesPerDay": 800,
    "electricityDutyPct": 5,
    "bankingChargePct": 3,
    "bankingType": "Monthly banking (3% deduction)",
    "todSlabs": [
      {
        "name": "Night",
        "startHour": 22,
        "endHour": 6,
        "surchargePct": -10,
        "label": "22:00 - 06:00 (-10% Off-Peak Rebate)"
      },
      {
        "name": "Peak",
        "startHour": 18,
        "endHour": 22,
        "surchargePct": 18,
        "label": "18:00 - 22:00 (+18% Peak Surcharge)"
      },
      {
        "name": "Normal",
        "startHour": 6,
        "endHour": 18,
        "surchargePct": 0,
        "label": "06:00 - 18:00 (Normal Tariff)"
      }
    ],
    "captiveExemptions": {
      "cssExempt": true,
      "asExempt": true,
      "rule3EquityMinPct": 26,
      "rule3ConsumptionMinPct": 51
    },
    "transmissionLossesByVoltage": {
      "11": 6.5,
      "22": 5.4,
      "33": 4.2,
      "66": 3.5,
      "110": 3,
      "132": 2.7
    },
    "policyNotes": "Microgrid system prioritizing solar-BESS hybrid to replace diesel generation."
  }
};

const StatePolicyDirectory = {
  getPolicy: function(stateKey) {
    return STATE_POLICIES[stateKey] || STATE_POLICIES.maharashtra;
  },

  getAllStates: function() {
    return Object.keys(STATE_POLICIES).map(key => ({
      key,
      name: STATE_POLICIES[key].stateName,
      regulator: STATE_POLICIES[key].regulator,
      baseTariff: STATE_POLICIES[key].baseIndustrialTariff,
      ppaRate: STATE_POLICIES[key].openAccessPpaRate,
      dsmTolerancePct: STATE_POLICIES[key].dsmToleranceBandPct,
      netMeteringCapKW: STATE_POLICIES[key].netMeteringCapKW,
      concurrentNetMeteringOA: STATE_POLICIES[key].concurrentNetMeteringOA,
      btmZeroExportAllowed: STATE_POLICIES[key].btmZeroExportAllowed,
      rprMandatory: STATE_POLICIES[key].rprMandatory
    }));
  },

  getSettlementFrameworks: function(stateKey) {
    const p = this.getPolicy(stateKey);
    return {
      netMetering: {
        title: "Net Metering (Rooftop/BTM Solar)",
        capKW: p.netMeteringCapKW,
        capPctSanctioned: p.netMeteringCapPctSanctioned,
        concurrentOA: p.concurrentNetMeteringOA ? "Permitted concurrently" : "Prohibited / Mutually Exclusive with OA",
        rprRequired: p.rprMandatory ? "Mandatory Reverse Power Relay (Class 0.2s)" : "Optional / Standard Directional Protection",
        surplusCompensation: "APPC / DSM Reference Rate (₹" + p.dsmReferenceRate.toFixed(2) + "/kWh)",
        meteringType: "Bi-directional Export/Import Energy Meter (TOD enabled)",
        gridConnection: "Consumer LT / HT Busbar (Behind-The-Meter)",
        summary: "Under " + p.regulator + " Net Metering, solar exports credit against Discom retail consumption. Unutilized surplus is compensated at ₹" + (p.dsmReferenceRate || 3.50).toFixed(2) + "/kWh at billing year end."
      },
      geoa: {
        title: "Green Energy Open Access (GEOA - MoP Rules 2022/2023)",
        minContractDemandKW: 100,
        crossSubsidySurcharge: "₹" + Math.min(p.crossSubsidySurcharge * 1.5, p.crossSubsidySurcharge).toFixed(2) + "/kWh (Capped at 50% above applicable year surcharge)",
        additionalSurcharge: "Exempt (0.00 ₹/kWh for Green Energy OA)",
        wheelingCharge: "₹" + (p.wheelingChargePerKWh || 0.38).toFixed(2) + "/kWh",
        transmissionCharge: "₹" + (p.transmissionChargePerKWh || 0.44).toFixed(2) + "/kWh",
        bankingAllowed: "Mandatory Monthly Banking (Minimum 30% of monthly consumption)",
        bankingCharge: (p.bankingChargePct || 2.0).toFixed(1) + "% in-kind energy deduction",
        settlementCycle: "Monthly Banking (Unutilized energy lapses at month-end or paid at APPC)",
        summary: "Under Green Energy Open Access (GEOA), any C&I consumer with ≥100 kW contract demand can procure inter/intra-state green power with capped CSS and zero Additional Surcharge."
      },
      groupCaptive: {
        title: "Group Captive Solar (Electricity Rules 2005 / 2023 Rule 3)",
        equityRequirementPct: 26.0,
        consumptionRequirementPct: 51.0,
        crossSubsidySurcharge: "100% EXEMPT (₹0.00/kWh under Section 42 of Electricity Act 2003)",
        additionalSurcharge: "100% EXEMPT (₹0.00/kWh as per Supreme Court & APTEL rulings)",
        wheelingCharge: "₹" + (p.wheelingChargePerKWh || 0.38).toFixed(2) + "/kWh",
        transmissionCharge: "₹" + (p.transmissionChargePerKWh || 0.44).toFixed(2) + "/kWh",
        bankingAllowed: p.bankingType || "Monthly banking allowed",
        bankingCharge: (p.bankingChargePct || 2.0).toFixed(1) + "% in-kind deduction",
        summary: "Group Captive is the most bankable structure in " + p.stateName + ": 100% exemption from CSS (₹" + p.crossSubsidySurcharge.toFixed(2) + "/kWh) and AS (₹" + p.additionalSurcharge.toFixed(2) + "/kWh), delivering ₹" + (p.crossSubsidySurcharge + p.additionalSurcharge).toFixed(2) + "/kWh in statutory cost savings."
      },
      thirdPartyOA: {
        title: "Third-Party Open Access (Bilateral PPA)",
        equityRequirementPct: "0% (No SPV equity investment required)",
        crossSubsidySurcharge: "₹" + p.crossSubsidySurcharge.toFixed(2) + "/kWh (Full CSS Payable)",
        additionalSurcharge: "₹" + p.additionalSurcharge.toFixed(2) + "/kWh (Full AS Payable)",
        wheelingCharge: "₹" + (p.wheelingChargePerKWh || 0.38).toFixed(2) + "/kWh",
        transmissionCharge: "₹" + (p.transmissionChargePerKWh || 0.44).toFixed(2) + "/kWh",
        electricityDutyPct: (p.electricityDutyPct || 9.0).toFixed(1) + "% on landed charges",
        bankingAllowed: p.bankingType || "Monthly banking allowed with standard deductions",
        summary: "Third-Party OA carries zero equity risk but incurs full statutory surcharges (CSS + AS = ₹" + (p.crossSubsidySurcharge + p.additionalSurcharge).toFixed(2) + "/kWh), narrowing financial savings vs standard captive models."
      }
    };
  }
};

if (typeof window !== "undefined") {
  window.STATE_POLICIES = STATE_POLICIES;
  window.StatePolicyDirectory = StatePolicyDirectory;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = { STATE_POLICIES, StatePolicyDirectory };
}
