---
title: 常见类型
layout: docs
permalink: /zh/docs/handbook/2/everyday-types.html
oneline: "The language primitives."
---
在本章中，我们将介绍一些在 JavaScript 代码中最常见的值的类型，并说明在 TypeScript 中描述这些类型相应的方法。
这不是一个详尽的列表，后续章节将描述命名和使用其他类型的更多方法。

类型还可以出现在许多 _地方_ ，而不仅仅是类型注释。
在我们了解类型本身的同时，我们还将了解在哪些地方可以引用这些类型来形成新的结构。

我们将首先回顾一下你在编写 JavaScript 或 TypeScript 代码时可能遇到的最基本和最常见的类型。
这些将在稍后形成更复杂类型的核心构建块。

## 基本类型：`string`，`number`，和 `boolean`

JavaScript有三种常用的 [原始类型](https://developer.mozilla.org/en-US/docs/Glossary/Primitive): `string`，`number`，和 `boolean`。
每种原始类型在TypeScript中都有相对应的类型。
正如你所期望的，如果你在这些类型的值上使用JavaScript的“typeof”操作符，你会看到相同的名称:

- `string` 表示字符串值，如 `"Hello, world"`
- `number`  表示数字，如 `42`。JavaScript对数字没有特殊的运行时值，所以没有 `int`或 `float`类型——一切都是 `number`
- `boolean` 表示布尔值，如 `true` 和 `false`

> 类型名称 `String`， `Number`和 `Boolean`（以大写字母开头）是合法的，但涉及一些特殊的内置类型，这些类型在代码中很少出现。最佳实践是只使用 `string`， `number`或 `boolean`作为类型。

## 数组：Arrays

要指定数组的类型，如 `[1, 2, 3]`，你可以使用 `number[]`；这种语法适用于任何类型 （比如 `string[]` 表示字符串数组，以此类推）。
你也可能看到另外一种含义相同的写法 `Array<number>`。
在学习“泛型”时，我们将更深入地了解 `T<U>` 这种语法。

> 注意 `[number]` 是不同的概念；请参考关于“元组类型（tuple）”的相关内容。

## `any`

在你不想让某个特定值引发类型检查错误的情况下，TypeScript 还有一种特殊的类型 `any` 可以使用。

当一个值的类型为 `any` 时, 你可以访问其任何属性（这些属性的类型也是 `any` ），`any` 类型的值可以当作函数来调用，能赋值给任何类型的值，任何类型的值也能赋值给 `any` 类型，`any` 类型可以进行几乎任何在语法上合法的操作：

```ts
let obj: any = { x: 0 };
// 以下这些代码行都不会引发编译错误。
// 使用“any”会禁用所有后续的类型检查，并且假定你比 TypeScript 更了解该环境。
obj.foo();
obj();
obj.bar = 100;
obj = "hello";
const n: number = obj;
```

当你不想为了向 TypeScript 证明某一行代码是正确的而繁琐地写出一个很长的类型时，使用 `any` 类型非常有用。

### `noImplicitAny`

当你未指定类型，而 TypeScript 也无法从上下文推断出类型时，编译器通常会默认使用 `any` 类型。

不过，通常还是要避免这种情况，因为 `any` 类型检查是不严格的。
可以使用编译器标志 [`noImplicitAny`](/tsconfig#noImplicitAny) 将任何隐式的 `any` 类型标记为错误。

## 变量的类型注解

当你使用 `const`，`var` 或 `let` 关键字声明变量时，可以选择添加类型注解来明确指变量的类型：

```ts
let myName: string = "Alice";
//        ^^^^^^^^ 类型注解
```

> TypeScript 不采用“左侧定义类型”的方式，例如 `int x = 0;`
> 类型注解总是要放在被注解的变量之后。

不过，在大多数情况下，这不是必须的。
TypeScript 会尽可能的自动推断你代码中的类型。
例如，变量的类型会根据其初始化值的类型来推断出来：

```ts
// 无需进行类型标注——“myName”被自动推断为类型“string”
let myName = "Alice";
```

在大多数情况下，你无需特意去学习推断规则。
如果你是初学者，那么在编写代码时可以尝试少使用类型注解——你可能会惊讶地发现，对于 TypeScript 来说，只需要很少的注解就能完全理解代码的含义。

## 函数

函数是 JavaScript 中传递数据的主要方式。
TypeScript 允许你指定函数的输入值和输出值的类型。

### 参数类型注解

在声明函数时，你可以在每个参数之后添加类型注解，以表明该函数所接受的参数类型。
参数类型注解位于参数名称之后：

```ts
// 参数类型注解
function greet(name: string) {
  //                 ^^^^^^^^
  console.log("Hello, " + name.toUpperCase() + "!!");
}
```

当一个参数添加类型注解后，函数调用时会检查参数类型：

```ts
// @errors: 2345
declare function greet(name: string): void;
// ---分割线---
// 如果执行的话将会出现运行时错误！
greet(42);
```

> 即使你没有为参数添加类型注解，TypeScript 仍会检查你传递的参数数量是否正确。

### 函数返回值类型注解

你还可以添加函数返回值类型注解。
返回类型注解位于参数列表之后：

```ts
function getFavoriteNumber(): number {
  //                        ^^^^^^^^
  return 26;
}
```

与变量类型注解类似，通常你无需添加函数返回值类型注解，因为 TypeScript 会根据函数的 `return` 语句自动推断出其返回类型。
上述示例中的类型注解并没有产生任何变化。
有些代码库会明确指定返回类型，其目的包括便于文档说明、防止意外更改，或者纯粹出于个人偏好。

### 匿名函数

匿名函数与函数声明有所不同。
当 TypeScript 能够确定一个函数的调用方式时，该函数的参数会自动标注类型。

例子：

```ts
// @errors: 2551
// 这里没有类型注解，但 TypeScript 能够发现这个错误。
// 是 toUpperCase 而不是 toUppercase
const names = ["Alice", "Bob", "Eve"];

// 函数的上下文类型标注
names.forEach(function (s) {
  console.log(s.toUppercase());
});

// 上下文类型定义同样适用于箭头函数。
names.forEach((s) => {
  console.log(s.toUppercase());
});
```

尽管参数 `s` 没有进行类型标注，但 TypeScript 仍依据 `forEach` 函数的类型以及数组的推断类型来确定参数 `s` 所应具有的类型。

这个过程被称为“上下文类型推断”，因为函数出现的“环境”告知了它应该具有何种类型。
与推断规则类似，你无需明确了解这种过程是如何发生的，但明白它确实会发生这一点有助于你察觉到何时无需进行类型注释。
稍后，我们将看到更多关于变量值所处的上下文环境会如何影响其类型的示例。

## 对象类型

除了基本类型之外，你会遇到的最常见的类型就是“对象类型”。
这指的是具有属性的任何 JavaScript 值，几乎所有的值都是这样的！
要定义一个对象类型，我们只需列出其属性及其类型即可。

例如，这里有一个函数，它接收一个pt对象：

```ts
// 该参数的类型注解是一个对象类型。
function printCoord(pt: { x: number; y: number }) {
  //                      ^^^^^^^^^^^^^^^^^^^^^^^^
  console.log("The coordinate's x value is " + pt.x);
  console.log("The coordinate's y value is " + pt.y);
}
printCoord({ x: 3, y: 7 });
```

在这里，我们为该参数标注了一个具有两个属性的类型 `x` 和 `y`，这两个属性的类型均为`number`。
你可以使用 `,` 或 `;` 来分隔这些属性，而无论哪种方式，最后一个分隔符都是可选的。

每个属性的类型部分也是可选的。
如果你未指定类型，将默认视为`any`。

### 可选属性

对象类型还可以指定其部分或全部属性为“可选”的。
在属性名称后添加一个 `?` 符号来表示该属性是可选的：

```ts
function printName(obj: { first: string; last?: string }) {
  // ...
}
// 都是可以的
printName({ first: "Bob" });
printName({ first: "Alice", last: "Alisson" });
```

在 JavaScript 中，如果访问一个不存在的属性，你将会得到值 `undefined` 而不是运行时错误。
正因为如此，当你从一个可选属性中读取数据时，必须在使用该属性之前先检查其是否为 `undefined` 。

```ts
// @errors: 2532
function printName(obj: { first: string; last?: string }) {
  // 错误 - 若未提供“obj.last”参数，则可能会导致程序崩溃！
  console.log(obj.last.toUpperCase());
  if (obj.last !== undefined) {
    // OK
    console.log(obj.last.toUpperCase());
  }

  // 一种使用现代 JavaScript 语法的安全替代方案：
  console.log(obj.last?.toUpperCase());
}
```

## 联合类型

TypeScript 的类型系统允许你利用多种运算符从现有类型中构建新的类型。
既然我们已经掌握了如何编写一些类型，现在尝试将它们组合起来。

### 定义一个联合类型

常见的类型组合方式之一是“联合”类型。
联合类型是由两个或多个其他类型组合而成的类型，它表示这些类型中任意一种的值。
我们将这些类型分别称为联合类型的“成员”。

让我们编写一个能够对字符串或数字进行操作的函数：

```ts
// @errors: 2345
function printId(id: number | string) {
  console.log("Your ID is: " + id);
}
// OK
printId(101);
// OK
printId("202");
// Error
printId({ myID: 22342 });
```

### 使用联合类型

为符合联合类型的数据提供一个值其实很简单——只需提供一个与联合类型任何成员相匹配的类型即可。
如果你有一个联合类型的值，该如何处理它呢？

TypeScript 只会在对联合体中的每一个成员都有效的操作才被允许。
例如，如果你有联合体 `string | number`，则不能使用仅适用于 `string` 类型的方法：

```ts
// @errors: 2339
function printId(id: number | string) {
  console.log(id.toUpperCase());
}
```

解决方案是通过代码实现“类型收窄”，这与在没有类型注解的情况下在 JavaScript 中的做法相同。
“类型收窄”是指 TypeScript 能够根据代码的结构推断出某个值的更具体类型。

例如，TypeScript 知道只有 `string` 类型的值才会具有 `typeof` 值 `"string"` ：

```ts
function printId(id: number | string) {
  if (typeof id === "string") {
    // 在这个分支中，变量 id 的类型为'string'
    console.log(id.toUpperCase());
  } else {
    // 在这，变量 id 的类型为'number'
    console.log(id);
  }
}
```

另一个例子是使用像 `Array.isArray` 这样的函数：

```ts
function welcomePeople(x: string[] | string) {
  if (Array.isArray(x)) {
    // Here: 'x' is 'string[]'
    console.log("Hello, " + x.join(" and "));
  } else {
    // Here: 'x' is 'string'
    console.log("Welcome lone traveler " + x);
  }
}
```

请注意，在“else”分支中，我们无需进行任何特殊操作——如果“x”不是“string[]”类型，那么它必定就是“string”类型。

有时你会遇到一种联合类型，其中所有成员都具有某些共同的特性。
例如，数组和字符串都具有 `slice` 方法。
如果联合类型中的每个成员都具有一个共同的属性，那么就可以直接使用该属性而无需进行类型限制：

```ts
// 返回值推断为 number[] | string
function getFirstThree(x: number[] | string) {
  return x.slice(0, 3);
}
```

> 这可能会让人感到困惑，因为类型集合所具有的特性似乎与那些类型本身的特性存在交集。
> 这并非偶然——“联合”这个名称源自类型理论。
> 类型 `number | string` 的构成方式是将每个类型中的值进行“合并”。
> 请注意，若给定两个集合，且已知关于每个集合的对应事实，则只有这些事实的交集才适用于集合本身的并集。
> 例如，如果我们有一个房间里全是戴帽子的高个子人士，另一个房间里全是说西班牙语的人也戴帽子，那么在将这两个房间合并后，我们对每个人唯一能确定的就是他们肯定都戴着帽子。

## 类型别名

我们通过直接在类型注解中编写对象类型和联合类型来使用它们。
这很方便，但是常常会想要多次使用同一个类型，并且通过一个名称引用它。

_类型别名_ 正是如此 - 任意 _类型_ 的一个 _名称_ 。
类型别名的语法是：

```ts
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

实际上，不只是对象类型，你可以使用类型别名为任何类型命名。
例如，类型别名可以命名联合类型：

```ts
type ID = number | string;
```

请注意，别名 _只是_ 别名 - 你不能使用类型别名创建同一类型的不同“版本”。
当你使用别名时，它与你编写的别名类型完全一样。
换句话说，这段代码 _看起来_ 可能是非法的，但是对于 TypeScript 来说是正确的，因为这两种类型都是同一类型的别名：

```ts
declare function getInput(): string;
declare function sanitize(str: string): string;
// ---分割---
type UserInputSanitizedString = string;

function sanitizeInput(str: string): UserInputSanitizedString {
  return sanitize(str);
}

// 创建一个经过清理的输入框
let userInput = sanitizeInput(getInput());

// 仍然可以使用字符串重新赋值
userInput = "new input";
```

## 接口

_接口声明_ 是命名对象类型的另一种方式：

```ts
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

就像我们上面使用类型别名时一样，这个示例的工作方式就像我们使用了匿名对象类型一样。
TypeScript 只关心我们传递给 `printCoord` 的值的结构 - 它只关心它是否具有预期的属性。
只关心类型的结构和功能，这就是为什么我们说 TypeScript 是一个 _结构化类型_ 的类型系统。

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

在大多数情况下，你可以根据个人喜好进行选择，TypeScript 会告诉你它是否需要其他类型的声明。如果你想要启发式方法，可以使用 `interface` 直到你需要使用 `type` 中的功能。

## 类型断言

有时，你会获得有关某个变量的类型信息，但这些信息是 TypeScript 无法知晓的。

例如，如果你使用的是 `document.getElementById` 方法，TypeScript 只知道它会返回某种类型的 `HTMLElement`，但你可能知道你的页面总是会有一个具有特定 ID 的 `HTMLCanvasElement` 元素。

在这种情况下，你可以使用“类型断言”来指定更具体的类型：

```ts
const myCanvas = document.getElementById("main_canvas") as HTMLCanvasElement;
```

就像类型注解一样，类型断言会被编译器移除，不会对代码的运行时行为产生影响。

你还可以使用尖括号语法（但前提是代码并非位于 `.tsx` 文件中），其效果与之相同：

```ts
const myCanvas = <HTMLCanvasElement>document.getElementById("main_canvas");
```

> 提醒：由于类型断言在编译时就会被移除，因此与类型断言相关的没有运行时检查。
> 若类型断言错误，不会生成异常（exception）或空值（null）。

TypeScript 仅允许类型断言将类型转换为其更具体的版本或更不具体的版本。
这条规则可防止出现 “不可能的强制转换”，例如：

```ts
// @errors: 2352
const x = "hello" as number;
```

有时，这一规则可能会过于保守，从而会拒绝一些可能有效的更为复杂的转换操作。
如果出现这种情况，你可以使用两个断言，首先用于 `any` （或者 `unknown`, 稍后我们会介绍这个概念），然后用于所需的类型：

```ts
declare const expr: any;
type T = { a: 1; b: 2; c: 3 };
// ---cut---
const a = expr as any as T;
```

## 字面量类型

除了 `string` 和 `number` 这类通用类型外，我们还可以在类型位置中引用特定的字符串和数字。

JavaScript 提供了多种声明变量的方法。无论是 `var` 还是 `let` 都允许更改变量内部所存储的内容，而 `const` 则不允许。这一点在 TypeScript 为字面量创建类型时有所体现。

```ts
let changingString = "Hello World";
changingString = "Olá Mundo";
// 因为 `changingString` 可以表示任何可能的字符串，这就是 TypeScript 在类型系统中对其的描述方式。
changingString;
// ^?

const constantString = "Hello World";
// 由于 `constantString` 只能表示一种字符串，所以它具有字面量类型表示形式
constantString;
// ^?
```

就其本身而言，字面量类型并没有什么特别的价值：

```ts
// @errors: 2322
let x: "hello" = "hello";
// OK
x = "hello";
// ...
x = "howdy";
```

如果一个变量只能取一个值，那它就没什么实际用处了！

但是通过将常量组合成联合体，你可以表达出一个更具实用意义的概念——例如，只接受特定一组已知值的函数：

```ts
// @errors: 2345
function printText(s: string, alignment: "left" | "right" | "center") {
  // ...
}
printText("Hello, world", "left");
printText("G'day, mate", "centre");
```

数字字面量类型的工作方式是相同的：

```ts
function compare(a: string, b: string): -1 | 0 | 1 {
  return a === b ? 0 : a > b ? 1 : -1;
}
```

当然，你也可以将这些与非字面量类型相结合：

```ts
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

还有一种字面量类型：布尔字面量类型。
只有两种布尔型的字面量类型，正如你所料，它们分别是以下这两种类型 `true` 和 `false`。
类型 `boolean` 本身实际上只是 `true | false` 这种联合类型的一个别名。

### 字面量推断

当你使用对象来初始化一个变量时，TypeScript 会假定该对象的属性之后可能会发生变化。
例如，如果你编写了如下这样的代码：

```ts
declare const someCondition: boolean;
// ---cut---
const obj = { counter: 0 };
if (someCondition) {
  obj.counter = 1;
}
```

TypeScript 并不会将 `1` 赋值给一个原本为 `0` 的字段视为错误。
另一种表述方式是：`obj.counter` 的类型必须是 `number` ，而不是 `0` ，因为类型用于确定“读取”和“写入”的行为。

这一点同样适用于字符串：

```ts
// @errors: 2345
declare function handleRequest(url: string, method: "GET" | "POST"): void;
// ---cut---
const req = { url: "https://example.com", method: "GET" };
handleRequest(req.url, req.method);
```

在上述示例中，`req.method` 被推断为 `string` 类型，而非 `"GET"` 字符串。因为从创建 `req` 对象到调用 `handleRequest` 方法之间可能存在代码执行过程，这段代码可能会将 `req.method` 赋值为一个新的字符串，比如 `"GUESS"` ，所以 TypeScript 认为这段代码存在错误。

有两种方法可以解决这个问题。

1. 你可以通过在任意位置添加类型断言来改变这种推断结果：

   ```ts
   declare function handleRequest(url: string, method: "GET" | "POST"): void;
   // ---cut---
   // Change 1:
   const req = { url: "https://example.com", method: "GET" as "GET" };
   // Change 2
   handleRequest(req.url, req.method as "GET");
   ```

   Change 1 表示“我希望 `req.method` 总是具有 _字面量类型_ `"GET"`”，从而避免之后该字段可能被赋值为 `"GUESS"`。
   Change 2 的意思是：“我知道出于其他原因，`req.method` 的值为 `"GET"` 。”
2. 你可以使用 `as const` 将整个对象转换为字面量常量：

   ```ts
   declare function handleRequest(url: string, method: "GET" | "POST"): void;
   // ---cut---
   const req = { url: "https://example.com", method: "GET" } as const;
   handleRequest(req.url, req.method);
   ```

The `as const` suffix acts like `const` but for the type system, ensuring that all properties are assigned the literal type instead of a more general version like `string` or `number`.
 `as const` 后缀的作用类似于 `const` ，但针对类型系统而言，它确保所有属性都采用的是字面值类型，而非更通用的类型如 `string` 或 `number`。

## `null` 和 `undefined`

JavaScript 有两种原始类型用于表示不存在或未初始化的值：`null` 和 `undefined` 。

TypeScript 有两个同名的“类型”。这些类型的表现方式取决于你是否启用了 `strictNullChecks` 选项。

### `strictNullChecks` off

在 `strictNullChecks` 关闭的情况下，那些可能为 `null` 或 `undefined` 的值仍可以正常访问，并且 `null` 和 `undefined` 这两个值可以赋值给任何类型的属性。
这与那些不进行空值检查的语言（例如 C# 和 Java）的运行方式类似。
不检查这些值往往会导致大量错误；我们总是建议在条件允许的情况下开启 `strictNullChecks` 功能。

### `strictNullChecks` on

如果启用了 `strictNullChecks` ，那么当某个值为 `null` 或 `undefined`时，你就需要先对其进行检验，然后再对该值调用方法或属性。
就像在使用可选属性之前先检查其是否为 `undefined` 一样，我们也可以使用“类型收窄”来检查那些可能为 `null`的值：

```ts
function doSomething(x: string | null) {
  if (x === null) {
    // do nothing
  } else {
    console.log("Hello, " + x.toUpperCase());
  }
}
```

### 非空断言运算符 (后缀 `!`)

TypeScript 还有一种特殊的语法，能够直接从类型中移除 `null` 和 `undefined` 元素，而无需进行任何显式的检查。
在任何表达式后加上 `!` ，实际上就是一种类型断言，表明该值并非 `null` 或 `undefined`：

```ts
function liveDangerously(x?: number | null) {
  // No error
  console.log(x!.toFixed());
}
```

就像其他类型的断言一样，这种断言不会改变你代码的运行时行为，因此只有在你确定值不可能为 `null` 或 `undefined`时，才应该使用 `!` 。

## 枚举

枚举是 TypeScript 为 JavaScript 添加的一项功能，它允许描述一种可能属于一组命名常量之一的值。与大多数 TypeScript 功能不同，这并非是对 JavaScript 类型层面的补充，而是对语言和运行时的新增内容。因此，虽然你应该知道其存在，但除非你确定有必要使用，否则最好暂不使用。你可以阅读更多关于枚举的相关内容 [Enum reference page](/docs/handbook/enums.html).

## 不常用的原始类型

值得一提的是，JavaScript 中的其他基本类型在类型系统中也有相应的表示。
不过我们在此不会深入探讨。

##### `bigint`

从 ES2020 版本开始，JavaScript 中有一个用于处理超大整数的原语类型—— `BigInt`：

```ts
// @target: es2020

// 通过 BigInt 函数创建一个 bigint 类型的值
const oneHundred: bigint = BigInt(100);

// 通过字面量语法创建一个大整数
const anotherHundred: bigint = 100n;
```

你可以通过以下链接了解更多关于 BigInt 的信息： [the TypeScript 3.2 release notes](/docs/handbook/release-notes/typescript-3-2.html#bigint).

##### `symbol`

在 JavaScript 中有一个基本的特性，可通过 `Symbol()` 函数创建一个全局唯一的引用：

```ts
// @errors: 2367
const firstName = Symbol("name");
const secondName = Symbol("name");

if (firstName === secondName) {
  // Can't ever happen
}
```

你可以了解更多相关内容 [Symbols reference page](/docs/handbook/symbols.html).
