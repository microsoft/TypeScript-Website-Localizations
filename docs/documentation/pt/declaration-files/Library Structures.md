---
title: Estrutura de Bibliotecas
layout: docs
permalink: /pt/docs/handbook/declaration-files/library-structures.html
oneline: Como estruturar seus arquivos .d.ts
---

Amplamente falando, a forma como você _constrói_ seus arquivos de declaração depende de como a biblioteca é consumida.
Há muitas formas de distribuir uma biblioteca para consumo em JavaScript, e você precisará escrever seus arquivos de declaração correspondentes.
Esse guia cobre como identificar padrões comuns de bibliotecas e como escrever arquivos de declaração que correspondem a cada padrão.

Cada principal tipo de construção de biblioteca tem um arquivo correspondente na seção dos [Templates](/docs/handbook/declaration-files/templates.html).
Você pode começar com esses templates para acelerar o processo.

## Identificando Tipos de Bibliotecas

Primeiro, vamos revisar quais tipos de bibliotecas os arquivos de declaração do Typescript podem representar.
Vamos mostrar brevemente como cada tipo de biblioteca é _usado_, como é _escrito_ e listar algumas bibliotecas de exemplo do mundo real.

Identificar a estrutura da biblioteca é o primeiro passo para escrever seu arquivo de declaração.
Nós daremos dicas em como identificar estruturas baseado no _uso_ e no _código.
Dependendo da organização de documentação da biblioteca, uma pode ser mais fácil do que outra.
Recomendamos usar oq ue for mais confortável para você.

### O que você deve procurar?

Algumas perguntas para fazer a si mesmo enquanto olha para uma biblioteca que você está tentando tipar.

1. Como você obtém a biblioteca?

   Por exemplo, você pode consegui-la _apenas_ pelo npm ou apenas por uma CDN?

2. Como você importa ela?

   Ela adiciona um objecto global? Você usa o `require` ou os comandos `import`/`export`?

### Exemplos menores para diferentes tipos de bibliotecas

### Bibliotecas Modulares

Quase todas as bibliotecas modernas do Node.js se encaixam na família modular.
Esse tipo de bibliotecas funcionam apenas num ambiente JavaScript com um carregador de módulos.
Por exemplo, `express` só funciona no Node.js e precisa ser carregado usando a função `require` do CommonJS.

ECMAScript 2015 (também conhecido como ES2015, ECMAScript 6 e ES6), CommonJS e RequireJS tem formas similares de _importar_ um _módulo_.
Em JavaScript CommonJS (Node.js), por exemplo, você escreveria:

```js
var fs = require("fs");
```

Em Typescript ou ES6, a palavra chave `import` tem o mesmo propósito:

```ts
import * as fs from "fs";
```

Você vai tipicamente ver bibliotecas modulares incluírem linhas como essa em suas documentações:

```js
var algumaBiblioteca = require("algumaBiblioteca");
```

ou

```js
define(..., ['algumaBiblioteca'], function(algumaBiblioteca) {

});
```

Assim como os módulos globais, você pode ver esses exemplos na documentção de um [módulo UMD](#umd), então tenha certeza de checar o código ou a documentação.

#### Identificando Uma Biblioteca Modular Pelo Código

Bibliotecas modulares vão tipicamente satisfazer pelo menos uma das condições seguintes:

- Chamadas incondicionais do `require` ou `define`
- Declarações como `import * as a from 'b'` ou `export c;`
- Atribuições para `exports` ou `module.exports`

Elas raramente terão:

- Atribuições para propriedades do `window` ou `global`

#### Templates Para Módulos

Há quatro templates disponíveis para módulos,
[`module.d.ts`](/docs/handbook/declaration-files/templates/module-d-ts.html), [`module-class.d.ts`](/docs/handbook/declaration-files/templates/module-class-d-ts.html), [`module-function.d.ts`](/docs/handbook/declaration-files/templates/module-function-d-ts.html) e [`module-plugin.d.ts`](/docs/handbook/declaration-files/templates/module-plugin-d-ts.html).

Você deveria ler primeiro [`module.d.ts`](/docs/handbook/declaration-files/templates/module-d-ts.html) para um entendimento da forma de que todos funcionam.

Então use o template [`module-function.d.ts`](/docs/handbook/declaration-files/templates/module-function-d-ts.html) se seu módulo pode ser _chamado_ como uma função:

```js
const x = require("foo");
// Nota: chamando 'x' como uma função
const y = x(42);
```

Use o template [`module-class.d.ts`](/docs/handbook/declaration-files/templates/module-class-d-ts.html) se seu módulo pode ser _construído_ usando `new`:

```js
const x = require("bar");
// Nota: usando o operador 'new' na variável importada
const y = new x("oi");
```

Se você tem um módulo que quando importado, faz mudanças em outros módulos use o template [`module-plugin.d.ts`](/docs/handbook/declaration-files/templates/module-plugin-d-ts.html):

```js
const jest = require("jest");
require("jest-matchers-files");
```

### Bibliotecas Globais

Uma biblioteca _global_ é a que pode ser acessada no escopo global (i.e. sem o uso de nenhuma forma do `import`).
Muitas bibliotecas simplesmente expõem uma ou mais variáveis globais para uso.
Por exemplo, se você estivesse usando [jQuery](https://jquery.com/), a variável `$` pode ser usada simplesmente se referindo a ela:

```ts
$(() => {
  console.log("oi!");
});
```

Você vai usualmente encontrar na documentação de uma biblioteca global, um guia de como usar a biblioteca em uma tag script do HTML:

```html
<script src="http://um.ótimo.distribuidor.para/algumaBiblioteca.js"></script>
```

Hoje, a maioria das bibliotecas populares são escritas como bibliotecas UMD (veja abaixo).
A documentação de uma biblioteca UMD é difícil de distinguir de uma biblioteca normal.
Antes de escrever um arquivo de declaração global, tenha certeza de que a biblioteca não é UMD.

#### Identificando Uma Biblioteca Global Pelo Código

O código de uma biblioteca normal é usualmente extremamente simples.
Uma bilioteca global "Olá, mundo" pode parecer com isso:

```js
function cirarCumprimento(s) {
  return "Oi, " + s;
}
```

ou assim:

```js
// Web
window.cirarCumprimento = function (s) {
  return "Oi, " + s;
};

// Node
global.cirarCumprimento = function (s) {
  return "Oi, " + s;
};

// Potencialmente qualquer ambiente de execução
globalThis.cirarCumprimento = function (s) {
  return "Oi, " + s;
};
```

Quando olhando para o código de uma biblioteca global, você usualmente verá:

- Declaração de nível globalç com comandos `var` ou comandos `function`
- Uma ou mais atribuições para `window.algumNome`
- Presunções que primitivos da DOM tais como `document` ou `window` existem

Você não verá:

- Checagens por ou uso de carregadores de módulo tais como `require` ou `define`
- Importações no estilo do CommonJS/Node.js no formato `var fs = require("fs");`
- Chamadas para `define(...)`
- Documentação descrevendo como importar a biblioteca com `require` ou outro comando

#### Exemplos de Bibliotecas Globais

Por ser comunmente fácil tornar uma biblioteca global em uma biblioteca UMD, muito poucas bibliotecas populares ainda são escritas no estilo global.
Entretando, bibliotecas que são pequenas e requerem a DOM (ou tem _zero_ dependências) ainda podem ser globais.
]
#### Template de Bibliotecas Globais

O arquivo de template [`global.d.ts`](/docs/handbook/declaration-files/templates/global-d-ts.html) define uma biblioteca exemplo `minhaBiblioteca`.
Tenha certeza de ler [a nota de rodapé "Prevenindo Conflitos de Nomes"](#prevenindo-conflitos-de-nomes).

### _UMD_

Um módulo _UMD_ é um que pode ser usado _tanto como_ módulo (por alguma forma de importação), ou como global (quando executado em um ambiente sem um carregador de módulos).
Muitas bibliotecas populares, tais como [Moment.js](https://moment.js.com/), são escritas assim.
Por exemplo, no Node.js ou usando RequireJS, você escreveria:

```ts
import moment = require("moment");
console.log(moment.format());
```

Enquanto que em um ambiente de navegador vanilla, você escreveria:

```js
console.log(moment.format());
```

#### Identificando uma Biblioteca UMD

[Módulos UMD](https://github.com/umdjs/umd) procuram pela existência de um ambiente carregador de módulos.
É um padrão fácil de se encontrar que se parece com isso:

```js
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["libName"], factory);
    } else if (typeof module === "object" && module.exports) {
        module.exports = factory(require("libName"));
    } else {
        root.returnExports = factory(root.libName);
    }
}(this, function (b) {
```

Se você ver testes como `typeof define`, `typeof window`, ou `typeof module` no código de uma biblioteca, especialmente no topo do arquivo, é quase sempre uma biblioteca UMD.

Documentação de bibliotecas UMD vão frequentemente demonstrar um exemplo de "Usando em Node.js" usando o `require`,
e um exemplo de "Usando no navegador" usando uma tag `<script>` para carregar o script.

#### Exemplos de bibliotecas UMD

A maioria das bibliotecas populares estão disponíveis agora como pacotes UMD.
Exemplos incluem [jQuery](https://jquery.com/), [Moment.js](https://momentjs.com/), [lodash](https://lodash.com/), e muitas outras.

#### Template

Use o template [`module-plugin.d.ts`](/docs/handbook/declaration-files/templates/module-plugin-d-ts.html).

## Consumindo Dependências

Há vários tipos de dependências que sua biblioteca pode ter.
Essa seção mostra como importar elas nos arquivos de declaração.

### Dependências em Bibliotecas Globais

Se sua biblioteca depende de uma biblioteca global, use a diretiva `/// <reference types="..." />`:

```ts
/// <reference types="umaLib" />

function buscarCoisa(): umaLib.coisa;
```

### Dependências em Módulos

Se sua biblioteca depende de um módulo, use o comando `import`:

```ts
import * as moment from "moment";

function buscarCoisa(): moment;
```

### Dependências em bibliotecas UMD

#### De uma Biblioteca Global

Se sua biblioteca global depende de um módulo UMD, use a diretiva `/// <reference types="..." />`:

```ts
/// <reference types="moment" />

function buscarCoisa(): moment;
```

#### De um Módulo ou Biblioteca UMD

Se sua biblioteca UMD depende de outra biblioteca UMD, use o comando `import`:

```ts
import * as algumaBiblioteca from "algumaBiblioteca";
```

_Não_ use uma diretiva`/// <reference` para declarar uma dependência em uma biblioteca UMD!

## Notas de Rodapé

### Prevenindo Conflitos de Nomes

Note que é possível definir muitos tipos no escopo global quando escrevendo um arquivo de declaração global.
Nós fortemente desencorajamos isso porque pode levar a possíveis conflitos de nome não solucionáveis quando muitos arquivos de declaração estão em um projeto.

Uma regra simples é apenas declarar tipos _dentro de um namespace_ pela variável global a biblioteca define.
Por exmeplo, se uma biblioteca define um valor global 'cats', você deveria escrever:

```ts
declare namespace cats {
  interface KittySettings {}
}
```

Mas _não_:

```ts
// a um nível global
interface CatsKittySettings {}
```

Esse guia também garante que a biblioteca pode ser transformada para UMD sem a quebra dos arquivos de declaração.

### O Impacto do ES6 nas Assinaturas de Chamadas de Módulos

Muitas bibliotecas populares, como o Express, expõem-se como uma função possível de ser chamada quando importadas.
Por exemplo, o uso típico do Express se parece com isso:

```ts
import exp = require("express");
var app = exp();
```

Em carregadores de módulos compatíveis com ES6, o objeto de primeiro nível (aqui importado como `exp`) pode apenas ter propriedades;
o objeto de primeiro nível _nunca_ pode ter a possibilidade de ser chamado.

A solução mais comum aqui é definir uma exportação `default` para um objeto possível de ser chamado/construído;
carregadores de módulos comumente detectam essa situação automaticamente e substituem o objeto de primeiro nível com uma exportação `default`.
TypeScript pode gerenciar isso para você, se você tem [`"esModuleInterop": true`](/tsconfig/#esModuleInterop) no seu tsconfig.json.
