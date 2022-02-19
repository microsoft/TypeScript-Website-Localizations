---
title: TypeScript pour les Développeurs Java/C#
short: TS pour les Développeurs Java/C#
layout: docs
permalink: /docs/handbook/typescript-in-5-minutes-oop.html
oneline: Apprenez TypeScript si vous avez de l'expérience avec les langages orientés objet
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

En TypeScript, ce procédé devient naturel quand vous pensez aux types en tant qu'ensembles.
Comment décrire une valeur qui appartient, soit à l'ensemble des `string`, soit à celui des `number` ?
Elle appartient simplement à l'_union_ de ces ensembles : `string | number`.

TypeScript fournit un certain nombre de mécanismes pour travailler avec les types de façons similaires à la théorie des ensembles, et ces façons seront plus intuitives si on pense aux types en tant qu'ensembles.

### Types Structurels Effacés

En TypeScript, les objets n'ont _pas_ de seul et unique type.
Par exemple, si nous créons un objet qui correspond à une interface, nous pouvons utiliser cet objet là où l'interface est attendue même si aucune relation de déclaration n'existait entre les deux.

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

Le système de types de TypeScript est _structurel_, et non nominal : nous pouvons utiliser `obj` en tant que `Pointlike` parce qu'`obj` a les propriétés `x` et `y` qui sont toutes les deux des nombres.
Les relations entre types sont déterminées par les propriétés qu'ils contiennent, et non pas avec une relation de déclaration entre eux.

Le système de types de TypeScript n'est également _pas réifié_: rien ne va pouvoir nous dire qu'`obj` est un `Pointlike`, lors de l'exécution.
D'ailleurs, le type `Pointlike` n'est _même pas présent_ lors de l'exécution.

Si nous revenons à notre façon de réfléchir aux types _en tant qu'ensemble_, nous pouvons dire qu'`obj` est membre de l'ensemble `Pointlike`, ainsi que de l'ensemble `Named`.

### Conséquences du typage structurel

Deux aspects particuliers de ce système surprennent souvent les développeurs POO.

#### Types vides

Le premier est que le _type vide_ a l'air d'agir de manière impromptue :

```ts twoslash
class Empty {}

function fn(arg: Empty) {
  // fais quelque chose ?
}

// Pas d'erreur, mais ce n'est pas un Empty ?
fn({ k: 10 });
```

TypeScript détermine si l'appel à `fn` est valide en déterminant si l'argument fourni est un `Empty` valide.
Cela est accompli en examinant la _structure_ de `{ k: 10 }` et `class Empty { }`.
Nous pouvons voir que `{ k: 10 }` a _toutes_ les propriétés d'`Empty` vu qu'`Empty` n'a aucune propriété.
C'est donc un appel valide !

Cela peut paraître surprenant, mais c'est au final une relation très similaire à celle respectées dans les langages POO nominaux.
Une sous-classe ne peut pas _retirer_ une propriété de sa classe-mère, parce que faire cela détruirait la relation de sous-type naturelle existant entre la sous-classe et sa classe-mère.
Les systèmes de type structurels identifient cette relation en décrivant les sous-types de façon à avoir des propriétés à types compatibles.

#### Types identiques

Les types identiques sont une autre source fréquente de surprises :

```ts
class Car {
  drive() {
    // accélérer
  }
}
class Golfer {
  drive() {
    // frapper la balle fort
  }
}

// Pas d'erreur ?
let w: Car = new Golfer();
```

Encore une fois, ceci n'est pas une erreur parce que les _structures_ de ces classes sont les mêmes.
Cela peut paraître comme une source de confusion, mais en pratique, les classes identiques n'ayant aucun rapport ne sont pas communes.

Nous apprendrons plus sur comment les classes sont liées l'une à l'autre dans leur chapitre.

### Réflexivité

Les développeurs POO ont l'habitude de pouvoir demander le type de n'importe quelle valeur, même générique :

```csharp
// C#
static void LogType<T>() {
    Console.WriteLine(typeof(T).Name);
}
```

Mais parce que le système de types de TypeScript est complètement effacé, aucune information sur, par exemple, l'instanciation d'un type générique n'est disponible à l'exécution.

Le JavaScript possède quelques opérateurs comme `typeof` et `instanceof`, mais souvenez-vous que ces opérateurs agissent sur les valeurs, tel qu'elles existent dans le code sans informations de types.
Par exemple, `typeof (new Car())` va retourner `"object"`, et non `Car` ni `"Car"`.

## Prochaines étapes

C'était un bref résumé de la syntaxe et des outils régulièrement utilisés en TypeScript. À partir de là, vous pourrez :

- Lire le Manuel [du début à la fin](/docs/handbook/intro.html) (30m)
- Explorer les [exemples du bac à sable](/play#show-examples)
