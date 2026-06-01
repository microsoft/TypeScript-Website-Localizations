---
title: Tipos do Dia a Dia
layout: docs
permalink: /pt/docs/handbook/2/everyday-types.html
oneline: "Os primitivos da linguagem."
---

Neste capítulo, vamos cobrir alguns dos tipos de valores mais comuns que você vai encontrar em código JavaScript e explicar as formas correspondentes de descrever esses tipos em TypeScript.
Esta não é uma lista exaustiva, e capítulos futuros vão descrever mais maneiras de nomear e usar outros tipos.

Tipos também podem aparecer em muitos mais _lugares_ além de apenas anotações de tipo.
À medida que aprendemos sobre os tipos em si, também vamos aprender sobre os lugares onde podemos nos referir a esses tipos para formar novas construções.

Vamos começar revisando os tipos mais básicos e comuns que você pode encontrar ao escrever código JavaScript ou TypeScript.
Eles vão formar mais tarde os blocos de construção centrais de tipos mais complexos.

## Os primitivos: `string`, `number` e `boolean`

O JavaScript tem três [primitivos](https://developer.mozilla.org/en-US/docs/Glossary/Primitive) usados com muita frequência: `string`, `number` e `boolean`.
Cada um tem um tipo correspondente em TypeScript.
Como você deve imaginar, esses são os mesmos nomes que você veria se usasse o operador `typeof` do JavaScript em um valor desses tipos:

- `string` representa valores de string como `"Hello, world"`
- `number` é para números como `42`. O JavaScript não tem um valor especial em tempo de execução para inteiros, então não há equivalente a `int` ou `float` — tudo é simplesmente `number`
- `boolean` é para os dois valores `true` e `false`

> Os nomes de tipo `String`, `Number` e `Boolean` (começando com letras maiúsculas) são válidos, mas se referem a alguns tipos especiais embutidos que vão aparecer muito raramente no seu código. _Sempre_ use `string`, `number` ou `boolean` para tipos.

## Arrays

Para especificar o tipo de um array como `[1, 2, 3]`, você pode usar a sintaxe `number[]`; essa sintaxe funciona para qualquer tipo (por exemplo, `string[]` é um array de strings, e assim por diante).
Você também pode ver isso escrito como `Array<number>`, que significa a mesma coisa.
Vamos aprender mais sobre a sintaxe `T<U>` quando cobrirmos _generics_.

> Note que `[number]` é uma coisa diferente; veja a seção sobre [Tuplas](/docs/handbook/2/objects.html#tuple-types).

## `any`

O TypeScript também tem um tipo especial, `any`, que você pode usar sempre que não quiser que um valor específico cause erros de verificação de tipos.

Quando um valor é do tipo `any`, você pode acessar quaisquer propriedades dele (que por sua vez serão do tipo `any`), chamá-lo como uma função, atribuí-lo a (ou a partir de) um valor de qualquer tipo, ou basicamente qualquer outra coisa que seja sintaticamente válida:

```ts twoslash
let obj: any = { x: 0 };
// Nenhuma das linhas de código a seguir vai lançar erros do compilador.
// Usar `any` desabilita toda a verificação de tipos subsequente, e presume-se
// que você conhece o ambiente melhor do que o TypeScript.
obj.foo();
obj();
obj.bar = 100;
obj = "hello";
const n: number = obj;
```

O tipo `any` é útil quando você não quer escrever um tipo longo só para convencer o TypeScript de que uma linha de código específica está ok.

### `noImplicitAny`

Quando você não especifica um tipo, e o TypeScript não consegue inferi-lo a partir do contexto, o compilador normalmente vai adotar `any` por padrão.

Geralmente você quer evitar isso, porém, porque `any` não passa por verificação de tipos.
Use a flag de compilador [`noImplicitAny`](/tsconfig#noImplicitAny) para sinalizar qualquer `any` implícito como um erro.

## Anotações de Tipo em Variáveis

Quando você declara uma variável usando `const`, `var` ou `let`, pode opcionalmente adicionar uma anotação de tipo para especificar explicitamente o tipo da variável:

```ts twoslash
let myName: string = "Alice";
//        ^^^^^^^^ Anotação de tipo
```

> O TypeScript não usa declarações no estilo "tipos à esquerda" como `int x = 0;`
> Anotações de tipo vão sempre _depois_ da coisa que está sendo tipada.

Na maioria dos casos, porém, isso não é necessário.
Sempre que possível, o TypeScript tenta _inferir_ automaticamente os tipos no seu código.
Por exemplo, o tipo de uma variável é inferido com base no tipo de seu inicializador:

```ts twoslash
// Nenhuma anotação de tipo necessária -- 'myName' inferida como tipo 'string'
let myName = "Alice";
```

Na maior parte das vezes, você não precisa aprender explicitamente as regras de inferência.
Se você está começando, tente usar menos anotações de tipo do que imagina — talvez você se surpreenda com a quantidade tão pequena de que precisa para o TypeScript entender completamente o que está acontecendo.

## Funções

Funções são o principal meio de passar dados de um lado para o outro em JavaScript.
O TypeScript permite que você especifique os tipos tanto dos valores de entrada quanto dos de saída das funções.

### Anotações de Tipo de Parâmetro

Quando você declara uma função, pode adicionar anotações de tipo após cada parâmetro para declarar que tipos de parâmetros a função aceita.
Anotações de tipo de parâmetro vêm depois do nome do parâmetro:

```ts twoslash
// Anotação de tipo de parâmetro
function greet(name: string) {
  //                 ^^^^^^^^
  console.log("Hello, " + name.toUpperCase() + "!!");
}
```

Quando um parâmetro tem uma anotação de tipo, os argumentos passados para aquela função serão verificados:

```ts twoslash
// @errors: 2345
declare function greet(name: string): void;
// ---cut---
// Seria um erro em tempo de execução se executado!
greet(42);
```

> Mesmo que você não tenha anotações de tipo nos seus parâmetros, o TypeScript ainda vai verificar se você passou o número certo de argumentos.

### Anotações de Tipo de Retorno

Você também pode adicionar anotações de tipo de retorno.
Anotações de tipo de retorno aparecem após a lista de parâmetros:

```ts twoslash
function getFavoriteNumber(): number {
  //                        ^^^^^^^^
  return 26;
}
```

Assim como acontece com anotações de tipo de variável, geralmente você não precisa de uma anotação de tipo de retorno, porque o TypeScript vai inferir o tipo de retorno da função com base em suas instruções `return`.
A anotação de tipo no exemplo acima não muda nada.
Algumas bases de código vão especificar explicitamente um tipo de retorno por motivos de documentação, para prevenir mudanças acidentais, ou apenas por preferência pessoal.

#### Funções Que Retornam Promises

Se você quiser anotar o tipo de retorno de uma função que retorna uma promise, deve usar o tipo `Promise`:

```ts twoslash
async function getFavoriteNumber(): Promise<number> {
  return 26;
}
```

### Funções Anônimas

Funções anônimas são um pouco diferentes de declarações de função.
Quando uma função aparece em um lugar onde o TypeScript consegue determinar como ela vai ser chamada, os parâmetros dessa função recebem tipos automaticamente.

Aqui está um exemplo:

```ts twoslash
// @errors: 2551
const names = ["Alice", "Bob", "Eve"];

// Tipagem contextual para função - parâmetro s inferido com tipo string
names.forEach(function (s) {
  console.log(s.toUpperCase());
});

// A tipagem contextual também se aplica a arrow functions
names.forEach((s) => {
  console.log(s.toUpperCase());
});
```

Mesmo que o parâmetro `s` não tivesse uma anotação de tipo, o TypeScript usou os tipos da função `forEach`, junto com o tipo inferido do array, para determinar o tipo que `s` vai ter.

Esse processo é chamado de _tipagem contextual_ porque o _contexto_ em que a função ocorreu informa qual tipo ela deveria ter.

Assim como as regras de inferência, você não precisa aprender explicitamente como isso acontece, mas entender que isso _de fato_ acontece pode ajudar a perceber quando anotações de tipo não são necessárias.
Mais tarde, vamos ver mais exemplos de como o contexto em que um valor ocorre pode afetar seu tipo.

## Tipos de Objeto

Além dos primitivos, o tipo mais comum que você vai encontrar é um _tipo de objeto_.
Isso se refere a qualquer valor JavaScript com propriedades, que é quase todos eles!
Para definir um tipo de objeto, simplesmente listamos suas propriedades e seus tipos.

Por exemplo, aqui está uma função que recebe um objeto parecido com um ponto:

```ts twoslash
// A anotação de tipo do parâmetro é um tipo de objeto
function printCoord(pt: { x: number; y: number }) {
  //                      ^^^^^^^^^^^^^^^^^^^^^^^^
  console.log("The coordinate's x value is " + pt.x);
  console.log("The coordinate's y value is " + pt.y);
}
printCoord({ x: 3, y: 7 });
```

Aqui, anotamos o parâmetro com um tipo que tem duas propriedades — `x` e `y` — que são ambas do tipo `number`.
Você pode usar `,` ou `;` para separar as propriedades, e o último separador é opcional de qualquer forma.

A parte do tipo de cada propriedade também é opcional.
Se você não especificar um tipo, será assumido que é `any`.

### Propriedades Opcionais

Tipos de objeto também podem especificar que algumas ou todas as suas propriedades são _opcionais_.
Para fazer isso, adicione um `?` após o nome da propriedade:

```ts twoslash
function printName(obj: { first: string; last?: string }) {
  // ...
}
// Ambos OK
printName({ first: "Bob" });
printName({ first: "Alice", last: "Alisson" });
```

Em JavaScript, se você acessar uma propriedade que não existe, vai obter o valor `undefined` em vez de um erro em tempo de execução.
Por causa disso, quando você _lê_ de uma propriedade opcional, vai ter que verificar se é `undefined` antes de usá-la.

```ts twoslash
// @errors: 18048
function printName(obj: { first: string; last?: string }) {
  // Erro - pode quebrar se 'obj.last' não tiver sido fornecido!
  console.log(obj.last.toUpperCase());
  if (obj.last !== undefined) {
    // OK
    console.log(obj.last.toUpperCase());
  }

  // Uma alternativa segura usando sintaxe moderna do JavaScript:
  console.log(obj.last?.toUpperCase());
}
```

## Tipos de União

O sistema de tipos do TypeScript permite que você construa novos tipos a partir de tipos existentes usando uma grande variedade de operadores.
Agora que sabemos como escrever alguns tipos, é hora de começar a _combiná-los_ de maneiras interessantes.

### Definindo um Tipo de União

A primeira forma de combinar tipos que você pode ver é um tipo de _união_ (union).
Um tipo de união é um tipo formado a partir de dois ou mais outros tipos, representando valores que podem ser _qualquer um_ desses tipos.
Nos referimos a cada um desses tipos como os _membros_ da união.

Vamos escrever uma função que pode operar sobre strings ou números:

```ts twoslash
// @errors: 2345
function printId(id: number | string) {
  console.log("Your ID is: " + id);
}
// OK
printId(101);
// OK
printId("202");
// Erro
printId({ myID: 22342 });
```

> O separador dos membros da união é permitido antes do primeiro elemento, então você também poderia escrever isto:
> ```ts twoslash
> function printTextOrNumberOrBool(
>   textOrNumberOrBool:
>     | string
>     | number
>     | boolean
> ) {
>   console.log(textOrNumberOrBool);
> }
> ```

### Trabalhando com Tipos de União

É fácil _fornecer_ um valor que corresponda a um tipo de união — basta fornecer um valor que corresponda a qualquer um dos membros da união.
Se você _tem_ um valor de um tipo de união, como trabalhar com ele?

O TypeScript só vai permitir uma operação se ela for válida para _todos_ os membros da união.
Por exemplo, se você tem a união `string | number`, não pode usar métodos que estão disponíveis apenas em `string`:

```ts twoslash
// @errors: 2339
function printId(id: number | string) {
  console.log(id.toUpperCase());
}
```

A solução é _estreitar_ (narrow) a união com código, da mesma forma que você faria em JavaScript sem anotações de tipo.
O _estreitamento_ (narrowing) ocorre quando o TypeScript consegue deduzir um tipo mais específico para um valor com base na estrutura do código.

Por exemplo, o TypeScript sabe que apenas um valor `string` terá um valor `typeof` igual a `"string"`:

```ts twoslash
function printId(id: number | string) {
  if (typeof id === "string") {
    // Neste ramo, id é do tipo 'string'
    console.log(id.toUpperCase());
  } else {
    // Aqui, id é do tipo 'number'
    console.log(id);
  }
}
```

Outro exemplo é usar uma função como `Array.isArray`:

```ts twoslash
function welcomePeople(x: string[] | string) {
  if (Array.isArray(x)) {
    // Aqui: 'x' é 'string[]'
    console.log("Hello, " + x.join(" and "));
  } else {
    // Aqui: 'x' é 'string'
    console.log("Welcome lone traveler " + x);
  }
}
```

Note que no ramo `else` não precisamos fazer nada de especial — se `x` não era um `string[]`, então só pode ter sido uma `string`.

Às vezes você terá uma união em que todos os membros têm algo em comum.
Por exemplo, tanto arrays quanto strings têm um método `slice`.
Se todo membro de uma união tem uma propriedade em comum, você pode usar essa propriedade sem estreitamento:

```ts twoslash
// O tipo de retorno é inferido como number[] | string
function getFirstThree(x: number[] | string) {
  return x.slice(0, 3);
}
```

> Pode ser confuso que uma _união_ de tipos pareça ter a _interseção_ das propriedades desses tipos.
> Isso não é por acaso — o nome _união_ vem da teoria dos tipos.
> A _união_ `number | string` é composta tomando-se a união _dos valores_ de cada tipo.
> Note que, dados dois conjuntos com fatos correspondentes sobre cada conjunto, apenas a _interseção_ desses fatos se aplica à _união_ dos próprios conjuntos.
> Por exemplo, se tivéssemos uma sala de pessoas altas usando chapéus, e outra sala de pessoas que falam espanhol usando chapéus, depois de combinar essas salas, a única coisa que sabemos sobre _toda_ pessoa é que ela deve estar usando um chapéu.

## Aliases de Tipo

Estivemos usando tipos de objeto e tipos de união escrevendo-os diretamente em anotações de tipo.
Isso é conveniente, mas é comum querer usar o mesmo tipo mais de uma vez e se referir a ele por um único nome.

Um _alias de tipo_ é exatamente isso — um _nome_ para qualquer _tipo_.
A sintaxe para um alias de tipo é:

```ts twoslash
type Point = {
  x: number;
  y: number;
};

// Exatamente o mesmo que o exemplo anterior
function printCoord(pt: Point) {
  console.log("The coordinate's x value is " + pt.x);
  console.log("The coordinate's y value is " + pt.y);
}

printCoord({ x: 100, y: 100 });
```

Você pode, na verdade, usar um alias de tipo para dar um nome a qualquer tipo, não apenas a um tipo de objeto.
Por exemplo, um alias de tipo pode nomear um tipo de união:

```ts twoslash
type ID = number | string;
```

Note que aliases são _apenas_ aliases — você não pode usar aliases de tipo para criar "versões" diferentes/distintas do mesmo tipo.
Quando você usa o alias, é exatamente como se tivesse escrito o tipo ao qual ele se refere.
Em outras palavras, este código pode _parecer_ inválido, mas está ok de acordo com o TypeScript porque ambos os tipos são aliases para o mesmo tipo:

```ts twoslash
declare function getInput(): string;
declare function sanitize(str: string): string;
// ---cut---
type UserInputSanitizedString = string;

function sanitizeInput(str: string): UserInputSanitizedString {
  return sanitize(str);
}

// Cria uma entrada sanitizada
let userInput = sanitizeInput(getInput());

// Ainda pode ser reatribuída com uma string, porém
userInput = "new input";
```

## Interfaces

Uma _declaração de interface_ é outra forma de nomear um tipo de objeto:

```ts twoslash
interface Point {
  x: number;
  y: number;
}

function printCoord(pt: Point) {
  console.log("The coordinate's x value is " + pt.x);
  console.log("The coordinate's y value is " + pt.y);
}

printCoord({ x: 100, y: 100 });
```

Assim como quando usamos um alias de tipo acima, o exemplo funciona exatamente como se tivéssemos usado um tipo de objeto anônimo.
O TypeScript se preocupa apenas com a _estrutura_ do valor que passamos para `printCoord` — ele só se importa que o valor tenha as propriedades esperadas.
Preocupar-se apenas com a estrutura e as capacidades dos tipos é por que chamamos o TypeScript de um sistema de tipos _estruturalmente tipado_.

### Diferenças Entre Aliases de Tipo e Interfaces

Aliases de tipo e interfaces são muito parecidos, e em muitos casos você pode escolher entre eles livremente.
Quase todos os recursos de uma `interface` estão disponíveis em `type`; a distinção principal é que um tipo não pode ser reaberto para adicionar novas propriedades, ao passo que uma interface é sempre extensível.

<div class='table-container'>
<table class='full-width-table'>
  <tbody>
    <tr>
      <th><code>Interface</code></th>
      <th><code>Type</code></th>
    </tr>
    <tr>
      <td>
        <p>Estendendo uma interface</p>
        <code><pre>
interface Animal {
  name: string;
}<br/>
interface Bear extends Animal {
  honey: boolean;
}<br/>
const bear = getBear();
bear.name;
bear.honey;
        </pre></code>
      </td>
      <td>
        <p>Estendendo um tipo via interseções</p>
        <code><pre>
type Animal = {
  name: string;
}<br/>
type Bear = Animal & { 
  honey: boolean;
}<br/>
const bear = getBear();
bear.name;
bear.honey;
        </pre></code>
      </td>
    </tr>
    <tr>
      <td>
        <p>Adicionando novos campos a uma interface existente</p>
        <code><pre>
interface Window {
  title: string;
}<br/>
interface Window {
  ts: TypeScriptAPI;
}<br/>
const src = 'const a = "Hello World"';
window.ts.transpileModule(src, {});
        </pre></code>
      </td>
      <td>
        <p>Um tipo não pode ser alterado após ser criado</p>
        <code><pre>
type Window = {
  title: string;
}<br/>
type Window = {
  ts: TypeScriptAPI;
}<br/>
<span style="color: #A31515"> // Erro: Identificador duplicado 'Window'.</span><br/>
        </pre></code>
      </td>
    </tr>
    </tbody>
</table>
</div>

Você vai aprender mais sobre esses conceitos em capítulos posteriores, então não se preocupe se não entender tudo de imediato.

- Antes da versão 4.2 do TypeScript, nomes de alias de tipo [_podiam_ aparecer em mensagens de erro](/play?#code/PTAEGEHsFsAcEsA2BTATqNrLusgzngIYDm+oA7koqIYuYQJ56gCueyoAUCKAC4AWHAHaFcoSADMaQ0PCG80EwgGNkALk6c5C1EtWgAsqOi1QAb06groEbjWg8vVHOKcAvpokshy3vEgyyMr8kEbQJogAFND2YREAlOaW1soBeJAoAHSIkMTRmbbI8e6aPMiZxJmgACqCGKhY6ABGyDnkFFQ0dIzMbBwCwqIccabcYLyQoKjIEmh8kwN8DLAc5PzwwbLMyAAeK77IACYaQSEjUWZWhfYAjABMAMwALA+gbsVjoADqgjKESytQPxCHghAByXigYgBfr8LAsYj8aQMUASbDQcRSExCeCwFiIQh+AKfAYyBiQFgOPyIaikSGLQo0Zj-aazaY+dSaXjLDgAGXgAC9CKhDqAALxJaw2Ib2RzOISuDycLw+ImBYKQflCkWRRD2LXCw6JCxS1JCdJZHJ5RAFIbFJU8ADKC3WzEcnVZaGYE1ABpFnFOmsFhsil2uoHuzwArO9SmAAEIsSFrZB-GgAjjA5gtVN8VCEc1o1C4Q4AGlR2AwO1EsBQoAAbvB-gJ4HhPgB5aDwem-Ph1TCV3AEEirTp4ELtRbTPD4vwKjOfAuioSQHuDXBcnmgACC+eCONFEs73YAPGGZVT5cRyyhiHh7AAON7lsG3vBggB8XGV3l8-nVISOgghxoLq9i7io-AHsayRWGaFrlFauq2rg9qaIGQHwCBqChtKdgRo8TxRjeyB3o+7xAA), às vezes no lugar do tipo anônimo equivalente (o que pode ou não ser desejável). Interfaces sempre serão nomeadas em mensagens de erro.
- Aliases de tipo podem não participar [da fusão de declarações, mas interfaces podem](/play?#code/PTAEEEDtQS0gXApgJwGYEMDGjSfdAIx2UQFoB7AB0UkQBMAoEUfO0Wgd1ADd0AbAK6IAzizp16ALgYM4SNFhwBZdAFtV-UAG8GoPaADmNAcMmhh8ZHAMMAvjLkoM2UCvWad+0ARL0A-GYWVpA29gyY5JAWLJAwGnxmbvGgALzauvpGkCZmAEQAjABMAMwALLkANBl6zABi6DB8okR4Jjg+iPSgABboovDk3jjo5pbW1d6+dGb5djLwAJ7UoABKiJTwjThpnpnGpqPBoTLMAJrkArj4kOTwYmycPOhW6AR8IrDQ8N04wmo4HHQCwYi2Waw2W1S6S8HX8gTGITsQA).
- Aliases de tipo podem ser usados apenas para [declarar os formatos de objetos, não para renomear primitivos](/play?#code/PTAEAkFMCdIcgM6gC4HcD2pIA8CGBbABwBtIl0AzUAKBFAFcEBLAOwHMUBPQs0XFgCahWyGBVwBjMrTDJMAshOhMARpD4tQ6FQCtIE5DWoixk9QEEWAeV37kARlABvaqDegAbrmL1IALlAEZGV2agBfampkbgtrWwMAJlAAXmdXdy8ff0Dg1jZwyLoAVWZ2Lh5QVHUJflAlSFxROsY5fFAWAmk6CnRoLGwmILzQQmV8JmQmDzI-SOiKgGV+CaYAL0gBBdyy1KCQ-Pn1AFFplgA5enw1PtSWS+vCsAAVAAtB4QQWOEMKBuYVUiVCYvYQsUTQcRSBDGMGmKSgAAa-VEgiQe2GLgKQA).
- Nomes de interface vão [_sempre_ aparecer em sua forma original](/play?#code/PTAEGEHsFsAcEsA2BTATqNrLusgzngIYDm+oA7koqIYuYQJ56gCueyoAUCKAC4AWHAHaFcoSADMaQ0PCG80EwgGNkALk6c5C1EtWgAsqOi1QAb06groEbjWg8vVHOKcAvpokshy3vEgyyMr8kEbQJogAFND2YREAlOaW1soBeJAoAHSIkMTRmbbI8e6aPMiZxJmgACqCGKhY6ABGyDnkFFQ0dIzMbBwCwqIccabcYLyQoKjIEmh8kwN8DLAc5PzwwbLMyAAeK77IACYaQSEjUWY2Q-YAjABMAMwALA+gbsVjNXW8yxySoAADaAA0CCaZbPh1XYqXgOIY0ZgmcK0AA0nyaLFhhGY8F4AHJmEJILCWsgZId4NNfIgGFdcIcUTVfgBlZTOWC8T7kAJ42G4eT+GS42QyRaYbCgXAEEguTzeXyCjDBSAAQSE8Ai0Xsl0K9kcziExDeiQs1lAqSE6SyOTy0AKQ2KHk4p1V6s1OuuoHuzwArMagA) em mensagens de erro, mas _apenas_ quando são usados pelo nome.
- Usar interfaces com `extends` [pode muitas vezes ser mais performático para o compilador](https://github.com/microsoft/TypeScript/wiki/Performance#preferring-interfaces-over-intersections) do que aliases de tipo com interseções.

Na maior parte das vezes, você pode escolher com base na preferência pessoal, e o TypeScript vai te avisar se precisar que algo seja o outro tipo de declaração. Se quiser uma regra prática, use `interface` até precisar usar recursos de `type`.

## Asserções de Tipo

Às vezes você terá informação sobre o tipo de um valor que o TypeScript não tem como saber.

Por exemplo, se você está usando `document.getElementById`, o TypeScript só sabe que isso vai retornar _algum_ tipo de `HTMLElement`, mas você talvez saiba que sua página sempre vai ter um `HTMLCanvasElement` com um dado ID.

Nessa situação, você pode usar uma _asserção de tipo_ para especificar um tipo mais específico:

```ts twoslash
const myCanvas = document.getElementById("main_canvas") as HTMLCanvasElement;
```

Assim como uma anotação de tipo, asserções de tipo são removidas pelo compilador e não vão afetar o comportamento em tempo de execução do seu código.

Você também pode usar a sintaxe de sinais de menor/maior (exceto se o código estiver em um arquivo `.tsx`), que é equivalente:

```ts twoslash
const myCanvas = <HTMLCanvasElement>document.getElementById("main_canvas");
```

> Lembrete: como asserções de tipo são removidas em tempo de compilação, não há verificação em tempo de execução associada a uma asserção de tipo.
> Não haverá uma exceção ou `null` gerado se a asserção de tipo estiver errada.

O TypeScript só permite asserções de tipo que convertem para uma versão _mais específica_ ou _menos específica_ de um tipo.
Essa regra previne coerções "impossíveis" como:

```ts twoslash
// @errors: 2352
const x = "hello" as number;
```

Às vezes essa regra pode ser conservadora demais e vai desabilitar coerções mais complexas que poderiam ser válidas.
Se isso acontecer, você pode usar duas asserções, primeiro para `any` (ou `unknown`, que vamos introduzir mais tarde), depois para o tipo desejado:

```ts twoslash
declare const expr: any;
type T = { a: 1; b: 2; c: 3 };
// ---cut---
const a = expr as any as T;
```

## Tipos Literais

Além dos tipos gerais `string` e `number`, podemos nos referir a strings e números _específicos_ em posições de tipo.

Uma forma de pensar sobre isso é considerar como o JavaScript vem com diferentes maneiras de declarar uma variável. Tanto `var` quanto `let` permitem mudar o que é guardado dentro da variável, e `const` não. Isso se reflete em como o TypeScript cria tipos para literais.

```ts twoslash
let changingString = "Hello World";
changingString = "Olá Mundo";
// Como `changingString` pode representar qualquer string possível, é
// assim que o TypeScript a descreve no sistema de tipos
changingString;
// ^?

const constantString = "Hello World";
// Como `constantString` só pode representar 1 string possível, ela
// tem uma representação de tipo literal
constantString;
// ^?
```

Por si sós, tipos literais não são muito valiosos:

```ts twoslash
// @errors: 2322
let x: "hello" = "hello";
// OK
x = "hello";
// ...
x = "howdy";
```

Não tem muita utilidade ter uma variável que só pode ter um valor!

Mas _combinando_ literais em uniões, você pode expressar um conceito muito mais útil — por exemplo, funções que só aceitam um certo conjunto de valores conhecidos:

```ts twoslash
// @errors: 2345
function printText(s: string, alignment: "left" | "right" | "center") {
  // ...
}
printText("Hello, world", "left");
printText("G'day, mate", "centre");
```

Tipos literais numéricos funcionam da mesma forma:

```ts twoslash
function compare(a: string, b: string): -1 | 0 | 1 {
  return a === b ? 0 : a > b ? 1 : -1;
}
```

Claro, você pode combinar esses com tipos não literais:

```ts twoslash
// @errors: 2345
interface Options {
  width: number;
}
function configure(x: Options | "auto") {
  // ...
}
configure({ width: 100 });
configure("auto");
configure("automatic");
```

Existe mais um tipo de tipo literal: literais booleanos.
Existem apenas dois tipos literais booleanos e, como você deve imaginar, eles são os tipos `true` e `false`.
O próprio tipo `boolean` é, na verdade, apenas um alias para a união `true | false`.

### Inferência de Literais

Quando você inicializa uma variável com um objeto, o TypeScript presume que as propriedades desse objeto podem mudar de valor mais tarde.
Por exemplo, se você escrevesse um código como este:

```ts twoslash
declare const someCondition: boolean;
// ---cut---
const obj = { counter: 0 };
if (someCondition) {
  obj.counter = 1;
}
```

O TypeScript não presume que a atribuição de `1` a um campo que antes tinha `0` seja um erro.
Outra forma de dizer isso é que `obj.counter` deve ter o tipo `number`, não `0`, porque tipos são usados para determinar o comportamento tanto de _leitura_ quanto de _escrita_.

O mesmo se aplica a strings:

```ts twoslash
// @errors: 2345
declare function handleRequest(url: string, method: "GET" | "POST"): void;

const req = { url: "https://example.com", method: "GET" };
handleRequest(req.url, req.method);
```

No exemplo acima, `req.method` é inferido como `string`, não `"GET"`. Como código pode ser avaliado entre a criação de `req` e a chamada de `handleRequest`, o que poderia atribuir uma nova string como `"GUESS"` a `req.method`, o TypeScript considera que esse código tem um erro.

Existem duas formas de contornar isso.

1. Você pode mudar a inferência adicionando uma asserção de tipo em qualquer um dos locais:

   ```ts twoslash
   declare function handleRequest(url: string, method: "GET" | "POST"): void;
   // ---cut---
   // Mudança 1:
   const req = { url: "https://example.com", method: "GET" as "GET" };
   // Mudança 2
   handleRequest(req.url, req.method as "GET");
   ```

   A Mudança 1 significa "pretendo que `req.method` sempre tenha o _tipo literal_ `"GET"`", prevenindo a possível atribuição de `"GUESS"` àquele campo depois.
   A Mudança 2 significa "sei por outros motivos que `req.method` tem o valor `"GET"`".

2. Você pode usar `as const` para converter o objeto inteiro para que seja de tipos literais:

   ```ts twoslash
   declare function handleRequest(url: string, method: "GET" | "POST"): void;
   // ---cut---
   const req = { url: "https://example.com", method: "GET" } as const;
   handleRequest(req.url, req.method);
   ```

O sufixo `as const` age como `const`, mas para o sistema de tipos, garantindo que todas as propriedades recebam o tipo literal em vez de uma versão mais geral como `string` ou `number`.

## `null` e `undefined`

O JavaScript tem dois valores primitivos usados para sinalizar valor ausente ou não inicializado: `null` e `undefined`.

O TypeScript tem dois _tipos_ correspondentes com os mesmos nomes. Como esses tipos se comportam depende de você ter ou não a opção [`strictNullChecks`](/tsconfig#strictNullChecks) ligada.

### `strictNullChecks` desligado

Com [`strictNullChecks`](/tsconfig#strictNullChecks) _desligado_, valores que podem ser `null` ou `undefined` ainda podem ser acessados normalmente, e os valores `null` e `undefined` podem ser atribuídos a uma propriedade de qualquer tipo.
Isso é parecido com o comportamento de linguagens sem verificação de null (por exemplo, C#, Java).
A falta de verificação desses valores tende a ser uma grande fonte de bugs; sempre recomendamos que as pessoas liguem o [`strictNullChecks`](/tsconfig#strictNullChecks) se for prático fazer isso na sua base de código.

### `strictNullChecks` ligado

Com [`strictNullChecks`](/tsconfig#strictNullChecks) _ligado_, quando um valor é `null` ou `undefined`, você vai precisar testar esses valores antes de usar métodos ou propriedades nesse valor.
Assim como verificar se é `undefined` antes de usar uma propriedade opcional, podemos usar _estreitamento_ (narrowing) para verificar valores que podem ser `null`:

```ts twoslash
function doSomething(x: string | null) {
  if (x === null) {
    // não faz nada
  } else {
    console.log("Hello, " + x.toUpperCase());
  }
}
```

### Operador de Asserção Não-Nulo (`!` Pós-fixado)

O TypeScript também tem uma sintaxe especial para remover `null` e `undefined` de um tipo sem fazer nenhuma verificação explícita.
Escrever `!` após qualquer expressão é efetivamente uma asserção de tipo de que o valor não é `null` ou `undefined`:

```ts twoslash
function liveDangerously(x?: number | null) {
  // Nenhum erro
  console.log(x!.toFixed());
}
```

Assim como outras asserções de tipo, isso não muda o comportamento em tempo de execução do seu código, então é importante usar `!` apenas quando você sabe que o valor _não pode_ ser `null` ou `undefined`.

## Enums

Enums são um recurso adicionado ao JavaScript pelo TypeScript que permite descrever um valor que poderia ser uma de um conjunto de possíveis constantes nomeadas. Diferentemente da maioria dos recursos do TypeScript, este _não_ é uma adição em nível de tipo ao JavaScript, mas algo adicionado à linguagem e ao runtime. Por causa disso, é um recurso que você deve saber que existe, mas talvez segurar o uso a menos que tenha certeza. Você pode ler mais sobre enums na [página de referência de Enums](/docs/handbook/enums.html).

## Primitivos Menos Comuns

Vale mencionar o restante dos primitivos do JavaScript que são representados no sistema de tipos.
Embora não vamos nos aprofundar aqui.

#### `bigint`

Do ES2020 em diante, há um primitivo no JavaScript usado para inteiros muito grandes, `BigInt`:

```ts twoslash
// @target: es2020

// Criando um bigint via a função BigInt
const oneHundred: bigint = BigInt(100);

// Criando um BigInt via a sintaxe literal
const anotherHundred: bigint = 100n;
```

Você pode aprender mais sobre BigInt nas [notas de lançamento do TypeScript 3.2](/docs/handbook/release-notes/typescript-3-2.html#bigint).

#### `symbol`

Há um primitivo no JavaScript usado para criar uma referência globalmente única via a função `Symbol()`:

```ts twoslash
// @errors: 2367
const firstName = Symbol("name");
const secondName = Symbol("name");

if (firstName === secondName) {
  // Não pode acontecer nunca
}
```

Você pode aprender mais sobre eles na [página de referência de Symbols](/docs/handbook/symbols.html).
