---
display: "Out Dir"
oneline: "Imposta una directory di output per tutti i file generati."
---

Se viene specificato, i file `.js` (così come `.d.ts`, `.js.map`, etc.) verrano emessi in questa directory.
E' preservata la struttura della directory dei file sorgente originali; controlla [rootDir](#rootDir) se
la root elaborata non è quella che quella che intendevi.

Se non specificato, i file `.js` verranno emessi nella stessa directory dei file `.ts` da cui
sono stati generati:

```sh
$ tsc

esempio
├── index.js
└── index.ts
```

Con un `tsconfig.json`così：

```json tsconfig
{
  "opzioniCompilatore": {
    "outDir": "dist"
  }
}
```

Eseguendo `tsc` con queste opzioni si andrà a spostare i file nella cartella `dist` specificata:

```sh
$ tsc

esempio
├── dist
│   └── index.js
├── index.ts
└── tsconfig.json
```
