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

    // Hide external hover telemetry when cursor leaves chart canvas area
    const canvasWrapper = document.querySelector(".chart-canvas-wrapper");
    if (canvasWrapper) {
      canvasWrapper.addEventListener("mouseleave", () => {
        const telemetryBar = document.getElementById("chartHoverTelemetry");
        if (telemetryBar) {
          telemetryBar.classList.remove("active");
        }
      });
    }
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

    // Render Bankability Views (Tabs 2 - 5)
    this.ui.renderFinancialView(this.lastEvaluationResults);
    this.ui.renderLandedCostView(this.lastEvaluationResults);
    this.ui.renderBESSView(this.lastEvaluationResults);
    this.ui.renderAnnualView(this.lastEvaluationResults);

    // Trigger auto-save to ensure state persistence across sessions and shutdowns
    this.ui.triggerAutoSavePulse();
  }

  runSimulation() {
    this.recalculate();
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
            enabled: false, // Disables the in-canvas popup that was covering the graph!
            external: (context) => {
              const { tooltip } = context;
              const telemetryBar = document.getElementById("chartHoverTelemetry");
              if (!telemetryBar) return;

              if (tooltip.opacity === 0 || !tooltip.dataPoints || tooltip.dataPoints.length === 0) {
                telemetryBar.classList.remove("active");
                return;
              }

              const dataIndex = tooltip.dataPoints[0].dataIndex;
              const block = this.lastEvaluationResults && this.lastEvaluationResults.blocks
                ? this.lastEvaluationResults.blocks[dataIndex]
                : null;

              if (!block) {
                telemetryBar.classList.remove("active");
                return;
              }

              this.updateHoverTelemetry(block);
              telemetryBar.classList.add("active");
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

  updateHoverTelemetry(b) {
    if (!b) return;
    const blockNum = document.getElementById("chtBlockNum");
    const timeRange = document.getElementById("chtTimeRange");
    const loadVal = document.getElementById("chtLoad");
    const btmVal = document.getElementById("chtBTM");
    const oaVal = document.getElementById("chtOA");
    const gridVal = document.getElementById("chtGrid");
    const schedVal = document.getElementById("chtSched");
    const devVal = document.getElementById("chtDev");
    const penaltyVal = document.getElementById("chtPenalty");
    const statusVal = document.getElementById("chtStatus");

    if (blockNum) blockNum.textContent = `Block #${b.blockNumber}`;
    if (timeRange) timeRange.textContent = b.timeRange;
    if (loadVal) loadVal.textContent = `${b.actualConnectedLoad.toLocaleString()} kW`;
    if (btmVal) btmVal.textContent = `${b.actualBTMUtilized.toLocaleString()} kW`;
    if (oaVal) {
      const oaConsumed = b.actualOAConsumed !== undefined 
        ? b.actualOAConsumed 
        : Math.min(b.actualOADelivered, Math.max(0, b.actualConnectedLoad - b.actualBTMUtilized));
      const oaSurplus = b.actualOASurplus !== undefined 
        ? b.actualOASurplus 
        : Math.max(0, b.actualOADelivered - (b.actualConnectedLoad - b.actualBTMUtilized));
      if (oaSurplus > 0) {
        oaVal.textContent = `${oaConsumed.toLocaleString()} kW (+${oaSurplus.toFixed(1)} surplus)`;
        oaVal.title = `${b.actualOADelivered} kW delivered from solar park: ${oaConsumed} kW absorbed by factory, ${oaSurplus.toFixed(1)} kW surplus injected into grid`;
      } else {
        oaVal.textContent = `${oaConsumed.toLocaleString()} kW`;
        oaVal.title = `100% of delivered OA solar absorbed by plant`;
      }
    }
    if (gridVal) gridVal.textContent = `${b.actualGridDrawl.toLocaleString()} kW`;
    if (schedVal) schedVal.textContent = `(Sched: ${b.scheduledGridDrawl.toLocaleString()} kW)`;

    if (devVal) {
      const devSign = b.deviationKW > 0 ? "+" : "";
      devVal.textContent = `${devSign}${b.deviationKW.toFixed(1)} kW (${b.deviationPct.toFixed(1)}%)`;
      devVal.style.color = b.deviationKW > 0 ? "var(--status-danger)" : (b.deviationKW < 0 ? "var(--status-warning)" : "var(--text-secondary)");
    }

    if (penaltyVal) {
      if (b.blockPenaltyINR > 0) {
        penaltyVal.textContent = `₹${Math.round(b.blockPenaltyINR).toLocaleString()}`;
        penaltyVal.style.color = "var(--status-danger)";
      } else {
        penaltyVal.textContent = "₹0";
        penaltyVal.style.color = "var(--text-muted)";
      }
    }

    if (statusVal) {
      const statusMap = {
        WITHIN_BAND: 'In-Band',
        OVER_DRAWL: 'Over-Drawl',
        UNDER_DRAWL: 'Under-Drawl'
      };
      statusVal.textContent = statusMap[b.status] || b.status;
      statusVal.className = b.statusBadgeClass || "badge-ok";
    }
  }

  highlightChartBlock(blockIndex) {
    if (!this.chart) return;
    this.highlightedBlockIndex = blockIndex;
    this.chart.setActiveElements([
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
