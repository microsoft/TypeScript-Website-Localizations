---
title: "Global: Módulo de modificação"
layout: docs
permalink: /pt/docs/handbook/declaration-files/templates/global-modifying-module-d-ts.html
---

## _Módulos de modificação global_

Um _módulo de modificação global_ altera valores existentes no escopo global quando são importados.
Por exemplo, pode existir uma biblioteca que adiciona novos membros ao `String.prototype` quando importada.
Este padrão é de certa forma perigoso devido a possibilidade de conflitos em tempo de execução,
mas ainda assim podemos escrever um arquivo de declaração para isso.

## Identificando módulos de modificação global

Módulos de modificação global são geralmente fáceis de identificar em sua documentação.
No geral, são similares a plugins globais, mas precisam de uma chamada `require` para ativar seus efeitos.

Você pode ver uma documentação como essa:

```js
// chamada ao 'require' que não utiliza o valor retornado
var unused = require("magic-string-time");
/* ou */
require("magic-string-time");

var x = "hello, world";
// Cria novos métodos em tipos nativos
console.log(x.startsWithHello());

var y = [1, 2, 3];
// Cria novos métodos em tipos nativos
console.log(y.reverseAndSort());
```

Aqui está um exemplo

```ts
// Definições de tipo para [~NOME DA BIBLIOTECA~] [~NÚMERO DE VERSÃO OPCIONAL~]
// Projeto: [~NOME DO PROJETO~]
// Definições por: [~SEU NOME~] <[~UMA URL PARA VOCÊ~]>

/*~ Esse é o arquivo de modelo do módulo de modificação global. Você deve renomeá-lo para index.d.ts
 *~ e colocá-lo em uma pasta com o mesmo nome do módulo.
 *~ Por exemplo, se você estiver escrevendo um arquivo para "super-greeter", este
 *~ arquivo deve estar em 'super-greeter/index.d.ts'
 */

/*~ Observação: Se seu módulo de modificação global é passível de ser chamado ou instanciado, você
 *~ precisará combinar os padrões daqui com aqueles arquivos de modelo na classe ou função de módulo
 */

declare global {
  /*~ Aqui, declare coisas que vão no namespace global, ou aumente
   *~ as declarações existentes no namespace global
   */
  interface String {
    fancyFormat(opts: StringFormatOptions): string;
  }
}

/*~ Se seu módulo exporta tipos ou valores, escreva-os como de costume */
export interface StringFormatOptions {
  fancinessLevel: number;
}

/*~ Por exemplo, declarando um método no módulo (além dos seus efeitos colaterais globais) */
export function doSomething(): void;

/*~ Se seu módulo não exportar nada, você precisara dessa linha. Caso contrário, exclua-a  */
export {};
```
