import { reports } from "reports";

export const fixtureData = {
  __collection__: {
    bundle_sizes: {
      __doc__: {
        abcd: {
          sha: "bcb9ef283900698971b4e1c44817943793ef22f7",
          timestamp: 1545931001230,
          branch: "refs/heads/master",
          repo: "cds-snc/bundle-size-tracker-demo-app",
          data: [
            {
              timestamp: 1545931001063,
              files: [
                { filesize: 36717, filename: "bundle.js" },
                { filename: "index.html", filesize: 4474 }
              ]
            }
          ]
        },
        efgh: {
          repo: "cds-snc/bundle-size-tracker-demo-app",
          sha: "efgh",
          timestamp: 1544562468330,
          branch: "refs/heads/test",
          data: reports[1]
        }
      }
    }
  }
};
