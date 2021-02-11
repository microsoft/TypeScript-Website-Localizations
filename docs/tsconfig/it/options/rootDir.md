---
display: "Cartella Root"
oneline: "Definizione della cartella di root e delle sue impostazioni"
---

**Default**: Il più lungo percorso comune di tutti i file di input di non dichiarazione. Se `composite` è impostato, il default è invece la cartella che contiene il file `tsconfig.json`.

Quando TypeScript compila i file, esso mantiene la stessa struttura delle cartelle che è presente nei file di input, anche nei file di output.

Per esempio, mettiamo caso che hai alcuni file di input:

```
MioProj
├── tsconfig.json
├── core
│   ├── a.ts
│   ├── b.ts
│   ├── sub
│   │   ├── c.ts
├── types.d.ts
```

Il valore predifinito di `rootDir` è il più lungo percorso comune di tutti i file non dichiarativi, quindi in questo caso è `core/`.

Se la tua `outDir` era `dist`, TypeScript avrebbe dovuto scrivere questa struttura:

```
MioProj
├── dist
│   ├── a.js
│   ├── b.js
│   ├── sub
│   │   ├── c.js
```

Tuttavia, potresti aver impostato `core` come parte della struttura della cartella di output.
Definendo `rootDir: "."` in `tsconfig.json`, TypeScript crea questa struttura:

```
MioProj
├── dist
│   ├── core
│   │   ├── a.js
│   │   ├── b.js
│   │   ├── sub
│   │   │   ├── c.js
```

Importante, `rootDir` **non interferisce con i file che diventano parte della compilazione**, esso non ha interazioni con `include`, `exclude`, o con i `file` `tsconfig.json`.

Ricorda che TypeScript non creerà mai un file di output in una cartella fuori da `outDir`, e non salterà mai la creazione di un file.
Per questo motivo, `rootDir` costringe tutti i file di output ad essere emessi all'interno di `rootDir`.

Per esempio, mettiamo caso tu abbia questa struttura:

```
MioProj
├── tsconfig.json
├── core
│   ├── a.ts
│   ├── b.ts
├── aiutanti.ts
```

Sarebbe un errore specificare `rootDir` come `core` _e_ `include` come `*`, perché esso crea un file (`aiutanti.ts`) che ha bisogno di essere emesso _fuori_ da `outDir` (i.e. `../aiutanti.js`).
