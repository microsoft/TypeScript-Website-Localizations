---
title: TypeScript pour les développeurs JavaScript
short: TypeScript pour les développeurs JS
layout: docs
permalink: /fr/docs/handbook/typescript-in-5-minutes.html
oneline: Apprenez comment TypeScript étend JavaScript
---

TypeScript a une relation inhabituelle avec JavaScript. TypeScript offre toutes les fonctionnalités de JavaScript, avec une couche supplémentaire de fonctionnalités : le système de types.

JavaScript fournit des primitives, comme `string` et `number`, mais aucune vérification n'est faite pour s'assurer que les assignations que vous faites sont correctes. TypeScript le fait.

Cela signifie que votre code JavaScript existant est également du code TypeScript. L'avantage principal de TypeScript est sa capacité à exposer les comportements imprévus dans votre code, diminuant la chance de trouver des bugs.

Ce tutoriel fournira une vue d'ensemble de TypeScript, et va se concentrer sur son système de types.

## Types par Inférence

TypeScript connaît le JavaScript et générera les types pour vous la plupart du temps.
Par exemple, en créant une variable et en lui assignant une certaine valeur, TypeScript va utiliser cette valeur en tant que type.

```ts twoslash
let helloWorld = "Hello World";
//  ^?
```

En comprenant comment JavaScript fonctionne, TypeScript peut créer un système qui accepte du code JavaScript, avec des types. Le résultat est un système de types qui n'a pas besoin de déclarations explicites de types dans votre code. C'est comme ça que TypeScript sait que `helloWorld` est un `string` dans l'exemple précédent (TypeScript a _inféré_ le type `string` de `helloWorld`).

Il se peut que vous ayez écrit du JavaScript dans Visual Studio Code, et ayez obtenu de l'autocomplétion de la part de l'éditeur. Visual Studio Code utilise TypeScript dans le capot pour faciliter le travail avec JavaScript.

## Définir des Types

Vous pouvez utiliser une variété de design patterns en JavaScript. Cependant, certains patterns rendent difficile l'inférence automatique de types (par exemple, les patterns qui utilisent la programmation dynamique). Pour couvrir ces cas d'usage, TypeScript supporte une extension de JavaScript qui vous offre la possibilité de définir vos types.

Par exemple, il est possible de créer un objet qui contient un `name: string` et un `id: number` en écrivant:

```ts twoslash
const user = {
  name: "Hayes",
  id: 0,
};
```

Vous pouvez explicitement décrire la forme de cet objet en utilisant une déclaration d'`interface`:

```ts twoslash
interface User {
  name: string;
  id: number;
}
```

Vous pourrez déclarer que votre objet JavaScript respecte cette nouvelle `interface` en utilisant une syntaxe comme `: TypeName` après une déclaration de variable :

```ts twoslash
interface User {
  name: string;
  id: number;
}
// ---cut---
const user: User = {
  name: "Hayes",
  id: 0,
};
```

TypeScript va vous prévenir si vous fournissez un objet qui ne correspond pas à votre interface :

```ts twoslash
// @errors: 2322
interface User {
  name: string;
  id: number;
}

const user: User = {
  username: "Hayes",
  id: 0,
};
```

JavaScript (par conséquent, TypeScript) supporte les classes et la programmation orientée objet. Vous pouvez utiliser une déclaration d'interface avec une classe :

```ts twoslash
interface User {
  name: string;
  id: number;
}

class UserAccount {
  name: string;
  id: number;

  constructor(name: string, id: number) {
    this.name = name;
    this.id = id;
  }
}

const user: User = new UserAccount("Murphy", 1);
```

Vous pouvez utiliser les interfaces pour annoter les types de paramètres et valeurs de retour de fonctions :

```ts twoslash
// @noErrors
interface User {
  name: string;
  id: number;
}
// ---cut---
function getAdminUser(): User {
  //...
}

function deleteUser(user: User) {
  // ...
}
```

JavaScript fournit déjà un petit ensemble de types primitifs, dont vous pouvez vous servir dans une interface : `boolean`, `bigint`, `null`, `number`, `string`, `symbol`, et `undefined`. TypeScript étend cette liste en y ajoutant `any` (tout permettre), [`unknown`](/play#example/unknown-and-never) (s'assurer que quiconque se sert de ce type déclare le type voulu), [`never`](/play#example/unknown-and-never) (il est impossible d'avoir ce type), et `void` (une fonction qui retourne `undefined` ou ne retourne rien).

Vous verrez deux syntaxes pour créer des types : [les Interfaces et les Types](/play/?e=83#example/types-vs-interfaces). Préférez une `interface`, mais utilisez un `type` si vous avez besoin d'une fonctionnalité particulière.

## Composition de Types

Avec TypeScript, il est possible de combiner plusieurs types simples en un type complexe. Deux manières populaires existent : les unions, et les types génériques.

### Unions

Une union vous permet de déclarer qu'un type pourrait en être un parmi certains. Par exemple, une façon de décrire le type `boolean` serait de dire qu'il est soit `true`, soit `false`:

```ts twoslash
type MyBool = true | false;
```

_Note:_ Si vous survolez `MyBool`, vous verrez que le type est classé en tant que `boolean`. C'est une caractéristique du Système Structurel de Types (plus de détails ci-dessous).

Un usage populaire des types union est de décrire les ensembles de `string` ou `number` acceptables en tant que valeurs :

```ts twoslash
type WindowStates = "open" | "closed" | "minimized";
type LockStates = "locked" | "unlocked";
type PositiveOddNumbersUnderTen = 1 | 3 | 5 | 7 | 9;
```

Les unions fournissent également une manière de gérer les types hétérogènes. Par exemple, vous pouvez avoir une fonction qui accepte un `array` ou un `string` :

```ts twoslash
function getLength(obj: string | string[]) {
  return obj.length;
}
```

Pour connaître le type d'une variable, utilisez `typeof` :

| Type      | Condition                          |
| --------- | ---------------------------------- |
| string    | `typeof s === "string"`            |
| number    | `typeof n === "number"`            |
| boolean   | `typeof b === "boolean"`           |
| undefined | `typeof undefined === "undefined"` |
| function  | `typeof f === "function"`          |
| array     | `Array.isArray(a)`                 |

Vous pouvez faire en sorte qu'une fonction retourne des valeurs différentes en fonction du type de l'argument passé :

<!-- prettier-ignore -->
```ts twoslash
function wrapInArray(obj: string | string[]) {
  if (typeof obj === "string") {
    return [obj];
//          ^?
  }
  return obj;
}
```

### Types Génériques

Les types génériques fournissent des variables aux types. Les tableaux (arrays) seraient un exemple commun. Un tableau sans type générique pourrait tout contenir, alors qu'un tableau avec un type générique restreint son contenu à ce type générique.

```ts
type StringArray = Array<string>;
type NumberArray = Array<number>;
type ObjectWithNameArray = Array<{ name: string }>;
```

Vous pouvez utiliser les types génériques avec vos propres types :

```ts twoslash
// @errors: 2345
interface Backpack<Type> {
  add: (obj: Type) => void;
  get: () => Type;
}

// Cette ligne est un raccourci pour informer TS de l'existence d'une
// d'une constante appelée `backpack`, sans s'inquiéter d'où elle viendrait.
declare const backpack: Backpack<string>;

// object est un string, vu que nous avons déclaré un string
// en tant que variable à `backpack`.
const object = backpack.get();

// Vu que backpack est un string, vous ne pouvez pas donner de nombre
// à la fonction add.
backpack.add(23);
```

## Système Structurel de Types

L'un des principes au cœur de TypeScript est que la vérification des types se concentre sur la _forme_ de la valeur. Ce principe est parfois appelé "typage structurel".

Dans un système structurel, si deux objets ont la même forme (la même structure, d'où le nom), ils sont considérés comme étant du même type.

```ts twoslash
interface Point {
  x: number;
  y: number;
}

function logPoint(p: Point) {
  console.log(`${p.x}, ${p.y}`);
}

// affiche "12, 26"
const point = { x: 12, y: 26 };
logPoint(point);
```

La variable `point` n'a jamais été déclarée en tant que `Point`. Mais TypeScript compare la forme de `point` la variable à la forme de `Point` l'interface. Les deux ont la même forme, donc l'appel est validé.

La correspondance entre formes requiert uniquement la correspondance d'un sous-ensemble des propriétés d'un objet.

```ts twoslash
// @errors: 2345
interface Point {
  x: number;
  y: number;
}

function logPoint(p: Point) {
  console.log(`${p.x}, ${p.y}`);
}
// ---cut---
const point3 = { x: 12, y: 26, z: 89 };
logPoint(point3); // affiche "12, 26"

const rect = { x: 33, y: 3, width: 30, height: 80 };
logPoint(rect); // affiche "33, 3"

const color = { hex: "#187ABF" };
logPoint(color);
```

Il n'y a aucune différence entre la façon dont les classes et les objets se conforment aux formes :

```ts twoslash
// @errors: 2345
interface Point {
  x: number;
  y: number;
}

function logPoint(p: Point) {
  console.log(`${p.x}, ${p.y}`);
}
// ---cut---
class VirtualPoint {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

const newVPoint = new VirtualPoint(13, 56);
logPoint(newVPoint); // affiche "13, 56"
```

Si un objet ou une classe possède toutes les propriétés requises, TypeScript dira que la variable correspond, peu importe les détails d'implémentation.

## Prochaines étapes

C'était un bref résumé de la syntaxe et des outils régulièrement utilisés en TypeScript. À partir de là, vous pourrez :

- Lire le Manuel [du début à la fin](/docs/handbook/intro.html) (30m)
- Explorer les [exemples du bac à sable](/play#show-examples)
