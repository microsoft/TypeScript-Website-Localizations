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

TypeScript's type system allows you to build new types out of existing ones using a large variety of operators.
Now that we know how to write a few types, it's time to start _combining_ them in interesting ways.

### Defining a Union Type

The first way to combine types you might see is a _union_ type.
A union type is a type formed from two or more other types, representing values that may be _any one_ of those types.
We refer to each of these types as the union's _members_.

Let's write a function that can operate on strings or numbers:

```ts twoslash
// @errors: 2345
function printId(id: number | string) {
  console.log("Your ID is: " + id);
}
// OK
printId(101);
// OK
printId("202");
// Error
printId({ myID: 22342 });
```

### Working with Union Types

It's easy to _provide_ a value matching a union type - simply provide a type matching any of the union's members.
If you _have_ a value of a union type, how do you work with it?

TypeScript will only allow an operation if it is valid for _every_ member of the union.
For example, if you have the union `string | number`, you can't use methods that are only available on `string`:

```ts twoslash
// @errors: 2339
function printId(id: number | string) {
  console.log(id.toUpperCase());
}
```

The solution is to _narrow_ the union with code, the same as you would in JavaScript without type annotations.
_Narrowing_ occurs when TypeScript can deduce a more specific type for a value based on the structure of the code.

For example, TypeScript knows that only a `string` value will have a `typeof` value `"string"`:

```ts twoslash
function printId(id: number | string) {
  if (typeof id === "string") {
    // In this branch, id is of type 'string'
    console.log(id.toUpperCase());
  } else {
    // Here, id is of type 'number'
    console.log(id);
  }
}
```

Another example is to use a function like `Array.isArray`:

```ts twoslash
function welcomePeople(x: string[] | string) {
  if (Array.isArray(x)) {
    // Here: 'x' is 'string[]'
    console.log("Hello, " + x.join(" and "));
  } else {
    // Here: 'x' is 'string'
    console.log("Welcome lone traveler " + x);
  }
}
```

Notice that in the `else` branch, we don't need to do anything special - if `x` wasn't a `string[]`, then it must have been a `string`.

Sometimes you'll have a union where all the members have something in common.
For example, both arrays and strings have a `slice` method.
If every member in a union has a property in common, you can use that property without narrowing:

```ts twoslash
// Return type is inferred as number[] | string
function getFirstThree(x: number[] | string) {
  return x.slice(0, 3);
}
```

> It might be confusing that a _union_ of types appears to have the _intersection_ of those types' properties.
> This is not an accident - the name _union_ comes from type theory.
> The _union_ `number | string` is composed by taking the union _of the values_ from each type.
> Notice that given two sets with corresponding facts about each set, only the _intersection_ of those facts applies to the _union_ of the sets themselves.
> For example, if we had a room of tall people wearing hats, and another room of Spanish speakers wearing hats, after combining those rooms, the only thing we know about _every_ person is that they must be wearing a hat.

## Type Aliases

We've been using object types and union types by writing them directly in type annotations.
This is convenient, but it's common to want to use the same type more than once and refer to it by a single name.

A _type alias_ is exactly that - a _name_ for any _type_.
The syntax for a type alias is:

```ts twoslash
type Point = {
  x: number;
  y: number;
};

// Exactly the same as the earlier example
function printCoord(pt: Point) {
  console.log("The coordinate's x value is " + pt.x);
  console.log("The coordinate's y value is " + pt.y);
}

printCoord({ x: 100, y: 100 });
```

You can actually use a type alias to give a name to any type at all, not just an object type.
For example, a type alias can name a union type:

```ts twoslash
type ID = number | string;
```

Note that aliases are _only_ aliases - you cannot use type aliases to create different/distinct "versions" of the same type.
When you use the alias, it's exactly as if you had written the aliased type.
In other words, this code might _look_ illegal, but is OK according to TypeScript because both types are aliases for the same type:

```ts twoslash
declare function getInput(): string;
declare function sanitize(str: string): string;
// ---cut---
type UserInputSanitizedString = string;

function sanitizeInput(str: string): UserInputSanitizedString {
  return sanitize(str);
}

// Create a sanitized input
let userInput = sanitizeInput(getInput());

// Can still be re-assigned with a string though
userInput = "new input";
```

## Interfaces

An _interface declaration_ is another way to name an object type:

```ts twoslash
interface Point {
  x: number;
  y: number;
}

function printCoord(pt: Point) {
  console.log("The coordinate's x value is " + pt.x);
  console.log("The coordinate's y value is " + pt.y);
}

printCoord({ x: 100, y: 100 });
```

Just like when we used a type alias above, the example works just as if we had used an anonymous object type.
TypeScript is only concerned with the _structure_ of the value we passed to `printCoord` - it only cares that it has the expected properties.
Being concerned only with the structure and capabilities of types is why we call TypeScript a _structurally typed_ type system.

### Differences Between Type Aliases and Interfaces

Type aliases and interfaces are very similar, and in many cases you can choose between them freely.
Almost all features of an `interface` are available in `type`, the key distinction is that a type cannot be re-opened to add new properties vs an interface which is always extendable.

<table class='full-width-table'>
  <tbody>
    <tr>
      <th><code>Interface</code></th>
      <th><code>Type</code></th>
    </tr>
    <tr>
      <td>
        <p>Extending an interface</p>
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
        <p>Extending a type via intersections</p>
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
        <p>Adding new fields to an existing interface</p>
        <code><pre>
interface Window {
  title: string
}<br/>
interface Window {
  ts: TypeScriptAPI
}<br/>
const src = 'const a = "Hello World"';
window.ts.transpileModule(src, {});
        </pre></code>
      </td>
      <td>
        <p>A type cannot be changed after being created</p>
        <code><pre>
type Window = {
  title: string
}<br/>
type Window = {
  ts: TypeScriptAPI
}<br/>
<span style="color: #A31515"> // Error: Duplicate identifier 'Window'.</span><br/>
        </pre></code>
      </td>
    </tr>
    </tbody>
</table>

You'll learn more about these concepts in later chapters, so don't worry if you don't understand all of these right away.

- Prior to TypeScript version 4.2, type alias names [_may_ appear in error messages](/play?#code/PTAEGEHsFsAcEsA2BTATqNrLusgzngIYDm+oA7koqIYuYQJ56gCueyoAUCKAC4AWHAHaFcoSADMaQ0PCG80EwgGNkALk6c5C1EtWgAsqOi1QAb06groEbjWg8vVHOKcAvpokshy3vEgyyMr8kEbQJogAFND2YREAlOaW1soBeJAoAHSIkMTRmbbI8e6aPMiZxJmgACqCGKhY6ABGyDnkFFQ0dIzMbBwCwqIccabcYLyQoKjIEmh8kwN8DLAc5PzwwbLMyAAeK77IACYaQSEjUWZWhfYAjABMAMwALA+gbsVjoADqgjKESytQPxCHghAByXigYgBfr8LAsYj8aQMUASbDQcRSExCeCwFiIQh+AKfAYyBiQFgOPyIaikSGLQo0Zj-aazaY+dSaXjLDgAGXgAC9CKhDqAALxJaw2Ib2RzOISuDycLw+ImBYKQflCkWRRD2LXCw6JCxS1JCdJZHJ5RAFIbFJU8ADKC3WzEcnVZaGYE1ABpFnFOmsFhsil2uoHuzwArO9SmAAEIsSFrZB-GgAjjA5gtVN8VCEc1o1C4Q4AGlR2AwO1EsBQoAAbvB-gJ4HhPgB5aDwem-Ph1TCV3AEEirTp4ELtRbTPD4vwKjOfAuioSQHuDXBcnmgACC+eCONFEs73YAPGGZVT5cRyyhiHh7AAON7lsG3vBggB8XGV3l8-nVISOgghxoLq9i7io-AHsayRWGaFrlFauq2rg9qaIGQHwCBqChtKdgRo8TxRjeyB3o+7xAA), sometimes in place of the equivalent anonymous type (which may or may not be desirable). Interfaces will always be named in error messages.
- Type aliases may not participate [in declaration merging, but interfaces can](/play?#code/PTAEEEDtQS0gXApgJwGYEMDGjSfdAIx2UQFoB7AB0UkQBMAoEUfO0Wgd1ADd0AbAK6IAzizp16ALgYM4SNFhwBZdAFtV-UAG8GoPaADmNAcMmhh8ZHAMMAvjLkoM2UCvWad+0ARL0A-GYWVpA29gyY5JAWLJAwGnxmbvGgALzauvpGkCZmAEQAjABMAMwALLkANBl6zABi6DB8okR4Jjg+iPSgABboovDk3jjo5pbW1d6+dGb5djLwAJ7UoABKiJTwjThpnpnGpqPBoTLMAJrkArj4kOTwYmycPOhW6AR8IrDQ8N04wmo4HHQCwYi2Waw2W1S6S8HX8gTGITsQA).
- Interfaces may only be used to [declare the shapes of objects, not rename primitives](/play?#code/PTAEAkFMCdIcgM6gC4HcD2pIA8CGBbABwBtIl0AzUAKBFAFcEBLAOwHMUBPQs0XFgCahWyGBVwBjMrTDJMAshOhMARpD4tQ6FQCtIE5DWoixk9QEEWAeV37kARlABvaqDegAbrmL1IALlAEZGV2agBfampkbgtrWwMAJlAAXmdXdy8ff0Dg1jZwyLoAVWZ2Lh5QVHUJflAlSFxROsY5fFAWAmk6CnRoLGwmILzQQmV8JmQmDzI-SOiKgGV+CaYAL0gBBdyy1KCQ-Pn1AFFplgA5enw1PtSWS+vCsAAVAAtB4QQWOEMKBuYVUiVCYvYQsUTQcRSBDGMGmKSgAAa-VEgiQe2GLgKQA).
- Interface names will [_always_ appear in their original form](/play?#code/PTAEGEHsFsAcEsA2BTATqNrLusgzngIYDm+oA7koqIYuYQJ56gCueyoAUCKAC4AWHAHaFcoSADMaQ0PCG80EwgGNkALk6c5C1EtWgAsqOi1QAb06groEbjWg8vVHOKcAvpokshy3vEgyyMr8kEbQJogAFND2YREAlOaW1soBeJAoAHSIkMTRmbbI8e6aPMiZxJmgACqCGKhY6ABGyDnkFFQ0dIzMbBwCwqIccabcYLyQoKjIEmh8kwN8DLAc5PzwwbLMyAAeK77IACYaQSEjUWY2Q-YAjABMAMwALA+gbsVjNXW8yxySoAADaAA0CCaZbPh1XYqXgOIY0ZgmcK0AA0nyaLFhhGY8F4AHJmEJILCWsgZId4NNfIgGFdcIcUTVfgBlZTOWC8T7kAJ42G4eT+GS42QyRaYbCgXAEEguTzeXyCjDBSAAQSE8Ai0Xsl0K9kcziExDeiQs1lAqSE6SyOTy0AKQ2KHk4p1V6s1OuuoHuzwArMagA) in error messages, but _only_ when they are used by name.

For the most part, you can choose based on personal preference, and TypeScript will tell you if it needs something to be the other kind of declaration. If you would like a heuristic, use `interface` until you need to use features from `type`.

## Type Assertions

Sometimes you will have information about the type of a value that TypeScript can't know about.

For example, if you're using `document.getElementById`, TypeScript only knows that this will return _some_ kind of `HTMLElement`, but you might know that your page will always have an `HTMLCanvasElement` with a given ID.

In this situation, you can use a _type assertion_ to specify a more specific type:

```ts twoslash
const myCanvas = document.getElementById("main_canvas") as HTMLCanvasElement;
```

Like a type annotation, type assertions are removed by the compiler and won't affect the runtime behavior of your code.

You can also use the angle-bracket syntax (except if the code is in a `.tsx` file), which is equivalent:

```ts twoslash
const myCanvas = <HTMLCanvasElement>document.getElementById("main_canvas");
```

> Reminder: Because type assertions are removed at compile-time, there is no runtime checking associated with a type assertion.
> There won't be an exception or `null` generated if the type assertion is wrong.

TypeScript only allows type assertions which convert to a _more specific_ or _less specific_ version of a type.
This rule prevents "impossible" coercions like:

```ts twoslash
// @errors: 2352
const x = "hello" as number;
```

Sometimes this rule can be too conservative and will disallow more complex coercions that might be valid.
If this happens, you can use two assertions, first to `any` (or `unknown`, which we'll introduce later), then to the desired type:

```ts twoslash
declare const expr: any;
type T = { a: 1; b: 2; c: 3 };
// ---cut---
const a = (expr as any) as T;
```

## Literal Types

In addition to the general types `string` and `number`, we can refer to _specific_ strings and numbers in type positions.

One way to think about this is to consider how JavaScript comes with different ways to declare a variable. Both `var` and `let` allow for changing what is held inside the variable, and `const` does not. This is reflected in how TypeScript creates types for literals.

```ts twoslash
let changingString = "Hello World";
changingString = "Olá Mundo";
// Because `changingString` can represent any possible string, that
// is how TypeScript describes it in the type system
changingString;
// ^?

const constantString = "Hello World";
// Because `constantString` can only represent 1 possible string, it
// has a literal type representation
constantString;
// ^?
```

By themselves, literal types aren't very valuable:

```ts twoslash
// @errors: 2322
let x: "hello" = "hello";
// OK
x = "hello";
// ...
x = "howdy";
```

It's not much use to have a variable that can only have one value!

But by _combining_ literals into unions, you can express a much more useful concept - for example, functions that only accept a certain set of known values:

```ts twoslash
// @errors: 2345
function printText(s: string, alignment: "left" | "right" | "center") {
  // ...
}
printText("Hello, world", "left");
printText("G'day, mate", "centre");
```

Numeric literal types work the same way:

```ts twoslash
function compare(a: string, b: string): -1 | 0 | 1 {
  return a === b ? 0 : a > b ? 1 : -1;
}
```

Of course, you can combine these with non-literal types:

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

There's one more kind of literal type: boolean literals.
There are only two boolean literal types, and as you might guess, they are the types `true` and `false`.
The type `boolean` itself is actually just an alias for the union `true | false`.

### Literal Inference

When you initialize a variable with an object, TypeScript assumes that the properties of that object might change values later.
For example, if you wrote code like this:

```ts twoslash
declare const someCondition: boolean;
// ---cut---
const obj = { counter: 0 };
if (someCondition) {
  obj.counter = 1;
}
```

TypeScript doesn't assume the assignment of `1` to a field which previously had `0` is an error.
Another way of saying this is that `obj.counter` must have the type `number`, not `0`, because types are used to determine both _reading_ and _writing_ behavior.

The same applies to strings:

```ts twoslash
// @errors: 2345
declare function handleRequest(url: string, method: "GET" | "POST"): void;
// ---cut---
const req = { url: "https://example.com", method: "GET" };
handleRequest(req.url, req.method);
```

In the above example `req.method` is inferred to be `string`, not `"GET"`. Because code can be evaluated between the creation of `req` and the call of `handleRequest` which could assign a new string like `"GUESS"` to `req.method`, TypeScript considers this code to have an error.

There are two ways to work around this.

1. You can change the inference by adding a type assertion in either location:

   ```ts twoslash
   declare function handleRequest(url: string, method: "GET" | "POST"): void;
   // ---cut---
   // Change 1:
   const req = { url: "https://example.com", method: "GET" as "GET" };
   // Change 2
   handleRequest(req.url, req.method as "GET");
   ```

   Change 1 means "I intend for `req.method` to always have the _literal type_ `"GET"`", preventing the possible assignment of `"GUESS"` to that field after.
   Change 2 means "I know for other reasons that `req.method` has the value `"GET"`".

2. You can use `as const` to convert the entire object to be type literals:

   ```ts twoslash
   declare function handleRequest(url: string, method: "GET" | "POST"): void;
   // ---cut---
   const req = { url: "https://example.com", method: "GET" } as const;
   handleRequest(req.url, req.method);
   ```

The `as const` suffix acts like `const` but for the type system, ensuring that all properties are assigned the literal type instead of a more general version like `string` or `number`.

## `null` and `undefined`

JavaScript has two primitive values used to signal absent or uninitialized value: `null` and `undefined`.

TypeScript has two corresponding _types_ by the same names. How these types behave depends on whether you have the [`strictNullChecks`](/tsconfig#strictNullChecks) option on.

### `strictNullChecks` off

With [`strictNullChecks`](/tsconfig#strictNullChecks) _off_, values that might be `null` or `undefined` can still be accessed normally, and the values `null` and `undefined` can be assigned to a property of any type.
This is similar to how languages without null checks (e.g. C#, Java) behave.
The lack of checking for these values tends to be a major source of bugs; we always recommend people turn [`strictNullChecks`](/tsconfig#strictNullChecks) on if it's practical to do so in their codebase.

### `strictNullChecks` on

With [`strictNullChecks`](/tsconfig#strictNullChecks) _on_, when a value is `null` or `undefined`, you will need to test for those values before using methods or properties on that value.
Just like checking for `undefined` before using an optional property, we can use _narrowing_ to check for values that might be `null`:

```ts twoslash
function doSomething(x: string | null) {
  if (x === null) {
    // do nothing
  } else {
    console.log("Hello, " + x.toUpperCase());
  }
}
```

### Non-null Assertion Operator (Postfix `!`)

TypeScript also has a special syntax for removing `null` and `undefined` from a type without doing any explicit checking.
Writing `!` after any expression is effectively a type assertion that the value isn't `null` or `undefined`:

```ts twoslash
function liveDangerously(x?: number | null) {
  // No error
  console.log(x!.toFixed());
}
```

Just like other type assertions, this doesn't change the runtime behavior of your code, so it's important to only use `!` when you know that the value _can't_ be `null` or `undefined`.

## Enums

Enums are a feature added to JavaScript by TypeScript which allows for describing a value which could be one of a set of possible named constants. Unlike most TypeScript features, this is _not_ a type-level addition to JavaScript but something added to the language and runtime. Because of this, it's a feature which you should know exists, but maybe hold off on using unless you are sure. You can read more about enums in the [Enum reference page](/docs/handbook/enums.html).

## Less Common Primitives

It's worth mentioning the rest of the primitives in JavaScript which are represented in the type system.
Though we will not go into depth here.

#### `bigint`

From ES2020 onwards, there is a primitive in JavaScript used for very large integers, `BigInt`:

```ts twoslash
// @target: es2020

// Creating a bigint via the BigInt function
const oneHundred: bigint = BigInt(100);

// Creating a BigInt via the literal syntax
const anotherHundred: bigint = 100n;
```

You can learn more about BigInt in [the TypeScript 3.2 release notes](/docs/handbook/release-notes/typescript-3-2.html#bigint).

#### `symbol`

There is a primitive in JavaScript used to create a globally unique reference via the function `Symbol()`:

```ts twoslash
// @errors: 2367
const firstName = Symbol("name");
const secondName = Symbol("name");

if (firstName === secondName) {
  // Can't ever happen
}
```

You can learn more about them in [Symbols reference page](/docs/handbook/symbols.html).
