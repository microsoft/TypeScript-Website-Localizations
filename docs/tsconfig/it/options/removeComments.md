---
display: "Rimuovere commenti"
oneline: "Rimuove commenti di TypeScript in modo da non venire visualizzati in JavaScript"

---

Rimuove tutti i commenti dai file TypeScript quando avviene la conversione in JavaScript. Il valore predefinito è `false`.

Per esempio, questo è un file TypeScript che ha un commento JSDoc:

```ts
/** Traduzione di 'Ciao mondo' in italiano. */
export const ciaoMondoIT = "Ciao mondo";
```

Quando `removeComments` è impostato su `true`:

```ts twoslash
// @showEmit
// @removeComments: true
/** Traduzione di 'Ciao mondo' in italiano. */
export const ciaoMondoIT = "Ciao mondo";
```

Senza aver impostato `removeComments` o averlo impostato su `false`:

```ts twoslash
// @showEmit
// @removeComments: false
/** Traduzione di 'Ciao mondo' in italiano. */
export const ciaoMondoIT = "Ciao mondo";
```

Ciò significa che i tuoi commenti verranno visualizzati nel codice JavaScript.