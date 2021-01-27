---
display: "Componi"
oneline: "Usato per creare varie build dello stesso progetto"
---

L'opzione `composite` applica delle regole che permettono agli strumenti di build (incluso Typescript stesso, sotto `--build` mode) di determinare velocemente se un progetto è già stato compilato.

Quando esso è attivato:

- L'opzione `rootDir`, se non impostata esplicitamente, imposta in modo predefinito la cartella in cui si trova il `tsconfig.json` file.

- Tutti i file implementati devono corrispondere ad un `include` o devono essere indicati nell'array `files`.  Se questa regola non viene rispettata, `tsc` ti informerà su quali file non sono stati specificati.

- `declaration` è predefinito su `true`

Puoi trovare la documentazione sui progetti TypeScript nella [guida](https://www.typescriptlang.org/docs/handbook/project-references.html).