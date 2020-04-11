import fs from 'fs';
import path from 'path';
import { remap } from './utilities/misc.js';
import { parse } from './utilities/activities.js';

export async function getMapData() {
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
