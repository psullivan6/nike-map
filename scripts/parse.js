const fs = require('fs');
const path = require('path');
const { remap } = require('./utilities/misc.js');
const { parse } = require('./utilities/activities.js');

async function getMapData() {
  const parsedActivities = await parse();
  const byYear = remap({
    data: parsedActivities,
    lookupKey: 'year',
    valuesKey: 'coordinates',
  });
  const byState = remap({
    data: parsedActivities,
    lookupKey: 'state',
    valuesKey: 'coordinates',
  });

  return {
    all: parsedActivities,
    byYear,
    byState,
  };
}

async function init() {
  const mapData = await getMapData();

  fs.writeFileSync(
    path.join(path.resolve(), 'public/data.js'),
    `window.mapData = ${JSON.stringify(mapData)};\n`
  );
}

init();

exports.getMapData = getMapData;
