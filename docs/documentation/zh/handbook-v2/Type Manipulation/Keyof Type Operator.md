---
title: Keyof Type Operator
layout: docs
permalink: /zh/docs/handbook/2/keyof-types.html
oneline: "在类型上下文里使用 keyof 关键字"
---

## `keyof` 类型操作符

`keyof` 类型操作符接受一个对象类型，产出其 key 的字符或者数字的合集类型：

```ts twoslash
type Point = { x: number; y: number };
type P = keyof Point;
//   ^?
```

如果这个类有一个 `string` 或者 `number` 索引签名，则 `keyof` 将返回这些类型：

```ts twoslash
type Arrayish = { [n: number]: unknown };
type A = keyof Arrayish;
//   ^?

type Mapish = { [k: string]: boolean };
type M = keyof Mapish;
//   ^?
```

注意，在本例中，`M` 是 `string | number` --这是因为 JavaScript 对象键总是强制为字符串，所以 `obj[0]` 总是与 `obj[“0”]` 相同。

`keyof` 类型特别适用于与映射类型组合，我们将在后面了解更多。
