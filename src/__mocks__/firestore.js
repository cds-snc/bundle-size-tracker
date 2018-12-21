import { reports } from "reports";

export const fixtureData = {
  __collection__: {
    bundle_sizes: {
      __doc__: {
        abcd: {
          repo: "cds-snc/sample",
          sha: "abcd",
          timestamp: 1544562296580,
          branch: "refs/heads/master",
          data: reports[0]
        },
        efgh: {
          repo: "cds-snc/sample",
          sha: "efgh",
          timestamp: 1544562468330,
          branch: "refs/heads/test",
          data: reports[1]
        }
      }
    }
  }
};
