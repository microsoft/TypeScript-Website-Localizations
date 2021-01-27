---
display: "Permetti Accesso Globale UMD"
oneline: "Rende tutte le importazioni UMD disponibili globalmente"
---

Quando viene impostato a `true`, il flag `allowUmdGlobalAccess` ti permette ad accedere ai export UMD come globali dentro l'archivio dei moduli. Un file modulo è un file che ha dei imports e/o exports. Senza questo flag per usare un export di un modulo UMD è necessario dichiarare un import.

Un esempio di utilizzo di questo flag è un progetto web dove si conoscono le librerie particolari (come jQuery o Lodash) che saranno sempre disponibili al runtime, ma non puoi accedervi con un'import.