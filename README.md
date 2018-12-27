# Bundle size tracker

[![Maintainability](https://api.codeclimate.com/v1/badges/8bc41e8da2ba8bc90471/maintainability)](https://codeclimate.com/github/cds-snc/bundle-size-tracker/maintainability)

(Work in progress, but it more or less works)

The purpose of this cloud function is to record changes in your bundle size over time.

## What does that mean?

Assume you are adding a package to your bundle, lets say [https://momentjs.com](https://momentjs.com), which is a great library. You open your PR and the function tells you that by adding moment.js you are now adding an additional 66 kb to your bundle size. Upon reflection, you realize you only need one feature from moment.js, so you find an alternative instead, [https://date-fns.org/](https://date-fns.org/) and you put that in. Your next commit shows an increase of 1.03 kb vs. the current master and a reduction of -65.6 kb vs. your previous commit with moment.

![Showing Diff](https://user-images.githubusercontent.com/867334/50255939-0e4d5a80-03c2-11e9-82dc-2de9c9dff87c.png)

## Why is it important?

Bundles sizes are important when you design services that need to be zippy on 3G networks.

## Requirements

- Webpack
- [Webpack Size-Plugin](https://github.com/GoogleChromeLabs/size-plugin) Current code uses a fork
- Compatibility with Node 8
- NPM

## Environment variables

Required variables are defined in `.env.example` with defaults. They are used as follows:

| Name  | Purpose  | Overridable per repo   |
|---|---|---|
|  BUILD_CMD | The command that NPM runs when it is trying to build your bundles. The default is assumed to be `build`, but it can be anything you like.  | YES   |
|  FIRESTORE_URL | The URL of your Firestore to keep track of your bundle size data  | NO  |
|  GITHUB_TOKEN |  The token so the cloud function can send status updates back to your pull requests |  NO |
|  SRC_PATH | The path to your app relative to your repo. If your app is at the root, it is blank. If you are using a monorepo, you might want to go one or more levels down.  | YES  |
|  TMP_PATH |  The path to the directory in which your repo gets cloned by the cloud function. `/tmp` is the sane default, but feel free to adjust as needed. | NO  |

#### How does overriding by repo work?

You can create a `.bundle-size-tracker-config` file in the root of your repo. The cloud function will respect the environment variables defined in that over the ones that have been configured for itself. This is useful if, for example, you are using the same cloud function on ten different repos, but ones does not use a standard build command or is a monorepo. An example is here: https://github.com/cds-snc/bundle-size-tracker-demo-app/blob/master/.bundle-size-tracker-config
 
## Architecture

The flow of information is straightforward:

1. A repo receives a commit
2. GitHub pushes the commit event to a cloud function
3. Cloud function checks out the git repo at the commit
4. Cloud function checks if the repo contains the required webpack plugin
5. Cloud function notifies GitHub it is checking the bundle size
6. Cloud function looks for historic information on the repo and branch in a database
7. Cloud function install the packages in the repo and runs the build to determine bundle size
8. Cloud function records the new results in the database
9. Cloud function calculates the change delta and posts it back to GitHub

Charting the data is also a WIP - https://github.com/cds-snc/bundle-size-charter

## Implementation

Currently the cloud function is deployed using Google Cloud functions because they will install NPM and Yarn packages as part of their deploy. Data is currently stored in Firebase.

## Why the restrictions?

- Webpack - Webpack is required for the bundle size plugin
- Compatibility with Node 8 - This is the runtime on Google Cloud functions
- NPM - This is the package manager that is installed on Google Cloud functions
