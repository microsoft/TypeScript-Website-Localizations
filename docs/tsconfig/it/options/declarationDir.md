---
display: "Directory dichiarazioni"
oneline: "Definisce la directory principale per i file .d.ts"
---

Offre una maniera di configurare la directory root in cui salvare i file di dichiarazione.

```
esempio
├── index.ts
├── package.json
└── tsconfig.json
```

con questo `tsconfig.json`:

```json tsconfig
{
  "compilerOptions": {
    "declaration": true,
    "declarationDir": "./tipi"
  }
}
```

Inserira i file `d.ts` per `index.ts` in una cartella `tipi`:

```
esempio
├── index.js
├── index.ts
├── package.json
├── tsconfig.json
└── tipi
    └── index.d.ts
```
