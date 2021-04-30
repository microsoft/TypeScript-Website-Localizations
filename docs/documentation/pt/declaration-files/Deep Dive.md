---
title: Análise profunda
layout: docs
permalink: /pt/docs/handbook/declaration-files/deep-dive.html
oneline: "Como arquivos d.ts funcionam, uma análise profunda"
---

## Teoria do arquivo de declaração: Uma análise profunda

Estruturar módulos para obter a forma exata da API que você deseja pode ser complicado.
Por exemplo, nós talvez queiramos um módulo que possa ser invocado com ou sem `new` para produzir diferentes tipos,
que tenha uma variedade de tipos nomeados expostos em uma hierarquia,
e que tenha algumas propriedades no objeto de módulo também.

Ao ler este guia, você terá as ferramentas para escrever arquivos de declaração complexos que expõem uma API amigável. 
Este guia se concentra em bibliotecas de módulo (ou UMD) pois as opções são mais variadas.

## Conceitos chaves

Você pode entender perfeitamente como criar qualquer forma de declaração
ao compreender alguns conceitos chaves de como o TypeScript funciona.

### Tipos

Se você está lendo este guia, provavelmente já sabe de forma superficial o que é um tipo em TypeScript.
Para ser mais explícito, no entanto, um _tipo_ é introduzido com: 

- Uma declaração de alias de tipo (`type sn = number | string;`)
- Uma declaração de interface (`interface I { x: number[]; }`)
- Uma declaração de classe (`class C { }`)
- Uma declaração de enum (`enum E { A, B, C }`)
- Uma declaração `import` que se refere a um tipo

Cada uma dessas formas de declaração cria um novo nome de tipo.

### Valores

Assim como tipos, você provavelmente já entende o que um valor é.
Valores são nomes em tempo de execução que podemos referenciar em expressões.
Por exemplo `let x = 5;` cria um valor chamado `x`.

Novamente, sendo explícito, o itens seguintes criam valores:

- Declarações `let`, `const` e `var`
- Uma declaração de `namespace` ou `module` que contém um valor
- Uma declaração de `enum`
- Uma declaração de `class`
- Uma declaração `import` que se refere a um valor
- Uma declaração de `function`

### Namespaces

Tipos podem existir em _namespaces_.
Por exemplo, se temos a declaração `let x: A.B.C`,
nós dizemos que o tipo `C` vem do namespace `A.B`.

Esta distinção é sutil e importante -- aqui, `A.B` não é necessariamente um tipo ou um valor.

## Combinações simples: Um nome, múltiplos significados

Dado um nome `A`, nós podemos encontrar até três significados para `A`: um tipo, um valor ou um namespace.
Como o nome é interpretado depende do contexto em que ele é usado.
Por exemplo, na declaração `let m: A.A = A;`,
`A` é usado primeiro como um namespace, então como nome de tipo, e então como um valor.
Esses significados podem acabar se referindo a declarações totalmente diferentes!

Isso pode parecer confuso, mas é muito conveniente contanto que nós não sobrecarreguemos excessivamente as coisas.
Vejamos alguns aspectos úteis desta combinação de comportamento. 

### Combinações integradas

Leitores atentos vão notar que, por exemplo, `class` apareceu em ambas as listas de _tipo_ e _valor_.
A declaração `class C { }` cria duas coisas:
um _tipo_ `C` que se refere à forma da instância da classe,
e um _valor_ `C` que se refere à função construtora da classe.
Declaração de enums se comportam de forma semelhante.

### Combinações de usuários

Digamos que escrevemos um arquivo de módulo `foo.d.ts`:

```ts
export var SomeVar: { a: SomeType };
export interface SomeType {
  count: number;
}
```

Em seguida, utilizarmos:

```ts
import * as foo from "./foo";
let x: foo.SomeType = foo.SomeVar.a;
console.log(x.count);
```

Isso funciona bem, mas podemos imaginar que `SomeType` e `SomeVar` são intimamente relacionados
de forma que você gostaria que eles tivessem o mesmo nome.
Nós podemos usar a combinação para apresentar esse dois objetos diferentes (o valor e o tipo) sob o mesmo nome `Bar`:

```ts
export var Bar: { a: Bar };
export interface Bar {
  count: number;
}
```

Isso apresenta uma oportunidade muito boa para desestruturação no código que o utiliza:

```ts
import { Bar } from "./foo";
let x: Bar = Bar.a;
console.log(x.count);
```

Novamente, nós usamos o `Bar` aqui como tipo e valor.
Perceba que não precisamos declarar o valor `Bar` como sendo do tipo `Bar` -- eles são independentes.

## Combinações avançadas

Alguns tipos de declaração podem ser combinadas através de múltiplas declarações.
Por exemplo, `class C { }` e `interface C { }` podem coexistir e ambas contribuem com propriedades para os tipos `C`.

Isso é permitido desde que não se crie um conflito.
Uma regra geral é que os valores sempre entram em conflito com outro valores de mesmo nome a menos que sejam declaras como `namespace`s,
tipos conflitarão se forem declarados com um alias de tipo (`type s = string`),
e namespaces nunca entram em conflito.

Vamos ver como isso pode ser usado.

### Adicionar usando uma `interface`

Nós podemos adicionar membros adicionais à uma `interface` com outra declaração de `interface`:

```ts
interface Foo {
  x: number;
}
// ... em outro local ...
interface Foo {
  y: number;
}
let a: Foo = ...;
console.log(a.x + a.y); // OK
```

Isso também funciona com classes:

```ts
class Foo {
  x: number;
}
// ... em outro local ...
interface Foo {
  y: number;
}
let a: Foo = ...;
console.log(a.x + a.y); // OK
```

Perceba que não podemos adicionar ao alias de tipo (`type s = string;`) usando uma interface.

### Adicionar usando um `namespace`

Uma declaração de `namespace` pode ser usada adicionar novos tipos, valores, e namespaces de qualquer forma que não crie conflitos.

Por exemplo, podemos adicionar um membro estático a uma classe:

```ts
class C {}
// ... em outro local ...
namespace C {
  export let x: number;
}
let y = C.x; // OK
```

Perceba que neste exemplo, adicionamos um valor para o lado _estático_ de `C` (sua função construtora)
Isto ocorre porque nós adicionamos um _valor_, e o contêiner para todos os valores é outro valor
(tipos são contidos por namespaces), e namespaces são contidos por outros namespaces).

Nós também podemos adicionar um tipo com namespace a uma classe:

```ts
class C {}
// ... em outro local ...
namespace C {
  export interface D {}
}
let y: C.D; // OK
```

Neste exemplo, não havia um namespace `C` até nós escrevermos uma declaração de `namespace` para ele.
O significado de `C` como um namespace não conflita com os significados de valor ou tipo de `C` criados pela classe.

Finalmente, podemos realizar diferentes mesclas usando declarações de `namespace`.
Isto não é um exemplo particularmente realista, mas mostra vários tipos de comportamentos interessantes:

```ts
namespace X {
  export interface Y {}
  export class Z {}
}

// ... em outro local ...
namespace X {
  export var Y: number;
  export namespace Z {
    export class C {}
  }
}
type X = string;
```

Neste exemplo, o primeiro bloco cria os seguintes significados de nome:

- Um valor `X` (pois a declaração de `namespace` contém um valor, `Z`)
- Um namespace `X` (pois a declaração de `namespace` contém um tipo, `Y`)
- Um tipo `Y` no namespace `X`
- Um tipo `Z` no namespace `X` (a forma da instância da classe)
- Um valor `Z` que é uma propriedade do valor `X` (a função construtora da classe)

O segundo bloco cria os seguintes significados de nome:

- Um valor `Y` (do tipo `number`) que é  uma propriedade do valor `X`
- Um namespace `Z`
- Um valor `Z` que é um propriedade do valor `X`
- Um tipo `C` no namespace `X.Z`
- Um valor `C` que é uma propriedade do valor `X.Z`
- Um tipo `X`

<!-- TODO: Write more on that. -->
