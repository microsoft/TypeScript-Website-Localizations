---
title: Indexed Access Types
layout: docs
permalink: /zh/docs/handbook/2/indexed-access-types.html
oneline: "通过 `Type['a']` 语法访问一个类型的子集。"
---

我们可以使用 _索引访问类型_ 来查找另一个类型上的特定属性。

```ts twoslash
type Person = { age: number; name: string; alive: boolean };
type Age = Person["age"];
//   ^?
```

索引类型本身就是一个类型，所以我们完全可以使用联合，`typeof`，或者其他类型：

```ts twoslash
type Person = { age: number; name: string; alive: boolean };
// ---cut---
type I1 = Person["age" | "name"];
//   ^?

type I2 = Person[keyof Person];
//   ^?

type AliveOrName = "alive" | "name";
type I3 = Person[AliveOrName];
//   ^?
```

试试看索引一个不存在的属性，你会发现报错：

```ts twoslash
// @errors: 2339
type Person = { age: number; name: string; alive: boolean };
// ---cut---
type I1 = Person["alve"];
```

另一个示例是，使用 `number` 去索引任意类型，可以得到一个数组的元素。
我们将其与 `typeof` 结合，能很方便地获取数组的元素类型

```ts twoslash
const MyArray = [
  { name: "Alice", age: 15 },
  { name: "Bob", age: 23 },
  { name: "Eve", age: 38 },
];

type Person = typeof MyArray[number];
//   ^?
type Age = typeof MyArray[number]["age"];
//   ^?
// Or
type Age2 = Person["age"];
//   ^?
```

索引时只能使用类型，这意味着不能使用 `const` 进行变量引用：

```ts twoslash
// @errors: 2538 2749
type Person = { age: number; name: string; alive: boolean };
// ---cut---
const key = "age";
type Age = Person[key];
```

但是，您可以用类型别名进行类似的重构：

```ts twoslash
type Person = { age: number; name: string; alive: boolean };
// ---cut---
type key = "age";
type Age = Person[key];
```
