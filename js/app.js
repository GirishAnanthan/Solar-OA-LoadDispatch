/**
 * App Coordinator & Chart Engine
 * Initializes application modules, coordinates calculation cycles,
 * updates financial KPI cards, and renders responsive 96-block Chart.js visualizations.
 */

class SolarSchedulingApp {
  constructor() {
    this.dsmEngine = new DSMEngine();
    this.chart = null;
    this.lastEvaluationResults = null;
    this.highlightedBlockIndex = 48; // Block 49 (0-indexed 48)
  }

  init() {
    // Initialize UI controller
    this.ui = new UIController(this);

    // Initial calculation and chart setup
    this.recalculate();

    // Responsive listener for window resize and zoom level adjustments
    window.addEventListener("resize", () => {
      if (this.chart) {
        this.chart.resize();
      }
    });
  }

  /**
   * Main calculation cycle triggered on any input or slider interaction
   */
  recalculate() {
    const params = this.ui.getSimulationParams();
    const stateKey = this.ui.stateSelect.value;

    // Run DSM Simulation Engine
    this.lastEvaluationResults = this.dsmEngine.evaluateDispatch(params, stateKey);

    // Update KPI Cards
    this.updateKPICards(this.lastEvaluationResults.summary);

    // Update Project & OA Solar Capacity Master Header Banner
    this.ui.updateProjectBanner();

    // Update Chart.js Visualization
    this.updateChart(this.lastEvaluationResults);

    // Update Table View
    this.ui.renderTable(this.lastEvaluationResults);

    // Update Live Scrubber Telemetry (never scroll table or window during data input)
    this.ui.updateScrubberView(false);

    // Update PVGIS Solar Telemetry & Site Indicators
    if (this.lastEvaluationResults && this.lastEvaluationResults.solarTelemetry) {
      this.ui.updateSolarTelemetryView(this.lastEvaluationResults.solarTelemetry);
    }
  }

  updateKPICards(summary) {
    // 1. Total Daily Load
    const kpiLoadVal = document.getElementById("kpiLoadVal");
    const kpiLoadSub = document.getElementById("kpiLoadSub");
    if (kpiLoadVal) kpiLoadVal.textContent = summary.totalActualConsumptionKWh.toLocaleString();
    if (kpiLoadSub) kpiLoadSub.textContent = `Clean Energy Share: ${summary.greenEnergySharePct}%`;

    // 2. BTM Rooftop Solar (Zero-Export)
    const kpiBTMVal = document.getElementById("kpiBTMVal");
    const kpiBTMSub = document.getElementById("kpiBTMSub");
    if (kpiBTMVal) kpiBTMVal.textContent = summary.totalBTMUtilizedKWh.toLocaleString();
    if (kpiBTMSub) {
      if (summary.totalBTMCurtailedKWh > 0) {
        kpiBTMSub.innerHTML = `<span style="color: var(--solar-gold)">⚠️ ${summary.totalBTMCurtailedKWh.toLocaleString()} kWh curtailed (0-export)</span>`;
      } else {
        kpiBTMSub.textContent = "100% self-consumed (0 export)";
      }
    }

    // 3. Open Access Solar
    const kpiOAVal = document.getElementById("kpiOAVal");
    const kpiOASub = document.getElementById("kpiOASub");
    if (kpiOAVal) kpiOAVal.textContent = summary.totalOAConsumedKWh.toLocaleString();
    if (kpiOASub) kpiOASub.textContent = `PPA Rate: ₹${summary.oaPpaRate.toFixed(2)}/kWh`;

    // 4. Discom Grid Import
    const kpiGridVal = document.getElementById("kpiGridVal");
    const kpiGridSub = document.getElementById("kpiGridSub");
    if (kpiGridVal) kpiGridVal.textContent = summary.totalActualGridImportKWh.toLocaleString();
    if (kpiGridSub) kpiGridSub.textContent = `Base Tariff: ₹${summary.gridTariff.toFixed(2)}/kWh`;

    // 5. Total DSM Penalties
    const kpiPenaltyCard = document.getElementById("kpiPenaltyCard");
    const kpiPenaltyVal = document.getElementById("kpiPenaltyVal");
    const kpiPenaltySub = document.getElementById("kpiPenaltySub");
    if (kpiPenaltyVal) {
      kpiPenaltyVal.textContent = `₹${summary.dailyTotalPenaltiesINR.toLocaleString()}`;
    }
    if (kpiPenaltySub) {
      if (summary.dailyTotalPenaltiesINR > 0) {
        kpiPenaltySub.innerHTML = `<span style="color: #F87171">🚨 ${summary.penaltyBlockCount} blocks penalized</span>`;
        if (kpiPenaltyCard) kpiPenaltyCard.classList.add("has-penalty");
      } else {
        kpiPenaltySub.textContent = `✅ 100% compliant within band`;
        if (kpiPenaltyCard) kpiPenaltyCard.classList.remove("has-penalty");
      }
    }

    // 6. Net Financial Savings
    const kpiSavingsVal = document.getElementById("kpiSavingsVal");
    const kpiSavingsSub = document.getElementById("kpiSavingsSub");
    if (kpiSavingsVal) {
      kpiSavingsVal.textContent = `₹${summary.netDailySavingsINR.toLocaleString()}`;
    }
    if (kpiSavingsSub) {
      kpiSavingsSub.textContent = `${summary.savingsPct}% reduction vs baseline`;
    }
  }

  updateChart(results) {
    const blocks = results.blocks;
    const labels = blocks.map(b => b.startTime);

    const loadData = blocks.map(b => b.actualConnectedLoad);
    const btmSolarData = blocks.map(b => b.actualBTMUtilized);
    const oaSolarData = blocks.map(b => b.actualOADelivered);
    const actualGridData = blocks.map(b => b.actualGridDrawl);
    const scheduledGridData = blocks.map(b => b.scheduledGridDrawl);

    const ctx = document.getElementById("dispatchChart").getContext("2d");

    if (this.chart) {
      this.chart.data.labels = labels;
      this.chart.data.datasets[0].data = loadData;
      this.chart.data.datasets[1].data = btmSolarData;
      this.chart.data.datasets[2].data = oaSolarData;
      this.chart.data.datasets[3].data = actualGridData;
      this.chart.data.datasets[4].data = scheduledGridData;
      this.chart.update("none"); // Smooth update without jarring re-render
      return;
    }

    // Initialize Chart.js with high-aesthetic telemetry colors
    this.chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Actual Connected Load (kW)",
            data: loadData,
            borderColor: "#FFFFFF",
            borderWidth: 2.2,
            pointRadius: 0,
            pointHoverRadius: 5,
            pointHitRadius: 10,
            tension: 0.2,
            order: 1
          },
          {
            label: "BTM Rooftop Solar (kW)",
            data: btmSolarData,
            borderColor: "#F59E0B",
            backgroundColor: "rgba(245, 158, 11, 0.45)",
            borderWidth: 1.5,
            fill: true,
            pointRadius: 0,
            pointHoverRadius: 4,
            tension: 0.3,
            order: 3
          },
          {
            label: "Delivered OA Solar (kW)",
            data: oaSolarData,
            borderColor: "#10B981",
            backgroundColor: "rgba(16, 185, 129, 0.40)",
            borderWidth: 1.5,
            fill: true,
            pointRadius: 0,
            pointHoverRadius: 4,
            tension: 0.3,
            order: 4
          },
          {
            label: "Actual Grid Drawl (kW)",
            data: actualGridData,
            borderColor: "#38BDF8",
            backgroundColor: "rgba(56, 189, 248, 0.25)",
            borderWidth: 1.8,
            fill: true,
            pointRadius: 0,
            pointHoverRadius: 4,
            tension: 0.2,
            order: 2
          },
          {
            label: "Scheduled Grid Drawl (SLDC)",
            data: scheduledGridData,
            borderColor: "#94A3B8",
            borderDash: [5, 4],
            borderWidth: 1.8,
            fill: false,
            pointRadius: 0,
            pointHoverRadius: 4,
            tension: 0.2,
            order: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: "index",
          intersect: false
        },
        plugins: {
          legend: {
            display: false // Using custom external legend
          },
          tooltip: {
            backgroundColor: "rgba(14, 22, 38, 0.95)",
            titleColor: "#F8FAFC",
            bodyColor: "#94A3B8",
            borderColor: "rgba(255, 255, 255, 0.15)",
            borderWidth: 1,
            padding: 12,
            boxPadding: 6,
            usePointStyle: true,
            callbacks: {
              title: (items) => {
                const idx = items[0].dataIndex;
                const b = this.lastEvaluationResults.blocks[idx];
                return `Block #${b.blockNumber} (${b.timeRange})`;
              },
              afterBody: (items) => {
                const idx = items[0].dataIndex;
                const b = this.lastEvaluationResults.blocks[idx];
                const devSign = b.deviationKW > 0 ? "+" : "";
                return [
                  `------------------------------`,
                  `Deviation: ${devSign}${b.deviationKW} kW (${b.deviationPct}%)`,
                  `Status: ${b.status}`,
                  `Penalty: ₹${b.blockPenaltyINR.toFixed(2)}`
                ];
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: "rgba(255, 255, 255, 0.05)",
              drawBorder: false
            },
            ticks: {
              color: "#64748B",
              font: {
                family: "'Fira Code', monospace",
                size: 10
              },
              maxTicksLimit: 8,
              maxRotation: 0
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(255, 255, 255, 0.06)",
              drawBorder: false
            },
            ticks: {
              color: "#64748B",
              font: {
                family: "'Fira Code', monospace",
                size: 11
              },
              callback: (val) => `${val} kW`
            }
          }
        }
      }
    });
  }

  highlightChartBlock(blockIndex) {
    if (!this.chart) return;
    // We could trigger tooltip or point radius on the scrubbed block
    this.highlightedBlockIndex = blockIndex;
    // Highlight block on chart tooltip
    this.chart.setActiveElements([
      { datasetIndex: 0, index: blockIndex },
      { datasetIndex: 3, index: blockIndex }
    ]);
    this.chart.tooltip.setActiveElements([
      { datasetIndex: 0, index: blockIndex },
      { datasetIndex: 3, index: blockIndex }
    ]);
    this.chart.render();
  }
}

// Global bootstrap
document.addEventListener("DOMContentLoaded", () => {
  const app = new SolarSchedulingApp();
  window.solarApp = app;
  app.init();
});
