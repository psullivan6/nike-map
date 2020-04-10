const fs = require('fs');
const path = require('path');
const data = require('../data/activity-6bf282d8-a435-4bbe-879c-052d9acd5a53.json');
// const data = require('../data/activity-9924000000019658142330003366433067222829.json');

const { sortBy } = require('./utilities');

const latitudes = sortBy(
  data.metrics.find((metric) => metric.type === 'latitude').values,
  'end_epoch_ms'
);
const longitudes = sortBy(
  data.metrics.find((metric) => metric.type === 'longitude').values,
  'end_epoch_ms'
);

const coordinates = latitudes.map((lat, index) => ({
  lat: lat.value,
  lng: longitudes[index].value,
}));

const fileData = `window.mapData = ${JSON.stringify(coordinates, null, 2)};\n`;

fs.writeFileSync(path.join(__dirname, '../public/data.js'), fileData);
