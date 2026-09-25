/**
 * UI Controller & Interactivity Manager
 * Manages slider reactivity, 24-hr time scrubber animation, scenario presets,
 * table filtering, and CSV dispatch schedule download.
 */

/**
 * Calculates optimal solar PV tilt angle for annual maximum generation
 * in the Northern Hemisphere (India latitude range 8°N to 36°N).
 * Empirical formulation calibrated against PVGIS SARAH-2 / MNRE standards.
 * Clamped between 10° (minimum for dust/monsoon drainage) and 35°.
 */
function calculateOptimalTilt(latitude) {
  const lat = Math.abs(parseFloat(latitude) || 0);
  const opt = Math.round(lat * 0.87 + 3.1);
  return Math.max(10, Math.min(35, opt));
}

const INDIAN_GEO_DIRECTORY = [
  { name: "Pune MIDC, Chakan, Maharashtra", aliases: ["pune", "chakan", "bhosari", "hinjewadi", "talegaon", "ranjangaon", "pimpri"], lat: 18.5204, lon: 73.8567, address: "Plot B-14, MIDC Chakan Industrial Corridor, Pune, Maharashtra", substation: "Chakan 33/11kV MSEDCL Substation" },
  { name: "Sriperumbudur SIPCOT, Chennai, Tamil Nadu", aliases: ["chennai", "sriperumbudur", "oragadam", "ambattur", "guindy", "maraimalai"], lat: 12.9675, lon: 79.9436, address: "SIPCOT Industrial Complex, Phase-II, Sriperumbudur, Tamil Nadu", substation: "Sriperumbudur 110/33kV TANTRANSCO Substation" },
  { name: "Sanand GIDC, Ahmedabad, Gujarat", aliases: ["sanand", "ahmedabad", "changodar", "vatva", "naroda"], lat: 22.9868, lon: 72.3787, address: "GIDC Industrial Estate, Sanand-II, Ahmedabad, Gujarat", substation: "Sanand 66/11kV GETCO Substation" },
  { name: "Peenya Industrial Area, Bengaluru, Karnataka", aliases: ["peenya", "bengaluru", "bangalore", "whitefield", "electronic city", "bommasandra", "bidadi"], lat: 13.0285, lon: 77.5197, address: "Peenya Industrial Area, Phase-III, Bengaluru, Karnataka", substation: "Peenya 66/11kV KPTCL Substation" },
  { name: "Manesar IMT, Gurugram, Haryana", aliases: ["manesar", "gurugram", "gurgaon", "dharuhera", "bawal"], lat: 28.3548, lon: 76.9377, address: "HSIIDC Industrial Model Township (IMT), Sector-8, Manesar, Haryana", substation: "IMT Manesar 66kV HVPNL Substation" },
  { name: "Noida Phase-II, Sector-80, Uttar Pradesh", aliases: ["noida", "greater noida", "ghaziabad", "sahibabad"], lat: 28.5355, lon: 77.3910, address: "Phase-II Industrial Area, Sector-80, Noida, Uttar Pradesh", substation: "Noida 33/11kV UPPCL Substation" },
  { name: "Hosur SIPCOT Industrial Complex, Tamil Nadu", aliases: ["hosur"], lat: 12.7409, lon: 77.8253, address: "SIPCOT Industrial Complex, Phase-I, Hosur, Tamil Nadu", substation: "Hosur 110/33kV TANTRANSCO Substation" },
  { name: "Waluj MIDC, Aurangabad, Maharashtra", aliases: ["aurangabad", "waluj", "chikalthana", "chhatrapati sambhajinagar"], lat: 19.8398, lon: 75.2443, address: "MIDC Waluj Industrial Area, Chhatrapati Sambhajinagar, Maharashtra", substation: "Waluj 33/11kV MSEDCL Substation" },
  { name: "Pithampur Industrial Area, Indore, Madhya Pradesh", aliases: ["pithampur", "indore"], lat: 22.6146, lon: 75.6888, address: "Pithampur Industrial Growth Centre, Sector-3, Indore, MP", substation: "Pithampur 132/33kV MPPTCL Substation" },
  { name: "Dahej PCPIR, Bharuch, Gujarat", aliases: ["dahej", "bharuch", "ankleshwar"], lat: 21.7104, lon: 72.5855, address: "Dahej SEZ / PCPIR Industrial Area, Bharuch, Gujarat", substation: "Dahej 66/11kV GETCO Substation" },
  { name: "Bhiwadi Industrial Area, Alwar, Rajasthan", aliases: ["bhiwadi", "alwar", "neemrana"], lat: 28.2104, lon: 76.8606, address: "RIICO Industrial Area, Phase-III, Bhiwadi, Rajasthan", substation: "Bhiwadi 132/33kV RVPNL Substation" },
  { name: "Oragadam Industrial Corridor, Chennai, Tamil Nadu", aliases: ["oragadam"], lat: 12.8360, lon: 79.9570, address: "SIPCOT Industrial Park, Oragadam, Kanchipuram, Tamil Nadu", substation: "Oragadam 230/110kV TANTRANSCO Substation" },
  { name: "Butibori MIDC, Nagpur, Maharashtra", aliases: ["butibori", "nagpur", "hingna"], lat: 20.9238, lon: 78.9950, address: "MIDC Industrial Area, Butibori, Nagpur, Maharashtra", substation: "Butibori 132/33kV MSEDCL Substation" },
  { name: "Taloja MIDC, Navi Mumbai, Maharashtra", aliases: ["taloja", "navi mumbai", "panvel", "turbhe", "rabale", "mahape"], lat: 19.0683, lon: 73.1235, address: "MIDC Chemical & Engineering Zone, Taloja, Navi Mumbai, Maharashtra", substation: "Taloja 100/33kV MSEDCL Substation" },
  { name: "Vapi GIDC, Valsad, Gujarat", aliases: ["vapi", "valsad"], lat: 20.3705, lon: 72.9106, address: "GIDC Industrial Estate, Vapi, Valsad, Gujarat", substation: "Vapi 66/11kV GETCO Substation" },
  { name: "Baddi Industrial Area, Solan, Himachal Pradesh", aliases: ["baddi", "solan", "nalagarh"], lat: 30.9578, lon: 76.7914, address: "Baddi-Barotiwala-Nalagarh (BBN) Industrial Area, HP", substation: "Baddi 66/11kV HPSEBL Substation" },
  { name: "Jamshedpur Industrial Area, Jharkhand", aliases: ["jamshedpur", "adityapur", "tatanagar"], lat: 22.8046, lon: 86.2029, address: "Adityapur Industrial Area, Jamshedpur, Jharkhand", substation: "Adityapur 132/33kV JUVNL Substation" },
  { name: "Rudrapur SIDCUL, Uttarakhand", aliases: ["rudrapur", "pantnagar", "sidcul"], lat: 28.9800, lon: 79.4000, address: "Integrated Industrial Estate (SIDCUL), Pantnagar/Rudrapur, Uttarakhand", substation: "SIDCUL 132/33kV UPCL Substation" },
  { name: "Hyderabad Genome Valley / Cherlapally, Telangana", aliases: ["hyderabad", "cherlapally", "jeedimetla", "patancheru", "genome valley"], lat: 17.3850, lon: 78.4867, address: "Cherlapally Industrial Development Area, Hyderabad, Telangana", substation: "Cherlapally 33/11kV TSSPDCL Substation" },
  { name: "Jaipur Sitapura Industrial Area, Rajasthan", aliases: ["jaipur", "sitapura", "vishwakarma"], lat: 26.9124, lon: 75.7873, address: "RIICO Industrial Area, Sitapura, Jaipur, Rajasthan", substation: "Sitapura 132/33kV JVVNL Substation" },
  { name: "Kolkata Howrah / Dankuni, West Bengal", aliases: ["kolkata", "calcutta", "howrah", "dankuni"], lat: 22.5726, lon: 88.3639, address: "Dankuni Industrial Complex, Howrah/Hooghly, West Bengal", substation: "Dankuni 33/11kV WBSEDCL Substation" },
  { name: "Coimbatore SIDCO Industrial Estate, Tamil Nadu", aliases: ["coimbatore", "kurichi", "malumichampatti"], lat: 11.0168, lon: 76.9558, address: "SIDCO Industrial Estate, Kurichi, Coimbatore, Tamil Nadu", substation: "Kurichi 110/11kV TANGEDCO Substation" }
];

const ROOFTOP_PRESETS = {
  pune: INDIAN_GEO_DIRECTORY[0],
  chennai: INDIAN_GEO_DIRECTORY[1],
  sanand: INDIAN_GEO_DIRECTORY[2],
  peenya: INDIAN_GEO_DIRECTORY[3],
  manesar: INDIAN_GEO_DIRECTORY[4]
};

const OA_SOLAR_PARK_DIRECTORY = [
  { name: "Bhadla Solar Park, Phalodi/Jodhpur, Rajasthan", aliases: ["bhadla", "jodhpur", "phalodi"], lat: 27.5385, lon: 71.9168, substation: "Bhadla-II 765/400kV PGCIL Substation (ISTS)" },
  { name: "Pavagada Solar Park (Shakti Sthala), Tumakuru, Karnataka", aliases: ["pavagada", "tumakuru", "tumkur", "shakti sthala"], lat: 14.2811, lon: 77.2758, substation: "Pavagada 400/220kV KSPDCL Pooling Substation" },
  { name: "Charanka Solar Park, Patan, Gujarat", aliases: ["charanka", "patan"], lat: 23.9056, lon: 71.2008, substation: "Charanka 400/220kV GETCO Substation" },
  { name: "Rewa Ultra Mega Solar (RUMSL), Gurh, MP", aliases: ["rewa", "gurh", "rumsl"], lat: 24.4789, lon: 81.5768, substation: "Rewa 400/220kV PGCIL Pooling Station" },
  { name: "Kurnool Ultra Mega Solar Park, Gani/Sakunala, AP", aliases: ["kurnool", "gani", "sakunala"], lat: 15.6822, lon: 78.2861, substation: "Gani 400/220kV APTRANSCO Pooling Substation" },
  { name: "Dholera SIR Solar Park, Gulf of Khambhat, Gujarat", aliases: ["dholera", "khambhat"], lat: 22.2534, lon: 72.2238, substation: "Dholera 400kV Coastal Pooling Station" },
  { name: "Khavda Renewable Energy Park, Kutch, Gujarat", aliases: ["khavda", "kutch", "bhuj"], lat: 23.8340, lon: 69.7210, substation: "Khavda 765/400kV PGCIL Pooling Station" },
  { name: "Bikaner Mega Solar Hub, Rajasthan", aliases: ["bikaner", "barsingsar"], lat: 28.0229, lon: 73.3119, substation: "Bikaner-II 765/400kV PGCIL Substation" },
  { name: "Fatehgarh Solar Park, Jaisalmer, Rajasthan", aliases: ["fatehgarh", "jaisalmer", "pokhran"], lat: 26.6800, lon: 71.2100, substation: "Fatehgarh-II 765/400kV Pooling Substation" },
  { name: "Ananthapuramu Ultra Mega Solar Park, AP", aliases: ["ananthapuramu", "anantapur", "tadipatri"], lat: 14.8860, lon: 77.9860, substation: "NP Kunta 400/220kV PGCIL Pooling Station" },
  { name: "Tirunelveli Solar Hub, Tamil Nadu", aliases: ["tirunelveli", "gangaikondan", "tuticorin", "thoothukudi"], lat: 8.7139, lon: 77.7567, substation: "Kayathar 400/230kV TANTRANSCO Substation" },
  { name: "Kamuthi Solar Power Project, Ramanathapuram, Tamil Nadu", aliases: ["kamuthi", "ramanathapuram"], lat: 9.3510, lon: 78.3960, substation: "Kamuthi 400/230kV TANTRANSCO Substation" },
  { name: "Neemuch Solar Park, Madhya Pradesh", aliases: ["neemuch", "mandsaur"], lat: 24.4600, lon: 74.8700, substation: "Neemuch 220kV MPPTCL Substation" },
  { name: "Nokh Solar Park, Jaisalmer, Rajasthan", aliases: ["nokh"], lat: 27.5600, lon: 72.2500, substation: "Nokh 765kV Pooling Station" },
  { name: "Rajnandgaon Solar Park, Chhattisgarh", aliases: ["rajnandgaon", "chhattisgarh"], lat: 21.0970, lon: 81.0350, substation: "Rajnandgaon 220kV CSPTCL Substation" }
];

const OA_PRESETS = {
  bhadla: OA_SOLAR_PARK_DIRECTORY[0],
  pavagada: OA_SOLAR_PARK_DIRECTORY[1],
  charanka: OA_SOLAR_PARK_DIRECTORY[2],
  rewa: OA_SOLAR_PARK_DIRECTORY[3],
  kurnool: OA_SOLAR_PARK_DIRECTORY[4],
  dholera: OA_SOLAR_PARK_DIRECTORY[5]
};

const INDIA_REGIONAL_GEO = [
  // Major Solar Hubs & Districts across India
  { keywords: ["bhadla", "phalodi", "jodhpur", "marwar"], lat: 27.5385, lon: 71.9168, region: "Jodhpur/Phalodi, Rajasthan", substation: "Bhadla-II 765/400kV PGCIL Substation" },
  { keywords: ["pavagada", "tumakuru", "tumkur", "shakti sthala"], lat: 14.2811, lon: 77.2758, region: "Pavagada, Tumakuru, Karnataka", substation: "Pavagada 400/220kV Pooling Substation" },
  { keywords: ["charanka", "patan", "santalpur", "radhanpur"], lat: 23.9056, lon: 71.2008, region: "Patan, Gujarat", substation: "Charanka 400/220kV GETCO Substation" },
  { keywords: ["rewa", "gurh", "rumsl"], lat: 24.4789, lon: 81.5768, region: "Rewa, Madhya Pradesh", substation: "Rewa 400/220kV PGCIL Pooling Station" },
  { keywords: ["kurnool", "gani", "sakunala"], lat: 15.6822, lon: 78.2861, region: "Kurnool, Andhra Pradesh", substation: "Gani 400/220kV APTRANSCO Substation" },
  { keywords: ["dholera", "khambhat", "bhavnagar"], lat: 22.2534, lon: 72.2238, region: "Dholera SIR, Gujarat", substation: "Dholera 400kV Coastal Pooling Station" },
  { keywords: ["khavda", "kutch", "kachchh", "bhuj", "rann"], lat: 23.8340, lon: 69.7210, region: "Khavda / Kutch, Gujarat", substation: "Khavda 765/400kV PGCIL Substation" },
  { keywords: ["bikaner", "barsingsar", "lunkaransar", "nokha", "kolayat"], lat: 28.0229, lon: 73.3119, region: "Bikaner Mega Solar Hub, Rajasthan", substation: "Bikaner-II 765/400kV PGCIL Substation" },
  { keywords: ["jaisalmer", "fatehgarh", "pokhran", "nokh", "ramgarh"], lat: 26.6800, lon: 71.2100, region: "Fatehgarh/Jaisalmer, Rajasthan", substation: "Fatehgarh-II 765/400kV Pooling Substation" },
  { keywords: ["barmer", "balotra", "baytu"], lat: 25.7532, lon: 71.4181, region: "Barmer, Rajasthan", substation: "Barmer 400kV RVPNL Substation" },
  { keywords: ["ananthapuramu", "anantapur", "kadiri", "tadipatri", "np kunta", "nambulapulakunta"], lat: 14.8860, lon: 77.9860, region: "Ananthapuramu, AP", substation: "NP Kunta 400/220kV PGCIL Station" },
  { keywords: ["kadapa", "ysr", "galiveedu", "rayachoty", "pulivendula", "jammalamadugu"], lat: 14.4673, lon: 78.8242, region: "Kadapa Ultra Solar Zone, AP", substation: "Galiveedu 400/220kV APTRANSCO Substation" },
  { keywords: ["tirunelveli", "kayathar", "gangaikondan", "tuticorin", "thoothukudi"], lat: 8.7139, lon: 77.7567, region: "Tirunelveli/Kayathar, Tamil Nadu", substation: "Kayathar 400/230kV TANTRANSCO Substation" },
  { keywords: ["kamuthi", "ramanathapuram", "paramakudi"], lat: 9.3510, lon: 78.3960, region: "Kamuthi, Ramanathapuram, Tamil Nadu", substation: "Kamuthi 400/230kV TANTRANSCO Substation" },
  { keywords: ["neemuch", "mandsaur", "ratlam"], lat: 24.4600, lon: 74.8700, region: "Neemuch/Mandsaur, Madhya Pradesh", substation: "Neemuch 220kV MPPTCL Substation" },
  { keywords: ["agar", "shajapur", "susner"], lat: 23.7144, lon: 76.0150, region: "Agar Malwa, Madhya Pradesh", substation: "Agar 220kV MPPTCL Substation" },
  { keywords: ["rajnandgaon", "durg", "bhilai", "raipur", "chhattisgarh"], lat: 21.0970, lon: 81.0350, region: "Rajnandgaon, Chhattisgarh", substation: "Rajnandgaon 220kV CSPTCL Substation" },
  { keywords: ["solapur", "pandharpur", "barshi", "karmala", "madha", "mohol"], lat: 17.6599, lon: 75.9064, region: "Solapur Solar Belt, Maharashtra", substation: "Solapur 400/220kV MSETCL Substation" },
  { keywords: ["beed", "dharashiv", "osmanabad", "latur", "parbhani"], lat: 18.9891, lon: 75.7601, region: "Marathwada Solar Zone, Maharashtra", substation: "Parli 400/220kV MSETCL Substation" },
  { keywords: ["dhule", "sakri", "jalgaon", "nandurbar", "khandesh"], lat: 20.9042, lon: 74.7749, region: "Sakri/Dhule Solar Hub, Maharashtra", substation: "Dhule 400/220kV MSETCL Substation" },
  { keywords: ["bellary", "ballari", "kudligi", "hospet", "vijayanagara", "toranagallu"], lat: 15.1394, lon: 76.9214, region: "Ballari Solar Cluster, Karnataka", substation: "Kudligi 220kV KPTCL Substation" },
  { keywords: ["chitradurga", "challakere", "hiriyur", "holalkere"], lat: 14.2251, lon: 76.3980, region: "Chitradurga RE Hub, Karnataka", substation: "Challakere 220kV KPTCL Substation" },
  { keywords: ["koppal", "raichur", "kushtagi", "gangavathi"], lat: 15.3524, lon: 76.1550, region: "Koppal/Raichur Solar Belt, Karnataka", substation: "Koppal 400kV PGCIL Substation" },
  { keywords: ["bijapur", "vijayapura", "indi", "sindagi"], lat: 16.8302, lon: 75.7100, region: "Vijayapura Solar Zone, Karnataka", substation: "Vijayapura 220kV KPTCL Substation" },
  { keywords: ["kalaburagi", "gulbarga", "yadgir"], lat: 17.3297, lon: 76.8343, region: "Kalaburagi/Yadgir, Karnataka", substation: "Gulbarga 220kV KPTCL Substation" },
  { keywords: ["mahbubnagar", "wanaparthy", "gadwal", "nagarkurnool"], lat: 16.7488, lon: 78.0035, region: "Mahbubnagar Solar Cluster, Telangana", substation: "Wanaparthy 220kV TSTRANSCO Substation" },
  { keywords: ["jhansi", "lalitpur", "jalaun", "orai", "bundelkhand", "mirzapur"], lat: 25.4484, lon: 78.5685, region: "Bundelkhand Solar Belt, UP", substation: "Orai 400/220kV UPPTCL Substation" },
  { keywords: ["surendranagar", "wadhwan", "halvad", "dhrangadhra"], lat: 22.7278, lon: 71.6370, region: "Surendranagar, Gujarat", substation: "Halvad 220kV GETCO Substation" },
  { keywords: ["banaskantha", "palanpur", "deesa"], lat: 24.1724, lon: 72.4346, region: "Banaskantha Solar Zone, Gujarat", substation: "Deesa 220kV GETCO Substation" },
  { keywords: ["nagpur", "wardha", "chandrapur", "amravati", "butibori"], lat: 21.1458, lon: 79.0882, region: "Vidarbha Industrial Hub, Maharashtra", substation: "Butibori 132/33kV MSEDCL Substation" },
  { keywords: ["coimbatore", "tirupur", "erode", "salem", "karur"], lat: 11.0168, lon: 76.9558, region: "Kongu Solar & Textile Corridor, TN", substation: "Kurichi 110/11kV TANGEDCO Substation" },
  { keywords: ["pune", "chakan", "bhosari", "hinjewadi", "talegaon", "ranjangaon", "pimpri"], lat: 18.5204, lon: 73.8567, region: "Pune MIDC Chakan Corridor, Maharashtra", substation: "Chakan 33/11kV MSEDCL Substation" },
  { keywords: ["mumbai", "navi mumbai", "thane", "taloja", "turbhe", "rabale"], lat: 19.0760, lon: 72.8777, region: "Mumbai MMR / Taloja Industrial Belt", substation: "Taloja 100/33kV MSEDCL Substation" },
  { keywords: ["bengaluru", "bangalore", "peenya", "whitefield", "hosur", "bidadi"], lat: 12.9716, lon: 77.5946, region: "Bengaluru Peenya Corridor, Karnataka", substation: "Peenya 66/11kV KPTCL Substation" },
  { keywords: ["chennai", "sriperumbudur", "oragadam", "guindy", "ambattur"], lat: 13.0827, lon: 80.2707, region: "Chennai SIPCOT Corridor, Tamil Nadu", substation: "Sriperumbudur 110/33kV Substation" },
  { keywords: ["ahmedabad", "sanand", "changodar", "gandhinagar", "vatva"], lat: 23.0225, lon: 72.5714, region: "Ahmedabad Sanand GIDC Hub, Gujarat", substation: "Sanand 66/11kV GETCO Substation" },
  { keywords: ["delhi", "ncr", "gurugram", "gurgaon", "manesar", "noida", "faridabad"], lat: 28.6139, lon: 77.2090, region: "Delhi NCR / Manesar IMT Hub", substation: "IMT Manesar 66kV HVPNL Substation" }
];

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

    // Solar Site Coordinates & PVGIS Met Elements
    this.rooftopAddressSearchInput = document.getElementById("rooftopAddressSearch");
    this.btnGeocodeRooftop = document.getElementById("btnGeocodeRooftop");
    this.rooftopGeoStatus = document.getElementById("rooftopGeoStatus");
    this.rooftopTiltBadge = document.getElementById("rooftopTiltBadge");
    this.geoSearchIcon = document.getElementById("geoSearchIcon");
    this.rooftopLatInput = document.getElementById("rooftopLat");
    this.rooftopLonInput = document.getElementById("rooftopLon");
    this.rooftopTiltInput = document.getElementById("rooftopTilt");
    this.btnDetectRooftopGPS = document.getElementById("btnDetectRooftopGPS");

    this.oaAddressSearchInput = document.getElementById("oaAddressSearch");
    this.btnGeocodeOA = document.getElementById("btnGeocodeOA");
    this.oaGeoStatus = document.getElementById("oaGeoStatus");
    this.oaSearchIcon = document.getElementById("oaSearchIcon");
    this.oaLatInput = document.getElementById("oaLat");
    this.oaLonInput = document.getElementById("oaLon");
    this.oaTrackingSelect = document.getElementById("oaTracking");
    this.oaFixedOption = document.getElementById("oaFixedOption");

    this.btnFetchPVGIS = document.getElementById("btnFetchPVGIS");
    this.pvgisSyncIcon = document.getElementById("pvgisSyncIcon");
    this.pvgisMetBadge = document.getElementById("pvgisMetBadge");
    this.pvgisModelTitle = document.getElementById("pvgisModelTitle");
    this.pvgisTimeShiftVal = document.getElementById("pvgisTimeShiftVal");
    this.pvgisRooftopInsolationVal = document.getElementById("pvgisRooftopInsolationVal");
    this.pvgisOAInsolationVal = document.getElementById("pvgisOAInsolationVal");
    this.pvgisOaCufVal = document.getElementById("pvgisOaCufVal");

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
    this.btnReplayScrubber = document.getElementById("btnReplayScrubber");

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
    this.btnCollapseSidebarInside = document.getElementById("btnCollapseSidebarInside");
    this.btnCollapseSidebarMain = document.getElementById("btnCollapseSidebarMain");
    this.btnFloatingExpandSidebar = document.getElementById("btnFloatingExpandSidebar");

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

    // Workspace Master Header Project Banner Elements
    this.bannerCustomerName = document.getElementById("bannerCustomerName");
    this.bannerOACapacityMW = document.getElementById("bannerOACapacityMW");
    this.bannerSanctionedDemand = document.getElementById("bannerSanctionedDemand");
    this.bannerRooftopCapacity = document.getElementById("bannerRooftopCapacity");
    this.bannerStatePolicyName = document.getElementById("bannerStatePolicyName");
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

    if (this.btnCollapseSidebarInside) {
      this.btnCollapseSidebarInside.addEventListener("click", () => toggleSidebar(true));
    }
    if (this.btnCollapseSidebarMain) {
      this.btnCollapseSidebarMain.addEventListener("click", () => toggleSidebar(true));
    }
    if (this.btnFloatingExpandSidebar) {
      this.btnFloatingExpandSidebar.addEventListener("click", () => toggleSidebar(false));
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
      this.transmissionLossInput,
      this.rooftopLatInput,
      this.rooftopLonInput,
      this.rooftopTiltInput,
      this.oaLatInput,
      this.oaLonInput,
      this.oaTrackingSelect,
      this.custScheduleDateInput
    ];

    triggerInputs.forEach(input => {
      if (input) {
        input.addEventListener("input", () => {
          this.updateSliderKwLabel();
          this.app.recalculate();
        });
        input.addEventListener("change", () => {
          this.app.recalculate();
        });
      }
    });

    // Live update for Customer Name in project banner
    if (this.custNameInput) {
      this.custNameInput.addEventListener("input", () => {
        this.updateProjectBanner();
      });
      this.custNameInput.addEventListener("change", () => {
        this.updateProjectBanner();
      });
    }

    // Rooftop Address Geocoding Search (Google Maps style)
    if (this.rooftopAddressSearchInput) {
      this.rooftopAddressSearchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          this.geocodeRooftopAddress(this.rooftopAddressSearchInput.value);
        }
      });
      this.rooftopAddressSearchInput.addEventListener("change", () => {
        this.geocodeRooftopAddress(this.rooftopAddressSearchInput.value);
      });
    }

    if (this.btnGeocodeRooftop) {
      this.btnGeocodeRooftop.addEventListener("click", () => {
        if (this.rooftopAddressSearchInput) {
          this.geocodeRooftopAddress(this.rooftopAddressSearchInput.value);
        }
      });
    }

    // Auto-update optimal tilt whenever Rooftop Latitude is adjusted
    if (this.rooftopLatInput) {
      const handleRooftopLatChange = () => {
        const lat = parseFloat(this.rooftopLatInput.value);
        if (!isNaN(lat)) {
          const optTilt = calculateOptimalTilt(lat);
          if (this.rooftopTiltInput) {
            this.rooftopTiltInput.value = optTilt;
            this.rooftopTiltInput.classList.remove("highlight-updated");
            void this.rooftopTiltInput.offsetWidth;
            this.rooftopTiltInput.classList.add("highlight-updated");
            setTimeout(() => {
              if (this.rooftopTiltInput) this.rooftopTiltInput.classList.remove("highlight-updated");
            }, 1500);
          }
          if (this.rooftopTiltBadge) this.rooftopTiltBadge.textContent = `Opt: ${optTilt}°`;
        }
        this.app.recalculate();
      };
      this.rooftopLatInput.addEventListener("input", handleRooftopLatChange);
      this.rooftopLatInput.addEventListener("change", handleRooftopLatChange);
    }

    // Open Access Solar Park Address Geocoding Search (Google Maps style)
    if (this.oaAddressSearchInput) {
      this.oaAddressSearchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          this.geocodeOAAddress(this.oaAddressSearchInput.value);
        }
      });
      this.oaAddressSearchInput.addEventListener("change", () => {
        this.geocodeOAAddress(this.oaAddressSearchInput.value);
      });
    }

    if (this.btnGeocodeOA) {
      this.btnGeocodeOA.addEventListener("click", () => {
        if (this.oaAddressSearchInput) {
          this.geocodeOAAddress(this.oaAddressSearchInput.value);
        }
      });
    }

    // Auto-update OA mounting tilt whenever OA Latitude changes
    if (this.oaLatInput) {
      const handleOaLatChange = () => {
        const lat = parseFloat(this.oaLatInput.value);
        if (!isNaN(lat)) {
          const oaOptTilt = calculateOptimalTilt(lat);
          this.updateOaOptimalTilt(oaOptTilt);
        }
        this.app.recalculate();
      };
      this.oaLatInput.addEventListener("input", handleOaLatChange);
      this.oaLatInput.addEventListener("change", handleOaLatChange);
    }

    // Detect GPS Location for Rooftop Solar Site
    if (this.btnDetectRooftopGPS) {
      this.btnDetectRooftopGPS.addEventListener("click", () => {
        if ("geolocation" in navigator) {
          this.btnDetectRooftopGPS.textContent = "Detecting...";
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const lat = pos.coords.latitude;
              const lon = pos.coords.longitude;
              const optTilt = calculateOptimalTilt(lat);
              if (this.rooftopLatInput) this.rooftopLatInput.value = lat.toFixed(4);
              if (this.rooftopLonInput) this.rooftopLonInput.value = lon.toFixed(4);
              if (this.rooftopTiltInput) this.rooftopTiltInput.value = optTilt;
              if (this.rooftopTiltBadge) this.rooftopTiltBadge.textContent = `Opt: ${optTilt}°`;
              if (this.rooftopAddressSearchInput) this.rooftopAddressSearchInput.value = `Device GPS (${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E)`;
              if (this.rooftopGeoStatus) {
                this.rooftopGeoStatus.textContent = `✓ GPS Locked (Opt: ${optTilt}°)`;
                this.rooftopGeoStatus.style.color = "var(--oa-emerald)";
              }
              this.btnDetectRooftopGPS.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> GPS`;
              this.app.recalculate();
            },
            () => {
              alert("Device GPS unavailable. You can enter exact plant coordinates or address.");
              this.btnDetectRooftopGPS.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg> GPS`;
            },
            { timeout: 8000 }
          );
        } else {
          alert("Geolocation is not supported by your browser.");
        }
      });
    }

    // Live PVGIS Satellite Data Re-sync Button
    if (this.btnFetchPVGIS) {
      this.btnFetchPVGIS.addEventListener("click", async () => {
        if (this.pvgisSyncIcon) this.pvgisSyncIcon.classList.add("pvgis-spinning");
        const lat = parseFloat(this.rooftopLatInput.value) || 18.5204;
        const lon = parseFloat(this.rooftopLonInput.value) || 73.8567;
        const tilt = parseFloat(this.rooftopTiltInput.value) || 15;
        
        await this.app.dsmEngine.solarModel.fetchLivePVGIS(lat, lon, 1, tilt);
        if (this.pvgisSyncIcon) this.pvgisSyncIcon.classList.remove("pvgis-spinning");
        this.app.recalculate();
      });
    }

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
      this.updateScrubberView(true);
    });

    // Play/Pause Scrubber
    this.btnPlayScrubber.addEventListener("click", () => {
      this.togglePlayScrubber();
    });

    // Reset Scrubber to Midday
    this.btnResetScrubber.addEventListener("click", () => {
      this.pauseScrubber();
      this.currentScrubBlock = 49;
      this.timeScrubber.value = 49;
      this.updateScrubberView(true);
    });

    // Replay Scrubber from Block 1 (00:00)
    if (this.btnReplayScrubber) {
      this.btnReplayScrubber.addEventListener("click", () => {
        this.replayScrubber();
      });
    }

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
        this.closePrintModal();
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
          this.closePrintModal();
        }
      });
    }

    // Clean up printable dossier after printing completes
    window.addEventListener("afterprint", () => {
      if (this.sldcPrintDossier) {
        this.sldcPrintDossier.innerHTML = "";
      }
    });

    // Escape key modal dismiss
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (this.policyModal && this.policyModal.classList.contains("active")) {
          this.policyModal.classList.remove("active");
        }
        if (this.printModal && this.printModal.classList.contains("active")) {
          this.closePrintModal();
        }
      }
    });

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

    // Auto-align location presets based on state
    let rPreset = "pune";
    let oaPreset = "bhadla";
    if (stateKey === "gujarat") { rPreset = "sanand"; oaPreset = "charanka"; }
    else if (stateKey === "karnataka") { rPreset = "peenya"; oaPreset = "pavagada"; }
    else if (stateKey === "tamilnadu") { rPreset = "chennai"; oaPreset = "pavagada"; }
    else if (stateKey === "rajasthan") { rPreset = "manesar"; oaPreset = "bhadla"; }
    else if (stateKey === "haryana") { rPreset = "manesar"; oaPreset = "bhadla"; }
    else if (stateKey === "andhrapradesh") { rPreset = "chennai"; oaPreset = "kurnool"; }
    else if (stateKey === "telangana") { rPreset = "pune"; oaPreset = "kurnool"; }
    else if (stateKey === "uttarpradesh") { rPreset = "manesar"; oaPreset = "rewa"; }

    const rData = ROOFTOP_PRESETS[rPreset];
    if (rData) {
      if (this.rooftopAddressSearchInput) this.rooftopAddressSearchInput.value = rData.name || rData.address;
      if (this.rooftopLatInput) this.rooftopLatInput.value = rData.lat.toFixed(4);
      if (this.rooftopLonInput) this.rooftopLonInput.value = rData.lon.toFixed(4);
      const optTilt = calculateOptimalTilt(rData.lat);
      if (this.rooftopTiltInput) this.rooftopTiltInput.value = optTilt;
      if (this.rooftopTiltBadge) this.rooftopTiltBadge.textContent = `Opt: ${optTilt}°`;
      if (this.custAddressInput && (!this.custAddressInput.value || this.custAddressInput.value.includes("Industrial") || this.custAddressInput.value.includes("MIDC") || this.custAddressInput.value.includes("SIPCOT") || this.custAddressInput.value.includes("GIDC") || this.custAddressInput.value.includes("Peenya") || this.custAddressInput.value.includes("HSIIDC"))) {
        this.custAddressInput.value = rData.address;
      }
      if (this.custSubstationInput && (!this.custSubstationInput.value || this.custSubstationInput.value.includes("Substation"))) {
        this.custSubstationInput.value = rData.substation;
      }
    }

    const oaData = OA_PRESETS[oaPreset];
    if (oaData) {
      if (this.oaAddressSearchInput) this.oaAddressSearchInput.value = oaData.name;
      if (this.oaLatInput) this.oaLatInput.value = oaData.lat.toFixed(4);
      if (this.oaLonInput) this.oaLonInput.value = oaData.lon.toFixed(4);
      const oaOptTilt = calculateOptimalTilt(oaData.lat);
      this.updateOaOptimalTilt(oaOptTilt);
    }

    this.updateProjectBanner();
  }

  updateProjectBanner() {
    const custName = (this.custNameInput && this.custNameInput.value.trim())
      ? this.custNameInput.value.trim()
      : "Apex Precision Forgings & Alloys Ltd.";

    const oaKWp = parseFloat(this.openAccessKWpInput ? this.openAccessKWpInput.value : 1500) || 0;
    const oaMW = (oaKWp / 1000).toFixed(2);

    if (this.bannerCustomerName) {
      this.bannerCustomerName.textContent = custName;
    }
    if (this.bannerOACapacityMW) {
      this.bannerOACapacityMW.textContent = `${oaMW} MW`;
    }

    const sanctionedKW = parseFloat(this.sanctionedLoadInput ? this.sanctionedLoadInput.value : 1200) || 0;
    if (this.bannerSanctionedDemand) {
      this.bannerSanctionedDemand.textContent = `${sanctionedKW.toLocaleString()} kW`;
    }

    const rooftopKWp = parseFloat(this.rooftopKWpInput ? this.rooftopKWpInput.value : 500) || 0;
    const rooftopMW = (rooftopKWp / 1000).toFixed(2);
    if (this.bannerRooftopCapacity) {
      this.bannerRooftopCapacity.textContent = `${rooftopKWp.toLocaleString()} kWp (${rooftopMW} MW)`;
    }

    if (this.stateSelect && this.bannerStatePolicyName && this.stateSelect.selectedOptions && this.stateSelect.selectedOptions[0]) {
      this.bannerStatePolicyName.textContent = this.stateSelect.selectedOptions[0].text;
    }
  }

  updateOaOptimalTilt(tilt) {
    if (this.oaFixedOption) {
      this.oaFixedOption.textContent = `Fixed (${tilt}° Optimal)`;
    }
  }

  async geocodeRooftopAddress(rawQuery) {
    if (!rawQuery) return;
    const query = rawQuery.trim();
    if (!query) return;

    if (this.rooftopGeoStatus) {
      this.rooftopGeoStatus.textContent = "Locating on map...";
      this.rooftopGeoStatus.style.color = "var(--text-accent)";
    }
    if (this.btnGeocodeRooftop) {
      this.btnGeocodeRooftop.classList.add("searching");
    }

    // 1. Check if user typed coordinates like "18.5204, 73.8567" or "18.52 73.85"
    const coordMatch = query.match(/^([-+]?\d{1,2}(?:\.\d+)?)[,\s]+([-+]?\d{1,3}(?:\.\d+)?)$/);
    if (coordMatch) {
      const lat = parseFloat(coordMatch[1]);
      const lon = parseFloat(coordMatch[2]);
      if (lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
        this.applyRooftopLocation({
          name: query,
          lat,
          lon,
          address: `Coordinates: ${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E`,
          preserveUserInput: true
        });
        return;
      }
    }

    const qLower = query.toLowerCase();

    // 2. Local lookup in INDIAN_GEO_DIRECTORY
    const localMatch = INDIAN_GEO_DIRECTORY.find(item => {
      if (item.name.toLowerCase().includes(qLower)) return true;
      if (item.aliases && item.aliases.some(alias => qLower.includes(alias) || alias.includes(qLower))) return true;
      return false;
    });

    if (localMatch) {
      this.applyRooftopLocation({
        ...localMatch,
        preserveUserInput: true
      });
      return;
    }

    // 3. Regional / District match from INDIA_REGIONAL_GEO
    const regionalMatch = INDIA_REGIONAL_GEO.find(item => {
      if (item.keywords && item.keywords.some(k => qLower.includes(k))) return true;
      if (item.region && item.region.toLowerCase().includes(qLower)) return true;
      return false;
    });

    if (regionalMatch) {
      this.applyRooftopLocation({
        name: regionalMatch.region,
        lat: regionalMatch.lat,
        lon: regionalMatch.lon,
        address: `${query} (${regionalMatch.region})`,
        substation: regionalMatch.substation,
        preserveUserInput: true
      });
      return;
    }

    // 4. Online Geocoding via OpenStreetMap Nominatim API
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=in&limit=1`;
      const res = await fetch(url, {
        headers: { "Accept-Language": "en" },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          const item = data[0];
          const shortName = item.display_name.split(",").slice(0, 3).join(",");
          this.applyRooftopLocation({
            name: shortName,
            lat: parseFloat(item.lat),
            lon: parseFloat(item.lon),
            address: item.display_name,
            preserveUserInput: true
          });
          return;
        }
      }
    } catch (err) {
      console.warn("Online geocoding failed, falling back to local region match:", err);
    }

    // 5. If no coordinates matched, KEEP user's typed address intact and notify user to verify Lat/Lon
    if (this.btnGeocodeRooftop) {
      this.btnGeocodeRooftop.classList.remove("searching");
    }
    const curLat = this.rooftopLatInput ? (parseFloat(this.rooftopLatInput.value) || 18.5204) : 18.5204;
    const optTilt = calculateOptimalTilt(curLat);
    if (this.rooftopTiltBadge) this.rooftopTiltBadge.textContent = `Opt: ${optTilt}°`;
    if (this.rooftopGeoStatus) {
      this.rooftopGeoStatus.textContent = `Address saved • Verify Lat/Lon below (Opt: ${optTilt}°)`;
      this.rooftopGeoStatus.style.color = "var(--solar-gold)";
    }
    this.app.recalculate();
  }

  applyRooftopLocation({ name, lat, lon, address, substation, isApprox = false, preserveUserInput = false }) {
    if (this.btnGeocodeRooftop) {
      this.btnGeocodeRooftop.classList.remove("searching");
    }

    if (this.rooftopLatInput && lat !== undefined && !isNaN(lat)) {
      this.rooftopLatInput.value = parseFloat(lat).toFixed(4);
    }
    if (this.rooftopLonInput && lon !== undefined && !isNaN(lon)) {
      this.rooftopLonInput.value = parseFloat(lon).toFixed(4);
    }

    // Compute optimal tilt angle for this site's latitude
    const optimalTilt = calculateOptimalTilt(lat);
    if (this.rooftopTiltInput) {
      this.rooftopTiltInput.value = optimalTilt;
      this.rooftopTiltInput.classList.remove("highlight-updated");
      void this.rooftopTiltInput.offsetWidth;
      this.rooftopTiltInput.classList.add("highlight-updated");
      setTimeout(() => {
        if (this.rooftopTiltInput) this.rooftopTiltInput.classList.remove("highlight-updated");
      }, 1500);
    }
    if (this.rooftopTiltBadge) {
      this.rooftopTiltBadge.textContent = `Opt: ${optimalTilt}°`;
    }

    // Only set address search input if not preserving user's typed address
    if (!preserveUserInput && this.rooftopAddressSearchInput && name) {
      this.rooftopAddressSearchInput.value = name;
    }

    if (this.custAddressInput && address) {
      this.custAddressInput.value = address;
    }
    if (this.custSubstationInput && substation) {
      this.custSubstationInput.value = substation;
    }

    if (this.rooftopGeoStatus) {
      if (isApprox) {
        this.rooftopGeoStatus.textContent = `Closest match (${parseFloat(lat).toFixed(2)}°N, ${parseFloat(lon).toFixed(2)}°E • Opt: ${optimalTilt}°)`;
        this.rooftopGeoStatus.style.color = "var(--solar-gold)";
      } else {
        this.rooftopGeoStatus.textContent = `✓ Located (${parseFloat(lat).toFixed(2)}°N, ${parseFloat(lon).toFixed(2)}°E • Opt: ${optimalTilt}°)`;
        this.rooftopGeoStatus.style.color = "var(--oa-emerald)";
      }
    }

    this.app.recalculate();
  }

  async geocodeOAAddress(rawQuery) {
    if (!rawQuery) return;
    const query = rawQuery.trim();
    if (!query) return;

    if (this.oaGeoStatus) {
      this.oaGeoStatus.textContent = "Locating site...";
      this.oaGeoStatus.style.color = "var(--text-accent)";
    }
    if (this.btnGeocodeOA) {
      this.btnGeocodeOA.classList.add("searching");
    }

    // 1. Check if user typed coordinates like "27.5385, 71.9168" or "27.53 71.91"
    const coordMatch = query.match(/^([-+]?\d{1,2}(?:\.\d+)?)[,\s]+([-+]?\d{1,3}(?:\.\d+)?)$/);
    if (coordMatch) {
      const lat = parseFloat(coordMatch[1]);
      const lon = parseFloat(coordMatch[2]);
      if (lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
        this.applyOALocation({
          name: query,
          lat,
          lon,
          preserveUserInput: true
        });
        return;
      }
    }

    const qLower = query.toLowerCase();

    // 2. Fast local lookup in OA_SOLAR_PARK_DIRECTORY
    const localMatch = OA_SOLAR_PARK_DIRECTORY.find(item => {
      if (item.name.toLowerCase().includes(qLower)) return true;
      if (item.aliases && item.aliases.some(alias => qLower.includes(alias) || alias.includes(qLower))) return true;
      return false;
    });

    if (localMatch) {
      this.applyOALocation({
        ...localMatch,
        preserveUserInput: true
      });
      return;
    }

    // 3. Regional / District match from INDIA_REGIONAL_GEO
    const regionalMatch = INDIA_REGIONAL_GEO.find(item => {
      if (item.keywords && item.keywords.some(k => qLower.includes(k))) return true;
      if (item.region && item.region.toLowerCase().includes(qLower)) return true;
      return false;
    });

    if (regionalMatch) {
      this.applyOALocation({
        name: regionalMatch.region,
        lat: regionalMatch.lat,
        lon: regionalMatch.lon,
        substation: regionalMatch.substation,
        preserveUserInput: true
      });
      return;
    }

    // 4. Online Geocoding via OpenStreetMap Nominatim API
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=in&limit=1`;
      const res = await fetch(url, {
        headers: { "Accept-Language": "en" },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          const item = data[0];
          const shortName = item.display_name.split(",").slice(0, 3).join(",");
          this.applyOALocation({
            name: shortName,
            lat: parseFloat(item.lat),
            lon: parseFloat(item.lon),
            substation: `${shortName} Pooling Substation`,
            preserveUserInput: true
          });
          return;
        }
      }
    } catch (err) {
      console.warn("Online geocoding for OA Solar Park failed, falling back to local directory:", err);
    }

    // 5. If search yields no coordinates, DO NOT reset to Bhadla! KEEP user's typed address and let them adjust Lat/Lon directly
    if (this.btnGeocodeOA) {
      this.btnGeocodeOA.classList.remove("searching");
    }
    const curLat = this.oaLatInput ? (parseFloat(this.oaLatInput.value) || 27.5385) : 27.5385;
    const optTilt = calculateOptimalTilt(curLat);
    this.updateOaOptimalTilt(optTilt);
    if (this.oaGeoStatus) {
      this.oaGeoStatus.textContent = `Address saved • Verify Lat/Lon below (Opt: ${optTilt}°)`;
      this.oaGeoStatus.style.color = "var(--solar-gold)";
    }
    this.app.recalculate();
  }

  applyOALocation({ name, lat, lon, substation, isApprox = false, preserveUserInput = false }) {
    if (this.btnGeocodeOA) {
      this.btnGeocodeOA.classList.remove("searching");
    }

    if (this.oaLatInput && lat !== undefined && !isNaN(lat)) {
      this.oaLatInput.value = parseFloat(lat).toFixed(4);
    }
    if (this.oaLonInput && lon !== undefined && !isNaN(lon)) {
      this.oaLonInput.value = parseFloat(lon).toFixed(4);
    }

    const currentLat = this.oaLatInput ? parseFloat(this.oaLatInput.value) : (lat || 27.5385);
    const optimalTilt = calculateOptimalTilt(currentLat);
    this.updateOaOptimalTilt(optimalTilt);

    // Only set address search input if not preserving user's typed address
    if (!preserveUserInput && this.oaAddressSearchInput && name) {
      this.oaAddressSearchInput.value = name;
    }

    if (this.oaGeoStatus) {
      if (isApprox) {
        this.oaGeoStatus.textContent = `Closest match (${parseFloat(lat).toFixed(2)}°N, ${parseFloat(lon).toFixed(2)}°E • Opt: ${optimalTilt}°)`;
        this.oaGeoStatus.style.color = "var(--solar-gold)";
      } else {
        this.oaGeoStatus.textContent = `✓ Located (${parseFloat(lat).toFixed(2)}°N, ${parseFloat(lon).toFixed(2)}°E • Opt: ${optimalTilt}°)`;
        this.oaGeoStatus.style.color = "var(--oa-emerald)";
      }
    }

    this.app.recalculate();
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
    // If currently at or past the final block 96, reset to block 1 before playing
    if (this.currentScrubBlock >= 96) {
      this.currentScrubBlock = 1;
      this.timeScrubber.value = 1;
      this.updateScrubberView(true);
    }

    this.isPlaying = true;
    this.btnPlayScrubber.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`;
    this.btnPlayScrubber.setAttribute("title", "Pause 24-Hour Timeline Scrub");
    
    // Playback interval: 750ms per 15-minute block (>4x slower than 180ms for comfortable inspection)
    this.playbackInterval = setInterval(() => {
      this.currentScrubBlock++;
      if (this.currentScrubBlock >= 96) {
        this.currentScrubBlock = 96;
        this.timeScrubber.value = 96;
        this.updateScrubberView(true);
        this.pauseScrubber(); // Stop at the last block
        return;
      }
      this.timeScrubber.value = this.currentScrubBlock;
      this.updateScrubberView(true);
    }, 750);
  }

  pauseScrubber() {
    this.isPlaying = false;
    this.btnPlayScrubber.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;
    this.btnPlayScrubber.setAttribute("title", "Play 24-Hour Timeline Scrub");
    if (this.playbackInterval) {
      clearInterval(this.playbackInterval);
      this.playbackInterval = null;
    }
  }

  replayScrubber() {
    this.pauseScrubber();
    this.currentScrubBlock = 1;
    this.timeScrubber.value = 1;
    this.updateScrubberView(true);
    this.startPlayScrubber();
  }

  updateScrubberView(autoScrollTable = false) {
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

    // Highlight row in table (without triggering outer window scroll)
    const tableRows = this.tableBody ? this.tableBody.querySelectorAll("tr") : [];
    tableRows.forEach(row => {
      if (parseInt(row.getAttribute("data-block"), 10) === currentBlock.blockNumber) {
        row.classList.add("current-scrubbed-row");
        // Only adjust the internal table container scrollbar if user is explicitly scrubbing timeline
        if (autoScrollTable) {
          const container = row.closest(".table-scroll-container");
          if (container) {
            const rowTop = row.offsetTop;
            const rowHeight = row.offsetHeight;
            const containerScroll = container.scrollTop;
            const containerHeight = container.clientHeight;
            if (rowTop - 35 < containerScroll) {
              container.scrollTop = Math.max(0, rowTop - 40);
            } else if (rowTop + rowHeight > containerScroll + containerHeight) {
              container.scrollTop = rowTop + rowHeight - containerHeight + 25;
            }
          }
        }
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

    const statusMap = {
      WITHIN_BAND: 'In-Band',
      OVER_DRAWL: 'Over-Drawl',
      UNDER_DRAWL: 'Under-Drawl'
    };

    let html = "";
    filteredBlocks.forEach(b => {
      const statusText = statusMap[b.status] || b.status.replace('_', '-');
      let statusBadge = `<span class="${b.statusBadgeClass}">${statusText}</span>`;
      let penaltyDisplay = b.blockPenaltyINR > 0 ? `₹${Math.round(b.blockPenaltyINR).toLocaleString()}` : "—";
      let devColor = b.deviationKW > 0 ? "var(--status-danger)" : (b.deviationKW < 0 ? "var(--status-warning)" : "var(--text-secondary)");
      const compactTime = b.timeRange ? b.timeRange.replace(" - ", "–") : "";

      html += `
        <tr data-block="${b.blockNumber}">
          <td><strong>#${b.blockNumber}</strong></td>
          <td>${compactTime}</td>
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

    // Preserve container scroll position so table re-rendering doesn't cause jumpiness
    const container = this.tableBody ? this.tableBody.closest(".table-scroll-container") : null;
    const prevScrollTop = container ? container.scrollTop : 0;

    this.tableBody.innerHTML = html;

    if (container && prevScrollTop > 0) {
      container.scrollTop = prevScrollTop;
    }

    // Attach click on table row to jump scrubber
    this.tableBody.querySelectorAll("tr").forEach(tr => {
      tr.addEventListener("click", () => {
        const bNum = parseInt(tr.getAttribute("data-block"), 10);
        if (!isNaN(bNum)) {
          this.currentScrubBlock = bNum;
          this.timeScrubber.value = bNum;
          this.updateScrubberView(false);
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

    csv += `Block,Time Interval,Connected Load (kW),By BTM Solar (kW),BTM Curtailed (kW),By OA Solar (kW),By Grid (kW),Actual Grid Withdrawal (kW),Deviation (kW),Deviation (%),Dispatch Status,Applicable DSM Penalty (INR)\n`;

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

    // Site Coordinates & Meteorological Parameters
    const rooftopLat = this.rooftopLatInput ? (parseFloat(this.rooftopLatInput.value) || 18.5204) : 18.5204;
    const rooftopLon = this.rooftopLonInput ? (parseFloat(this.rooftopLonInput.value) || 73.8567) : 73.8567;
    const rooftopTilt = this.rooftopTiltInput ? (parseFloat(this.rooftopTiltInput.value) || calculateOptimalTilt(rooftopLat)) : 19;
    const oaLat = this.oaLatInput ? (parseFloat(this.oaLatInput.value) || 27.5385) : 27.5385;
    const oaLon = this.oaLonInput ? (parseFloat(this.oaLonInput.value) || 71.9168) : 71.9168;
    const oaTilt = calculateOptimalTilt(oaLat);
    const oaTracking = this.oaTrackingSelect ? this.oaTrackingSelect.value : "fixed";
    const scheduleDate = this.custScheduleDateInput ? this.custScheduleDateInput.value : null;

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
      customOaRate,
      rooftopLat,
      rooftopLon,
      rooftopTilt,
      oaLat,
      oaLon,
      oaTilt,
      oaTracking,
      scheduleDate
    };
  }

  /**
   * Updates PVGIS and Astronomical Solar Telemetry Chips in the Sidebar
   */
  updateSolarTelemetryView(solarTelemetry) {
    if (!solarTelemetry) return;
    const { rooftop, oa, timeShiftMinutes, isLivePvgisSynced } = solarTelemetry;

    if (this.pvgisTimeShiftVal) {
      if (timeShiftMinutes === 0) {
        this.pvgisTimeShiftVal.textContent = "In-Sync (0 min)";
      } else if (timeShiftMinutes > 0) {
        this.pvgisTimeShiftVal.textContent = `OA Lags by ${timeShiftMinutes} min`;
      } else {
        this.pvgisTimeShiftVal.textContent = `OA Leads by ${Math.abs(timeShiftMinutes)} min`;
      }
    }

    if (this.pvgisRooftopInsolationVal && rooftop) {
      this.pvgisRooftopInsolationVal.textContent = `${rooftop.dailyInsolationKWh} kWh/m²`;
    }

    if (this.pvgisOAInsolationVal && oa) {
      this.pvgisOAInsolationVal.textContent = `${oa.dailyInsolationKWh} kWh/m²`;
    }

    if (this.pvgisOaCufVal && oa) {
      this.pvgisOaCufVal.textContent = `CUF: ${oa.cuf}% (${oa.isTracker ? '1-Axis' : 'Fixed'})`;
    }

    if (this.pvgisMetBadge) {
      if (isLivePvgisSynced) {
        this.pvgisMetBadge.textContent = "PVGIS Live";
        this.pvgisMetBadge.style.background = "rgba(59, 130, 246, 0.25)";
        this.pvgisMetBadge.style.color = "#60A5FA";
      } else {
        this.pvgisMetBadge.textContent = "PVGIS Active";
        this.pvgisMetBadge.style.background = "rgba(16, 185, 129, 0.18)";
        this.pvgisMetBadge.style.color = "#34D399";
      }
    }
  }

  /**
   * Opens the SLDC schedule print preview modal and prepares preview container
   */
  openPrintModal() {
    if (!this.app.lastEvaluationResults) return;
    const printHTML = this.generateSLDCPrintHTML();
    if (this.printPreviewContainer) {
      this.printPreviewContainer.innerHTML = printHTML;
    }
    if (this.printModal) {
      this.printModal.classList.add("active");
    }
  }

  /**
   * Closes the SLDC schedule print preview modal and cleans up DOM content
   */
  closePrintModal() {
    if (this.printModal) {
      this.printModal.classList.remove("active");
    }
    if (this.printPreviewContainer) {
      this.printPreviewContainer.innerHTML = "";
    }
    if (this.sldcPrintDossier) {
      this.sldcPrintDossier.innerHTML = "";
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

    const rooftopLat = this.rooftopLatInput ? (parseFloat(this.rooftopLatInput.value) || 18.5204).toFixed(4) : "18.5204";
    const rooftopLon = this.rooftopLonInput ? (parseFloat(this.rooftopLonInput.value) || 73.8567).toFixed(4) : "73.8567";
    const rooftopTilt = this.rooftopTiltInput ? this.rooftopTiltInput.value : "15";
    const oaLat = this.oaLatInput ? (parseFloat(this.oaLatInput.value) || 27.5385).toFixed(4) : "27.5385";
    const oaLon = this.oaLonInput ? (parseFloat(this.oaLonInput.value) || 71.9168).toFixed(4) : "71.9168";
    const oaTracking = this.oaTrackingSelect ? this.oaTrackingSelect.value : "fixed";
    const oaParkName = this.oaAddressSearchInput ? this.oaAddressSearchInput.value : "Remote Solar Park Node";
    const solarTel = results.solarTelemetry;
    const timeShiftMinutes = solarTel ? solarTel.timeShiftMinutes : 0;

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
            <td class="meta-val">
              <strong>${rooftopKWp} kWp</strong> (Zero-Export Mode / Class 0.2s RPR Protected)<br>
              <span style="font-size: 0.72rem; color: #475569;">GPS: ${rooftopLat}° N, ${rooftopLon}° E | Tilt: ${rooftopTilt}° South (Yield: ${solarTel && solarTel.rooftop ? solarTel.rooftop.dailyGenKWhPerKWp : '5.2'} kWh/kWp)</span>
            </td>
            <td class="meta-label">Captive Open Access Solar:</td>
            <td class="meta-val">
              <strong>${oaKWp} kWp</strong> (${oaTracking === 'tracker' ? 'Single-Axis Tracking' : 'Fixed Tilt ' + calculateOptimalTilt(oaLat) + '°'})<br>
              <span style="font-size: 0.72rem; color: #475569;">GPS: ${oaLat}° N, ${oaLon}° E | ${oaParkName} (Offset: ${timeShiftMinutes >= 0 ? '+' : ''}${timeShiftMinutes} min)</span>
            </td>
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
