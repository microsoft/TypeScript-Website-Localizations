---
title: Type Declarations
layout: docs
permalink: /fr/docs/handbook/2/type-declarations.html
oneline: "Comment TypeScript fournit du typage pour du code JavaScript."
---

Jusque-là, nous avons présenté des concepts basiques de TypeScript en utilisant des fonctionnalités présentes dans tous les moteurs JavaScript.
De nos jours, JavaScript contient beaucoup de librairies qui accomplissent des tâches communes.
Avoir du typage sur les parties d'application qui _ne font pas_ partie de votre code améliorera grandement votre expérience TypeScript.
Where do these types come from?

## À quoi ressemblent les déclarations de types ?

Supposons que vous avez ce code :

```ts twoslash
// @errors: 2339
const k = Math.max(5, 6);
const j = Math.mix(7, 8);
```

Comment TypeScript a-t-il su que `max` existe, mais pas `mix`, même sans que l'implémentation de `Math` fasse partie de votre code ?

Il existe des _fichiers de déclarations_ qui décrivent ces objets pré-existants.
Un fichier de déclarations fournit une manière de _déclarer_ l'existence de certains types ou certaines valeurs, sans leur fournir d'implémentation.

## Fichiers `.d.ts`

TypeScript a deux types principaux de fichiers.
Les fichiers `.ts` sont des fichiers d'_implémentation_, qui contiennent du code exécutable.
Ce sont les fichiers qui émettent des fichiers `.js` en sortie. C'est là que vous écrirez votre code.

Les fichiers `.d.ts` sont des fichiers de _déclarations_, qui ne contiennent _que_ des informations de types.
Ces fichiers n'émettent pas de sortie `.js`; ils servent uniquement à la vérification de types.
Nous apprendrons comment écrire nos propres fichiers de déclarations plus tard.

## Définitions de Types Pré-existantes

TypeScript possède des fichiers de déclarations pour toutes les APIs standard pré-existantes dans les moteurs JavaScript.
Ils contiennent, par exemple, les propriétés des types `string` ou `function`, les objets globaux comme `Math` et `Object`, ainsi que leurs types associés.
Par défaut, TypeScript contient également les types des éléments du navigateur, comme `window` et `document`; que l'on appelle collectivement les APIs de DOM (_DOM APIs_).

Ces fichiers suivent la convention de nommage `lib.[quelque chose].d.ts`.
Si vous ouvrez un fichier suivant ce nommage, vous saurez que c'est un élément pré-existant de la plateforme, qui ne contient pas de code.

### Option `target`

Les méthodes, propriétés, et fonctions disponibles varient, dans les faits, en fonction de la _version_ de JavaScript que votre code exécute.
Par exemple, la méthode `startsWith` des chaînes de caractères est disponible à partir de la 6ème version de JavaScript (_EcmaScript 6_).

Il est important de connaître quelle version de JavaScript est exécutée, car vous ne voulez pas utiliser d'APIs disponibles sur des versions plus récentes.
C'est l'un des rôles de l'option de compilateur [`target`](/tsconfig#target).

TypeScript helps with this problem by varying which `lib` files are included by default based on your [`target`](/tsconfig#target) setting.
For example, if [`target`](/tsconfig#target) is `ES5`, you will see an error if trying to use the `startsWith` method, because that method is only available in `ES6` or later.

### `lib` setting

The [`lib`](/tsconfig#lib) setting allows more fine-grained control of which built-in declaration files are considered available in your program.
See the documentation page on [`lib`](/tsconfig#lib) for more information.

## External Definitions

For non-built-in APIs, there are a variety of ways you can get declaration files.
How you do this depends on exactly which library you're getting types for.

### Bundled Types

If a library you're using is published as an npm package, it may include type declaration files as part of its distribution already.
You can read the project's documentation to find out, or simply try importing the package and see if TypeScript is able to automatically resolve the types for you.

If you're a package author considering bundling type definitions with your package, you can read our guide on [bundling type definitions](/docs/handbook/declaration-files/publishing.html#including-declarations-in-your-npm-package).

### DefinitelyTyped / `@types`

The [DefinitelyTyped repository](https://github.com/DefinitelyTyped/DefinitelyTyped/) is a centralized repo storing declaration files for thousands of libraries.
The vast majority of commonly-used libraries have declaration files available on DefinitelyTyped.

Definitions on DefinitelyTyped are also automatically published to npm under the `@types` scope.
The name of the types package is always the same as the name of the underlying package itself.
For example, if you installed the `react` npm package, you can install its corresponding types by running

```sh
npm install --save-dev @types/react
```

TypeScript automatically finds type definitions under `node_modules/@types`, so there's no other step needed to get these types available in your program.

### Your Own Definitions

In the uncommon event that a library didn't bundle its own types and didn't have a definition on DefinitelyTyped, you can write a declaration file yourself.
See the appendix [Writing Declaration Files](/docs/handbook/declaration-files/introduction.html) for a guide.

If you want to silence warnings about a particular module without writing a declaration file, you can also quick declare the module as type `any` by putting an empty declaration for it in a `.d.ts` file in your project.
For example, if you wanted to use a module named `some-untyped-module` without having definitions for it, you would write:

```ts twoslash
declare module "some-untyped-module";
```
