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

### L'option `target`

Les méthodes, propriétés, et fonctions disponibles varient, dans les faits, en fonction de la _version_ de JavaScript que votre code exécute.
Par exemple, la méthode `startsWith` des chaînes de caractères est disponible à partir de la 6ème version de JavaScript (_EcmaScript 6_).

Il est important de connaître quelle version de JavaScript est exécutée, car vous ne voulez pas utiliser d'APIs disponibles sur des versions plus récentes.
C'est l'un des rôles de l'option de compilateur [`target`](/tsconfig#target).

TypeScript vous aide sur ce problème en faisant varier quels fichiers `lib` sont inclus par défaut, en se basant sur l'option [`target`](/tsconfig#target).
Par exemple, si [`target`](/tsconfig#target) vaut `ES5`, vous aurez une erreur en essayant d'utiliser la méthode `startsWith`, parce qu'elle n'existe qu'à partir de la version `ES6`.

### L'option `lib`

L'option [`lib`](/tsconfig#lib) permet un contrôle plus précis des fichiers standards de déclaration qui seront considérés présents dans votre programme.
Vous pouvez lire plus de détails dans la documentation de [`lib`](/tsconfig#lib).

## Définitions externes

Pour les APIs qui ne sont pas intégrées par défaut, il existe une variété de façons d'obtenir les informations de typage.
Ces façons dépendent de la librairie pour laquelle vous cherchez à obtenir ces types.

### Types inclus dans la librairie

Si une libraire que vous utilisez a été importée dans un package npm, il se pourrait qu'elle ait des déclarations de types intégrées.
Vous pouvez lire sa documentation pour en savoir plus, ou vous pouvez simplement importer la librairie et voir si TypeScript peut résoudre les types pour vous.

Si vous écrivez un package vous-même et que vous souhaitez inclure les définitions de types, vous pouvez lire notre guide sur [l'assemblage de définitions de types](/docs/handbook/declaration-files/publishing.html#including-declarations-in-your-npm-package).

### DefinitelyTyped / `@types`

The [répertoire DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped/) est un répertoire centralisé qui contient des fichiers de déclarations pour des milliers de librairies.
La vaste majorité de librairies communément utilisées ont des fichiers de déclarations disponibles sur DefinitelyTyped.

Les définitions de DefinitelyTyped sont automatiquement déployées dans npm sous le préfixe `@types`.
Le nom des packages de types sont toujours les mêmes que les packages qu'ils annotent.
Par exemple, si vous installez le package npm `react`, vous pouvez installer les types correspondants en écrivant :

```sh
npm install --save-dev @types/react
```

TypeScript trouve les définitions de types automatiquement sous `node_modules/@types`, il n'y a donc aucune étape supplémentaire nécessaire pour accéder aux types.

### Vos propres types

Si, dans de rares situations, les définitions de types n'existent ni chez DefinitelyTyped, ni dans la librairie elle-même, vous pouvez écrire vos propres fichiers de déclaration.
Consultez le guide [Écrire des fichiers de déclaration](/docs/handbook/declaration-files/introduction.html) pour plus d'informations.

Si vous voulez taire les avertissements concernant un module sans avoir à écrire de déclarations de types, vous pouvez déclarer son type comme étant `any` en créant un fichier de déclaration `.d.ts` vide dans votre projet.
Par exemple, si vous voulez utiliser `some-untyped-module` sans avoir de définitions pour, il suffit d'écrire :

```ts twoslash
declare module "some-untyped-module";
```
