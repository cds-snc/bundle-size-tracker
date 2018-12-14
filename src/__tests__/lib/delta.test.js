import { calculateDelta, sumDelta } from "../../lib/delta";

import { reports } from "../../__mocks__/reports";

describe("calculateDelta", () => {
  it("returns an object of file keys with size change deltas", () => {
    let results = calculateDelta(reports[0], reports[1]);
    expect(Object.keys(results).length).toEqual(2);
  });

  it("caluclates the deltas for changed files", () => {
    let results = calculateDelta(reports[0], reports[1]);
    expect(Object.values(results)).toEqual([10000, 200]);
  });

  it("takes into consideration files that have been added", () => {
    let results = calculateDelta(reports[0], reports[1]);
    expect(results["bundle.js"]).toEqual(10000);
  });

  it("returns false for invalid inputs", () => {
    expect(calculateDelta(false, reports[1])).toEqual(false);
    expect(calculateDelta(reports[0])).toEqual(false);
    expect(calculateDelta({}, {})).toEqual(false);
  });
});

describe("sumDelta", () => {
  it("sums all the values of a result object", () => {
    const result = { a: 1, b: 2, c: -4 };
    expect(sumDelta(result)).toEqual(-1);

    const result1 = { a: -11, b: 2, c: -4 };
    expect(sumDelta(result1)).toEqual(-13);
  });
});
