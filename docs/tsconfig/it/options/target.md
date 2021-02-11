---
display: "Target"
oneline: "Imposta il runtime del linguaggio JavaScript supportato da compliare"
---

I browser moderni supportano tutte le nuove funzionalità di ES6, quindi `ES6` è una buona scelta.
Puoi scegliere di impostare un target inferiore se il tuo codice viene eseguito in ambienti più datati, o impostare un target superiore se il tuo codice è in grado di essere eseguito in ambienti più recenti.

La configurazione del `target` cambierà quali caratteristiche di JS verranno declassate e quali rimarranno intatte.
Per esempio, una funzione a freccia `() => this` verrà trasformata in un'espressione `function` equivalente se il `target` è ES5 o inferiore.

Cambiando il `target` cambia anche il valore predfinito di [`lib`](#lib).
E' possibile "mescolare ed abbinare" le impostazioni di `target` e `lib` come si desidera, ma è possibile semplicemente impostare il `target`, per comodità.

Se si sta utilizzando soltanto Node.js, si consiglia la versione di `target` sviluppata specificamente per Node:

| Nome    | Target Supportato|
| ------- | ---------------- |
| Node 8  | `ES2017`         |
| Node 10 | `ES2018`         |
| Node 12 | `ES2019`         |

Si basano sul database di supporto di [node.green](https://node.green).

Il valore speciale `ESNext` si riferisce alla versione più alta supportata dalla tua versione di TypeScript.
Questa configurazione deve essere utilizzata con cautela, poiché non ha lo stesso siginificato tra le diverse versioni di TypeScript e può rendere gli aggiornamenti meno prevedibili.
