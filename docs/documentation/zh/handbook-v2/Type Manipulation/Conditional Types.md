---
title: Conditional Types
layout: docs
permalink: /zh/docs/handbook/2/conditional-types.html
oneline: "在类型系统中像 if 语句那样的类型"
---

在最有用的程序中，我们必须根据输入做出决定。
JavaScript 程序也不例外，但鉴于值可以很容易地进行内省，这些决策也基于输入的类型。
_条件类型_ 帮助描述输入和输出类型之间的关系。

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

条件类型采用的这种形式看起来有点像 JavaScript 中的条件表达式 (`condition ? trueExpression : falseExpression`) ：

```ts twoslash
type SomeType = any;
type OtherType = any;
type TrueType = any;
type FalseType = any;
type Stuff =
  // ---cut---
  SomeType extends OtherType ? TrueType : FalseType;
```
当 `extends` 左侧的类型可以分配给右侧这个是，那么您将获取第一个分支上的类型（即「true」分支）；否则您将获取在后面分支上的类型（即「false」分支）。

从上面的例子来看，条件类型可能不会立即变得有用 -- 我们可以告诉自己 `Dog extensed Animal` 是否成立，然后选择 `number` 或 `string`！
但是条件类型的威力来自于将它们与泛型一起使用。

举个例子，我们来看下面的 `createLabel` 函数:

```ts twoslash
interface IdLabel {
  id: number /* some fields */;
}
interface NameLabel {
  name: string /* other fields */;
}

function createLabel(id: number): IdLabel;
function createLabel(name: string): NameLabel;
function createLabel(nameOrId: string | number): IdLabel | NameLabel;
function createLabel(nameOrId: string | number): IdLabel | NameLabel {
  throw "unimplemented";
}
```
`createLabel` 函数的这些重载，描述的一个单独的 JavaScript 函数，此函数根据输入的类型有不同的选项。 注意这几点：

1. 如果一个库必须在整个 API 中反复做出相同的选项，那么这将变得很麻烦。
2. 我们不得不创建三个重载：一个是我们已经确定类型的各个情形 (其一是 `string` ，另一个是 `number`)，然后另一个是最通用的情形 (接收一个 `string | number`)。对于 `createLabel` 可以处理的每一种新类型，重载的数量都会呈指数增长。

代之，我们可以通过条件类型来编写这段逻辑：

```ts twoslash
interface IdLabel {
  id: number /* some fields */;
}
interface NameLabel {
  name: string /* other fields */;
}
// ---cut---
type NameOrId<T extends number | string> = T extends number
  ? IdLabel
  : NameLabel;
```

之后，我们可以使用该条件类型将重载简化为一个没有重载的函数。

```ts twoslash
interface IdLabel {
  id: number /* some fields */;
}
interface NameLabel {
  name: string /* other fields */;
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

通常，条件类型中的检查会为我们提供一些新信息。
就像使用类型保护，缩小范围可以为我们提供更具体的类型一样，条件类型的 true 分支将通过我们检查的类型进一步约束泛型。

举例， 我们看下面代码：

```ts twoslash
// @errors: 2536
type MessageOf<T> = T["message"];
```

在这个示例中，TypeScript 报错了，因为 `T` 无法判断其有名为 `message` 的属性。
我们可以约束 `T`，TypeScript 就不再报错了：

```ts twoslash
type MessageOf<T extends { message: unknown }> = T["message"];

interface Email {
  message: string;
}

type EmailMessageContents = MessageOf<Email>;
//   ^?
```

然而，我们如果想要 `MessageOf` 能接受任意的类型，并且如果其没有 `message` 属性，那就是一个默认类型，就像 `never` ，这该怎么办呢?

我们可以通过将约束移出并引入条件类型来实现这一点：

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

在 true 分支中， TypeScript 明白 `T` _将_ 有 `message` 属性。

作为另一个示例，我们还可以编写一个名为 `Flatten` 的类型，将数组类型展平为其元素类型，但在其他情况下不使用它们：

```ts twoslash
type Flatten<T> = T extends any[] ? T[number] : T;

// Extracts out the element type.
type Str = Flatten<string[]>;
//   ^?

// Leaves the type alone.
type Num = Flatten<number>;
//   ^?
```

当 `Flatten` 接收一个数组类型，它通过使用 `number` 索引访问以获取 `string[]` 的元素类型。
否则，它仅返回传入给它的类型。

### 条件类型内的推断

我们只是发现自己使用条件类型来应用约束，然后提取类型。
这是一个非常常见的操作，条件类型使它变得更容易。

条件类型为我们提供了一种从 `true` 分支中比较的类型中进行推断的方法，就是使用 `infer` 关键字。
例如，我们可以推断出在 `Flatten` 中元素的类型，而不是用索引访问类型「手动」获取它：

```ts twoslash
type Flatten<Type> = Type extends Array<infer Item> ? Item : Type;
```

这里，我们使用 `infer` 关键词去声明性地引入一个新的泛型变量 `Item`，而不是指定如何如何在 true 分支中去会 `T` 元素类型。
这使得我们不必考虑怎样去发掘和探究我们感兴趣的类型结构了。


运用 `infer` 关键词，我们可以写一些实用的辅助类型别称。
例如，对于简单的场景，我们可以从函数类型中提取出返回类型。

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

当从一个具有多个调用签名的类型（比如一个重载函数的类型）中进行推断时，是从 _最后_ 一项签名中（这项可能是最宽泛的情形）做推断的。无法基于参数类型列表来执行重载的解析。

```ts twoslash
declare function stringOrNum(x: string): number;
declare function stringOrNum(x: number): string;
declare function stringOrNum(x: string | number): string | number;

type T1 = ReturnType<typeof stringOrNum>;
//   ^?
```

## 分配条件类型

当条件类型作用于泛型类型时，当给定一个联合类型时，它们就变成了 _分配的_。
例如，看下面：

```ts twoslash
type ToArray<Type> = Type extends any ? Type[] : never;
```

如果我们将一个联合类型插入 `ToArray`，那么条件类型将应用于该联合类型中的每个成员。

```ts twoslash
type ToArray<Type> = Type extends any ? Type[] : never;

type StrArrOrNumArr = ToArray<string | number>;
//   ^?
```

然后 `StrArrOrNumArr` 却是这样分配类型的： 

```ts twoslash
type StrArrOrNumArr =
  // ---cut---
  string | number;
```

需要把联合类型中的每个成员类型都映射进来，这样才能生效：

```ts twoslash
type ToArray<Type> = Type extends any ? Type[] : never;
type StrArrOrNumArr =
  // ---cut---
  ToArray<string> | ToArray<number>;
```

就像这样的：

```ts twoslash
type StrArrOrNumArr =
  // ---cut---
  string[] | number[];
```

通常，分配性是预期的行为。
为了避免这种行为，可以用方括号括住 extends 关键字的每一侧。

```ts twoslash
type ToArrayNonDist<Type> = [Type] extends [any] ? Type[] : never;

// 'StrArrOrNumArr' 就不在是联合类型。
type StrArrOrNumArr = ToArrayNonDist<string | number>;
//   ^?
```
