---
display: "explainFiles"
oneline: "Imprime os arquivos lidos durante a compilação juntamente com o motivo de sua inclusão."
---

Imprime os nomes dos arquivos que o TypeScript reconhece como parte do seu projeto e a razão pela qual são partes da compilação.

Por exemplo, neste projeto com apenas um simples arquivo `index.ts`

```sh
example
├── index.ts
├── package.json
└── tsconfig.json
```

Usando um `tsconfig.json` que tem `explainFiles` configurado como true:

```json
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "explainFiles": true
  }
}
```

Executando o TypeScript nesta pasta teremos uma saída semelhante à essa:

```
❯ tsc
node_modules/typescript/lib/lib.d.ts
  Default library for target 'es5'
node_modules/typescript/lib/lib.es5.d.ts
  Library referenced via 'es5' from file 'node_modules/typescript/lib/lib.d.ts'
node_modules/typescript/lib/lib.dom.d.ts
  Library referenced via 'dom' from file 'node_modules/typescript/lib/lib.d.ts'
node_modules/typescript/lib/lib.webworker.importscripts.d.ts
  Library referenced via 'webworker.importscripts' from file 'node_modules/typescript/lib/lib.d.ts'
node_modules/typescript/lib/lib.scripthost.d.ts
  Library referenced via 'scripthost' from file 'node_modules/typescript/lib/lib.d.ts'
index.ts
  Matched by include pattern '**/*' in 'tsconfig.json'
```

A saída acima mostra:

- The initial lib.d.ts lookup based on [`target`](#include), and the chain of `.d.ts` files which are referenced
- The `index.ts` file located via the default pattern of [`include`](#include)

Esta opção é destinada à depurar como um arquivo se tornou parte de sua compilação.