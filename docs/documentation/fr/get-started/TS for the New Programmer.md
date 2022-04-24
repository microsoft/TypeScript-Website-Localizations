---
title: TypeScript pour les nouveaux programmeurs
short: TS pour les nouveaux programmeurs
layout: docs
permalink: /fr/docs/handbook/typescript-from-scratch.html
oneline: Learn TypeScript from scratch
---

Félicitations, vous avez choisi TypeScript comme premier langage — déjà une bonne décision !

Vous avez peut-être déjà entendu dire que TypeScript est une "variante" de JavaScript.
La relation entre les deux est unique parmi les langages de programmation existants, et étudier cette relation vous permettra de comprendre ce qu'ajoute TypeScript à JavaScript.

## Bref historique de JavaScript

JavaScript (aussi connu sous le nom ECMAScript) était à l'origine un simple langage de scripting pour navigateurs.
Quand il fut inventé, il était utilisé pour de petits extraits de code dans une page web — aller au-delà d'une douzaine de ligne était inhabituel.
De ce fait, les navigateurs exécutaient du code JS assez lentement.
Cependant, la popularité de JavaScript grandira avec le temps, et les développeurs web ont commencé à s'en servir pour créer des expériences interactives.

Les développeurs de navigateurs Web répondirent à cette croissance de fréquence d'usage en optimisant les environnements d'exécution (compilation dynamique) et en élargissant le champ du possible avec JS (en ajoutant des APIs). Cela contribua à un usage encore plus répandu parmi les développeurs web.
Un site web moderne, de nos jours, contient des centaines de milliers de lignes de code. Ceci est en phase avec la façon dont le web a grandi, partant d'un simple ensemble de pages statiques, pour devenir une plateforme d'applications riches pour tout et sur tout.

De plus, le JS est devenu assez populaire pour être utilisé en dehors de navigateurs, Node.js ayant marqué l'implémentation de JS dans un environnement côté serveur.
Cette capacité à s'exécuter partout a rendu du langage un choix populaire pour le développement d'applications cross-platform.
Il y a beaucoup de développeurs dont le stack technique n'est constitué que de JavaScript !

Pour résumer, ce langage a été créé à l'origine pour répondre à des besoins simples, puis a évolué pour supporter l'exécution de millions de lignes.
Chaque langage a ses propres points bizarres et surprises, le JS ne faisant pas exception dû à ses débuts :

- L'opérateur d'égalité (`==`) _convertit_ ses arguments, conduisant à un comportement bizarre :

  ```js
  if ("" == 0) {
    // C'est vrai, mais pourquoi ?
  }
  if (1 < x < 3) {
    // C'est vrai peu importe la valeur de x !
  }
  ```

- JavaScript permet l'accès à des propriétés inexistantes :

  ```js
  const obj = { width: 10, height: 15 };
  const area = obj.width * obj.heigth;
  // Bonne chance pour savoir pourquoi "area" est égale à NaN
  ```

La plupart des langages lanceraient une erreur lors de ces situations. Certains le font à la compilation — avant l'exécution de quoi que ce soit.
Cette absence d'erreurs et ses mauvaises surprises sont gérables pour de petits programmes, mais beaucoup moins à l'échelle d'une grande application.

## TypeScript : un vérificateur statique de types

Nous disions que certains langages interdiraient l'exécution de code erroné.
La détection d'erreurs dans le code sans le lancer s'appelle la _vérification statique_.
La distinction entre ce qui est une erreur de ce qui ne l'est pas, en partant des valeurs avec lesquelles on travaille, s'appelle la vérification statique de types.

TypeScript vérifie les erreurs d'un programme avant l'exécution, et fait cela en se basant sur les _types de valeurs_, c'est un _vérificateur statique_.
Par exemple, l'exemple ci-dessus avait une erreur à cause du _type_ d'`obj` :

```ts twoslash
// @errors: 2551
const obj = { width: 10, height: 15 };
const area = obj.width * obj.heigth;
```

### Une surcouche typée de JavaScript

Quel est le rapport entre JavaScript et TypeScript ?

#### Syntaxe

TypeScript est une _surcouche_ de JavaScript : une syntaxe JS légale est donc une syntaxe TS légale.
La syntaxe définit la façon dont on écrit un programme.
Par exemple, ce code has une erreur de _syntaxe_ parce qu'il manque un `)` :

```ts twoslash
// @errors: 1005
let a = (4
```

TypeScript ne considère pas forcément du code JavaScript comme du code invalide.
Cela signifie que vous pouvez prendre du code JavaScript fonctionnel et le mettre dans un fichier TypeScript sans vous inquiéter de comment il est écrit exactement.

#### Types

Cependant, TypeScript est une surcouche _typée_. Cela veut dire que TS ajoute des règles régissant comment différents types de valeurs peuvent être utilisés.
L'erreur à propos de `obj.heigth` n'est pas une erreur de _syntaxe_ : c'est une erreur où l'on a utilisé une sorte de valeur (un _type_) de façon incorrecte.

Autre exemple, ce code JavaScript que vous pouvez lancez dans votre navigateur. Il _va_ afficher une valeur :

```js
console.log(4 / []);
```

Ce programme - dont la syntaxe est correcte - affiche `Infinity`.
Mais TypeScript considère que la division d'un nombre par un tableau ne fait pas sens, et va lancer une erreur :

```ts twoslash
// @errors: 2363
console.log(4 / []);
```

Il se peut que vous vouliez _vraiment_ diviser un nombre par un tableau, peut-être juste pour voir le résultat, mais la plupart du temps, vous avez fait une erreur.
Le vérificateur de types de TS est conçu pour accepter les programmes valides, tout en signalant le plus d'erreurs communes possibles.
(Nous apprendrons plus tard divers paramètres pour contrôler à quel point vous voulez que TS soit strict avec votre code.)

En migrant du code JavaScript vers un fichier TypeScript, il se peut que vous voyiez des _erreurs de type_ en fonction de la façon avec laquelle il a été écrit.
Il se peut qu'il y ait de vrais problèmes avec votre code, tout comme il se peut que TypeScript soit trop strict.
À travers ce guide, nous montrerons comment ajouter de la syntaxe TypeScript pour éliminer ces erreurs.

#### Comportement à l'exécution

TypeScript est aussi un langage qui préserve le _comportement à l'exécution_ de JavaScript.
Par exemple, la division par 0 produit `Infinity` au lieu de lancer une erreur.
TypeScript, par principe, ne change **jamais** le comportement de code JS.

Cela veut dire que si vous déplacez du code de JavaScript à TypeScript, il est **garanti** de s'exécuter de la même façon, même si TS pense qu'il comporte des erreurs liées aux types.

La conservation du comportement à l'exécution est l'un des principes fondamentaux de TypeScript parce que cela signifie que vous pouvez facilement alterner entre les deux langages sans vous inquiéter de différences subtiles qui empêcheraient votre programme de se lancer.

<!--
Missing subsection on the fact that TS extends JS to add syntax for type
specification.  (Since the immediately preceding text was raving about
how JS code can be used in TS.)
-->

#### Effacement de types

Grossièrement, une fois que le compilateur de TypeScript a fini de vérifier le code, il _efface_ les types pour laisser le code résultant.
Cela signifie qu'à la fin du processus de compilation, le code JS ne conserve aucune information de types.

Cela signifie aussi que TypeScript, en se basant sur les types présents dans le code, n'altère jamais le _comportement_ du programme.

Pour résumer, même si vous pouvez avoir des erreurs de type lors de la compilation, le système de types n'affecte aucunement la façon dont votre programme s'exécute.

Enfin, TypeScript ne fournit aucune librairie supplémentaire.
Vos programmes utiliseront les mêmes librairies standard ou externes que vos programmes JS, il n'y a donc aucun framework additionnel à apprendre au niveau de TS.

Il est intéressant de noter qu'il est possible de préciser la version de JavaScript que TypeScript doit cibler lors de la compilation. Cela affecte le code final, qui contiendra ou non des _polyfills_ (du code qui redéfinit des fonctionnalités existantes dans une version de JavaScript mais absentes dans une autre).

<!--
Should extend this paragraph to say that there's an exception of
allowing you to use newer JS features and transpile the code to an older
JS, and this might add small stubs of functionality when needed.  (Maybe
with an example --- something like `?.` would be good in showing readers
that this document is maintained.)
-->

## Apprendre JavaScript et TypeScript

Une question souvent posée est "Est-ce que je dois apprendre TypeScript ou JavaScript", à laquelle on répond qu'il n'est pas possible d'apprendre le TS sans apprendre le JS.

TypeScript possède la même syntaxe, et se comporte de la même façon que JavaScript, donc vous pourrez utiliser tout ce que vous apprenez avec JavaScript, dans TypeScript.

Il y a beaucoup, _beaucoup_ de ressources disponibles pour apprendre le JavaScript. Ces ressources ne doivent pas être ignorées si vous voulez apprendre TypeScript. Par exemple, il y a à peu près 20 fois plus de questions StackOverflow taggées `javascript` que `typescript`, mais toutes les questions `javascript` s'appliquent aussi à TypeScript.

Si vous recherchez quelque chose comme "comment trier un tableau en TypeScript", souvenez-vous : **TypeScript est du JavaScript avec un vérificateur de types à la compilation**. La façon dont vous triez un tableau en JavaScript est la même qu'en TypeScript.
Si vous trouvez une ressource qui utilise TypeScript, ce n'est pas plus mal, mais ne croyez pas que vous avez besoin de réponses spécifiques à TS pour des tâches JS de tous les jours.

## Prochaines étapes

C'était un bref résumé des syntaxes et outils utilisés dans le TypeScript de tous les jours. À partir de là, vous pourrez :

- Apprendre des fondamentaux de TypeScript. Nous recommandons :

  - [Les ressources JavaScript de Microsoft](https://docs.microsoft.com/javascript/) or
  - [Le guide JavaScript dans les Mozilla Web Docs](https://developer.mozilla.org/docs/Web/JavaScript/Guide)

- Continuer vers la page [TypeScript pour les développeurs JavaScript](/docs/handbook/typescript-in-5-minutes.html)
- Lire le Manuel [du début à la fin](/docs/handbook/intro.html) (30m)
- Explorer les [exemples du bac à sable](/play#show-examples)

<!-- Note: I'll be happy to write the following... -->
<!--
## Types

    * What's a type? (For newbies)
      * A type is a *kind* of value
      * Types implicitly define what operations make sense on them
      * Lots of different kinds, not just primitives
      * We can make descriptions for all kinds of values
      * The `any` type -- a quick desctiption, what it is, and why it's bad
    * Inference 101
      * Examples
      * TypeScript can figure out types most of the time
      * Two places we'll ask you what the type is: Function boundaries, and later-initialized values
    * Co-learning JavaScript
      * You can+should read existing JS resources
      * Just paste it in and see what happens
      * Consider turning off 'strict' -->
