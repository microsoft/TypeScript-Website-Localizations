---
title: Keyof 类型运算符
layout: docs
permalink: /zh/docs/handbook/2/keyof-types.html
oneline: "在类型上下文中使用keyof运算符"
---

## `keyof` 类型运算符

`keyof` 操作符接受一个对象类型，并且会将该对象的key值进行联合生成一个由字符串或数字组成的文字串。
以下类型 P 与类型 "x" | "y" 是等价的：

```ts twoslash
type Point = { x: number; y: number };
type P = keyof Point;
//   ^?
```

如果类型具有`string`或`number`的索引签名，`keyof`则将返回索引的类型：

```ts twoslash
type Arrayish = { [n: number]: unknown };
type A = keyof Arrayish;
//   ^?

type Mapish = { [k: string]: boolean };
type M = keyof Mapish;
//   ^?
```

值得注意的是，上面例子中, `M` 是 `string | number` -- 这是因为JavaScript中对象的键始终会强制转换成字符串，所以 `obj[0]` 与 `obj["0"]`是等价的。

当`keyof`与映射类型结合使用时，将变得特别有用，稍后我们会详细了解。
