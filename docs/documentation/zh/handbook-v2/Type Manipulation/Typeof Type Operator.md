---
title: Typeof 类型运算符
layout: docs
permalink: /zh/docs/handbook/2/typeof-types.html
oneline: "在类型上下文中使用 typeof 类型运算符。"
translatable: true
---

## `typeof` 类型运算符

JavaScript 已经有了一个 `typeof` 运算符，你可以在 _表达式_ 上下文中使用：

```ts twoslash
// 打印出 "string"
console.log(typeof "Hello world");
```

TypeScript 添加了一个 `typeof` 运算符，让您可以在 _类型_ 上下文中使用它来引用变量或属性的 _类型_：

```ts twoslash
let s = "hello";
let n: typeof s;
//  ^?
```

这对于基本类型不是很有用，但结合其他类型运算符，您可以使用  `typeof` 方便地表示出多种形式。
例如，让我们从预定义类型 `ReturnType<T>` 开始查看。它接受一个 _函数类型_ 并生成函数的返回类型：

```ts twoslash
type Predicate = (x: unknown) => boolean;
type K = ReturnType<Predicate>;
//   ^?
```

如果我们尝试在函数名上使用 `ReturnType` ，我们会看到一个指导性错误：

```ts twoslash
// @errors: 2749
function f() {
  return { x: 10, y: 3 };
}
type P = ReturnType<f>;
```

请记住，_values_ 和 _types_ 不是一回事。要引用函数 `f` 值的类型，我们使用 `typeof`：

```ts twoslash
function f() {
  return { x: 10, y: 3 };
}
type P = ReturnType<typeof f>;
//   ^?
```

### 限制

TypeScript 有意限制了可以使用 `typeof` 表达式的种类。

具体来说，仅在标识符（即变量名）或其属性上使用 `typeof` 是合法的。
这有助于避免编写出你认为正在执行但实际并没有执行，让人迷惑的代码陷阱：

```ts twoslash
// @errors: 1005
declare const msgbox: () => boolean;
// type msgbox = any;
// ---cut---
// 以为等同于 ReturnType<typeof msgbox>，实际是错误的
let shouldContinue: typeof msgbox("Are you sure you want to continue?");
```
