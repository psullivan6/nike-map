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

exports.sortBy = function sortBy(array, key) {
  return array.sort(compare(key));
};
