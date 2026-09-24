# Solar-OA LoadDispatch
### Indian Solar PV 15-Minute Load Scheduling & Open Access / BTM Zero-Export Dispatch Simulator

An interactive, executive-grade web application tailored for Indian Commercial & Industrial (C&I) power consumers, energy managers, and captive solar developers.

The platform simulates 15-minute time-block (96-block) load dispatch, SERC Deviation Settlement Mechanism (DSM) penalties, and the strategic conversion of Net-Metered Rooftop Solar to Behind-The-Meter (BTM) Zero-Export when procuring Captive Open Access Solar.

---

## 🌟 Key Capabilities

1. **State SERC Regulatory Policy Matrix (`js/statePolicies.js`)**
   - Configured official regulatory frameworks across 9 major states:
     - **Maharashtra (MERC)**: 1 MW Net-Metering cap, $\pm 10\%$ DSM tolerance band, Class 0.2s RPR zero-export mandate, captive CSS & AS exemptions.
     - **Gujarat (GERC)**: 50% sanctioned load cap, $\pm 10\%$ error band, 15-minute TOD settlement, non-export certification.
     - **Karnataka (KERC)**: 500 kW cap, $\pm 10\%$ DSM band, 8.5% in-kind banking charge rules.
     - **Tamil Nadu (TNERC)**: Peak-hour TOD tariff surcharges, $\pm 10\%$ error band, dual net-metering + OA restriction.
     - **Rajasthan (RERC)**: $\pm 15\%$ wider tolerance band, solar hub transmission rules.
     - **Uttar Pradesh (UPERC)**: 10 kW cap (forcing C&I to BTM Zero-Export), $\pm 12\%$ DSM band.
     - **Haryana (HERC)**, **Telangana (TSERC)**, **Andhra Pradesh (APERC)**: Sub-transmission stability rules and penal inadvertent injection tariffs.
   - Auto-calculation of voltage-dependent transmission and wheeling losses (11 kV, 22 kV, 33 kV, 66 kV, 110/132 kV).

2. **96-Block Dispatch & BTM Zero-Export Engine (`js/solarModel.js`)**
   - 96 time-blocks (15-minute intervals across 24 hours).
   - High-fidelity solar bell curve modeling with temperature degradation and weather variation.
   - Reverse Power Relay (RPR) behavior with instant solar curtailment when solar generation exceeds instantaneous plant demand ($Export = 0$).
   - Day-ahead scheduling vs real-time drawl simulation.

3. **Deviation Settlement Mechanism (DSM) Penalty Engine (`js/dsmEngine.js`)**
   - Tiered DSM surcharge calculation when deviations exceed the SERC tolerance band ($\pm 10\%$ to $\pm 15\%$).
   - Inadvertent injection tracking: Flags unauthorized surplus solar pushed to Discom with zero credits and penal rates.
   - Contract demand breach alerts and peak demand exceedance penalties.
   - Executive financial balance sheet comparing baseline Discom cost vs hybrid solar dispatch.

4. **Multi-Mode Collapsible Sidebar & Layout**
   - **Collapsible Sidebar**:
     - Dedicated **"Collapse"** button in sidebar header.
     - Quick **"Show Sidebar"** action button when collapsed, plus `Ctrl + B` keyboard shortcut.
     - **Accordion Sections**: Each card in the sidebar can be individually folded or unfolded.
   - **Side-by-Side Analytics Split View**:
     - Load dispatch graph (~30% width) and 96-block table (~70% width) placed side-by-side.
     - 24-hour interactive slider player and instant power flow meter positioned at the bottom.
     - Synchronized compact height ensuring all components fit simultaneously within screen height without vertical scrolling.

5. **Official SLDC Print Dossier & CSV Export**
   - Customer and plant identification form (*Customer Name, Consumer ID, Plant Address, Substation/Feeder, Revision No, Signatory*).
   - Generates authentic State Load Despatch Centre (MSLDC, GUVNL SLDC, KPTCL SLDC, TANTRANSCO SLDC) regulatory compliance dossiers with statutory BTM Zero-Export certification.
   - Clean `@media print` A4 multi-page document formatting and CSV schedule download.

---

## 🚀 Quick Start

### Running Locally
No build step or Node.js server required. The project is built with Vanilla HTML5, CSS3, and JavaScript:

1. Clone or open the directory:
   ```bash
   git clone https://github.com/<your-username>/Solar-OA-LoadDispatch.git
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

## ⌨️ Shortcuts & Controls

| Shortcut / Action | Description |
| :--- | :--- |
| **`Ctrl + B`** or **`Alt + S`** or **`[`** | Toggle Sidebar Collapse / Expand |
| **Play / Pause Button** | Animate 24-Hour (1 to 96) SLDC dispatch scrub |
| **Table Row Click** | Jump timeline slider and chart highlight to that 15-minute block |
| **Scenario Quick Presets** | Test *Nominal Baseline*, *Machine Trip*, *Cloud Dip*, or *Demand Breach* |
