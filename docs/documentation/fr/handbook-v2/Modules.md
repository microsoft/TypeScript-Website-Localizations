---
title: Modules
layout: docs
permalink: /fr/docs/handbook/2/modules.html
oneline: "Comment le JavaScript gère la communication entre les fichiers."
---

Le JavaScript a une longue histoire et plusieurs manières différentes de gérer du code séparé en modules.
TypeScript, présent depuis 2012, a géré plusieurs de ces formats, mais avec le temps, la communauté et la spécification JavaScript ont convergé sur un format appelé les ES Modules (ou modules ES6). Vous l'aurez peut-être connue avec la syntaxe `import`/`export`.

Les ES Modules ont été ajoutés à la spécification JavaScript 2015, et ont été supportés dans la plupart des moteurs JavaScript en 2020.

Pour ne pas s'éparpiller, le manuel va couvrir les ES Modules et leur précurseur populaire, la syntaxe CommonJS de `module.exports =`. Vous pouvez également trouver des informations sur les autres styles de déclarations de modules dans la référence, sous la page [Modules](/docs/handbook/modules.html) (en anglais).

## Comment les modules JavaScript sont définis

Dans TypeScript, tout comme dans ECMAScript 2015, tout fichier contenant un `import` ou `export` est un module.

De même, tout fichier sans déclaration d'import ou d'export est considéré comme un script dont le contenu est disponible dans la portée globale (donc disponible pour les modules).

Les Modules possèdent leur propre portée dans laquelle ils sont exécutés, donc ils ne sont pas exécutés dans la portée globale.
Cela signifie que toute variable, fonction, classe, etc. déclarée dans un module n'est pas visible en dehors du module, sauf si explicitement exportés d'une façon ou d'une autre.
De même, pour utiliser une variable, fonction, classe, interface, etc. exportée d'un module différent, une forme d'import doit être utilisée.

## Ce qui n'est pas un Module

Il est important de comprendre ce que TypeScript considère comme un module.
La spécification JavaScript déclare que tout fichier JavaScript sans un `export` ni d'`await` à la portée la plus haute du fichier doit être considéré comme un script, pas comme un module.

Dans un fichier de script, les variables et types sont déclarés et accessibles dans la portée globale, et TypeScript suppose que vous utiliserez l'option de compilateur [`outFile`](/tsconfig#outFile) pour assembler plusieurs fichiers d'entrée dans un fichier de sortie, ou utiliser des balises `<script>` dans votre HTML pour charger ces fichiers (dans le bon ordre !).

Si vous avez des fichiers qui n'ont pas d'`import`, ni d'`export`, mais que vous souhaitez traiter comme des modules, ajoutez la ligne :

```ts twoslash
export {};
```

qui va convertir le fichier en un module qui n'exporte rien. Cette syntaxe fonctionne peu importe votre façon de gérer les imports et exports.

## Modules en TypeScript

<blockquote class='bg-reading'>
   <p>Lecture additionnelle :<br />
   <a href='https://exploringjs.com/impatient-js/ch_modules.html#overview-syntax-of-ecmascript-modules'>Impatient JS (en anglais)</a><br/>
   <a href='https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Modules'>MDN : Modules JavaScript</a><br/>
   </p>
</blockquote>

Il y a trois éléments principaux à considérer quand vous écrivez du code basé sur des Modules en TypeScript :

- **Syntaxe** : Quelle syntaxe voudrais-je utiliser pour importer et exporter mes modules ?
- **Résolution de Modules** : Quelle est la relation entre les noms (ou chemins) de modules et leurs fichiers sur le disque ?
- **Cible d'émission de Modules** : À quoi doit ressembler mon code JavaScript émis en sortie ?

### Syntaxe ES Module

Un fichier peut déclarer un export principal avec `export default` :

```ts twoslash
// @filename: hello.ts
export default function helloWorld() {
  console.log("Bonjour tout le monde !");
}
```

Qui est donc importé avec :

```ts twoslash
// @filename: hello.ts
export default function helloWorld() {
  console.log("Bonjour tout le monde !");
}
// @filename: index.ts
// ---cut---
import helloWorld from "./hello.js";
helloWorld();
```

En plus de l'export principal, vous pouvez avoir plus d'un export de variables et fonctions via le mot-clé `export` en omettant `default` :

```ts twoslash
// @filename: maths.ts
export var pi = 3.14;
export let squareTwo = 1.41;
export const phi = 1.61;

export class RandomNumberGenerator {}

export function absolute(num: number) {
  if (num < 0) return num * -1;
  return num;
}
```

Ces exports peuvent être utilisés avec la syntaxe `import` :

```ts twoslash
// @filename: maths.ts
export var pi = 3.14;
export let squareTwo = 1.41;
export const phi = 1.61;
export class RandomNumberGenerator {}
export function absolute(num: number) {
  if (num < 0) return num * -1;
  return num;
}
// @filename: app.ts
// ---cut---
import { pi, phi, absolute } from "./maths.js";

console.log(pi);
const absPhi = absolute(phi);
//    ^?
```

### Syntaxe d'import additionnelle

Un import peut être renommé en utilisant un format comme `import { old as new }`:

```ts twoslash
// @filename: maths.ts
export var pi = 3.14;
// @filename: app.ts
// ---cut---
import { pi as π } from "./maths.js";

console.log(π);
//          ^?
```

Vous pouvez combiner les deux façons d'importer dans un seul `import` :

```ts twoslash
// @filename: maths.ts
export const pi = 3.14;
export default class RandomNumberGenerator {}

// @filename: app.ts
import RandomNumberGenerator, { pi as π } from "./maths.js";

RandomNumberGenerator;
// ^?

console.log(π);
//          ^?
```

Vous pouvez assembler tous les éléments exportés dans un espace de noms avec `* as name`:

```ts twoslash
// @filename: maths.ts
export var pi = 3.14;
export let squareTwo = 1.41;
export const phi = 1.61;

export function absolute(num: number) {
  if (num < 0) return num * -1;
  return num;
}
// ---cut---
// @filename: app.ts
import * as math from "./maths.js";

console.log(math.pi);
const positivePhi = math.absolute(math.phi);
//    ^?
```

Vous pouvez importer un fichier et _ne pas_ inclure de variables dans votre module actuel avec `import "./file"`:

```ts twoslash
// @filename: maths.ts
export var pi = 3.14;
// ---cut---
// @filename: app.ts
import "./maths.js";

console.log("3.14");
```

Dans ce cas, l'`import` ne fait rien. Cela dit, tout le code de `maths.ts` est évalué, ce qui peut provoquer des effets de bord dans d'autres parties.

#### Syntaxe d'ES Modules propre à TypeScript

Les types peuvent être importés et exportés en utilisant la même syntaxe que JavaScript:

```ts twoslash
// @filename: animal.ts
export type Cat = { breed: string; yearOfBirth: number };

export interface Dog {
  breeds: string[];
  yearOfBirth: number;
}

// @filename: app.ts
import { Cat, Dog } from "./animal.js";
type Animals = Cat | Dog;
```

TypeScript a ajouté deux concepts à la syntaxe d'`import` pour importer un type :

###### `import type`

Une déclaration d'import qui ne peut importer _que_ des types :

```ts twoslash
// @filename: animal.ts
export type Cat = { breed: string; yearOfBirth: number };
export type Dog = { breeds: string[]; yearOfBirth: number };
export const createCatName = () => "bloom";

// @filename: valid.ts
import type { Cat, Dog } from "./animal.js";
export type Animals = Cat | Dog;

// @filename: app.ts
// @errors: 1361
import type { createCatName } from "./animal.js";
const name = createCatName();
```

###### Imports de `type` en une ligne

TypeScript 4.5 permet également de préfixer des déclarations d'imports en une ligne avec `type` pour indiquer que l'import en une ligne est un type :

```ts twoslash
// @filename: animal.ts
export type Cat = { breed: string; yearOfBirth: number };
export type Dog = { breeds: string[]; yearOfBirth: number };
export const createCatName = () => "bloom";
// ---cut---
// @filename: app.ts
import { createCatName, type Cat, type Dog } from "./animal.js";

export type Animals = Cat | Dog;
const name = createCatName();
```

Cela permet aux outils qui n'interagissent pas avec TypeScript, comme Babel, SWC ou esbuild de savoir quels imports peuvent être enlevés en toute sécurité.

#### Syntaxe ES Module au comportement CommonJS

TypeScript possède une syntaxe ES Module qui correspond _directement_ au `require` de CommonJS et AMD. Les imports qui utilisent la syntaxe ES Module sont _pour la plupart_ un équivalent de `require` dans ces environnements, mais cette syntaxe vous garantira que vous aurez une correspondance identique entre votre fichier TypeScript et le fichier de sortie de CommonJS :

```ts twoslash
/// <reference types="node" />
// @module: commonjs
// ---cut---
import fs = require("fs");
const code = fs.readFileSync("hello.ts", "utf8");
```

Vous pourrez en apprendre plus sur votre syntaxe dans la page de référence de [modules](/docs/handbook/modules.html#export--and-import--require) (en anglais).

## Syntaxe CommonJS

Le format CommonJS est le format dans lequel la plupart des modules npm sont fournis. Même si vous vous contentez d'écrire en ES Modules, une brève compréhension du mode de fonctionnement de CommonJS vous permettra de faciliter votre débogage.

#### Exports

Les identifiants sont exportés en définissant la propriété `exports` sur un objet global appelé `module`.

```ts twoslash
/// <reference types="node" />
// ---cut---
function absolute(num: number) {
  if (num < 0) return num * -1;
  return num;
}

module.exports = {
  pi: 3.14,
  squareTwo: 1.41,
  phi: 1.61,
  absolute,
};
```

Ces fichiers peuvent maintenant être importés avec `require` :

```ts twoslash
// @module: commonjs
// @filename: maths.ts
/// <reference types="node" />
function absolute(num: number) {
  if (num < 0) return num * -1;
  return num;
}

module.exports = {
  pi: 3.14,
  squareTwo: 1.41,
  phi: 1.61,
  absolute,
};
// @filename: index.ts
// ---cut---
const maths = require("maths");
maths.pi;
//    ^?
```

Vous pouvez simplifier en utilisant la déstructuration en JavaScript :

```ts twoslash
// @module: commonjs
// @filename: maths.ts
/// <reference types="node" />
function absolute(num: number) {
  if (num < 0) return num * -1;
  return num;
}

module.exports = {
  pi: 3.14,
  squareTwo: 1.41,
  phi: 1.61,
  absolute,
};
// @filename: index.ts
// ---cut---
const { squareTwo } = require("maths");
squareTwo;
// ^?
```

### Interopérabilité entre CommonJS et ES Modules

Il y a une certaine différence de fonctionnalités entre les modules CommonJS et ES Module, en terme d'usage de l'objet `module` ou de définition d'export par défaut. TypeScript possède une option de compilateur pour réduire les conflits entre les deux ensembles de contraintes et de règles avec [`esModuleInterop`](/tsconfig#esModuleInterop).

## Options de résolution de modules de TypeScript

La résolution de modules est le procédé de détermination du fichier à importer en fonction de la chaîne de caractères dans la déclaration d'`import` ou `require`.

TypeScript possède deux stratégies de résolution de modules : Classic et Node. Classic, l'option par défaut quand l'option [`module`](/tsconfig#module) n'est pas égale à `commonjs`, est incluse pour des raisons de rétro-compatibilité.
La stratégie Node réplique la façon de fonctionnement de Node.js avec CommonJS, avec des vérifications supplémentaires pour les fichiers `.ts` et `.d.ts`.

Beaucoup d'options de tsconfig influencent la stratégie de résolution de modules dans TypeScript : [`moduleResolution`](/tsconfig#moduleResolution), [`baseUrl`](/tsconfig#baseUrl), [`paths`](/tsconfig#paths), [`rootDirs`](/tsconfig#rootDirs).

Pour plus de détails sur la façon de fonctionner de ces stratégies, vous pouvez consulter la section de référence sur la [Résolution de Modules](/docs/handbook/module-resolution.html) (en anglais).

## Options d'émission de modules en TypeScript

Deux options affectent le code JavaScript émis :

- [`target`](/tsconfig#target) détermine quelles fonctionnalités JS sont nivelées vers le bas (converties pour être exécutées dans des moteurs plus anciens) et lesquelles doivent rester intactes
- [`module`](/tsconfig#module) détermine quelle stratégie est utilisée pour les interactions entre modules

Les fonctionnalités disponibles dans votre moteur JavaScript détermineront la valeur de l'option [`target`](/tsconfig#target) où votre code se lancera. Cela pourrait être : le navigateur le plus ancien que vous supportez, la version-cible la plus basse de Node.js, ou des contraintes uniques de votre environnement - comme avec Electron par exemple.

Tout module doit passer par un chargeur de modules avant d'être utilisé, et l'option [`module`](/tsconfig#module) détermine quel chargeur vous utiliserez.
À l'exécution, le chargeur de modules s'occupe de localiser et exécuter toutes les dépendances d'un module avant de l'exécuter.

Par exemple, voici un fichier TypeScript qui utilise la syntaxe d'ES Modules, démontrant différentes options pour [`module`](/tsconfig#module) :

```ts twoslash
// @filename: constants.ts
export const valueOfPi = 3.142;
// @filename: index.ts
// ---cut---
import { valueOfPi } from "./constants.js";

export const twoPi = valueOfPi * 2;
```

#### `ES2020`

```ts twoslash
// @showEmit
// @module: es2020
// @noErrors
import { valueOfPi } from "./constants.js";

export const twoPi = valueOfPi * 2;
```

#### `CommonJS`

```ts twoslash
// @showEmit
// @module: commonjs
// @noErrors
import { valueOfPi } from "./constants.js";

export const twoPi = valueOfPi * 2;
```

#### `UMD`

```ts twoslash
// @showEmit
// @module: umd
// @noErrors
import { valueOfPi } from "./constants.js";

export const twoPi = valueOfPi * 2;
```

> Remarque, ES2020 est effectivement le même que `index.ts`.

Vous pourrez voir toutes les options disponibles et à quoi ressemble le code JavaScript en sortie dans la référence de l'option [`module`](/tsconfig#module).

## Espaces de noms TypeScript

TypeScript possède son propre format de modules, les `namespaces`, qui datent d'avant les ES Modules. Cette syntaxe a beaucoup de fonctionnalités pratiques pour créer des fichiers de définitions complexes, et est utilisée activement [chez DefinitelyTyped](/dt). Les espaces de noms ne sont pas dépréciés, mais la majorité de fonctionnalités dans les espaces de noms existent dans les ES Modules et nous la recommandons pour vous aligner sur JavaScript. Vous pouvez en savoir plus sur les espaces de noms dans la page [de référence](/docs/handbook/namespaces.html).
