---
display: "Incrementale"
oneline: "Crea dei file .tsbuildinfo per permettere la compilazione incrementale del progetto"
---

Dice a TypeScript di salvare le informazioni riguardo il grafo del progetto dall'ultima compliazione nei file salvati nel disco.
Questo crea una serie di file `.tsbuildinfo` nella stessa cartella del risultato della compilazione. Essi non vengono usati dal tuo JavaScript durante l'esecuzione e possono essere tranquillamente eliminati. Puoi saperne di più riguardo questa flag nelle [3.4 note di rilascio](/docs/handbook/release-notes/typescript-3-4.html#faster-subsequent-builds-with-the---incremental-flag).

Per scegliere in che cartella vuoi i tuoi file compilati, usa l'opzione di configurazione [`tsBuildInfoFile`](#tsBuildInfoFile).
