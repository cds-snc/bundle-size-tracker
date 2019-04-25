# Bundle size tracker

[![Maintainability](https://api.codeclimate.com/v1/badges/8bc41e8da2ba8bc90471/maintainability)](https://codeclimate.com/github/cds-snc/bundle-size-tracker/maintainability)
[![Known Vulnerabilities](https://snyk.io/test/github/cds-snc/bundle-size-tracker/badge.svg)](https://snyk.io/test/github/cds-snc/bundle-size-tracker)

(la version française suit)

The purpose of this cloud function is to record changes in your bundle size over time.

## What does that mean?

Assume you are adding a package to your bundle, lets say [https://momentjs.com](https://momentjs.com), which is a great library. You open your PR and the function tells you that by adding moment.js you are now adding an additional 66 kB to your bundle size. Upon reflection, you realize you only need one feature from moment.js, so you find an alternative instead, [https://date-fns.org/](https://date-fns.org/) and you put that in. Your next commit shows an increase of 1.03 kB vs. the current master and a reduction of -65.6 kB vs. your previous commit with moment.

**Pull Request - tracker runs and saves the data:**

<img src="https://user-images.githubusercontent.com/62242/50724546-29f07a80-10bd-11e9-8fff-c07637d053fd.gif" width="600">

**Result:**

<img src="https://user-images.githubusercontent.com/62242/50724545-278e2080-10bd-11e9-81f5-0c3fb20210d6.png" width="600">



## Why is it important?

Bundle sizes are important when you design services that need to be zippy on 3G networks.

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
We use the [Serverless framework](https://serverless.com/) to scaffold our functions. The idea is to remain platform agnostic but it quickly turned out that Google Cloud functions had features that were easier to work with than AWS. As a result, to install the code on a Google Cloud function you need to follow the instructions [here](https://serverless.com/framework/docs/providers/google/guide/credentials/) to set up the correct credentials. Be sure to install the Serverless framework as well by following their instructions.

Modify the `serverless.yml` file by changing the `service` and `project` values to the name of your Google Cloud Project as well as the path to the credentials JSON file you set up using the Serverless instructions above under the `credentials` key.

To store your data, you also need to create a [Google Firestore](https://console.firebase.google.com) project. The URL for that project needs to populate the `FIRESTORE_URL` environment variable.

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
|  CHARTING_URL | The URL of your Charting cloud function to chart the data you have collected. Not required.  | NO  |
|  FIRESTORE_URL | The URL of your Firestore to keep track of your bundle size data  | NO  |
|  GITHUB_TOKEN |  The token so the cloud function can send status updates back to your pull requests |  NO |
|  SRC_PATH | The path to your app relative to your repo. If your app is at the root, it is blank. If you are using a monorepo, you might want to go one or more levels down.  | YES  |
|  TMP_PATH |  The path to the directory in which your repo gets cloned by the cloud function. `/tmp` is the sane default, but feel free to adjust as needed. | NO  |

#### How does overriding by repo work?

You can create a `.bundle-size-tracker-config` file in the root of your repo. The cloud function will respect the environment variables defined in that over the ones that have been configured for itself. This is useful if, for example, you are using the same cloud function on ten different repos, but one does not use a standard build command or is a monorepo. An example is here: https://github.com/cds-snc/bundle-size-tracker-demo-app/blob/master/.bundle-size-tracker-config
 
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




# Outil de suivi de la taille des paquets

Cette fonction infonuagique vise à consigner les changements dans la taille de votre paquet (bundle) au fil du temps.

## Qu’est-ce que cela veut dire?

Supposons que vous ajoutez un progiciel à votre paquet, par exemple https://momentjs.com, qui est une excellente bibliothèque. Vous ouvrez votre demande de tirage (pull request), et la fonction vous dit qu’en ajoutant moment.js, vous ajoutez maintenant 66 ko à votre paquet. Après réflexion, vous vous rendez compte que vous n’avez besoin que d’une seule fonctionnalité de moment.js, donc vous trouvez plutôt une autre solution, https://date-fns.org/, et vous l’insérez. Votre prochaine validation (commit) indique une augmentation de 1,03 ko par rapport à la taille de base actuelle et une réduction de -65,6 ko par rapport à votre validation précédente avec moment.js.

**Demande de tirage – L’outil de suivi exécute et sauvegarde les données :

<img src="https://user-images.githubusercontent.com/62242/50724546-29f07a80-10bd-11e9-8fff-c07637d053fd.gif" width="600">

Résultat :


<img src="https://user-images.githubusercontent.com/62242/50724545-278e2080-10bd-11e9-81f5-0c3fb20210d6.png" width="600">


## Pourquoi est-ce important?

La taille des paquets est importante lorsque vous concevez des services qui doivent être rapides sur les réseaux 3G.

## Table des matières

[Exigences](#Exigences)
[Installation](#Installation)
[Variables d’environnement](#Variables d’environnement)
[Flux d’information](#Flux d’information)
[Pourquoi ces restrictions?](#Pourquoi ces restrictions?)

## Exigences

Webpack
Le code actuel du plugiciel de taille [Webpack]((https://github.com/GoogleChromeLabs/size-plugin)) utilise une fourche (fork).
Compatibilité avec Node 8
NPM

## Installation

#### Fonction infonuagique

Nous utilisons le cadre [Serverless](https://serverless.com/) pour échafauder nos fonctions. L’idée est de rester agnostique à la plateforme, mais il s’est rapidement avéré que les fonctions de Google Cloud étaient plus faciles à utiliser que celles d’AWS. Par conséquent, pour installer le code sur une fonction Google Cloud, vous devez suivre les instructions décrites ici pour configurer les bons justificatifs d’identité. Assurez-vous d’installer aussi le cadre Severless en suivant les instructions indiquées.

Modifiez le fichier `Serverless.yml` en remplaçant les valeurs de `service` et de `project` par le nom de votre projet Google Cloud, et en modifiant le chemin d’accès au fichier JSON de justificatifs d’identité que vous avez créé en utilisant les instructions de Serverless ci-dessus sous la clé `credentials`.

our stocker vos données, vous devez également créer un projet [Google Firestore](https://console.firebase.google.com). L’URL de ce projet doit remplir la variable d’environnement `FIRESTORE_URL`.

Une fois que vous avez créé votre Firestore, vous devez créer un index pour que les données fonctionnent correctement. Vous pouvez le faire à l’URL suivante :
`https://console.firebase.google.com/project/PROJECT_NAME/database/firestore/indexes?create_index=EgxidW5kbGVfc2l6ZXMaCAoEcmVwbxACGg0KCXRpbWVzdGFtcBADGgwKCF9fbmFtZV9fEAM`

où `PROJECT_NAME` est le nom de votre projet Google. Si vous ne le faites pas, la fonction infonuagique échouera.

Vous devez également générer un jeton GitHub pour écrire les statuts dans vos dépôts (repositories). Pour en savoir plus sur les jetons, cliquez [ici](https://blog.github.com/2013-05-16-personal-api-tokens/). Vous n’avez qu’à activer les permissions de base des dépôts. Utilisez ce jeton dans la variable d’environnement `GITHUB_TOKEN`.

Sauvegardez l’information sur l’environnement dans un fichier `.env.` Consultez `.env.example et` le [tableau ci-dessous](https://github.com/cds-snc/bundle-size-tracker/blob/master/README.md%23environment-variables) pour en savoir plus.

Installez toutes les dépendances requises à l’aide de votre gestionnaire de progiciel de nœuds préféré, puis exécutez simplement `serverless deploy`. Votre fonction infonuagique est maintenant déployée. L’URL de la fonction infonuagique sera renvoyée, et vous pourrez l’utiliser comme Webhook. Pour en savoir davantage sur les Webhooks de GitHub, cliquez [ici](https://help.github.com/articles/about-webhooks/).

Pour analyser les tailles de vos progiciels, vous devrez installer `size-plugin` comme décrit ci-dessous.


#### Plugiciel de taille Webpack

##### Installation

```
yarn add --dev cds-size-plugin
Configuration de WebPack
const path = require("path");
const SizePlugin = require("cds-size-plugin");
```

```
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
```
//razzle.config.js

module.exports = {
  modify: (config. Target, dev }, webpack) => {
    const SizePlugin = require("cds-size-plugin");
    config.plugins.push(
      new SizePlugin()
    );
    return config;
  }
};
```

##### next.js
```
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

Les variables requises sont définies dans `.env.example` avec les valeurs par défaut. Elles sont utilisées comme suit :

| Nom  | objet  | Écrasable par dépôt   |
|---|---|---|
|  BUILD_CMD | La commande que NPM exécute lorsqu’il essaie de constituer vos paquets. La valeur par défaut est supposée être `build`, mais elle peut être tout ce que vous voulez.  | OUI  |
|  CHARTING_URL | L’URL de votre fonction infonuagique de classement pour classer les données que vous avez recueillies. Non requis.  | NON  |
|  FIRESTORE_URL | L’URL de votre Firestore pour suivre vos données de taille de paquet. | NON  |
|  GITHUB_TOKEN |  Le jeton permettant à la fonction infonuagique d’envoyer des mises à jour de statut à vos demandes de tirage. |  NON |
|  SRC_PATH | e chemin d’accès à votre application par rapport à votre dépôt. Si votre application est à la racine, elle est vide. Si vous utilisez un dépôt monolithique, vous pourriez vouloir baisser d’un ou de plusieurs niveaux.  | OUI  |
|  TMP_PATH |  Le chemin d’accès au répertoire dans lequel votre dépôt est cloné par la fonction infonuagique. /tmp est la valeur raisonnable par défaut, mais n’hésitez pas à l’adapter au besoin. | NON  |

#### Comment fonctionne l’écrasement par dépôt?

Vous pouvez créer un fichier `.bundle-size-tracker-config` à la racine de votre dépôt. La fonction infonuagique respectera les variables d’environnement que vous allez y définir par rapport à celles qui ont été configurées pour elle-même. C’est utile si, par exemple, vous utilisez la même fonction infonuagique sur dix dépôts différents, mais que l’un d’eux n’utilise pas la commande de la version normale ou est un dépôt monolithique. Voici un exemple : https://github.com/cds-snc/bundle-size-tracker-demo-app/blob/master/.bundle-size-tracker-config


#### Flux d’information

Le flux d’information est simple :

1. Un dépôt reçoit une validation.
2. GitHub pousse la validation vers une fonction infonuagique.
3. La fonction infonuagique vérifie le dépôt Git au moment de la validation.
4. La fonction infonuagique vérifie si le dépôt contient le plugiciel Webpack requis.
5. La fonction infonuagique avise GitHub qu’elle vérifie la taille du paquet.
6. La fonction infonuagique cherche les renseignements historiques sur le dépôt et la branche dans une base de données.
7. La fonction infonuagique installe les progiciels dans le dépôt et exécute la version pour déterminer la taille du paquet.
8. La fonction infonuagique enregistre les nouveaux résultats dans la base de données.
9. La fonction infonuagique calcule le changement delta et l’affiche dans GitHub.

Le classement des données est également en cours – https://github.com/cds-snc/bundle-size-charter

### Mise en œuvre

À l’heure actuelle, la fonction infonuagique est déployée à l’aide des fonctions de Google Cloud parce qu’elles installeront les progiciels NPM et Yarn dans le cadre de leur déploiement. Les données sont actuellement stockées dans Firebase.

### Pourquoi ces restrictions?

- Webpack – Webpack est requis pour le plugiciel de la taille des paquets.
- Compatibilité avec Node 8 – C’est le moteur d’exécution sur les fonctions de Google Cloud
- NPM – Il s’agit du gestionnaire de progiciels qui est installé sur les fonctions de Google Cloud.

### Vous! Oui, vous!

Vous semblez intéressé par ce que nous faisons. Cliquez sur le lien suivant pour en savoir plus :
https://numerique.canada.ca/travaillez-avec-nous/

