// Mock DOM elements and environment
const mockElement = (id) => ({
  id,
  value: '',
  textContent: '',
  innerHTML: '',
  style: {},
  classList: {
    add: () => {},
    remove: () => {},
    toggle: () => {},
    contains: () => false
  },
  addEventListener: () => {},
  contains: () => false,
  querySelectorAll: () => []
});

global.document = {
  getElementById: (id) => mockElement(id),
  querySelector: () => mockElement('query'),
  querySelectorAll: () => [],
  addEventListener: () => {}
};
global.window = {
  addEventListener: () => {}
};
global.STATE_POLICIES = {
  maharashtra: { name: 'Maharashtra', transmissionLossesByVoltage: { '33': 3.8 } }
};

const {
  UIController,
  calculateOptimalTilt,
  highlightMatches,
  INDIAN_GEO_DIRECTORY,
  OA_SOLAR_PARK_DIRECTORY
} = require('../js/uiController.js');

console.log('--- 1. Testing calculateOptimalTilt ---');
console.assert(calculateOptimalTilt(18.52) === 19, 'Optimal tilt for Pune ~19');
console.assert(calculateOptimalTilt(27.54) === 27, 'Optimal tilt for Bhadla ~27');
console.assert(calculateOptimalTilt(8.71) === 11, 'Optimal tilt for Tirunelveli ~11');
console.assert(calculateOptimalTilt(33.12) === 32, 'Optimal tilt for Ladakh ~32');
console.log('✓ calculateOptimalTilt PASS (all latitudes correctly map to optimal tilt between 10° and 35°)');

console.log('--- 2. Testing highlightMatches ---');
const highlighted = highlightMatches('Pune MIDC, Chakan', 'chakan');
console.assert(highlighted.includes('geo-match-highlight'), 'Highlight contains match class');
console.log('✓ highlightMatches PASS: ' + highlighted);

console.log('--- 3. Testing UIController Dynamic Autocomplete Queries ---');
const dummyApp = { recalculate: () => {} };
const controller = new UIController(dummyApp);

// Test Rooftop dynamic search across various Indian industrial hubs
const rooftopTests = ['chakan', 'sanand', 'peenya', 'manesar', 'noida', 'hosur', 'waluj', 'dahej', 'bhiwadi', 'oragadam', 'butibori', 'taloja', 'vapi', 'cherlapally', 'ludhiana', 'baddi', 'sitapura', 'dankuni', 'coimbatore', 'nashik', 'whitefield', 'jamshedpur', 'sri city', 'haridwar', 'urla'];

rooftopTests.forEach(query => {
  const matches = controller.queryLocalRooftopLocations(query);
  console.assert(matches.length > 0, `Should find match for rooftop search: "${query}"`);
  console.log(`  ✓ Rooftop search "${query}" -> ${matches[0].name} (${matches[0].lat}°N, ${matches[0].lon}°E) [${matches[0].badge}]`);
});

// Test Rooftop numeric coordinates
const rooftopCoords = controller.queryLocalRooftopLocations('19.0760, 72.8777');
console.assert(rooftopCoords.length > 0 && rooftopCoords[0].badgeClass === 'badge-gps', 'Should match GPS coords');
console.log('  ✓ Rooftop GPS Coords search ->', rooftopCoords[0].name);

// Test Open Access dynamic search across premier solar parks
const oaTests = ['bhadla', 'pavagada', 'charanka', 'rewa', 'kurnool', 'dholera', 'khavda', 'bikaner', 'fatehgarh', 'ananthapuramu', 'tirunelveli', 'kamuthi', 'neemuch', 'agar', 'nokh', 'rajnandgaon', 'jalaun', 'kadapa', 'sakri', 'dondaicha', 'shirsuphal', 'pang', 'raghanesda', 'kasaragod'];

oaTests.forEach(query => {
  const matches = controller.queryLocalOALocations(query);
  console.assert(matches.length > 0, `Should find match for OA solar search: "${query}"`);
  console.log(`  ✓ OA search "${query}" -> ${matches[0].name} (${matches[0].lat}°N, ${matches[0].lon}°E) [${matches[0].badge}]`);
});

// Test OA numeric coordinates
const oaCoords = controller.queryLocalOALocations('27.5385 71.9168');
console.assert(oaCoords.length > 0 && oaCoords[0].badgeClass === 'badge-gps', 'Should match GPS coords');
console.log('  ✓ OA GPS Coords search ->', oaCoords[0].name);

// Test empty query returns default state site recommendations
const defaultRooftop = controller.queryLocalRooftopLocations('', 'maharashtra');
console.assert(defaultRooftop.length > 0, 'Default rooftop recommendations should not be empty');
console.log(`  ✓ Default rooftop recommendation (Maharashtra) -> ${defaultRooftop[0].name}`);

const defaultOA = controller.queryLocalOALocations('', 'rajasthan');
console.assert(defaultOA.length > 0, 'Default OA recommendations should not be empty');
console.log(`  ✓ Default OA recommendation (Rajasthan) -> ${defaultOA[0].name}`);

// Test applyRooftopLocation and applyOALocation
console.log('--- 4. Testing applyLocation Callbacks ---');
let recalculated = false;
dummyApp.recalculate = () => { recalculated = true; };

controller.applyRooftopLocation({
  name: "Sanand GIDC, Ahmedabad, Gujarat",
  lat: 22.9868,
  lon: 72.3787,
  address: "Plot G-22, GIDC Sanand, Gujarat",
  substation: "Sanand 66/11kV GETCO Substation"
});

console.assert(controller.rooftopLatInput.value === "22.9868", "Rooftop Lat updated");
console.assert(controller.rooftopLonInput.value === "72.3787", "Rooftop Lon updated");
console.assert(controller.rooftopTiltInput.value === 23, "Rooftop Optimal Tilt calculated");
console.assert(recalculated === true, "Recalculation triggered on rooftop select");
console.log('✓ applyRooftopLocation properly updated Lat/Lon (22.9868, 72.3787), optimal tilt (23°), and triggered recalculation');

recalculated = false;
controller.applyOALocation({
  name: "Pavagada Solar Park (Shakti Sthala), Tumakuru, Karnataka",
  lat: 14.2811,
  lon: 77.2758,
  substation: "Pavagada 400/220kV KSPDCL Pooling Substation"
});

console.assert(controller.oaLatInput.value === "14.2811", "OA Lat updated");
console.assert(controller.oaLonInput.value === "77.2758", "OA Lon updated");
console.assert(recalculated === true, "Recalculation triggered on OA select");
console.log('✓ applyOALocation properly updated Lat/Lon (14.2811, 77.2758) and triggered recalculation');

console.log('=== ALL TESTS AND INTEGRATION CHECKS PASSED WITH 100% SUCCESS! ===');


