---
title: Tipos de Objeto
layout: docs
permalink: /pt/docs/handbook/2/objects.html
oneline: "Como o TypeScript descreve os formatos dos objetos JavaScript."
---

Em JavaScript, a forma fundamental de agrupar e passar dados é através de objetos.
Em TypeScript, representamos isso através de _tipos de objeto_.

Como já vimos, eles podem ser anônimos:

```ts twoslash
function greet(person: { name: string; age: number }) {
  //                   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  return "Hello " + person.name;
}
```

ou podem ser nomeados usando ou uma interface:

```ts twoslash
interface Person {
  //      ^^^^^^
  name: string;
  age: number;
}

function greet(person: Person) {
  return "Hello " + person.name;
}
```

ou um alias de tipo:

```ts twoslash
type Person = {
  // ^^^^^^
  name: string;
  age: number;
};

function greet(person: Person) {
  return "Hello " + person.name;
}
```

Nos três exemplos acima, escrevemos funções que recebem objetos que contêm a propriedade `name` (que deve ser uma `string`) e `age` (que deve ser um `number`).

## Referência Rápida

Temos cheat-sheets disponíveis tanto para [`type` quanto para `interface`](https://www.typescriptlang.org/cheatsheets), caso você queira dar uma olhada rápida na sintaxe importante do dia a dia.

## Modificadores de Propriedade

Cada propriedade em um tipo de objeto pode especificar algumas coisas: o tipo, se a propriedade é opcional e se a propriedade pode ser escrita.

### Propriedades Opcionais

Na maior parte do tempo, vamos nos ver lidando com objetos que _podem_ ter uma propriedade definida.
Nesses casos, podemos marcar essas propriedades como _opcionais_ adicionando um ponto de interrogação (`?`) ao fim de seus nomes.

```ts twoslash
interface Shape {}
declare function getShape(): Shape;

// ---cut---
interface PaintOptions {
  shape: Shape;
  xPos?: number;
  //  ^
  yPos?: number;
  //  ^
}

function paintShape(opts: PaintOptions) {
  // ...
}

const shape = getShape();
paintShape({ shape });
paintShape({ shape, xPos: 100 });
paintShape({ shape, yPos: 100 });
paintShape({ shape, xPos: 100, yPos: 100 });
```

Neste exemplo, tanto `xPos` quanto `yPos` são consideradas opcionais.
Podemos escolher fornecer qualquer uma delas, então toda chamada a `paintShape` acima é válida.
Tudo o que a opcionalidade realmente diz é que se a propriedade _for_ definida, é melhor que ela tenha um tipo específico.

Também podemos ler dessas propriedades — mas quando fazemos isso sob [`strictNullChecks`](/tsconfig#strictNullChecks), o TypeScript vai nos dizer que elas são potencialmente `undefined`.

```ts twoslash
interface Shape {}
declare function getShape(): Shape;

interface PaintOptions {
  shape: Shape;
  xPos?: number;
  yPos?: number;
}

// ---cut---
function paintShape(opts: PaintOptions) {
  let xPos = opts.xPos;
  //              ^?
  let yPos = opts.yPos;
  //              ^?
  // ...
}
```

Em JavaScript, mesmo que a propriedade nunca tenha sido definida, ainda podemos acessá-la — ela só vai nos dar o valor `undefined`.
Podemos simplesmente tratar `undefined` de forma especial verificando-o.

```ts twoslash
interface Shape {}
declare function getShape(): Shape;

interface PaintOptions {
  shape: Shape;
  xPos?: number;
  yPos?: number;
}

// ---cut---
function paintShape(opts: PaintOptions) {
  let xPos = opts.xPos === undefined ? 0 : opts.xPos;
  //  ^?
  let yPos = opts.yPos === undefined ? 0 : opts.yPos;
  //  ^?
  // ...
}
```

Note que esse padrão de definir valores padrão para valores não especificados é tão comum que o JavaScript tem sintaxe para suportá-lo.

```ts twoslash
interface Shape {}
declare function getShape(): Shape;

interface PaintOptions {
  shape: Shape;
  xPos?: number;
  yPos?: number;
}

// ---cut---
function paintShape({ shape, xPos = 0, yPos = 0 }: PaintOptions) {
  console.log("x coordinate at", xPos);
  //                             ^?
  console.log("y coordinate at", yPos);
  //                             ^?
  // ...
}
```

Aqui usamos [um padrão de desestruturação](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) para o parâmetro de `paintShape`, e fornecemos [valores padrão](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Default_values) para `xPos` e `yPos`.
Agora `xPos` e `yPos` estão ambos definitivamente presentes dentro do corpo de `paintShape`, mas são opcionais para quem chama `paintShape`.

> Note que atualmente não há forma de colocar anotações de tipo dentro de padrões de desestruturação.
> Isso acontece porque a sintaxe a seguir já significa algo diferente em JavaScript.
>
> ```ts twoslash
> // @noImplicitAny: false
> // @errors: 2552 2304
> interface Shape {}
> declare function render(x: unknown);
> // ---cut---
> function draw({ shape: Shape, xPos: number = 100 /*...*/ }) {
>   render(shape);
>   render(xPos);
> }
> ```
>
> Em um padrão de desestruturação de objeto, `shape: Shape` significa "pegue a propriedade `shape` e redefina-a localmente como uma variável chamada `Shape`".
> Da mesma forma, `xPos: number` cria uma variável chamada `number` cujo valor é baseado no `xPos` do parâmetro.

### Propriedades `readonly`

Propriedades também podem ser marcadas como `readonly` para o TypeScript.
Embora isso não mude nenhum comportamento em tempo de execução, uma propriedade marcada como `readonly` não pode ser escrita durante a verificação de tipos.

```ts twoslash
// @errors: 2540
interface SomeType {
  readonly prop: string;
}

function doSomething(obj: SomeType) {
  // Podemos ler de 'obj.prop'.
  console.log(`prop has the value '${obj.prop}'.`);

  // Mas não podemos reatribuí-la.
  obj.prop = "hello";
}
```

Usar o modificador `readonly` não implica necessariamente que um valor seja totalmente imutável — ou, em outras palavras, que seu conteúdo interno não possa ser alterado.
Significa apenas que a própria propriedade não pode ser reescrita.

```ts twoslash
// @errors: 2540
interface Home {
  readonly resident: { name: string; age: number };
}

function visitForBirthday(home: Home) {
  // Podemos ler e atualizar propriedades de 'home.resident'.
  console.log(`Happy birthday ${home.resident.name}!`);
  home.resident.age++;
}

function evict(home: Home) {
  // Mas não podemos escrever na própria propriedade 'resident' de um 'Home'.
  home.resident = {
    name: "Victor the Evictor",
    age: 42,
  };
}
```

É importante gerenciar as expectativas sobre o que `readonly` implica.
É útil para sinalizar intenção durante o tempo de desenvolvimento ao TypeScript sobre como um objeto deve ser usado.
O TypeScript não leva em conta se as propriedades de dois tipos são `readonly` ao verificar se esses tipos são compatíveis, então propriedades `readonly` também podem mudar via aliasing.

```ts twoslash
interface Person {
  name: string;
  age: number;
}

interface ReadonlyPerson {
  readonly name: string;
  readonly age: number;
}

let writablePerson: Person = {
  name: "Person McPersonface",
  age: 42,
};

// funciona
let readonlyPerson: ReadonlyPerson = writablePerson;

console.log(readonlyPerson.age); // imprime '42'
writablePerson.age++;
console.log(readonlyPerson.age); // imprime '43'
```

Usando [modificadores de mapeamento](/docs/handbook/2/mapped-types.html#mapping-modifiers), você pode remover atributos `readonly`.

### Assinaturas de Índice

Às vezes você não sabe de antemão todos os nomes das propriedades de um tipo, mas conhece o formato dos valores.

Nesses casos, você pode usar uma assinatura de índice (index signature) para descrever os tipos dos valores possíveis, por exemplo:

```ts twoslash
declare function getStringArray(): StringArray;
// ---cut---
interface StringArray {
  [index: number]: string;
}

const myArray: StringArray = getStringArray();
const secondItem = myArray[1];
//     ^?
```

Acima, temos uma interface `StringArray` que tem uma assinatura de índice.
Essa assinatura de índice declara que, quando um `StringArray` é indexado com um `number`, ele vai retornar uma `string`.

Apenas alguns tipos são permitidos para propriedades de assinatura de índice: `string`, `number`, `symbol`, padrões de template string e tipos de união compostos apenas por esses.

<details>
    <summary>É possível suportar múltiplos tipos de indexadores...</summary>
    <p>É possível suportar múltiplos tipos de indexadores. Note que ao usar tanto indexadores `number` quanto `string`, o tipo retornado de um indexador numérico deve ser um subtipo do tipo retornado do indexador de string. Isso acontece porque, ao indexar com um <code>number</code>, o JavaScript na verdade vai convertê-lo para uma <code>string</code> antes de indexar em um objeto. Isso significa que indexar com <code>100</code> (um <code>number</code>) é a mesma coisa que indexar com <code>"100"</code> (uma <code>string</code>), então os dois precisam ser consistentes.</p>

```ts twoslash
// @errors: 2413
// @strictPropertyInitialization: false
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

// Erro: indexar com uma string numérica pode te dar um tipo de Animal completamente separado!
interface NotOkay {
  [x: number]: Animal;
  [x: string]: Dog;
}
```

</details>

Embora assinaturas de índice de string sejam uma forma poderosa de descrever o padrão de "dicionário", elas também forçam que todas as propriedades correspondam ao seu tipo de retorno.
Isso acontece porque um índice de string declara que `obj.property` também está disponível como `obj["property"]`.
No exemplo a seguir, o tipo de `name` não corresponde ao tipo do índice de string, e o verificador de tipos dá um erro:

```ts twoslash
// @errors: 2411
// @errors: 2411
interface NumberDictionary {
  [index: string]: number;

  length: number; // ok
  name: string;
}
```

No entanto, propriedades de tipos diferentes são aceitáveis se a assinatura de índice for uma união dos tipos das propriedades:

```ts twoslash
interface NumberOrStringDictionary {
  [index: string]: number | string;
  length: number; // ok, length é um number
  name: string; // ok, name é uma string
}
```

Por fim, você pode tornar assinaturas de índice `readonly` para prevenir atribuição aos seus índices:

```ts twoslash
declare function getReadOnlyStringArray(): ReadonlyStringArray;
// ---cut---
// @errors: 2542
interface ReadonlyStringArray {
  readonly [index: number]: string;
}

let myArray: ReadonlyStringArray = getReadOnlyStringArray();
myArray[2] = "Mallory";
```

Você não pode definir `myArray[2]` porque a assinatura de índice é `readonly`.

## Verificações de Propriedades Excedentes

Onde e como um objeto recebe um tipo pode fazer diferença no sistema de tipos.
Um dos exemplos principais disso é a verificação de propriedades excedentes (excess property checking), que valida o objeto de forma mais completa quando ele é criado e atribuído a um tipo de objeto durante a criação.

```ts twoslash
// @errors: 2345 2739
interface SquareConfig {
  color?: string;
  width?: number;
}

function createSquare(config: SquareConfig): { color: string; area: number } {
  return {
    color: config.color || "red",
    area: config.width ? config.width * config.width : 20,
  };
}

let mySquare = createSquare({ colour: "red", width: 100 });
```

Note que o argumento dado para `createSquare` está escrito como _`colour`_ em vez de `color`.
Em JavaScript puro, esse tipo de coisa falha silenciosamente.

Você poderia argumentar que este programa está corretamente tipado, já que as propriedades `width` são compatíveis, não há propriedade `color` presente, e a propriedade extra `colour` é insignificante.

No entanto, o TypeScript assume a posição de que provavelmente há um bug neste código.
Literais de objeto recebem tratamento especial e passam por _verificação de propriedades excedentes_ ao serem atribuídos a outras variáveis, ou passados como argumentos.
Se um literal de objeto tem qualquer propriedade que o "tipo alvo" não tem, você vai receber um erro:

```ts twoslash
// @errors: 2345 2739
interface SquareConfig {
  color?: string;
  width?: number;
}

function createSquare(config: SquareConfig): { color: string; area: number } {
  return {
    color: config.color || "red",
    area: config.width ? config.width * config.width : 20,
  };
}
// ---cut---
let mySquare = createSquare({ colour: "red", width: 100 });
```

Contornar essas verificações é, na verdade, bem simples.
O método mais fácil é apenas usar uma asserção de tipo:

```ts twoslash
// @errors: 2345 2739
interface SquareConfig {
  color?: string;
  width?: number;
}

function createSquare(config: SquareConfig): { color: string; area: number } {
  return {
    color: config.color || "red",
    area: config.width ? config.width * config.width : 20,
  };
}
// ---cut---
let mySquare = createSquare({ width: 100, opacity: 0.5 } as SquareConfig);
```

No entanto, uma abordagem melhor pode ser adicionar uma assinatura de índice de string se você tem certeza de que o objeto pode ter algumas propriedades extras que são usadas de alguma forma especial.
Se `SquareConfig` pode ter propriedades `color` e `width` com os tipos acima, mas também poderia ter qualquer número de outras propriedades, então poderíamos defini-lo assim:

```ts twoslash
interface SquareConfig {
  color?: string;
  width?: number;
  [propName: string]: unknown;
}
```

Aqui estamos dizendo que `SquareConfig` pode ter qualquer número de propriedades e, contanto que não sejam `color` ou `width`, seus tipos não importam.

Uma última forma de contornar essas verificações, que pode ser um pouco surpreendente, é atribuir o objeto a outra variável:
Como atribuir `squareOptions` não vai passar por verificações de propriedades excedentes, o compilador não vai te dar um erro:

```ts twoslash
interface SquareConfig {
  color?: string;
  width?: number;
}

function createSquare(config: SquareConfig): { color: string; area: number } {
  return {
    color: config.color || "red",
    area: config.width ? config.width * config.width : 20,
  };
}
// ---cut---
let squareOptions = { colour: "red", width: 100 };
let mySquare = createSquare(squareOptions);
```

A solução acima vai funcionar contanto que você tenha uma propriedade em comum entre `squareOptions` e `SquareConfig`.
Neste exemplo, foi a propriedade `width`. No entanto, ela vai falhar se a variável não tiver nenhuma propriedade de objeto em comum. Por exemplo:

```ts twoslash
// @errors: 2559
interface SquareConfig {
  color?: string;
  width?: number;
}

function createSquare(config: SquareConfig): { color: string; area: number } {
  return {
    color: config.color || "red",
    area: config.width ? config.width * config.width : 20,
  };
}
// ---cut---
let squareOptions = { colour: "red" };
let mySquare = createSquare(squareOptions);
```

Tenha em mente que, para código simples como o acima, você provavelmente não deveria tentar "contornar" essas verificações.
Para literais de objeto mais complexos que têm métodos e mantêm estado, você pode precisar ter essas técnicas em mente, mas a maioria dos erros de propriedade excedente são, na verdade, bugs.

Isso significa que se você está esbarrando em problemas de verificação de propriedades excedentes para algo como "sacos de opções" (option bags), pode precisar revisar algumas de suas declarações de tipo.
Neste caso, se está tudo bem passar um objeto com uma propriedade `color` ou `colour` para `createSquare`, você deveria corrigir a definição de `SquareConfig` para refletir isso.

## Estendendo Tipos

É bem comum ter tipos que podem ser versões mais específicas de outros tipos.
Por exemplo, poderíamos ter um tipo `BasicAddress` que descreve os campos necessários para enviar cartas e pacotes nos EUA.

```ts twoslash
interface BasicAddress {
  name?: string;
  street: string;
  city: string;
  country: string;
  postalCode: string;
}
```

Em algumas situações isso é suficiente, mas endereços muitas vezes têm um número de unidade associado a eles se o prédio em um endereço tem múltiplas unidades.
Podemos então descrever um `AddressWithUnit`.

<!-- prettier-ignore -->
```ts twoslash
interface AddressWithUnit {
  name?: string;
  unit: string;
//^^^^^^^^^^^^^
  street: string;
  city: string;
  country: string;
  postalCode: string;
}
```

Isso resolve o problema, mas a desvantagem aqui é que tivemos que repetir todos os outros campos de `BasicAddress` quando nossas mudanças eram puramente aditivas.
Em vez disso, podemos estender o tipo `BasicAddress` original e apenas adicionar os novos campos que são únicos de `AddressWithUnit`.

```ts twoslash
interface BasicAddress {
  name?: string;
  street: string;
  city: string;
  country: string;
  postalCode: string;
}

interface AddressWithUnit extends BasicAddress {
  unit: string;
}
```

A palavra-chave `extends` em uma `interface` nos permite efetivamente copiar membros de outros tipos nomeados e adicionar quaisquer novos membros que quisermos.
Isso pode ser útil para reduzir a quantidade de boilerplate de declaração de tipo que temos que escrever, e para sinalizar a intenção de que várias declarações diferentes da mesma propriedade podem estar relacionadas.
Por exemplo, `AddressWithUnit` não precisou repetir a propriedade `street` e, como `street` se origina de `BasicAddress`, quem lê vai saber que esses dois tipos estão relacionados de alguma forma.

`interface`s também podem estender de múltiplos tipos.

```ts twoslash
interface Colorful {
  color: string;
}

interface Circle {
  radius: number;
}

interface ColorfulCircle extends Colorful, Circle {}

const cc: ColorfulCircle = {
  color: "red",
  radius: 42,
};
```

## Tipos de Interseção

`interface`s nos permitiram construir novos tipos a partir de outros tipos estendendo-os.
O TypeScript fornece outra construção chamada _tipos de interseção_ (intersection types) que é usada principalmente para combinar tipos de objeto existentes.

Um tipo de interseção é definido usando o operador `&`.

```ts twoslash
interface Colorful {
  color: string;
}
interface Circle {
  radius: number;
}

type ColorfulCircle = Colorful & Circle;
```

Aqui, fizemos a interseção de `Colorful` e `Circle` para produzir um novo tipo que tem todos os membros de `Colorful` _e_ `Circle`.

```ts twoslash
// @errors: 2345
interface Colorful {
  color: string;
}
interface Circle {
  radius: number;
}
// ---cut---
function draw(circle: Colorful & Circle) {
  console.log(`Color was ${circle.color}`);
  console.log(`Radius was ${circle.radius}`);
}

// ok
draw({ color: "blue", radius: 42 });

// opa
draw({ color: "red", raidus: 42 });
```

## Extensão de Interface vs. Interseção

Acabamos de ver duas formas de combinar tipos que são parecidas, mas são, na verdade, sutilmente diferentes.
Com interfaces, podíamos usar uma cláusula `extends` para estender de outros tipos, e conseguimos fazer algo similar com interseções e nomear o resultado com um alias de tipo.
A principal diferença entre as duas é como conflitos são tratados, e essa diferença é tipicamente um dos principais motivos pelos quais você escolheria uma em vez da outra entre uma interface e um alias de tipo de um tipo de interseção.

Se interfaces forem definidas com o mesmo nome, o TypeScript vai tentar fundi-las se as propriedades forem compatíveis. Se as propriedades não forem compatíveis (ou seja, têm o mesmo nome de propriedade mas tipos diferentes), o TypeScript vai levantar um erro.

No caso de tipos de interseção, propriedades com tipos diferentes serão fundidas automaticamente. Quando o tipo for usado depois, o TypeScript vai esperar que a propriedade satisfaça ambos os tipos simultaneamente, o que pode produzir resultados inesperados.

Por exemplo, o código a seguir vai lançar um erro porque as propriedades são incompatíveis:

```ts
interface Person {
  name: string;
}

interface Person {
  name: number;
}
```

Em contraste, o código a seguir vai compilar, mas resulta em um tipo `never`:

```ts twoslash
interface Person1 {
  name: string;
}

interface Person2 {
  name: number;
}

type Staff = Person1 & Person2

declare const staffer: Staff;
staffer.name;
//       ^?
```
Neste caso, `Staff` exigiria que a propriedade `name` fosse tanto uma string quanto um number, o que resulta em a propriedade ser do tipo `never`.

## Tipos de Objeto Genéricos

Vamos imaginar um tipo `Box` que pode conter qualquer valor — `string`s, `number`s, `Giraffe`s, o que for.

```ts twoslash
interface Box {
  contents: any;
}
```

Por enquanto, a propriedade `contents` é tipada como `any`, o que funciona, mas pode levar a acidentes mais adiante.

Em vez disso, poderíamos usar `unknown`, mas isso significaria que, nos casos em que já sabemos o tipo de `contents`, precisaríamos fazer verificações preventivas, ou usar asserções de tipo propensas a erros.

```ts twoslash
interface Box {
  contents: unknown;
}

let x: Box = {
  contents: "hello world",
};

// poderíamos verificar 'x.contents'
if (typeof x.contents === "string") {
  console.log(x.contents.toLowerCase());
}

// ou poderíamos usar uma asserção de tipo
console.log((x.contents as string).toLowerCase());
```

Uma abordagem segura quanto a tipos seria, em vez disso, esboçar diferentes tipos de `Box` para cada tipo de `contents`.

```ts twoslash
// @errors: 2322
interface NumberBox {
  contents: number;
}

interface StringBox {
  contents: string;
}

interface BooleanBox {
  contents: boolean;
}
```

Mas isso significa que vamos ter que criar diferentes funções, ou sobrecargas de funções, para operar sobre esses tipos.

```ts twoslash
interface NumberBox {
  contents: number;
}

interface StringBox {
  contents: string;
}

interface BooleanBox {
  contents: boolean;
}
// ---cut---
function setContents(box: StringBox, newContents: string): void;
function setContents(box: NumberBox, newContents: number): void;
function setContents(box: BooleanBox, newContents: boolean): void;
function setContents(box: { contents: any }, newContents: any) {
  box.contents = newContents;
}
```

Isso é muito boilerplate. Além disso, podemos precisar mais tarde introduzir novos tipos e sobrecargas.
Isso é frustrante, já que nossos tipos de box e sobrecargas são todos efetivamente os mesmos.

Em vez disso, podemos fazer um tipo `Box` _genérico_ que declara um _parâmetro de tipo_.

```ts twoslash
interface Box<Type> {
  contents: Type;
}
```

Você pode ler isto como "Um `Box` de `Type` é algo cujo `contents` tem o tipo `Type`".
Mais tarde, quando nos referirmos a `Box`, temos que dar um _argumento de tipo_ no lugar de `Type`.

```ts twoslash
interface Box<Type> {
  contents: Type;
}
// ---cut---
let box: Box<string>;
```

Pense em `Box` como um template para um tipo real, onde `Type` é um espaço reservado que vai ser substituído por algum outro tipo.
Quando o TypeScript vê `Box<string>`, ele vai substituir toda instância de `Type` em `Box<Type>` por `string`, e acabar trabalhando com algo como `{ contents: string }`.
Em outras palavras, `Box<string>` e o nosso `StringBox` anterior funcionam de forma idêntica.

```ts twoslash
interface Box<Type> {
  contents: Type;
}
interface StringBox {
  contents: string;
}

let boxA: Box<string> = { contents: "hello" };
boxA.contents;
//   ^?

let boxB: StringBox = { contents: "world" };
boxB.contents;
//   ^?
```

`Box` é reutilizável no sentido de que `Type` pode ser substituído por qualquer coisa. Isso significa que quando precisamos de um box para um novo tipo, não precisamos declarar um novo tipo `Box` de forma alguma (embora certamente pudéssemos, se quiséssemos).

```ts twoslash
interface Box<Type> {
  contents: Type;
}

interface Apple {
  // ....
}

// Igual a '{ contents: Apple }'.
type AppleBox = Box<Apple>;
```

Isso também significa que podemos evitar sobrecargas completamente usando, em vez disso, [funções genéricas](/docs/handbook/2/functions.html#generic-functions).

```ts twoslash
interface Box<Type> {
  contents: Type;
}

// ---cut---
function setContents<Type>(box: Box<Type>, newContents: Type) {
  box.contents = newContents;
}
```

Vale notar que aliases de tipo também podem ser genéricos. Poderíamos ter definido a nossa nova interface `Box<Type>`, que era:

```ts twoslash
interface Box<Type> {
  contents: Type;
}
```

usando um alias de tipo em vez dela:

```ts twoslash
type Box<Type> = {
  contents: Type;
};
```

Como aliases de tipo, diferentemente de interfaces, podem descrever mais do que apenas tipos de objeto, também podemos usá-los para escrever outros tipos de tipos auxiliares genéricos.

```ts twoslash
// @errors: 2575
type OrNull<Type> = Type | null;

type OneOrMany<Type> = Type | Type[];

type OneOrManyOrNull<Type> = OrNull<OneOrMany<Type>>;
//   ^?

type OneOrManyOrNullStrings = OneOrManyOrNull<string>;
//   ^?
```

Vamos voltar aos aliases de tipo daqui a pouco.

### O Tipo `Array`

Tipos de objeto genéricos são, com frequência, algum tipo de container que funciona independentemente do tipo de elementos que contêm.
É ideal que estruturas de dados funcionem dessa forma para que sejam reutilizáveis entre diferentes tipos de dados.

Acontece que estivemos trabalhando com um tipo exatamente assim ao longo deste manual: o tipo `Array`.
Sempre que escrevemos tipos como `number[]` ou `string[]`, isso é, na verdade, apenas uma abreviação para `Array<number>` e `Array<string>`.

```ts twoslash
function doSomething(value: Array<string>) {
  // ...
}

let myArray: string[] = ["hello", "world"];

// qualquer um destes funciona!
doSomething(myArray);
doSomething(new Array("hello", "world"));
```

Muito parecido com o tipo `Box` acima, o próprio `Array` é um tipo genérico.

```ts twoslash
// @noLib: true
interface Number {}
interface String {}
interface Boolean {}
interface Symbol {}
// ---cut---
interface Array<Type> {
  /**
   * Obtém ou define o comprimento do array.
   */
  length: number;

  /**
   * Remove o último elemento de um array e o retorna.
   */
  pop(): Type | undefined;

  /**
   * Adiciona novos elementos a um array e retorna o novo comprimento do array.
   */
  push(...items: Type[]): number;

  // ...
}
```

O JavaScript moderno também fornece outras estruturas de dados que são genéricas, como `Map<K, V>`, `Set<T>` e `Promise<T>`.
Tudo o que isso realmente significa é que, por causa de como `Map`, `Set` e `Promise` se comportam, eles podem trabalhar com quaisquer conjuntos de tipos.

### O Tipo `ReadonlyArray`

O `ReadonlyArray` é um tipo especial que descreve arrays que não devem ser alterados.

```ts twoslash
// @errors: 2339
function doStuff(values: ReadonlyArray<string>) {
  // Podemos ler de 'values'...
  const copy = values.slice();
  console.log(`The first value is ${values[0]}`);

  // ...mas não podemos mutar 'values'.
  values.push("hello!");
}
```

Muito parecido com o modificador `readonly` para propriedades, é principalmente uma ferramenta que podemos usar para sinalizar intenção.
Quando vemos uma função que retorna `ReadonlyArray`s, isso nos diz que não devemos alterar o conteúdo de forma alguma, e quando vemos uma função que consome `ReadonlyArray`s, isso nos diz que podemos passar qualquer array para essa função sem nos preocupar que ela vai alterar seu conteúdo.

Diferentemente de `Array`, não há um construtor `ReadonlyArray` que possamos usar.

```ts twoslash
// @errors: 2693
new ReadonlyArray("red", "green", "blue");
```

Em vez disso, podemos atribuir `Array`s regulares a `ReadonlyArray`s.

```ts twoslash
const roArray: ReadonlyArray<string> = ["red", "green", "blue"];
```

Assim como o TypeScript fornece uma sintaxe abreviada para `Array<Type>` com `Type[]`, ele também fornece uma sintaxe abreviada para `ReadonlyArray<Type>` com `readonly Type[]`.

```ts twoslash
// @errors: 2339
function doStuff(values: readonly string[]) {
  //                     ^^^^^^^^^^^^^^^^^
  // Podemos ler de 'values'...
  const copy = values.slice();
  console.log(`The first value is ${values[0]}`);

  // ...mas não podemos mutar 'values'.
  values.push("hello!");
}
```

Uma última coisa a notar é que, diferentemente do modificador de propriedade `readonly`, a atribuibilidade não é bidirecional entre `Array`s regulares e `ReadonlyArray`s.

```ts twoslash
// @errors: 4104
let x: readonly string[] = [];
let y: string[] = [];

x = y;
y = x;
```

### Tipos de Tupla

Um _tipo de tupla_ (tuple type) é outro tipo de tipo `Array` que sabe exatamente quantos elementos contém, e exatamente quais tipos contém em posições específicas.

```ts twoslash
type StringNumberPair = [string, number];
//                      ^^^^^^^^^^^^^^^^
```

Aqui, `StringNumberPair` é um tipo de tupla de `string` e `number`.
Como `ReadonlyArray`, ela não tem representação em tempo de execução, mas é significativa para o TypeScript.
Para o sistema de tipos, `StringNumberPair` descreve arrays cujo índice `0` contém uma `string` e cujo índice `1` contém um `number`.

```ts twoslash
function doSomething(pair: [string, number]) {
  const a = pair[0];
  //    ^?
  const b = pair[1];
  //    ^?
  // ...
}

doSomething(["hello", 42]);
```

Se tentarmos indexar além do número de elementos, vamos receber um erro.

```ts twoslash
// @errors: 2493
function doSomething(pair: [string, number]) {
  // ...

  const c = pair[2];
}
```

Também podemos [desestruturar tuplas](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Array_destructuring) usando a desestruturação de array do JavaScript.

```ts twoslash
function doSomething(stringHash: [string, number]) {
  const [inputString, hash] = stringHash;

  console.log(inputString);
  //          ^?

  console.log(hash);
  //          ^?
}
```

> Tipos de tupla são úteis em APIs fortemente baseadas em convenção, onde o significado de cada elemento é "óbvio".
> Isso nos dá flexibilidade para nomear nossas variáveis como quisermos quando as desestruturamos.
> No exemplo acima, conseguimos nomear os elementos `0` e `1` com o que quiséssemos.
>
> No entanto, como nem todo usuário tem a mesma visão do que é óbvio, pode valer a pena reconsiderar se usar objetos com nomes de propriedade descritivos pode ser melhor para a sua API.

Tirando essas verificações de comprimento, tipos de tupla simples como estes são equivalentes a tipos que são versões de `Array`s que declaram propriedades para índices específicos, e que declaram `length` com um tipo literal numérico.

```ts twoslash
interface StringNumberPair {
  // propriedades especializadas
  length: 2;
  0: string;
  1: number;

  // Outros membros de 'Array<string | number>'...
  slice(start?: number, end?: number): Array<string | number>;
}
```

Outra coisa que pode te interessar é que tuplas podem ter propriedades opcionais escrevendo um ponto de interrogação (`?` após o tipo de um elemento).
Elementos opcionais de tupla só podem vir no fim, e também afetam o tipo de `length`.

```ts twoslash
type Either2dOr3d = [number, number, number?];

function setCoordinate(coord: Either2dOr3d) {
  const [x, y, z] = coord;
  //           ^?

  console.log(`Provided coordinates had ${coord.length} dimensions`);
  //                                            ^?
}
```

Tuplas também podem ter elementos rest, que têm que ser de um tipo array/tupla.

```ts twoslash
type StringNumberBooleans = [string, number, ...boolean[]];
type StringBooleansNumber = [string, ...boolean[], number];
type BooleansStringNumber = [...boolean[], string, number];
```

- `StringNumberBooleans` descreve uma tupla cujos primeiros dois elementos são `string` e `number` respectivamente, mas que pode ter qualquer número de `boolean`s em seguida.
- `StringBooleansNumber` descreve uma tupla cujo primeiro elemento é `string` e depois qualquer número de `boolean`s e terminando com um `number`.
- `BooleansStringNumber` descreve uma tupla cujos elementos iniciais são qualquer número de `boolean`s e terminando com uma `string` e depois um `number`.

Uma tupla com um elemento rest não tem um "comprimento" fixo — ela só tem um conjunto de elementos bem conhecidos em posições diferentes.

```ts twoslash
type StringNumberBooleans = [string, number, ...boolean[]];
// ---cut---
const a: StringNumberBooleans = ["hello", 1];
const b: StringNumberBooleans = ["beautiful", 2, true];
const c: StringNumberBooleans = ["world", 3, true, false, true, false, true];
```

Por que elementos opcionais e rest poderiam ser úteis?
Bem, isso permite que o TypeScript faça tuplas corresponderem a listas de parâmetros.
Tipos de tupla podem ser usados em [parâmetros rest e argumentos](/docs/handbook/2/functions.html#rest-parameters-and-arguments), de forma que o seguinte:

```ts twoslash
function readButtonInput(...args: [string, number, ...boolean[]]) {
  const [name, version, ...input] = args;
  // ...
}
```

é basicamente equivalente a:

```ts twoslash
function readButtonInput(name: string, version: number, ...input: boolean[]) {
  // ...
}
```

Isso é prático quando você quer receber um número variável de argumentos com um parâmetro rest, e precisa de um número mínimo de elementos, mas não quer introduzir variáveis intermediárias.

<!--
TODO do we need this example?

For example, imagine we need to write a function that adds up `number`s based on arguments that get passed in.

```ts twoslash
function sum(...args: number[]) {
    // ...
}
```

We might feel like it makes little sense to take any fewer than 2 elements, so we want to require callers to provide at least 2 arguments.
A first attempt might be

```ts twoslash
function foo(a: number, b: number, ...args: number[]) {
    args.unshift(a, b);

    let result = 0;
    for (const value of args) {
        result += value;
    }
    return result;
}
```

-->

### Tipos de Tupla `readonly`

Uma observação final sobre tipos de tupla — tipos de tupla têm variantes `readonly`, e podem ser especificados colocando um modificador `readonly` na frente deles — assim como com a sintaxe abreviada de array.

```ts twoslash
function doSomething(pair: readonly [string, number]) {
  //                       ^^^^^^^^^^^^^^^^^^^^^^^^^
  // ...
}
```

Como você deve esperar, escrever em qualquer propriedade de uma tupla `readonly` não é permitido em TypeScript.

```ts twoslash
// @errors: 2540
function doSomething(pair: readonly [string, number]) {
  pair[0] = "hello!";
}
```

Tuplas tendem a ser criadas e deixadas sem modificação na maior parte do código, então anotar tipos como tuplas `readonly` quando possível é um bom padrão.
Isso também é importante, dado que literais de array com asserções `const` serão inferidos com tipos de tupla `readonly`.

```ts twoslash
// @errors: 2345
let point = [3, 4] as const;

function distanceFromOrigin([x, y]: [number, number]) {
  return Math.sqrt(x ** 2 + y ** 2);
}

distanceFromOrigin(point);
```

Aqui, `distanceFromOrigin` nunca modifica seus elementos, mas espera uma tupla mutável.
Como o tipo de `point` foi inferido como `readonly [3, 4]`, ele não vai ser compatível com `[number, number]`, já que esse tipo não pode garantir que os elementos de `point` não serão mutados.

<!-- ## Other Kinds of Object Members

Most of the declarations in object types:

### Method Syntax

### Call Signatures

### Construct Signatures

### Index Signatures -->
