---
title: Estreitamento de Tipos
layout: docs
permalink: /pt/docs/handbook/2/narrowing.html
oneline: "Entenda como o TypeScript usa o conhecimento de JavaScript para reduzir a quantidade de sintaxe de tipos nos seus projetos."
---

Imagine que temos uma função chamada `padLeft`.

```ts twoslash
function padLeft(padding: number | string, input: string): string {
  throw new Error("Not implemented yet!");
}
```

Se `padding` é um `number`, ela vai tratar isso como o número de espaços que queremos adicionar antes de `input`.
Se `padding` é uma `string`, ela deve apenas adicionar `padding` antes de `input`.
Vamos tentar implementar a lógica para quando `padLeft` recebe um `number` como `padding`.

```ts twoslash
// @errors: 2345
function padLeft(padding: number | string, input: string): string {
  return " ".repeat(padding) + input;
}
```

Opa, estamos recebendo um erro em `padding`.
O TypeScript está nos avisando que estamos passando um valor com tipo `number | string` para a função `repeat`, que só aceita um `number`, e ele está certo.
Em outras palavras, não verificamos explicitamente se `padding` é um `number` primeiro, nem estamos tratando o caso em que é uma `string`, então vamos fazer exatamente isso.

```ts twoslash
function padLeft(padding: number | string, input: string): string {
  if (typeof padding === "number") {
    return " ".repeat(padding) + input;
  }
  return padding + input;
}
```

Se isso parece, na maior parte, código JavaScript pouco interessante, esse é meio que o ponto.
Tirando as anotações que colocamos, este código TypeScript parece JavaScript.
A ideia é que o sistema de tipos do TypeScript busca tornar o mais fácil possível escrever código JavaScript típico sem ter que se contorcer todo para obter segurança de tipos.

Embora possa não parecer muito, na verdade há bastante coisa acontecendo nos bastidores aqui.
Assim como o TypeScript analisa valores em tempo de execução usando tipos estáticos, ele sobrepõe análise de tipos às construções de fluxo de controle em tempo de execução do JavaScript, como `if/else`, ternários condicionais, loops, verificações de veracidade, etc., que podem todas afetar esses tipos.

Dentro da nossa verificação `if`, o TypeScript vê `typeof padding === "number"` e entende isso como uma forma especial de código chamada _guarda de tipo_ (type guard).
O TypeScript segue os possíveis caminhos de execução que nossos programas podem tomar para analisar o tipo mais específico possível de um valor em uma dada posição.
Ele olha para essas verificações especiais (chamadas de _guardas de tipo_) e atribuições, e o processo de refinar tipos para tipos mais específicos do que o declarado é chamado de _estreitamento_ (narrowing).
Em muitos editores podemos observar esses tipos conforme eles mudam, e vamos fazer exatamente isso nos nossos exemplos.

```ts twoslash
function padLeft(padding: number | string, input: string): string {
  if (typeof padding === "number") {
    return " ".repeat(padding) + input;
    //                ^?
  }
  return padding + input;
  //     ^?
}
```

Existem algumas construções diferentes que o TypeScript entende para estreitamento.

## Guardas de tipo `typeof`

Como vimos, o JavaScript suporta um operador `typeof` que pode dar informação bem básica sobre o tipo dos valores que temos em tempo de execução.
O TypeScript espera que isso retorne um certo conjunto de strings:

- `"string"`
- `"number"`
- `"bigint"`
- `"boolean"`
- `"symbol"`
- `"undefined"`
- `"object"`
- `"function"`

Como vimos com `padLeft`, esse operador aparece com bastante frequência em diversas bibliotecas JavaScript, e o TypeScript consegue entendê-lo para estreitar tipos em diferentes ramos.

Em TypeScript, verificar contra o valor retornado por `typeof` é uma guarda de tipo.
Como o TypeScript codifica como o `typeof` opera em diferentes valores, ele conhece algumas de suas peculiaridades em JavaScript.
Por exemplo, note que na lista acima o `typeof` não retorna a string `null`.
Veja o exemplo a seguir:

```ts twoslash
// @errors: 2531 18047
function printAll(strs: string | string[] | null) {
  if (typeof strs === "object") {
    for (const s of strs) {
      console.log(s);
    }
  } else if (typeof strs === "string") {
    console.log(strs);
  } else {
    // não faz nada
  }
}
```

Na função `printAll`, tentamos verificar se `strs` é um objeto para ver se é um tipo array (agora pode ser uma boa hora para reforçar que arrays são tipos de objeto em JavaScript).
Mas acontece que em JavaScript o `typeof null` é, na verdade, `"object"`!
Esse é um daqueles infelizes acidentes da história.

Usuários com experiência suficiente podem não se surpreender, mas nem todo mundo já esbarrou nisso em JavaScript; por sorte, o TypeScript nos avisa que `strs` só foi estreitado para `string[] | null` em vez de apenas `string[]`.

Esta pode ser uma boa transição para o que vamos chamar de verificação de "veracidade" (truthiness).

# Estreitamento por veracidade

"Veracidade" (truthiness) talvez não seja uma palavra que você vá encontrar no dicionário, mas é com certeza algo que você vai ouvir falar em JavaScript.

Em JavaScript, podemos usar qualquer expressão em condicionais, `&&`s, `||`s, instruções `if`, negações booleanas (`!`) e mais.
Como exemplo, instruções `if` não esperam que sua condição sempre tenha o tipo `boolean`.

```ts twoslash
function getUsersOnlineMessage(numUsersOnline: number) {
  if (numUsersOnline) {
    return `There are ${numUsersOnline} online now!`;
  }
  return "Nobody's here. :(";
}
```

Em JavaScript, construções como `if` primeiro "coagem" suas condições para `boolean`s para dar sentido a elas, e então escolhem seus ramos dependendo de o resultado ser `true` ou `false`.
Valores como

- `0`
- `NaN`
- `""` (a string vazia)
- `0n` (a versão `bigint` de zero)
- `null`
- `undefined`

todos coagem para `false`, e os outros valores são coagidos para `true`.
Você sempre pode coagir valores para `boolean`s passando-os pela função `Boolean`, ou usando a forma mais curta de dupla negação booleana. (A última tem a vantagem de o TypeScript inferir um tipo literal booleano estreito `true`, enquanto infere a primeira como tipo `boolean`.)

```ts twoslash
// ambas resultam em 'true'
Boolean("hello"); // tipo: boolean, valor: true
!!"world"; // tipo: true,    valor: true
```

É bem popular tirar proveito desse comportamento, especialmente para se proteger contra valores como `null` ou `undefined`.
Como exemplo, vamos tentar usá-lo na nossa função `printAll`.

```ts twoslash
function printAll(strs: string | string[] | null) {
  if (strs && typeof strs === "object") {
    for (const s of strs) {
      console.log(s);
    }
  } else if (typeof strs === "string") {
    console.log(strs);
  }
}
```

Você vai notar que nos livramos do erro acima ao verificar se `strs` é "verdadeiro" (truthy).
Isso pelo menos nos previne de erros temidos quando rodamos nosso código, como:

```txt
TypeError: null is not iterable
```

Tenha em mente, porém, que a verificação de veracidade em primitivos pode muitas vezes ser propensa a erros.
Como exemplo, considere uma tentativa diferente de escrever `printAll`:

```ts twoslash {class: "do-not-do-this"}
function printAll(strs: string | string[] | null) {
  // !!!!!!!!!!!!!!!!
  //   NÃO FAÇA ISSO!
  //   CONTINUE LENDO
  // !!!!!!!!!!!!!!!!
  if (strs) {
    if (typeof strs === "object") {
      for (const s of strs) {
        console.log(s);
      }
    } else if (typeof strs === "string") {
      console.log(strs);
    }
  }
}
```

Envolvemos todo o corpo da função em uma verificação de veracidade, mas isso tem uma desvantagem sutil: podemos não estar mais tratando o caso da string vazia corretamente.

O TypeScript não nos prejudica em nada aqui, mas vale a pena notar esse comportamento se você é menos familiarizado com JavaScript.
O TypeScript muitas vezes pode te ajudar a pegar bugs cedo, mas se você escolher não fazer _nada_ com um valor, há um limite para o que ele pode fazer sem ser prescritivo demais.
Se quiser, você pode garantir que trata situações como essas com um linter.

Uma última palavra sobre estreitamento por veracidade é que negações booleanas com `!` filtram para fora dos ramos negados.

```ts twoslash
function multiplyAll(
  values: number[] | undefined,
  factor: number
): number[] | undefined {
  if (!values) {
    return values;
  } else {
    return values.map((x) => x * factor);
  }
}
```

## Estreitamento por igualdade

O TypeScript também usa instruções `switch` e verificações de igualdade como `===`, `!==`, `==` e `!=` para estreitar tipos.
Por exemplo:

```ts twoslash
function example(x: string | number, y: string | boolean) {
  if (x === y) {
    // Agora podemos chamar qualquer método de 'string' em 'x' ou 'y'.
    x.toUpperCase();
    // ^?
    y.toLowerCase();
    // ^?
  } else {
    console.log(x);
    //          ^?
    console.log(y);
    //          ^?
  }
}
```

Quando verificamos que `x` e `y` são ambos iguais no exemplo acima, o TypeScript sabia que seus tipos também tinham que ser iguais.
Como `string` é o único tipo em comum que tanto `x` quanto `y` poderiam assumir, o TypeScript sabe que `x` e `y` devem ser `string`s no primeiro ramo.

Verificar contra valores literais específicos (ao contrário de variáveis) também funciona.
Na nossa seção sobre estreitamento por veracidade, escrevemos uma função `printAll` que era propensa a erros porque acidentalmente não tratava strings vazias corretamente.
Em vez disso, poderíamos ter feito uma verificação específica para bloquear `null`s, e o TypeScript ainda remove corretamente `null` do tipo de `strs`.

```ts twoslash
function printAll(strs: string | string[] | null) {
  if (strs !== null) {
    if (typeof strs === "object") {
      for (const s of strs) {
        //            ^?
        console.log(s);
      }
    } else if (typeof strs === "string") {
      console.log(strs);
      //          ^?
    }
  }
}
```

As verificações de igualdade mais frouxas do JavaScript com `==` e `!=` também são estreitadas corretamente.
Se você não é familiarizado, verificar se algo é `== null` na verdade não só verifica se ele é especificamente o valor `null` — também verifica se ele é potencialmente `undefined`.
O mesmo se aplica a `== undefined`: verifica se um valor é ou `null` ou `undefined`.

```ts twoslash
interface Container {
  value: number | null | undefined;
}

function multiplyValue(container: Container, factor: number) {
  // Remove tanto 'null' quanto 'undefined' do tipo.
  if (container.value != null) {
    console.log(container.value);
    //                    ^?

    // Agora podemos multiplicar 'container.value' com segurança.
    container.value *= factor;
  }
}
```

## Estreitamento pelo operador `in`

O JavaScript tem um operador para determinar se um objeto ou sua cadeia de protótipos tem uma propriedade com um determinado nome: o operador `in`.
O TypeScript leva isso em conta como uma forma de estreitar tipos potenciais.

Por exemplo, com o código: `"value" in x`, onde `"value"` é um literal de string e `x` é um tipo de união.
O ramo "verdadeiro" estreita os tipos de `x` que têm uma propriedade `value` opcional ou obrigatória, e o ramo "falso" estreita para tipos que têm uma propriedade `value` opcional ou ausente.

```ts twoslash
type Fish = { swim: () => void };
type Bird = { fly: () => void };

function move(animal: Fish | Bird) {
  if ("swim" in animal) {
    return animal.swim();
  }

  return animal.fly();
}
```

Para reiterar, propriedades opcionais vão existir em ambos os lados para o estreitamento. Por exemplo, um humano poderia tanto nadar quanto voar (com o equipamento certo) e, portanto, deveria aparecer em ambos os lados da verificação `in`:

<!-- prettier-ignore -->
```ts twoslash
type Fish = { swim: () => void };
type Bird = { fly: () => void };
type Human = { swim?: () => void; fly?: () => void };

function move(animal: Fish | Bird | Human) {
  if ("swim" in animal) {
    animal;
//  ^?
  } else {
    animal;
//  ^?
  }
}
```

## Estreitamento por `instanceof`

O JavaScript tem um operador para verificar se um valor é ou não uma "instância" de outro valor.
Mais especificamente, em JavaScript `x instanceof Foo` verifica se a _cadeia de protótipos_ de `x` contém `Foo.prototype`.
Embora não vamos nos aprofundar aqui, e você verá mais disso quando chegarmos às classes, eles ainda podem ser úteis para a maioria dos valores que podem ser construídos com `new`.
Como você deve ter adivinhado, `instanceof` também é uma guarda de tipo, e o TypeScript estreita nos ramos protegidos por `instanceof`s.

```ts twoslash
function logValue(x: Date | string) {
  if (x instanceof Date) {
    console.log(x.toUTCString());
    //          ^?
  } else {
    console.log(x.toUpperCase());
    //          ^?
  }
}
```

## Atribuições

Como mencionamos antes, quando atribuímos a qualquer variável, o TypeScript olha para o lado direito da atribuição e estreita o lado esquerdo de forma apropriada.

```ts twoslash
let x = Math.random() < 0.5 ? 10 : "hello world!";
//  ^?
x = 1;

console.log(x);
//          ^?
x = "goodbye!";

console.log(x);
//          ^?
```

Note que cada uma dessas atribuições é válida.
Mesmo que o tipo observado de `x` tenha mudado para `number` depois da nossa primeira atribuição, ainda fomos capazes de atribuir uma `string` a `x`.
Isso acontece porque o _tipo declarado_ de `x` — o tipo com que `x` começou — é `string | number`, e a atribuibilidade é sempre verificada contra o tipo declarado.

Se tivéssemos atribuído um `boolean` a `x`, teríamos visto um erro, já que isso não fazia parte do tipo declarado.

```ts twoslash
// @errors: 2322
let x = Math.random() < 0.5 ? 10 : "hello world!";
//  ^?
x = 1;

console.log(x);
//          ^?
x = true;

console.log(x);
//          ^?
```

## Análise de fluxo de controle

Até este ponto, passamos por alguns exemplos básicos de como o TypeScript estreita dentro de ramos específicos.
Mas há um pouco mais acontecendo do que apenas subir a partir de cada variável e procurar guardas de tipo em `if`s, `while`s, condicionais, etc.
Por exemplo:

```ts twoslash
function padLeft(padding: number | string, input: string) {
  if (typeof padding === "number") {
    return " ".repeat(padding) + input;
  }
  return padding + input;
}
```

`padLeft` retorna de dentro do seu primeiro bloco `if`.
O TypeScript foi capaz de analisar este código e ver que o resto do corpo (`return padding + input;`) é _inalcançável_ no caso em que `padding` é um `number`.
Como resultado, ele conseguiu remover `number` do tipo de `padding` (estreitando de `string | number` para `string`) para o resto da função.

Essa análise de código baseada em alcançabilidade é chamada de _análise de fluxo de controle_, e o TypeScript usa essa análise de fluxo para estreitar tipos conforme encontra guardas de tipo e atribuições.
Quando uma variável é analisada, o fluxo de controle pode se dividir e se juntar novamente repetidamente, e essa variável pode ser observada com um tipo diferente em cada ponto.

```ts twoslash
function example() {
  let x: string | number | boolean;

  x = Math.random() < 0.5;

  console.log(x);
  //          ^?

  if (Math.random() < 0.5) {
    x = "hello";
    console.log(x);
    //          ^?
  } else {
    x = 100;
    console.log(x);
    //          ^?
  }

  return x;
  //     ^?
}
```

## Usando predicados de tipo

Trabalhamos com construções existentes do JavaScript para tratar o estreitamento até agora, porém às vezes você quer um controle mais direto sobre como os tipos mudam ao longo do seu código.

Para definir uma guarda de tipo definida pelo usuário, simplesmente precisamos definir uma função cujo tipo de retorno seja um _predicado de tipo_ (type predicate):

```ts twoslash
type Fish = { swim: () => void };
type Bird = { fly: () => void };
declare function getSmallPet(): Fish | Bird;
// ---cut---
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}
```

`pet is Fish` é o nosso predicado de tipo neste exemplo.
Um predicado tem a forma `nomeDoParâmetro is Tipo`, onde `nomeDoParâmetro` deve ser o nome de um parâmetro da assinatura da função atual.

Toda vez que `isFish` é chamada com alguma variável, o TypeScript vai _estreitar_ essa variável para aquele tipo específico se o tipo original for compatível.

```ts twoslash
type Fish = { swim: () => void };
type Bird = { fly: () => void };
declare function getSmallPet(): Fish | Bird;
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}
// ---cut---
// Ambas as chamadas a 'swim' e 'fly' agora estão ok.
let pet = getSmallPet();

if (isFish(pet)) {
  pet.swim();
} else {
  pet.fly();
}
```

Note que o TypeScript não apenas sabe que `pet` é um `Fish` no ramo `if`;
ele também sabe que no ramo `else` você _não_ tem um `Fish`, então você deve ter um `Bird`.

Você pode usar a guarda de tipo `isFish` para filtrar um array de `Fish | Bird` e obter um array de `Fish`:

```ts twoslash
type Fish = { swim: () => void; name: string };
type Bird = { fly: () => void; name: string };
declare function getSmallPet(): Fish | Bird;
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}
// ---cut---
const zoo: (Fish | Bird)[] = [getSmallPet(), getSmallPet(), getSmallPet()];
const underWater1: Fish[] = zoo.filter(isFish);
// ou, de forma equivalente
const underWater2: Fish[] = zoo.filter(isFish) as Fish[];

// O predicado pode precisar ser repetido para exemplos mais complexos
const underWater3: Fish[] = zoo.filter((pet): pet is Fish => {
  if (pet.name === "sharkey") return false;
  return isFish(pet);
});
```

Além disso, classes podem [usar `this is Type`](/docs/handbook/2/classes.html#this-based-type-guards) para estreitar seu tipo.

## Funções de asserção

Tipos também podem ser estreitados usando [Funções de asserção](/docs/handbook/release-notes/typescript-3-7.html#assertion-functions).

# Uniões discriminadas

A maioria dos exemplos que vimos até agora se concentrou em estreitar variáveis únicas com tipos simples como `string`, `boolean` e `number`.
Embora isso seja comum, na maior parte do tempo em JavaScript vamos lidar com estruturas um pouco mais complexas.

Para alguma motivação, vamos imaginar que estamos tentando codificar formas geométricas como círculos e quadrados.
Círculos guardam seus raios e quadrados guardam o comprimento de seus lados.
Vamos usar um campo chamado `kind` para dizer com qual forma estamos lidando.
Aqui está uma primeira tentativa de definir `Shape`.

```ts twoslash
interface Shape {
  kind: "circle" | "square";
  radius?: number;
  sideLength?: number;
}
```

Note que estamos usando uma união de tipos literais de string: `"circle"` e `"square"` para nos dizer se devemos tratar a forma como um círculo ou um quadrado, respectivamente.
Ao usar `"circle" | "square"` em vez de `string`, podemos evitar problemas de erro de digitação.

```ts twoslash
// @errors: 2367
interface Shape {
  kind: "circle" | "square";
  radius?: number;
  sideLength?: number;
}

// ---cut---
function handleShape(shape: Shape) {
  // opa!
  if (shape.kind === "rect") {
    // ...
  }
}
```

Podemos escrever uma função `getArea` que aplica a lógica correta com base em se está lidando com um círculo ou um quadrado.
Vamos primeiro tentar lidar com círculos.

```ts twoslash
// @errors: 2532 18048
interface Shape {
  kind: "circle" | "square";
  radius?: number;
  sideLength?: number;
}

// ---cut---
function getArea(shape: Shape) {
  return Math.PI * shape.radius ** 2;
}
```

<!-- TODO -->

Sob [`strictNullChecks`](/tsconfig#strictNullChecks) isso nos dá um erro — o que é apropriado, já que `radius` pode não estar definido.
Mas e se realizarmos as verificações apropriadas na propriedade `kind`?

```ts twoslash
// @errors: 2532 18048
interface Shape {
  kind: "circle" | "square";
  radius?: number;
  sideLength?: number;
}

// ---cut---
function getArea(shape: Shape) {
  if (shape.kind === "circle") {
    return Math.PI * shape.radius ** 2;
  }
}
```

Hmm, o TypeScript ainda não sabe o que fazer aqui.
Chegamos a um ponto em que sabemos mais sobre nossos valores do que o verificador de tipos.
Poderíamos tentar usar uma asserção não-nula (um `!` depois de `shape.radius`) para dizer que `radius` está definitivamente presente.

```ts twoslash
interface Shape {
  kind: "circle" | "square";
  radius?: number;
  sideLength?: number;
}

// ---cut---
function getArea(shape: Shape) {
  if (shape.kind === "circle") {
    return Math.PI * shape.radius! ** 2;
  }
}
```

Mas isso não parece ideal.
Tivemos que gritar um pouco com o verificador de tipos com aquelas asserções não-nulas (`!`) para convencê-lo de que `shape.radius` estava definido, mas essas asserções são propensas a erros se começarmos a mover o código de lugar.
Além disso, fora do [`strictNullChecks`](/tsconfig#strictNullChecks) conseguimos acessar acidentalmente qualquer um desses campos de qualquer forma (já que propriedades opcionais são simplesmente assumidas como sempre presentes quando lidas).
Com certeza podemos fazer melhor.

O problema com essa codificação de `Shape` é que o verificador de tipos não tem como saber se `radius` ou `sideLength` estão presentes com base na propriedade `kind`.
Precisamos comunicar o que _nós_ sabemos ao verificador de tipos.
Com isso em mente, vamos dar mais uma tentativa de definir `Shape`.

```ts twoslash
interface Circle {
  kind: "circle";
  radius: number;
}

interface Square {
  kind: "square";
  sideLength: number;
}

type Shape = Circle | Square;
```

Aqui, separamos corretamente `Shape` em dois tipos com valores diferentes para a propriedade `kind`, mas `radius` e `sideLength` são declarados como propriedades obrigatórias em seus respectivos tipos.

Vamos ver o que acontece aqui quando tentamos acessar o `radius` de um `Shape`.

```ts twoslash
// @errors: 2339
interface Circle {
  kind: "circle";
  radius: number;
}

interface Square {
  kind: "square";
  sideLength: number;
}

type Shape = Circle | Square;

// ---cut---
function getArea(shape: Shape) {
  return Math.PI * shape.radius ** 2;
}
```

Assim como na nossa primeira definição de `Shape`, isso ainda é um erro.
Quando `radius` era opcional, recebemos um erro (com [`strictNullChecks`](/tsconfig#strictNullChecks) habilitado) porque o TypeScript não conseguia dizer se a propriedade estava presente.
Agora que `Shape` é uma união, o TypeScript está nos dizendo que `shape` pode ser um `Square`, e `Square`s não têm `radius` definido neles!
Ambas as interpretações estão corretas, mas apenas a codificação como união de `Shape` vai causar um erro independentemente de como o [`strictNullChecks`](/tsconfig#strictNullChecks) está configurado.

Mas e se tentássemos verificar a propriedade `kind` de novo?

```ts twoslash
interface Circle {
  kind: "circle";
  radius: number;
}

interface Square {
  kind: "square";
  sideLength: number;
}

type Shape = Circle | Square;

// ---cut---
function getArea(shape: Shape) {
  if (shape.kind === "circle") {
    return Math.PI * shape.radius ** 2;
    //               ^?
  }
}
```

Isso se livrou do erro!
Quando todo tipo em uma união contém uma propriedade comum com tipos literais, o TypeScript considera isso uma _união discriminada_ (discriminated union), e consegue estreitar os membros da união.

Neste caso, `kind` era essa propriedade comum (que é o que é considerado uma propriedade _discriminante_ de `Shape`).
Verificar se a propriedade `kind` era `"circle"` se livrou de todo tipo em `Shape` que não tinha uma propriedade `kind` com o tipo `"circle"`.
Isso estreitou `shape` para o tipo `Circle`.

A mesma verificação funciona com instruções `switch` também.
Agora podemos tentar escrever nosso `getArea` completo sem nenhuma daquelas chatas asserções não-nulas `!`.

```ts twoslash
interface Circle {
  kind: "circle";
  radius: number;
}

interface Square {
  kind: "square";
  sideLength: number;
}

type Shape = Circle | Square;

// ---cut---
function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    //                 ^?
    case "square":
      return shape.sideLength ** 2;
    //       ^?
  }
}
```

O importante aqui era a codificação de `Shape`.
Comunicar a informação certa ao TypeScript — que `Circle` e `Square` eram, na verdade, dois tipos separados com campos `kind` específicos — foi crucial.
Fazer isso nos permite escrever código TypeScript com segurança de tipos que não parece nada diferente do JavaScript que teríamos escrito de outra forma.
A partir daí, o sistema de tipos foi capaz de fazer a coisa "certa" e descobrir os tipos em cada ramo da nossa instrução `switch`.

> Como observação, tente brincar com o exemplo acima e remover algumas das palavras-chave `return`.
> Você vai ver que a verificação de tipos pode ajudar a evitar bugs ao cair acidentalmente em diferentes cláusulas de uma instrução `switch`.

Uniões discriminadas são úteis para mais do que apenas falar sobre círculos e quadrados.
Elas são boas para representar qualquer tipo de esquema de mensagens em JavaScript, como ao enviar mensagens pela rede (comunicação cliente/servidor) ou codificar mutações em um framework de gerenciamento de estado.

# O tipo `never`

Ao estreitar, você pode reduzir as opções de uma união até um ponto em que removeu todas as possibilidades e não sobrou nada.
Nesses casos, o TypeScript vai usar um tipo `never` para representar um estado que não deveria existir.

# Verificação de exaustividade

O tipo `never` é atribuível a todo tipo; porém, nenhum tipo é atribuível a `never` (exceto o próprio `never`). Isso significa que você pode usar o estreitamento e contar com o aparecimento de `never` para fazer verificação exaustiva em uma instrução `switch`.

Por exemplo, adicionar um `default` à nossa função `getArea` que tenta atribuir a forma a `never` não vai levantar um erro quando todos os casos possíveis tiverem sido tratados.

```ts twoslash
interface Circle {
  kind: "circle";
  radius: number;
}

interface Square {
  kind: "square";
  sideLength: number;
}
// ---cut---
type Shape = Circle | Square;

function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.sideLength ** 2;
    default:
      const _exhaustiveCheck: never = shape;
      return _exhaustiveCheck;
  }
}
```

Adicionar um novo membro à união `Shape` vai causar um erro do TypeScript:

```ts twoslash
// @errors: 2322
interface Circle {
  kind: "circle";
  radius: number;
}

interface Square {
  kind: "square";
  sideLength: number;
}
// ---cut---
interface Triangle {
  kind: "triangle";
  sideLength: number;
}

type Shape = Circle | Square | Triangle;

function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.sideLength ** 2;
    default:
      const _exhaustiveCheck: never = shape;
      return _exhaustiveCheck;
  }
}
```
