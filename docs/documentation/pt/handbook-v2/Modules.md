---
title: Módulos
layout: docs
permalink: /pt/docs/handbook/2/modules.html
oneline: "Como o JavaScript lida com a comunicação entre limites de arquivos."
---

O JavaScript tem uma longa história de diferentes formas de lidar com a modularização de código.
Existindo desde 2012, o TypeScript implementou suporte para muitos desses formatos, mas, com o tempo, a comunidade e a especificação do JavaScript convergiram para um formato chamado ES Modules (ou módulos ES6). Você pode conhecê-lo como a sintaxe `import`/`export`.

ES Modules foi adicionado à especificação do JavaScript em 2015 e, por volta de 2020, tinha amplo suporte na maioria dos navegadores web e runtimes de JavaScript.

Para manter o foco, o manual vai cobrir tanto os ES Modules quanto seu popular precursor, a sintaxe `module.exports =` do CommonJS, e você pode encontrar informações sobre os outros padrões de módulo na seção de referência em [Módulos](/docs/handbook/modules.html).

## Como os Módulos JavaScript são Definidos

Em TypeScript, assim como no ECMAScript 2015, qualquer arquivo que contém um `import` ou `export` de nível superior é considerado um módulo.

Por outro lado, um arquivo sem nenhuma declaração de import ou export de nível superior é tratado como um script cujo conteúdo está disponível no escopo global (e, portanto, também para os módulos).

Módulos são executados dentro de seu próprio escopo, não no escopo global.
Isso significa que variáveis, funções, classes, etc. declaradas em um módulo não são visíveis fora do módulo, a menos que sejam explicitamente exportadas usando uma das formas de export.
Por outro lado, para consumir uma variável, função, classe, interface, etc. exportada de um módulo diferente, ela tem que ser importada usando uma das formas de import.

## Não-módulos

Antes de começar, é importante entender o que o TypeScript considera um módulo.
A especificação do JavaScript declara que qualquer arquivo JavaScript sem uma declaração de `import`, `export` ou `await` de nível superior deve ser considerado um script, e não um módulo.

Dentro de um arquivo de script, variáveis e tipos são declarados no escopo global compartilhado, e assume-se que você vai ou usar a opção de compilador [`outFile`](/tsconfig#outFile) para juntar múltiplos arquivos de entrada em um arquivo de saída, ou usar múltiplas tags `<script>` no seu HTML para carregar esses arquivos (na ordem correta!).

Se você tem um arquivo que atualmente não tem nenhum `import` ou `export`, mas quer que ele seja tratado como um módulo, adicione a linha:

```ts twoslash
export {};
```

o que vai mudar o arquivo para um módulo que não exporta nada. Essa sintaxe funciona independentemente do seu alvo de módulo.

## Módulos em TypeScript

<blockquote class='bg-reading'>
   <p>Leitura Adicional:<br />
   <a href='https://exploringjs.com/impatient-js/ch_modules.html#overview-syntax-of-ecmascript-modules'>Impatient JS (Modules)</a><br/>
   <a href='https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules'>MDN: JavaScript Modules</a><br/>
   </p>
</blockquote>

Há três coisas principais a considerar ao escrever código baseado em módulos em TypeScript:

- **Sintaxe**: Que sintaxe eu quero usar para importar e exportar coisas?
- **Resolução de Módulos**: Qual é a relação entre nomes de módulo (ou caminhos) e arquivos no disco?
- **Alvo de Saída do Módulo**: Como deve ser o meu módulo JavaScript emitido?

### Sintaxe de ES Module

Um arquivo pode declarar uma exportação principal via `export default`:

```ts twoslash
// @filename: hello.ts
export default function helloWorld() {
  console.log("Hello, world!");
}
```

Isso é então importado via:

```ts twoslash
// @filename: hello.ts
export default function helloWorld() {
  console.log("Hello, world!");
}
// @filename: index.ts
// ---cut---
import helloWorld from "./hello.js";
helloWorld();
```

Além da exportação padrão, você pode ter mais de uma exportação de variáveis e funções via `export` omitindo o `default`:

```ts twoslash
// @filename: maths.ts
export var pi = 3.14;
export let squareTwo = 1.41;
export const phi = 1.61;

export class RandomNumberGenerator {}

export function absolute(num: number) {
  if (num < 0) return num * -1;
  return num;
}
```

Estas podem ser usadas em outro arquivo via a sintaxe `import`:

```ts twoslash
// @filename: maths.ts
export var pi = 3.14;
export let squareTwo = 1.41;
export const phi = 1.61;
export class RandomNumberGenerator {}
export function absolute(num: number) {
  if (num < 0) return num * -1;
  return num;
}
// @filename: app.ts
// ---cut---
import { pi, phi, absolute } from "./maths.js";

console.log(pi);
const absPhi = absolute(phi);
//    ^?
```

### Sintaxe Adicional de Import

Um import pode ser renomeado usando um formato como `import {old as new}`:

```ts twoslash
// @filename: maths.ts
export var pi = 3.14;
// @filename: app.ts
// ---cut---
import { pi as π } from "./maths.js";

console.log(π);
//          ^?
```

Você pode misturar e combinar a sintaxe acima em um único `import`:

```ts twoslash
// @filename: maths.ts
export const pi = 3.14;
export default class RandomNumberGenerator {}

// @filename: app.ts
import RandomNumberGenerator, { pi as π } from "./maths.js";

RandomNumberGenerator;
// ^?

console.log(π);
//          ^?
```

Você pode pegar todos os objetos exportados e colocá-los em um único namespace usando `* as name`:

```ts twoslash
// @filename: maths.ts
export var pi = 3.14;
export let squareTwo = 1.41;
export const phi = 1.61;

export function absolute(num: number) {
  if (num < 0) return num * -1;
  return num;
}
// ---cut---
// @filename: app.ts
import * as math from "./maths.js";

console.log(math.pi);
const positivePhi = math.absolute(math.phi);
//    ^?
```

Você pode importar um arquivo e _não_ incluir nenhuma variável no seu módulo atual via `import "./file"`:

```ts twoslash
// @filename: maths.ts
export var pi = 3.14;
// ---cut---
// @filename: app.ts
import "./maths.js";

console.log("3.14");
```

Neste caso, o `import` não faz nada. No entanto, todo o código em `maths.ts` foi avaliado, o que poderia disparar efeitos colaterais que afetam outros objetos.

#### Sintaxe de ES Module Específica do TypeScript

Tipos podem ser exportados e importados usando a mesma sintaxe de valores JavaScript:

```ts twoslash
// @filename: animal.ts
export type Cat = { breed: string; yearOfBirth: number };

export interface Dog {
  breeds: string[];
  yearOfBirth: number;
}

// @filename: app.ts
import { Cat, Dog } from "./animal.js";
type Animals = Cat | Dog;
```

O TypeScript estendeu a sintaxe `import` com dois conceitos para declarar a importação de um tipo:

###### `import type`

Que é uma instrução de import que pode _apenas_ importar tipos:

```ts twoslash
// @filename: animal.ts
export type Cat = { breed: string; yearOfBirth: number };
export type Dog = { breeds: string[]; yearOfBirth: number };
export const createCatName = () => "fluffy";

// @filename: valid.ts
import type { Cat, Dog } from "./animal.js";
export type Animals = Cat | Dog;

// @filename: app.ts
// @errors: 1361
import type { createCatName } from "./animal.js";
const name = createCatName();
```

###### Imports `type` inline

O TypeScript 4.5 também permite que imports individuais sejam prefixados com `type` para indicar que a referência importada é um tipo:

```ts twoslash
// @filename: animal.ts
export type Cat = { breed: string; yearOfBirth: number };
export type Dog = { breeds: string[]; yearOfBirth: number };
export const createCatName = () => "fluffy";
// ---cut---
// @filename: app.ts
import { createCatName, type Cat, type Dog } from "./animal.js";

export type Animals = Cat | Dog;
const name = createCatName();
```

Juntos, eles permitem que um transpilador não-TypeScript, como o Babel, o swc ou o esbuild, saiba quais imports podem ser removidos com segurança.

#### Sintaxe de ES Module com Comportamento de CommonJS

O TypeScript tem uma sintaxe de ES Module que se correlaciona _diretamente_ com um `require` do CommonJS e do AMD. Imports usando ES Module são, _na maioria dos casos_, os mesmos que o `require` desses ambientes, mas essa sintaxe garante que você tenha uma correspondência de 1 para 1 no seu arquivo TypeScript com a saída CommonJS:

```ts twoslash
/// <reference types="node" />
// @module: commonjs
// ---cut---
import fs = require("fs");
const code = fs.readFileSync("hello.ts", "utf8");
```

Você pode aprender mais sobre essa sintaxe na [página de referência de módulos](/docs/handbook/modules.html#export--and-import--require).

## Sintaxe CommonJS

CommonJS é o formato no qual a maioria dos módulos no npm é entregue. Mesmo que você esteja escrevendo usando a sintaxe de ES Modules acima, ter um breve entendimento de como a sintaxe CommonJS funciona vai te ajudar a depurar mais facilmente.

#### Exportando

Identificadores são exportados definindo a propriedade `exports` em um objeto global chamado `module`.

```ts twoslash
/// <reference types="node" />
// ---cut---
function absolute(num: number) {
  if (num < 0) return num * -1;
  return num;
}

module.exports = {
  pi: 3.14,
  squareTwo: 1.41,
  phi: 1.61,
  absolute,
};
```

Então esses arquivos podem ser importados via uma instrução `require`:

```ts twoslash
// @module: commonjs
// @filename: maths.ts
/// <reference types="node" />
function absolute(num: number) {
  if (num < 0) return num * -1;
  return num;
}

module.exports = {
  pi: 3.14,
  squareTwo: 1.41,
  phi: 1.61,
  absolute,
};
// @filename: index.ts
// ---cut---
const maths = require("./maths");
maths.pi;
//    ^?
```

Ou você pode simplificar um pouco usando o recurso de desestruturação do JavaScript:

```ts twoslash
// @module: commonjs
// @filename: maths.ts
/// <reference types="node" />
function absolute(num: number) {
  if (num < 0) return num * -1;
  return num;
}

module.exports = {
  pi: 3.14,
  squareTwo: 1.41,
  phi: 1.61,
  absolute,
};
// @filename: index.ts
// ---cut---
const { squareTwo } = require("./maths");
squareTwo;
// ^?
```

### Interoperabilidade entre CommonJS e ES Modules

Há uma incompatibilidade de recursos entre CommonJS e ES Modules quanto à distinção entre um import padrão e um import de objeto de namespace de módulo. O TypeScript tem uma flag de compilador para reduzir o atrito entre os dois conjuntos diferentes de restrições com [`esModuleInterop`](/tsconfig#esModuleInterop).

## Opções de Resolução de Módulos do TypeScript

Resolução de módulos é o processo de pegar uma string da instrução `import` ou `require` e determinar a qual arquivo essa string se refere.

O TypeScript inclui duas estratégias de resolução: Classic e Node. A Classic, o padrão quando a opção de compilador [`module`](/tsconfig#module) não é `commonjs`, é incluída por compatibilidade retroativa.
A estratégia Node replica como o Node.js funciona no modo CommonJS, com verificações adicionais para `.ts` e `.d.ts`.

Há muitas flags do TSConfig que influenciam a estratégia de módulo dentro do TypeScript: [`moduleResolution`](/tsconfig#moduleResolution), [`baseUrl`](/tsconfig#baseUrl), [`paths`](/tsconfig#paths), [`rootDirs`](/tsconfig#rootDirs).

Para os detalhes completos sobre como essas estratégias funcionam, você pode consultar a página de referência [Resolução de Módulos](/docs/handbook/modules/reference.html#the-moduleresolution-compiler-option).

## Opções de Saída de Módulo do TypeScript

Há duas opções que afetam a saída JavaScript emitida:

- [`target`](/tsconfig#target), que determina quais recursos do JS são convertidos para versões mais antigas (downleveled — convertidos para rodar em runtimes JavaScript mais antigos) e quais são deixados intactos
- [`module`](/tsconfig#module), que determina qual código é usado para os módulos interagirem uns com os outros

Qual [`target`](/tsconfig#target) você usa é determinado pelos recursos disponíveis no runtime de JavaScript em que você espera rodar o código TypeScript. Isso poderia ser: o navegador web mais antigo que você suporta, a versão mais baixa do Node.js em que você espera rodar, ou poderia vir de restrições únicas do seu runtime — como o Electron, por exemplo.

Toda a comunicação entre módulos acontece via um carregador de módulos (module loader); a opção de compilador [`module`](/tsconfig#module) determina qual deles é usado.
Em tempo de execução, o carregador de módulos é responsável por localizar e executar todas as dependências de um módulo antes de executá-lo.

Por exemplo, aqui está um arquivo TypeScript usando a sintaxe de ES Modules, mostrando algumas opções diferentes para [`module`](/tsconfig#module):

```ts twoslash
// @filename: constants.ts
export const valueOfPi = 3.142;
// @filename: index.ts
// ---cut---
import { valueOfPi } from "./constants.js";

export const twoPi = valueOfPi * 2;
```

#### `ES2020`

```ts twoslash
// @showEmit
// @module: es2020
// @noErrors
import { valueOfPi } from "./constants.js";

export const twoPi = valueOfPi * 2;
```

#### `CommonJS`

```ts twoslash
// @showEmit
// @module: commonjs
// @noErrors
import { valueOfPi } from "./constants.js";

export const twoPi = valueOfPi * 2;
```

#### `UMD`

```ts twoslash
// @showEmit
// @module: umd
// @noErrors
import { valueOfPi } from "./constants.js";

export const twoPi = valueOfPi * 2;
```

> Note que o ES2020 é efetivamente o mesmo que o `index.ts` original.

Você pode ver todas as opções disponíveis e como fica o código JavaScript emitido por elas na [Referência do TSConfig para `module`](/tsconfig#module).

## Namespaces do TypeScript

O TypeScript tem seu próprio formato de módulo chamado `namespaces`, que é anterior ao padrão ES Modules. Essa sintaxe tem muitos recursos úteis para criar arquivos de definição complexos, e ainda vê uso ativo [no DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped). Embora não esteja descontinuada, a maioria dos recursos em namespaces existe em ES Modules e recomendamos que você use isso para se alinhar com a direção do JavaScript. Você pode aprender mais sobre namespaces na [página de referência de namespaces](/docs/handbook/namespaces.html).
