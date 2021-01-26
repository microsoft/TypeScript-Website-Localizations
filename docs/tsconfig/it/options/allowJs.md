---
display: "Consentire JS"
oneline: "Consentire di importare i file .js"
---

Si può consentire ai file JavaScript di poter essere importati nel tuo progetto TypeScript. Per esempio, questo file JS:

```js twoslash
// @filename: carta.js
export const seme = 'Cuori';
```

Quando lo importi in un file TypeScript ti uscirà un errore:

```js twoslash
// @errors: 2307
// @filename: carta.js
module.exports.seme = "Cuori";
// ---cut---
// @filename: index.ts
import { seme } from "./carta";

console.log(seme);
```

Ma verrà importato senza errori con `allowJs` abilitato:

```js twoslash
// @filename: carta.js
module.exports.seme = "Cuori";
// ---cut---
// @allowJs
// @filename: index.ts
import { seme } from "./carta";

console.log(seme);
```

Questa opzione può essere usata come metodo per aggiungere file TypeScript in progetti JS permettendo ai file `.ts` e `.tsx` di coesistere con i file JavaScript esistenti.