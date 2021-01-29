---
display: "Permetti Import Sintetici Predefiniti"
oneline: "Permette di importare un modulo x da un modulo y’ quando un modulo non ha un’esportazione standard"
---

Quando è impostato a true, `allowSyntheticDefaultImports` permette di scrivere un import così:

```ts
import React from "react";
```

Al posto di:

```ts
import * as React from "react";
```

Quando un modulo **non** specifica esplicitamente un export predefinito.

Per esempio, senza `allowSyntheticDefaultImports` impostato a true:

```ts twoslash
// @errors: 1259 1192
// @checkJs
// @allowJs
// @esModuleInterop: false
// @filename: utilFunctions.js
// @noImplicitAny: false
const getStringLength = (str) => str.length;

module.exports = {
  getStringLength,
};

// @filename: index.ts
import utils from "./utilFunctions";

const count = utils.getStringLength("Check JS");
```

Questo codice segnala un errore perché un oggetto `default` che puoi importare non è presente.Anche se sembra che dovrebbe esserci. Per convenienza, se un oggetto `default` non è presente un transpiler come Babel automaticamente lo creerà.

```ts
// @filename: utilFunctions.js
const getStringLength = (str) => str.length;
const allFunctions = {
  getStringLength,
};

module.exports = allFunctions;
module.exports.default = allFunctions;
```

Questo flag non apporta cambiamenti al JavaScript emesso da TypeScript, è solo per controllare il tipo. Questa opzione porta il comportamento di TypeScript in linea con Babel emettendo un codice extra in modo di rendere l'uso di un export predefinito più ergonomico.
