export const calculateDelta = (before, after) => {
  if (
    !before ||
    !after ||
    !before.hasOwnProperty("files") ||
    !after.hasOwnProperty("files")
  ) {
    return false;
  }

  let results = {};

  const beforeFiles = before.files.reduce((o, f) => {
    o[f.filename] = f.size;
    return o;
  }, {});

  const afterFiles = after.files.reduce((o, f) => {
    o[f.filename] = f.size;
    return o;
  }, {});

  Object.keys(beforeFiles).forEach(f => {
    if (afterFiles[f]) {
      results[f] = afterFiles[f] - beforeFiles[f];
    } else {
      results[f] = 0 - beforeFiles[f];
    }
  });

  Object.keys(afterFiles)
    .filter(x => !Object.keys(beforeFiles).includes(x))
    .forEach(f => (results[f] = afterFiles[f]));

  return results;
};

export const sumDelta = results => {
  return Object.values(results).reduce((a, b) => a + b, 0);
};

export const delta = ({ previousData, before }) => {
  return sumDelta(calculateDelta(previousData.data, {})); // @todo need data from resykts as second param
};
