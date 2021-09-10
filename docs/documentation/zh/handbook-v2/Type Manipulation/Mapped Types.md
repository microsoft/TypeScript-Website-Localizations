---
title: Mapped Types
layout: docs
permalink: /zh/docs/handbook/2/mapped-types.html
oneline: "通过复用已有类型来生成类型。"
---

当你不想重复你自己时，有时一个类型需要基于另一个类型。

映射类型基于索引签名的语法构建，它用于声明尚未提前声明的属性类型：

```ts twoslash
type Horse = {};
// ---cut---
type OnlyBoolsAndHorses = {
  [key: string]: boolean | Horse;
};

const conforms: OnlyBoolsAndHorses = {
  del: true,
  rodney: false,
};
```

映射类型是一种泛型类型，它使用 `PropertyKey` 的联合（通常 [通过 `keyof`](/docs/handbook/2/indexed-access-types.html)）来迭代键以创建类型：

```ts twoslash
type OptionsFlags<Type> = {
  [Property in keyof Type]: boolean;
};
```

在此示例中，`OptionsFlags` 接收 `Type` 类型上所有的属性，并将它们的值转为 boolean。

```ts twoslash
type OptionsFlags<Type> = {
  [Property in keyof Type]: boolean;
};
// ---cut---
type FeatureFlags = {
  darkMode: () => void;
  newUserProfile: () => void;
};

type FeatureOptions = OptionsFlags<FeatureFlags>;
//   ^?
```

### 映射修饰符

有两个附加修饰符可以在映射是应用到：`readonly` 和 `?` 分别作用于可变性和可选择性。

您可以通过前缀 `-` 来删除这些修饰符，或者用 `+` 增加它们。如果没有前缀，就默认为 `+`。

```ts twoslash
// 从类型的属性中移除 'readonly' 标记
type CreateMutable<Type> = {
  -readonly [Property in keyof Type]: Type[Property];
};

type LockedAccount = {
  readonly id: string;
  readonly name: string;
};

type UnlockedAccount = CreateMutable<LockedAccount>;
//   ^?
```

```ts twoslash
// 从类型的属性中移除 'optional' 标记
type Concrete<Type> = {
  [Property in keyof Type]-?: Type[Property];
};

type MaybeUser = {
  id: string;
  name?: string;
  age?: number;
};

type User = Concrete<MaybeUser>;
//   ^?
```

## 通过 `as` 重新映射键

在 TypeScript 4.1 及更高版本，您可以使用映射类型中的 `as` 子句重新映射映射类型中的键：

```ts
type MappedTypeWithNewProperties<Type> = {
    [Properties in keyof Type as NewKeyType]: Type[Properties]
}
```

您可以利用 [模版字面量类型](/docs/handbook/2/template-literal-types.html) 等功能，从以前的属性名称创建新的属性名称：

```ts twoslash
type Getters<Type> = {
    [Property in keyof Type as `get${Capitalize<string & Property>}`]: () => Type[Property]
};

interface Person {
    name: string;
    age: number;
    location: string;
}

type LazyPerson = Getters<Person>;
//   ^?
```

您可以通过条件类型生成 `never` 来筛选出键：

```ts twoslash
// 移除 'kind' 属性
type RemoveKindField<Type> = {
    [Property in keyof Type as Exclude<Property, "kind">]: Type[Property]
};

interface Circle {
    kind: "circle";
    radius: number;
}

type KindlessCircle = RemoveKindField<Circle>;
//   ^?
```

### 未来探索

映射类型与此类型操作部分中的其他功能配合得很好，例如，这里有 [使用条件类型的映射类型](/docs/handbook/2/conditional-types.html) 它返回 `true` 或 `false`，这取决于对象是否将属性 `pii` 设置为文字 `true`。

```ts twoslash
type ExtractPII<Type> = {
  [Property in keyof Type]: Type[Property] extends { pii: true } ? true : false;
};

type DBFields = {
  id: { format: "incrementing" };
  name: { type: string; pii: true };
};

type ObjectsNeedingGDPRDeletion = ExtractPII<DBFields>;
//   ^?
```
