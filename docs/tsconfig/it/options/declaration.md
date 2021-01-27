---
display: "Dichiarazione"
oneline: "Creazione di file d.ts per gestire le importazioni di un progetto"
---

Si possono creare dei file `.d.ts` per ogni file TypeScript o JavaScript all'interno del tuo progetto. 
Questi file `.d.ts` contengono delle definizioni dei file che descrivono l'API esterna al tuo modulo. 
Con i file `.d.ts`, strumenti come TypeScript possono dare intellisense e suggerimenti sui tipi per il codice senza tipo.

Quando `declaration` è impostato su `true`, eseguendo il compilatore con questo codice TypeScript:

```ts twoslash
export let ciaoMondo = "Ciao!";
```

Esso genererà un file `index.js` come questo:

```ts twoslash
// @showEmit
export let ciaoMondo = "Ciao!";
```

Con un corrispondente `ciaoMondo.d.ts`:

```ts twoslash
// @showEmittedFile: index.d.ts
// @showEmit
// @declaration
export let ciaoMondo: string;
```

Quando si lavora con i file `.d.ts` insieme ai file JavaScript potresti voler usare [`emitDeclarationOnly`](#emitDeclarationOnly) o [`outDir`](#outDir) per essere sicuro che i file JavaScript non vengano sovrascritti.
