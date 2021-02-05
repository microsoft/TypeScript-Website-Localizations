---
display: "Libreria"
oneline: "Include le definizioni di disponibili nel runtime di JavaScript"
---

TypeScript include una serie di definizioni tipo per API già incorporate in JS (come `Math`), o definizioni tipo per ambienti di sviluppo web (come `document`).
TypeScript include anche API per le nuove funzionalità JS abbinandole al `target` specificato; per esempio il termine `Map` è disponibile se il `target` è `ES6` o una versione più recente.

Potresti volerli cambiare per alcuni motivi:  

- Il tuo programma non gira su un browser, quindi non vuoi le definizioni di tipo `"dom"`
- La tua piattaforma di esecuzione fornisce alcuni oggetti API di JavaScript (magari attraverso dei polyfill), ma non supporta la completa sintassi di una determinata versione di ECMAScript
- Hai una serie di polyfill o implementazioni native per alcuni, ma non tutti, per una versione ECMAScript di livello superiore

### Librerie di alto livello  

| Nomi         | Contenuti                                                                                                                                          |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ES5`        | Definizioni di base per tutte le funzionalità ES3 e ES5                                                                                                |
| `ES2015`     | APIs aggiuntive disponibili in ES2015 (conosciuto anche come ES6) - `array.find`, `Promise`, `Proxy`, `Symbol`, `Map`, `Set`, `Reflect`, etc.               |
| `ES6`        | Alias per "ES2015"                                                                                                                                |
| `ES2016`     | APIs aggiuntive dispinibili in ES2016 - `array.include`, etc.                                                                                       |
| `ES7`        | Alias per "ES2016"                                                                                                                                |
| `ES2017`     | APIs aggiuntive disponibili in ES2017 - `Object.entries`, `Object.values`, `Atomics`, `SharedArrayBuffer`, `date.formatToParts`, array tipizzati, etc. |
| `ES2018`     | APIs aggiuntive disponibili in ES2018 - `async` iterables, `promise.finally`, `Intl.PluralRules`, `rexexp.groups`, etc.                             |
| `ES2019`     | APIs aggiuntive disponibili in ES2019 - `array.flat`,` array.flatMap`, `Object.fromEntries`, `string.trimStart`, `string.trimEnd`, etc.             |
| `ES2020`     | APIs aggiuntive disponibili in ES2020 - `string.matchAll`, etc.                                                                                     |
| `ESNext`     | APIs aggiuntive disponibili in ESNext - Questo cambia con l'evoluzione delle specifiche di JavaScript                                                       |
| `DOM`        | Definizioni [DOM](https://developer.mozilla.org/docs/Glossary/DOM) - `window`, `document`, etc.                                                   |
| `WebWorker`  | APIs disponibili in contesti [Web Worker](https://developer.mozilla.org/docs/Web/API/Web_Workers_API/Using_web_workers)                              |
| `ScriptHost` | APIs per il [Windows Script Hosting System](https://wikipedia.org/wiki/Windows_Script_Host)                                                      |

### Componenti di librerie individuali 

| Nome                      |
| ------------------------- |
| `DOM.Iterable`            |
| `ES2015.Core`             |
| `ES2015.Collection`       |
| `ES2015.Generator`        |
| `ES2015.Iterable`         |
| `ES2015.Promise`          |
| `ES2015.Proxy`            |
| `ES2015.Reflect`          |
| `ES2015.Symbol`           |
| `ES2015.Symbol.WellKnown` |
| `ES2016.Array.Include`    |
| `ES2017.object`           |
| `ES2017.Intl`             |
| `ES2017.SharedMemory`     |
| `ES2017.String`           |
| `ES2017.TypedArrays`      |
| `ES2018.Intl`             |
| `ES2018.Promise`          |
| `ES2018.RegExp`           |
| `ES2019.Array`            |
| `ES2019.Full`             |
| `ES2019.Object`           |
| `ES2019.String`           |
| `ES2019.Symbol`           |
| `ES2020.Full`             |
| `ES2020.String`           |
| `ES2020.Symbol.wellknown` |
| `ESNext.AsyncIterable`    |
| `ESNext.Array`            |
| `ESNext.Intl`             |
| `ESNext.Symbol`           |  


Questa lista potrebbe non essere aggiornata, puoi vedere la lista completa nel [codice sorgente di TypeScript](https://github.com/microsoft/TypeScript/tree/master/lib).
