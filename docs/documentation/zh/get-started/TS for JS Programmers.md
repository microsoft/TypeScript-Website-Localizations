---
title: 为 JavaScript 程序员准备的 TypeScript
short: 为 JS 程序员准备的 TypeScript
layout: docs
permalink: /zh/docs/handbook/typescript-in-5-minutes.html
oneline: 学习 TypeScript 对 Javascript 的扩展
---

TypeScript 与 JavaScript 有着不同寻常的关系。TypeScript 提供了 JavaScript 的所有功能，并在这些功能之上添加了一层： TypeScript 的类型系统。

例如，JavaScript 提供了诸如 `string` 和 `number` 这样的原始类型，但它不检查你在赋值时与类型是否匹配。TypeScript 提供了这样的功能。

这意味着你现有的运行良好的 JavaScript 代码也是 TypeScript 代码。TypeScript 的主要好处是，它可以检查代码中的意外行为，从而降低出现错误的机会。

本教程提供 TypeScript 的简要概述，重点介绍其类型系统。

## 类型推断

TypeScript 可以识别 JavaScript 语言，在许多情况下可以推断类型。例如，在创建变量并将其赋值给特定值时， TypeScript 将使用该值作为其类型。

```ts twoslash
let helloWorld = "Hello World";
//  ^?
```

通过感知 JavaScript 的工作原理，TypeScript 可以构建一个接受 JavaScript 代码但具有类型的类型系统。这个类型系统使得我们不需要添加额外的字符来显式地指定类型。在上面的例子中，TypeScript就是这样知道 `helloWorld` 是 `string` 类型的。

你可能已经在 Visual Studio Code 中编写了 JavaScript，并已使用了编辑器的自动补全功能。Visual Studio Code 使用了 TypeScript 的引擎，以便更容易地处理 JavaScript。

## 定义类型

你可以在 JavaScript 中使用各种各样的设计模式。然而，某些设计模式使得类型难以自动推断（例如，使用动态编程的模式）。为了使类型推断涵盖这些情况， TypeScript 支持扩展 JavaScript 语言，它可以让 TypeScript 知道如何去推断类型。

例如，要创建具有推断类型的对象，该类型包括 `name: string` 和 `id: number`，你可以这么写：

```ts twoslash
const user = {
  name: "Hayes",
  id: 0,
};
```

你可以使用 `interface` 关键字声明显式地描述此对象的*内部数据的类型*（译者注：下文可能译为“结构”）：

```ts twoslash
interface User {
  name: string;
  id: number;
}
```

然后你可以声明一个符合此接口（`interface`）的 JavaScript 对象，在变量声明后使用像 `: TypeName` 这样的语法：

```ts twoslash
interface User {
  name: string;
  id: number;
}
// ---分割线---
const user: User = {
  name: "Hayes",
  id: 0,
};
```

如果提供的对象与提供的接口不匹配，TypeScript 将警告：

```ts twoslash
// @errors: 2322
interface User {
  name: string;
  id: number;
}

const user: User = {
  username: "Hayes",
  id: 0,
};
```

由于 JavaScript 支持类和面向对象编程，TypeScript 也支持。你可以将接口声明与类一起使用：

```ts twoslash
interface User {
  name: string;
  id: number;
}

class UserAccount {
  name: string;
  id: number;

  constructor(name: string, id: number) {
    this.name = name;
    this.id = id;
  }
}

const user: User = new UserAccount("Murphy", 1);
```

您可以使用接口对参数进行注释，并将值返回给函数：

```ts twoslash
// @noErrors
interface User {
  name: string;
  id: number;
}
// ---分割线---
function getAdminUser(): User {
  //...
}

function deleteUser(user: User) {
  // ...
}
```

JavaScript 中已经有一些基本类型可用：`boolean`、 `bigint`、 `null`、`number`、 `string`、 `symbol ` 和 `undefined`，它们都可以在接口中使用。TypeScript 将此列表扩展为更多的内容，例如 `any` （允许任何类型）、[`unknown`](/play#example/unknown-and-never) （确保使用此类型的人声明类型是什么）、 [`never`](/play#example/unknown-and-never) （这种类型不可能发生）和 `void` （返回 `undefined` 或没有返回值的函数）。

构建类型有两种语法： [接口和类型](/play/?e=83#example/types-vs-interfaces)。 你应该更喜欢 `interface`。当需要特定功能时使用 `type` 。

## 组合类型

使用 TypeScript，可以通过组合简单类型来创建复杂类型。有两种流行的方法可以做到这一点：联合和泛型。

### 联合

使用联合，可以声明类型可以是许多类型中的一种。例如，可以将 `boolean` 类型描述为 `true` 或 `false` ：

```ts twoslash
type MyBool = true | false;
```

_注意：_如果将鼠标悬停在上面的 `MyBool` 上，您将看到它被归类为 `boolean`。这是结构化类型系统的一个属性。下面有更加详细的信息。

联合类型的一个流行用法是描述 `string` 或者 `number` 的[字面量](/docs/handbook/2/everyday-types.html#literal-types)的合法值。

```ts twoslash
type WindowStates = "open" | "closed" | "minimized";
type LockStates = "locked" | "unlocked";
type PositiveOddNumbersUnderTen = 1 | 3 | 5 | 7 | 9;
```

联合也提供了一种处理不同类型的方法。例如，可能有一个函数处理 `array` 或者 `string`：

```ts twoslash
function getLength(obj: string | string[]) {
  return obj.length;
}
```

要了解变量的类型， 使用 `typeof`：

| 类型      | 推断语句                           |
| --------- | ---------------------------------- |
| string    | `typeof s === "string"`            |
| number    | `typeof n === "number"`            |
| boolean   | `typeof b === "boolean"`           |
| undefined | `typeof undefined === "undefined"` |
| function  | `typeof f === "function"`          |
| array     | `Array.isArray(a)`                 |

例如，你可以使函数根据传递的是字符串还是数组返回不同的值：

<!-- prettier-ignore -->
```ts twoslash
function wrapInArray(obj: string | string[]) {
  if (typeof obj === "string") {
    return [obj];
//          ^?
  }
  return obj;
}
```

### 泛型

泛型为类型提供变量。一个常见的例子是数组。没有泛型的数组可以包含任何内容。带有泛型的数组可以描述数组包含的值。

```ts
type StringArray = Array<string>;
type NumberArray = Array<number>;
type ObjectWithNameArray = Array<{ name: string }>;
```

你可以声明自己使用泛型的类型：

```ts twoslash
// @errors: 2345
interface Backpack<Type> {
  add: (obj: Type) => void;
  get: () => Type;
}

// 这一行是一个简写，可以告诉 TypeScript 有一个常量，叫做`backpack`，并且不用担心它是从哪
// 里来的。
declare const backpack: Backpack<string>;

// 对象是一个字符串，因为我们在上面声明了它作为 Backpack 的变量部分。
const object = backpack.get();

// 因为 backpack 变量是一个字符串，不能将数字传递给 add 函数。
backpack.add(23);
```

## 结构化的类型系统（structural type system）

TypeScript 的一个核心原则是类型检查基于对象的属性和行为（type checking focuses on the _shape_ that values have）。这有时被叫做“鸭子类型”或“结构类型”（structural typing）。

在结构化的类型系统当中，如果两个对象具有相同的结构，则认为它们是相同类型的。

```ts twoslash
interface Point {
  x: number;
  y: number;
}

function logPoint(p: Point) {
  console.log(`${p.x}, ${p.y}`);
}

// 打印 "12, 26"
const point = { x: 12, y: 26 };
logPoint(point);
```

 `point` 变量从未声明为 `Point` 类型。 但是，在类型检查中，TypeScript 将 `point` 的结构与 `Point`的结构进行比较。它们的结构相同，所以代码通过了。

结构匹配只需要匹配对象字段的子集。

```ts twoslash
// @errors: 2345
interface Point {
  x: number;
  y: number;
}

function logPoint(p: Point) {
  console.log(`${p.x}, ${p.y}`);
}
// ---cut---
const point3 = { x: 12, y: 26, z: 89 };
logPoint(point3); // 打印 "12, 26"

const rect = { x: 33, y: 3, width: 30, height: 80 };
logPoint(rect); // 打印 "33, 3"

const color = { hex: "#187ABF" };
logPoint(color);
```

类和对象确定结构的方式没有区别：

```ts twoslash
// @errors: 2345
interface Point {
  x: number;
  y: number;
}

function logPoint(p: Point) {
  console.log(`${p.x}, ${p.y}`);
}
// ---分割线---
class VirtualPoint {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

const newVPoint = new VirtualPoint(13, 56);
logPoint(newVPoint); // 打印 "13, 56"
```

如果对象或类具有所有必需的属性，则 TypeScript 将表示是它们匹配的，而不关注其实现细节。

## 下一步

这是对一般的 TypeScript 中使用的语法和工具的简要概述。参见：

- 阅读完整手册[由始至终](/docs/handbook/intro.html) （30 分钟）
- 探索 [Playground 上的示例](/play#show-examples)

