---
title: TypeScript pour les Développeurs Java/C#
short: TS pour les Développeurs Java/C#
layout: docs
permalink: /docs/handbook/typescript-in-5-minutes-oop.html
oneline: Apprenez TypeScript si vous avez un vécu avec les langages orientés objet
---

TypeScript est un choix populaire pour les développeurs habitués aux autres langages à typage statique, comme le C# et le Java.

Le système de types de TypeScript offre la plupart de ces bénéfices : meilleure complétion de code, détection d'erreurs plus précoce, communication plus claire entre les composantes de votre programme.
TypeScript fournit plusieurs fonctionnalités familières à ces développeurs, mais il est intéressant de prendre un pas en arrière et apprendre comment le JavaScript (et par conséquent, TypeScript) diffère des langages orientés objet traditionnels.
Comprendre ces différences vous permettra d'écrire du code JavaScript de meilleure qualité, et d'éviter les pièges communs dans lesquels les développeurs passant de C#/Java à TypeScript peuvent tomber.

## Apprendre le JavaScript

Si vous êtes déjà familier avec le JavaScript, mais vous êtes principalement un développeur Java ou C#, cette page d'introduction peut expliquer certaines idées fausses et pièges auxquels vous seriez susceptible.
Certaines façons avec lesquelles TypeScript modélise les types sont très différentes du Java ou du C#. Il est important de s'en souvenir en apprenant TypeScript.

Si vous êtes un développeur Java ou C#, et vous êtes nouveau à JavaScript en général, nous recommandons d'apprendre un peu de JavaScript _sans les types_ d'abord, afin de comprendre son comportement lors de l'exécution.
Vu que TypeScript ne change pas comment votre code _s'exécute_, vous devrez quand même apprendre le JavaScript pour écrire du code qui fait réellement quelque chose !

Il est important de se rappeler que TypeScript utilise le même _runtime_ que le JavaScript, donc toute ressource sur comment accomplir un comportement particulier (conversion d'un string à un nombre, affichage d'une alerte, écriture d'un fichier, etc.) s'appliquera également sur TypeScript.
Ne vous limitez pas à ce qui est spécifique à TypeScript !

## Repenser les classes

Le C# et le Java sont ce qu'on pourrait appeler des langages à _POO obligatoire_.
Dans ces langages, la _classe_ est l'unité basique d'organisation de code, ainsi que le conteneur de base de toutes les données _et_ de la logique à l'exécution.
Obliger toute la fonctionnalité et toutes les données à être contenues dans des classes peut être un bon modèle de domaine pour certains problèmes, mais pas tous les domaines _doivent_ être représentés de cette façon.

### Fonctions et données libres

En JavaScript, les fonctions peuvent être placées n'importe où, et les données peuvent être librement relayées sans être cantonnées à une `class` ou une `struct`.
Cette flexibilité est extrêmement puissante.
Ces fonctions "libres" (celles qui ne sont pas associées à une classe), qui travaillent sur des données sans hiérarchie orientée objet, ont tendance à être le modèle préféré pour écrire un programme en JavaScript.

### Classes statiques

De plus, certaines structures du C# et du Java, comme les singletons et les classes statiques, ne sont pas nécessaires en TypeScript.

## POO en TypeScript

Cela dit, vous pouvez quand même utiliser des classes si vous le souhaitez !
Certains problèmes ont une solution qui correspond à l'approche POO classique, et la capacité de TypeScript à supporter les classes JavaScript rendront ces solutions encore plus puissantes.
TypeScript supporte plusieurs patterns comme l'implémentation d'interfaces, l'héritage, et les méthodes statiques.

Nous couvrirons les classes plus tard dans ce guide.

## Repenser les types

La façon dont TypeScript comprend la notion de _type_ est très différente du C# et du Java.
Explorons certaines différences.

### Systèmes de Types Nominaux Réifiés

En C# ou Java, toute valeur a exactement un type - `null`, une primitive, ou un type de classe.
Nous pouvons appeler des méthodes comme `value.GetType()` ou `value.getClass()` pour obtenir le type exact à l'exécution.
La définition de ce type réside dans une certaine classe sous un certain nom, et nous n'avons pas le droit d'utiliser deux classes à formes similaires de façon interchangeable, sauf si une relation explicite d'héritage existe ou une interface en commun est implémentée.

Ces aspects décrivent un système de types _réifié et nominal_.
Les types qu'on écrit sont présents à l'exécution, et ils sont liés à eux via leurs déclarations, pas leurs structures.

### Types as Sets

En C# ou Java, cela fait sens de faire une correspondance entre un type à l'exécution et sa déclarations à la compilation.

En TypeScript, il vaut mieux de penser aux types comme des _ensembles de valeurs_ qui partagent quelque chose en commun.
Parce que les types ne sont que des ensembles, une valeur peut appartenir à  _plusieurs_ ensembles en même temps.

Une fois que vous pensez aux types en tant qu'ensembles, certaines opérations deviennent naturelles.
Par exemple, en C#, il est bizarre de transmettre une valeur qui est _soit_ un `string` ou `int`, parce qu'il n'existe aucun type les représentant tous les deux.

In TypeScript, ce procédé devient naturel quand vous pensez aux types en tant qu'ensembles.
Comment décrire une valeur qui appartient, soit à l'ensemble des `string`, soit à celui des `number` ?
Elle appartient simplement à l' _union_ de ces valeurs : `string | number`.

TypeScript provides a number of mechanisms to work with types in a set-theoretic way, and you'll find them more intuitive if you think of types as sets.

### Erased Structural Types

In TypeScript, objects are _not_ of a single exact type.
For example, if we construct an object that satisfies an interface, we can use that object where that interface is expected even though there was no declarative relationship between the two.

```ts twoslash
interface Pointlike {
  x: number;
  y: number;
}
interface Named {
  name: string;
}

function logPoint(point: Pointlike) {
  console.log("x = " + point.x + ", y = " + point.y);
}

function logName(x: Named) {
  console.log("Hello, " + x.name);
}

const obj = {
  x: 0,
  y: 0,
  name: "Origin",
};

logPoint(obj);
logName(obj);
```

TypeScript's type system is _structural_, not nominal: We can use `obj` as a `Pointlike` because it has `x` and `y` properties that are both numbers.
The relationships between types are determined by the properties they contain, not whether they were declared with some particular relationship.

TypeScript's type system is also _not reified_: There's nothing at runtime that will tell us that `obj` is `Pointlike`.
In fact, the `Pointlike` type is not present _in any form_ at runtime.

Going back to the idea of _types as sets_, we can think of `obj` as being a member of both the `Pointlike` set of values and the `Named` set of values.

### Consequences of Structural Typing

OOP programmers are often surprised by two particular aspects of structural typing.

#### Empty Types

The first is that the _empty type_ seems to defy expectation:

```ts twoslash
class Empty {}

function fn(arg: Empty) {
  // do something?
}

// No error, but this isn't an 'Empty' ?
fn({ k: 10 });
```

TypeScript determines if the call to `fn` here is valid by seeing if the provided argument is a valid `Empty`.
It does so by examining the _structure_ of `{ k: 10 }` and `class Empty { }`.
We can see that `{ k: 10 }` has _all_ of the properties that `Empty` does, because `Empty` has no properties.
Therefore, this is a valid call!

This may seem surprising, but it's ultimately a very similar relationship to one enforced in nominal OOP languages.
A subclass cannot _remove_ a property of its base class, because doing so would destroy the natural subtype relationship between the derived class and its base.
Structural type systems simply identify this relationship implicitly by describing subtypes in terms of having properties of compatible types.

#### Identical Types

Another frequent source of surprise comes with identical types:

```ts
class Car {
  drive() {
    // hit the gas
  }
}
class Golfer {
  drive() {
    // hit the ball far
  }
}

// No error?
let w: Car = new Golfer();
```

Again, this isn't an error because the _structures_ of these classes are the same.
While this may seem like a potential source of confusion, in practice, identical classes that shouldn't be related are not common.

We'll learn more about how classes relate to each other in the Classes chapter.

### Reflection

OOP programmers are accustomed to being able to query the type of any value, even a generic one:

```csharp
// C#
static void LogType<T>() {
    Console.WriteLine(typeof(T).Name);
}
```

Because TypeScript's type system is fully erased, information about e.g. the instantiation of a generic type parameter is not available at runtime.

JavaScript does have some limited primitives like `typeof` and `instanceof`, but remember that these operators are still working on the values as they exist in the type-erased output code.
For example, `typeof (new Car())` will be `"object"`, not `Car` or `"Car"`.

## Next Steps

This was a brief overview of the syntax and tools used in everyday TypeScript. From here, you can:

- Read the full Handbook [from start to finish](/docs/handbook/intro.html) (30m)
- Explore the [Playground examples](/play#show-examples)
