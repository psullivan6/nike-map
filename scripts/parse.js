import fs from 'fs';
import path from 'path';
import { remap } from './utilities/misc.js';
import { parse } from './utilities/activities.js';

async function init() {
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

  const mapData = {
    all: parsedActivities,
    byYear,
    byState,
  };

  fs.writeFileSync(
    path.join(path.resolve(), 'public/data.js'),
    `window.mapData = ${JSON.stringify(mapData)};\n`
  );
}

init();
