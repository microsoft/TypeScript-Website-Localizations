---
title: Rétrécissement
layout: docs
permalink: /fr/docs/handbook/2/narrowing.html
oneline: "Comprendre comment TypeScript utilise ses connaissances JavaScript pour réduire la quantité de syntaxe de types dans vos projets."
---

Imaginez que vous avez une fonction `padLeft`.

```ts twoslash
function padLeft(padding: number | string, input: string): string {
  throw new Error("Pas encore implémenté !");
}
```

Si `padding` est un `number`, la fonction va le traiter comme le nombre d'espaces à insérer avant `input`.
Si `padding` est un `string`, elle doit juste concaténer `padding` avant `input`.
Essayons d'implémenter la logique d'implémentation de `padLeft` quand elle reçoit un `number` pour `padding`.

```ts twoslash
// @errors: 2345
function padLeft(padding: number | string, input: string) {
  return " ".repeat(padding) + input;
}
```

Nous avons une erreur au niveau de `padding`.
TypeScript nous avertit qu'assigner un `number | string` à un `number` pourrait ne pas nous donner ce qu'on veut, et c'est vrai.
En d'autres termes, nous n'avons pas vérifié explicitement si `padding` est d'abord un `number`, et nous ne gérons pas non plus les cas où on envoie un `string`, alors faisons ça.

```ts twoslash
function padLeft(padding: number | string, input: string) {
  if (typeof padding === "number") {
    return " ".repeat(padding) + input;
  }
  return padding + input;
}
```

Si cela ressemble à du code JavaScript inintéressant, c'est l'objectif.
À part les annotations que nous avons mises en places, ce code TypeScript ressemble à du JavaScript.
L'idée est que le but du système de types de TypeScript est de pouvoir écrire du code JavaScript de tous les jours sans se plier en quatre pour garantir la sécurité de typage.

Et même si ce code n'a pas l'air impressionnant, il y a beaucoup de choses qui se passent en coulisses.
TypeScript peut très bien analyser les valeurs à l'exécution en utilisant des types statiques. Il peut aussi suivre les expressions de contrôle de flux de code de JavaScript comme les `if/else`, les conditions ternaires, boucles, vérifications de _véracité_, etc., qui peuvent affecter ces types.

À l'intérieur de cet `if`, TypeScript repère `typeof padding === "number"` et comprend que c'est du code spécial qui s'appelle les _gardes de types_.
TypeScript suit les possibles chemins d'exécution que le programme peut prendre pour analyser les types les plus spécifiques possibles d'une valeur à tout moment.
Le procédé de raffinement de types vers des types plus spécifiques s'appelle le _rétrécissement_.
Dans plusieurs éditeurs de code, ainsi que dans les exemples suivants, il est possible d'observer ces types dès qu'ils changent.

```ts twoslash
function padLeft(padding: number | string, input: string) {
  if (typeof padding === "number") {
    return " ".repeat(padding) + input;
    //                ^?
  }
  return padding + input;
  //     ^?
}
```

Il y a un nombre d'expressions que TypeScript peut comprendre, pour permettre de faire du rétrécissement.

## Gardes de types `typeof`

Comme vu précédemment, le JavaScript supporte un opérateur `typeof` qui donne des informations très basiques sur le type de la valeur vérifiée.
TypeScript s'attend à ce que cet opérateur retourne un certain ensemble précis de valeurs:

- `"string"`
- `"number"`
- `"bigint"`
- `"boolean"`
- `"symbol"`
- `"undefined"`
- `"object"`
- `"function"`

Comme vu avec `padLeft`, cet opérateur apparaît souvent dans beaucoup de librairies JavaScript, et TypeScript peut s'en servir pour opérer son rétrécissement dans les branches de code.

En TypeScript, le fait de vérifier le type d'une valeur avec `typeof` crée un garde de type.
TypeScript sait comment `typeof` agit avec différentes valeurs, y compris avec les excentricités de JavaScript.
Par exemple, dans la liste précédente, vous remarquerez que `typeof` ne retourne pas `null`.
Vous le verrez aussi dans cet exemple :

```ts twoslash
// @errors: 2531
function printAll(strs: string | string[] | null) {
  if (typeof strs === "object") {
    for (const s of strs) {
      console.log(s);
    }
  } else if (typeof strs === "string") {
    console.log(strs);
  } else {
    // do nothing
  }
}
```

La fonction `printAll` essaie de vérifier si `strs` est un objet, pour itérer sur le tableau (rappel : les tableaux sont des objets en JavaScript).
Le problème est que `typeof null` est également `"object"`, ouvrant la porte à une faille qui permet de provoquer un crash.
C'est l'un des malheureux accidents à jamais présents dans l'histoire.

Les développeurs suffisamment expérimentés ne seront peut-être pas surpris, mais pas tout le monde a croisé ce cas de figure ; heureusement, TypeScript vous fera savoir que `strs` n'a été rétréci que vers `string[] | null`, au lieu de `string[]` uniquement.

Ce serait une bonne transition vers ce qu'on va nommer, le rétrécissement par véracité.

# Rétrécissement par véracité

La véracité (anglais _truthiness_) ne va pas être un mot que vous allez souvent croiser, mais c'est quelque chose de très commun en JavaScript.

Vous pouvez utiliser des expressions (sans qu'elles retournent nécessairement un booléen), des `&&`, des `||`, des `if`, des négations booléennes (`!`), et plus encore.
Par exemple, les `if` ne s'attendent pas spécialement à ce que l'expression retourne un `boolean`.

```ts twoslash
function getUsersOnlineMessage(numUsersOnline: number) {
  if (numUsersOnline) {
    return `Il y a ${numUsersOnline} utilisateurs en ligne !`;
  }
  return "C'est désert.";
}
```

En JavaScript, les expressions tel que `if` convertissent leurs conditions vers des `boolean`s pour les comprendre, puis choisissent leur branche selon si le résultat est `true` ou `false`.
Les valeurs

- `0`
- `NaN`
- `""` (chaîne de caractères vide)
- `0n` (zéro mais en `bigint`)
- `null`
- `undefined`

sont toutes converties en `false`, et les autres valeurs sont converties en `true`.
Vous pouvez obtenir des `boolean`s en passant ces valeurs à la fonction `Boolean`, ou grâce à la double négation (TypeScript pourra inférer `true` dans le deuxième cas, tandis qu'il se contentera de `boolean` dans le premier.)

```ts twoslash
// les deux renverront 'true'
Boolean("hello"); // type: boolean, value: true
!!"world"; // type: true,    value: true
```

Ce comportement est utilisé assez souvent, surtout pour se prémunir de valeurs tel que `null` ou `undefined`.
Essayons de l'appliquer à notre fonction `printAll`.

```ts twoslash
function printAll(strs: string | string[] | null) {
  if (strs && typeof strs === "object") {
    for (const s of strs) {
      console.log(s);
    }
  } else if (typeof strs === "string") {
    console.log(strs);
  }
}
```

Vous remarquerez que nous nous sommes débarrassés de l'erreur ci-dessus en vérifiant si `strs` est _truthy_ (si sa valeur booléenne est `true`).
Cela nous prémunit d'erreurs fatales tel que :

```txt
TypeError: null is not iterable
```

Souvenez-vous cependant que vérifier des primitives peut souvent mal se passer.
Considérez ce deuxième essai d'implémentation de `printAll` :

```ts twoslash {class: "do-not-do-this"}
function printAll(strs: string | string[] | null) {
  // !!!!!!!!!!!!!!!!
  //  Ne faites pas ça
  // !!!!!!!!!!!!!!!!
  if (strs) {
    if (typeof strs === "object") {
      for (const s of strs) {
        console.log(s);
      }
    } else if (typeof strs === "string") {
      console.log(strs);
    }
  }
}
```

Nous avons entouré tout le corps de la fonction dans une vérification de valeur _truthy_, mais cette approche possède un défaut subtil : on ne gère plus le cas de la chaîne de caractères vide correctement. Les développeurs moins expérimentés avec JavaScript pourraient tomber dans ce piège.

TypeScript est souvent capable de repérer les bugs existants, mais si vous décidez de ne _rien_ faire avec une valeur, il ne peut pas non plus pallier à vos oublis sans être trop strict.
Un linter, cependant, peut signaler ces cas de figure.

Une dernière remarque sur le filtrage par `Boolean`, c'est que le système de typage s'adaptera dans la branche appropriée et omettra les types `falsy` (qui ne sont, donc, pas `truthy`) de ses prédictions.

```ts twoslash
function multiplyAll(
  values: number[] | undefined,
  factor: number
): number[] | undefined {
  if (!values) {
    return values;
  } else {
    return values.map((x) => x * factor);
  }
}
```

## Rétrécissement par égalités

TypeScript utilise également les déclarations `switch` ainsi que les vérifications d'égalités, comme `===`, `!==`, `==`, et `!=` pour rétrécir les types.
Par exemple :

```ts twoslash
function example(x: string | number, y: string | boolean) {
  if (x === y) {
    // On peut appeler toutes les méthodes de 'string' sur x ou y.
    x.toUpperCase();
    // ^?
    y.toLowerCase();
    // ^?
  } else {
    console.log(x);
    //          ^?
    console.log(y);
    //          ^?
  }
}
```

Quand on a vérifié que `x` et `y` sont égaux, TypeScript a su que leurs types devaient aussi être égaux.
Vu que `string` est le seul type que `x` et `y` peuvent avoir, TypeScript sait que `x` et `y` doivent être des `string` dans la première branche.

Accomplir des vérifications contre des valeurs (et non pas des variables) fonctionne également.
Dans la section sur le rétrécissement par _truthiness_, la fonction `printAll` ne gérait pas les strings vides.
Une vérification simple pour éliminer les `null`s aurait suffi pour que TypeScript soit plus précis sur le type de `strs`.

```ts twoslash
function printAll(strs: string | string[] | null) {
  if (strs !== null) {
    if (typeof strs === "object") {
      for (const s of strs) {
        //            ^?
        console.log(s);
      }
    } else if (typeof strs === "string") {
      console.log(strs);
      //          ^?
    }
  }
}
```

Les vérifications d'égalité moins strictes de JavaScript, tel que `==` et `!=`, sont rétrécies correctement.
Si vous n'êtes pas familier, vérifier si quelque chose `== null` vérifie aussi si elle `== undefined`. De même, si quelque chose `== undefined`, JavaScript vérifiera aussi si elle `== null`.

```ts twoslash
interface Container {
  value: number | null | undefined;
}

function multiplyValue(container: Container, factor: number) {
  // Remove both 'null' and 'undefined' from the type.
  if (container.value != null) {
    console.log(container.value);
    //                    ^?

    // Now we can safely multiply 'container.value'.
    container.value *= factor;
  }
}
```

## The `in` operator narrowing

JavaScript has an operator for determining if an object has a property with a name: the `in` operator.
TypeScript takes this into account as a way to narrow down potential types.

For example, with the code: `"value" in x`. where `"value"` is a string literal and `x` is a union type.
The "true" branch narrows `x`'s types which have either an optional or required property `value`, and the "false" branch narrows to types which have an optional or missing property `value`.

```ts twoslash
type Fish = { swim: () => void };
type Bird = { fly: () => void };

function move(animal: Fish | Bird) {
  if ("swim" in animal) {
    return animal.swim();
  }

  return animal.fly();
}
```

To reiterate optional properties will exist in both sides for narrowing, for example a human could both swim and fly (with the right equipment) and thus should show up in both sides of the `in` check:

<!-- prettier-ignore -->
```ts twoslash
type Fish = { swim: () => void };
type Bird = { fly: () => void };
type Human = { swim?: () => void; fly?: () => void };

function move(animal: Fish | Bird | Human) {
  if ("swim" in animal) {
    animal;
//  ^?
  } else {
    animal;
//  ^?
  }
}
```

## `instanceof` narrowing

JavaScript has an operator for checking whether or not a value is an "instance" of another value.
More specifically, in JavaScript `x instanceof Foo` checks whether the _prototype chain_ of `x` contains `Foo.prototype`.
While we won't dive deep here, and you'll see more of this when we get into classes, they can still be useful for most values that can be constructed with `new`.
As you might have guessed, `instanceof` is also a type guard, and TypeScript narrows in branches guarded by `instanceof`s.

```ts twoslash
function logValue(x: Date | string) {
  if (x instanceof Date) {
    console.log(x.toUTCString());
    //          ^?
  } else {
    console.log(x.toUpperCase());
    //          ^?
  }
}
```

## Assignments

As we mentioned earlier, when we assign to any variable, TypeScript looks at the right side of the assignment and narrows the left side appropriately.

```ts twoslash
let x = Math.random() < 0.5 ? 10 : "hello world!";
//  ^?
x = 1;

console.log(x);
//          ^?
x = "goodbye!";

console.log(x);
//          ^?
```

Notice that each of these assignments is valid.
Even though the observed type of `x` changed to `number` after our first assignment, we were still able to assign a `string` to `x`.
This is because the _declared type_ of `x` - the type that `x` started with - is `string | number`, and assignability is always checked against the declared type.

If we'd assigned a `boolean` to `x`, we'd have seen an error since that wasn't part of the declared type.

```ts twoslash
// @errors: 2322
let x = Math.random() < 0.5 ? 10 : "hello world!";
//  ^?
x = 1;

console.log(x);
//          ^?
x = true;

console.log(x);
//          ^?
```

## Control flow analysis

Up until this point, we've gone through some basic examples of how TypeScript narrows within specific branches.
But there's a bit more going on than just walking up from every variable and looking for type guards in `if`s, `while`s, conditionals, etc.
For example

```ts twoslash
function padLeft(padding: number | string, input: string) {
  if (typeof padding === "number") {
    return " ".repeat(padding) + input;
  }
  return padding + input;
}
```

`padLeft` returns from within its first `if` block.
TypeScript was able to analyze this code and see that the rest of the body (`return padding + input;`) is _unreachable_ in the case where `padding` is a `number`.
As a result, it was able to remove `number` from the type of `padding` (narrowing from `string | number` to `string`) for the rest of the function.

This analysis of code based on reachability is called _control flow analysis_, and TypeScript uses this flow analysis to narrow types as it encounters type guards and assignments.
When a variable is analyzed, control flow can split off and re-merge over and over again, and that variable can be observed to have a different type at each point.

```ts twoslash
function example() {
  let x: string | number | boolean;

  x = Math.random() < 0.5;

  console.log(x);
  //          ^?

  if (Math.random() < 0.5) {
    x = "hello";
    console.log(x);
    //          ^?
  } else {
    x = 100;
    console.log(x);
    //          ^?
  }

  return x;
  //     ^?
}
```

## Using type predicates

We've worked with existing JavaScript constructs to handle narrowing so far, however sometimes you want more direct control over how types change throughout your code.

To define a user-defined type guard, we simply need to define a function whose return type is a _type predicate_:

```ts twoslash
type Fish = { swim: () => void };
type Bird = { fly: () => void };
declare function getSmallPet(): Fish | Bird;
// ---cut---
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}
```

`pet is Fish` is our type predicate in this example.
A predicate takes the form `parameterName is Type`, where `parameterName` must be the name of a parameter from the current function signature.

Any time `isFish` is called with some variable, TypeScript will _narrow_ that variable to that specific type if the original type is compatible.

```ts twoslash
type Fish = { swim: () => void };
type Bird = { fly: () => void };
declare function getSmallPet(): Fish | Bird;
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}
// ---cut---
// Both calls to 'swim' and 'fly' are now okay.
let pet = getSmallPet();

if (isFish(pet)) {
  pet.swim();
} else {
  pet.fly();
}
```

Notice that TypeScript not only knows that `pet` is a `Fish` in the `if` branch;
it also knows that in the `else` branch, you _don't_ have a `Fish`, so you must have a `Bird`.

You may use the type guard `isFish` to filter an array of `Fish | Bird` and obtain an array of `Fish`:

```ts twoslash
type Fish = { swim: () => void; name: string };
type Bird = { fly: () => void; name: string };
declare function getSmallPet(): Fish | Bird;
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}
// ---cut---
const zoo: (Fish | Bird)[] = [getSmallPet(), getSmallPet(), getSmallPet()];
const underWater1: Fish[] = zoo.filter(isFish);
// or, equivalently
const underWater2: Fish[] = zoo.filter(isFish) as Fish[];

// The predicate may need repeating for more complex examples
const underWater3: Fish[] = zoo.filter((pet): pet is Fish => {
  if (pet.name === "sharkey") return false;
  return isFish(pet);
});
```

In addition, classes can [use `this is Type`](/docs/handbook/2/classes.html#this-based-type-guards) to narrow their type.

# Discriminated unions

Most of the examples we've looked at so far have focused around narrowing single variables with simple types like `string`, `boolean`, and `number`.
While this is common, most of the time in JavaScript we'll be dealing with slightly more complex structures.

For some motivation, let's imagine we're trying to encode shapes like circles and squares.
Circles keep track of their radiuses and squares keep track of their side lengths.
We'll use a field called `kind` to tell which shape we're dealing with.
Here's a first attempt at defining `Shape`.

```ts twoslash
interface Shape {
  kind: "circle" | "square";
  radius?: number;
  sideLength?: number;
}
```

Notice we're using a union of string literal types: `"circle"` and `"square"` to tell us whether we should treat the shape as a circle or square respectively.
By using `"circle" | "square"` instead of `string`, we can avoid misspelling issues.

```ts twoslash
// @errors: 2367
interface Shape {
  kind: "circle" | "square";
  radius?: number;
  sideLength?: number;
}

// ---cut---
function handleShape(shape: Shape) {
  // oops!
  if (shape.kind === "rect") {
    // ...
  }
}
```

We can write a `getArea` function that applies the right logic based on if it's dealing with a circle or square.
We'll first try dealing with circles.

```ts twoslash
// @errors: 2532
interface Shape {
  kind: "circle" | "square";
  radius?: number;
  sideLength?: number;
}

// ---cut---
function getArea(shape: Shape) {
  return Math.PI * shape.radius ** 2;
}
```

<!-- TODO -->

Under [`strictNullChecks`](/tsconfig#strictNullChecks) that gives us an error - which is appropriate since `radius` might not be defined.
But what if we perform the appropriate checks on the `kind` property?

```ts twoslash
// @errors: 2532
interface Shape {
  kind: "circle" | "square";
  radius?: number;
  sideLength?: number;
}

// ---cut---
function getArea(shape: Shape) {
  if (shape.kind === "circle") {
    return Math.PI * shape.radius ** 2;
  }
}
```

Hmm, TypeScript still doesn't know what to do here.
We've hit a point where we know more about our values than the type checker does.
We could try to use a non-null assertion (a `!` after `shape.radius`) to say that `radius` is definitely present.

```ts twoslash
interface Shape {
  kind: "circle" | "square";
  radius?: number;
  sideLength?: number;
}

// ---cut---
function getArea(shape: Shape) {
  if (shape.kind === "circle") {
    return Math.PI * shape.radius! ** 2;
  }
}
```

But this doesn't feel ideal.
We had to shout a bit at the type-checker with those non-null assertions (`!`) to convince it that `shape.radius` was defined, but those assertions are error-prone if we start to move code around.
Additionally, outside of [`strictNullChecks`](/tsconfig#strictNullChecks) we're able to accidentally access any of those fields anyway (since optional properties are just assumed to always be present when reading them).
We can definitely do better.

The problem with this encoding of `Shape` is that the type-checker doesn't have any way to know whether or not `radius` or `sideLength` are present based on the `kind` property.
We need to communicate what _we_ know to the type checker.
With that in mind, let's take another swing at defining `Shape`.

```ts twoslash
interface Circle {
  kind: "circle";
  radius: number;
}

interface Square {
  kind: "square";
  sideLength: number;
}

type Shape = Circle | Square;
```

Here, we've properly separated `Shape` out into two types with different values for the `kind` property, but `radius` and `sideLength` are declared as required properties in their respective types.

Let's see what happens here when we try to access the `radius` of a `Shape`.

```ts twoslash
// @errors: 2339
interface Circle {
  kind: "circle";
  radius: number;
}

interface Square {
  kind: "square";
  sideLength: number;
}

type Shape = Circle | Square;

// ---cut---
function getArea(shape: Shape) {
  return Math.PI * shape.radius ** 2;
}
```

Like with our first definition of `Shape`, this is still an error.
When `radius` was optional, we got an error (with [`strictNullChecks`](/tsconfig#strictNullChecks) enabled) because TypeScript couldn't tell whether the property was present.
Now that `Shape` is a union, TypeScript is telling us that `shape` might be a `Square`, and `Square`s don't have `radius` defined on them!
Both interpretations are correct, but only the union encoding of `Shape` will cause an error regardless of how [`strictNullChecks`](/tsconfig#strictNullChecks) is configured.

But what if we tried checking the `kind` property again?

```ts twoslash
interface Circle {
  kind: "circle";
  radius: number;
}

interface Square {
  kind: "square";
  sideLength: number;
}

type Shape = Circle | Square;

// ---cut---
function getArea(shape: Shape) {
  if (shape.kind === "circle") {
    return Math.PI * shape.radius ** 2;
    //               ^?
  }
}
```

That got rid of the error!
When every type in a union contains a common property with literal types, TypeScript considers that to be a _discriminated union_, and can narrow out the members of the union.

In this case, `kind` was that common property (which is what's considered a _discriminant_ property of `Shape`).
Checking whether the `kind` property was `"circle"` got rid of every type in `Shape` that didn't have a `kind` property with the type `"circle"`.
That narrowed `shape` down to the type `Circle`.

The same checking works with `switch` statements as well.
Now we can try to write our complete `getArea` without any pesky `!` non-null assertions.

```ts twoslash
interface Circle {
  kind: "circle";
  radius: number;
}

interface Square {
  kind: "square";
  sideLength: number;
}

type Shape = Circle | Square;

// ---cut---
function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    //                 ^?
    case "square":
      return shape.sideLength ** 2;
    //       ^?
  }
}
```

The important thing here was the encoding of `Shape`.
Communicating the right information to TypeScript - that `Circle` and `Square` were really two separate types with specific `kind` fields - was crucial.
Doing that let us write type-safe TypeScript code that looks no different than the JavaScript we would've written otherwise.
From there, the type system was able to do the "right" thing and figure out the types in each branch of our `switch` statement.

> As an aside, try playing around with the above example and remove some of the return keywords.
> You'll see that type-checking can help avoid bugs when accidentally falling through different clauses in a `switch` statement.

Discriminated unions are useful for more than just talking about circles and squares.
They're good for representing any sort of messaging scheme in JavaScript, like when sending messages over the network (client/server communication), or encoding mutations in a state management framework.

# The `never` type

When narrowing, you can reduce the options of a union to a point where you have removed all possibilities and have nothing left.
In those cases, TypeScript will use a `never` type to represent a state which shouldn't exist.

# Exhaustiveness checking

The `never` type is assignable to every type; however, no type is assignable to `never` (except `never` itself). This means you can use narrowing and rely on `never` turning up to do exhaustive checking in a switch statement.

For example, adding a `default` to our `getArea` function which tries to assign the shape to `never` will raise when every possible case has not been handled.

```ts twoslash
interface Circle {
  kind: "circle";
  radius: number;
}

interface Square {
  kind: "square";
  sideLength: number;
}
// ---cut---
type Shape = Circle | Square;

function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.sideLength ** 2;
    default:
      const _exhaustiveCheck: never = shape;
      return _exhaustiveCheck;
  }
}
```

Adding a new member to the `Shape` union, will cause a TypeScript error:

```ts twoslash
// @errors: 2322
interface Circle {
  kind: "circle";
  radius: number;
}

interface Square {
  kind: "square";
  sideLength: number;
}
// ---cut---
interface Triangle {
  kind: "triangle";
  sideLength: number;
}

type Shape = Circle | Square | Triangle;

function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.sideLength ** 2;
    default:
      const _exhaustiveCheck: never = shape;
      return _exhaustiveCheck;
  }
}
```
