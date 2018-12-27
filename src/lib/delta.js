const reduceFiles = arr => {
  return arr.files.reduce((o, f) => {
    o[f.filename] = f.filesize;
    return o;
  }, {});
};

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

  const beforeFiles = reduceFiles(before);
  const afterFiles = reduceFiles(after);

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

export const delta = (previousData, current) => {
  return sumDelta(calculateDelta(previousData.data[0], current[0])); // @todo need data from resykts as second param
};
