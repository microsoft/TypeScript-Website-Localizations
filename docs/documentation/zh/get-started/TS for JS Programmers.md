---
title: TypeScript 面向 JavaScript 程序员
short: TypeScript 面向 JS 程序员
layout: docs
permalink: /zh/docs/handbook/typescript-in-5-minutes.html
oneline: 学习 TypeScript 如何扩展 JavaScript
---

TypeScript 与 JavaScript 有着独特的关系。TypeScript 提供了 JavaScript 所有的特性，在其之上还多了额外的一层内容：TypeScript 的类型系统（type system）。

例如，JavaScript 提供了语言的原始类型如“字符串（string）”和“数值（number）”，但是它不检查你在赋值时是否用了一致的类型。TypeScript 会对此进行检查。

这意味着你现存的正在工作着的 JavaScript 代码也同样是 TypeScript 代码。TypeScript 最大的好处是它可以高亮显示你代码中意料之外的行为，降低产生 bug 的机率。

此教程提供了 TypeScript 的简略概述，聚焦于它的类型系统上。

## 推断类型（Types by Inference）

TypeScript 了解 JavaScript 语言，在很多情况下它能为你生成类型。例如当创建一个变量并为它赋予特定的值时，TypeScript 将以那个值的类型作为变量的类型。

```ts twoslash
let helloWorld = "Hello World";
//  ^?
```

通过理解 JavaScript 是如何工作的，TypeScript 可以构建一个类型系统。这个类型系统不仅可以接受 JavaScript 代码，并且拥有类型。这就为你的代码提供了一个即无须增加额外的字符又能明确类型的类型系统。这就是 TypeScript 如何知道上面例子中的`helloworld`变量是一个`string`类型的原理。

你可能在撰写 JavaScript 时使用的是 Visual Studio Code，并使用了编辑器的自动补全功能。Visual Studio Code 的底层使用的是 TypeScript，这让它与 JavaScript 一起工作变得更容易了。

## 定义类型（Defining Types）

在 JavaScript 中你可以使用广泛多样的设计模式。然而，有些设计模式会让自动对类型进行推断变得困难（例如使用动态规划〈dynamic programming〉的模式）。为了适用于此类情况，TypeScript 支持对 JavaScript 语言的扩展。这种扩展为“你来告诉 TypeScript 应该用什么类型”提供了空间。

例如，创建一个对象，这个对象拥有一个包含着`name: string`和`id:number`的推断类型。你可以这样来写：

```ts twoslash
const user = {
  name: "Hayes",
  id: 0,
};
```

你可以使用一个`interface`声明来明确地描述这个对象的形态（shape）：

```ts twoslash
interface User {
  name: string;
  id: number;
}
```

之后你可以遵循新的`interface`的形态来声明 JavaScript 对象，方法是在变量声明后面使用`: TypeName`语法：（将`TypeName`替换成`interface`的名称）

```ts twoslash
interface User {
  name: string;
  id: number;
}
// ---cut---
const user: User = {
  name: "Hayes",
  id: 0,
};
```

如果你提供的对象和你提供的 interface 不相符，TypeScript 就会警告你：

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

由于 JavaScript 支持类和面向对象编程，所以 TypeScript 也支持。你可以对类使用 interface 声明：

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

你可以使用 interface 为函数的形式参数和返回的值做注解：

```ts twoslash
// @noErrors
interface User {
  name: string;
  id: number;
}
// ---cut---
function getAdminUser(): User {
  //...
}

function deleteUser(user: User) {
  // ...
}
```

JavaScript 中已经有一小组可用的原始类型了：`boolean（布尔值）`、`bigint`、`null`、`number`（数值）、`string`（字符串）、`symbol`和`undefined`，这些你可以在 interface 中使用。TypeScript 对这个列表进行了扩展，增加了更多内容，例如：`any`（允许任何内容）、[`unknown`](/play#example/unknown-and-never)（确保有人用了此类型并声明了这个类型是什么）、[`never`](/play#example/unknown-and-never)（此类型几乎不可能发生）和`void`（一个函数返回`undefined`或不返回值）。

你将看到有两个构建类型的语法，分别是：[Interfaces 和 Types](/play/?e=83#example/types-vs-interfaces)。你应该倾向于使用`interface`。在有特殊需求的时候使用`type`。

## 组合类型（Composing Types）

在 TypeScript 中，你可以通过把简单的类型组合在一起来创建复杂的类型。有两个流行的方式来进行组合：使用联合（Unions）及使用泛型（Generics）。

### 联合（Unions）

使用联合你可以将一个类型声明为多种类型之一。例如，你可以将一个`boolean`类型描述成`true`或`false`之一：

```ts twoslash
type MyBool = true | false;
```

*注意：*如果你把鼠标悬停在`MyBool`之上，你将看到它被归类为`boolean`类型。这是结构类型系统（Structural Type System）的一个属性。下面对此有更多的介绍。

关于联合类型，一个很受欢迎的使用案例是——描述了一个值被允许是一组`string`或`number`[字面量（literal）类型](/docs/handbook/literal-types.html)中的某一个：

```ts twoslash
type WindowStates = "open" | "closed" | "minimized";
type LockStates = "locked" | "unlocked";
type PositiveOddNumbersUnderTen = 1 | 3 | 5 | 7 | 9;
```

联合类型也提供了一个方式来处理不同的类型。例如，你可能有一个函数，它接受一个`array`或一个`string`作为参数：

```ts twoslash
function getLength(obj: string | string[]) {
  return obj.length;
}
```

要知道一个变量的类型，使用`typeof`:

| Type      | Predicate                          |
| --------- | ---------------------------------- |
| string    | `typeof s === "string"`            |
| number    | `typeof n === "number"`            |
| boolean   | `typeof b === "boolean"`           |
| undefined | `typeof undefined === "undefined"` |
| function  | `typeof f === "function"`          |
| array     | `Array.isArray(a)`                 |

例如，你可以让一个函数基于传入它的参数是字符串还是数组，来返回不同的值：

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

### 泛型（Generics）

泛型为类型提供了变量。一个常见的例子是数组。一个不使用泛型的数组可以包含任何内容。一个使用了泛型的数组可以描述出数组所包含的值。

```ts
type StringArray = Array<string>;
type NumberArray = Array<number>;
type ObjectWithNameArray = Array<{ name: string }>;
```

使用泛型你可以声明自己的类型：

```ts twoslash
// @errors: 2345
interface Backpack<Type> {
  add: (obj: Type) => void;
  get: () => Type;
}

// 这行代码是一个快捷方式，它告诉了 TypeScript
// 有一个名为`backpack`的常量，且不用担心它来自哪里
declare const backpack: Backpack<string>;

// object 是一个字符串，因为我们在上面声明了这个变量是属于 Backpack 的
// 而在上面，Backpack 被指定为字符串了
const object = backpack.get();

// 由于 backpack 变量是一个字符串，你不能把数字传递给 add 函数
backpack.add(23);
```

## 结构类型系统（Structural Type System）

TypeScript 的核心原则之一是类型检查聚焦在值所拥有的*形态（shape）*上。这有时被称为“鸭子类型”（duck typeing）或“结构类型”（structural typing）。

在一个结构类型系统中，如果两个对象拥有相同的形态，它们则被视为具有相同的类型。

```ts twoslash
interface Point {
  x: number;
  y: number;
}

function logPoint(p: Point) {
  console.log(`${p.x}, ${p.y}`);
}

// logs "12, 26"
const point = { x: 12, y: 26 };
logPoint(point);
```

`point`变量从来没有被声明为`Point`类型。然而，TypeScript 在类型检查时对比了`point`和`Point`的形态。它们的形态形同，所以代码通过了检查。

形态相符（shape-matching）只要求对象中的一部分字段匹配即可。

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
logPoint(point3); // logs "12, 26"

const rect = { x: 33, y: 3, width: 30, height: 80 };
logPoint(rect); // logs "33, 3"

const color = { hex: "#187ABF" };
logPoint(color);
```

类和对象如何与形态相符是没有区别的：

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
class VirtualPoint {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

const newVPoint = new VirtualPoint(13, 56);
logPoint(newVPoint); // logs "13, 56"
```

如果对象或类具有所有必要的属性，无论实施的细节如何，TypeScript 会说它们匹配。

## 下一步

以上是日常 TypeScript 用到的语法和工具的简要概述。从这里开始，你可以：

- [从开头到结尾](/docs/handbook/intro.html)阅读完整的手册 (30 分钟)
- 探索[演练场示例](/play#show-examples)
