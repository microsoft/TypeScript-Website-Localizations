//// {  "compiler": {    "noImplicitAny": false  },  "order": 2}

// Avec TypeScript 3.7 la correction automatique 'infer from usage'
// s'améliore. Elle utilisera désormais une liste de types importants
//  (string, number, array, Promise)
// et déduira si l'usage du type correspond a l'API de ces objets

// Au sein des examples suivants, sélectionnez les paramètres des fonctions,
// cliquez sur l'icône en forme d'ampoule et choisissez
// "Infer Parameter types..."

// Déduire une liste de nombres:

function pushNumber(arr) {
  arr.push(12);
}

// Déduire une promesse:

function awaitPromise(promise) {
  promise.then((value) => console.log(value));
}

// Déduire le type d'une fonction et son type de retour

function inferAny(app) {
  const result = app.use("hi");
  return result;
}

// Déduire une liste de chaines de caractères, car une chaîne de caractères a été
// ajoutée a cette liste:

function insertString(names) {
  names[1] = "hello";
}
