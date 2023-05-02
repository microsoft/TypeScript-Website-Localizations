---
title: Everyday Types
layout: docs
permalink: /fr/docs/handbook/2/everyday-types.html
oneline: "Les primitives du langage."
---

Dans ce chapitre, nous couvrirons certains types fréquents des valeurs communes dans du code JavaScript, et nous expliquerons les façons de représenter ces types en TypeScript.
Ce n'est pas une liste exhaustive, et les futurs chapitres couvriront plus de manières de nommer et utiliser d'autres types.

Les types peuvent également apparaître d'autres endroits que des annotations.
À mesure que vous apprenez à connaître les types, vous connaîtrez également les façons et endroits où l'on peut référer aux types pour former de nouvelles entités.

D'abord, passons en revue les types les plus basiques et communs, que vous rencontrerez probablement quand vous écrirez du code JavaScript ou TypeScript.
Ces types formeront les blocs essentiels de types plus complexes.

## Les primitives: `string`, `number`, et `boolean`

Le JavaScript possède trois [primitives](https://developer.mozilla.org/fr/docs/Glossary/Primitive) très communes : `string`, `number`, et `boolean`.
Chacune d'entre elles a un type correspondant en TypeScript.
Comme vous vous y attendrez, ce sont les mêmes noms que vous verrez si vous utilisez l'opérateur `typeof` sur les valeurs de ces types :

- `string` représente des chaînes de caractères comme `"bonjour tout le monde"`
- `number` correspond aux nombres comme `42`. En JavaScript, tout est un `number` - il n'existe aucun équivalent à un `int` ou `float`. Tout est simplement un `number`
- `boolean` représente les deux valeurs `true` et `false`

> Les noms de types `String`, `Number`, et `Boolean` (avec une première lettre majuscule) existent, mais réfèrent à des types spéciaux qui vont très rarement apparaître dans votre code. Utilisez _toujours_ `string`, `number`, ou `boolean` pour annoter vos types.

## Tableaux

Pour préciser le type d'un tableau comme `[1, 2, 3]`, vous pouvez utiliser la syntaxe `number[]`; cette syntaxe peut être utilisée pour d'autres types (par exemple, `string[]` est un tableau de chaînes de caractères, et ainsi de suite).
Vous pourriez aussi voir la notation `Array<number>`, qui signifie la même chose.
Nous en apprendrons plus sur la notation `T<U>` quand on couvrira les _types génériques_.

> À noter que la notation `[number]` est différente; référez-vous à la section sur les [Tuples](/fr/docs/handbook/2/objects.html#tuple-types).


## `any`

TypeScript possède également un type spécial, `any`, que vous pouvez utiliser dès que vous souhaitez qu'une valeur particulière ne cause pas d'erreurs à la vérification de types.

Quand une valeur est de type `any`, vous pouvez accéder à toutes ses propriétés (qui seront, à leur tour, de type `any`), l'appeler comme une fonction, l'assigner à (ou depuis) une valeur de tous types, ainsi que tout ce qui pourrait être légal :

```ts twoslash
let obj: any = { x: 0 };
// Aucune de ces lignes ne va émettre d'erreur.
// Utiliser `any` désactive toute vérification de types, et TypeScript supposera
// que vous connaissez l'environnement mieux que lui.
obj.foo();
obj();
obj.bar = 100;
obj = "hello";
const n: number = obj;
```

Le type `any` est utile quand vous ne voulez pas écrire une très grande ligne de typage rien que pour convaincre TypeScript qu'une certaine ligne de code est valide.

### `noImplicitAny`

Si vous ne précisez pas de type, et TypeScript ne peut pas l'inférer du contexte, le compilateur va adopter le type `any`.

Vous voudrez peut-être l'éviter, cependant, parce qu'il n'y a aucune vérification de types sur `any`.
Utilisez l'option [`noImplicitAny`](/tsconfig#noImplicitAny) pour relever toutes ces situations en tant qu'erreurs.

## Annotations de Types sur des Variables

Quand vous déclarez une variable avec `const`, `var`, ou `let`, vous pouvez optionnellement ajouter une annotation de type pour préciser explicitement le type de la variable :

```ts twoslash
let myName: string = "Alice";
//        ^^^^^^^^ Annotation de type
```

> TypeScript n'utilise pas de déclarations du style "types vers la gauche", comme `int x = 0;`
> Les annotations de types iront toujours _après_ la variable qui est typée.

Par contre, la plupart des cas, cela n'est pas nécessaire.
Dès que possible, TypeScript essaiera d'_inférer_ automatiquement les types de votre code.
Par exemple, le type d'une variable est inféré en fonction du type de son initialiseur :

```ts twoslash
// Pas d'annotation nécessaire -- inférer 'myName' montre que la variable est de type 'string'
let myName = "Alice";
```

La plupart du temps, vous n'aurez pas besoin d'apprendre les règles d'inférence.
Si vous débutez avec TypeScript, essayez d'utiliser moins d'annotations que vous pensez nécessaire - vous verrez que TypeScript saura comprendre vos intentions bien plus souvent que vous ne le pensez.

## Fonctions

Les fonctions sont les moyens principaux de transfert de données en JavaScript.
TypeScript vous permet d'annoter précisément les types de données en entrée et en sortie de ces fonctions.

### Annotations de Types de Paramètres

Quand vous déclarez une fonction, vous pouvez ajouter des annotations de types après chaque paramètre pour déclarer quel(s) type(s) la fonction accepte.
Les annotations de types de paramètres iront après le nom des paramètres :

```ts twoslash
// Annotation de type de paramètre
function greet(name: string) {
  //                 ^^^^^^^^
  console.log("Bonjour, " + name.toUpperCase() + " !!");
}
```

Dès qu'un paramètre est annoté, les arguments de cette fonction seront vérifiés :

```ts twoslash
// @errors: 2345
declare function greet(name: string): void;
// ---cut---
// Ceci provoquera une erreur à l'exécution
greet(42);
```

> Même si vous n'avez pas d'annotation sur vos paramètres, TypeScript vérifiera également que vous passez le nombre correct d'arguments lors de l'appel de la fonction.

### Annotations de Type de Retour

Vous pouvez également ajouter des annotations de types de retour.
Ces annotations apparaissent après les listes de paramètres :

```ts twoslash
function getFavoriteNumber(): number {
  //                        ^^^^^^^^
  return 26;
}
```

Tout comme les annotations de variables, vous n'avez généralement pas besoin d'en préciser tout le temps, parce que TypeScript inférera les types de retour d'une fonction en se basant sur les valeurs retournées.
Dans l'exemple ci-dessus, le `: number` ne changera rien.
Certaines bases de code précisent explicitement le type de retour à des fins de documentation, pour éviter les changements accidentels, ou simplement par préférence personnelle.

### Fonctions anonymes

Les fonctions anonymes sont légèrement différentes des déclarations de fonctions.
Quand une fonction apparaît à un endroit où TypeScript peut déterminer comment elle sera appelée, les paramètres de cette fonction sont automatiquement typés.

Voici un exemple :

```ts twoslash
// @errors: 2551
// Pas d'annotations, mais TypeScript sera capable de repérer les bugs
const names = ["Alice", "Bob", "Eve"];

// Typage contextuel pour des fonctions
names.forEach(function (s) {
  console.log(s.toUppercase());
});

// Le typage contextuel peut aussi s'appliquer aux fonctions fléchées
names.forEach((s) => {
  console.log(s.toUppercase());
});
```

Même si `s` n'a pas d'annotation de type, TypeScript a utilisé le type de la fonction `forEach`, ainsi que le type inféré du tableau (qui est, donc, `string[]`), pour déterminer le type de `s`.

Ce procédé s'appelle _typage contextuel_ car le _contexte_ de cette fonction a permis de préciser quel type le paramètre doit avoir.

De la même façon que les règles de l'inférence, vous n'avez pas besoin d'apprendre _exactement_ comment ça se passe, mais comprendre que cela _peut_ se produire peut vous aider à remarquer les endroits où une annotation n'est pas nécessaire.
Nous verrons plus tard des exemples où le contexte d'une variable peut lui changer son type.

## Types Objets

À part les primitives, le type le plus commun que vous rencontrerez est le _type objet_.
Il fait référence à toute valeur JavaScript qui peut avoir une propriété, c'est-à-dire _quasiment toutes_ !
Pour définir un type objet, il suffit de lister ses propriétés et leurs types.

Par exemple, voici une fonction qui prend en paramètre un objet qui ressemble à un point à coordonnées :

```ts twoslash
// L'annotation de type du paramètre est un objet
function printCoord(pt: { x: number; y: number }) {
  //                      ^^^^^^^^^^^^^^^^^^^^^^^^
  console.log("La valeur x de la coordonnée est " + pt.x);
  console.log("La valeur y de la coordonnée est " + pt.y);
}
printCoord({ x: 3, y: 7 });
```

Ici, nous avons annoté un paramètre avec un type à deux propriétés - `x` et `y` - qui sont toutes les deux de type `number`.
Vous pouvez utiliser `,` ou `;` pour séparer les propriétés, le dernier séparateur étant optionnel.

Il n'est également pas nécessaire de préciser le type d'une propriété.
Dans ce cas, TypeScript supposera que la propriété en question est de type `any`.

### Propriétés facultatives

Les types objet peuvent aussi préciser que certaines ou toutes leurs propriétés sont _facultatives_.
Pour ce faire, vous devrez ajouter un `?` après le nom de propriété :

```ts twoslash
function printName(obj: { first: string; last?: string }) {
  // ...
}
// Les deux sont OK
printName({ first: "Bob" });
printName({ first: "Alice", last: "Alisson" });
```

En JavaScript, accéder à une propriété qui n'existe pas retourne `undefined` au lieu d'une erreur.
De ce fait, quand vous _lisez_ une propriété facultative, vous devrez vérifier qu'elle n'est pas `undefined` avant de continuer :

```ts twoslash
// @errors: 2532
function printName(obj: { first: string; last?: string }) {
  // Erreur - peut provoquer un crash si `obj.last` est undefined !
  console.log(obj.last.toUpperCase());
  if (obj.last !== undefined) {
    // OK
    console.log(obj.last.toUpperCase());
  }

  // Une alternative plus sûre avec du JavaScript moderne :
  console.log(obj.last?.toUpperCase());
}
```

## Types Union

Le système de types de TypeScript permet de créer de nouveaux types en partant de types existants, à travers une grande variété opérateurs.
Maintenant qu'on sait écrire des types, il est l'heure de les _combiner_ de façons qui vont être intéressantes.

### Définir un Type Union

La première façon de combiner des types est de créer un type _union_.
Un type union est un type formé de deux ou plusieurs types, représentant des valeurs qui pourraient faire partie de _n'importe lequel_ de ces types.
Chacun des types de l'union est un _membre de cette union_.

Écrivons une fonction qui peut agir sur un `number` ou sur un `string` :

```ts twoslash
// @errors: 2345
function printId(id: number | string) {
  console.log("Votre ID est : " + id);
}
// OK
printId(101);
// OK
printId("202");
// Erreur
printId({ myID: 22342 });
```

### Utiliser les Types Union

Il est facile de _fournir_ une valeur qui correspond à un type union - vous pouvez simplement fournir une valeur qui a un type membre de ce type union.
Mais si vous _avez_ une valeur dont le type est un type union, que faire ?

TypeScript va permettre une opération _uniquement_ si elle est valide pour _tous_ les membres de l'union.
Par exemple, si vous avez le type `string | number`, vous ne pouvez pas utiliser les méthodes qui sont disponibles uniquement dans le type `string`:

```ts twoslash
// @errors: 2339
function printId(id: number | string) {
  console.log(id.toUpperCase());
}
```

La solution est de _rétrécir_ l'union avec du code, de la même façon qu'avec du code JavaScript sans annotation de types.
Le _rétrécissement_ se produit quand TypeScript peut déduire un type plus spécifique pour une certaine valeur, en se basant sur la structure du code.

Par exemple, TypeScript sait que si `typeof` une valeur renvoie `string`, cette valeur peut uniquement être un `string` :

```ts twoslash
function printId(id: number | string) {
  if (typeof id === "string") {
    // Dans cette branche, id est un string
    console.log(id.toUpperCase());
  } else {
    // Ici, id est un nombre
    console.log(id);
  }
}
```

Un autre exemple qui implique d'utiliser `Array.isArray` :

```ts twoslash
function welcomePeople(x: string[] | string) {
  if (Array.isArray(x)) {
    // Ici, 'x' est un 'string[]'
    console.log("Bonjour, " + x.join(" et "));
  } else {
    // Ici, 'x' est un 'string'
    console.log("Bienvenue, voyageur solitaire " + x);
  }
}
```

Remarquez que dans la branche `else`, nous n'avons pas eu à faire quoi que ce soit - si `x` n'est pas un `string[]`, alors il doit être un `string`.

Parfois, vous aurez des unions où les types membres ont des éléments en commun.
Par exemple, les tableaux et les `string` possèdent la méthode `slice`.
Si chaque membre de l'union a cette propriété, vous pourrez vous en servir sans faire de rétrécissement :

```ts twoslash
// Le type de retour est number[] | string
function getFirstThree(x: number[] | string) {
  return x.slice(0, 3);
}
```

> L'_union_ de types paraît posséder l'_intersection_ des propriétés de ces types, ce qui peut paraître perturbant.
> C'est voulu : le nom _union_ vient de la théorie des ensembles.
> L'_union_ `number | string` est créée en obtenant l'union _des valeurs_ de chaque type.
> Remarquez que pour deux ensembles avec des éléments qui décrivent chaque ensemble, seule l'_intersection_ de ces éléments s'applique à l'_union_ de ces ensembles.
> Par exemple, si on a une salle remplie de grandes personnes avec un chapeau, avec des personnes parlant l'espagnol et portant un chapeau, la seule description commune qui s'applique à l'_union_ de ces personnes (à toutes ces personnes) est le fait qu'elles portent toutes un chapeau.

## Alias de Types

Jusque-là, vous avez utilisé les types objet et types union en les écrivant directement dans les annotations de types.
C'est convenable, mais vous voudrez souvent utiliser le même type plus d'une fois, et y référer avec un seul nom.

Un _alias de type_ est exactement cela - un _nom_ pour un _type_.
Voici la syntaxe d'un alias de type :

```ts twoslash
type Point = {
  x: number;
  y: number;
};

// Identique à l'exemple précédent
function printCoord(pt: Point) {
  console.log("La valeur de la coordonnée x est " + pt.x);
  console.log("La valeur de la coordonnée y est " + pt.y);
}

printCoord({ x: 100, y: 100 });
```

Vous pouvez même utiliser les alias de types pour nommer toutes sortes de types, pas juste des types objet.
Par exemple, un alias de type peut nommer un type union :

```ts twoslash
type ID = number | string;
```

Remarquez que les alias sont _uniquement_ des alias - vous ne pouvez pas utiliser d'alias pour créer des variantes / versions différentes d'un type déjà existant.
En utilisant le type alias, c'est comme si vous aviez écrit le type remplacé par l'alias.
En d'autres termes, ce code peut _paraître_ illégal, mais TypeScript l'accepte parce que les deux types sont, en réalité, deux alias pour le même type :

```ts twoslash
declare function getInput(): string;
declare function sanitize(str: string): string;
// ---cut---
type UserInputSanitizedString = string;

function sanitizeInput(str: string): UserInputSanitizedString {
  return sanitize(str);
}

// Aseptiser l'entrée reçue
let userInput = sanitizeInput(getInput());

// Peut toujours recevoir un string
userInput = "new input";
```

## Interfaces

Une _déclaration d'interface_ est une autre façon de nommer un type objet :

```ts twoslash
interface Point {
  x: number;
  y: number;
}

function printCoord(pt: Point) {
  console.log("La valeur de la coordonnée x est " + pt.x);
  console.log("La valeur de la coordonnée y est " + pt.y);
}

printCoord({ x: 100, y: 100 });
```

Tout comme les alias de types ci-dessus, l'exemple des interfaces fonctionne de la même façon qu'avec une annotation anonyme de propriétés.
TypeScript vérifie uniquement la _structure_ de la valeur transmise à `printCoord` - l'appel est valide du moment que l'objet possède les propriétés requises.
Le fait de n'être concerné que par la _structure_ et capacités des types permet de dire que TypeScript est un système _typé structurellement_.

### Différence entre les alias de types et interfaces

Les alias de types et interfaces sont très similaires, et interchangeables la plupart des cas.
La quasi-totalité des fonctionnalités d'une `interface` sont disponibles dans les `type`. La différence principale est le fait qu'un type ne peut pas être modifié pour y ajouter des propriétés, tandis qu'une interface est toujours extensible.

<table class='full-width-table'>
  <tbody>
    <tr>
      <th><code>Interface</code></th>
      <th><code>Type</code></th>
    </tr>
    <tr>
      <td>
        <p>Étendre une interface</p>
        <code><pre>
interface Animal {
  name: string
}<br/>
interface Bear extends Animal {
  honey: boolean
}<br/>
const bear = getBear() 
bear.name
bear.honey
        </pre></code>
      </td>
      <td>
        <p>Étendre un type avec des intersections</p>
        <code><pre>
type Animal = {
  name: string
}<br/>
type Bear = Animal & { 
  honey: boolean 
}<br/>
const bear = getBear();
bear.name;
bear.honey;
        </pre></code>
      </td>
    </tr>
    <tr>
      <td>
        <p>Ajouter de nouvelles propriétés dans une interface existante</p>
        <code><pre>
interface Window {
  title: string
}<br/>
interface Window {
  ts: TypeScriptAPI
}<br/>
const src = 'const a = "bonjour tout le monde"';
window.ts.transpileModule(src, {});
        </pre></code>
      </td>
      <td>
        <p>Un type ne peut plus être changé une fois créé</p>
        <code><pre>
type Window = {
  title: string
}<br/>
type Window = {
  ts: TypeScriptAPI
}<br/>
<span style="color: #A31515"> // Erreur : identificateur en double 'Window'.</span><br/>
        </pre></code>
      </td>
    </tr>
    </tbody>
</table>

Vous en apprendrez plus sur ces concepts dans les chapitres suivants, donc ne vous inquiétez pas si vous ne comprenez pas l'erreur immédiatement.

- Avant la version 4.2 de TypeScript, les alias de types [_pourraient_ apparaître dans les messages d'erreurs](/play?#code/PTAEGEHsFsAcEsA2BTATqNrLusgzngIYDm+oA7koqIYuYQJ56gCueyoAUCKAC4AWHAHaFcoSADMaQ0PCG80EwgGNkALk6c5C1EtWgAsqOi1QAb06groEbjWg8vVHOKcAvpokshy3vEgyyMr8kEbQJogAFND2YREAlOaW1soBeJAoAHSIkMTRmbbI8e6aPMiZxJmgACqCGKhY6ABGyDnkFFQ0dIzMbBwCwqIccabcYLyQoKjIEmh8kwN8DLAc5PzwwbLMyAAeK77IACYaQSEjUWZWhfYAjABMAMwALA+gbsVjoADqgjKESytQPxCHghAByXigYgBfr8LAsYj8aQMUASbDQcRSExCeCwFiIQh+AKfAYyBiQFgOPyIaikSGLQo0Zj-aazaY+dSaXjLDgAGXgAC9CKhDqAALxJaw2Ib2RzOISuDycLw+ImBYKQflCkWRRD2LXCw6JCxS1JCdJZHJ5RAFIbFJU8ADKC3WzEcnVZaGYE1ABpFnFOmsFhsil2uoHuzwArO9SmAAEIsSFrZB-GgAjjA5gtVN8VCEc1o1C4Q4AGlR2AwO1EsBQoAAbvB-gJ4HhPgB5aDwem-Ph1TCV3AEEirTp4ELtRbTPD4vwKjOfAuioSQHuDXBcnmgACC+eCONFEs73YAPGGZVT5cRyyhiHh7AAON7lsG3vBggB8XGV3l8-nVISOgghxoLq9i7io-AHsayRWGaFrlFauq2rg9qaIGQHwCBqChtKdgRo8TxRjeyB3o+7xAA), sometimes in place of the equivalent anonymous type (which may or may not be desirable). Interfaces will always be named in error messages.
- Les alias de types ne sont pas concernés par les [fusions de déclarations, au contraire des interfaces](/play?#code/PTAEEEDtQS0gXApgJwGYEMDGjSfdAIx2UQFoB7AB0UkQBMAoEUfO0Wgd1ADd0AbAK6IAzizp16ALgYM4SNFhwBZdAFtV-UAG8GoPaADmNAcMmhh8ZHAMMAvjLkoM2UCvWad+0ARL0A-GYWVpA29gyY5JAWLJAwGnxmbvGgALzauvpGkCZmAEQAjABMAMwALLkANBl6zABi6DB8okR4Jjg+iPSgABboovDk3jjo5pbW1d6+dGb5djLwAJ7UoABKiJTwjThpnpnGpqPBoTLMAJrkArj4kOTwYmycPOhW6AR8IrDQ8N04wmo4HHQCwYi2Waw2W1S6S8HX8gTGITsQA).
- Les interfaces ne servent qu'à [déclarer les formes d'objets, et ne peuvent pas renommer des primitives](/play?#code/PTAEAkFMCdIcgM6gC4HcD2pIA8CGBbABwBtIl0AzUAKBFAFcEBLAOwHMUBPQs0XFgCahWyGBVwBjMrTDJMAshOhMARpD4tQ6FQCtIE5DWoixk9QEEWAeV37kARlABvaqDegAbrmL1IALlAEZGV2agBfampkbgtrWwMAJlAAXmdXdy8ff0Dg1jZwyLoAVWZ2Lh5QVHUJflAlSFxROsY5fFAWAmk6CnRoLGwmILzQQmV8JmQmDzI-SOiKgGV+CaYAL0gBBdyy1KCQ-Pn1AFFplgA5enw1PtSWS+vCsAAVAAtB4QQWOEMKBuYVUiVCYvYQsUTQcRSBDGMGmKSgAAa-VEgiQe2GLgKQA).
- Les interfaces [apparaissent toujours dans leurs formes originelles](/play?#code/PTAEGEHsFsAcEsA2BTATqNrLusgzngIYDm+oA7koqIYuYQJ56gCueyoAUCKAC4AWHAHaFcoSADMaQ0PCG80EwgGNkALk6c5C1EtWgAsqOi1QAb06groEbjWg8vVHOKcAvpokshy3vEgyyMr8kEbQJogAFND2YREAlOaW1soBeJAoAHSIkMTRmbbI8e6aPMiZxJmgACqCGKhY6ABGyDnkFFQ0dIzMbBwCwqIccabcYLyQoKjIEmh8kwN8DLAc5PzwwbLMyAAeK77IACYaQSEjUWY2Q-YAjABMAMwALA+gbsVjNXW8yxySoAADaAA0CCaZbPh1XYqXgOIY0ZgmcK0AA0nyaLFhhGY8F4AHJmEJILCWsgZId4NNfIgGFdcIcUTVfgBlZTOWC8T7kAJ42G4eT+GS42QyRaYbCgXAEEguTzeXyCjDBSAAQSE8Ai0Xsl0K9kcziExDeiQs1lAqSE6SyOTy0AKQ2KHk4p1V6s1OuuoHuzwArMagA) dans les messages d'erreur, mais _seulement_ si elles sont utilisées avec leurs noms.

La plupart du temps, vous êtes libres d'utiliser un type ou une interface, et TypeScript vous dira si vous avez besoin de l'autre déclaration. En règle générale, utilisez une `interface` sauf si vous avez besoin d'utiliser des `type`.

## Assertions de Types

Parfois, vous aurez des informations sur le type d'une valeur que TypeScript ne connaît pas.

Par exemple, si vous appelez `document.getElementById`, TypeScript saura uniquement que c'est une espèce d'`HTMLElement`, mais vous savez peut-être que cet appel renverra un `HTMLCanvasElement` avec un certain ID.

Dans cette situation, vous pourrez utiliser une _assertion de types_ pour spécifier un type plus précis :

```ts twoslash
const myCanvas = document.getElementById("main_canvas") as HTMLCanvasElement;
```

Tout comme les annotations, les assertions de types sont enlevées par le compilateur et n'affecteront pas l'exécution de votre code.

Une écriture équivalente consiste à utiliser les chevrons (sauf si votre fichier a l'extension `.tsx`) :

```ts twoslash
const myCanvas = <HTMLCanvasElement>document.getElementById("main_canvas");
```

> Rappel : Les assertions de types sont retirées à la compilation, et il n'existe aucune vérification associée à ces assertions.
> Si l'assertion est fausse, il n'y aura ni erreur ni `null` qui seront renvoyés.

TypeScript permet de faire des assertions qui sont _plus spécifiques_ ou _moins spécifiques_ que le type d'origine.
Cette règle interdit les assertions impossibles, tel que :

```ts twoslash
// @errors: 2352
const x = "bonjour" as number;
```

Cette règle peut parfois être trop restrictive, et pourrait interdire des conversions plus complexes mais qui restent valides.
Dans cette situation, vous pourrez faire une première conversion vers `any` (ou `unknown`, que nous introduirons plus tard), puis vers le type désiré :

```ts twoslash
declare const expr: any;
type T = { a: 1; b: 2; c: 3 };
// ---cut---
const a = (expr as any) as T;
```

## Types littéraux

En plus des types généraux comme `string` ou `number`, nous pouvons faire des références à des `string` ou `number` plus _spécifiques_ dans les annotations de types.

Une façon de comprendre ce point est de considérer les différentes façons dont JavaScript déclare ses variables. `var` et `let` permettent de changer ce que contient la variable, au contraire de `const`. Ces comportements sont reflétés dans la manière avec laquelle TypeScript déduit les types.

```ts twoslash
let changingString = "Hello World";
changingString = "Olá Mundo";
// `changingString` peut représenter n'importe quel string, donc
// TypeScript dit que cette variable est de type string
changingString;
// ^?

const constantString = "Bonjour tout le monde";
// `constantString` ne peut représenter qu'un seul string, donc TypeScript
// lui assigne un type littéral
constantString;
// ^?
```

Les types littéraux ne sont pas très utiles tous seuls :

```ts twoslash
// @errors: 2322
let x: "bonjour" = "bonjour";
// OK
x = "bonjour";
// ...
x = "salut";
```

Une variable qui n'a qu'une seule valeur n'est pas très utile !

Mais en _combinant_ les types littéraux dans des unions, vous pouvez exprimer des concepts bien plus utiles - par exemple, il est possible de créer des fonctions qui n'acceptent que certaines valeurs précises :

```ts twoslash
// @errors: 2345
function printText(s: string, alignment: "left" | "right" | "center") {
  // ...
}
printText("Bonjour tout le monde", "left");
printText("Yo mec", "centre");
```

Les types littéraux numériques fonctionnent de la même manière :

```ts twoslash
function compare(a: string, b: string): -1 | 0 | 1 {
  return a === b ? 0 : a > b ? 1 : -1;
}
```

Bien sûr, il est possible de combiner des primitives avec des types objet :

```ts twoslash
// @errors: 2345
interface Options {
  width: number;
}
function configure(x: Options | "auto") {
  // ...
}
configure({ width: 100 });
configure("auto");
configure("automatic");
```

Un autre type littéral existe : les littéraux booléens.
Il n'existe que deux types booléens littéraux, et comme vous pourriez le deviner, ce sont `true` et `false`.
Le type `boolean`, est, en réalité, un type alias de l'union `true | false`.

### Inférence littérale

Quand vous créez une variable qui est un objet, TypeScript pense que les propriétés de cet objet pourraient changer de valeur.
Par exemple, si vous écrivez ce code :

```ts twoslash
declare const someCondition: boolean;
// ---cut---
const obj = { counter: 0 };
if (someCondition) {
  obj.counter = 1;
}
```

TypeScript ne pense pas qu'assigner `1` à un champ qui avait `0` est une erreur.
En d'autres termes `obj.counter` est de type `number`, pas `0`, parce que les types sont utilisés pour déterminer le comportement à la _lecture_ et l'_écriture_.

Même chose pour les `string`:

```ts twoslash
// @errors: 2345
declare function handleRequest(url: string, method: "GET" | "POST"): void;
// ---cut---
const req = { url: "https://example.com", method: "GET" };
handleRequest(req.url, req.method);
```

Dans l'exemple ci-dessus, `req.method` est inféré comme étant un `string`, pas `"GET"`. BIl se peut qu'il y ait du code entre la déclaration de `req` et l'appel de `handleRequest`, et ce code pourrait assigner un nouveau `string` comme `"GUESS"` to `req.method`. Donc TypeScript considère que ce code contient une erreur.

Il y a deux façons de corriger ce problème.

1. Vous pouvez ajouter une assertion à deux endroits :

   ```ts twoslash
   declare function handleRequest(url: string, method: "GET" | "POST"): void;
   // ---cut---
   // 1er endroit :
   const req = { url: "https://example.com", method: "GET" as "GET" };
   // 2ème endroit
   handleRequest(req.url, req.method as "GET");
   ```

   Le premier changement signifie "Je veux que `req.method` ait toujours le type littéral `"GET"`", empêchant tout changement de cette valeur vers `"GUESS"` plus tard.
   Le deuxième changement signifie "Je sais que, pour certaines raisons, `req.method` est égal à `"GET"`".

2. Vous pouvez utiliser `as const` pour convertir l'objet entier en types littéraux :

   ```ts twoslash
   declare function handleRequest(url: string, method: "GET" | "POST"): void;
   // ---cut---
   const req = { url: "https://example.com", method: "GET" } as const;
   handleRequest(req.url, req.method);
   ```

Le suffixe `as const` vaut la même chose que `const` mais pour le système de types, garantissant que toutes les propriétés aient un type littéral, au lieu d'un type plus général comme `string` ou `number`.

## `null` et `undefined`

JavaScript a deux valeurs primitives pour signaler une valeur inexistante ou non-initialisée : `null` et `undefined`.

TypeScript a deux _types_ des mêmes noms. Le comportement de ces types dépend de l'activation de l'option [`strictNullChecks`](/tsconfig#strictNullChecks).

### `strictNullChecks` désactivé

Si [`strictNullChecks`](/tsconfig#strictNullChecks) est _désactivé_, les valeurs qui pourraient être `null` ou `undefined` peuvent toujours être lues, et les valeurs `null` et `undefined` peuvent être assignées à des variables de tous types.
Ce comportement est similaire aux langages qui n'ont pas de vérification pour `null` ou `undefined` (ex. Java ou C#).
Ne pas vérifier pour ces deux valeurs tend à être une source importante de bugs ; nous recommandons toujours d'activer [`strictNullChecks`](/tsconfig#strictNullChecks) s'il est pratique de le faire.

### `strictNullChecks` activé

Si [`strictNullChecks`](/tsconfig#strictNullChecks) est _activé_, quand une valeur est `null` ou `undefined`, vous devrez vous assurer que ces deux types sont écartés avant d'utiliser des méthodes ou des propriétés sous ces valeurs.
Tout comme `undefined` doit être éliminé avant d'utiliser une propriété facultative, vous pouvez vous servir du _rétrécissement_ pour éliminer les valeurs qui pourraient être `null` :

```ts twoslash
function doSomething(x: string | null) {
  if (x === null) {
    // ne rien faire
  } else {
    console.log("Bonjour, " + x.toUpperCase());
  }
}
```

### Opérateur d'assertion non-nulle (Suffixe `!`)

TypeScript possède une syntaxe spéciale pour éliminer `null` et `undefined` d'un type sans passer par un rétrécissement.
Écrire `!` après toute expression est effectivement une assertion que cette valeur n'est ni `null`, ni `undefined` :

```ts twoslash
function liveDangerously(x?: number | null) {
  // Pas d'erreur
  console.log(x!.toFixed());
}
```

Tout comme les autres assertions, votre code ne sera pas changé à l'exécution, donc n'utilisez l'opérateur `!` que si vous savez que votre type _ne peut jamais_ être `null` ni `undefined`.

## Enums

Les Enums sont une fonctionnalité ajoutée à JavaScript par TypeScript. Elle permet de décrire une valeur qui pourrait faire partie d'un ensemble de constantes nommées. Au contraire de la plupart des fonctionnalités TypeScript, elle n'est _pas_ un ajout au niveau du système de types, mais bel et bien un ajout qui sera reflété à l'exécution. De ce fait, vous devriez savoir que cette possibilité existe, mais vous ne devriez vous en servir que si vous en avez la certitude. Vous pouvez lire plus dans la [page de référence d'Enums](/fr/docs/handbook/enums.html).

## Primitives moins fréquentes

Il serait intéressant de mentionner le reste des primitives JavaScript représentées dans le système de types, bien que nous ne rentrerons pas dans leurs détails.

#### `bigint`

À partir d'ES2020, il existe une primitive JavaScript pour les très grands entiers, `BigInt`:

```ts twoslash
// @target: es2020

// Création d'un BigInt via la fonction
const oneHundred: bigint = BigInt(100);

// Création d'un BigInt via la syntaxe littérale
const anotherHundred: bigint = 100n;
```

Vous pouvez en apprendre plus sur les BigInt dans les [notes de changement de TypeScript 3.2](/docs/handbook/release-notes/typescript-3-2.html#bigint).

#### `symbol`

Il existe une primitive en JavaScript qui sert à créer des références uniques via la fonction `Symbol()` :

```ts twoslash
// @errors: 2367
const firstName = Symbol("nom");
const secondName = Symbol("nom");

if (firstName === secondName) {
  // Ne peut jamais se produire
}
```

Vous pouvez en savoir plus dans la [page de référence des Symbols](/fr/docs/handbook/symbols.html).
