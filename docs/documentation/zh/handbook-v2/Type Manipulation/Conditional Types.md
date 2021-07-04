---
title: 条件类型
layout: docs
permalink: /zh/docs/handbook/2/conditional-types.html
oneline: "Create types which act like if statements in the type system."
---

在大多数有用的程序的核心，我们必须根据输入做出决定。
JavaScript 程序也没有什么不同，但是考虑到值可以很容易地反思的事实，这些决定也是基于输入的类型。
_条件类型_ 有助于描述输入和输出类型之间的关系。

```ts twoslash
interface Animal {
  live(): void;
}
interface Dog extends Animal {
  woof(): void;
}

type Example1 = Dog extends Animal ? number : string;
//   ^?

type Example2 = RegExp extends Animal ? number : string;
//   ^?
```

条件类型的形式看起来有点像 JavaScript 中的条件表达式（`条件 ? true 表达式 : false 表达式`）：

```ts twoslash
type SomeType = any;
type OtherType = any;
type TrueType = any;
type FalseType = any;
type Stuff =
  // ---cut---
  SomeType extends OtherType ? TrueType : FalseType;
```

当 `extends` 左边的类型可以赋值给右边的类型时，你将获得第一个分支（"true" 分支）中的类型；否则你将获得后一个分支（"false" 分支）中的类型。

从上面的例子中，条件类型可能看起来不会立即有用 - 我们可以告诉自己是否 `Dog extends Animal` 并选择 `number` 或 `string`！
但是条件类型的威力来自于将它们与泛型一起使用。

让我们以下面的 `createLabel` 函数为例:

```ts twoslash
interface IdLabel {
  id: number /* 一些字段 */;
}
interface NameLabel {
  name: string /* 其它字段 */;
}

function createLabel(id: number): IdLabel;
function createLabel(name: string): NameLabel;
function createLabel(nameOrId: string | number): IdLabel | NameLabel;
function createLabel(nameOrId: string | number): IdLabel | NameLabel {
  throw "unimplemented";
}
```

这些 createLabel 的重载描述了单个基于输入类型进行选择的 JavaScript 函数。注意以下几点：

1. 如果一个库不得不在其 API 中一遍又一遍地做出相同的选择，这就变得很麻烦。
2. 我们必须创建三个重载：一种用于我们 _确定_ 类型时的每种情况（一个用于 `string`，一个用于 `number`），一个用于最一般的情况（接受一个 `string | number`）。对于 `createLabel` 可以处理的每个新类型，重载的数量都会呈指数增长。

相反，我们可以将该逻辑编码为条件类型：

```ts twoslash
interface IdLabel {
  id: number /* 一些字段 */;
}
interface NameLabel {
  name: string /* 其它字段 */;
}
// ---cut---
type NameOrId<T extends number | string> = T extends number
  ? IdLabel
  : NameLabel;
```

然后，我们可以使用该条件类型将重载简化为没有重载的单个函数。

```ts twoslash
interface IdLabel {
  id: number /* 一些字段 */;
}
interface NameLabel {
  name: string /* 其它字段 */;
}
type NameOrId<T extends number | string> = T extends number
  ? IdLabel
  : NameLabel;
// ---cut---
function createLabel<T extends number | string>(idOrName: T): NameOrId<T> {
  throw "unimplemented";
}

let a = createLabel("typescript");
//  ^?

let b = createLabel(2.8);
//  ^?

let c = createLabel(Math.random() ? "hello" : 42);
//  ^?
```

### 条件类型约束

通常，条件类型的检查将为我们提供一些新信息。
就像使用类型守卫缩小范围可以给我们提供更具体的类型一样，条件类型的 true 分支将根据我们检查的类型进一步约束泛型。

让我们来看看下面的例子：

```ts twoslash
// @errors: 2536
type MessageOf<T> = T["message"];
```

在本例中，TypeScript 错误是因为 `T` 不知道有一个名为 `message` 的属性。
我们可以限制 `T`，TypeScript 也不会再抱怨了：

```ts twoslash
type MessageOf<T extends { message: unknown }> = T["message"];

interface Email {
  message: string;
}

interface Dog {
  bark(): void;
}

type EmailMessageContents = MessageOf<Email>;
//   ^?
```

然而，如果我们希望 `MessageOf` 采用任何类型，并且在 `message` 属性不可用的情况下缺省为 `never` 之类的类型，该怎么办呢？
我们可以通过移出约束并引入条件类型来实现这一点：

```ts twoslash
type MessageOf<T> = T extends { message: unknown } ? T["message"] : never;

interface Email {
  message: string;
}

interface Dog {
  bark(): void;
}

type EmailMessageContents = MessageOf<Email>;
//   ^?

type DogMessageContents = MessageOf<Dog>;
//   ^?
```

在 true 分支中，TypeScript 知道 `T` _将_ 有一个 `message` 属性。

作为另一个示例，我们还可以编写一个名为 `Flatten` 的类型，它将数组类型扁平为它们的元素类型，但在其他情况下不会处理它们：

```ts twoslash
type Flatten<T> = T extends any[] ? T[number] : T;

// Extracts out the element type.
type Str = Flatten<string[]>;
//   ^?

// Leaves the type alone.
type Num = Flatten<number>;
//   ^?
```

当 `Flatten` 被赋予数组类型时，它使用带 `number` 的索引访问来提取 `string[]` 的元素类型。
否则，它只返回给定的类型。

### 在条件类型中推断

我们只是发现自己使用条件类型来应用约束，然后提取出类型。
这最终成为一种非常常见的操作，条件类型使其变得更容易。

条件类型为我们提供了一种使用 `infer` 关键字从 true 分支中与之进行比较的类型中进行推断的方法。
例如，我们可以在 `Flatten` 中推断元素类型，而不是使用索引访问类型“手动”提取它：

```ts twoslash
type Flatten<Type> = Type extends Array<infer Item> ? Item : Type;
```

在这里，我们使用 `infer` 关键字以声明方式引入一个名为 `Item` 的新泛型类型变量，而不是指定如何在 true 分支中检索元素类型 `T`。
这使我们不必考虑如何挖掘和探索我们感兴趣的类型的结构。

我们可以使用 `infer` 关键字编写一些有用的助手类型别名。
例如，对于简单的情况，我们可以从函数类型中提取返回类型：

```ts twoslash
type GetReturnType<Type> = Type extends (...args: never[]) => infer Return
  ? Return
  : never;

type Num = GetReturnType<() => number>;
//   ^?

type Str = GetReturnType<(x: string) => string>;
//   ^?

type Bools = GetReturnType<(a: boolean, b: boolean) => boolean[]>;
//   ^?
```

当从具有多个调用签名的类型（如重载函数的类型）进行推断时，将从 _最后一个_ 签名进行推断（这大概是最允许的捕获所有的情况）。无法基于参数类型列表执行重载解析。

```ts twoslash
declare function stringOrNum(x: string): number;
declare function stringOrNum(x: number): string;
declare function stringOrNum(x: string | number): string | number;

type T1 = ReturnType<typeof stringOrNum>;
//   ^?
```

## 分配条件类型

当条件类型作用于泛型类型时，它们在给定联合类型时成为 _分配类型_ 。
以下面的例子为例：

```ts twoslash
type ToArray<Type> = Type extends any ? Type[] : never;
```

如果我们将联合类型插入 `ToArray`，则条件类型将应用于该联合类型的每个成员。

```ts twoslash
type ToArray<Type> = Type extends any ? Type[] : never;

type StrArrOrNumArr = ToArray<string | number>;
//   ^?
```

这里发生的情况是 `StrOrNumArray` 分布在以下位置：

```ts twoslash
type StrArrOrNumArr =
  // ---cut---
  string | number;
```

并在联合类型的每个成员类型上映射到有效的内容：

```ts twoslash
type ToArray<Type> = Type extends any ? Type[] : never;
type StrArrOrNumArr =
  // ---cut---
  ToArray<string> | ToArray<number>;
```

所以我们只剩下：

```ts twoslash
type StrArrOrNumArr =
  // ---cut---
  string[] | number[];
```

通常，分布性是所需的行为。
要避免这种行为，可以用方括号括起 `extends` 关键字的两边。

```ts twoslash
type ToArrayNonDist<Type> = [Type] extends [any] ? Type[] : never;

// 'StrOrNumArr' 不再是一个联合类型
type StrOrNumArr = ToArrayNonDist<string | number>;
//   ^?
```
