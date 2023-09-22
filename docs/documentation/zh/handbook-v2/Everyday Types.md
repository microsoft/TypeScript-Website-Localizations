---
title: 常见类型
layout: docs
permalink: /zh/docs/handbook/2/everyday-types.html
oneline: "The language primitives."
---

在本章中，我们将介绍一些在 JavaScript 代码中最常见的值的类型，并说明在 TypeScript 中描述这些类型相应的方法。
这不是一个详尽的列表，后续章节将描述命名和使用其他类型的更多方法。

类型还可以出现在许多 _地方_，而不仅仅是类型注释。
在我们了解类型本身的同时，我们还将了解在哪些地方可以引用这些类型来形成新的结构。

我们将首先回顾一下你在编写 JavaScript 或 TypeScript 代码时可能遇到的最基本和最常见的类型。
这些核心构建块稍后会形成更复杂的类型。

## 基本类型：`string`，`number`，和 `boolean`

JavaScript 有三种非常常用的 [基本类型](https://developer.mozilla.org/en-US/docs/Glossary/Primitive): `string`、`number` 和 `boolean`。
每个在 TypeScript 中都有对应的类型。
正如您所期望的， 如果您对这些类型的值使用 JavaScript `typeof` 运算符，您会看到这些相同的名称：

- `string` 表示字符串值，例如 `"Hello, world"`
- `number` 代表像这样的数字 `42`. JavaScript 没有专门的整数运行时值， 因此没有相当于 `int` 或 `float` 的类型，一切都是 `number`
- `boolean` 有两个值 `true` 和 `false`

> 类型名称 `String`、`Number` 和 `Boolean`（以大写字母开头）是合法的，但引用了一些很少出现在代码中的特殊内置类型。 _始终_ 使用 `string`、`number` 或 `boolean` 作为类型。

## Arrays (数组类型)

要指定像 `[1, 2, 3]` 这样的数组类型，可以使用语法 `number[]`， 此语法适用于任何类型（例如 `string[]` 是字符串数组，等等）。
您可能还会看到它写为 `Array<number>`，它们的意思是一样的。
当我们学习泛型时，我们将了解更多的关于 `T<U>` 的语法知识。

> 请注意，`[number]` 是不同的东西， 请参阅章节[元组类型](/docs/handbook/2/objects.html#tuple-types)。

## `any`

TypeScript 还有一个特殊类型 `any`，每当您不希望特定值导致类型检查错误时都可以使用它。

当值的类型为 `any` 时，您可以访问它的任何属性（将变为 `any` 类型）， 像函数一样调用它， 将其赋值给 `any` 类型的值（或者从 `any` 类型取值），或者在语法上合法的任意值:

```ts twoslash
let obj: any = { x: 0 };
// 以下代码行都不会引发编译器错误。
// 使用 `any` 会禁用所有进一步的类型检查，并且假设你比 TypeScript 更了解代码运行环境。
obj.foo();
obj();
obj.bar = 100;
obj = "hello";
const n: number = obj;
```

当您不想编写一个很长的类型只是为了让 TypeScript 相信某行特定的代码没有问题时，`any` 类型是非常有用的。

### `noImplicitAny` （不含 `any` 类型）

当您不指定类型，并且 TypeScript 无法从上下文中推断出类型时，编译器通常会默认为 `any` 类型。

不过，您通常希望避免这种情况，因为 `any` 没有经过类型检查。
使用编译器标志 [`noImplicitAny`](/tsconfig#noImplicitAny) 去标记任何隐含有 `any` 为一个错误。

## Type Annotations on Variables （变量的类型注释）

当您使用 `const`、`var` 或 `let` 声明变量时，您可以选择添加类型注释来显式指定变量的类型：

```ts twoslash
let myName: string = "Alice";
//        ^^^^^^^^ 类型注释
```

> TypeScript 不使用 `左侧类型` 样式的声明，例如 `int x = 0;`
> 类型注释始终位于正在键入的内容 _之后_。

但在大多数情况下，这是不需要的。
只要有可能，TypeScript 就会尝试自动 _推断_ 代码中的类型。
例如，变量的类型是根据其初始值设定项的类型推断的：

```ts twoslash
// 不需要类型注释 “myName”被推断为“string”类型
let myName = "Alice";
```

在大多数情况下，您不需要明确学习推理规则。
如果您刚刚开始，您应该考虑尝试更少的使用类型注释 - 您可能会感到惊讶，TypeScript 只需要很少的内容就可以完全理解正在发生的事情。

## Functions （函数）

函数是 JavaScript 中传递数据的主要方式。
TypeScript 允许您指定函数的输入和输出值的类型。

### Parameter Type Annotations （参数类型注释）

声明函数时，可以在每个参数后面添加类型注释，以声明该函数接受的参数类型。
参数类型注释位于参数名称之后：

```ts twoslash
// 参数类型注释
function greet(name: string) {
  //                 ^^^^^^^^
  console.log("Hello, " + name.toUpperCase() + "!!");
}
```

当参数具有类型注释时，将检查该函数的参数：

```ts twoslash
// @errors: 2345
declare function greet(name: string): void;
// ---cut---
// 如果执行的话会出现运行时错误！
greet(42);
```

> 即使您的参数上没有类型注释，TypeScript 仍会检查您是否传递了正确数量的参数。

### Return Type Annotations （返回类型注释）

您还可以添加返回类型注释。
返回类型注释出现在参数列表之后：

```ts twoslash
function getFavoriteNumber(): number {
  //                        ^^^^^^^^
  return 26;
}
```

与变量类型注释非常相似，您通常不需要返回类型注释，因为 TypeScript 会根据函数的 `return` 语句推断函数的返回类型。
上面示例中的类型注释不会改变任何内容。
某些代码库会出于文档目的显式指定返回类型，以防止意外更改或仅出于个人喜好。

#### Functions Which Return Promises （返回 Promise 的函数）

如果你想注释一个返回 Promise 的函数的返回类型，你应该使用 `Promise` 类型：

```ts twoslash
async function getFavoriteNumber(): Promise<number> {
  return 26;
}
```

### Anonymous Functions （匿名函数）

匿名函数与函数声明略有不同。
当函数出现在 TypeScript 可以明确如何调用它的地方时，该函数的参数将自动指定类型。

这是一个例子：

```ts twoslash
// @errors: 2551
const names = ["Alice", "Bob", "Eve"];

// 函数的上下文类型 - 推断参数具有字符串类型
names.forEach(function (s) {
  console.log(s.toUpperCase());
});

// 上下文类型也适用于箭头函数
names.forEach((s) => {
  console.log(s.toUpperCase());
});
```

即使参数 `s` 没有类型注释，TypeScript 也使用 `forEach` 函数的类型以及推断的数组类型来确定 `s` 的类型。

这个过程称为 _上下文类型_，因为函数发生的 _上下文_ 决定了它应该具有什么类型。

与推理规则类似，您不需要明确了解这是如何发生的，但了解它确实发生可以帮助您注意到何时不需要类型注释。
稍后，我们将看到更多示例，说明值出现的上下文如何影响其类型。

## Object Types （对象类型）

除了基本类型之外，您遇到的最常见的类型是 _对象类型_。
这是指几乎所有具有任何属性的 JavaScript 值！
要定义对象类型，我们只需列出其属性及其类型。

例如，这是一个采用点状对象的函数：

```ts twoslash
// 参数的类型注解是对象类型
function printCoord(pt: { x: number; y: number }) {
  //                      ^^^^^^^^^^^^^^^^^^^^^^^^
  console.log("x坐标的值为 " + pt.x);
  console.log("y坐标的值为 " + pt.y);
}
printCoord({ x: 3, y: 7 });
```

在这里，我们使用具有两个属性（ `x` 和 `y` ）的类型来注释该参数，这两个属性都是 `number` 类型。
您可以使用 `","` 或 `";"` 来分隔属性，并且最后一个分隔符是可选的。

每个属性的类型部分也是可选的。
如果您未指定类型，则将假定为 `any`。

### Optional Properties （可选属性）

对象类型还可以指定其部分或全部属性是 _可选_。
要这样做，请在属性名称后添加 `"?"`：

```ts twoslash
function printName(obj: { first: string; last?: string }) {
  // ...
}
// 两种都可以
printName({ first: "Bob" });
printName({ first: "Alice", last: "Alisson" });
```

在 JavaScript 中，如果访问不存在的属性，您将得到值是 `undefined` 而不是运行时错误。
因此，当您从可选属性读取时，您必须在使用它之前检查 `undefined`。

```ts twoslash
// @errors: 2532
function printName(obj: { first: string; last?: string }) {
  // 错误 - 如果未提供“obj.last”，可能会意外错误。
  console.log(obj.last.toUpperCase());
  if (obj.last !== undefined) {
    // 正确
    console.log(obj.last.toUpperCase());
  }

  // 使用 JavaScript 最新语法的安全替代方案：
  console.log(obj.last?.toUpperCase());
}
```

## Union Types （联合类型）

TypeScript 的类型系统允许您使用多种运算符从现有类型构建新类型。
现在我们知道如何编写一些类型，是时候开始以有趣的方式 _组合_ 它们了。

### Defining a Union Type （定义联合类型）

您可能看到的第一种组合类型的方法是 _联合_ 类型。
联合类型是由两个或多个其他类型形成的类型，表示可以是这些类型中的 _任何一种_ 类型的值。
我们将这些类型中的每一种称为联合的 _成员_。

让我们编写一个可以对字符串或数字进行操作的函数：

```ts twoslash
// @errors: 2345
function printId(id: number | string) {
  console.log("Your ID is: " + id);
}
// 正确
printId(101);
// 正确
printId("202");
// 错误
printId({ myID: 22342 });
```

### Working with Union Types （使用联合类型）

_提供_ 与联合类型匹配的值很容易 - 只需提供与任何联合成员匹配的类型即可。
如果您 _有_ 联合类型的值，您如何使用它？

TypeScript 仅允许对联合体的 _每个_ 成员都有效的操作。
例如，如果您有联合类型 `string | number`，您不能使用仅适用于 `string` 的方法：

```ts twoslash
// @errors: 2339
function printId(id: number | string) {
  console.log(id.toUpperCase());
}
```

解决方案是 _缩小_ 代码的联合范围，就像在没有类型注释的 JavaScript 中一样。
当 TypeScript 可以根据代码结构推断出更具体的值类型时，就会发生  _缩小_ 范围。

例如，TypeScript 知道只有 `string` 类型的值才会 `typeof` 值为 `"string"`：

```ts twoslash
function printId(id: number | string) {
  if (typeof id === "string") {
    // 在此分支中，id 的类型为“string”
    console.log(id.toUpperCase());
  } else {
    // 这里，id 的类型是“number”
    console.log(id);
  }
}
```

另一个例子是使用像 `Array.isArray` 这样的函数：

```ts twoslash
function welcomePeople(x: string[] | string) {
  if (Array.isArray(x)) {
    // 这里：“x”是“string[]”
    console.log("Hello, " + x.join(" and "));
  } else {
    // 这里：“x”是“string”
    console.log("Welcome lone traveler " + x);
  }
}
```

请注意，在 `else` 分支中，我们不需要做任何特殊的事情 - 如果 `x` 不是 `string[]`，那么它一定是 `string`。

有时，您会建立一个联合，其中所有成员都有一些共同点。
例如，数组和字符串都有一个 `slice` 方法。
如果联合中的每个成员都有一个共同的属性，则可以使用该属性而无需缩小范围：

```ts twoslash
// 返回类型被推断为 number[] | string
function getFirstThree(x: number[] | string) {
  return x.slice(0, 3);
}
```

> 令人困惑的是，类型的 _联合_ 似乎具有这些类型的属性的 _交集_。
> 这并非偶然——联合这个名字来自于类型理论。
> 联合类型 `number | string` 由每种类型的 _取值_ 的并集组成。
> 请注意，给定两个集合以及每个集合的事实相符，只有这些事实的 _交集_ 适用于集合本身的 _并集_。
> 例如，如果我们有一个房间，里面都是戴着帽子的高个子，另一个房间里讲西班牙语的人都戴着帽子，那么将这些房间组合起来后，我们对 _每个_ 人唯一了解的就是他们一定戴着帽子。

## Type Aliases （类型别名）

我们一直通过直接在类型注释中编写对象类型和联合类型来使用它们。
但是常常就想要很方便的多次使用同一个类型，并且通过一个名称去引用它。

_类型别名_ 正是这样 - 任意 _类型_ 的 _名称_ 。
类型别名的语法是：

```ts twoslash
type Point = {
  x: number;
  y: number;
};

// 与前面的示例完全相同
function printCoord(pt: Point) {
  console.log("The coordinate's x value is " + pt.x);
  console.log("The coordinate's y value is " + pt.y);
}

printCoord({ x: 100, y: 100 });
```

实际上，您可以使用类型别名为任何类型命名，而不仅仅是对象类型。
例如，类型别名可以命名联合类型：

```ts twoslash
type ID = number | string;
```

请注意，别名只是别名 - 您不能使用类型别名来创建同一类型的不同/确定无疑的 `版本`。
当您使用别名时，就像您编写了别名类型一样。
换句话说，这段代码可能 _看起来_ 非法，但根据 TypeScript 是可以的，因为两种类型都是同一类型的别名：

```ts twoslash
declare function getInput(): string;
declare function sanitize(str: string): string;
// ---分割---
type UserInputSanitizedString = string;

function sanitizeInput(str: string): UserInputSanitizedString {
  return sanitize(str);
}

// 创建经过美化的输入
let userInput = sanitizeInput(getInput());

// 但仍然可以用字符串重新分配
userInput = "new input";
```

## Interfaces （接口）

_接口声明_ 是命名对象类型的另一种方式：

```ts twoslash
interface Point {
  x: number;
  y: number;
}

function printCoord(pt: Point) {
  console.log("x坐标的值为 " + pt.x);
  console.log("y坐标的值为 " + pt.y);
}

printCoord({ x: 100, y: 100 });
```

Just like when we used a type alias above, the example works just as if we had used an anonymous object type.
TypeScript is only concerned with the _structure_ of the value we passed to `printCoord` - it only cares that it has the expected properties.
Being concerned only with the structure and capabilities of types is why we call TypeScript a _structurally typed_ type system.

### 类型别名和接口之间的区别

类型别名和接口非常相似，在大多数情况下你可以在它们之间自由选择。
几乎所有的 `interface` 功能都可以在 `type` 中使用，关键区别在于不能重新开放类型以添加新的属性，而接口始终是可扩展的。

<table class='full-width-table'>
  <tbody>
    <tr>
      <th><code>Interface</code></th>
      <th><code>Type</code></th>
    </tr>
    <tr>
      <td>
        <p>扩展接口</p>
        <code><pre>
interface Animal {
  name: string
}<br/>
interface Bear extends Animal {
  honey: boolean
}<br/>
const bear = getBear() 
bear.name
bear.honey
        </pre></code>
      </td>
      <td>
        <p>通过 "&" 扩展类型</p>
        <code><pre>
type Animal = {
  name: string
}<br/>
type Bear = Animal & { 
  honey: Boolean 
}<br/>
const bear = getBear();
bear.name;
bear.honey;
        </pre></code>
      </td>
    </tr>
    <tr>
      <td>
        <p>向现有接口添加新字段</p>
        <code><pre>
interface Window {
  title: string
}<br/>
interface Window {
  ts: TypeScriptAPI
}<br/>
const src = 'const a = "Hello World"';
window.ts.transpileModule(src, {});
        </pre></code>
      </td>
      <td>
        <p>类型创建后不能更改</p>
        <code><pre>
type Window = {
  title: string
}<br/>
type Window = {
  ts: TypeScriptAPI
}<br/>
<span style="color: #A31515"> // Error: Duplicate identifier 'Window'.</span><br/>
        </pre></code>
      </td>
    </tr>
    </tbody>
</table>

在后面的章节中你会学到更多关于这些概念的知识，所以如果你没有立即理解这些知识，请不要担心。

- 在 TypeScript 4.2 之前，类型别名命名 [_可能_ 会出现在错误消息中](/play?#code/PTAEGEHsFsAcEsA2BTATqNrLusgzngIYDm+oA7koqIYuYQJ56gCueyoAUCKAC4AWHAHaFcoSADMaQ0PCG80EwgGNkALk6c5C1EtWgAsqOi1QAb06groEbjWg8vVHOKcAvpokshy3vEgyyMr8kEbQJogAFND2YREAlOaW1soBeJAoAHSIkMTRmbbI8e6aPMiZxJmgACqCGKhY6ABGyDnkFFQ0dIzMbBwCwqIccabcYLyQoKjIEmh8kwN8DLAc5PzwwbLMyAAeK77IACYaQSEjUWZWhfYAjABMAMwALA+gbsVjoADqgjKESytQPxCHghAByXigYgBfr8LAsYj8aQMUASbDQcRSExCeCwFiIQh+AKfAYyBiQFgOPyIaikSGLQo0Zj-aazaY+dSaXjLDgAGXgAC9CKhDqAALxJaw2Ib2RzOISuDycLw+ImBYKQflCkWRRD2LXCw6JCxS1JCdJZHJ5RAFIbFJU8ADKC3WzEcnVZaGYE1ABpFnFOmsFhsil2uoHuzwArO9SmAAEIsSFrZB-GgAjjA5gtVN8VCEc1o1C4Q4AGlR2AwO1EsBQoAAbvB-gJ4HhPgB5aDwem-Ph1TCV3AEEirTp4ELtRbTPD4vwKjOfAuioSQHuDXBcnmgACC+eCONFEs73YAPGGZVT5cRyyhiHh7AAON7lsG3vBggB8XGV3l8-nVISOgghxoLq9i7io-AHsayRWGaFrlFauq2rg9qaIGQHwCBqChtKdgRo8TxRjeyB3o+7xAA)，有时代替等效的匿名类型（可能需要也可能不需要）。接口在错误消息中将始终被命名。
- 类型别名不能参与 [声明合并，但接口可以](/play?#code/PTAEEEDtQS0gXApgJwGYEMDGjSfdAIx2UQFoB7AB0UkQBMAoEUfO0Wgd1ADd0AbAK6IAzizp16ALgYM4SNFhwBZdAFtV-UAG8GoPaADmNAcMmhh8ZHAMMAvjLkoM2UCvWad+0ARL0A-GYWVpA29gyY5JAWLJAwGnxmbvGgALzauvpGkCZmAEQAjABMAMwALLkANBl6zABi6DB8okR4Jjg+iPSgABboovDk3jjo5pbW1d6+dGb5djLwAJ7UoABKiJTwjThpnpnGpqPBoTLMAJrkArj4kOTwYmycPOhW6AR8IrDQ8N04wmo4HHQCwYi2Waw2W1S6S8HX8gTGITsQA)。
- 接口只能用于 [声明对象的形状，不能重命名基本类型](/play?#code/PTAEAkFMCdIcgM6gC4HcD2pIA8CGBbABwBtIl0AzUAKBFAFcEBLAOwHMUBPQs0XFgCahWyGBVwBjMrTDJMAshOhMARpD4tQ6FQCtIE5DWoixk9QEEWAeV37kARlABvaqDegAbrmL1IALlAEZGV2agBfampkbgtrWwMAJlAAXmdXdy8ff0Dg1jZwyLoAVWZ2Lh5QVHUJflAlSFxROsY5fFAWAmk6CnRoLGwmILzQQmV8JmQmDzI-SOiKgGV+CaYAL0gBBdyy1KCQ-Pn1AFFplgA5enw1PtSWS+vCsAAVAAtB4QQWOEMKBuYVUiVCYvYQsUTQcRSBDGMGmKSgAAa-VEgiQe2GLgKQA).
- 接口名称将 [_始终_ 以其原始形式出现](/play?#code/PTAEGEHsFsAcEsA2BTATqNrLusgzngIYDm+oA7koqIYuYQJ56gCueyoAUCKAC4AWHAHaFcoSADMaQ0PCG80EwgGNkALk6c5C1EtWgAsqOi1QAb06groEbjWg8vVHOKcAvpokshy3vEgyyMr8kEbQJogAFND2YREAlOaW1soBeJAoAHSIkMTRmbbI8e6aPMiZxJmgACqCGKhY6ABGyDnkFFQ0dIzMbBwCwqIccabcYLyQoKjIEmh8kwN8DLAc5PzwwbLMyAAeK77IACYaQSEjUWY2Q-YAjABMAMwALA+gbsVjNXW8yxySoAADaAA0CCaZbPh1XYqXgOIY0ZgmcK0AA0nyaLFhhGY8F4AHJmEJILCWsgZId4NNfIgGFdcIcUTVfgBlZTOWC8T7kAJ42G4eT+GS42QyRaYbCgXAEEguTzeXyCjDBSAAQSE8Ai0Xsl0K9kcziExDeiQs1lAqSE6SyOTy0AKQ2KHk4p1V6s1OuuoHuzwArMagA) 在错误消息中，但 _只有_ 在按名称使用时才会出现。

在大多数情况下，你可以根据个人喜好进行选择，TypeScript 会告诉你它是否需要其他类型的声明。如果您想要启发式方法，可以使用 `interface` 直到你需要使用 `type` 中的功能。

## Type Assertions

Sometimes you will have information about the type of a value that TypeScript can't know about.

For example, if you're using `document.getElementById`, TypeScript only knows that this will return _some_ kind of `HTMLElement`, but you might know that your page will always have an `HTMLCanvasElement` with a given ID.

In this situation, you can use a _type assertion_ to specify a more specific type:

```ts twoslash
const myCanvas = document.getElementById("main_canvas") as HTMLCanvasElement;
```

Like a type annotation, type assertions are removed by the compiler and won't affect the runtime behavior of your code.

You can also use the angle-bracket syntax (except if the code is in a `.tsx` file), which is equivalent:

```ts twoslash
const myCanvas = <HTMLCanvasElement>document.getElementById("main_canvas");
```

> Reminder: Because type assertions are removed at compile-time, there is no runtime checking associated with a type assertion.
> There won't be an exception or `null` generated if the type assertion is wrong.

TypeScript only allows type assertions which convert to a _more specific_ or _less specific_ version of a type.
This rule prevents "impossible" coercions like:

```ts twoslash
// @errors: 2352
const x = "hello" as number;
```

Sometimes this rule can be too conservative and will disallow more complex coercions that might be valid.
If this happens, you can use two assertions, first to `any` (or `unknown`, which we'll introduce later), then to the desired type:

```ts twoslash
declare const expr: any;
type T = { a: 1; b: 2; c: 3 };
// ---cut---
const a = expr as any as T;
```

## Literal Types

In addition to the general types `string` and `number`, we can refer to _specific_ strings and numbers in type positions.

One way to think about this is to consider how JavaScript comes with different ways to declare a variable. Both `var` and `let` allow for changing what is held inside the variable, and `const` does not. This is reflected in how TypeScript creates types for literals.

```ts twoslash
let changingString = "Hello World";
changingString = "Olá Mundo";
// Because `changingString` can represent any possible string, that
// is how TypeScript describes it in the type system
changingString;
// ^?

const constantString = "Hello World";
// Because `constantString` can only represent 1 possible string, it
// has a literal type representation
constantString;
// ^?
```

By themselves, literal types aren't very valuable:

```ts twoslash
// @errors: 2322
let x: "hello" = "hello";
// OK
x = "hello";
// ...
x = "howdy";
```

It's not much use to have a variable that can only have one value!

But by _combining_ literals into unions, you can express a much more useful concept - for example, functions that only accept a certain set of known values:

```ts twoslash
// @errors: 2345
function printText(s: string, alignment: "left" | "right" | "center") {
  // ...
}
printText("Hello, world", "left");
printText("G'day, mate", "centre");
```

Numeric literal types work the same way:

```ts twoslash
function compare(a: string, b: string): -1 | 0 | 1 {
  return a === b ? 0 : a > b ? 1 : -1;
}
```

Of course, you can combine these with non-literal types:

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

There's one more kind of literal type: boolean literals.
There are only two boolean literal types, and as you might guess, they are the types `true` and `false`.
The type `boolean` itself is actually just an alias for the union `true | false`.

### Literal Inference

When you initialize a variable with an object, TypeScript assumes that the properties of that object might change values later.
For example, if you wrote code like this:

```ts twoslash
declare const someCondition: boolean;
// ---cut---
const obj = { counter: 0 };
if (someCondition) {
  obj.counter = 1;
}
```

TypeScript doesn't assume the assignment of `1` to a field which previously had `0` is an error.
Another way of saying this is that `obj.counter` must have the type `number`, not `0`, because types are used to determine both _reading_ and _writing_ behavior.

The same applies to strings:

```ts twoslash
// @errors: 2345
declare function handleRequest(url: string, method: "GET" | "POST"): void;
// ---cut---
const req = { url: "https://example.com", method: "GET" };
handleRequest(req.url, req.method);
```

In the above example `req.method` is inferred to be `string`, not `"GET"`. Because code can be evaluated between the creation of `req` and the call of `handleRequest` which could assign a new string like `"GUESS"` to `req.method`, TypeScript considers this code to have an error.

There are two ways to work around this.

1. You can change the inference by adding a type assertion in either location:

   ```ts twoslash
   declare function handleRequest(url: string, method: "GET" | "POST"): void;
   // ---cut---
   // Change 1:
   const req = { url: "https://example.com", method: "GET" as "GET" };
   // Change 2
   handleRequest(req.url, req.method as "GET");
   ```

   Change 1 means "I intend for `req.method` to always have the _literal type_ `"GET"`", preventing the possible assignment of `"GUESS"` to that field after.
   Change 2 means "I know for other reasons that `req.method` has the value `"GET"`".

2. You can use `as const` to convert the entire object to be type literals:

   ```ts twoslash
   declare function handleRequest(url: string, method: "GET" | "POST"): void;
   // ---cut---
   const req = { url: "https://example.com", method: "GET" } as const;
   handleRequest(req.url, req.method);
   ```

The `as const` suffix acts like `const` but for the type system, ensuring that all properties are assigned the literal type instead of a more general version like `string` or `number`.

## `null` and `undefined`

JavaScript has two primitive values used to signal absent or uninitialized value: `null` and `undefined`.

TypeScript has two corresponding _types_ by the same names. How these types behave depends on whether you have the `strictNullChecks` option on.

### `strictNullChecks` off

With `strictNullChecks` _off_, values that might be `null` or `undefined` can still be accessed normally, and the values `null` and `undefined` can be assigned to a property of any type.
This is similar to how languages without null checks (e.g. C#, Java) behave.
The lack of checking for these values tends to be a major source of bugs; we always recommend people turn `strictNullChecks` on if it's practical to do so in their codebase.

### `strictNullChecks` on

With `strictNullChecks` _on_, when a value is `null` or `undefined`, you will need to test for those values before using methods or properties on that value.
Just like checking for `undefined` before using an optional property, we can use _narrowing_ to check for values that might be `null`:

```ts twoslash
function doSomething(x: string | null) {
  if (x === null) {
    // do nothing
  } else {
    console.log("Hello, " + x.toUpperCase());
  }
}
```

### Non-null Assertion Operator (Postfix `!`)

TypeScript also has a special syntax for removing `null` and `undefined` from a type without doing any explicit checking.
Writing `!` after any expression is effectively a type assertion that the value isn't `null` or `undefined`:

```ts twoslash
function liveDangerously(x?: number | null) {
  // No error
  console.log(x!.toFixed());
}
```

Just like other type assertions, this doesn't change the runtime behavior of your code, so it's important to only use `!` when you know that the value _can't_ be `null` or `undefined`.

## Enums

Enums are a feature added to JavaScript by TypeScript which allows for describing a value which could be one of a set of possible named constants. Unlike most TypeScript features, this is _not_ a type-level addition to JavaScript but something added to the language and runtime. Because of this, it's a feature which you should know exists, but maybe hold off on using unless you are sure. You can read more about enums in the [Enum reference page](/docs/handbook/enums.html).

## Less Common Primitives

It's worth mentioning the rest of the primitives in JavaScript which are represented in the type system.
Though we will not go into depth here.

##### `bigint`

From ES2020 onwards, there is a primitive in JavaScript used for very large integers, `BigInt`:

```ts twoslash
// @target: es2020

// Creating a bigint via the BigInt function
const oneHundred: bigint = BigInt(100);

// Creating a BigInt via the literal syntax
const anotherHundred: bigint = 100n;
```

You can learn more about BigInt in [the TypeScript 3.2 release notes](/docs/handbook/release-notes/typescript-3-2.html#bigint).

##### `symbol`

There is a primitive in JavaScript used to create a globally unique reference via the function `Symbol()`:

```ts twoslash
// @errors: 2367
const firstName = Symbol("name");
const secondName = Symbol("name");

if (firstName === secondName) {
  // Can't ever happen
}
```

You can learn more about them in [Symbols reference page](/docs/handbook/symbols.html).
