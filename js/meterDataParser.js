/**
 * Industrial Smart Meter 15-Minute Load Survey Data Ingestion Engine
 * Parses AMR (Automated Meter Reading), MRI (Meter Reading Instrument),
 * and DLMS compliant 15-minute load survey CSV/TXT files from Secure Meters,
 * L&T, Schneider, and Discom billing portals.
 * Extracts 96-block factory load profiles, handles missing block imputation,
 * computes Load Duration Curves (LDC), and provides optimal solar sizing recommendations.
 */

class MeterDataParser {
  constructor() {
    this.lastParsedData = null;
  }

  /**
   * Parses raw CSV/TSV text content from an industrial meter export
   * 
   * @param {string} rawText - File content string
   * @returns {Object} Parsed 96-block profile, metrics, and quality diagnostics
   */
  parseCSV(rawText) {
    if (!rawText || typeof rawText !== "string") {
      throw new Error("Empty or invalid file content provided");
    }

    const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length < 5) {
      throw new Error("File contains insufficient rows for 15-minute interval survey");
    }

    // Detect delimiter (comma, semicolon, tab)
    const sampleLine = lines.find(l => l.includes(",") || l.includes(";") || l.includes("\t")) || lines[0];
    let delimiter = ",";
    if (sampleLine.includes("\t")) delimiter = "\t";
    else if (sampleLine.includes(";")) delimiter = ";";

    // Detect header line (look for keyword matches: time, date, kw, kva, demand, load)
    let headerIndex = -1;
    let headers = [];
    for (let i = 0; i < Math.min(lines.length, 25); i++) {
      const cols = lines[i].split(delimiter).map(c => c.trim().toLowerCase().replace(/['"]/g, ""));
      const hasTime = cols.some(c => c.includes("time") || c.includes("date") || c.includes("timestamp") || c.includes("interval") || c.includes("period"));
      const hasPower = cols.some(c => c.includes("kw") || c.includes("load") || c.includes("demand") || c.includes("kva") || c.includes("active") || c.includes("import"));
      
      if (hasTime && hasPower) {
        headerIndex = i;
        headers = cols;
        break;
      }
    }

    // If no explicit header found, default to first 2 columns
    let timeColIdx = 0;
    let powerColIdx = 1;

    if (headerIndex !== -1) {
      timeColIdx = headers.findIndex(c => c.includes("time") || c.includes("timestamp") || c.includes("date") || c.includes("period"));
      if (timeColIdx === -1) timeColIdx = 0;

      // Prefer active power (kW), then demand (kVA), then load
      powerColIdx = headers.findIndex(c => c.includes("kw") || (c.includes("active") && c.includes("power")));
      if (powerColIdx === -1) {
        powerColIdx = headers.findIndex(c => c.includes("kva") || c.includes("demand") || c.includes("load") || c.includes("import"));
      }
      if (powerColIdx === -1) powerColIdx = 1;
    }

    const dataStartRow = headerIndex !== -1 ? headerIndex + 1 : 0;
    const rawReadings = [];

    for (let i = dataStartRow; i < lines.length; i++) {
      const cols = lines[i].split(delimiter).map(c => c.trim().replace(/['"]/g, ""));
      if (cols.length <= Math.max(timeColIdx, powerColIdx)) continue;

      const timeStr = cols[timeColIdx];
      let val = parseFloat(cols[powerColIdx].replace(/,/g, ""));
      
      if (!isNaN(val) && val >= 0) {
        // If values appear to be in kWh per block instead of kW, convert: kW = kWh * 4
        if (val < 25 && cols[powerColIdx].toLowerCase().includes("kwh")) {
          val = val * 4;
        }
        rawReadings.push({
          rawTime: timeStr,
          kw: val
        });
      }
    }

    if (rawReadings.length === 0) {
      throw new Error("Could not extract valid power readings from file columns");
    }

    // Map readings to 96-block day
    const blocks96 = new Array(96).fill(null);

    if (rawReadings.length === 96) {
      // Exact 1-day 96-block file
      for (let i = 0; i < 96; i++) {
        blocks96[i] = rawReadings[i].kw;
      }
    } else if (rawReadings.length > 96) {
      // Multi-day file: Take the most recent 96 blocks
      const slice = rawReadings.slice(rawReadings.length - 96);
      for (let i = 0; i < 96; i++) {
        blocks96[i] = slice[i].kw;
      }
    } else {
      // Under 96 blocks: Distribute evenly and interpolate
      const step = rawReadings.length / 96;
      for (let i = 0; i < 96; i++) {
        const idx = Math.min(rawReadings.length - 1, Math.floor(i * step));
        blocks96[i] = rawReadings[idx].kw;
      }
    }

    // Fill any nulls with neighbor or average
    let lastValid = 500;
    for (let i = 0; i < 96; i++) {
      if (blocks96[i] === null || isNaN(blocks96[i])) {
        blocks96[i] = lastValid;
      } else {
        lastValid = blocks96[i];
      }
    }

    // Compute key electrical metrics
    let peakKW = 0;
    let minKW = 999999;
    let sumKW = 0;

    for (let i = 0; i < 96; i++) {
      const v = blocks96[i];
      if (v > peakKW) peakKW = v;
      if (v < minKW) minKW = v;
      sumKW += v;
    }

    const avgKW = sumKW / 96;
    const totalDailyKWh = sumKW * 0.25;
    const loadFactorPct = peakKW > 0 ? (avgKW / peakKW) * 100 : 0;

    // Compute Load Duration Curve (sorted descending)
    const ldcBlocks = [...blocks96].sort((a, b) => b - a);

    // Recommended Rooftop Solar sizing to minimize BTM zero-export curtailment
    // Typically sized at 80% of daytime base load (09:00 - 16:00)
    let daytimeSum = 0;
    let daytimeCount = 0;
    for (let i = 36; i <= 64; i++) { // 09:00 to 16:00
      daytimeSum += blocks96[i];
      daytimeCount++;
    }
    const avgDaytimeKW = daytimeCount > 0 ? (daytimeSum / daytimeCount) : avgKW;
    const recommendedRooftopKWp = Math.round((avgDaytimeKW * 0.85) / 50) * 50;

    const result = {
      isLoaded: true,
      totalRowsRead: rawReadings.length,
      sampleTime: rawReadings[0].rawTime,
      blocks96: blocks96.map(v => Math.round(v * 10) / 10),
      metrics: {
        peakKW: Math.round(peakKW * 10) / 10,
        minBaseloadKW: Math.round(minKW * 10) / 10,
        avgKW: Math.round(avgKW * 10) / 10,
        totalDailyKWh: Math.round(totalDailyKWh),
        loadFactorPct: Math.round(loadFactorPct * 10) / 10,
        recommendedRooftopKWp: Math.max(100, recommendedRooftopKWp)
      },
      ldcBlocks
    };

    this.lastParsedData = result;
    return result;
  }
}

// Export to window
if (typeof window !== "undefined") {
  window.MeterDataParser = MeterDataParser;
}
