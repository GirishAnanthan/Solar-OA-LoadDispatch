/**
 * Project Scenario Persistence & Local Storage Manager
 * Enables seamless auto-saving so calculations and simulations persist
 * across browser sessions, reboots, and power shutdowns.
 * Provides multi-project scenario management and pre-configured institutional templates.
 */

class ProjectStorage {
  constructor() {
    this.STORAGE_KEY_AUTOSAVE = "solar_oa_autosave_state_v2";
    this.STORAGE_KEY_SCENARIOS = "solar_oa_saved_scenarios_v2";
    this.initDefaultTemplates();
  }

  /**
   * Institutional reference templates
   */
  initDefaultTemplates() {
    this.DEFAULT_TEMPLATES = {
      "template_maharashtra_captive": {
        id: "template_maharashtra_captive",
        name: "Apex Forgings Pune • 1.5 MW Captive + 500 kW BTM",
        description: "MERC HT-I Continuous: 500 kWp BTM Zero-Export + 1.5 MW Captive Solar Park",
        stateKey: "maharashtra",
        sanctionedLoad: 1200,
        voltageLevel: "33",
        baseConnectedLoad: 1000,
        loadProfileType: "continuous",
        rooftopCapacity: 500,
        openAccessCapacity: 1500,
        bessCapacityKWh: 0,
        bessPowerKW: 0,
        procurementType: "group_captive",
        captiveEquityPct: 26.0,
        gridTariff: 7.85,
        oaPpaRate: 3.80,
        transmissionLoss: 4.10,
        rooftopAddress: "Plot C-14, Phase-II, MIDC Chakan, Pune, Maharashtra",
        rooftopLat: 18.5204,
        rooftopLon: 73.8567,
        rooftopTilt: 19,
        oaAddress: "Bhadla Solar Park, Rajasthan",
        oaLat: 27.5385,
        oaLon: 71.9168,
        oaTracking: "fixed"
      },
      "template_gujarat_bess": {
        id: "template_gujarat_bess",
        name: "Gujarat Castings • 3.0 MW Group Captive + 1 MWh BESS",
        description: "GERC HTP-I: 1 MW BTM + 3 MW Captive + 1000 kWh BESS for TOD peak shaving",
        stateKey: "gujarat",
        sanctionedLoad: 2500,
        voltageLevel: "66",
        baseConnectedLoad: 2000,
        loadProfileType: "continuous",
        rooftopCapacity: 800,
        openAccessCapacity: 3000,
        bessCapacityKWh: 1000,
        bessPowerKW: 500,
        procurementType: "group_captive",
        captiveEquityPct: 26.0,
        gridTariff: 7.20,
        oaPpaRate: 3.65,
        transmissionLoss: 3.20,
        rooftopAddress: "GIDC Industrial Estate, Gotri, Vadodara, Gujarat",
        rooftopLat: 22.3072,
        rooftopLon: 73.1812,
        rooftopTilt: 22,
        oaAddress: "Charanka Solar Park, Patan, Gujarat",
        oaLat: 23.9067,
        oaLon: 71.2033,
        oaTracking: "tracker"
      },
      "template_karnataka_thirdparty": {
        id: "template_karnataka_thirdparty",
        name: "Bengaluru Tech Park • 2.0 MW Third-Party OA",
        description: "KERC HT-2: Commercial Day Profile, Third-Party PPA (CSS & AS applicable)",
        stateKey: "karnataka",
        sanctionedLoad: 2000,
        voltageLevel: "33",
        baseConnectedLoad: 1600,
        loadProfileType: "commercial",
        rooftopCapacity: 400,
        openAccessCapacity: 2000,
        bessCapacityKWh: 0,
        bessPowerKW: 0,
        procurementType: "third_party",
        captiveEquityPct: 0,
        gridTariff: 7.45,
        oaPpaRate: 3.95,
        transmissionLoss: 4.00,
        rooftopAddress: "Whitefield Technology Zone, Bengaluru, Karnataka",
        rooftopLat: 12.9716,
        rooftopLon: 77.5946,
        rooftopTilt: 14,
        oaAddress: "Pavagada Solar Park, Tumakuru, Karnataka",
        oaLat: 14.2833,
        oaLon: 77.2833,
        oaTracking: "tracker"
      }
    };
  }

  /**
   * Auto-saves the current live simulation state
   */
  autoSave(stateObject) {
    try {
      if (!stateObject) return;
      const payload = {
        timestamp: new Date().toISOString(),
        state: stateObject
      };
      localStorage.setItem(this.STORAGE_KEY_AUTOSAVE, JSON.stringify(payload));
    } catch (e) {
      console.warn("ProjectStorage: autoSave failed", e);
    }
  }

  /**
   * Loads the auto-saved session if present
   */
  loadAutoSave() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY_AUTOSAVE);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed.state || null;
    } catch (e) {
      console.warn("ProjectStorage: loadAutoSave failed", e);
      return null;
    }
  }

  /**
   * Saves a named scenario
   */
  saveScenario(name, stateObject) {
    try {
      const scenarios = this.getSavedScenarios();
      const id = "scen_" + Date.now();
      scenarios[id] = {
        id,
        name,
        timestamp: new Date().toISOString(),
        state: stateObject
      };
      localStorage.setItem(this.STORAGE_KEY_SCENARIOS, JSON.stringify(scenarios));
      return id;
    } catch (e) {
      console.error("ProjectStorage: saveScenario failed", e);
      return null;
    }
  }

  /**
   * Gets all custom saved scenarios
   */
  getSavedScenarios() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY_SCENARIOS);
      if (!raw) return {};
      return JSON.parse(raw);
    } catch (e) {
      return {};
    }
  }

  /**
   * Deletes a scenario
   */
  deleteScenario(id) {
    try {
      const scenarios = this.getSavedScenarios();
      delete scenarios[id];
      localStorage.setItem(this.STORAGE_KEY_SCENARIOS, JSON.stringify(scenarios));
      return true;
    } catch (e) {
      return false;
    }
  }
}

// Export to window
if (typeof window !== "undefined") {
  window.ProjectStorage = ProjectStorage;
}
