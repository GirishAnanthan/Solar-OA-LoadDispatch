# Solar-OA LoadDispatch
### Bankable Indian Solar PV 15-Minute Load Scheduling, Open Access Landed Cost & 25-Year Financial Analytics Platform

An institutional, executive-grade web application engineered for Indian Commercial & Industrial (C&I) power consumers, captive solar developers, institutional lenders (SBI, IREDA, PFC, REC), and corporate sustainability (RE100) teams.

The platform unifies 15-minute time-block (96-block) load dispatch, SERC Deviation Settlement Mechanism (DSM) penalties, authentic Open Access landed tariff waterfalls, Rule 3 captive compliance audits, BESS battery storage TOD arbitrage, and 25-year bankable project finance models.

---

## 🌟 Bankable & Institutional Architecture

```
Solar-OA-LoadDispatch/
├── index.html               # 5-Tab Executive Workspace & Bankable UI Shell
├── css/style.css            # Dark glassmorphism, responsive grid, and @media print DPR styles
└── js/
    ├── statePolicies.js     # SERC Tariff Orders (CSS, AS, Wheeling, Transmission, Banking, TOD)
    ├── solarModel.js        # 96-Block Irradiance, PVGIS Astronomical Met & Zero-Export RPR
    ├── bessModel.js         # LFP Battery Dispatch, Midday Curtailment Capture & Peak TOD Arbitrage
    ├── landedCostEngine.js  # Itemized Landed Cost Waterfall & Rule 3 Captive Auditor
    ├── financialModel.js    # 25-Year Cash Flow Statement, Newton-Raphson IRR & DSCR Engine
    ├── meterDataParser.js   # 15-Minute AMR/DLMS Smart Meter CSV Ingestion & LDC
    ├── annualModel.js       # 35,040-Block (8,760-Hr) Annual Solar Atlas & Decarbonization (ESG)
    ├── projectStorage.js    # Multi-Scenario Manager & Auto-Save Session Persistence
    ├── dprGenerator.js      # Executive 10-Page Bankable DPR Dossier & CSV Model Exporter
    ├── dsmEngine.js         # Central Dispatch Coordinator & Real-Time Settlement Engine
    ├── uiController.js      # DOM Controller, 5-Tab Navigator, Print & Scenario Modals
    └── app.js               # Application Orchestrator & Chart.js Visualization Engine
```

---

## 💼 Core Bankability Engines

### 1. SERC Open Access Landed Cost Waterfall (`js/landedCostEngine.js`)
Calculates the authentic landed cost of solar power at the consumer's factory busbar:
$$\text{Landed Cost} = \text{Base PPA} + \text{STU Transmission} + \text{Wheeling Charges} + \text{Technical Losses} + \text{CSS} + \text{AS} + \text{Banking Surcharge} + \text{SLDC Fees} + \text{Electricity Duty}$$
- **State Coverage**: Maharashtra (MERC), Gujarat (GERC), Karnataka (KERC), Tamil Nadu (TNERC), Rajasthan (RERC), Uttar Pradesh (UPERC), Haryana (HERC), Telangana (TSERC), and Andhra Pradesh (APERC).
- **Captive vs Third-Party**: Automatic statutory exemptions for Captive / Group Captive vs Third-Party IPP.

### 2. Statutory Rule 3 Captive Eligibility Audit (`js/landedCostEngine.js`)
Validates compliance against the Electricity Rules 2005 & Amendment Rules 2023:
- **Equity Ownership Criterion**: Verifies that captive consumers hold $\ge 26\%$ equity share capital with voting rights.
- **Consumption Criterion**: Verifies that captive consumers consume $\ge 51\%$ of aggregate generation annually.
- **Retrospective Liability Exposure**: Quantifies financial clawback exposure (CSS + AS on all consumed units) in the event of captive disqualification.

### 3. 25-Year Project Finance & Bankability Engine (`js/financialModel.js`)
Full pro-forma cash flow model calibrated to standard Indian renewable lending covenants (SBI / IREDA):
- **Debt-Equity & Amortization**: 70:30 debt-equity gearing, 12-year door-to-door loan repayment at 9.25% p.a.
- **Key Metrics**:
  - **Project IRR (Pre-Tax)** & **Equity IRR (Post-Tax)** via Newton-Raphson numerical polynomial solver.
  - **Minimum & Average DSCR**: Evaluated against credit committee covenants ($\text{Min DSCR} \ge 1.20\text{x}$, $\text{Avg DSCR} \ge 1.35\text{x}$).
  - **Net Present Value (NPV)** at 10% WACC.
  - **Levelized Cost of Electricity (LCOE)** in ₹/kWh.
  - **Section 32 Accelerated Depreciation**: 40% Written Down Value (WDV) tax shield modeling.

### 4. BESS Battery Storage & TOD Arbitrage Engine (`js/bessModel.js`)
- Intercepts free curtailed solar during midday (11:00–14:00) enforced by Zero-Export Reverse Power Relays.
- Discharges stored energy into the evening Time-of-Day (TOD) peak tariff window (18:00–22:00).
- Models round-trip efficiency (88%), depth-of-discharge (85%), and C-rate inverter power constraints.

### 5. Smart Meter 15-Minute Load Survey Parser (`js/meterDataParser.js`)
- Ingests raw AMR / DLMS CSV load survey exports from Secure, L&T, Schneider, and Elmeasure meters.
- Auto-detects columns, timestamps, and converts kW/kVA demand into 96-block diurnal vectors.
- Calculates Load Duration Curves (LDC) and recommends optimal BTM & OA capacity sizing.

### 6. 35,040-Block Annual Simulation & Decarbonization (`js/annualModel.js`)
- 8,760-hour / 35,040-block annual simulation incorporating Indian monsoon variations and solar insolation weights.
- Generates 12-month seasonal yield table, CUF % per season, and annual clean power share.
- Calculates Scope-2 GHG emission reductions using the Central Electricity Authority (CEA) baseline (0.82 tCO₂/MWh).

### 7. Bankable Detailed Project Report (DPR) & Financial Exporter (`js/dprGenerator.js`)
- **10-Page Executive DPR**: Complete investment memorandum formatted for bank credit appraisal committees and corporate board approvals.
- **Financial Model Exporter**: Downloads full 25-year pro-forma cash flows and DSCR tables as CSV for spreadsheet audit.

### 8. Session Auto-Save & Scenario Manager (`js/projectStorage.js`)
- **Fault-Tolerant Auto-Save**: Automatically commits inputs and simulation state to `localStorage` on every change, ensuring zero data loss across reboots or power outages.
- **Pre-Configured Benchmark Templates**: Instant loading of institutional case studies (MERC 1.5 MW Captive, GERC 3 MW + 1 MWh BESS, KERC 2 MW Third-Party).

---

## 🖥️ 5-Tab Executive Workspace

1. **Tab 1: 15-Min Dispatch & Timeline Player**
   - 96-block dispatch line chart, 15-minute timeline scrubber, real-time power flow meter, and SLDC schedule table.
2. **Tab 2: 25-Year Project Finance & DSCR**
   - Project IRR, Equity IRR, Min/Avg DSCR, NPV, LCOE, and 25-year cash flow statement.
3. **Tab 3: Landed Cost & Rule 3 Captive Audit**
   - Landed tariff waterfall table, Rule 3 compliance certificate, and retrospective CSS/AS risk metrics.
4. **Tab 4: BESS Battery Storage & TOD Arbitrage**
   - Curtailed solar capture, peak discharge volume, and annual TOD tariff arbitrage savings.
5. **Tab 5: Annual 35,040 Simulation & ESG**
   - 12-month seasonal energy balance, CUF %, and RE100 corporate decarbonization scorecard.

---

## 🚀 Quick Start

### Running Locally
No build step or Node.js server required. The project is built with Vanilla HTML5, CSS3, and JavaScript:

1. Clone or open the repository:
   ```bash
   git clone https://github.com/GirishAnanthan/Solar-OA-LoadDispatch.git
   cd Solar-OA-LoadDispatch
   ```

2. Start a local HTTP server:
   ```bash
   # Python 3
   python -m http.server 8088
   ```

3. Open in your browser:
   ```
   http://localhost:8088/
   ```
   *(Or double-click `index.html` to open directly).*

---

## ⌨️ Shortcuts & Hotkeys

| Shortcut / Action | Description |
| :--- | :--- |
| **`Ctrl + B`** or **`Alt + S`** or **`[`** | Toggle Sidebar Collapse / Expand |
| **Play / Pause Button** | Animate 24-Hour (1 to 96) SLDC dispatch timeline scrub |
| **Table Row Click** | Jump timeline slider and chart highlight to that 15-minute block |
| **Esc Key** | Dismiss active modal (DPR, Policy, SLDC Print, Scenarios) |
| **Scenario Quick Presets** | Test *Nominal Baseline*, *Machine Trip*, *Cloud Dip*, or *Demand Breach* |
