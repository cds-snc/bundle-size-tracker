/* https://octokit.github.io/rest.js/ */

require("dotenv-safe").config({ allowEmptyValues: true });

const octokit = require("@octokit/rest")();

// @todo pass in data for sha etc....
const createStatus = async data => {
  try {
    octokit.authenticate({
      type: "token",
      token: process.env.GITHUB_TOKEN
    });
    const result = await octokit.repos.createStatus({
      owner: "cds-snc",
      repo: "bundle-size-tracker",
      sha: "2854aecdcc1bef9ad21177e6f33513fb364f3672",
      state: "success",
      description: "Check your bundle size Max",
      context: "Bundle Tracker"
    });
    console.log(result);
  } catch (e) {
    console.log(e);
  }
};

module.exports.createStatus = createStatus;
