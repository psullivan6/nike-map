import fs from 'fs';
import path from 'path';
import { sortBy } from './misc.js';
import { getGeocodedState } from './geoState.js';

const activitiesDirectory = path.join(path.resolve(), 'data/activities');
const files = fs.readdirSync(activitiesDirectory);

export async function parse() {
  const errors = [];
  const parsedFiles = files
    .map((file) => ({
      filePath: file,
      data: JSON.parse(fs.readFileSync(path.join(activitiesDirectory, file))),
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
    .map(async ({ data: { end_epoch_ms, id, metrics } }) => {
      const latitudes = metrics.find((metric) => metric.type === 'latitude')
        .values;
      const longitudes = metrics.find((metric) => metric.type === 'longitude')
        .values;

      const coordinates = latitudes.map((lat, index) => ({
        lat: lat.value,
        lng: longitudes[index].value,
      }));

      return {
        id,
        year: new Date(end_epoch_ms).getFullYear(),
        state: await getGeocodedState({ id, coordinates: coordinates[0] }),
        coordinates,
      };
    });

  // Log any errors for visibility
  sortBy(errors, 'fileData.start_epoch_ms').forEach(
    ({ error, fileData, filePath }) => {
      console.warn(
        error.toString(),
        '\t',
        // [TODO] This might be inaccurate based on server location and the activity's original timezone
        new Date(fileData.start_epoch_ms).toLocaleDateString(),
        '\t',
        filePath
      );
    }
  );

  return Promise.all(parsedFiles);
}
