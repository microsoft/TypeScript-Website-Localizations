---
title: Mais sobre Funções
layout: docs
permalink: /pt/docs/handbook/2/functions.html
oneline: "Aprenda como as Funções funcionam em TypeScript."
---

Funções são o bloco de construção básico de qualquer aplicação, sejam elas funções locais, importadas de outro módulo ou métodos de uma classe.
Elas também são valores e, assim como outros valores, o TypeScript tem muitas formas de descrever como funções podem ser chamadas.
Vamos aprender como escrever tipos que descrevem funções.

## Expressões de Tipo de Função

A forma mais simples de descrever uma função é com uma _expressão de tipo de função_ (function type expression).
Esses tipos são sintaticamente parecidos com arrow functions:

```ts twoslash
function greeter(fn: (a: string) => void) {
  fn("Hello, World");
}

function printToConsole(s: string) {
  console.log(s);
}

greeter(printToConsole);
```

A sintaxe `(a: string) => void` significa "uma função com um parâmetro, chamado `a`, do tipo `string`, que não tem valor de retorno".
Assim como em declarações de função, se um tipo de parâmetro não é especificado, ele é implicitamente `any`.

> Note que o nome do parâmetro é **obrigatório**. O tipo de função `(string) => void` significa "uma função com um parâmetro chamado `string` do tipo `any`"!

Claro, podemos usar um alias de tipo para nomear um tipo de função:

```ts twoslash
type GreetFunction = (a: string) => void;
function greeter(fn: GreetFunction) {
  // ...
}
```

## Assinaturas de Chamada

Em JavaScript, funções podem ter propriedades além de serem chamáveis.
No entanto, a sintaxe de expressão de tipo de função não permite declarar propriedades.
Se quisermos descrever algo chamável com propriedades, podemos escrever uma _assinatura de chamada_ (call signature) em um tipo de objeto:

```ts twoslash
type DescribableFunction = {
  description: string;
  (someArg: number): boolean;
};
function doSomething(fn: DescribableFunction) {
  console.log(fn.description + " returned " + fn(6));
}

function myFunc(someArg: number) {
  return someArg > 3;
}
myFunc.description = "default description";

doSomething(myFunc);
```

Note que a sintaxe é um pouco diferente comparada a uma expressão de tipo de função — use `:` entre a lista de parâmetros e o tipo de retorno em vez de `=>`.

## Assinaturas de Construção

Funções JavaScript também podem ser invocadas com o operador `new`.
O TypeScript se refere a elas como _construtores_ porque geralmente criam um novo objeto.
Você pode escrever uma _assinatura de construção_ (construct signature) adicionando a palavra-chave `new` na frente de uma assinatura de chamada:

```ts twoslash
type SomeObject = any;
// ---cut---
type SomeConstructor = {
  new (s: string): SomeObject;
};
function fn(ctor: SomeConstructor) {
  return new ctor("hello");
}
```

Alguns objetos, como o objeto `Date` do JavaScript, podem ser chamados com ou sem `new`.
Você pode combinar assinaturas de chamada e de construção no mesmo tipo arbitrariamente:

```ts twoslash
interface CallOrConstruct {
  (n?: number): string;
  new (s: string): Date;
}

function fn(ctor: CallOrConstruct) {
  // Passar um argumento do tipo `number` para `ctor` o associa
  // à primeira definição na interface `CallOrConstruct`.
  console.log(ctor(10));
              // ^?

  // Da mesma forma, passar um argumento do tipo `string` para `ctor` o associa
  // à segunda definição na interface `CallOrConstruct`.
  console.log(new ctor("10"));
                  // ^?
}

fn(Date);
```

## Funções Genéricas

É comum escrever uma função em que os tipos da entrada se relacionam com o tipo da saída, ou em que os tipos de duas entradas estão relacionados de alguma forma.
Vamos considerar por um momento uma função que retorna o primeiro elemento de um array:

```ts twoslash
function firstElement(arr: any[]) {
  return arr[0];
}
```

Essa função faz seu trabalho, mas infelizmente tem o tipo de retorno `any`.
Seria melhor se a função retornasse o tipo do elemento do array.

Em TypeScript, _generics_ são usados quando queremos descrever uma correspondência entre dois valores.
Fazemos isso declarando um _parâmetro de tipo_ (type parameter) na assinatura da função:

```ts twoslash
function firstElement<Type>(arr: Type[]): Type | undefined {
  return arr[0];
}
```

Ao adicionar um parâmetro de tipo `Type` a essa função e usá-lo em dois lugares, criamos um vínculo entre a entrada da função (o array) e a saída (o valor de retorno).
Agora, quando a chamamos, um tipo mais específico aparece:

```ts twoslash
declare function firstElement<Type>(arr: Type[]): Type | undefined;
// ---cut---
// s é do tipo 'string'
const s = firstElement(["a", "b", "c"]);
// n é do tipo 'number'
const n = firstElement([1, 2, 3]);
// u é do tipo undefined
const u = firstElement([]);
```

### Inferência

Note que não tivemos que especificar `Type` neste exemplo.
O tipo foi _inferido_ — escolhido automaticamente — pelo TypeScript.

Também podemos usar múltiplos parâmetros de tipo.
Por exemplo, uma versão independente de `map` ficaria assim:

```ts twoslash
// prettier-ignore
function map<Input, Output>(arr: Input[], func: (arg: Input) => Output): Output[] {
  return arr.map(func);
}

// O parâmetro 'n' é do tipo 'string'
// 'parsed' é do tipo 'number[]'
const parsed = map(["1", "2", "3"], (n) => parseInt(n));
```

Note que, neste exemplo, o TypeScript pôde inferir tanto o tipo do parâmetro de tipo `Input` (a partir do array `string` dado) quanto o parâmetro de tipo `Output` com base no valor de retorno da expressão de função (`number`).

### Restrições

Escrevemos algumas funções genéricas que podem funcionar em _qualquer_ tipo de valor.
Às vezes queremos relacionar dois valores, mas só conseguimos operar sobre um certo subconjunto de valores.
Nesse caso, podemos usar uma _restrição_ (constraint) para limitar os tipos que um parâmetro de tipo pode aceitar.

Vamos escrever uma função que retorna o maior de dois valores.
Para fazer isso, precisamos de uma propriedade `length` que seja um número.
_Restringimos_ o parâmetro de tipo a esse tipo escrevendo uma cláusula `extends`:

```ts twoslash
// @errors: 2345 2322
function longest<Type extends { length: number }>(a: Type, b: Type) {
  if (a.length >= b.length) {
    return a;
  } else {
    return b;
  }
}

// longerArray é do tipo 'number[]'
const longerArray = longest([1, 2], [1, 2, 3]);
// longerString é do tipo 'alice' | 'bob'
const longerString = longest("alice", "bob");
// Erro! Números não têm uma propriedade 'length'
const notOK = longest(10, 100);
```

Há algumas coisas interessantes a notar neste exemplo.
Permitimos que o TypeScript _inferisse_ o tipo de retorno de `longest`.
A inferência de tipo de retorno também funciona em funções genéricas.

Como restringimos `Type` a `{ length: number }`, tivemos permissão para acessar a propriedade `.length` dos parâmetros `a` e `b`.
Sem a restrição de tipo, não conseguiríamos acessar essas propriedades porque os valores poderiam ser de algum outro tipo sem uma propriedade length.

Os tipos de `longerArray` e `longerString` foram inferidos com base nos argumentos.
Lembre-se, generics têm tudo a ver com relacionar dois ou mais valores com o mesmo tipo!

Por fim, exatamente como gostaríamos, a chamada a `longest(10, 100)` é rejeitada porque o tipo `number` não tem uma propriedade `.length`.

### Trabalhando com Valores Restritos

Aqui está um erro comum ao trabalhar com restrições genéricas:

```ts twoslash
// @errors: 2322
function minimumLength<Type extends { length: number }>(
  obj: Type,
  minimum: number
): Type {
  if (obj.length >= minimum) {
    return obj;
  } else {
    return { length: minimum };
  }
}
```

Pode parecer que essa função está OK — `Type` é restrito a `{ length: number }`, e a função retorna ou `Type` ou um valor que corresponde a essa restrição.
O problema é que a função promete retornar o _mesmo_ tipo de objeto que foi passado, não apenas _algum_ objeto que corresponda à restrição.
Se este código fosse válido, você poderia escrever um código que definitivamente não funcionaria:

```ts twoslash
declare function minimumLength<Type extends { length: number }>(
  obj: Type,
  minimum: number
): Type;
// ---cut---
// 'arr' recebe o valor { length: 6 }
const arr = minimumLength([1, 2, 3], 6);
// e quebra aqui porque arrays têm
// um método 'slice', mas o objeto retornado não!
console.log(arr.slice(0));
```

### Especificando Argumentos de Tipo

O TypeScript geralmente consegue inferir os argumentos de tipo pretendidos em uma chamada genérica, mas nem sempre.
Por exemplo, digamos que você escreveu uma função para combinar dois arrays:

```ts twoslash
function combine<Type>(arr1: Type[], arr2: Type[]): Type[] {
  return arr1.concat(arr2);
}
```

Normalmente seria um erro chamar essa função com arrays incompatíveis:

```ts twoslash
// @errors: 2322
declare function combine<Type>(arr1: Type[], arr2: Type[]): Type[];
// ---cut---
const arr = combine([1, 2, 3], ["hello"]);
```

Se você pretendia fazer isso, no entanto, poderia especificar `Type` manualmente:

```ts twoslash
declare function combine<Type>(arr1: Type[], arr2: Type[]): Type[];
// ---cut---
const arr = combine<string | number>([1, 2, 3], ["hello"]);
```

### Diretrizes para Escrever Boas Funções Genéricas

Escrever funções genéricas é divertido, e pode ser fácil se empolgar com parâmetros de tipo.
Ter parâmetros de tipo demais ou usar restrições onde não são necessárias pode tornar a inferência menos bem-sucedida, frustrando quem chama sua função.

#### Empurre os Parâmetros de Tipo Para Baixo

Aqui estão duas formas de escrever uma função que parecem similares:

```ts twoslash
function firstElement1<Type>(arr: Type[]) {
  return arr[0];
}

function firstElement2<Type extends any[]>(arr: Type) {
  return arr[0];
}

// a: number (bom)
const a = firstElement1([1, 2, 3]);
// b: any (ruim)
const b = firstElement2([1, 2, 3]);
```

Estas podem parecer idênticas à primeira vista, mas `firstElement1` é uma forma muito melhor de escrever essa função.
Seu tipo de retorno inferido é `Type`, mas o tipo de retorno inferido de `firstElement2` é `any` porque o TypeScript tem que resolver a expressão `arr[0]` usando o tipo da restrição, em vez de "esperar" para resolver o elemento durante uma chamada.

> **Regra**: Quando possível, use o próprio parâmetro de tipo em vez de restringi-lo

#### Use Menos Parâmetros de Tipo

Aqui está outro par de funções similares:

```ts twoslash
function filter1<Type>(arr: Type[], func: (arg: Type) => boolean): Type[] {
  return arr.filter(func);
}

function filter2<Type, Func extends (arg: Type) => boolean>(
  arr: Type[],
  func: Func
): Type[] {
  return arr.filter(func);
}
```

Criamos um parâmetro de tipo `Func` que _não relaciona dois valores_.
Isso é sempre um sinal de alerta, porque significa que quem quiser especificar argumentos de tipo tem que especificar manualmente um argumento de tipo extra sem motivo.
`Func` não faz nada além de tornar a função mais difícil de ler e de raciocinar sobre ela!

> **Regra**: Sempre use o menor número possível de parâmetros de tipo

#### Parâmetros de Tipo Devem Aparecer Duas Vezes

Às vezes esquecemos que uma função pode não precisar ser genérica:

```ts twoslash
function greet<Str extends string>(s: Str) {
  console.log("Hello, " + s);
}

greet("world");
```

Poderíamos facilmente ter escrito uma versão mais simples:

```ts twoslash
function greet(s: string) {
  console.log("Hello, " + s);
}
```

Lembre-se, parâmetros de tipo servem para _relacionar os tipos de múltiplos valores_.
Se um parâmetro de tipo é usado apenas uma vez na assinatura da função, ele não está relacionando nada.
Isso inclui o tipo de retorno inferido; por exemplo, se `Str` fizesse parte do tipo de retorno inferido de `greet`, ele estaria relacionando os tipos do argumento e do retorno, então seria usado _duas vezes_ apesar de aparecer apenas uma vez no código escrito.

> **Regra**: Se um parâmetro de tipo só aparece em um lugar, reconsidere fortemente se você realmente precisa dele

## Parâmetros Opcionais

Funções em JavaScript muitas vezes recebem um número variável de argumentos.
Por exemplo, o método `toFixed` de `number` recebe uma contagem opcional de dígitos:

```ts twoslash
function f(n: number) {
  console.log(n.toFixed()); // 0 argumentos
  console.log(n.toFixed(3)); // 1 argumento
}
```

Podemos modelar isso em TypeScript marcando o parâmetro como _opcional_ com `?`:

```ts twoslash
function f(x?: number) {
  // ...
}
f(); // OK
f(10); // OK
```

Embora o parâmetro seja especificado como tipo `number`, o parâmetro `x` vai, na verdade, ter o tipo `number | undefined` porque parâmetros não especificados em JavaScript recebem o valor `undefined`.

Você também pode fornecer um _valor padrão_ para o parâmetro:

```ts twoslash
function f(x = 10) {
  // ...
}
```

Agora, no corpo de `f`, `x` vai ter o tipo `number` porque qualquer argumento `undefined` será substituído por `10`.
Note que quando um parâmetro é opcional, quem chama pode sempre passar `undefined`, já que isso simplesmente simula um argumento "ausente":

```ts twoslash
declare function f(x?: number): void;
// ---cut---
// Todos OK
f();
f(10);
f(undefined);
```

### Parâmetros Opcionais em Callbacks

Depois que você aprende sobre parâmetros opcionais e expressões de tipo de função, é muito fácil cometer os seguintes erros ao escrever funções que invocam callbacks:

```ts twoslash
function myForEach(arr: any[], callback: (arg: any, index?: number) => void) {
  for (let i = 0; i < arr.length; i++) {
    callback(arr[i], i);
  }
}
```

O que as pessoas geralmente pretendem ao escrever `index?` como um parâmetro opcional é que querem que ambas as chamadas a seguir sejam válidas:

```ts twoslash
// @errors: 2532 18048
declare function myForEach(
  arr: any[],
  callback: (arg: any, index?: number) => void
): void;
// ---cut---
myForEach([1, 2, 3], (a) => console.log(a));
myForEach([1, 2, 3], (a, i) => console.log(a, i));
```

O que isso _na verdade_ significa é que _`callback` pode ser invocado com um argumento_.
Em outras palavras, a definição da função diz que a implementação poderia ser assim:

```ts twoslash
// @errors: 2532 18048
function myForEach(arr: any[], callback: (arg: any, index?: number) => void) {
  for (let i = 0; i < arr.length; i++) {
    // Não estou a fim de fornecer o índice hoje
    callback(arr[i]);
  }
}
```

Por sua vez, o TypeScript vai impor esse significado e emitir erros que não são realmente possíveis:

<!-- prettier-ignore -->
```ts twoslash
// @errors: 2532 18048
declare function myForEach(
  arr: any[],
  callback: (arg: any, index?: number) => void
): void;
// ---cut---
myForEach([1, 2, 3], (a, i) => {
  console.log(i.toFixed());
});
```

Em JavaScript, se você chama uma função com mais argumentos do que há parâmetros, os argumentos extras são simplesmente ignorados.
O TypeScript se comporta da mesma forma.
Funções com menos parâmetros (dos mesmos tipos) podem sempre tomar o lugar de funções com mais parâmetros.

> **Regra**: Ao escrever um tipo de função para um callback, _nunca_ escreva um parâmetro opcional a menos que você pretenda _chamar_ a função sem passar aquele argumento

## Sobrecargas de Função

Algumas funções JavaScript podem ser chamadas com uma variedade de quantidades e tipos de argumentos.
Por exemplo, você poderia escrever uma função para produzir um `Date` que recebe ou um timestamp (um argumento) ou uma especificação de mês/dia/ano (três argumentos).

Em TypeScript, podemos especificar uma função que pode ser chamada de diferentes formas escrevendo _assinaturas de sobrecarga_ (overload signatures).
Para fazer isso, escreva algum número de assinaturas de função (geralmente duas ou mais), seguidas pelo corpo da função:

```ts twoslash
// @errors: 2575
function makeDate(timestamp: number): Date;
function makeDate(m: number, d: number, y: number): Date;
function makeDate(mOrTimestamp: number, d?: number, y?: number): Date {
  if (d !== undefined && y !== undefined) {
    return new Date(y, mOrTimestamp, d);
  } else {
    return new Date(mOrTimestamp);
  }
}
const d1 = makeDate(12345678);
const d2 = makeDate(5, 5, 5);
const d3 = makeDate(1, 3);
```

Neste exemplo, escrevemos duas sobrecargas: uma aceitando um argumento e outra aceitando três argumentos.
Essas duas primeiras assinaturas são chamadas de _assinaturas de sobrecarga_.

Depois, escrevemos uma implementação de função com uma assinatura compatível.
Funções têm uma assinatura de _implementação_, mas essa assinatura não pode ser chamada diretamente.
Mesmo tendo escrito uma função com dois parâmetros opcionais depois do obrigatório, ela não pode ser chamada com dois parâmetros!

### Assinaturas de Sobrecarga e a Assinatura de Implementação

Essa é uma fonte comum de confusão.
Muitas vezes as pessoas escrevem um código assim e não entendem por que há um erro:

```ts twoslash
// @errors: 2554
function fn(x: string): void;
function fn() {
  // ...
}
// Esperava poder chamar com zero argumentos
fn();
```

De novo, a assinatura usada para escrever o corpo da função não pode ser "vista" de fora.

> A assinatura da _implementação_ não é visível de fora.
> Ao escrever uma função sobrecarregada, você deve sempre ter _duas_ ou mais assinaturas acima da implementação da função.

A assinatura de implementação também deve ser _compatível_ com as assinaturas de sobrecarga.
Por exemplo, estas funções têm erros porque a assinatura de implementação não corresponde às sobrecargas de forma correta:

```ts twoslash
// @errors: 2394
function fn(x: boolean): void;
// O tipo do argumento não está certo
function fn(x: string): void;
function fn(x: boolean) {}
```

```ts twoslash
// @errors: 2394
function fn(x: string): string;
// O tipo de retorno não está certo
function fn(x: number): boolean;
function fn(x: string | number) {
  return "oops";
}
```

### Escrevendo Boas Sobrecargas

Assim como com generics, há algumas diretrizes que você deve seguir ao usar sobrecargas de função.
Seguir esses princípios vai tornar sua função mais fácil de chamar, mais fácil de entender e mais fácil de implementar.

Vamos considerar uma função que retorna o comprimento de uma string ou de um array:

```ts twoslash
function len(s: string): number;
function len(arr: any[]): number;
function len(x: any) {
  return x.length;
}
```

Essa função está boa; podemos invocá-la com strings ou arrays.
No entanto, não podemos invocá-la com um valor que pode ser uma string _ou_ um array, porque o TypeScript só consegue resolver uma chamada de função para uma única sobrecarga:

```ts twoslash
// @errors: 2769
declare function len(s: string): number;
declare function len(arr: any[]): number;
// ---cut---
len(""); // OK
len([0]); // OK
len(Math.random() > 0.5 ? "hello" : [0]);
```

Como ambas as sobrecargas têm a mesma quantidade de argumentos e o mesmo tipo de retorno, podemos, em vez disso, escrever uma versão não sobrecarregada da função:

```ts twoslash
function len(x: any[] | string) {
  return x.length;
}
```

Isso é muito melhor!
Quem chama pode invocá-la com qualquer um dos tipos de valor e, como bônus, não precisamos descobrir uma assinatura de implementação correta.

> Sempre prefira parâmetros com tipos de união em vez de sobrecargas, quando possível

## Declarando `this` em uma Função

O TypeScript vai inferir o que o `this` deve ser em uma função via análise de fluxo de código, por exemplo no seguinte caso:

```ts twoslash
const user = {
  id: 123,

  admin: false,
  becomeAdmin: function () {
    this.admin = true;
  },
};
```

O TypeScript entende que a função `user.becomeAdmin` tem um `this` correspondente que é o objeto externo `user`. O `this`, _hehe_, pode ser suficiente para muitos casos, mas há muitos casos em que você precisa de mais controle sobre qual objeto o `this` representa. A especificação do JavaScript afirma que você não pode ter um parâmetro chamado `this`, então o TypeScript usa esse espaço de sintaxe para deixar você declarar o tipo de `this` no corpo da função.

```ts twoslash
interface User {
  id: number;
  admin: boolean;
}
declare const getDB: () => DB;
// ---cut---
interface DB {
  filterUsers(filter: (this: User) => boolean): User[];
}

const db = getDB();
const admins = db.filterUsers(function (this: User) {
  return this.admin;
});
```

Esse padrão é comum em APIs no estilo de callback, onde outro objeto tipicamente controla quando sua função é chamada. Note que você precisa usar `function` e não arrow functions para obter esse comportamento:

```ts twoslash
// @errors: 7041 7017
interface User {
  id: number;
  admin: boolean;
}
declare const getDB: () => DB;
// ---cut---
interface DB {
  filterUsers(filter: (this: User) => boolean): User[];
}

const db = getDB();
const admins = db.filterUsers(() => this.admin);
```

## Outros Tipos Que Vale a Pena Conhecer

Há alguns tipos adicionais que você vai querer reconhecer e que aparecem com frequência ao trabalhar com tipos de função.
Como todos os tipos, você pode usá-los em qualquer lugar, mas estes são especialmente relevantes no contexto de funções.

### `void`

`void` representa o valor de retorno de funções que não retornam um valor.
É o tipo inferido sempre que uma função não tem nenhuma instrução `return`, ou não retorna nenhum valor explícito a partir dessas instruções de retorno:

```ts twoslash
// O tipo de retorno inferido é void
function noop() {
  return;
}
```

Em JavaScript, uma função que não retorna nenhum valor vai implicitamente retornar o valor `undefined`.
No entanto, `void` e `undefined` não são a mesma coisa em TypeScript.
Há mais detalhes no fim deste capítulo.

> `void` não é o mesmo que `undefined`.

### `object`

O tipo especial `object` se refere a qualquer valor que não seja um primitivo (`string`, `number`, `bigint`, `boolean`, `symbol`, `null` ou `undefined`).
Isso é diferente do _tipo de objeto vazio_ `{ }`, e também diferente do tipo global `Object`.
É muito provável que você nunca use `Object`.

> `object` não é `Object`. **Sempre** use `object`!

Note que em JavaScript, valores de função são objetos: eles têm propriedades, têm `Object.prototype` em sua cadeia de protótipos, são `instanceof Object`, você pode chamar `Object.keys` neles, e assim por diante.
Por essa razão, tipos de função são considerados `object`s em TypeScript.

### `unknown`

O tipo `unknown` representa _qualquer_ valor.
Isso é parecido com o tipo `any`, mas é mais seguro porque não é válido fazer nada com um valor `unknown`:

```ts twoslash
// @errors: 2571 18046
function f1(a: any) {
  a.b(); // OK
}
function f2(a: unknown) {
  a.b();
}
```

Isso é útil ao descrever tipos de função porque você pode descrever funções que aceitam qualquer valor sem ter valores `any` no corpo da sua função.

Por outro lado, você pode descrever uma função que retorna um valor de tipo desconhecido:

```ts twoslash
declare const someRandomString: string;
// ---cut---
function safeParse(s: string): unknown {
  return JSON.parse(s);
}

// Precisa ter cuidado com 'obj'!
const obj = safeParse(someRandomString);
```

### `never`

Algumas funções _nunca_ retornam um valor:

```ts twoslash
function fail(msg: string): never {
  throw new Error(msg);
}
```

O tipo `never` representa valores que _nunca_ são observados.
Em um tipo de retorno, isso significa que a função lança uma exceção ou termina a execução do programa.

`never` também aparece quando o TypeScript determina que não há mais nada em uma união.

```ts twoslash
function fn(x: string | number) {
  if (typeof x === "string") {
    // faz algo
  } else if (typeof x === "number") {
    // faz outra coisa
  } else {
    x; // tem o tipo 'never'!
  }
}
```

### `Function`

O tipo global `Function` descreve propriedades como `bind`, `call`, `apply` e outras presentes em todos os valores de função em JavaScript.
Ele também tem a propriedade especial de que valores do tipo `Function` podem sempre ser chamados; essas chamadas retornam `any`:

```ts twoslash
function doSomething(f: Function) {
  return f(1, 2, 3);
}
```

Esta é uma _chamada de função não tipada_ e geralmente é melhor evitá-la por causa do tipo de retorno `any` inseguro.

Se você precisa aceitar uma função arbitrária mas não pretende chamá-la, o tipo `() => void` é geralmente mais seguro.

## Parâmetros Rest e Argumentos Rest

<blockquote class='bg-reading'>
   <p>Leitura de apoio:<br />
   <a href='https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters'>Rest Parameters</a><br/>
   <a href='https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax'>Spread Syntax</a><br/>
   </p>
</blockquote>

### Parâmetros Rest

Além de usar parâmetros opcionais ou sobrecargas para fazer funções que aceitam uma variedade de contagens fixas de argumentos, também podemos definir funções que recebem um número _ilimitado_ de argumentos usando _parâmetros rest_.

Um parâmetro rest aparece depois de todos os outros parâmetros, e usa a sintaxe `...`:

```ts twoslash
function multiply(n: number, ...m: number[]) {
  return m.map((x) => n * x);
}
// 'a' recebe o valor [10, 20, 30, 40]
const a = multiply(10, 1, 2, 3, 4);
```

Em TypeScript, a anotação de tipo nesses parâmetros é implicitamente `any[]` em vez de `any`, e qualquer anotação de tipo dada deve ser da forma `Array<T>` ou `T[]`, ou um tipo de tupla (que vamos aprender mais tarde).

### Argumentos Rest

Por outro lado, podemos _fornecer_ um número variável de argumentos a partir de um objeto iterável (por exemplo, um array) usando a sintaxe de espalhamento (spread).
Por exemplo, o método `push` de arrays recebe qualquer número de argumentos:

```ts twoslash
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
arr1.push(...arr2);
```

Note que, em geral, o TypeScript não assume que arrays são imutáveis.
Isso pode levar a algum comportamento surpreendente:

```ts twoslash
// @errors: 2556
// O tipo inferido é number[] -- "um array com zero ou mais números",
// não especificamente dois números
const args = [8, 5];
const angle = Math.atan2(...args);
```

A melhor correção para essa situação depende um pouco do seu código, mas em geral um contexto `const` é a solução mais direta:

```ts twoslash
// Inferido como tupla de comprimento 2
const args = [8, 5] as const;
// OK
const angle = Math.atan2(...args);
```

Usar argumentos rest pode exigir ligar o [`downlevelIteration`](/tsconfig#downlevelIteration) ao mirar em runtimes mais antigos.

<!-- TODO link to downlevel iteration -->

## Desestruturação de Parâmetros

<blockquote class='bg-reading'>
   <p>Leitura de apoio:<br />
   <a href='https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment'>Destructuring Assignment</a><br/>
   </p>
</blockquote>

Você pode usar a desestruturação de parâmetros para desempacotar convenientemente objetos fornecidos como argumento em uma ou mais variáveis locais no corpo da função.
Em JavaScript, fica assim:

```js
function sum({ a, b, c }) {
  console.log(a + b + c);
}
sum({ a: 10, b: 3, c: 9 });
```

A anotação de tipo para o objeto vai depois da sintaxe de desestruturação:

```ts twoslash
function sum({ a, b, c }: { a: number; b: number; c: number }) {
  console.log(a + b + c);
}
```

Isso pode parecer um pouco verboso, mas você também pode usar um tipo nomeado aqui:

```ts twoslash
// Igual ao exemplo anterior
type ABC = { a: number; b: number; c: number };
function sum({ a, b, c }: ABC) {
  console.log(a + b + c);
}
```

## Atribuibilidade de Funções

### Tipo de retorno `void`

O tipo de retorno `void` para funções pode produzir um comportamento incomum, mas esperado.

Tipagem contextual com um tipo de retorno `void` **não** força funções a **não** retornarem algo. Outra forma de dizer isso é que um tipo de função contextual com um tipo de retorno `void` (`type voidFunc = () => void`), quando implementado, pode retornar _qualquer_ outro valor, mas ele será ignorado.

Assim, as seguintes implementações do tipo `() => void` são válidas:

```ts twoslash
type voidFunc = () => void;

const f1: voidFunc = () => {
  return true;
};

const f2: voidFunc = () => true;

const f3: voidFunc = function () {
  return true;
};
```

E quando o valor de retorno de uma dessas funções é atribuído a outra variável, ele vai reter o tipo `void`:

```ts twoslash
type voidFunc = () => void;

const f1: voidFunc = () => {
  return true;
};

const f2: voidFunc = () => true;

const f3: voidFunc = function () {
  return true;
};
// ---cut---
const v1 = f1();

const v2 = f2();

const v3 = f3();
```

Esse comportamento existe para que o código a seguir seja válido, mesmo que `Array.prototype.push` retorne um número e o método `Array.prototype.forEach` espere uma função com um tipo de retorno `void`.

```ts twoslash
const src = [1, 2, 3];
const dst = [0];

src.forEach((el) => dst.push(el));
```

Há um outro caso especial a se ter em mente: quando uma definição de função literal tem um tipo de retorno `void`, essa função **não** deve retornar nada.

```ts twoslash
function f2(): void {
  // @ts-expect-error
  return true;
}

const f3 = function (): void {
  // @ts-expect-error
  return true;
};
```

Para mais sobre `void`, por favor, consulte estas outras entradas da documentação:

- [FAQ - "Why are functions returning non-void assignable to function returning void?"](https://github.com/Microsoft/TypeScript/wiki/FAQ#why-are-functions-returning-non-void-assignable-to-function-returning-void)
