---
display: "Plugins"
oneline: "La lista dei plugin inclusi nel codice"
---

Lista dei language service plugin da eseguire all'interno dell'editor.

I language service plugin sono un modo di dare più informazioni all'utente riguardo i file TypeScript esistenti. Loro possono sfruttare i messaggi di TypeScript e dell'editor per creare i loro errori.

Per esempio:

- [ts-sql-plugin](https://github.com/xialvjun/ts-sql-plugin#readme) &mdash; Aggiunge Linting SQL con un generatore di stringhe SQL.
- [typescript-styled-plugin](https://github.com/Microsoft/typescript-styled-plugin) &mdash; Aggiunge Linting CSS all'interno delle stringhe di template.
- [typescript-eslint-language-service](https://github.com/Quramy/typescript-eslint-language-service) &mdash; Da un errore di eslint e il corrispettivo fix all'interno dell'output del compilatore.
- [ts-graphql-plugin](https://github.com/Quramy/ts-graphql-plugin) &mdash; Da validazione e autocompletamento all'interno delle stringhe con query GraphQL.

VS Code ha l'abilità grazie alle estensioni di [includere automaticamente i language service plugin](https://code.visualstudio.com/api/references/contribution-points#contributes.typescriptServerPlugins), quindi è probabile che ne stai già eseguendo alcuni nel tuo editor senza aver bisogno di definirli nel `tsconfig.json`.
