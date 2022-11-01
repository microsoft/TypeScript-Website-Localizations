---
title: Types Conditionnels
layout: docs
permalink: /docs/fr/handbook/2/conditional-types.html
oneline: "Créer des types qui agissent comme des déclarations if dans le système de typage."
---

Les programmes un tant soit utiles doivent se baser sur une entrée utilisateur.
Ce n'est pas plus différent en JavaScript, mais comme les valeurs peuvent être facilement examinées, ces décisions se basent également sur le type de ces valeurs.
Les _types conditionnels_ décrivent les relations entre les types en entrée et en sortie.

```ts twoslash
interface Animal {
  live(): void;
}
interface Dog extends Animal {
  woof(): void;
}

type Example1 = Dog extends Animal ? number : string;
//   ^?

type Example2 = RegExp extends Animal ? number : string;
//   ^?
```

Les types conditionnels prennent une forme similaire aux expressions ternaires (`condition ? trueExpression : falseExpression`) en JavaScript :

```ts twoslash
type SomeType = any;
type OtherType = any;
type TrueType = any;
type FalseType = any;
type Stuff =
  // ---cut---
  SomeType extends OtherType ? TrueType : FalseType;
```

Quand le type à gauche d'`extends` peut être assigné au type de droite, le résultat sera le type dans la première branche (la branche "vrai"); sinon ce sera le type dans la deuxième branche (la branche "false").

Ces exemples ne montrent pas forcément l'intérêt des conditions, vu qu'on peut voir si `Dog extends Animal` et décider entre `number` et `string` de nous-même.
Cet intérêt se manifeste surtout en utilisant les types génériques.

Considérons cette fonction `createLabel` :

```ts twoslash
interface IdLabel {
  id: number /* + d'autres champs */;
}
interface NameLabel {
  name: string /* + d'autres champs */;
}

function createLabel(id: number): IdLabel;
function createLabel(name: string): NameLabel;
function createLabel(nameOrId: string | number): IdLabel | NameLabel;
function createLabel(nameOrId: string | number): IdLabel | NameLabel {
  throw "unimplemented";
}
```

Ces surcharges de createLabel décrivent une seule fonction JavaScript qui fait des choix en fonction du type de son entrée. Notez, cependant, quelques problèmes :

1. Si une librairie doit faire à chaque fois plusieurs choix à travers son API, toutes ces surcharges peuvent vite polluer le code.
2. Trois surcharges doivent être créées : une pour chaque cas où vous êtes _sûrs et certains_ du type de votre valeur (un cas pour `string`, un pour `number`), et une surcharge plus générale (`string | number`). Pour chaque nouveau type que `createLabel` peut gérer, le nombre de surcharges croît exponentiellement.

À la place, nous pouvons décrire cette logique avec un type conditionnel :

```ts twoslash
interface IdLabel {
  id: number /* + d'autres champs */;
}
interface NameLabel {
  name: string /* + d'autres champs */;
}
// ---cut---
type NameOrId<T extends number | string> = T extends number
  ? IdLabel
  : NameLabel;
```

Nous pouvons ensuite utiliser les types conditionnels pour éliminer les surcharges et simplifier la signature de la fonction.

```ts twoslash
interface IdLabel {
  id: number /* + d'autres champs */;
}
interface NameLabel {
  name: string /* + d'autres champs */;
}
type NameOrId<T extends number | string> = T extends number
  ? IdLabel
  : NameLabel;
// ---cut---
function createLabel<T extends number | string>(idOrName: T): NameOrId<T> {
  throw "unimplemented";
}

let a = createLabel("typescript");
//  ^?

let b = createLabel(2.8);
//  ^?

let c = createLabel(Math.random() ? "bonjour" : 42);
//  ^?
```

### Contraintes de Types Conditionnels

Les vérifications sur des types conditionnels vont souvent révéler de nouvelles informations.
Tout comme rétrécir avec des gardes de types peut donner un type plus spécifique, la branche "vrai" du type conditionnel va restreindre le type générique qu'on vérifie avec la contrainte demandée.

Prenons cet exemple :

```ts twoslash
// @errors: 2536
type MessageOf<T> = T["message"];
```

TypeScript signale une erreur parce que `T` n'aura pas forcément une propriété `message`.
Il serait possible de contraindre `T`, et TypeScript ne donnera plus d'erreur :

```ts twoslash
type MessageOf<T extends { message: unknown }> = T["message"];

interface Email {
  message: string;
}

type EmailMessageContents = MessageOf<Email>;
//   ^?
```

Mais si on voulait que `MessageOf` prenne tout, mais soit égal à `never` s'il n'y a pas de propriété `message` ?
Nous pouvons déplacer la contrainte et introduire un type conditionnel :

```ts twoslash
type MessageOf<T> = T extends { message: unknown } ? T["message"] : never;

interface Email {
  message: string;
}

interface Dog {
  bark(): void;
}

type EmailMessageContents = MessageOf<Email>;
//   ^?

type DogMessageContents = MessageOf<Dog>;
//   ^?
```

Dans la branche "vrai", TypeScript sait que `T` _va_ avoir une propriété `message`.

Dans un tout autre exemple, nous pouvons aussi écrire un type `Flatten` qui aplatit les tableaux en récupérant les types de leurs contenus, mais laisse les types tels quels sinon :

```ts twoslash
type Flatten<T> = T extends any[] ? T[number] : T;

// Extraction du type des éléments de tableau
type Str = Flatten<string[]>;
//   ^?

// Laisse le type tranquille.
type Num = Flatten<number>;
//   ^?
```

Quand `Flatten` reçoit un type tableau, il utilise un accès indexé avec `number` pour récupérer le type des éléments de `string[]`.
Sinon, il retourne simplement le type qui lui a été donné.

### Inférence dans les Types Conditionnels

Nous avons utilisé des types conditionnels pour appliquer des contraintes et extraire des types.
Cette opération devient très facile avec ces types, qu'elle est devenue très commune.

Les types conditionnels fournissent une façon d'inférer depuis les types qu'on compare avec le mot-clé `infer`.
Par exemple, on pouvait inférer le type d'éléments de tableaux dans `Flatten` au lieu de le récupérer "manuellement" :

```ts twoslash
type Flatten<Type> = Type extends Array<infer Item> ? Item : Type;
```

Ici, le mot-clé `infer` introduit un nouveau type générique variable appelé `Item`, au lieu de préciser comment récupérer le type élément de `T` dans la branche vrai.
Cela nous libère de devoir penser à la façon de creuser et obtenir manuellement les types qui nous intéressent.

We can write some useful helper type aliases using the `infer` keyword.
For example, for simple cases, we can extract the return type out from function types:

```ts twoslash
type GetReturnType<Type> = Type extends (...args: never[]) => infer Return
  ? Return
  : never;

type Num = GetReturnType<() => number>;
//   ^?

type Str = GetReturnType<(x: string) => string>;
//   ^?

type Bools = GetReturnType<(a: boolean, b: boolean) => boolean[]>;
//   ^?
```

When inferring from a type with multiple call signatures (such as the type of an overloaded function), inferences are made from the _last_ signature (which, presumably, is the most permissive catch-all case). It is not possible to perform overload resolution based on a list of argument types.

```ts twoslash
declare function stringOrNum(x: string): number;
declare function stringOrNum(x: number): string;
declare function stringOrNum(x: string | number): string | number;

type T1 = ReturnType<typeof stringOrNum>;
//   ^?
```

## Distributive Conditional Types

When conditional types act on a generic type, they become _distributive_ when given a union type.
For example, take the following:

```ts twoslash
type ToArray<Type> = Type extends any ? Type[] : never;
```

If we plug a union type into `ToArray`, then the conditional type will be applied to each member of that union.

```ts twoslash
type ToArray<Type> = Type extends any ? Type[] : never;

type StrArrOrNumArr = ToArray<string | number>;
//   ^?
```

What happens here is that `StrArrOrNumArr ` distributes on:

```ts twoslash
type StrArrOrNumArr =
  // ---cut---
  string | number;
```

and maps over each member type of the union, to what is effectively:

```ts twoslash
type ToArray<Type> = Type extends any ? Type[] : never;
type StrArrOrNumArr =
  // ---cut---
  ToArray<string> | ToArray<number>;
```

which leaves us with:

```ts twoslash
type StrArrOrNumArr =
  // ---cut---
  string[] | number[];
```

Typically, distributivity is the desired behavior.
To avoid that behavior, you can surround each side of the `extends` keyword with square brackets.

```ts twoslash
type ToArrayNonDist<Type> = [Type] extends [any] ? Type[] : never;

// 'StrArrOrNumArr' is no longer a union.
type StrArrOrNumArr = ToArrayNonDist<string | number>;
//   ^?
```
