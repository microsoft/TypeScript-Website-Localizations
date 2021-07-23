---
header: Introduction à la référence TSConfig
firstLine: Un fichier TSConfig dans un répertoire indique que le répertoire est la racine d'un projet TypeScript ou JavaScript...
---

Un fichier TSConfig dans un répertoire indique que le répertoire est la racine d'un projet TypeScript ou JavaScript.
Le fichier TSConfig peut être un `tsconfig.json` ou `jsconfig.json`, les deux ont le même ensemble de variables de configuration.

Cette page couvre toutes les différentes options disponibles dans un fichier TSConfig. Il y a plus de 100 options, et cette page n'est pas conçue pour être lue de haut en bas. Au lieu de cela, elle comporte cinq sections principales :

- Un aperçu catégorisé de tous les aspects du compilateur
- Les [root fields](#Project_Files_0) pour indiquer à TypeScript quels fichiers sont disponibles
- Les champs [`compilerOptions`](#compilerOptions), c'est la majorité du document
- Les champs [`watchOptions`](#watchOptions), pour peaufiner le mode "watch" (rafraichissement automatique)
- Les champs [`typeAcquisition`](#typeAcquisition), pour peaufiner la façon dont les types sont ajoutés aux projets JavaScript

Si vous démarrez un TSConfig à partir de zéro, vous pouvez envisager d'utiliser `tsc --init` pour amorcer ou utiliser une [base TSConfig](https://github.com/tsconfig/bases#centralized-recommendations-for-tsconfig-bases).
