import fs from 'fs';
import path from 'path';
import pug from 'pug';
import { getMapData } from './parse.js';

// Compile the source code
const compiledFunction = pug.compileFile(
  path.join(path.resolve(), 'templates/index.pug')
);

async function build() {
  const mapData = await getMapData();
  const years = Object.keys(mapData.byYear);

  years.forEach((year) => {
    const html = compiledFunction({ year });
    fs.writeFileSync(path.join(path.resolve(), 'public', `${year}.html`), html);
  });
}

build();
