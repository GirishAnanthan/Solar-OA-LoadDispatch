/**
 * UI Controller & Interactivity Manager
 * Manages slider reactivity, 24-hr time scrubber animation, scenario presets,
 * table filtering, and CSV dispatch schedule download.
 */

class UIController {
  constructor(app) {
    this.app = app;
    this.currentScrubBlock = 49; // Default at 12:15 PM (Block 49)
    this.isPlaying = false;
    this.playbackInterval = null;
    this.currentTableFilter = "all"; // "all", "solar", "penalties"

    this.bindElements();
    this.attachEventListeners();
  }

  bindElements() {
    // Form Inputs
    this.stateSelect = document.getElementById("stateSelect");
    this.sanctionedLoadInput = document.getElementById("sanctionedLoad");
    this.voltageSelect = document.getElementById("voltageLevel");
    this.baseLoadInput = document.getElementById("baseConnectedLoad");
    this.loadProfileSelect = document.getElementById("loadProfileType");
    this.rooftopKWpInput = document.getElementById("rooftopCapacity");
    this.openAccessKWpInput = document.getElementById("openAccessCapacity");
    this.gridTariffInput = document.getElementById("gridTariff");
    this.oaPpaRateInput = document.getElementById("oaPpaRate");
    this.transmissionLossInput = document.getElementById("transmissionLoss");

    // Sliders
    this.loadSlider = document.getElementById("loadSlider");
    this.loadSliderVal = document.getElementById("loadSliderVal");
    this.loadSliderKw = document.getElementById("loadSliderKw");

    this.solarSlider = document.getElementById("solarSlider");
    this.solarSliderVal = document.getElementById("solarSliderVal");

    this.timeScrubber = document.getElementById("timeScrubber");
    this.timeScrubberLabel = document.getElementById("timeScrubberLabel");
    this.btnPlayScrubber = document.getElementById("btnPlayScrubber");
    this.btnResetScrubber = document.getElementById("btnResetScrubber");

    // Real-Time Power Flow Meter Nodes
    this.flowLoad = document.getElementById("flowLoad");
    this.flowBTM = document.getElementById("flowBTM");
    this.flowOA = document.getElementById("flowOA");
    this.flowGrid = document.getElementById("flowGrid");
    this.flowDeviation = document.getElementById("flowDeviation");
    this.flowStatusText = document.getElementById("flowStatusText");

    // Table & Filters
    this.tableBody = document.getElementById("dispatchTableBody");
    this.filterBtns = document.querySelectorAll(".filter-btn");
    this.btnExportCSV = document.getElementById("btnExportCSV");

    // Customer & Plant Identification Inputs
    this.custNameInput = document.getElementById("custName");
    this.custConsumerNoInput = document.getElementById("custConsumerNo");
    this.custAddressInput = document.getElementById("custAddress");
    this.custSubstationInput = document.getElementById("custSubstation");
    this.custScheduleRevisionSelect = document.getElementById("custScheduleRevision");
    this.custScheduleDateInput = document.getElementById("custScheduleDate");
    this.custSignatoryInput = document.getElementById("custSignatory");

    // Initialize Default Schedule Date to Tomorrow (Day-Ahead)
    if (this.custScheduleDateInput && !this.custScheduleDateInput.value) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      this.custScheduleDateInput.value = tomorrow.toISOString().split("T")[0];
    }

    // Print Buttons & Modals
    this.btnPrintSchedule = document.getElementById("btnPrintSchedule");
    this.btnQuickPrintSidebar = document.getElementById("btnQuickPrintSidebar");
    this.btnPrintScheduleTable = document.getElementById("btnPrintScheduleTable");
    this.printModal = document.getElementById("printModal");
    this.btnClosePrintModal = document.getElementById("btnClosePrintModal");
    this.btnExecutePrint = document.getElementById("btnExecutePrint");
    this.printPreviewContainer = document.getElementById("printPreviewContainer");
    this.sldcPrintDossier = document.getElementById("sldcPrintDossier");

    // Sidebar Collapse Elements
    this.mainWrapper = document.querySelector(".main-wrapper");
    this.btnToggleSidebar = document.getElementById("btnToggleSidebar");
    this.textToggleSidebar = document.getElementById("textToggleSidebar");
    this.iconSidebarToggle = document.getElementById("iconSidebarToggle");
    this.btnCollapseSidebarInside = document.getElementById("btnCollapseSidebarInside");
    this.btnCollapseSidebarMain = document.getElementById("btnCollapseSidebarMain");
    this.btnFloatingExpandSidebar = document.getElementById("btnFloatingExpandSidebar");
    this.btnDockedExpandSidebar = document.getElementById("btnDockedExpandSidebar");

    // Modal
    this.btnPolicyModal = document.getElementById("btnPolicyModal");
    this.btnCloseModal = document.getElementById("btnCloseModal");
    this.policyModal = document.getElementById("policyModal");

    // State Policy Info Card elements
    this.policyCalloutTitle = document.getElementById("policyCalloutTitle");
    this.policyCalloutDesc = document.getElementById("policyCalloutDesc");
    this.policyMetaNetCap = document.getElementById("policyMetaNetCap");
    this.policyMetaErrorBand = document.getElementById("policyMetaErrorBand");
    this.policyMetaLoss = document.getElementById("policyMetaLoss");
    this.policyMetaTariff = document.getElementById("policyMetaTariff");
  }

  attachEventListeners() {
    // Sidebar Collapse Toggle
    const toggleSidebar = (forceState = null) => {
      if (!this.mainWrapper) return;
      let isCollapsed;
      if (typeof forceState === "boolean") {
        if (forceState) {
          this.mainWrapper.classList.add("sidebar-collapsed");
          isCollapsed = true;
        } else {
          this.mainWrapper.classList.remove("sidebar-collapsed");
          isCollapsed = false;
        }
      } else {
        isCollapsed = this.mainWrapper.classList.toggle("sidebar-collapsed");
      }

      if (this.textToggleSidebar) {
        this.textToggleSidebar.textContent = isCollapsed ? "Show Sidebar" : "Hide Sidebar";
      }
      if (this.btnToggleSidebar) {
        this.btnToggleSidebar.title = isCollapsed ? "Expand Configuration Sidebar (Ctrl + B)" : "Collapse Configuration Sidebar (Ctrl + B)";
        if (isCollapsed) {
          this.btnToggleSidebar.classList.add("primary");
        } else {
          this.btnToggleSidebar.classList.remove("primary");
        }
      }

      // Persist state in localStorage
      try {
        localStorage.setItem("solar_oa_sidebar_collapsed", isCollapsed ? "1" : "0");
      } catch (err) {
        // Safe fallback
      }

      // Re-render chart to immediately fill full width
      setTimeout(() => {
        if (this.app && this.app.chart) {
          this.app.chart.resize();
        }
      }, 300);
    };

    // Restore saved collapse state if any
    try {
      if (localStorage.getItem("solar_oa_sidebar_collapsed") === "1") {
        toggleSidebar(true);
      }
    } catch (e) {}

    if (this.btnToggleSidebar) {
      this.btnToggleSidebar.addEventListener("click", () => toggleSidebar());
    }
    if (this.btnCollapseSidebarInside) {
      this.btnCollapseSidebarInside.addEventListener("click", () => toggleSidebar(true));
    }
    if (this.btnCollapseSidebarMain) {
      this.btnCollapseSidebarMain.addEventListener("click", () => toggleSidebar(true));
    }
    if (this.btnFloatingExpandSidebar) {
      this.btnFloatingExpandSidebar.addEventListener("click", () => toggleSidebar(false));
    }
    if (this.btnDockedExpandSidebar) {
      this.btnDockedExpandSidebar.addEventListener("click", () => toggleSidebar(false));
    }

    // Keyboard shortcut (Ctrl + B or Alt + S or [) to toggle sidebar
    window.addEventListener("keydown", (e) => {
      // Don't trigger if user is typing in an input or textarea
      if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.tagName === "SELECT")) {
        return;
      }
      if ((e.ctrlKey && (e.key === "b" || e.key === "B")) || (e.altKey && (e.key === "s" || e.key === "S")) || e.key === "[") {
        e.preventDefault();
        toggleSidebar();
      }
    });

    // Accordion Toggle for Individual Sidebar Cards
    document.querySelectorAll(".panel-accordion-header").forEach(header => {
      header.addEventListener("click", (e) => {
        // Ignore if user clicked a button inside header (e.g. print or collapse sidebar)
        if (e.target.closest("button:not(.btn-panel-accordion)")) return;
        const panel = header.closest(".glass-panel");
        if (panel) {
          panel.classList.toggle("panel-collapsed");
        }
      });
    });

    // State Selection Change
    this.stateSelect.addEventListener("change", () => {
      this.handleStateChange();
      this.app.recalculate();
    });

    // Voltage Level Change
    this.voltageSelect.addEventListener("change", () => {
      this.updateLossFromVoltage();
      this.app.recalculate();
    });

    // Form inputs change
    const triggerInputs = [
      this.sanctionedLoadInput,
      this.baseLoadInput,
      this.loadProfileSelect,
      this.rooftopKWpInput,
      this.openAccessKWpInput,
      this.gridTariffInput,
      this.oaPpaRateInput,
      this.transmissionLossInput
    ];

    triggerInputs.forEach(input => {
      if (input) {
        input.addEventListener("input", () => {
          this.updateSliderKwLabel();
          this.app.recalculate();
        });
      }
    });

    // Interactive Sliders
    this.loadSlider.addEventListener("input", (e) => {
      const val = parseFloat(e.target.value);
      this.loadSliderVal.textContent = `${val}%`;
      this.updateSliderKwLabel();
      this.clearScenarioActive();
      this.app.recalculate();
    });

    this.solarSlider.addEventListener("input", (e) => {
      const val = parseFloat(e.target.value);
      this.solarSliderVal.textContent = `${val}%`;
      this.clearScenarioActive();
      this.app.recalculate();
    });

    // 24-Hour Time Scrubber
    this.timeScrubber.addEventListener("input", (e) => {
      this.currentScrubBlock = parseInt(e.target.value, 10);
      this.updateScrubberView();
    });

    // Play/Pause Scrubber
    this.btnPlayScrubber.addEventListener("click", () => {
      this.togglePlayScrubber();
    });

    // Reset Scrubber
    this.btnResetScrubber.addEventListener("click", () => {
      this.pauseScrubber();
      this.currentScrubBlock = 49;
      this.timeScrubber.value = 49;
      this.updateScrubberView();
    });

    // Scenario Presets
    document.querySelectorAll(".btn-scenario").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const scenario = e.currentTarget.getAttribute("data-scenario");
        this.applyScenario(scenario, e.currentTarget);
      });
    });

    // Table Filters
    this.filterBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        this.filterBtns.forEach(b => b.classList.remove("active"));
        e.currentTarget.classList.add("active");
        this.currentTableFilter = e.currentTarget.getAttribute("data-filter");
        this.renderTable(this.app.lastEvaluationResults);
      });
    });

    // Export CSV
    this.btnExportCSV.addEventListener("click", () => {
      this.exportDispatchScheduleCSV();
    });

    // Policy Modal
    this.btnPolicyModal.addEventListener("click", () => {
      this.policyModal.classList.add("active");
      this.populatePolicyModal();
    });

    this.btnCloseModal.addEventListener("click", () => {
      this.policyModal.classList.remove("active");
    });

    this.policyModal.addEventListener("click", (e) => {
      if (e.target === this.policyModal) {
        this.policyModal.classList.remove("active");
      }
    });

    // Print SLDC Schedule Buttons
    if (this.btnPrintSchedule) {
      this.btnPrintSchedule.addEventListener("click", () => this.openPrintModal());
    }
    if (this.btnQuickPrintSidebar) {
      this.btnQuickPrintSidebar.addEventListener("click", () => this.openPrintModal());
    }
    if (this.btnPrintScheduleTable) {
      this.btnPrintScheduleTable.addEventListener("click", () => this.openPrintModal());
    }

    // Print Modal Actions
    if (this.btnClosePrintModal) {
      this.btnClosePrintModal.addEventListener("click", () => {
        this.printModal.classList.remove("active");
      });
    }

    if (this.btnExecutePrint) {
      this.btnExecutePrint.addEventListener("click", () => {
        this.executePrint();
      });
    }

    if (this.printModal) {
      this.printModal.addEventListener("click", (e) => {
        if (e.target === this.printModal) {
          this.printModal.classList.remove("active");
        }
      });
    }

    // Initialize State Defaults
    this.handleStateChange();
  }

  handleStateChange() {
    const stateKey = this.stateSelect.value;
    const policy = STATE_POLICIES[stateKey];
    if (!policy) return;

    // Auto-update state specific defaults
    this.gridTariffInput.value = policy.baseIndustrialTariff.toFixed(2);
    this.oaPpaRateInput.value = policy.openAccessPpaRate.toFixed(2);

    this.updateLossFromVoltage();

    // Update Sidebar State Info Box
    this.policyCalloutTitle.textContent = `${policy.stateName} (${policy.regulator})`;
    this.policyCalloutDesc.textContent = policy.policyNotes;
    this.policyMetaNetCap.textContent = `${policy.netMeteringCapKW} kW / ${policy.netMeteringCapPctSanctioned}%`;
    this.policyMetaErrorBand.textContent = `±${policy.dsmToleranceBandPct.toFixed(1)}% (SERC DSM)`;
    this.policyMetaTariff.textContent = `₹${policy.baseIndustrialTariff.toFixed(2)}/kWh`;

    // Update active badge in header
    const headerStateBadge = document.getElementById("headerStateBadge");
    if (headerStateBadge) {
      headerStateBadge.textContent = `${policy.regulator} Regulations (${policy.stateName})`;
    }
  }

  updateLossFromVoltage() {
    const stateKey = this.stateSelect.value;
    const policy = STATE_POLICIES[stateKey];
    const voltage = this.voltageSelect.value;
    if (policy && policy.transmissionLossesByVoltage[voltage]) {
      this.transmissionLossInput.value = policy.transmissionLossesByVoltage[voltage].toFixed(2);
      this.policyMetaLoss.textContent = `${policy.transmissionLossesByVoltage[voltage].toFixed(2)}% (${voltage} kV)`;
    }
  }

  updateSliderKwLabel() {
    const baseKw = parseFloat(this.baseLoadInput.value) || 1000;
    const multiplier = parseFloat(this.loadSlider.value) / 100;
    const actualKw = Math.round(baseKw * multiplier);
    this.loadSliderKw.textContent = `(${actualKw} kW)`;
  }

  applyScenario(scenarioType, buttonElement) {
    document.querySelectorAll(".btn-scenario").forEach(b => b.classList.remove("active"));
    if (buttonElement) buttonElement.classList.add("active");

    switch (scenarioType) {
      case "normal":
        this.loadSlider.value = 100;
        this.solarSlider.value = 100;
        this.currentScrubBlock = 49; // 12:15 PM
        break;
      case "trip":
        // Sudden machine trip: factory drops to 45% load during solar peak!
        this.loadSlider.value = 45;
        this.solarSlider.value = 100;
        this.currentScrubBlock = 50; // 12:30 PM
        break;
      case "cloud":
        // Sudden cloud transient: solar plummets to 30% while factory runs at 105%
        this.loadSlider.value = 105;
        this.solarSlider.value = 30;
        this.currentScrubBlock = 52; // 13:00 PM
        break;
      case "spike":
        // Over-capacity load spike: factory surges to 135% exceeding contract demand
        this.loadSlider.value = 135;
        this.solarSlider.value = 100;
        this.currentScrubBlock = 56; // 14:00 PM
        break;
    }

    this.loadSliderVal.textContent = `${this.loadSlider.value}%`;
    this.solarSliderVal.textContent = `${this.solarSlider.value}%`;
    this.timeScrubber.value = this.currentScrubBlock;
    this.updateSliderKwLabel();

    this.app.recalculate();
    this.updateScrubberView();
  }

  clearScenarioActive() {
    document.querySelectorAll(".btn-scenario").forEach(b => b.classList.remove("active"));
  }

  togglePlayScrubber() {
    if (this.isPlaying) {
      this.pauseScrubber();
    } else {
      this.startPlayScrubber();
    }
  }

  startPlayScrubber() {
    this.isPlaying = true;
    this.btnPlayScrubber.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`;
    
    this.playbackInterval = setInterval(() => {
      this.currentScrubBlock++;
      if (this.currentScrubBlock > 96) {
        this.currentScrubBlock = 1;
      }
      this.timeScrubber.value = this.currentScrubBlock;
      this.updateScrubberView();
    }, 180);
  }

  pauseScrubber() {
    this.isPlaying = false;
    this.btnPlayScrubber.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;
    if (this.playbackInterval) {
      clearInterval(this.playbackInterval);
      this.playbackInterval = null;
    }
  }

  updateScrubberView() {
    if (!this.app.lastEvaluationResults) return;
    const blocks = this.app.lastEvaluationResults.blocks;
    const blockIndex = this.currentScrubBlock - 1;
    const currentBlock = blocks[blockIndex];
    if (!currentBlock) return;

    // Update label
    this.timeScrubberLabel.textContent = `Block ${currentBlock.blockNumber}/96 (${currentBlock.timeRange})`;

    // Update Real-Time Power Flow Meter Nodes
    this.flowLoad.textContent = `${currentBlock.actualConnectedLoad.toLocaleString()} kW`;
    this.flowBTM.textContent = `${currentBlock.actualBTMUtilized.toLocaleString()} kW`;
    this.flowOA.textContent = `${currentBlock.actualOADelivered.toLocaleString()} kW`;
    this.flowGrid.textContent = `${currentBlock.actualGridDrawl.toLocaleString()} kW`;

    const dev = currentBlock.deviationKW;
    const devSign = dev > 0 ? "+" : "";
    this.flowDeviation.textContent = `${devSign}${dev.toFixed(1)} kW (${currentBlock.deviationPct.toFixed(1)}%)`;

    // Highlight alerts on flow nodes
    const btmNode = this.flowBTM.parentElement;
    const gridNode = this.flowGrid.parentElement;
    const devNode = this.flowDeviation.parentElement;

    if (currentBlock.actualBTMCurtailed > 0) {
      btmNode.classList.add("zero-export-alert");
      this.flowStatusText.innerHTML = `<span style="color: var(--solar-gold)">⚠️ Zero-Export Relay Active:</span> Curtailed ${currentBlock.actualBTMCurtailed} kW rooftop solar to protect grid.`;
    } else {
      btmNode.classList.remove("zero-export-alert");
    }

    if (currentBlock.status === "OVER_DRAWL") {
      gridNode.classList.add("overdrawl-alert");
      devNode.style.color = "var(--status-danger)";
      this.flowStatusText.innerHTML = `<span style="color: var(--status-danger)">🚨 Over-drawl Alert:</span> Grid drawl exceeds schedule by ${dev.toFixed(1)} kW. Penalty: ₹${currentBlock.blockPenaltyINR.toFixed(2)}`;
    } else if (currentBlock.status === "INADVERTENT_EXPORT") {
      gridNode.classList.add("overdrawl-alert");
      devNode.style.color = "var(--status-danger)";
      this.flowStatusText.innerHTML = `<span style="color: var(--status-danger)">⛔ Inadvertent Injection:</span> ${currentBlock.inadvertentExportKW} kW surplus solar pushed into Discom! Zero credit + penal levy.`;
    } else if (currentBlock.status === "UNDER_DRAWL") {
      gridNode.classList.remove("overdrawl-alert");
      devNode.style.color = "var(--status-warning)";
      this.flowStatusText.innerHTML = `<span style="color: var(--status-warning)">⚡ Under-drawl Notice:</span> Drew less than scheduled by ${Math.abs(dev).toFixed(1)} kW. DSM charge: ₹${currentBlock.blockPenaltyINR.toFixed(2)}`;
    } else {
      gridNode.classList.remove("overdrawl-alert");
      devNode.style.color = "var(--status-ok)";
      this.flowStatusText.innerHTML = `<span style="color: var(--status-ok)">✅ Balanced Dispatch:</span> Within SERC allowable tolerance band (±${currentBlock.toleranceBandPct}%). Zero penalty.`;
    }

    // Highlight row in table
    const tableRows = this.tableBody.querySelectorAll("tr");
    tableRows.forEach(row => {
      if (parseInt(row.getAttribute("data-block"), 10) === currentBlock.blockNumber) {
        row.classList.add("current-scrubbed-row");
        // Scroll into view if not visible
        row.scrollIntoView({ behavior: "smooth", block: "nearest" });
      } else {
        row.classList.remove("current-scrubbed-row");
      }
    });

    // Update vertical line annotation or highlight on chart
    this.app.highlightChartBlock(blockIndex);
  }

  renderTable(results) {
    if (!results) return;
    const blocks = results.blocks;

    let filteredBlocks = blocks;
    if (this.currentTableFilter === "solar") {
      filteredBlocks = blocks.filter(b => b.isSolarHour);
    } else if (this.currentTableFilter === "penalties") {
      filteredBlocks = blocks.filter(b => b.status !== "WITHIN_BAND");
    }

    let html = "";
    filteredBlocks.forEach(b => {
      let statusBadge = `<span class="${b.statusBadgeClass}">${b.status.replace('_', ' ')}</span>`;
      let penaltyDisplay = b.blockPenaltyINR > 0 ? `₹${b.blockPenaltyINR.toFixed(2)}` : "—";
      let devColor = b.deviationKW > 0 ? "var(--status-danger)" : (b.deviationKW < 0 ? "var(--status-warning)" : "var(--text-secondary)");

      html += `
        <tr data-block="${b.blockNumber}">
          <td><strong>#${b.blockNumber}</strong></td>
          <td>${b.timeRange}</td>
          <td>${b.actualConnectedLoad.toLocaleString()}</td>
          <td style="color: var(--solar-gold)">${b.actualBTMUtilized.toLocaleString()}${b.actualBTMCurtailed > 0 ? ` <small title="Curtailed">(${b.actualBTMCurtailed})</small>` : ''}</td>
          <td style="color: var(--oa-emerald)">${b.actualOADelivered.toLocaleString()}</td>
          <td>${b.scheduledGridDrawl.toLocaleString()}</td>
          <td>${b.actualGridDrawl.toLocaleString()}</td>
          <td style="color: ${devColor}; font-weight: 600">${b.deviationKW > 0 ? '+' : ''}${b.deviationKW.toFixed(1)}</td>
          <td style="color: ${devColor}">${b.deviationPct.toFixed(1)}%</td>
          <td>${statusBadge}</td>
          <td style="color: ${b.blockPenaltyINR > 0 ? 'var(--status-danger)' : 'var(--text-muted)'}; font-weight: 700">${penaltyDisplay}</td>
        </tr>
      `;
    });

    if (filteredBlocks.length === 0) {
      html = `<tr><td colspan="11" style="text-align: center; padding: 2rem; color: var(--text-muted)">No blocks matched the selected filter (${this.currentTableFilter}).</td></tr>`;
    }

    this.tableBody.innerHTML = html;

    // Attach click on table row to jump scrubber
    this.tableBody.querySelectorAll("tr").forEach(tr => {
      tr.addEventListener("click", () => {
        const bNum = parseInt(tr.getAttribute("data-block"), 10);
        if (!isNaN(bNum)) {
          this.currentScrubBlock = bNum;
          this.timeScrubber.value = bNum;
          this.updateScrubberView();
        }
      });
    });
  }

  exportDispatchScheduleCSV() {
    if (!this.app.lastEvaluationResults) return;
    const blocks = this.app.lastEvaluationResults.blocks;
    const summary = this.app.lastEvaluationResults.summary;
    const state = this.app.lastEvaluationResults.statePolicy;

    let csv = `SLDC 15-Minute Load Dispatch Schedule & Deviation Settlement\n`;
    csv += `State,${state.stateName} (${state.regulator})\n`;
    csv += `Date,${new Date().toISOString().split('T')[0]}\n`;
    csv += `Tolerance Error Band,±${state.dsmToleranceBandPct}%\n`;
    csv += `Total Daily Consumption (kWh),${summary.totalActualConsumptionKWh}\n`;
    csv += `Total Solar Generated & Consumed (kWh),${summary.totalBTMUtilizedKWh + summary.totalOAConsumedKWh}\n`;
    csv += `Total Daily DSM Penalties (INR),₹${summary.dailyTotalPenaltiesINR}\n\n`;

    csv += `Block,Time Interval,Connected Load (kW),BTM Solar Utilized (kW),BTM Curtailed (kW),OA Solar Delivered (kW),Scheduled Grid Drawl (kW),Actual Grid Drawl (kW),Deviation (kW),Deviation (%),Status,Applicable Penalty (INR)\n`;

    blocks.forEach(b => {
      csv += `${b.blockNumber},"${b.timeRange}",${b.actualConnectedLoad},${b.actualBTMUtilized},${b.actualBTMCurtailed},${b.actualOADelivered},${b.scheduledGridDrawl},${b.actualGridDrawl},${b.deviationKW},${b.deviationPct},${b.status},${b.blockPenaltyINR}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `SLDC_Load_Dispatch_Schedule_${state.regulator}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  populatePolicyModal() {
    const modalContent = document.getElementById("policyModalContent");
    const stateKey = this.stateSelect.value;
    const p = STATE_POLICIES[stateKey];
    if (!p) return;

    let html = `
      <div class="modal-section">
        <h3>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          ${p.stateName} Regulatory Framework (${p.regulator})
        </h3>
        <p><strong>Governing Regulation:</strong> ${p.regulationName}</p>
        <p>${p.policyNotes}</p>
      </div>

      <div class="modal-section">
        <h3>Why Convert Rooftop Solar to Behind-The-Meter (BTM) Zero Export?</h3>
        <p>In most Indian states (including ${p.stateName}), DISCOMs do not permit an industrial consumer to operate simultaneous <strong>Net Metering</strong> and <strong>Open Access (Captive / Group Captive)</strong> on the exact same consumer connection. This is because Net Metering solar feed-in credits directly clash with Open Access 15-minute energy settlement accounts and wheeling banking rules.</p>
        <p>By installing a certified <strong>Reverse Power Relay (RPR)</strong>, the rooftop plant is transformed into a zero-export captive generator. It supplies 100% of daytime factory loads directly behind the meter, while the scheduled Open Access solar covers remaining daytime and non-solar baseloads without regulatory conflicts.</p>
      </div>

      <div class="modal-section">
        <h3>SERC Deviation Settlement Mechanism (DSM) Penalty Structure</h3>
        <p>Under ${p.regulator} DSM regulations, deviation is measured as the delta between Actual Grid Drawl and Day-Ahead Scheduled Grid Drawl submitted to SLDC.</p>
        <table class="modal-matrix-table">
          <thead>
            <tr>
              <th>Deviation Range</th>
              <th>Tolerance / Surcharge Factor</th>
              <th>Impact on Industrial Consumer</th>
            </tr>
          </thead>
          <tbody>
            ${p.penaltyTiers.map(t => `
              <tr>
                <td><strong>${t.label}</strong></td>
                <td>${(t.penaltyFactor * 100).toFixed(0)}% Surcharge</td>
                <td>${t.penaltyFactor === 0 ? "Allowed free band without DSM surcharge" : `Penal levy of ${(t.penaltyFactor * 100).toFixed(0)}% applied on reference APPC (₹${p.dsmReferenceRate}/kWh)`}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="modal-section">
        <h3>Technical Mandates for Zero Export BTM Systems</h3>
        <ul style="padding-left: 1.25rem; display: flex; flex-direction: column; gap: 0.4rem;">
          <li><strong>Reverse Power Relay (RPR):</strong> Trip setting within 0.1 - 0.2 seconds upon sensing active power flow towards the distribution grid transformer.</li>
          <li><strong>Dynamic Inverter Throttling:</strong> RS485 / Modbus RTU telemetry linking the feeder multifunction power meter to solar inverter dispatch controllers to throttle generation within milliseconds of load drop.</li>
          <li><strong>Inadvertent Injection Penalties:</strong> If power enters the grid without schedule, ${p.stateName} charges ₹${p.inadvertentExportPenaltyRate.toFixed(2)}/kWh plus 0 tariff credit.</li>
        </ul>
      </div>
    `;

    modalContent.innerHTML = html;
  }

  getSimulationParams() {
    const baseConnectedLoadKW = parseFloat(this.baseLoadInput.value) || 1000;
    const sanctionedLoadKW = parseFloat(this.sanctionedLoadInput.value) || 1200;
    const loadMultiplier = parseFloat(this.loadSlider.value) / 100;
    const actualIrradiancePct = parseFloat(this.solarSlider.value);
    const rooftopKWp = parseFloat(this.rooftopKWpInput.value) || 500;
    const openAccessKWp = parseFloat(this.openAccessKWpInput.value) || 1500;
    const lossPct = parseFloat(this.transmissionLossInput.value) || 4.10;
    const loadProfileType = this.loadProfileSelect.value;
    const customGridTariff = parseFloat(this.gridTariffInput.value);
    const customOaRate = parseFloat(this.oaPpaRateInput.value);

    return {
      sanctionedLoadKW,
      baseConnectedLoadKW,
      loadMultiplier,
      loadProfileType,
      rooftopKWp,
      openAccessKWp,
      lossPct,
      actualIrradiancePct,
      customGridTariff,
      customOaRate
    };
  }

  /**
   * Opens the SLDC schedule print preview modal and prepares print container
   */
  openPrintModal() {
    if (!this.app.lastEvaluationResults) return;
    const printHTML = this.generateSLDCPrintHTML();
    if (this.printPreviewContainer) {
      this.printPreviewContainer.innerHTML = printHTML;
    }
    if (this.sldcPrintDossier) {
      this.sldcPrintDossier.innerHTML = printHTML;
    }
    if (this.printModal) {
      this.printModal.classList.add("active");
    }
  }

  /**
   * Executes window.print() with dynamically refreshed official dossier
   */
  executePrint() {
    if (!this.app.lastEvaluationResults) return;
    const printHTML = this.generateSLDCPrintHTML();
    if (this.sldcPrintDossier) {
      this.sldcPrintDossier.innerHTML = printHTML;
    }
    // Launch standard print dialog (outputs clean A4 sheet via @media print)
    window.print();
  }

  /**
   * Builds the official SLDC 15-Minute Load Dispatch Schedule Dossier
   * formatted for State Transmission Utilities and SERC compliance
   */
  generateSLDCPrintHTML() {
    const results = this.app.lastEvaluationResults;
    const state = results.statePolicy;
    const summary = results.summary;
    const blocks = results.blocks;

    // Customer details from inputs
    const custName = this.custNameInput && this.custNameInput.value.trim() 
      ? this.custNameInput.value.trim() 
      : "Commercial / Industrial Consumer";
    const custConsumerNo = this.custConsumerNoInput && this.custConsumerNoInput.value.trim() 
      ? this.custConsumerNoInput.value.trim() 
      : "HT-SERVICE-NOT-SPECIFIED";
    const custAddress = this.custAddressInput && this.custAddressInput.value.trim() 
      ? this.custAddressInput.value.trim() 
      : "Plant Site Address";
    const custSubstation = this.custSubstationInput && this.custSubstationInput.value.trim() 
      ? this.custSubstationInput.value.trim() 
      : "Designated Substation / Feeder";
    const custRevision = this.custScheduleRevisionSelect 
      ? this.custScheduleRevisionSelect.value 
      : "Rev-0 (Day-Ahead Final)";
    const custDate = this.custScheduleDateInput && this.custScheduleDateInput.value 
      ? this.custScheduleDateInput.value 
      : new Date().toISOString().split("T")[0];
    const custSignatory = this.custSignatoryInput && this.custSignatoryInput.value.trim() 
      ? this.custSignatoryInput.value.trim() 
      : "Authorized Signatory";

    const voltage = this.voltageSelect ? this.voltageSelect.value : "33";
    const sanctionedLoad = this.sanctionedLoadInput ? this.sanctionedLoadInput.value : "1200";
    const rooftopKWp = this.rooftopKWpInput ? this.rooftopKWpInput.value : "500";
    const oaKWp = this.openAccessKWpInput ? this.openAccessKWpInput.value : "1500";
    const lossPct = this.transmissionLossInput ? this.transmissionLossInput.value : "4.10";

    // Build 96 rows for print table
    let rowsHtml = "";
    blocks.forEach(b => {
      rowsHtml += `
        <tr>
          <td><strong>${b.blockNumber}</strong></td>
          <td>${b.timeRange}</td>
          <td>${b.scheduledConnectedLoad.toLocaleString()}</td>
          <td>${b.actualBTMUtilized.toLocaleString()}</td>
          <td>${b.actualBTMCurtailed > 0 ? b.actualBTMCurtailed.toLocaleString() : '0'}</td>
          <td>${b.daOADelivered.toLocaleString()}</td>
          <td style="font-weight: 700;">${b.scheduledGridDrawl.toLocaleString()}</td>
          <td>${b.allowableLowerBandKW.toFixed(1)}</td>
          <td>${b.allowableUpperBandKW.toFixed(1)}</td>
        </tr>
      `;
    });

    const scheduledPlantDemand = summary.totalScheduledGridImportKWh 
      ? (summary.totalScheduledGridImportKWh + summary.totalBTMUtilizedKWh + summary.totalOAConsumedKWh) 
      : summary.totalActualConsumptionKWh;

    return `
      <div class="sldc-dossier-sheet">
        <!-- Official Document Header -->
        <div class="sldc-dossier-header">
          <div class="sldc-authority-title">${state.sldcName || "STATE LOAD DESPATCH CENTRE"}</div>
          <div class="sldc-form-title">FORM SLDC-OA-1: 15-MINUTE DAY-AHEAD LOAD DISPATCH SCHEDULE</div>
          <div class="sldc-form-subtitle">Submitted in Compliance with ${state.regulator} Open Access & Deviation Settlement Mechanism (DSM) Regulations</div>
        </div>

        <!-- Consumer & Interconnection Details Table -->
        <div class="sldc-section-heading">1. Consumer Identification & Interconnection Technical Dossier</div>
        <table class="sldc-meta-table">
          <tr>
            <td class="meta-label">Consumer / Legal Entity Name:</td>
            <td class="meta-val"><strong>${custName}</strong></td>
            <td class="meta-label">Schedule Date:</td>
            <td class="meta-val"><strong>${custDate}</strong></td>
          </tr>
          <tr>
            <td class="meta-label">Electricity Consumer No. / ID:</td>
            <td class="meta-val"><strong>${custConsumerNo}</strong></td>
            <td class="meta-label">Schedule Revision:</td>
            <td class="meta-val"><strong>${custRevision}</strong></td>
          </tr>
          <tr>
            <td class="meta-label">Factory / Plant Site Address:</td>
            <td class="meta-val" colspan="3">${custAddress}</td>
          </tr>
          <tr>
            <td class="meta-label">DISCOM Substation & Feeder:</td>
            <td class="meta-val">${custSubstation}</td>
            <td class="meta-label">Supply Voltage Level:</td>
            <td class="meta-val">${voltage} kV (Loss: ${lossPct}%)</td>
          </tr>
          <tr>
            <td class="meta-label">Sanctioned Contract Demand:</td>
            <td class="meta-val">${sanctionedLoad} kVA</td>
            <td class="meta-label">SERC Tolerance Error Band:</td>
            <td class="meta-val">±${state.dsmToleranceBandPct.toFixed(1)}%</td>
          </tr>
          <tr>
            <td class="meta-label">Rooftop Solar Plant (BTM):</td>
            <td class="meta-val"><strong>${rooftopKWp} kWp</strong> (Zero-Export Mode / RPR Protected)</td>
            <td class="meta-label">Captive Open Access Solar:</td>
            <td class="meta-val"><strong>${oaKWp} kWp</strong> (Scheduled Injection)</td>
          </tr>
        </table>

        <!-- Daily Energy Balance Summary -->
        <div class="sldc-section-heading">2. Day-Ahead Daily Energy Schedule Summary (96 Time-Blocks)</div>
        <div class="sldc-summary-grid">
          <div class="sldc-summary-box">
            <div class="sum-label">Scheduled Plant Consumption</div>
            <div class="sum-val">${scheduledPlantDemand.toLocaleString()} kWh</div>
          </div>
          <div class="sldc-summary-box">
            <div class="sum-label">BTM Rooftop Solar (0-Export)</div>
            <div class="sum-val">${summary.totalBTMUtilizedKWh.toLocaleString()} kWh</div>
          </div>
          <div class="sldc-summary-box">
            <div class="sum-label">Scheduled Captive OA Solar</div>
            <div class="sum-val">${summary.totalOAConsumedKWh.toLocaleString()} kWh</div>
          </div>
          <div class="sldc-summary-box">
            <div class="sum-label">Scheduled DISCOM Grid Drawl</div>
            <div class="sum-val">${summary.totalScheduledGridImportKWh.toLocaleString()} kWh</div>
          </div>
          <div class="sldc-summary-box">
            <div class="sum-label">Expected Clean Energy Share</div>
            <div class="sum-val">${summary.greenEnergySharePct}%</div>
          </div>
          <div class="sldc-summary-box">
            <div class="sum-label">Reference APPC / DSM Tariff</div>
            <div class="sum-val">₹${state.dsmReferenceRate.toFixed(2)}/kWh</div>
          </div>
        </div>

        <!-- 96 Time-Block Table -->
        <div class="sldc-section-heading">3. 15-Minute Time-Block Dispatch Schedule Submitted to SLDC</div>
        <table class="sldc-dossier-table">
          <thead>
            <tr>
              <th style="width: 6%;">Blk</th>
              <th style="width: 14%;">Time Block</th>
              <th style="width: 13%;">Factory Load (kW)</th>
              <th style="width: 13%;">BTM Solar (kW)</th>
              <th style="width: 11%;">Curtail (kW)</th>
              <th style="width: 14%;">Delivered OA (kW)</th>
              <th style="width: 15%;">Sched Grid Drawl (kW)</th>
              <th style="width: 14%;">Lower Band (kW)</th>
              <th style="width: 14%;">Upper Band (kW)</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>

        <!-- Statutory Certification Block -->
        <div class="sldc-cert-block">
          <h4>Statutory Undertaking & Zero-Export Technical Certification</h4>
          <p>1. We hereby certify that the <strong>${rooftopKWp} kWp Rooftop Solar PV installation</strong> on our premises is operating in Behind-The-Meter (BTM) configuration equipped with a certified Reverse Power Relay (RPR) complying with Central Electricity Authority (CEA) Technical Standards for Connectivity of Distributed Generation Resources. Zero power back-feed to the distribution network is guaranteed at all times.</p>
          <p>2. We confirm that the 15-minute scheduled drawl from the <strong>${oaKWp} kWp Captive Open Access Solar Generator</strong> does not exceed our contracted transmission allotment or sanctioned demand.</p>
          <p>3. We undertake to abide by the ${state.regulator} Forecasting, Scheduling and Deviation Settlement Mechanism (DSM) Regulations. Any real-time deviations exceeding the allowable ±${state.dsmToleranceBandPct}% tolerance error band will be settled under the applicable DSM penal schedule.</p>
        </div>

        <!-- Signature Block -->
        <div class="sldc-sign-block">
          <div class="sign-col">
            <div>Prepared & Verified by:</div>
            <div class="sign-line">Shift Electrical Engineer (Plant Substation)</div>
            <div style="font-size: 8.5px; color: #64748B;">Date & Timestamp: ${new Date().toLocaleString('en-IN')}</div>
          </div>
          <div class="sign-col" style="text-align: right;">
            <div>Authorized Signatory for ${custName}:</div>
            <div class="sign-line">${custSignatory}</div>
            <div style="font-size: 8.5px; color: #64748B;">Official Seal & Consumer Stamp</div>
          </div>
        </div>
      </div>
    `;
  }
}

// Export to window
if (typeof window !== "undefined") {
  window.UIController = UIController;
}
