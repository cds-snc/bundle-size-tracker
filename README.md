# Bundle size tracker

[![Maintainability](https://api.codeclimate.com/v1/badges/8bc41e8da2ba8bc90471/maintainability)](https://codeclimate.com/github/cds-snc/bundle-size-tracker/maintainability)
[![Known Vulnerabilities](https://snyk.io/test/github/cds-snc/bundle-size-tracker/badge.svg)](https://snyk.io/test/github/cds-snc/bundle-size-tracker)

The purpose of this cloud function is to record changes in your bundle size over time.

## What does that mean?

Assume you are adding a package to your bundle, lets say [https://momentjs.com](https://momentjs.com), which is a great library. You open your PR and the function tells you that by adding moment.js you are now adding an additional 66 kB to your bundle size. Upon reflection, you realize you only need one feature from moment.js, so you find an alternative instead, [https://date-fns.org/](https://date-fns.org/) and you put that in. Your next commit shows an increase of 1.03 kB vs. the current master and a reduction of -65.6 kB vs. your previous commit with moment.

**Pull Request - bundle tracker runs and saves the size data**

<img src="https://user-images.githubusercontent.com/62242/50724546-29f07a80-10bd-11e9-8fff-c07637d053fd.gif" width="600">

**Result**

<img src="https://user-images.githubusercontent.com/62242/50724545-278e2080-10bd-11e9-81f5-0c3fb20210d6.png" width="600">



## Why is it important?

Bundles sizes are important when you design services that need to be zippy on 3G networks.

## Table of Contents
- [Requirements](#requirements)
- [Installing](#installing)
- [Environment variables](#environment-variables)
- [Information flow](#information-flow)
- [Why the restrictions?](#why-the-restrictions)

## Requirements

- Webpack
- [Webpack Size-Plugin](https://github.com/GoogleChromeLabs/size-plugin) Current code uses a fork
- Compatibility with Node 8
- NPM

## Installing

#### Cloud function
We use the [Serverless framework](https://serverless.com/) to scaffold our functions. The idea is to remain platform agnostic but it quickly turned out that Google Cloud functions had features that were easier to work with than AWS. As a result, to install the code on a Google Cloud function you need to follow the instruction [here](https://serverless.com/framework/docs/providers/google/guide/credentials/) to set up the correct credentials. Be sure to install the Serverless framework as well by following their instructions.

Modify the `serverless.yml` file by changing the `service` and `project` values to the name of your Google Cloud Project as well as the path to the credentials JSON file you set up using the Serverless instructions above under the `credentials` key.

To store your data, you also need to create a [Google Firestore](https://cloud.google.com/firestore/) project. The URL for that project needs to populate the `FIRESTORE_URL` environment variable.

Once you have your firestore created you need to create an index for the data to work properly. You can do that by visiting the following URL:

`https://console.firebase.google.com/project/PROJECT_NAME/database/firestore/indexes?create_index=EgxidW5kbGVfc2l6ZXMaCAoEcmVwbxACGg0KCXRpbWVzdGFtcBADGgwKCF9fbmFtZV9fEAM` 

where `PROJECT_NAME` is the name of your Google project. The cloud function **will fail** if you do not do this.

You also need to generate a GitHub token to write the statuses back to you repos. Read more about tokens [here](https://blog.github.com/2013-05-16-personal-api-tokens/). You only need the basic repo permissions enabled. Use this token in the `GITHUB_TOKEN` environment variable.

Save the environment information in a `.env` file. Consult the `.env.example` and the [table below](#environment-variables) for more information.

Install all the required dependencies using your preferred node package manager and then just run `serverless deploy`. Your cloud function is now deployed. It will return the URL of the cloud function that you can then use as a webhook. Read more about GitHub Webhooks [here](https://help.github.com/articles/about-webhooks/).

To analyze your package sizes you will need to install the `size-plugin` as described below.

#### WebPack Size plugin 

##### Install

```bash
yarn add --dev cds-size-plugin
```

##### WebPack config

```javascript 
const path = require("path");
const SizePlugin = require("cds-size-plugin");

module.exports = ({ mode = "production" }) => {
  return {
    entry: "./src/client.js",
    mode: mode,
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "bundle.js"
    },
    plugins: [
      new SizePlugin()
    ],
    ...
  };
};
```

##### RazzleJS

```javascript 
//razzle.config.js

module.exports = {
  modify: (config, { target, dev }, webpack) => {
    const SizePlugin = require("cds-size-plugin");
    config.plugins.push(
      new SizePlugin()
    );
    return config;
  }
};

```

#### next.js
```javascript 
//next.config.js

module.exports = {
  webpack: function (config, { isServer }) {
    const SizePlugin = require("cds-size-plugin");
    config.plugins.push(
      new SizePlugin()
    );
    return config;
  }
};

```


## Environment variables

Required variables are defined in `.env.example` with defaults. They are used as follows:

| Name  | Purpose  | Overridable per repo   |
|---|---|---|
|  BUILD_CMD | The command that NPM runs when it is trying to build your bundles. The default is assumed to be `build`, but it can be anything you like.  | YES   |
|  CHARTING_URL | The URL of your Charting cloud function to chart the data you have collected. Not required  | NO  |
|  FIRESTORE_URL | The URL of your Firestore to keep track of your bundle size data  | NO  |
|  GITHUB_TOKEN |  The token so the cloud function can send status updates back to your pull requests |  NO |
|  SRC_PATH | The path to your app relative to your repo. If your app is at the root, it is blank. If you are using a monorepo, you might want to go one or more levels down.  | YES  |
|  TMP_PATH |  The path to the directory in which your repo gets cloned by the cloud function. `/tmp` is the sane default, but feel free to adjust as needed. | NO  |

#### How does overriding by repo work?

You can create a `.bundle-size-tracker-config` file in the root of your repo. The cloud function will respect the environment variables defined in that over the ones that have been configured for itself. This is useful if, for example, you are using the same cloud function on ten different repos, but ones does not use a standard build command or is a monorepo. An example is here: https://github.com/cds-snc/bundle-size-tracker-demo-app/blob/master/.bundle-size-tracker-config
 
## Information flow

The flow of information is straightforward:

1. A repo receives a commit
2. GitHub pushes the commit event to a cloud function
3. Cloud function checks out the git repo at the commit
4. Cloud function checks if the repo contains the required webpack plugin
5. Cloud function notifies GitHub it is checking the bundle size
6. Cloud function looks for historic information on the repo and branch in a database
7. Cloud function installs the packages in the repo and runs the build to determine bundle size
8. Cloud function records the new results in the database
9. Cloud function calculates the change delta and posts it back to GitHub

Charting the data is also a WIP - https://github.com/cds-snc/bundle-size-charter

## Implementation

Currently the cloud function is deployed using Google Cloud functions because they will install NPM and Yarn packages as part of their deploy. Data is currently stored in Firebase.

## Why the restrictions?

- Webpack - Webpack is required for the bundle size plugin
- Compatibility with Node 8 - This is the runtime on Google Cloud functions
- NPM - This is the package manager that is installed on Google Cloud functions

## Hey you! Yes you!

You seem like you might be interested in what we do, find out more here: [https://digital.canada.ca/work-with-us/](https://digital.canada.ca/work-with-us/)
