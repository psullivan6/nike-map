function compare(key) {
  return function compareInner(a, b) {
    const bandA = a[key];
    const bandB = b[key];

    let comparison = 0;
    if (bandA > bandB) {
      comparison = 1;
    } else if (bandA < bandB) {
      comparison = -1;
    }
    return comparison;
  };
}

exports.sortBy = function sortBy(array, key) {
  return array.sort(compare(key));
};
