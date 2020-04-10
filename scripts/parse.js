const fs = require('fs');
const path = require('path');
const dataDirectory = path.join(__dirname, '../data');
const files = fs.readdirSync(dataDirectory);
const { sortBy } = require('./utilities');

const errors = [];

const filesData = files
  .map((file) => ({
    filePath: file,
    data: JSON.parse(fs.readFileSync(path.join(dataDirectory, file))),
  }))
  .filter(({ filePath, data: fileData }) => {
    try {
      if (fileData.tags == null) {
        throw new Error('Improperly formatted JSON');
      }

      if (
        fileData.tags.location === 'indoors' ||
        (fileData.tags.terrain || '').toLowerCase() === 'treadmill'
      ) {
        throw new Error('Indoor run\t\t');
      }

      if (fileData.metrics == null) {
        throw new Error('No metrics to read from');
      }

      if (!fileData.metric_types.includes('longitude', 'latitude')) {
        throw new Error('Does not include coordinates');
      }

      return true;
    } catch (error) {
      errors.push({ error, fileData, filePath });
      return false;
    }
  })
  .map(({ data }) => {
    const latitudes = data.metrics.find((metric) => metric.type === 'latitude')
      .values;
    const longitudes = data.metrics.find(
      (metric) => metric.type === 'longitude'
    ).values;

    return {
      id: data.id,
      coordinates: latitudes.map((lat, index) => ({
        lat: lat.value,
        lng: longitudes[index].value,
      })),
    };
  });

fs.writeFileSync(
  path.join(__dirname, '../public/data.js'),
  `window.mapData = ${JSON.stringify(filesData)};\n`
);

sortBy(errors, 'fileData.start_epoch_ms').forEach(
  ({ error, fileData, filePath }) => {
    console.warn(
      error.toString(),
      '\t',
      new Date(fileData.start_epoch_ms).toLocaleDateString(),
      '\t',
      filePath
    );
  }
);
