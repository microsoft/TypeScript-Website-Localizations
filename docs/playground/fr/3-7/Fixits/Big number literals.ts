//// {  "compiler": {    "target": 99  },  "order": 1}

// Saviez vous qu'il existe une limite à la taille des nombres qu'il est possible
// de représenter en JavaScript ?

const maxHighValue = 9007199254740991;
const maxLowValue = -9007199254740991;

// Si vous augmentez / diminuez d'une unité ces nombres vous commencez a courir un
// risque.

const oneOverMax = 9007199254740992;
const oneBelowMin = -9007199254740992;

// La solution pour manipuler des nombres de cette taille est de les convertir en
// BigInts:
//
// https://developer.mozilla.org/fr/docs/orphaned/Web/JavaScript/Reference/Global_Objects/BigInt

// TypeScript désormais propose une correction automatique, pour des nombres
// supérieurs à 2^52 (positif / negatif).
// Cette correction automatique ajoute le suffixe "n", ce qui informe JavaScript
// que le type doit être BigInt.

// Nombres
9007199254740993;
-9007199254740993;
9007199254740994;
-9007199254740994;

// Nombres hexadécimaux
0x19999999999999;
-0x19999999999999;
0x20000000000000;
-0x20000000000000;
0x20000000000001;
-0x20000000000001;
