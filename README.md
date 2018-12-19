# Bundle size tracker

[![Maintainability](https://api.codeclimate.com/v1/badges/8bc41e8da2ba8bc90471/maintainability)](https://codeclimate.com/github/cds-snc/bundle-size-tracker/maintainability)

(Work in progress, but it more or less works)

The purpose of this cloud function is to record changes in your bundle size over time.

## Requirements

- Webpack
- [Webpack Size-Plugin](https://github.com/GoogleChromeLabs/size-plugin) Current code uses a fork
- Compatability with Node 8
- NPM

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

Currently the cloud function is deployed using Google Cloud functions because they will install NPM and Yarn packages as part of their deploy. AWS Lambda requires you to put any outside binaries into their deployment package. Data is currently stored in a Dynamo DB but will be moved over to the Google equivalent for consistencies sake.

## Why the restrictions?

- Webpack - Webpack is required for the bundle size plugin
- Compatability with Node 8 - This is the runtime on Google Cloud functions
- NPM - This is the package manager that is installed on Google Cloud functions
