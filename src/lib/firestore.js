import MockFirebase from "mock-cloud-firestore";

const admin = require("firebase-admin");
let db;

switch (process.env.NODE_ENV) {
  case "dev":
    const serviceAccount = require("../../../bundle-size-tools-firebase-adminsdk.json");
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIRESTORE_URL
    });
    db = admin.firestore();
    break;
  case "test":
    const { fixtureData } = require("../__mocks__/firestore.js");
    let firebase = new MockFirebase(fixtureData);
    db = firebase.firestore();
    break;
  default:
    const functions = require("firebase-functions");
    admin.initializeApp(functions.config().firebase);
    db = admin.firestore();
}

module.exports.loadFromFirestore = async (repo, sha) => {
  const reposRef = db.collection("bundle_sizes");
  const query = reposRef.where("repo", "==", repo);
  let results = {};
  return query.get().then(resp => {
    var items = [];
    resp.forEach(r => items.push(r.data()));
    items.forEach(i => (results[i.sha] = i));
    const masters = items
      .filter(i => i.branch === "refs/heads/master")
      .sort((a, b) => b.timestamp - a.timestamp);
    if (results.hasOwnProperty(sha)) {
      return [
        results[sha],
        masters.length > 0 ? masters[0] : { data: [{ files: [] }] }
      ];
    } else {
      return [
        masters.length > 0 ? masters[0] : { data: [{ files: [] }] },
        masters.length > 0 ? masters[0] : { data: [{ files: [] }] }
      ];
    }
  });
};

module.exports.saveToFirestore = async payload => {
  payload["timestamp"] = Date.now();
  return db
    .collection("bundle_sizes")
    .add(payload)
    .then(() => true)
    .catch(() => false);
};
