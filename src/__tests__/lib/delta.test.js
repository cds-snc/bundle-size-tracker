import { calculateDelta, sumDelta } from "../../lib/delta";

import { reportOne } from "../../__mocks__/report_one";
import { reportTwo } from "../../__mocks__/report_two";

describe("calculateDelta", () => {
  it("returns an object of file keys with size change deltas", () => {
    let results = calculateDelta(reportOne[0], reportTwo[0]);
    expect(Object.keys(results).length).toEqual(3);
  });

  it("caluclates the deltas for changed files", () => {
    let results = calculateDelta(reportOne[0], reportTwo[0]);
    expect(Object.values(results)).toEqual([1000, 1000, 1914]);
  });

  it("takes into consideration files that have been added", () => {
    let results = calculateDelta(reportOne[0], reportTwo[0]);
    expect(results["foo/foo.a1e6t.chunk.js"]).toEqual(1914);
  });

  it("returns false for invalid inputs", () => {
    expect(calculateDelta(false, reportTwo[0])).toEqual(false);
    expect(calculateDelta(reportOne[0])).toEqual(false);
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
