---
display: "Controllo JS"
oneline: "Eseguire o verificare i tipi nel file .js del progetto"
---

Funziona insieme a `allowJs`. Quando `checkJs` è abilitato gli errori sono segnalati all'interno del file JavaScript. Questo sarebbe l'equivalente di includere `// @ts-check` all'inizio di ogni file JavaScript che è incluso nel tuo progetto.

Per esempio, questo codice JavaScript è errato secondo la definizione del tipo `parseFloat` che è presente su TypeScript:

```js
// parseFloat riceve solo una stringa
module.exports.pi = parseFloat(3.124)
```

Quando viene importato in un modulo TypeScript:

```ts twoslash
// @allowJs
// @filename: costanti.js
module.exports.pi = parseFloat(3.124);

// @filename: index.ts
import { pi } from "./costanti";
console.log(pi);
```

Non verranno segnalati errori. Tuttavia, se abiliti `checkJs` riceverai un messaggio di errore dal file JavaScript.

```ts twoslash
// @errors: 2345
// @allowjs: true
// @checkjs: true
// @filename: costanti.js
module.exports.pi = parseFloat(3.124);

// @filename: index.ts
import { pi } from "./costanti";
console.log(pi);
```

