---
display: "Moduli Isolati"
oneline: "Si assicura che ogni file possa essere compilato in sicurezza senza basarsi sulle altre importazioni"
---

Quando usi TypeScript per produrre codice JavaScript, è usanza comune usare altri transpilers come ad esempio [Babel](https://babeljs.io).
Tuttavia, gli altri transpilers possono operare solo su un singolo file alla volta, questo significa che non possono fare cambiamenti che dipendono dalla comprensione dell'intero progetto. 
Questa regola si applica anche al `ts.transpileModule` API di TypeScript che è usata da alcuni strumenti di esecuzione.

Queste limitazioni possono causare problemi di esecuzione con alcune funzionalità di TypeScript come `const enum` e `namespace`.
Impostando la flag `isolatedModules` chiedi a TypeScript di avvisarti se stai scrivendo del codice che non può essere correttamente interpretato da un processo di transpilation su un singolo file.

Esso non cambia la forma del tuo codice e nemmeno la forma del controllo di TypeScript e il processo di emissione.

Alcuni esempi di codice che non funzionano quando `isolatedModules` è abilitato.

#### Esportazione di idententificatori senza valore

In TypeScript, puoi importare un _type_ e di conseguenza esportarlo:

```ts twoslash
// @noErrors
import { tipo, funzione } from "modulo";

funzione();

export { tipo, funzione };
```

Dato che non ci sono valori per `tipo`, l'emissione `export` non proverà ad esportarlo (questo perché ci sarebbe un errore di esecuzione in JavaScript):

```js
export { funzione };
```

I transpilers a singolo file non sanno se `tipo` produce un valore o meno, quindi c'è un errore nell'esportazione di un nome che si riferisce solo ad un tipo.

#### File Non-Moduli

Se `isolatedModules` è impostato, tutti file di implementazione devono essere _modules_ (ciò significa che esso ha alcune forme di `import` / `export`). Un errore appare se nessun file è un modulo:

```ts twoslash
// @errors: 1208
// @isolatedModules
function fn() {}
```

Questa regola non viene applicata ai file `.d.ts`

#### Riferimenti ai membri `const enum`

In TypeScript, quando ti riferisci ad un membro `const enum`, il riferimento viene rimpiazzato dal suo valore attuale nel JavaScript compilato. Cambiando questo TypeScript:

```ts twoslash
declare const enum Numeri {
  Zero = 0,
  Uno = 1,
}
console.log(Numeri.Zero + Numeri.Uno);
```

Con questo JavaScript:

```ts twoslash
// @showEmit
// @removeComments
declare const enum Numeri {
  Zero = 0,
  Uno = 1,
}
console.log(Numeri.Zero + Numeri.Uno);
```

Senza la conoscenza del valore di questi membri, gli altri transpilers non possono rimpiazzare il riferimento a `Numeri`, questo comporterebbe un errore di esecuzione se lasciato a se stesso (dal momento in cui non ci sono oggetti di tipo `Numeri` in esecuzione).
A causa di questo, quando `isolatedModules` è impostato, c'è un errore nel riferire un ambiente ad un membro `const enum`.
