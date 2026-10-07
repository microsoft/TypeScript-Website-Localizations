---
title: Normas
layout: docs
permalink: /pt/docs/handbook/declaration-files/do-s-and-don-ts.html
oneline: "Recomendações para escrita de arquivos d.ts"
---

## Tipos Gerais

## `Number`, `String`, `Boolean`, `Symbol` and `Object`

❌ _Nunca_ use os tipos `Number`, `String`, `Boolean`, `Symbol`, ou `Object`
Esse tipos fazem referências a objetos não-primitivos que quase nunca são usados apropriadamente em códigos JavaScript.

```ts
/* Errado */
function reverte(s: String): String;
```

✅ _Sempre_ use os tipos `number`, `string`, `boolean`, e `symbol`.

```ts
/* OK */
function reverte(s: string): string;
```

Ao invés de `Object`, use o tipo não-primitivo `object` ([adicionado em TypeScript 2.2](../release-notes/typescript-2-2.html#object-type)).

## Generics

❌ _Nunca_ tenha um tipo genérico que não use os tipos de seus parâmetros.
Veja mais detalhes em [TypeScript FAQ page](https://github.com/Microsoft/TypeScript/wiki/FAQ#why-doesnt-type-inference-work-on-this-interface-interface-foot--).

## any

❌ _Nunca_ use `any` como tipo a não ser que você esteja no processo de migração do projeto de JavaScript para Typescript. O compilador _efetivamente_ trata `any` como "por favor desligue a verificação de tipo para essa coisa". Isso é similar a botar um comentário `@ts-ignore` em volta de cada uso da variável. Isso pode ser muito útil quando você está migrando pela primeira vez um projeto JavaScript para TypeScript pois pode definir o tipo para coisas que você ainda não migrou como `any`, mas em um projeto TypeScript completo você estará desabilitando a verificação de tipos para qualquer parte do seu programa que o use.

Em casos onde você não sabe o tipo você quer aceitar, ou quando quer aceitar qualquer coisa pois irá passar adiante cegamente sem interagir, você pode usar [`unknown`](/play/#example/unknown-and-never).

<!-- TODO: More -->

## Tipos de Callback

## Tipos de Retorno e Callbacks

<!-- TODO: Reword; these examples make no sense in the context of a declaration file -->

❌ _Nunca_ use o tipo de retorno `any` para callbacks cujo o valor será ignorado:

```ts
/* ERRADO */
function fn(x: () => any) {
  x();
}
```

✅ _Sempre_ use o tipo de retorno `void` para callbacks cujo o valor será ignorado:

```ts
/* OK */
function fn(x: () => void) {
  x();
}
```

❔ _Por quê?_: Usar void é mais seguro porque te previne de acidentalmente usar o valor de retorno de `x` de forma não verificada:

```ts
function fn(x: () => void) {
  var k = x(); // oops! deveria fazer outra coisa
  k.facaAlgo(); // erro, mas ficaria OK se o tipo retorno tivesse sido 'any'
}
```

## Parâmetros Opcionais em Callbacks

❌ _Nunca_ use parâmetros opcionais em callbacks a não ser que você realmente tenha essa intenção:

```ts
/* ERRADO */
interface Buscador {
  retornaObjeto(pronto: (data: any, tempoDecorrido?: number) => void): void;
}
```

Isso tem um significado muito especifico: o callback `pronto` pode ser invocado com 1 argumento ou pode ser invocado com 2 argumentos.
O autor provavelmente teve a intenção de dizer que o callback talvez não se importe com o parâmetro `tempoDecorrido`, mas não tem necessidade de fazer o parâmetro opcional para atingir isso --
sempre é valido prover um callback que aceita um numero menor de argumentos.

✅ _Sempre_ escreva parâmetros de callback como não-opcional:

```ts
/* OK */
interface Buscador {
  retornaObjeto(pronto: (data: any, tempoDecorrido: number) => void): void;
}
```

## Sobrecargas e Callbacks

❌ _Nunca_ escreva sobrecargas separadas que diferem apenas na aridade do callback:

```ts
/* ERRADO */
declare function antesDeTodos(acao: () => void, timeout?: number): void;
declare function antesDeTodos(
  acao: (done: DoneFn) => void,
  timeout?: number
): void;
```

✅ _Sempre_ escreva uma única sobrecarga usando a aridade maxima:

```ts
/* OK */
declare function antesDeTodos(
  acao: (done: DoneFn) => void,
  timeout?: number
): void;
```

❔ _Por quê?_: Sempre é válido para um callback desprezar um parâmetro, então não tem necessidade de encurtar a sobrecarga.
Provendo um callback mais curto primeiro permite funções incorretamente tipadas serem passadas adiante porque possuem correspondência com a primeira sobrecarga.

## Sobrecargas de Funções

## Ordenação

❌ _Nunca_ ponha sobrecargas genérias antes das mais específicas:

```ts
/* ERRADO */
declare function fn(x: any): any;
declare function fn(x: HTMLElement): number;
declare function fn(x: HTMLDivElement): string;

var meuElem: HTMLDivElement;
var x = fn(meuElem); // x: any, quê?
```

✅ _Sempre_ ordene sobrecargas pondo as assinaturas mais genéricas após as mais específicas:

```ts
/* OK */
declare function fn(x: HTMLDivElement): string;
declare function fn(x: HTMLElement): number;
declare function fn(x: any): any;

var meuElem: HTMLDivElement;
var x = fn(meuElem); // x: string, :)
```

❔ _Por quê?_: TypeScript escolhe a _primeira sobrecarga com correspondência_ ao resolver chamadas as funções.
Quando uma sobrecarga mais recente "é mais geral" do que uma mais antiga, a mais antiga é efetivamente omitida e não pode ser chamada.

## Use Parâmetros Opcionais

❌ _Nunca_ escreva muitas sobrecargas que diferem apenas em nos parâmetros finais:

```ts
/* ERRADO */
interface Exemplo {
  diff(um: string): number;
  diff(um: string, dois: string): number;
  diff(um: string, dois: string, tres: boolean): number;
}
```

✅ _Sempre_ que possível use parâmetros opcionais:

```ts
/* OK */
interface Exemplo {
  diff(um: string, dois?: string, tres?: boolean): number;
}
```

Note que esse colapso deve ocorrer apenas quando todas as sobrecargas tiverem o mesmo tipo de retorno.

❔ _Por quê?_: Isso é importante por dois motivos.

TypeScript resolve compatibilidade de assinaturas verificando se alguma assinatura do alvo pode ser chamada com os argumentos da fonte,_e argumentos estranhos são permitidos_.
Esse código, por exemplo, expõe um bug apenas quando a assinatura é escrita corretamente usando parâmetros opcionais:

```ts
function fn(x: (a: string, b: number, c: number) => void) {}
var x: Exemplo;
// Quando escrito com sobrecarga, OK -- usado a primeira sobrecarga
// Quando escrito com opcionais, devidamente um erro
fn(x.diff);
```

A segunda razão é quando um consumidor usa a funcionalidade "checagem estrita de nulos" do TypeScript.
Porque parâmetros não especificados aparecem como `undefined` em javascript, geralmente é bom passar um `undefined` explícito para uma função com argumentos opcionais.
Esse código, por exemplo, deveria ser OK sob nulos estritos:

```ts
var x: Exemplo;
// Quando escrito com sobrecargas,  um erro porque passa 'undefined' para 'string'
// Quando escrito com opcionais, devidamente OK
x.diff("algo", true ? undefined : "hora");
```

## Use Tipos de União

❌ _Nunca_ escreva sobrecargas que diferem por tipo em apenas um argumento:

```ts
/* ERRADO */
interface Momento {
  utcOffset(): number;
  utcOffset(b: number): Momento;
  utcOffset(b: string): Momento;
}
```

✅ _Sempre_ que possível use tipos de união:

```ts
/* OK */
interface Momento {
  utcOffset(): number;
  utcOffset(b: number | string): Momento;
}
```

Perceba que nós não fizemos `b` opcional aqui porque os tipos de retorno das assinaturas são diferentes.
❔ _Por quê?_: Isso é importante para pessoas que estão "passando adiante" um valor para sua função:

```ts
function fn(x: string): void;
function fn(x: number): void;
function fn(x: number | string) {
  // Quando escrito com sobrecargas separadas, indevidamente um erro
  // Quando escrito com tipos de união, devidamente OK
  return momento().utcOffset(x);
}
```
