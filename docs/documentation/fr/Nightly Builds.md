---
title: Nightly Builds
layout: docs
permalink: /fr/docs/handbook/nightly-builds.html
oneline: Comment utiliser une nightly build de TypeScript
translatable: true
---

Une nightly build de la branche [Typescript `main`](https://github.com/Microsoft/TypeScript/tree/main) est publiée avant minuit PST sur npm.
Voici comment vous pouvez l'obtenir et l'utiliser avec vos outils.

## En utilisant npm

```shell
npm install -g typescript@next
```

## Mettre à jour votre IDE pour utiliser les nightly builds

Vous pouvez également mettre à jour votre IDE pour utiliser la nightly build.
Vous devrez d'abord installer le package via npm.
Vous pouvez soit installer le package npm globalement, soit dans un dossier local `node_modules`.

Le reste de cette section suppose que `typescript@next` est déjà installé.

### Visual Studio Code

Mettez à jour `.vscode/settings.json` avec les éléments suivants :

```json
"typescript.tsdk": "<chemin vers votre dossier>/node_modules/typescript/lib"
```

Plus d'informations sont disponibles sur la [documentation VSCode](https://code.visualstudio.com/Docs/languages/typescript#_using-newer-typescript-versions).


### Sublime Text

Mettez à jour le fichier `Paramètres - Utilisateur` avec les éléments suivants :

```json
"typescript_tsdk": "<chemin vers votre dossier>/node_modules/typescript/lib"
```

Plus d'informations sont disponibles dans la [documentation d'installation du plug-in TypeScript pour Sublime Text](https://github.com/Microsoft/TypeScript-Sublime-Plugin#installation).

### Visual Studio 2013 et 2015

> Remarque : La plupart des modifications ne nécessitent pas l'installation d'une nouvelle version du plug-in VS TypeScript.

La nightly build n'inclut actuellement pas la configuration complète du plug-in, mais nous travaillons également à la publication d'un programme d'installation nigthly.

1. Téléchargez le script [VSDevMode.ps1](https://github.com/Microsoft/TypeScript/blob/main/scripts/VSDevMode.ps1).

   > Voir également notre page wiki sur [l'utilisation d'un fichier de service de langue personnalisé](https://github.com/Microsoft/TypeScript/wiki/Dev-Mode-in-Visual-Studio#using-a-custom-language-service-file).

2. À partir d'une fenêtre de commande PowerShell, exécutez :

Pour VS 2015:
```posh
VSDevMode.ps1 14 -tsScript <chemin vers votre dossier>/node_modules/typescript/lib
```

Pour VS 2013:

```posh
VSDevMode.ps1 12 -tsScript <chemin vers votre dossier>/node_modules/typescript/lib
```

### IntelliJ IDEA (Mac)

Allez dans `Préférences` > `Langues & Frameworks` > `TypeScript` :

> Version TypeScript : Si vous avez installé avec npm : `/usr/local/lib/node_modules/typescript/lib`

### IntelliJ IDEA (Windows)

Allez dans `Fichier` > `Paramètres` > `Langues & Frameworks` > `TypeScript` :

> Version TypeScript : Si vous avez installé avec npm : `C:\Users\USERNAME\AppData\Roaming\npm\node_modules\typescript\lib`
