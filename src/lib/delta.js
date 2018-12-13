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
  return Object.values(results).reduce((a, b) => a + b);
};

export const delta = ({ previousData, before }) => {
  let result;
  // Step 7: Calculate delta
  if (previousData.hasOwnProperty(before)) {
    result = calculateDelta(previousData[before], {}); // @todo second param needs to be result of npm build
  } else {
    // @todo look up latest master ref
    result = calculateDelta({}, {}); // @todo second param needs to be result of npm build
  }

  // Step 8. Post back to PR in Github
  return sumDelta(result);
};
