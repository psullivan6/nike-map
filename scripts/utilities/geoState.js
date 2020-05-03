const fs = require('fs');
const fetch = require('node-fetch');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const stateMappingsPath = path.join(
  path.resolve(),
  '/data/state-mappings.json'
);

function getStateMappings() {
  return JSON.parse(fs.readFileSync(stateMappingsPath));
}

function setStateMappings(newData) {
  const stateMappingsData = getStateMappings();
  return fs.writeFileSync(
    stateMappingsPath,
    JSON.stringify({
      ...stateMappingsData,
      ...newData,
    })
  );
}

async function getGeocodedState({ coordinates: { lat, lng }, id }) {
  const stateMappingsData = getStateMappings();

  if (stateMappingsData[id] != null) {
    return stateMappingsData[id];
  }

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.GOOGLE_API_KEY}&result_type=administrative_area_level_1`
  );
  const {
    results: [{ formatted_address }],
  } = await response.json();

  const slugifiedAddress = formatted_address
    .split(',')[0]
    .toLowerCase()
    .split(' ')
    .join('-');

  // If we had to GET the data, then set it in the file, so we don't make the request again
  setStateMappings({
    [id]: slugifiedAddress,
  });

  return slugifiedAddress;
}

exports.getStateMappings = getStateMappings;
exports.setStateMappings = setStateMappings;
exports.getGeocodedState = getGeocodedState;
