---
display: "Importazione di Aiuti"
oneline: "Permette di importare alcune funzioni ausiliari per il progetto"

---

TypeScript da alcuni suggerimenti per operazioni di livello inferiore come ad esempio estendere classi, spread di array o oggetti, e operazioni asincrone. In modo predefinito, questi suggerimenti vengono dati nei file che usano le operazioni elencate in precedenza. Tuttavia, nel caso in cui lo stesso suggerimento è usato in più moduli diversi, si possono verificare alcuni casi di duplicazione del codice.

Se l'opzione `importHelpers` è attiva, queste funzionalità ausiliari vengono importate dal modulo [tslib](https://www.npmjs.com/package/tslib). Dovrai assicurarti che il modulo `tslib` è in grado di essere importato in runtime. Questo riguarda solo i moduli; I file degli script globali non proveranno ad importare i moduli.

Per esempio, con questo codice TypeScript:


```ts
export function fn(arr: number[]) {
  const arr2 = [1, ...arr];
}
```

Attivando [`downlevelIteration`](#downlevelIteration), esso rimane falso:

```ts twoslash
// @showEmit
// @target: ES5
// @downleveliteration
export function fn(arr: number[]) {
  const arr2 = [1, ...arr];
}
```

Poi attivando entrambi [`downlevelIteration`](#downlevelIteration) e `importHelpers`:

```ts twoslash
// @showEmit
// @target: ES5
// @downleveliteration
// @importhelpers
// @noErrors
export function fn(arr: number[]) {
  const arr2 = [1, ...arr];
}
```

Puoi utilizzare [`noEmitHelpers`](#noEmitHelpers) quando metti a disposizione la tua implementazione di queste funzioni.