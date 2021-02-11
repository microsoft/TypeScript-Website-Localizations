---
display: "Source Map"
oneline: "Cria mapas de código para os arquivos JavaScript emitidos"

---

Permette la generazione delle [sourcemap](https://developer.mozilla.org/en-US/docs/Tools/Debugger/How_to/Use_a_source_map). Questi file consentono al debugger ed ad altri strumenti di mostrare il codice TypeScript originale quando stai lavorando con il codice JavaScript generato. I file sourcemap sono generati come file `js.map` (o `jsx.map`) relativi al file `.js` corrispondente.

I file `.js` verranno abilitati contenendo un commento sourcemap che indica gli strumenti dove i file sono strumenti esterni. Per esempio:

```ts
// helloWorld.ts
export declare const helloWorld = "Ciao";
```

Compilando come `sourceMap` impostata a `true`, crea il corrispondente file JavaScript:

```js
// helloWorld.js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.helloWorld = "Ciao";
//# sourceMappingURL=// helloWorld.js.map
```

E questo inoltre genererà questo json:

```json
// helloWorld.js.map
{
  "version": 3,
  "file": "ex.js",
  "sourceRoot": "",
  "sources": ["../ex.ts"],
  "names": [],
  "mappings": ";;AAAa,QAAA,UAAU,GAAG,IAAI,CAAA"
}
```
