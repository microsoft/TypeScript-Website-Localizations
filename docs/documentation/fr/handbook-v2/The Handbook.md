---
title: Le Manuel TypeScript
layout: docs
permalink: /fr/docs/handbook/intro.html
oneline: Votre première étape vers l'apprentissage de TypeScript
handbook: "true"
---

## À propos de ce manuel

20 ans après sa conception, le JavaScript est désormais l'un des langages multi-plateformes des plus répandus. Étant, à ses débuts, un langage de scripting pour une interactivité minimale avec les pages web, le JavaScript a grandi bien au-delà, et est devenu un langage de choix pour toute application côté client et serveur. L'étendue, la taille, et la portée des applications JavaScript ont grandi exponentiellement, mais la capacité du langage à exprimer les relations entre les différentes unités de code n'a pas suivi. S'ajoute à cela la sémantique particulière à l'exécution, pour mener à une différence de complexité entre langage et programme, rendant le développement JavaScript difficile à moyenne et grande échelle.

Les erreurs les plus fréquentes que peuvent rencontrer les programmeurs sont des erreurs de types : un certain genre de valeur a été utilisé là où un genre différent était attendu. Les raisons peuvent être de simples fautes d'orthographe, une incompréhension de l'API de la librairie, des suppositions incorrectes sur le comportement d'une méthode à l'exécution, et bien d'autres raisons encore. Le but de TypeScript est d'être un vérificateur statique de types pour votre code - en d'autres termes, un outil qui se lance avant votre code (statique) et qui s'assure que les types de votre programme sont cohérents et corrects.

Si vous souhaitez apprendre TypeScript sans avoir de vécu avec JavaScript, si TypeScript est votre tout premier langage, il est recommandé de commencer par la documentation du [tutoriel Microsoft pour apprendre le JavaScript](https://developer.microsoft.com/fr-fr/javascript/) ou la [guide Mozilla Developer Network de JavaScript](https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide).
Si vous avez de l'expérience avec d'autres langages, vous serez probablement capable d'apprendre TypeScript en lisant le manuel.

## Structure du Manuel

Ce manuel est séparé en deux sections :

- **Le Manuel**

  Le Manuel TypeScript a pour intention d'être un document qui explique les concepts de TypeScript. Vous pouvez lire le manuel en suivant les chapitres de haut en bas dans la navigation à gauche.

  Chaque chapitre ou page doit vous fournir une importante compréhension des concepts qu'il ou elle mentionne. Le Manuel n'a pas pour but de jouer le rôle de document de spécification, mais il est prévu pour être un guide détaillé autour de toutes les fonctionnalités et comportements du langage.

  Un lecteur pourra, dès lors qu'il lit le manuel :

  - Lire et écrire de la syntaxe commune en TypeScript
  - Expliquer l'effet des options importantes de compilateur
  - Prédire correctement les effets du système de types dans la plupart des cas

  Pour rester dans la concision et la clarté, le contenu principal du Manuel ne va pas couvrir tous les cas d'usages marginaux et détaillés des fonctionnalités couvertes. Vous pourrez trouver plus de détails sur certains concepts dans les articles de références.

- **Fichiers de références**

  La section de Références qui suit le Manuel est conçue pour fournir une compréhension plus complète sur une partie particulière de TypeScript. Vous pouvez la lire de haut en bas, mais chaque section a pour but de développer vos connaissances sur un sujet particulier - ces sections ne sont donc pas censées suivre une certaine continuité.

### Ce que le Manuel n'est pas

Le Manuel doit être un document qui doit être lu en quelques heures maximum. Certains sujets ne vont pas être couverts, pour rester dans la brièveté.

Plus précisément, ce Manuel n'introduit pas de concepts basiques en JavaScript, comme les fonctions, classes, et fermetures (_closures_). Un lien de lecture de fond sera inclus si nécessaire, pour pouvoir vous familiariser avec ces concepts.

Le Manuel n'est pas un remplacement pour la spécification du langage. Les cas marginaux et les descriptions formelles de comportement vont être mis de côté, à la faveur d'explications plus simples et plus compréhensibles. Par contre, des pages de référence sont prévues à cet effet. Ces pages de référence ne sont pas prévues pour les lecteurs qui ne sont pas familiers avec TypeScript, donc il se peut qu'elles couvrent des sujets que vous n'avez pas encore lus ou qu'elles utilisent de la terminologie avancée.

Enfin, le Manuel ne couvrira pas comment TypeScript interagit avec les autres outils de l'écosystème JavaScript, sauf si nécessaire. Les problématiques de configuration de TypeScript avec Webpack, Rollup, Parcel, React, Babel, Closure, Lerna, Rush, Bazel, Preact, Vue, Angular, Svelte, jQuery, Yarn, or npm sont hors-sujet - et peuvent être trouvées dans les documentations des outils concernés.

## Commencer

Avant de commencer avec les [Bases](/docs/fr/handbook/2/basic-types.html), nous recommandons de commencer par l'une de ces pages d'introduction. Ces introductions ont pour objectif de mettre en lumière les similarités et différences importantes entre votre langage de prédilection et TypeScript, pour clarifier tout malentendu ou confusion.

- [TypeScript pour les nouveaux programmeurs](/docs/fr/handbook/typescript-from-scratch.html)
- [TypeScript pour les programmeurs JavaScript](/docs/fr/handbook/typescript-in-5-minutes.html)
- [TypeScript pour les programmeurs Java/C#](/docs/fr/handbook/typescript-in-5-minutes-oop.html)
- [TypeScript pour les programmeurs fonctionnels (en anglais)](/docs/handbook/typescript-in-5-minutes-func.html)

Sinon, vous pouvez obtenir une copie en [Epub](/assets/typescript-handbook.epub) ou [PDF](/assets/typescript-handbook.pdf).
