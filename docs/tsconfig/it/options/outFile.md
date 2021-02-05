---
display: "File di output"
oneline: "Crea un solo file js che contiene tutti i file concatenati"
---

Se specificato, tutti i file  _global_ (non moduli) verranno concatenati in un unico file output specificato.

Se `module` è `system` o `amd`, tutti i file _module_ saranno concatenati in questo file dopo tutto il contenuto globale.

Nota: `outFile` non può essere a meno che `module` è `None`, `System`, o `AMD`.
Questa opzione _non può_ essere usata insieme a CommonJS o moduli ES6.
