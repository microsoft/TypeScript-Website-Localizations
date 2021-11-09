//// {  "compiler": {},  "order": 2}

// L'opérateur de coalescence des nuls (nullish coalescing operator) est une
// alternative à || qui retourne l'expression de droite si celle de gauche
// est nulle ou non-définie.

// En revanche, || vérifie si la valeur est de type fausse (falsy), ce qui veut dire
// qu'une chaîne de caractères, ou le nombre 0, seraient considérés faux.

// Un bon example est la gestion des objets partiellement
// définis, pour lesquels il est possible d'avoir des valeurs par défaut
// quand une clef est manquante.

interface AppConfiguration {
  // Défaut: "(no name)"; une chaîne de caractère vide est une valeur valide
  name: string;

  // Défaut: -1; 0 est une valeur valide
  items: number;

  // Défaut: true
  active: boolean;
}

function updateApp(config: Partial<AppConfiguration>) {
  // Avec l'opérateur de coalescence des nuls
  config.name = config.name ?? "(no name)";
  config.items = config.items ?? -1;
  config.active = config.active ?? true;

  // Sans l'opérateur de coalescence des nuls
  config.name = typeof config.name === "string" ? config.name : "(no name)";
  config.items = typeof config.items === "number" ? config.items : -1;
  config.active = typeof config.active === "boolean" ? config.active : true;

  // L'opérateur || pourrait retourner des valeurs incorrectes
  config.name = config.name || "(no name)"; // empêche de passer "" comme valeur
  config.items = config.items || -1; // empêche de passer 0 comme valeur
  config.active = config.active || true; // incorrect, sera toujours true
}

// Plus de détails sur l'opérateur de coalescence des nuls dans la version 3.7
// sur le blog:
//
// https://devblogs.microsoft.com/typescript/announcing-typescript-3-7/
