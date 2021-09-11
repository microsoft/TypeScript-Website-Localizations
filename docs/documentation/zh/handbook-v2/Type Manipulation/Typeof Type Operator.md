---
title: Typeof Type Operator
layout: docs
permalink: /zh/docs/handbook/2/typeof-types.html
oneline: "在类型上下文中使用 typeof 操作符"
---

## `typeof` 类型操作符

在 JavaScript 中，已经有可以应用在 _表达式_ 上下文的 `typeof` 操作符。

```ts twoslash
// Prints "string"
console.log(typeof "Hello world");
```

TypeScript 新增了可以用在 _类型_ 上下文的 `typeof`，用以推断一个变量或者属性的 _类型_。

```ts twoslash
let s = "hello";
let n: typeof s;
//  ^?
```

对于基础类型来说这不是很实用，不过与其它类型操作符结合，您可以用 `typeof` 很方便地表示大量模式。
例如，让我们先看看这个预定义的 `ReturnType<T>` 类型。
其接收一个 _函数类型_ 并且产出它的返回值类型： 

```ts twoslash
type Predicate = (x: unknown) => boolean;
type K = ReturnType<Predicate>;
//   ^?
```

如果我们想给 `ReturnType` 传一个函数名称，我们会看到一个指示性错误：

```ts twoslash
// @errors: 2749
function f() {
  return { x: 10, y: 3 };
}
type P = ReturnType<f>;
```

请记住 _值_ 和 _类型_ 不是一回事。
要推断 `f` 这个 _值_ 的 _类型_，我们需要用到 `typeof`：

```ts twoslash
function f() {
  return { x: 10, y: 3 };
}
type P = ReturnType<typeof f>;
//   ^?
```

### 局限性

TypeScript 有意限制您所能够用 `typeof` 表达式的种类。

特别是，在标识符（即变量名）或其属性上使用 `typeof` 是唯一合法的。

这有助于规避您写一些，您认为执行了，但是却没有执行的代码这样的迷惑陷阱。

```ts twoslash
// @errors: 1005
declare const msgbox: () => boolean;
// type msgbox = any;
// ---cut---
// 打算使用 = ReturnType<typeof msgbox>
let shouldContinue: typeof msgbox("Are you sure you want to continue?");
```
