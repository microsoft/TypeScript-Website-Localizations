---
display: "Iterazione di livello inferiore"
oneline: "Emette Javascript compatibile e più dettagliato per oggetti iterativi"
---

Iterazione di livello inferiore, o Downleveling, è un termine di TypeScript utilizzato per migrare verso una versione precedente di JavaScript. Questa flag permette quindi di supportare una più accurata implementazione di come il JavaScript moderno itera i nuovi concetti in versioni precedenti di JavaScript in runtime.   

ECMAScript 6 aggiunge una serie di nuove iterazioni primitive: il `for / of` loop (`for (el of arr)`), spread di Array (`[a, ...b]`), spread di argomenti (`fn (... args)`) e [`Symbol.iterator`](https://medium.com/trainingcenter/iterators-em-javascript-880adef14495).`--downlevelIteration` permette a queste iterazioni primitive di essere utilizzate in modo più accurrato in un ambiente ES5 se un'implementazione di [`Symbol.iterator`](https://medium.com/trainingcenter/iterators-em-javascript-880adef14495) è presente.

#### Esempio: Effetti su `for / of`    

Con questo codice TypeScript:

```js
const str = "Ciao!";
for (const s of str) {
  console.log(s);
}
```

Senza `downlevelIteration` attivo, un loop `for / of` su un qualsiasi oggetto viene convertito in un tradizionale `for` loop:

```ts twoslash
// @target: ES5
// @showEmit
const str = "Ciao!";
for (const s of str) {
  console.log(s);
}
```

Generalmente tutti si aspettano questo, tuttavia non è compatibile al 100% con il protocollo di iterazione ECMAScript 6. Certe string, ad esempio un emoji (😜), hanno un `.length` di 2 (o anche di più!), ma dovrebbero iterare come 1 unità in un `for-of` loop. Guarda [questo blog post di Jonathan New](https://blog.jonnew.com/posts/poo-dot-length-equals-two) per una spiegazione più dettagliata.

Quando `downlevelIteration` è attivo, TypeScript utilizzerà una funzione ausiliaria che andrà a controllare la presenza di un `Symbol.iterator` (che può essere di tipo nativo o polyfill). Nel caso in cui questa implementazione non ci sia, ritornerai ad un'iterazione index-based.  

```ts twoslash
// @target: ES5
// @downlevelIteration
// @showEmit
const str = "Ciao!";
for (const s of str) {
  console.log(s);
}
```

Puoi utilizzare [tslib](https://www.npmjs.com/package/tslib) via [importHelpers](https://www.typescriptlang.org/tsconfig#importHelpers) in modo da ridurre il numero di righe inline Javascript:

```ts twoslash
// @target: ES5
// @downlevelIteration
// @importHelpers
// @showEmit
const str = "Ciao!";
for (const s of str) {
  console.log(s);
}
```

> > **Nota:** attivare `downlevelIteration` non andrà a migliorare le prestazioni di compliazione se `Symbol.iterator` non è presente in runtime.

#### Esempio: Effetti sullo spray di Array

Questo è un spread di array:

```js
// Crea un nuovo array composto dall'elemento 1 seguito dagli elementi di arr2
const arr = [1, ...arr2];
```

Secondo la descrizione, sembra facile convertirlo in ES5:

```js
// Stessa cosa, no?
const arr = [1].concat(arr2);
```

Tuttavia, questo è visibilmente diverso in certi rari casi. Ad esempio, nel caso un array abbia un "buco", l'index mancante andrà a creare una proprietà *own* nel caso si decida di applicare uno spread, ma non se creato utilizzando `.concat`:

```js
// Crea un array dove manca l'elemento '1'
let mancante = [0, , 1];
let spread = [...mancante];
let concatenato = [].concat(mancante);

// true
"1" in spread;
// false
"1" in concatenato;
```

Proprio come un `for / of`, `downlevelIteration` andrà ad usare `Symbol.iterator` (se presente) in modo da emulare in modo più preciso il comportamento di ES 6.
