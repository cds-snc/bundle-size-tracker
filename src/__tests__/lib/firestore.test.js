import { loadFromFirestore, saveToFirestore } from "../../lib/firestore";

describe("loadFromFirestore", () => {
  it("returns data for a specific sha abd tge last master", async () => {
    let result = await loadFromFirestore(
      "cds-snc/bundle-size-tracker-demo-app",
      "efgh"
    );
    expect(result[0].branch).toEqual("refs/heads/test");
    expect(result[1].branch).toEqual("refs/heads/master");
  });

  it("returns the last master data if no sha is found and master data for the sha", async () => {
    let result = await loadFromFirestore(
      "cds-snc/bundle-size-tracker-demo-app",
      "ijkl"
    );
    expect(result[0].branch).toEqual("refs/heads/master");
    expect(result[0].sha).toEqual("bcb9ef283900698971b4e1c44817943793ef22f7");
    expect(result[1].branch).toEqual("refs/heads/master");
    expect(result[1].sha).toEqual("bcb9ef283900698971b4e1c44817943793ef22f7");
  });

  it("returns an array of empty object with no data if nothing exists", async () => {
    let result = await loadFromFirestore("cds-snc/what", "ijkl");
    expect(result[0]).toEqual({ data: [{ files: [] }] });
    expect(result[1]).toEqual({ data: [{ files: [] }] });
  });
});

describe("saveToFirestore", () => {
  it("saves an object to Firestore", async () => {
    let payload = {
      repo: "cds-snc/bundle-size-tracker-demo-app",
      branch: "master",
      sha: "ijkl",
      data: { foo: "bar" }
    };
    let results = await saveToFirestore(payload);
    expect(results).toEqual(true);
  });
});
