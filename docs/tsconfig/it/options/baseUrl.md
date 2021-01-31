---
display: "URL Di Base"
oneline: "Imposta un URL di base per i nomi dei moduli relativi"
---

Ti permette di definire una directory di base per risolvere i nomi dei moduli non assoluti.

Puoi definire una cartella root dove puoi fare una risoluzione dei file assoluta. Per esempio.

```
URLBase
├── ex.ts
├── ciao
│   └── mondo.ts
└── tsconfig.json
```

Con `"baseUrl": "./"` dentro il progetto, TypeScript andrà a procurare i file iniziando dalla stessa cartella in cui si trova `tsconfig.json`.

```ts
import { ciaoMondo } from "ciao/mondo";

console.log(ciaoMondo);
```

Se ti stanchi sempre di vedere i import come `"../"` o `"./"`. O che devi sempre cambiargli quando sposti i file, questo è un ottimo modo per risolvere il problema.
