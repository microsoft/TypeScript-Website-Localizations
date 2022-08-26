//// {  "compiler": {},  "order": 3}

// Les messages d'erreur TypeScript peuvent être un peu verbeux...
// Avec la version 3.7, nous avons corrigé quelques cas qui
// généraient des messages d'erreurs très longs.

// Propriétés imbriquées

let a = { b: { c: { d: { e: "string" } } } };
let b = { b: { c: { d: { e: 12 } } } };

a = b;

// Auparavant, c'était deux lignes de code par propriété imbriquée, ce qui
// a rapidement amené les gens à lire
// uniquement la première et dernière ligne des messages d'erreur.

// Maintenant elles sont en ligne. :tada:

// Auparavant avec la version 3.6:
//
// Type '{ b: { c: { d: { e: number; }; }; }; }' is not assignable to type '{ b: { c: { d: { e: string; }; }; }; }'.
//   Types of property 'b' are incompatible.
//     Type '{ c: { d: { e: number; }; }; }' is not assignable to type '{ c: { d: { e: string; }; }; }'.
//       Types of property 'c' are incompatible.
//         Type '{ d: { e: number; }; }' is not assignable to type '{ d: { e: string; }; }'.
//           Types of property 'd' are incompatible.
//             Type '{ e: number; }' is not assignable to type '{ e: string; }'.
//               Types of property 'e' are incompatible.
//                 Type 'number' is not assignable to type 'string'

// Ça peut aussi marcher avec des objets de types différents
// et toujours donner un message d'erreur utile et concis.

class ExampleClass {
  state = "ok";
}

class OtherClass {
  state = 12;
}

let x = { a: { b: { c: { d: { e: { f: ExampleClass } } } } } };
let y = { a: { b: { c: { d: { e: { f: OtherClass } } } } } };
x = y;

// Auparavant avec la version 3.6:
//
// Type '{ a: { b: { c: { d: { e: { f: typeof OtherClass; }; }; }; }; }; }' is not assignable to type '{ a: { b: { c: { d: { e: { f: typeof ExampleClass; }; }; }; }; }; }'.
//   Types of property 'a' are incompatible.
//     Type '{ b: { c: { d: { e: { f: typeof OtherClass; }; }; }; }; }' is not assignable to type '{ b: { c: { d: { e: { f: typeof ExampleClass; }; }; }; }; }'.
//       Types of property 'b' are incompatible.
//         Type '{ c: { d: { e: { f: typeof OtherClass; }; }; }; }' is not assignable to type '{ c: { d: { e: { f: typeof ExampleClass; }; }; }; }'.
//           Types of property 'c' are incompatible.
//             Type '{ d: { e: { f: typeof OtherClass; }; }; }' is not assignable to type '{ d: { e: { f: typeof ExampleClass; }; }; }'.
//               Types of property 'd' are incompatible.
//                 Type '{ e: { f: typeof OtherClass; }; }' is not assignable to type '{ e: { f: typeof ExampleClass; }; }'.
//                   Types of property 'e' are incompatible.
//                     Type '{ f: typeof OtherClass; }' is not assignable to type '{ f: typeof ExampleClass; }'.
//                       Types of property 'f' are incompatible.
//                         Type 'typeof OtherClass' is not assignable to type 'typeof ExampleClass'.
//                           Type 'OtherClass' is not assignable to type 'ExampleClass'.
//                             Types of property 'state' are incompatible.
//                               Type 'number' is not assignable to type 'string'
