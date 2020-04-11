import fs from 'fs';
import fetch from 'node-fetch';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const stateMappingsPath = path.join(
  path.resolve(),
  '/data/state-mappings.json'
);

export function getStateMappings() {
  return JSON.parse(fs.readFileSync(stateMappingsPath));
}

export function setStateMappings(newData) {
  const stateMappingsData = getStateMappings();
  return fs.writeFileSync(
    stateMappingsPath,
    JSON.stringify({
      ...stateMappingsData,
      ...newData,
    })
  );
}

export async function getGeocodedState({ coordinates: { lat, lng }, id }) {
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

  // If we had to GET the data, then set it in the file, so we don't make the request again
  setStateMappings({
    [id]: formatted_address,
  });

  return formatted_address;
}
