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

export const notify = async (
  event,
  octokit,
  status = { state: "pending", description: "Checking bundle size" }
) => {
  if (!validate(event)) return false;

  octokit.authenticate({
    type: "token",
    token: process.env.GITHUB_TOKEN
  });

  const repoOwner = event.repository.owner.name; // cds-snc
  const repoName = event.repository.name; // bundle-size-tracker

  const statusObj = Object.assign(
    {
      owner: repoOwner,
      repo: repoName,
      sha: event.after,
      context: "Bundle Tracker"
    },
    status
  );

  const result = await octokit.repos.createStatus(statusObj);

  return result;
};
