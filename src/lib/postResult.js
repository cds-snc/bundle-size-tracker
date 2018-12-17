/* https://octokit.github.io/rest.js/ */
require("dotenv-safe").config({ allowEmptyValues: true });

const validate = event => {
  if (
    !event ||
    !event.repository ||
    !event.repository.name ||
    !event.repository.owner ||
    !event.repository.owner.name
  ) {
    return false;
  }

  return true;
};

export const postResult = async (event, octokit, sum) => {
  try {
    if (!validate(event)) return false;

    octokit.authenticate({
      type: "token",
      token: process.env.GITHUB_TOKEN
    });

    const repoOwner = event.repository.owner.name; // cds-snc
    const repoName = event.repository.name; // bundle-size-tracker

    const result = await octokit.repos.createStatus({
      owner: repoOwner,
      repo: repoName,
      sha: event.after,
      state: "success",
      description: `${sum} bytes`,
      context: "Bundle Tracker"
    });

    return result;
  } catch (e) {
    console.log(e);
    return false;
  }
};
