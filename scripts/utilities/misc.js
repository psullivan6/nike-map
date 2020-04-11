function getNestedValue(initialObj, pathArr) {
  return pathArr.reduce(
    (obj, key) => (obj && obj[key] !== 'undefined' ? obj[key] : undefined),
    initialObj
  );
}

function compare(keysProp) {
  const keys = keysProp.split('.');
  return function compareInner(a, b) {
    const aValue = getNestedValue(a, keys);
    const bValue = getNestedValue(b, keys);

    let comparison = 0;
    if (aValue > bValue) {
      comparison = 1;
    } else if (aValue < bValue) {
      comparison = -1;
    }
    return comparison;
  };
}

export function sortBy(array, key) {
  return array.sort(compare(key));
}

export function remap({ data, lookupKey, valuesKey }) {
  return data.reduce((obj, item) => {
    if (obj[item[lookupKey]] == null) {
      return {
        ...obj,
        [item[lookupKey]]: [{ [valuesKey]: item[valuesKey] }],
      };
    }

    obj[item[lookupKey]].push({ [valuesKey]: item[valuesKey] });
    return obj;
  }, {});
}
