const fs = require('fs');
const path = require('path');
const pug = require('pug');
const { getMapData } = require('./parse');

// Compile the source code
const compiledFunction = pug.compileFile(
  path.join(path.resolve(), 'templates/index.pug')
);

async function build() {
  const mapData = await getMapData();
  const years = Object.keys(mapData.byYear);
  const states = Object.keys(mapData.byState).map((state) =>
    state.split(',')[0].toLowerCase().split(' ').join('-')
  );
  const slugs = [...years, ...states];

  fs.writeFileSync(
    path.join(path.resolve(), 'public/index.html'),
    compiledFunction({ slugs })
  );

  slugs.forEach((slug) => {
    const html = compiledFunction({ slugs, slug });
    fs.writeFileSync(path.join(path.resolve(), 'public', `${slug}.html`), html);
  });
}

build();
