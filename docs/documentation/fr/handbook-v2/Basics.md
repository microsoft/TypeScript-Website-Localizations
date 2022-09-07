---
title: Bases
layout: docs
permalink: /docs/handbook/2/basic-types.html
oneline: >
  Première étape dans l'apprentissage de TypeScript : les types de base.
preamble: >
  <p>Bienvenue dans la première page du manuel. Si c'est votre premier contact avec TypeScript, vous voudrez peut-être commencer avec <a href='https://www.typescriptlang.org/docs/handbook/intro.html#get-started'>les guides</a></p>
---

Chaque valeur en JavaScript a un ensemble de comportements que l'on peut observer en exécutant diverses opérations.
Cela paraît abstrait, mais considérons cet exemple d'opérations qu'on pourrait lancer sur une variable appelée `message`.

```js
// Accès à la propriété "toLowerCase"
// de 'message' et appel de cette propriété
message.toLowerCase();

// Appel direct de 'message'
message();
```

Si on y va étape par étape, la première ligne accède à une propriété appelée `toLowerCase` puis l'appelle.
La deuxième appelle `message` directement.

Mais en supposant qu'on ne connaît pas la valeur de `message` - et cela arrive souvent - nous ne pouvons pas dire quel résultat nous obtiendrons quand on essaie de lancer le code.
Le résultat de chaque opération dépend entièrement de la valeur qu'on avait au départ.

- Est-ce que `message` peut être appelé ?
- Est-ce qu'il a une propriété `toLowerCase` ?
- S'il en a une, est-ce que `toLowerCase` peut être appelée elle aussi ?
- Si ces deux valeurs peuvent être appelées, qu'est-ce qu'elles retournent ?

Les réponses à toutes ces questions sont normalement des informations qu'on retient en écrivant du JavaScript, tout en espérant que notre mémoire ne nous trahira pas.

Supposons que `message` soit défini de cette façon.

```js
const message = "Hello World!";
```

Comme vous pourrez peut-être le deviner, si nous essayons de lancer `message.toLowerCase()`, nous aurons le même string mais en minuscules.

Et cette seconde ligne ?
Si vous êtes familier avec JavaScript, vous saurez qu'elle échouera avec l'exception :

```txt
TypeError: message is not a function
```

Ce serait bien si on pouvait éviter ce genre d'erreurs.

Quand on lance notre code, la façon dont JavaScript décide comment agir est de trouver quel est le _type_ de la valeur - quelles sortes de comportements et capacités possède-t-elle.
C'est en partie ce que `TypeError` nous dit - le string `"Hello World!"` ne peut pas être appelé comme une fonction.

Pour certaines valeurs, comme les `string` et `number`, nous pouvons identifier leurs types à l'exécution grâce à l'opérateur `typeof`.
Mais pour autre chose comme des fonctions, il n'y a aucun mécanisme pour faire de même.
Considérons cette fonction par exemple :

```js
function fn(x) {
  return x.flip();
}
```

Nous pouvons _observer_ en lisant le code que cette fonction ne fonctionnera que si elle reçoit un objet avec une propriété `flip` appelable, mais JavaScript ne remonte pas cette information pendant que l'on code.
La seule façon de le savoir, c'est d'appeler la méthode et voir le résultat. Ce type de comportement rend la prédiction de ce que le code va faire difficile.

Vu de cette façon, un _type_ permet de décrire quelles valeurs peuvent être passées à `fn` et quelles valeurs vont provoquer un bug.
JavaScript ne fournit que du typage _dynamique_ - vérifiable uniquement quand on lance le code.

L'alternative est d'utiliser un système de typage _statique_ pour faire des prédictions sur le comportement du code à exécuter _avant_ qu'il se lance.

## Vérification statique de types

Nous avons eu un `TypeError` en essayant de nous servir d'un `string` en tant que fonction.
_La plupart des gens_ n'apprécient pas d'avoir des erreurs dans leur code - ce sont des bugs !
Et quand on écrit du nouveau code, nous faisons de notre mieux pour éviter les bugs.

Si nous ajoutons un bout de code, sauvegardons notre fichier, relançons notre code, et remarquons une erreur immédiatement, on pourrait isoler le problème assez vite ; mais ce n'est pas toujours le cas.
Peut-être qu'on n'a pas assez testé notre code, donc il se peut qu'on ne tombe pas sur l'erreur assez tôt !
Ou alors, si on trouve l'erreur, on pourrait l'avoir trouvée après avoir fait une grosse refonte, ajouté beaucoup de code, et beaucoup creusé pour l'avoir trouvée.

Idéalement, on aurait un outil qui nous aiderait à trouver ces bugs _avant_ que ce code se lance.
Et c'est là que TypeScript intervient, avec son système de typage statique.
Les _systèmes de typage statique_ décrivent les comportements de nos valeurs une fois notre programme lancé.
Un système de vérification de types comme TypeScript utilise ces informations pour nous dire quand le code risque de se comporter de façon imprévue.

```ts twoslash
// @errors: 2349
const message = "bonsoir";

message();
```

Exécuter cet exemple avec TypeScript va nous remonter une erreur avant même de lancer le code.

## Problèmes qui ne crasheront pas le programme

Jusque-là, nous avons montré des cas où JavaScript indiquera qu'une erreur s'est produite.
Ces cas apparaissent parce que la [spécification ECMAScript](https://tc39.github.io/ecma262/) possède des instructions précises sur la façon dont JavaScript doit se comporter s'il rencontre un cas inhabituel.

Par exemple, cette spécification dit qu'essayer d'appeler quelque chose qui ne peut pas être appelé provoque une erreur.
Cela peut paraître comme un comportement évident, mais on aurait pu dire qu'accéder à une propriété qui n'existe pas dans un objet devrait aussi lancer une erreur.
À la place, JavaScript nous retourne la valeur `undefined` :

```js
const user = {
  name: "Daniel",
  age: 26,
};

user.location; // retourne undefined
```

Finalement, un système de vérification statique de types devra décider quel code doit être considéré comme une erreur, même s'il est du code JavaScript "valide" qui ne retournera pas d'erreur immédiate.
Avec le code suivant, TypeScript lance une erreur à propos de `location` qui n'est pas défini:

```ts twoslash
// @errors: 2339
const user = {
  name: "Daniel",
  age: 26,
};

user.location;
```

Cela implique parfois de faire des concessions sur ce qu'il est possible de faire avec TypeScript, mais l'intention est de repérer les bugs légitimes dans votre programme.
Et TypeScript repère _beaucoup_ de bugs légitimes.

Par exemple, les fautes d'orthographes :

```ts twoslash
// @noErrors
const announcement = "Hello World!";

// Combien de temps mettrez-vous à repérer l'erreur ?
announcement.toLocaleLowercase();
announcement.toLocalLowerCase();

// On a probablement voulu écrire ça à la place...
announcement.toLocaleLowerCase();
```

Les fonctions qui sont pas appelées :

```ts twoslash
// @noUnusedLocals
// @errors: 2365
function flipCoin() {
  // C'était censé être Math.random()
  return Math.random < 0.5;
}
```

Ou de simples erreurs de logique.

```ts twoslash
// @errors: 2367
const value = Math.random() < 0.5 ? "a" : "b";
if (value !== "a") {
  // ...
} else if (value === "b") {
  // Oups, impossible de l'atteindre
}
```

## Types dans l'outillage

TypeScript peut capturer les bugs quand on commet des erreurs dans notre code. C'est bien, mais il est également _possible_ de ne pas en faire dès le départ.

TypeScript possède les informations nécessaires pour faire ses vérifications (on dit qu'il est un _vérificateur de types_, ou _type-checker_) : est-ce que la propriété ou variable à laquelle on tente d'accéder existe, quel est son type, quelles sont les opérations qu'on peut accomplir dessus.
De ce fait, le langage peut _suggérer_ les propriétés que vous tentez d'utiliser.

Cela signifie que TypeScript peut être également utilisé dans la modification de code, et le type-checker peut fournir messages d'erreur et autocomplétion pendant que vous écrivez.
C'est en partie ce qu'il est signifié quand on parle de TypeScript dans l'outillage d'un projet.

<!-- prettier-ignore -->
```ts twoslash
// @noErrors
// @esModuleInterop
import express from "express";
const app = express();

app.get("/", function (req, res) {
  res.sen
//       ^ erreur, "sen" n'existe pas. Vouliez-vous dire "send" ?
});

app.listen(3000);
```

Un éditeur de code qui gère TypeScript peut fournir des "quick fixes" pour corriger automatiquement de petites erreurs, des suggestions de réorganisation, ainsi que des fonctionnalités de navigation pour trouver toutes les références à une variable, ainsi que sa définition initiale.
Tout cela s'appuie sur le vérificateur de types et est probablement multi-plateformes, il est donc probable que [votre IDE préféré supporte TypeScript](https://github.com/Microsoft/TypeScript/wiki/TypeScript-Editor-Support).

## `tsc`, le compilateur

On a beaucoup parlé du principe de vérification de types, mais pas du _vérificateur_ de types. Ce vérificateur n'est autre que le compilateur TypeScript, `tsc`.
Tout d'abord, il faut l'installer depuis npm.

```sh
npm install -g typescript
```

> Cette commande installe globalement le compilateur `tsc`.
> Si vous préférez utiliser une version locale de TypeScript, vous pouvez utiliser `npx` ou tout autre outil similaire.

Créons un dossier vide et un fichier `hello.ts` qui contient :

```ts twoslash
// Dire bonjour.
console.log("bonjour !");
```

Rien de fantastique : ce "hello world" est identique à un "hello world" en JavaScript.
Maintenant, lançons la commande `tsc` qui a été installée avec le package `typescript`.

```sh
tsc hello.ts
```

Et voilà... voilà quoi, exactement ? A priori, rien ne s'est passé.
Cela dit, il n'y a eu aucune erreur, donc rien n'a été rapporté depuis la console.

En regardant de plus près, un nouveau fichier a été créé : dans le même dossier, il y a un `hello.js` à côté de `hello.ts`.
C'est le résultat de la compilation de `hello.ts` en un fichier JavaScript standard.
Observons le contenu du fichier émis par TypeScript :

```js
// Greets the world.
console.log("Hello world!");
```

Ici, TypeScript n'a pas eu grand chose à transformer, donc le code final est identique au code de départ. Le compilateur essaie toujours d'émettre du code qui ressemble à ce qu'écrirait une vraie personne.
Ce n'est pas toujours facile, mais TypeScript conserve l'indentation, fait attention quand le code s'étend sur beaucoup de lignes, et essaie de conserver les commentaires.

Essayons d'introduire une erreur de vérification en modifiant `hello.ts` :

```ts twoslash
// @noErrors
// Fonction de salutation générique et de haut niveau :
function greet(person, date) {
  console.log(`Bonjour ${person}, nous sommes le ${date} !`);
}

greet("Brendan");
```

Si on lance `tsc hello.ts` à nouveau, on remarque qu'on a bel et bien une erreur.

```txt
Expected 2 arguments, but got 1.
```

TypeScript nous informe qu'on a oublié de passer un argument à la fonction `greet`, à raison.
Jusque-là nous avons écrit ce qui peut être vu comme du JavaScript valide, et la vérification de types a quand même pu repérer des erreurs.
Merci TypeScript !

## Émissions de fichier avec erreurs

Vous n'aurez peut-être pas remarqué que le fichier `hello.js` a encore changé.
Si vous l'ouvrez à nouveau, vous verrez que son contenu est le même que le fichier source.
Cela peut surprendre, étant donné que `tsc` a rapporté une erreur, mais ce comportement est concordant avec les valeurs fondamentales de TypeScript : la plupart du temps, _vous_ saurez mieux.

La vérification de types limite les sortes de programmes que vous pouvez lancer. Il y a donc un compromis à atteindre sur ce que le vérificateur considère acceptable.
D'habitude, cela ne pose aucun problème, mais il y a des situations où cette rigueur est contre-productive.
Par exemple, imaginez que vous migrez du code JavaScript en TypeScript, introduisant de ce fait des erreurs de typage.
À la fin, vous corrigerez ces erreurs, mais ce code JavaScript fonctionnait déjà. Le convertir en TypeScript ne devrait rien y changer.

Bien sûr, avec le temps, vous voudrez peut-être qu'il soit plus restrictif par rapport aux erreurs, et faire en sorte que TypeScript agisse un peu plus strictement.
Dans ce cas, vous pouvez utiliser l'option de compilateur [`noEmitOnError`](/tsconfig#noEmitOnError).
Avec cette option, modifiez `hello.ts` et lancez `tsc` :

```sh
tsc --noEmitOnError hello.ts
```

`hello.js` ne va pas se mettre à jour.

## Types explicites

Jusque-là, nous n'avons pas précisé ce que sont `person` ou `date`.
Modifions notre code, et informons TypeScript que `person` est un `string`, et que `date` doit être un objet `Date`.
On utilisera aussi la méthode `toDateString()` de `date`.

```ts twoslash
function greet(person: string, date: Date) {
  console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}
```

Ce qu'on vient d'ajouter s'appelle des _annotations de types_ sur `person` et `date`, pour décrire les valeurs dont `greet` peut se servir.
Cet exemple peut se lire "`greet` prend une `person` de type `string`, et une `date` de type `Date`".

Armé de cette information, TypeScript peut nous prévenir quand `greet` pourrait être utilisé de façon incorrecte.
Par exemple...

```ts twoslash
// @errors: 2345
function greet(person: string, date: Date) {
  console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}

greet("Maddison", Date());
```

Quoi ?
TypeScript a rapporté une erreur sur le deuxième argument, mais pourquoi ?

Appeler `Date()` en JavaScript retourne un `string`. Mais construire une `Date` avec `new Date()` nous donne ce qu'on attend.

L'erreur peut être rapidement réparée :

```ts twoslash {4}
function greet(person: string, date: Date) {
  console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}

greet("Maddison", new Date());
```

Cela dit, nous ne sommes pas obligés de définir des annotations de types tout le temps.
Dans plusieurs situations, TypeScript peut simplement _inférer_ (ou "déduire") les types pour nous même si on les omet.

```ts twoslash
let msg = "bien le bonjour !";
//  ^?
```

Même si on n'a pas dit que `msg` avait le type `string`, TypeScript a su le déduire tout seul.
C'est une fonctionnalité, et il vaut mieux laisser TypeScript faire le travail d'inférence s'il déduit correctement le type.

> Note : le message qui s'affiche dans la bulle serait ce que votre éditeur afficherait si vous survolez la variable.

## Effacement de Types

Compilons la méthode `greet` avec `tsc` et observons le résultat :

```ts twoslash
// @showEmit
// @target: es5
function greet(person: string, date: Date) {
  console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}

greet("Maddison", new Date());
```

Remarquons deux points sur le résultat :

1. Les paramètres `person` et `date` n'ont pas d'annotations de types.
2. Notre "template string" - la chaîne de caractères qui utilise les apostrophes inverses (`` ` ``) - a été convertie en utilisant une concaténation classique (`+`).

Nous parlerons du deuxième point plus tard, mais concentrons-nous sur le premier.
Les annotations de types ne font pas partie de la spécification JavaScript (ou ECMAScript si on veut chercher la petite bête), donc TypeScript ne peut pas s'exécuter dans un navigateur sans modification préalable.
C'est tout l'intérêt d'un compilateur TypeScript - il permet de transformer le code et lui permettre de se lancer.
La plupart du code propre à TypeScript est effacée, y compris nos annotations de types.

> **Souvenez-vous** : Les annotations de type ne doivent jamais changer l'exécution de votre code.

## Nivellement par le bas

Une autre différence entre le code compilé et code source, la transformation de notre chaîne de caractères :

```js
`Hello ${person}, today is ${date.toDateString()}!`;
```

vers

```js
"Hello " + person + ", today is " + date.toDateString() + "!";
```

Pourquoi cela ?

Les Template strings sont une fonctionnalité d'ECMAScript appelée ECMAScript 2015 (mais aussi ECMAScript 6, ES2015, ES6, etc. - _c'est compliqué_).
TypeScript peut réécrire le code de versions récentes d'ECMAScript vers certaines plus anciennes, tel que ECMAScript 3 ou ECMAScript 5 (ES3 et ES5).
Le fait de passer d'une version plus récente ou plus neuve d'ECMAScript vers une autre plus basse s'appelle le _nivellement vers le bas_.

Par défaut, TypeScript vise ES3, une version extrêmement vieille d'ECMAScript.
Nous aurions pu choisir une version un peu plus récente avec l'option [`target`](/tsconfig#target).
Compiler avec `--target es2015` compile TypeScript en visant ECMAScript 2015, donc tout environnement supportant ES2015 peut lancer ce code.
Lancer `tsc --target es2015 hello.ts` nous mène au résultat suivant :

```js
function greet(person, date) {
  console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}
greet("Maddison", new Date());
```

> La cible par défaut est ES3, mais tous les navigateurs modernes supportent ES2015.
Donc la plupart des développeurs peuvent viser ES2015 ou plus haut, sauf si supporter d'anciens navigateurs est une contrainte.

## Degré de rigueur

TypeScript est utilisé pour diverses raisons.
Certains développeurs veulent une expérience laxiste et volontaire. TypeScript peut valider certaines parties du programme uniquement, tout en laissant ses capacités disponibles.
C'est l'expérience par défaut avec TypeScript, où le typage est optionnel, l'inférence déduit des types vagues, et aucune valeur `null`/`undefined` n'est vérifiée.
Tout comme `tsc` émet des fichiers même avec des erreurs, ces comportements par défaut sont en place pour qu'ils ne vous entravent pas.
Ce serait une première étape désirable si vous migrez du code JavaScript.

D'autres utilisateurs souhaitent que TypeScript valide et soit strict le plus possible, d'où plusieurs options disponibles à cet effet.
Ces paramètres permettent d'avoir des "niveaux" de rigueur (allant du laxiste au plus strict possible) plutôt que d'avoir deux options binaires (faire de la vérification de code ou pas du tout).
Plus vous montez en niveaux de rigueur, plus TypeScript vous assistera avec la validation et la vérification.
Cela peut nécessiter du travail supplémentaire, mais il se rentabilise sur le long terme.
Si possible, une nouvelle base de code doit toujours avoir les vérifications strictes activées.

TypeScript a plusieurs options de rigueur qui peuvent être activées ou pas, et tous nos exemples les suivront, sauf si le contraire est mentionné.
L'option [`strict`](/tsconfig#strict) dans la ligne de commande, ou `"strict": true` dans le fichier [`tsconfig.json`](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) les active toutes ensemble, mais il est possible de les désactiver individuellement.
Les deux options les plus importantes sont [`noImplicitAny`](/tsconfig#noImplicitAny) et [`strictNullChecks`](/tsconfig#strictNullChecks).

## `noImplicitAny`

À certains endroits, TypeScript n'essaie pas d'inférer de types et va rendre le type le plus laxiste : `any`.
Ce n'est pas forcément un problème - de toute façon, le type `any` est ce que JavaScript va vous donner.

Cependant, utiliser `any` ne donne plus aucun intérêt d'utiliser TypeScript.
Plus votre programme est couvert par du typage, plus vous serez épaulé en terme de validation et d'outillage, et moins vous aurez de bugs.
Activer l'option [`noImplicitAny`](/tsconfig#noImplicitAny) va remonter une erreur pour toute variable avec un type qui a été inféré en `any`.

## `strictNullChecks`

Par défaut, les valeurs comme `null` et `undefined` sont assignables à tout autre type.
Cela peut s'avérer pratique, mais oublier de gérer `null` et `undefined` est la cause d'innombrables bugs - certains le considèrent comme une erreur [coûtant des milliards de dollars](https://www.youtube.com/watch?v=ybrQvs4x0Ps) !
L'option [`strictNullChecks`](/tsconfig#strictNullChecks) rend la gestion de `null` et `undefined` plus explicite, et _nous épargne_ les maux de tête autour du fait de devoir gérer `null` et `undefined`.
