---
title: Classes
layout: docs
permalink: /docs/handbook/2/classes.html
oneline: "Comment fonctionnent les classes en TypeScript"
---

<blockquote class='bg-reading'>
  <p>Lecture de fond :<br /><a href='https://developer.mozilla.org/fr-FR/docs/Web/JavaScript/Reference/Classes'>Classes (MDN)</a></p>
</blockquote>

TypeScript offre un support entier pour le mot-clé `class` introduit avec ES2015.

Tout comme les autres fonctionnalités JavaScript, TypeScript ajoute les annotations de type et autres éléments de syntaxe pour vous permettre d'exprimer les relations entre les classes et les autres types.

## Membres de classe

Voici une classe vide, la plus basique qui soit :

```ts twoslash
class Point {}
```

Cette classe n'est pas très utile, donc il va falloir ajouter quelques champs.

### Champs

Une déclaration de champ crée une propriété écrivable et publique dans la classe :

```ts twoslash
// @strictPropertyInitialization: false
class Point {
  x: number;
  y: number;
}

const pt = new Point();
pt.x = 0;
pt.y = 0;
```

Tout comme à d'autres endroits, l'annotation de type est optionnelle, mais sera `any` par défaut.

Les champs peuvent aussi être initialisés automatiquement, dès que la classe est instanciée :

```ts twoslash
class Point {
  x = 0;
  y = 0;
}

const pt = new Point();
// Prints 0, 0
console.log(`${pt.x}, ${pt.y}`);
```

Tout comme avec `const`, `let`, et `var`, l'initialisateur d'une propriété de classe va être utilisé pour inférer le type de la propriété:

```ts twoslash
// @errors: 2322
class Point {
  x = 0;
  y = 0;
}
// ---cut---
const pt = new Point();
pt.x = "0";
```

#### `--strictPropertyInitialization`

L'option [`strictPropertyInitialization`](/tsconfig#strictPropertyInitialization) permet de s'assurer que les champs de la classe sont initialisés dans le constructeur.

```ts twoslash
// @errors: 2564
class BadGreeter {
  name: string;
}
```

```ts twoslash
class GoodGreeter {
  name: string;

  constructor() {
    this.name = "hello";
  }
}
```

Remarquez que le champ doit être initialisé _dans le constructeur lui-même_.
TypeScript n'analyse pas les méthodes que vous appelez dans le constructeur pour détecter les initialisations, parce qu'une classe dérivée pourrait surcharger ces méthodes et, par conséquent, ne pas initialiser ces champs.

Si vous voulez exprimer que le champ sera _certainement_ initialisé, mais d'une façon différente qu'avec le constructeur (par exemple, une librairie externe qui remplit votre classe en partie), vous pouvez utiliser _l'opérateur d'assertion garantie d'assignation_, `!`:

```ts twoslash
class OKGreeter {
  // Not initialized, but no error
  name!: string;
}
```

### `readonly`

Un champ peut être préfixé avec le modificateur `readonly`.
Cela permet d'empêcher les assignations en dehors du constructeur.

```ts twoslash
// @errors: 2540 2540
class Greeter {
  readonly name: string = "world";

  constructor(otherName?: string) {
    if (otherName !== undefined) {
      this.name = otherName;
    }
  }

  err() {
    this.name = "not ok";
  }
}
const g = new Greeter();
g.name = "also not ok";
```

### Constructeurs

<blockquote class='bg-reading'>
   <p>Lecture de fond :<br />
   <a href='https://developer.mozilla.org/fr-FR/docs/Web/JavaScript/Reference/Classes/constructor'>Constructeur (MDN)</a><br/>
   </p>
</blockquote>

Les constructeurs de classes sont très similaires aux fonctions.
Vous pouvez ajouter des paramètres avec des annotations de type, des valeurs par défaut, ainsi que des surcharges :

```ts twoslash
class Point {
  x: number;
  y: number;

  // Normal signature with defaults
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
}
```

```ts twoslash
class Point {
  // Overloads
  constructor(x: number, y: string);
  constructor(s: string);
  constructor(xs: any, y?: any) {
    // TBD
  }
}
```

Il y a quelques différences entre une signature de constructeur et une signature de fonction classique :

- Un constructeur ne peut pas avoir de paramètre de type - ce dernier appartient à la déclaration externe de classe, qu'on apprendra plus tard.
- Un constructeur ne peut pas retourner autre chose que le type de l'instance de classe.

#### Appels de Super

Comme en JavaScript, si vous héritez d'une classe, vous devez appeler `super();` dans votre constructeur avant tout usage de membres de `this.`:

```ts twoslash
// @errors: 17009
class Base {
  k = 4;
}

class Derived extends Base {
  constructor() {
    // Prints a wrong value in ES5; throws exception in ES6
    console.log(this.k);
    super();
  }
}
```

Oublier d'appeler `super` est une erreur courante en JavaScript, mais TypeScript vous en informera si nécessaire.

### Méthodes

<blockquote class='bg-reading'>
   <p>Lecture de fond :<br />
   <a href='https://developer.mozilla.org/fr-FR/docs/Web/JavaScript/Reference/Functions/Method_definitions'>Définir une méthode</a><br/>
   </p>
</blockquote>

Une propriété de classe qui est une fonction est appelée une _méthode_.
Les méthodes peuvent se servir des mêmes annotations de type que les fonctions et les constructeurs :

```ts twoslash
class Point {
  x = 10;
  y = 10;

  scale(n: number): void {
    this.x *= n;
    this.y *= n;
  }
}
```

En dehors des annotations normales de type, TypeScript n'ajoute rien d'autre aux méthodes.

Remarquez qu'à l'intérieur de la méthode, il est toujours obligatoire de préfixer d'autres méthodes et propriétés avec `this.`.
Un nom de variable non initialisé dans une méthode va toujours se référer à la variable correspondante dans la portée qui l'englobe :

```ts twoslash
// @errors: 2322
let x: number = 0;

class C {
  x: string = "hello";

  m() {
    // This is trying to modify 'x' from line 1, not the class property
    x = "world";
  }
}
```

### Accesseurs / Mutateurs

Les classes peuvent aussi avoir des _accesseurs_:

```ts twoslash
class C {
  _length = 0;
  get length() {
    return this._length;
  }
  set length(value) {
    this._length = value;
  }
}
```

> Notez qu'une paire accesseur/mutateur sans logique supplémentaire est très rarement utile en JavaScript.
> Vous pouvez exposer une propriété publique si le mutateur et l'accesseur n'auront aucune logique associée.

TypeScript a des règles spéciales d'inférence pour les accesseurs :

- Si `get` existe mais pas `set`, la propriété est automatiquement `readonly`
- Si le type de retour du mutateur n'est pas spécifié, il sera inféré de ce que retourne l'accesseur
- Le mutateur et l'accesseur doivent avoir la même [Visibilité de Membres](#visibilité-de-membres)

Depuis [TypeScript 4.3](https://devblogs.microsoft.com/typescript/announcing-typescript-4-3/), il est possible d'avoir des types différents pour une paire d'accesseur et mutateur.

```ts twoslash
class Thing {
  _size = 0;

  get size(): number {
    return this._size;
  }

  set size(value: string | number | boolean) {
    let num = Number(value);

    // Don't allow NaN, Infinity, etc

    if (!Number.isFinite(num)) {
      this._size = 0;
      return;
    }

    this._size = num;
  }
}
```

### Signatures d'Index

Les classes peuvent déclarer des signatures d'index; elles fonctionnent de la même manière que les [Signatures d'Index pour les types objet](/docs/handbook/2/objects.html#index-signatures):

```ts twoslash
class MyClass {
  [s: string]: boolean | ((s: string) => boolean);

  check(s: string) {
    return this[s] as boolean;
  }
}
```

Il n'est pas aisé d'utiliser ces types de façon productive, parce que les signatures d'index doivent aussi définir les types de retour des méthodes indexées.
Généralement, il vaut mieux stocker les données indexées autre part que sur l'instance de classe elle-même.

## Héritage

Tout comme les autres langages avec des fonctionnalités orientées objet, les classes JavaScript peuvent hériter de classes parentes.

### Clauses `implements`

Vous pouvez utiliser une clause `implements` pour vérifier qu'une classe respecte une certaine `interface`.
Dans le cas contraire, une erreur sera lancée :

```ts twoslash
// @errors: 2420
interface Pingable {
  ping(): void;
}

class Sonar implements Pingable {
  ping() {
    console.log("ping!");
  }
}

class Ball implements Pingable {
  pong() {
    console.log("pong!");
  }
}
```

Les classes peuvent implémenter plusieurs interfaces (par exemple, `class C implements A, B {`).

#### Important

Il est important de comprendre que la clause `implements` n'est qu'une vérification si la classe peut se substituer à l'interface implémentée.
La clause ne modifie _pas du tout_ la classe, ni son type, ni ses méthodes. Une erreur commune est de supposer le contraire.

```ts twoslash
// @errors: 7006
interface Checkable {
  check(name: string): boolean;
}

class NameChecker implements Checkable {
  check(s) {
    // Pas d'erreur ici, le type de s étant "any"
    return s.toLowercse() === "ok";
    //         ^?
  }
}
```

Dans cet exemple, on pourrait s'attendre à ce que le type de `s` puisse être influencé par le paramètre `name: string` de `check`.
Ce n'est pas le cas - la clause `implements` ne change ni la façon de vérifier le corps de la classe, ni la façon d'inférer son type.

De façon similaire, implémenter une interface avec une propriété optionnelle ne crée pas cette propriété :

```ts twoslash
// @errors: 2339
interface A {
  x: number;
  y?: number;
}
class C implements A {
  x = 0;
}
const c = new C();
c.y = 10;
```

### Clauses `extends`

<blockquote class='bg-reading'>
   <p>Lecture de fond :<br />
   <a href='https://developer.mozilla.org/fr-FR/docs/Web/JavaScript/Reference/Classes/extends'>mot-clé extends(MDN)</a><br/>
   </p>
</blockquote>

Une classe peut `extend` d'une classe-mère, et devient une classe dérivée.
Une classe dérivée reçoit toutes ses méthodes et propriétés de la classe-mère. Il est également possible de définir des membres additionnels.

```ts twoslash
class Animal {
  move() {
    console.log("On bouge !");
  }
}

class Dog extends Animal {
  woof(times: number) {
    for (let i = 0; i < times; i++) {
      console.log("wouaf !");
    }
  }
}

const d = new Dog();
// Base class method
d.move();
// Derived class method
d.woof(3);
```

#### Surchargement de méthodes

<blockquote class='bg-reading'>
   <p>Lecture de fond:<br />
   <a href='https://developer.mozilla.org/fr-FR/docs/Web/JavaScript/Reference/Operators/super'>mot-clé super (MDN)</a><br/>
   </p>
</blockquote>

Une classe dérivée peut aussi écraser une propriété ou une méthode pré-existantes.
Les méthodes de la classe-mère sont accessibles avec le mot-clé `super`.
Notez que, vu que les classes JavaScript ne sont que des objets, il n'y a pas de "champ super" qui donnerait une référence vers la classe-mère.

TypeScript impose que la classe dérivée soit un sous-type de la classe-mère.

Par exemple, voici une façon légale de surcharger une méthode :

```ts twoslash
class Base {
  greet() {
    console.log("Hello, world!");
  }
}

class Derived extends Base {
  greet(name?: string) {
    if (name === undefined) {
      super.greet();
    } else {
      console.log(`Bonjour, ${name.toUpperCase()}`);
    }
  }
}

const d = new Derived();
d.greet();
d.greet("lecteur / lectrice");
```

Il est important que la classe dérivée suive le contrat imposé par sa classe-mère.
Rappelez-vous qu'il est très commun (et toujours légal) d'instancier une classe dérivée tout en référençant une classe-mère :

```ts twoslash
class Base {
  greet() {
    console.log("Hello, world!");
  }
}
declare const d: Base;
// ---cut---
// Alias the derived instance through a base class reference
const b: Base = d;
// No problem
b.greet();
```

Et si `Derived` ne suivait pas le contrat de `Base` ?

```ts twoslash
// @errors: 2416
class Base {
  greet() {
    console.log("Hello, world!");
  }
}

class Derived extends Base {
  // Make this parameter required
  greet(name: string) {
    console.log(`Bonjour, ${name.toUpperCase()}`);
  }
}
```

Si on compile le code malgré l'erreur et qu'on le lance, il va simplement provoquer une erreur :

```ts twoslash
declare class Base {
  greet(): void;
}
declare class Derived extends Base {}
// ---cut---
const b: Base = new Derived();
// Crashes because "name" will be undefined
b.greet();
```

#### Champs déclarés exclusivement avec un type

Si `target` est plus grand ou est égal à `ES2022` ou [`useDefineForClassFields`](/tsconfig#useDefineForClassFields) vaut `true`, les champs de classes dérivées sont créés après la classe-mère, ce qui effacera toute valeur définie par cette classe-mère. Cela peut poser problème quand tout ce que vous souhaitez faire est de déclarer un type plus précis d'un champ hérité. Pour gérer ces cas d'usage, utilisez le mot-clé `declare` pour indiquer à TypeScript que vous souhaitez uniquement typer le champ, sans lui assigner quoi que ce soit.

```ts twoslash
interface Animal {
  dateOfBirth: any;
}

interface Dog extends Animal {
  breed: any;
}

class AnimalHouse {
  resident: Animal;
  constructor(animal: Animal) {
    this.resident = animal;
  }
}

class DogHouse extends AnimalHouse {
  // Le "declare" n'émettra pas de code JavaScript,
  // il s'assurera uniquement que le type de "resident" est correct
  declare resident: Dog;
  constructor(dog: Dog) {
    super(dog);
  }
}
```

#### Ordre d'initialisation

L'ordre d'initialisation des classes JavaScript peut surprendre dans certains cas.
Considérons ce code :

```ts twoslash
class Base {
  name = "base";
  constructor() {
    console.log("Mon nom est " + this.name);
  }
}

class Derived extends Base {
  name = "derived";
}

// Affiche "base", et pas "derived"
const d = new Derived();
```

Qu'est-ce qui s'est passé ?

Tel que défini par JavaScript, voici l'ordre d'initialisation de classes :

- Les champs de la classe-mère sont initialisés
- Le constructeur de la classe-mère est lancé
- Les champs des classes dérivées sont initialisés
- Les constructeurs des classes dérivées sont lancés

Cela signifie que la classe-mère a d'abord appliqué sa propre valeur de `name`, parce que le constructeur de la classe dérivée ne s'est pas encore lancé.

#### Héritage de classes intégrées

> Note : Si vous ne comptez pas hériter de classes fournies par JavaScript, tel `Array`, `Error`, `Map`, etc. ou votre cible de compilation est une version supérieure ou égale à `ES6`/`ES2015`, vous pouvez passer cette section.

Dans ES2015, les constructeurs qui retournent un objet remplacent implicitement toute référence de `this` par toute classe appelant `super(...)`.
Il est nécessaire que le code qui génère le constructeur capture toute valeur retournée par `super(...)` et la remplace par `this`.

De ce fait, il se peut que créer une sous-classe d'`Error` ou d'`Array` ne fonctionne plus comme prévu.
La raison est que les constructeurs d'`Error`, `Array`, etc. utilisent la propriété fournie par ES2015, `new.target`, pour ajuster la chaîne de prototypes. Les versions qui précèdent ES6 ne fournissent aucun moyen de fournir de valeur pour `new.target`.
Les autres compilateurs qui nivellent par le bas ont généralement des limites similaires.

Pour une classe dérivée, comme dans cet exemple :

```ts twoslash
class MsgError extends Error {
  constructor(m: string) {
    super(m);
  }
  sayHello() {
    return "bonjour " + this.message;
  }
}
```

vous remarquerez peut-être que :

- les méthodes pourraient être `undefined` dans les objets retournés par ces classes dérivées, donc appeler `sayHello` va provoquer une erreur.
- `instanceof` n'agira pas correctement entre les sous-classes et leurs classes-mères, donc `(new MsgError()) instanceof MsgError` retournera `false`.

Nous vous recommandons d'ajuster manuellement le prototype immédiatement après tout appel de `super(...)`.

```ts twoslash
class MsgError extends Error {
  constructor(m: string) {
    super(m);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, MsgError.prototype);
  }

  sayHello() {
    return "hello " + this.message;
  }
}
```

Cependant, toute sous-classe de `MsgError` va devoir elle aussi réparer manuellement son propre prototype après `super`.
Les moteurs qui ne supportent pas [`Object.setPrototypeOf`](https://developer.mozilla.org/fr-FR/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf), fournissent la propriété [`__proto__`](https://developer.mozilla.org/fr-FR/docs/Web/JavaScript/Reference/Global_Objects/Object/proto) comme alternative.

Malheureusement, toutes ces solutions de contournement, [ne fonctionneront pas sur Internet Explorer 10 et antérieur](<https://msdn.microsoft.com/en-us/library/s4esdbwz(v=vs.94).aspx>).
Vous pouvez copier manuellement les propriétés du prototype vers l'instance (par ex. `MsgError.prototype` dans `this`), mais la chaîne de prototypes elle-même ne pourra pas être réparée.

## Visibilité de Membres

Vous pouvez utiliser TypeScript pour contrôler l'exposition de méthodes et propriétés de la classe vers le code qui lui est externe.

### `public`

La visibilité par défaut de tout membre de classe est `public`.
Il est possible d'accéder à un membre `public` partout :

```ts twoslash
class Greeter {
  public greet() {
    console.log("salut !");
  }
}
const g = new Greeter();
g.greet();
```

Parce que `public` est déjà la visibilité par défaut, vous _n'avez pas besoin_ de le préciser pour un membre de classe, mais vous pourriez toujours le faire pour des raisons de lisibilité / style de code.

### `protected`

Les membres `protected` ne sont visibles que dans la classe qui les a déclarés.

```ts twoslash
// @errors: 2445
class Greeter {
  public greet() {
    console.log("Bonjour, " + this.getName());
  }
  protected getName() {
    return "hi";
  }
}

class SpecialGreeter extends Greeter {
  public howdy() {
    // On peut accéder à this.getName ici
    console.log("Yo, " + this.getName());
    //                   ^^^^^^^^^^^^^^
  }
}
const g = new SpecialGreeter();
g.greet(); // OK
g.getName();
```

#### Exposition des membres `protected`

Les classes dérivées doivent suivre les contrats de leurs classes de base, mais peuvent exposer un sous-type qui a plus de possibilités qu'une classe-mère.
Ainsi, il est possible de donner une visibilité `public` à des membres `protected` à l'origine :

```ts twoslash
class Base {
  protected m = 10;
}
class Derived extends Base {
  // Pas de modificateur, le "public" par défaut s'applique
  m = 15;
}
const d = new Derived();
console.log(d.m); // OK
```

Remarquez que `Derived` est quand même capable de lire et d'écrire `m`, donc protéger `m` n'aura servi à rien.
Si vous voulez rendre la propriété `protected` dans la classe dérivée également, vous devrez répéter le mot-clé `protected`.

#### Accès aux membres `protected` entre classes mères et dérivées

Les langages OOP différents ne s'accordent pas si un membre qui est `protected` est toujours accessible aux classes dérivées :

```ts twoslash
// @errors: 2446
class Base {
  protected x: number = 1;
}
class Derived1 extends Base {
  protected x: number = 5;
}
class Derived2 extends Base {
  f1(other: Derived2) {
    other.x = 10;
  }
  f2(other: Base) {
    other.x = 10;
  }
}
```

Java considère cette manipulation légale, au contraire du C++ et du C#.

TypeScript se range du côté du C# et C++ dans ce débat. Accéder à `x` dans `Derived2` doit être légal uniquement à partir de sous-classes de `Derived2`, ce qui n'est pas le cas de `Derived1`.
De plus, si l'accès à `x` à travers une `Derived1` est illégal pour des raisons évidentes, alors tenter d'y accéder à travers `Base` ne doit rien y changer.

Voir aussi [Why Can’t I Access A Protected Member From A Derived Class?](https://blogs.msdn.microsoft.com/ericlippert/2005/11/09/why-cant-i-access-a-protected-member-from-a-derived-class/) qui explique le raisonnement derrière cette interdiction en C#.

### `private`

`private` ressemble à `protected`, mais interdit tout accès à la propriété depuis autre chose que la classe elle-même (cela exclut donc les classes dérivées):

```ts twoslash
// @errors: 2341
class Base {
  private x = 0;
}
const b = new Base();
// Can't access from outside the class
console.log(b.x);
```

```ts twoslash
// @errors: 2341
class Base {
  private x = 0;
}
// ---cut---
class Derived extends Base {
  showX() {
    // Can't access in subclasses
    console.log(this.x);
  }
}
```

Une classe dérivée ne peut pas modifier la visibilité d'un membre `private`, vu qu'elle ne le voit même pas :

```ts twoslash
// @errors: 2415
class Base {
  private x = 0;
}
class Derived extends Base {
  x = 1;
}
```

#### Accès à un membre `private` entre différentes instances

Les langages OOP différents ne s'accordent pas si les instances d'une même classe peuvent accéder à leurs membres privés respectifs.
Java, C#, C++, Swift, et PHP le permettent, Ruby l'interdit.

TypeScript le permet :

```ts twoslash
class A {
  private x = 10;

  public sameAs(other: A) {
    // No error
    return other.x === this.x;
  }
}
```

#### Considérations

Comme d'autres aspects de TypeScript, `private` et `protected` [sont uniquement imposés pendant la compilation](https://www.typescriptlang.org/play?removeComments=true&target=99&ts=4.3.4#code/PTAEGMBsEMGddAEQPYHNQBMCmVoCcsEAHPASwDdoAXLUAM1K0gwQFdZSA7dAKWkoDK4MkSoByBAGJQJLAwAeAWABQIUH0HDSoiTLKUaoUggAW+DHorUsAOlABJcQlhUy4KpACeoLJzrI8cCwMGxU1ABVPIiwhESpMZEJQTmR4lxFQaQxWMm4IZABbIlIYKlJkTlDlXHgkNFAAbxVQTIAjfABrAEEC5FZOeIBeUAAGAG5mmSw8WAroSFIqb2GAIjMiIk8VieVJ8Ar01ncAgAoASkaAXxVr3dUwGoQAYWpMHBgCYn1rekZmNg4eUi0Vi2icoBWJCsNBWoA6WE8AHcAiEwmBgTEtDovtDaMZQLM6PEoQZbA5wSk0q5SO4vD4-AEghZoJwLGYEIRwNBoqAzFRwCZCFUIlFMXECdSiAhId8YZgclx0PsiiVqOVOAAaUAFLAsxWgKiC35MFigfC0FKgSAVVDTSyk+W5dB4fplHVVR6gF7xJrKFotEk-HXIRE9PoDUDDcaTAPTWaceaLZYQlmoPBbHYx-KcQ7HPDnK43FQqfY5+IMDDISPJLCIuqoc47UsuUCofAME3Vzi1r3URvF5QV5A2STtPDdXqunZDgDaYlHnTDrrEAF0dm28B3mDZg6HJwN1+2-hg57ulwNV2NQGoZbjYfNrYiENBwEFaojFiZQK08C-4fFKTVCozWfTgfFgLkeT5AUqiAA).

Cela signifie que des expressions JavaScript `in` ou une simple lecture de propriétés peuvent accéder à un membre `private` ou `protected` :

```ts twoslash
class MySafe {
  private secretKey = 12345;
}
```

```js
// Dans un fichier JavaScript, va afficher 12345
const s = new MySafe();
console.log(s.secretKey);
```

`private` permet également d'accéder à la propriété avec la notation à crochets. Cela permet de faciliter l'accès aux propriétés `private` pour, par exemple, les tests unitaires. Le défaut dans cette approche est que ces propriétés ne sont donc pas complètement `private`.

```ts twoslash
// @errors: 2341
class MySafe {
  private secretKey = 12345;
}

const s = new MySafe();

// Interdit durant la vérification
console.log(s.secretKey);

// OK
console.log(s["secretKey"]);
```

Les [variables de classes privées](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields) (`#`) resteront privées après compilation et représentent une approche plus stricte aux champs privés, interdisant les contournements disponibles avec le mot-clé `private`.

```ts twoslash
class Dog {
  #barkAmount = 0;
  personality = "happy";

  constructor() {}
}
```

```ts twoslash
// @target: esnext
// @showEmit
class Dog {
  #barkAmount = 0;
  personality = "happy";

  constructor() {}
}
```

En compilant vers ES2021 ou inférieur, TypeScript va utiliser des `WeakMaps` à la place de `#`.

```ts twoslash
// @target: es2015
// @showEmit
class Dog {
  #barkAmount = 0;
  personality = "happy";

  constructor() {}
}
```

Si vous avez besoin de protéger vos valeurs de classes contre les acteurs malicieux, vous devez vous servir de mécanismes offrant de la sécurité stricte durant l'exécution, tel que les _closures_, _WeakMaps_, ou les champs privés. Remarquez que ces mesures additionnelles peuvent affecter la performance.

## Membres statiques

<blockquote class='bg-reading'>
   <p>Lecture de fond :<br />
   <a href='https://developer.mozilla.org/fr-FR/docs/Web/JavaScript/Reference/Classes/static'>Membres statiques (MDN)</a><br/>
   </p>
</blockquote>

Les Classes peuvent avoir des membres `static`.
Ces membres ne sont pas associés à une instance particulière d'une classe, et peuvent être lus depuis le constructeur de la classe elle-même :

```ts twoslash
class MyClass {
  static x = 0;
  static printX() {
    console.log(MyClass.x);
  }
}
console.log(MyClass.x);
MyClass.printX();
```

Les membres `static` peuvent avoir les mêmes modificateurs `public`, `protected`, et `private` :

```ts twoslash
// @errors: 2341
class MyClass {
  private static x = 0;
}
console.log(MyClass.x);
```

Les membres `static` peuvent être hérités par les classes dérivées :

```ts twoslash
class Base {
  static getGreeting() {
    return "Hello world";
  }
}
class Derived extends Base {
  myGreeting = Derived.getGreeting();
}
```

### Noms spéciaux de propriétés statiques

Généralement, il n'est pas sûr / possible d'écrire sur des propriétés du prototype de `Function`.
Les classes sont elles-mêmes des fonctions qui peuvent être invoquées avec `new`. Donc certaines propriétés `static` ne peuvent pas être utilisées.
Les propriétés `name`, `length`, et `call` ne peuvent pas être définies en tant que membres `static` :

```ts twoslash
// @errors: 2699
class S {
  static name = "S!";
}
```

### Pourquoi pas des classes statiques ?

TypeScript (et JavaScript) n'ont pas de classes statiques, de la même façon que, par exemple, C#.

Ces structures n'existent que parce que ces langages obligent toutes les données et fonctions à être à l'intérieur de classes. Elles n'ont aucun intérêt à être dans TypeScript ou JavaScript, ces deux langages n'ayant pas cette restriction. Une classe qui n'a qu'une seule instance est parfois représentée simplement par un objet normal.

Une classe statique n'est pas nécessaire car elle peut très bien se substituer à un objet ou une fonction :

```ts twoslash
// Classe statique non nécessaire
class MyStaticClass {
  static doSomething() {}
}

// 1ère alternative privilégiée
function doSomething() {}

// 2ème alternative privilégiée
const MyHelperObject = {
  dosomething() {},
};
```

## Blocs `static` dans une classe

Les blocs statiques vous permettent d'écrire des déclarations avec leur propre portée. Cette portée peut lire les champs privés dans la classe qui les contient. Cela signifie que l'on peut écrire ce qu'on veut en terme de code, sans fuite de variables vers l'extérieur, et avec accès complet aux propriétés et méthodes de la classe.

```ts twoslash
declare function loadLastInstances(): any[]
// ---cut---
class Foo {
    static #count = 0;

    get count() {
        return Foo.#count;
    }

    static {
        try {
            const lastInstances = loadLastInstances();
            Foo.#count += lastInstances.length;
        }
        catch {}
    }
}
```

## Classes Génériques

Les classes, au même titre des interfaces, peuvent être génériques.
Quand une classe est instanciée avec `new`, ses paramètres de type peuvent être inférés de la même façon qu'avec une fonction :

```ts twoslash
class Box<Type> {
  contents: Type;
  constructor(value: Type) {
    this.contents = value;
  }
}

const b = new Box("bonjour !");
//    ^?
```

Les classes peuvent imposer des restrictions de type et des types par défaut tout comme les interfaces.

### Paramètres de type dans les propriétés statiques

Il peut être difficile de comprendre pourquoi ce code est illégal :

```ts twoslash
// @errors: 2302
class Box<Type> {
  static defaultValue: Type;
}
```

Rappelez-vous qu'à l'exécution, les données de types sont complètement effacées !
Il n'existe qu'une seule valeur possible (et donc un seul type possible) à la propriété `Box.defaultValue`.
Cela signifie que définir `Box<string>.defaultValue` (si c'était possible) changerait également `Box<number>.defaultValue` - pas idéal.
Donc les membres `static` d'une classe générique ne peuvent pas faire de référence aux types génériques de la classe.

## `this` à l'exécution dans les classes

<blockquote class='bg-reading'>
   <p>Lecture de fond :<br />
   <a href='https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Operators/this'>L'opérateur this (MDN)</a><br/>
   </p>
</blockquote>

TypeScript ne change pas le comportement de JavaScript à l'exécution, et JavaScript est célèbre pour ses comportements très particuliers à l'exécution.

Cela inclut l'opérateur `this` :

```ts twoslash
class MyClass {
  name = "MyClass";
  getName() {
    return this.name;
  }
}
const c = new MyClass();
const obj = {
  name: "obj",
  getName: c.getName,
};

// Affiche "obj", pas "MyClass"
console.log(obj.getName());
```

Pour résumer, par défaut, la valeur de `this` à l'intérieur d'une fonction dépend de _comment la fonction a été appelée_.
Dans cet exemple, parce que cette fonction a été appelée avec une référence à `obj`, la valeur de `this` était `obj` au lieu d'être l'instance de classe.

C'est rarement le comportement que vous désirez !
TypeScript fournit plusieurs façons de remédier à ce problème.

### Fonctions fléchées

<blockquote class='bg-reading'>
   <p>Lecture de fond :<br />
   <a href='https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions'>Fonctions fléchées (MDN)</a><br/>
   </p>
</blockquote>

Si vous avez une fonction qui va être appelée et va être amenée à perdre le contexte de `this`, cela peut être judicieux d'utiliser une propriété de fonction fléchée au lieu d'une définition de méthode plus classique :

```ts twoslash
class MyClass {
  name = "MyClass";
  getName = () => {
    return this.name;
  };
}
const c = new MyClass();
const g = c.getName;
// Affiche "MyClass" au lieu de crash
console.log(g());
```

Cette façon de faire impose quelques compromis :

- La valeur de `this` est toujours correcte à l'exécution, même avec du code qui n'est pas vérifié par TypeScript.
- Les fonctions fléchées consomment plus de mémoire, parce que chaque fonction aura sa propre copie de fonctions définies de cette façon.
- Vous ne pouvez pas vous servir de `super.getName` dans une classe dérivée, parce qu'il n'existe aucune classe de base dans la chaîne de prototypes d'où il est possible de récupérer la méthode.

### Paramètre `this`

Dans une définition de méthode ou de fonction, il est possible d'ajouter un paramètre `this` qui a un sens spécial en TypeScript.
Ce paramètre est effacé à la compilation :

```ts twoslash
type SomeType = any;
// ---cut---
// Code TypeScript avec le paramètre 'this'
function fn(this: SomeType, x: number) {
  /* ... */
}
```

```js
// Sortie JavaScript
function fn(x) {
  /* ... */
}
```

TypeScript vérifie qu'un appel de fonction avec un paramètre `this` est fait avec un contexte correct.
Au lieu d'utiliser une fonction fléchée, il est possible d'utiliser un paramètre `this` dans les définitions de méthodes pour vérifier qu'elles ont été appelées correctement :

```ts twoslash
// @errors: 2684
class MyClass {
  name = "MyClass";
  getName(this: MyClass) {
    return this.name;
  }
}
const c = new MyClass();
// OK
c.getName();

// Erreur, crash
const g = c.getName;
console.log(g());
```

Cette façon opte pour les compromis opposés à l'approche de la fonction fléchée :

- Les entités JavaScript qui appellent ces méthodes pourraient utiliser le mauvais contexte de `this` sans s'en rendre compte.
- Seule une fonction par définition de classe sera allouée, au lieu d'une par instance de classe.
- Les définitions de méthode de base peuvent toujours être appelées via `super`.

## Types `this`

Dans une classe, un type spécial `this` réfère _dynamiquement_ au type de la classe courante.
Voici un exemple où cela pourrait être utile :

<!-- prettier-ignore -->
```ts twoslash
class Box {
  contents: string = "";
  set(value: string) {
//  ^?
    this.contents = value;
    return this;
  }
}
```

TypeScript a inféré le type de retour du `set` comme étant `this`, au lieu de `Box`.
Créons une classe dérivée de `Box`:

```ts twoslash
class Box {
  contents: string = "";
  set(value: string) {
    this.contents = value;
    return this;
  }
}
// ---cut---
class ClearableBox extends Box {
  clear() {
    this.contents = "";
  }
}

const a = new ClearableBox();
const b = a.set("bonjour");
//    ^?
```

Vous pouvez aussi utiliser `this` dans une annotation de type de paramètre :

```ts twoslash
class Box {
  content: string = "";
  sameAs(other: this) {
    return other.content === this.content;
  }
}
```

La différence avec l'écriture `other: Box` est que si vous avez une classe dérivée, sa méthode `sameAs`  ne va accepter qu'une autre instance de cette classe dérivée :

```ts twoslash
// @errors: 2345
class Box {
  content: string = "";
  sameAs(other: this) {
    return other.content === this.content;
  }
}

class DerivedBox extends Box {
  otherContent: string = "?";
}

const base = new Box();
const derived = new DerivedBox();
derived.sameAs(base);
```

### Gardes de types sur `this`

Vous pouvez utiliser `this is Type` dans la position de type de retour dans les méthodes à l'intérieur de classes ou interfaces.
Avec le rétrécissement de types (par ex. les déclarations `if`), le type de l'objet peut être rétréci vers le `Type` spécifié.

<!-- prettier-ignore -->
```ts twoslash
// @strictPropertyInitialization: false
class FileSystemObject {
  isFile(): this is FileRep {
    return this instanceof FileRep;
  }
  isDirectory(): this is Directory {
    return this instanceof Directory;
  }
  isNetworked(): this is Networked & this {
    return this.networked;
  }
  constructor(public path: string, private networked: boolean) {}
}

class FileRep extends FileSystemObject {
  constructor(path: string, public content: string) {
    super(path, false);
  }
}

class Directory extends FileSystemObject {
  children: FileSystemObject[];
}

interface Networked {
  host: string;
}

const fso: FileSystemObject = new FileRep("foo/bar.txt", "foo");

if (fso.isFile()) {
  fso.content;
// ^?
} else if (fso.isDirectory()) {
  fso.children;
// ^?
} else if (fso.isNetworked()) {
  fso.host;
// ^?
}
```

Un cas d'usage commun pour ces gardes de types de `this` est de permettre une validation passive d'un champ particulier. Par exemple, ce cas retire `undefined` des possibilités de valeur de `this.value`, si `hasValue` retourne `true` :

```ts twoslash
class Box<T> {
  value?: T;

  hasValue(): this is { value: T } {
    return this.value !== undefined;
  }
}

const box = new Box();
box.value = "Gameboy";

box.value;
//  ^?

if (box.hasValue()) {
  box.value;
  //  ^?
}
```

## Propriétés-Paramètres

TypeScript offre une syntaxe spéciale qui crée une propriété avec les mêmes modificateur, nom et valeur que le paramètre fourni.
Ce sont des _propriétés-paramètres_ qui sont créées en préfixant un argument de constructeur avec l'un des modificateurs `public`, `private`, `protected`, ou `readonly`.
Le champ résultant hérite de ces modificateurs :

```ts twoslash
// @errors: 2341
class Params {
  constructor(
    public readonly x: number,
    protected y: number,
    private z: number
  ) {
    // Pas de corps nécessaire
  }
}
const a = new Params(1, 2, 3);
console.log(a.x);
//            ^?
console.log(a.z);
```

## Expressions de Classes

<blockquote class='bg-reading'>
   <p>Lecture de fond :<br />
   <a href='https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Operators/class'>Expression de Classe (MDN)</a><br/>
   </p>
</blockquote>

Les expressions de classe sont similaires aux déclarations de classes, à une différence près : les expressions de classes n'ont pas besoin de noms, même si on peut y référer avec l'identifiant qu'on lui associera :

```ts twoslash
const someClass = class<Type> {
  content: Type;
  constructor(value: Type) {
    this.content = value;
  }
};

const m = new someClass("Bonjour tout le monde !");
//    ^?
```

## Classes et membres `abstract`

Les champs, méthodes et classes peuvent être _abstraits_.

Une _méthode abstraite_ ou un _champ abstrait_ n'a pas d'implémentation.
Ces membres ne peuvent exister que dans une _classe abstraite_, qui ne peut pas être instanciée directement.

Le rôle d'une classe abstraite est de servir de classe-mère pour toutes les classes-filles qui implémentent les membres abstraits.
Une classe _concrète_ est une classe qui n'a pas de membre abstrait.

Prenons un exemple :

```ts twoslash
// @errors: 2511
abstract class Base {
  abstract getName(): string;

  printName() {
    console.log("Bonjour, " + this.getName());
  }
}

const b = new Base();
```

Nous ne pouvons pas instancier `Base` avec `new` parce que la classe est abstraite.
À la place, nous devons créer une classe dérivée et instancier cette classe :

```ts twoslash
abstract class Base {
  abstract getName(): string;
  printName() {}
}
// ---cut---
class Derived extends Base {
  getName() {
    return "monde";
  }
}

const d = new Derived();
d.printName();
```

Remarquez que si vous oubliez d'implémenter un membre abstrait, vous aurez une erreur :

```ts twoslash
// @errors: 2515
abstract class Base {
  abstract getName(): string;
  printName() {}
}
// ---cut---
class Derived extends Base {
  // gros oubli, rien fait
}
```

### Signatures abstraites

Parfois, vous voudrez accepter un constructeur qui produit l'instance d'une classe dérivée d'une classe abstraite.

Prenez ce code par exemple :

```ts twoslash
// @errors: 2511
abstract class Base {
  abstract getName(): string;
  printName() {}
}
class Derived extends Base {
  getName() {
    return "";
  }
}
// ---cut---
function greet(ctor: typeof Base) {
  const instance = new ctor();
  instance.printName();
}
```

TypeScript devine correctement que vous essayer d'instancier une classe abstraite.
D'après la signature de `greet`, ce code est légal, mais il construirait une classe abstraite :

```ts twoslash
declare const greet: any, Base: any;
// ---cut---
// Non !
greet(Base);
```

À la place, vous voudrez accepter une fonction qui accepte une signature de constructeur :

```ts twoslash
// @errors: 2345
abstract class Base {
  abstract getName(): string;
  printName() {}
}
class Derived extends Base {
  getName() {
    return "";
  }
}
// ---cut---
function greet(ctor: new () => Base) {
  const instance = new ctor();
  instance.printName();
}
greet(Derived);
greet(Base);
```

Maintenant, TypeScript vous dira que vous pouvez utiliser `Derived` car c'est une classe concrète, mais pas `Base`.

## Relation entre les classes

La plupart des cas avec TypeScript, les classes sont comparées avec leurs structures, comme avec les autres types.

Par exemple, ces deux classes sont utilisables et interchangeables, de par leurs structures identiques :

```ts twoslash
class Point1 {
  x = 0;
  y = 0;
}

class Point2 {
  x = 0;
  y = 0;
}

// OK
const p: Point1 = new Point2();
```

Similairement, une classe peut être un sous-type d'une autre même sans relation explicite d'héritage :

```ts twoslash
// @strict: false
class Person {
  name: string;
  age: number;
}

class Employee {
  name: string;
  age: number;
  salary: number;
}

// OK
const p: Person = new Employee();
```

Cela paraît évident, mais il y a certains cas plus bizarres que d'autres.

Les classes vides n'ont pas de membres.
Dans un système de types structurel, un type sans membres est un super-type de tous les autres types.
Donc si vous écrivez une classe vide (ce que vous ne devez pas faire), vous pouvez l'utiliser partout :

```ts twoslash
class Empty {}

function fn(x: Empty) {
  // je ne peux rien faire avec 'x'
}

// Tout est OK !
fn(window);
fn({});
fn(fn);
```
