---
display: "Permetti Label Non Utilizzati"
oneline: "Visualizza un errore quando un'etichetta viene creata accidentalmente"
---

Imposta a False per disattivare le avvertenze riguardo label non utilizzati.

In JavaScript i label sono molto rari e tipicamente indicano un tentativo di scrivere un oggetto letterale:

```ts twoslash
// @errors: 7028
// @allowUnusedLabels: false
function verificaEta(eta: number) {
  // Il 'return' non è presente
  if (eta > 18) {
    verificato: true;
  }
}
```
