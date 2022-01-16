---
title: TypeScript para Programadores Funcionais
short: TS para Programadores Funcionais
layout: docs
permalink: /pt/docs/handbook/typescript-in-5-minutes-func.html
oneline: Aprenda Typescript se você tiver uma história com programação funcional
---

Typescript começou sua vida numa tentativa de trazer tipos tradicionalmente orientados a objeto para o JavaScript para que os programadores na Microsoft pudessem trazer programas tradicionalmente orientados a objeto para a web. Conforme foi se desenvolvendo, o sistema de tipos do Typescript evoluiu para código modelo escrito por JavaScripters nativos. O sistema resultante é poderoso, interessante e confuso.

Essa introdução foi desenvolvida para ajudar programadores Haskell ou ML que querem aprender Typescript. Ela descreve como o sistema de tipos do Typescript difere do sistema de tipos do Haskell. Ela também descreve as funcionalidades únicas do sistema de tipos do Typescript que tem ascendência na modelagem de código JavaScript.

Essa introdução não cobre programação orientada a objeto. Na prática, programação orientada a objeto em Typescript é similar a outras linguagens populares com funcionalidades OO.

## Pré-requisitos

Nessa introdução, eu assumo que você tenha os seguintes conhecimentos:

- Como programar em JavaScript, as boas partes.
- Sintaxe de tipo de uma linguagem descendente do C.

Se você precisa aprender as boas partes do Javascript, leia [JavaScript: As Boas Partes](https://shop.oreilly.com/product/9780596517748.do). Você pode ser capaz de pular o livro se você sabe como escrever programas em uma linguagem com escopo léxico de chamada-por-valor com muita mutabilidade e não muito mais. [R<sup>4</sup>RS Scheme](https://people.csail.mit.edu/jaffer/r4rs.pdf) é um bom exemplo.

[A Linguagem de Programação C++](http://www.stroustrup.com/4th.html) é um bom lugar para aprender sobre sintaxe no estilo C. Diferente do C++, Typescript usa tipos pós-fixados, como: `x: string` ao invés de `string x`.

## Conceitos que não estão em Haskell

## Tipos Nativos

JavaScript define 8 tipos nativos:

| Type        | Explanation                                    |
| ----------- | ---------------------------------------------- |
| `Number`    | um ponto flutuante de dupla precisão IEEE 754. |
| `String`    | uma string imutável UTF-16.                    |
| `BigInt`    | inteiros no formato de precisão arbitrário.    |
| `Boolean`   | `true` e `false`.                              |
| `Symbol`    | um valor único usado como uma chave.           |
| `Null`      | equivalente ao tipo unit.                      |
| `Undefined` | também equivalente ao tipo unit.               |
| `Object`    | similar aos records.                           |

[Veja a MDN para mais detalhes](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures).

Typescript tem os tipos primitivos correspondentes para os tipos nativos:

- `number`
- `string`
- `bigint`
- `boolean`
- `symbol`
- `null`
- `undefined`
- `object`

### Outros tipos importantes do Typescript

| Type           | Explanation                                                       |
| -------------- | ----------------------------------------------------------------- |
| `unknown`      | o tipo do topo.                                                   |
| `never`        | o tipo do final.                                                  |
| object literal | eg `{ property: Type }`                                           |
| `void`         | um subtipo de `undefined` para ser usado como um tipo de retorno. |
| `T[]`          | arrays mutáveis, também escritos como `Array<T>`                  |
| `[T, T]`       | tuplas, que tem tamanho fixado mas são mutáveis                   |
| `(t: T) => U`  | funções                                                           |

Notas:

4. Sintaxe de funções incluem os nomes dos parâmetros. É bem difícil se acostumar com isso!

   ```ts
   let fst: (a: any, b: any) => any = (a, b) => a;

   // ou mais precisamente:

   let fst: <T, U>(a: T, b: U) => T = (a, b) => a;
   ```

5. Sintaxe de tipo literal de objeto espelha precisamente a sintaxe de valor de objeto literal:

   ```ts
   let o: { n: number; xs: object[] } = { n: 1, xs: [] };
   ```

6. `[T, T]` é um subtipo de `T[]`. Isso é diferente em Haskell, onde tuplas não são relacionadas a listas.

### Tipos em caixas

Javascript tem tipos em caixas equivalentes aos tipos primitivos que contém métodos que os programadores associam com esses tipos. Typescript reflete isso com, por exemplo, a diferença entre o tipo primitivo `number` e o tipo em caixa `Number`. Os tipos em caixa raramente são necessários, já que seus métodos retornam primitivos.

```ts
(1).toExponential();
// é equivalente a
Number.prototype.toExponential.call(1);
```

Note que para chamar um método em um numérico literal ele tem que estar entre parênteses para auxiliar o tradutor.

## Tipagem gradual

Typescript usa o tipo `any` sempre que não pode dizer qual deveria ser o tipo de uma expressão. Comparado ao `Dynamic`, chamar o `any` de um tipo é um exagero. Ele apenas desativa o verificador de tipo onde quer que apareça. Por exemplo, você pode inserir qualquer valor em um `any[]` sem marcar o valor de nenhuma forma:

```ts twoslash
// com "noImplicitAny": false no tsconfig.json, anys: any[]
const anys = [];
anys.push(1);
anys.push('oh não');
anys.push({ qualquer: 'coisa' });
```

E você pode usar expressões do tipo `any` em qualquer lugar:

```ts
anys.map(anys[1]); // oh não, "oh não" não é uma função
```

`any` é contagioso, também &mdash; se você inicializar uma variável com uma expressão do tipo `any`, a variável tem o tipo `any` também.

```ts
let sepsis = anys[0] + anys[1]; // isso poderia significar qualquer coisa
```

Para ter um erro quando o Typescript produzir um `any`, use `"noImplicitAny": true`, ou `"strict": true` no `tsconfig.json`.

## Tipagem estrutural

Tipagem estrutural é um conceito familiar para a maioria dos programadores funcionais, mesmo que Haskell e a maior parte das MLs não são estrturalmente tipadas. Sua forma básica é bem simples:

```ts
// @strict: false
let o = { x: 'olá', extra: 1 }; // ok
let o2: { x: string } = o; // ok
```

Aqui, o objeto literal `{ x: "hi", extra: 1 }` tem um tipo literal correspondente `{ x: string, extra: number }`. Esse tipo é atribuível à `{ x: string }` já que tem todas as propriedades requisitadas e essas propriedades tem tipos atribíveis. A propriedade extra não tem nenhuma atribuição anterior, apenas forma um subtipo de `{ x: string }`.

Tipos nomeados apenas dão um nome a um tipo; para propósitos de atribuição não há nenhuma diferença entre o nome de tipo `Um` e a interface de tipo `Dois` abaixo. Eles ambos tem uma propriedade `p: string`. (Nomes de tipos se comportam diferente de interfaces com respeito a definições recursivas e parâmetros de tipo entretanto.)

```ts twoslash
// @errors: 2322
type Um = { p: string };
interface Dois {
	p: string;
}
class Tres {
	p = 'Olá';
}

let x: Um = { p: 'oi' };
let dois: Dois = x;
dois = new Tres();
```

## Uniões

Em Typescript, os tipos uniões são marcados. Em outras palavras, eles não são uniões discriminadas como `data` em Haskell. Entretanto, você pode frequentemente discriminar tipos em uma união usando tags nativas ou outras propriedades.

```ts twoslash
function começar(
	arg: string | string[] | (() => string) | { s: string }
): string {
	// isso é super comum em Javascript
	if (typeof arg === 'string') {
		return casoComum(arg);
	} else if (Array.isArray(arg)) {
		return arg.map(casoComum).join(',');
	} else if (typeof arg === 'function') {
		return casoComum(arg());
	} else {
		return casoComum(arg.s);
	}

	function casoComum(s: string): string {
		// finalmente, apenas converta uma string para outra string
		return s;
	}
}
```

`string`, `Array` e `Function` têm predicados de tipos nativos, levando convenientemente o tipo objeto para a ramificação `else`. É possível, entretanto, gerar uniões que são difíceis de diferenciar em tempo de execução, para código novo, é melhor construir apenas uniões discriminadas.

Os seguintes tipos tem predicados nativos:

| Tipo      | Predicado                          |
| --------- | ---------------------------------- |
| string    | `typeof s === "string"`            |
| number    | `typeof n === "number"`            |
| bigint    | `typeof m === "bigint"`            |
| boolean   | `typeof b === "boolean"`           |
| symbol    | `typeof g === "symbol"`            |
| undefined | `typeof undefined === "undefined"` |
| function  | `typeof f === "function"`          |
| array     | `Array.isArray(a)`                 |
| object    | `typeof o === "object"`            |

Note que funções e arrays são objetos em tempo de execução, porém tem seus próprios predicados.

### Intersecções

Em adição a uniões, Typescript também tem intersecções:

```ts twoslash
type Combinada = { a: number } & { b: string };
type Conflitante = { a: number } & { a: string };
```

`Combinada` tem duas propriedades, `a` e `b`, como se tivessem sido escritas como um único tipo de objeto literal. Intersecções e uniões são recursivas em casos de conflito, então `Conflitante.a: number & string`.

## Tipos unitários

Tipos unitários são subtipos de tipos primitivos que contem exatamente um valor primitivo. Por exemplo, a string `foo` tem o mesmo tipo de `"foo"`. Jà que o JavaScript não tem enums nativas, é comum usar um conjunto de strings conhecidas. Uniões de tipos strings literais permitem que o TypeScript ter este padrão:

```ts twoslash
declare function encher(
	s: string,
	n: number,
	direction: 'esquerda' | 'direita'
): string;

encher('hi', 10, 'esquerda');
```

Quando necessário, o compilador _extende_ &mdash; converte para um super tipo &mdash; o tipo unitário para um tipo primitivo, como `"foo"`
para `string`. Isso acontece quando a mutabilidade é usada, que pode atrapalhar o uso de variáveis mutáveis:

```ts twoslash
// @errors: 2345
declare function encher(
	s: string,
	n: number,
	direction: 'esquerda' | 'direita'
): string;
// ---cut---
let s = 'direita';
encher('hi', 10, s); // error: 'string' is not assignable to '"esquerda" | "direita"'
```

Como o erro acontece:

- `"direita": "direita"`
- `s: string` pois `"direita"` expande para `string` quando atribuída para uma variável mutável.
- `string` não é atribuível para `"esquerda" | "direita"`

Você pode resolver isso com uma notação de tipo para `s`, porém isso previne atribuições a `s` de variáveis que não são do tipo `"esquerda" | "direita"`.

```ts twoslash
declare function encher(
	s: string,
	n: number,
	direction: 'esquerda' | 'direita'
): string;
// ---cut---
let s: 'esquerda' | 'direita' = 'direita';
encher('hi', 10, s);
```

## Conceitos similares a Haskell

## Tipagem contextual

TypeScript tem alguns lugares óbvios onde ele pode inferir tipos, como declarações de variáveis:

```ts twoslash
let s = 'Eu sou uma string!';
```

Mas também infere tipos em alguns outros lugares que você pode não esperar se já trabalhou com outras linguagens com sintaxes baseadas em C:

```ts twoslash
declare function map<T, U>(f: (t: T) => U, ts: T[]): U[];
let sns = map(n => n.toString(), [1, 2, 3]);
```

Aqui, `n: number` nesse exemplo também, apesar do fato que `T` e `U` não foram inferidas antes da chamada. Na verdade, antes de `[1,2,3]` ter sido usado para inferir `T=number`, o tipo de retorno de `n => n.toString()` é usado para inferir `U=string`, causando `sns` ter o tipo `string[]`.

Note que inferência funcionará em qualquer ordem, mas o intellisense só funcionará da direita pra esquerda, então o TypeScript prefere declarar `map` com o array primeiro:

```ts twoslash
declare function map<T, U>(ts: T[], f: (t: T) => U): U[];
```

Tipagem contextual também funciona de forma recursiva entre objetos literais, e em tipos unitários que seriam inferidos como `string` ou `number`. E pode inferir tipos de retorno do contexto:

```ts twoslash
declare function rodar<T>(thunk: (t: T) => void): T;
let i: { inferencia: string } = rodar(o => {
	o.inferencia = 'INSIRA O ESTADO AQUI';
});
```

O tipo de `o` é determinado para ser `{ inferencia: string }` porque

1. Inicializadores de declaração são contextualmente tipados pela delcaração do
   tipo: `{ inference: string }`.
2. O tipo de retorno de uma chamada usa o tipo contextual para inferências,
   então o compilador infere que `T={ inferencia: string }`.
3. Arrow functions usam a tipagem contextual para tipar seus parâmetros,
   então o compilador entrega `o: { inferencia: string }`.

E faz isso enquanto você está digitando, para que antes que você digite `o.`, você tem sugestões para a propriedade `inferencia`, junto com qualquer outras propriedades que você teria em um programa real.
Ao todo, essa feature pode fazer com que a inferência do TypeScript pareça um pouco como um motor de unificação de inferência de tipos, mas não é.

## Apelidos de tipos

Apelidos de tipos são meros apelidos, assim como `type` em Haskell. O compilador vai tentar usar o nome de apelido onde quer que tenha sido usado no código fonte, mas não vai ter sucesso sempre.

```ts twoslash
type Tamanho = [number, number];
let x: Tamanho = [101.1, 999.9];
```

O equivalente mais próximo de `newtype` é uma _intersecção marcada_:

```ts
type FString = string & { __compileTimeOnly: any };
```

Uma `FString` é como uma string normal, exceto que o compilador pensa que ela tem uma propriedade chamada `__compileTimeOnly` que não existe de fato. Isso significa que `FString` ainda pode ser atribuída para string, mas não o inverso.

## Uniões Discriminadas

O equivalente mais próximo do `data` é uma união de tipos com propriedades discriminantes, normalmente chamadas de uniões discriminadas no TypeScript:

```ts
type Forma =
	| { tipo: 'circulo'; raio: number }
	| { tipo: 'quadrado'; x: number }
	| { tipo: 'triangulo'; x: number; y: number };
```

Diferente de Haskell, a marcação, ou discriminante, é apenas uma propriedade em cada objeto de tipo. Cada variante tem uma propriedade idêntica com um tipo unitário diferente. Isso ainda é uma união de tipo normal; o `|` na frente é uma parte opcional da sintaxe de união de tipo. Você pode discriminar os membros de uma união usando código JavaScript normal:

```ts twoslash
type Forma =
	| { tipo: 'circulo'; raio: number }
	| { tipo: 'quadrado'; x: number }
	| { tipo: 'triangulo'; x: number; y: number };

function area(s: Forma) {
	if (s.tipo === 'circulo') {
		return Math.PI * s.raio * s.raio;
	} else if (s.tipo === 'quadrado') {
		return s.x * s.x;
	} else {
		return (s.x * s.y) / 2;
	}
}
```

Note que o tipo de retorno de `area` é inferido como `number` porque o TypeScript sabe que a função é total. Se alguma variante não é coberta, o tipo de retorno será `number | undefined`.

Também, diferente de Haskell, propriedades comuns aparecem em qualquer união, então você pode usualmente discriminar múltiplos membros da união:

```ts twoslash
type Forma =
	| { tipo: 'circulo'; raio: number }
	| { tipo: 'quadrado'; x: number }
	| { tipo: 'triangulo'; x: number; y: number };
// ---cut---
function altura(s: Forma) {
	if (s.tipo === 'circulo') {
		return 2 * s.raio;
	} else {
		// s.tipo: "quadrado" | "triangulo"
		return s.x;
	}
}
```

## Parâmetros de Tipo

Como a maioria das linguagens descendentes de C, TypeScript pede a declaração de parâmetros de tipo:

```ts
function levantarArray<T>(t: T): Array<T> {
	return [t];
}
```

Não há requerimento de caso, mas parâmetros de tipo são convencionalmente letras maiúsculas únicas. Parâmetros de tipo também podem ser restritos para um tipo, que se comporta um pouco como restrições de classes:

```ts
function primeiro<T extends { length: number }>(t1: T, t2: T): T {
	return t1.length > t2.length ? t1 : t2;
}
```

TypeScript pode usualmente inferir argumentos de tipo de uma chamada baseado no tipo dos argumentos, então argumentos de tipo não são usualmente necessários.

Por TypeScript ser estrutural, ele não precisa de nenhum parâmetro de tipo quanto tanto sistemas nominais. Especificamente, eles não são necessários para fazer uma função polimórfica. Parâmetros de tipo devem ser usados apenas para _propagar_ informação de tipo, como restringir parâmetros para serem do mesmo tipo:

```ts
function comprimento<T extends ArrayLike<unknown>>(t: T): number {}

function comprimento(t: ArrayLike<unknown>): number {}
```

No primeiro `comprimento`, T não é necessário; note que ele só é referenciado uma vez, então não está sendo usado para restringir o tipo do valor de retorno ou de outros parâmetros.

### Tipos superiores

TypeScript não tem tipos superiores, então o seguinte não é permitido:

```ts
function comprimento<T extends ArrayLike<unknown>, U>(m: T<U>) {}
```

### Programação livre de pontos

Programação livre de pontos &mdash; uso pesado de currying e composição de funções &mdash; é possível em JavaScript, mas pode ser verboso. Em TypeScript, a inferência de tipo falha frequentemente para programas livres de pontos, então você vai acabar especificando os parâmetros de tipo ao invés de parâmetros de valor. O resultado é tão verboso que é usualmente melhor evitar progamação livre de pontos.

## Sistema de módulos

A sintaxe moderna de módulos do JavaScript é parecida com a de Haskell, exceto que qualquer arquivo com `import` ou `export` é implicitamente um módulo:

```ts
import { value, Type } from 'npm-package';
import { other, Types } from './local-package';
import * as prefix from '../lib/third-package';
```

Você também pode importar módulos commonjs &mdash; módulos escritos usando o sistema de móudlos do node.js:

```ts
import f = require('single-function-package');
```

Você pode exportar com uma lista de exportação:

```ts
export { f };

function f() {
	return g();
}
function g() {} // g is not exported
```

Ou marcando cada export individualmente:

```ts
export function f { return g() }
function g() { }
```

O último é mais comum mas ambos são permitidos, mesmo quando no mesmo arquivo.

## `readonly` e `const`

Em JavaScript, mutabilidade é o padrão, embora ele permita declarações de variáveis com `const` para declarar que _referência_ é mutável. O refernte ainda é mutável:

```js
const a = [1, 2, 3];
a.push(102); // ):
a[0] = 101; // D:
```

TypeScript tem o modificador adicional `readonly` para propriedades.

```ts
interface Rx {
	readonly x: number;
}
let rx: Rx = { x: 1 };
rx.x = 12; // erro
```

Ele também conta com um tipo mapeado `Readonly<T>` que faz todas as propriedades serem `readonly`:

```ts
interface X {
	x: number;
}
let rx: Readonly<X> = { x: 1 };
rx.x = 12; // erro
```

E tem um tipo específico `ReadonlyArray<T>` que remove métodos de efeitos colaterais e previne escrita aos índices do array, assim como sintaxe especial para este tipo:

```ts
let a: ReadonlyArray<number> = [1, 2, 3];
let b: readonly number[] = [1, 2, 3];
a.push(102); // erro
b[0] = 101; // erro
```

Você também pode usar assertividade constante, que opera em objetos literais e arrays:

```ts
let a = [1, 2, 3] as const;
a.push(102); // erro
a[0] = 101; // erro
```

Entretanto, nenhuma dessas opções são o padrão, então elas não são consistentemente usadas em código TypeScript

## Próximos Passos

Essa documentação é uma resumo de alto nível da sintaxe e tipos qeu você usaria em código no dia-a-dia. Daqui você deve:

- Ler o Handbook completo [from start to finish](/docs/handbook/intro.html) (30m)
- Explorar os [exemplos do Playground](/play#show-examples)
