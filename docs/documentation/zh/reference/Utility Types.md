---
title: 工具类型
layout: docs
permalink: /zh/docs/handbook/utility-types.html
oneline: TypeScript 中全局包含的类型
translatable: true
---

TypeScript 提供了几种常见的促进类型转换的工具类型。这些工具类型在全局范围内可用。

## `Awaited<Type>`

<blockquote class=bg-reading>

发布版本:
[4.5](docs/handbook/release-notes/typescript-4-5.html#the-awaited-type-and-promise-improvements)

</blockquote>

这种类型旨在模拟 `async` 函数中的 `await` 之类的操作，或者`Promise` 上的`.then()` 方法 - 具体来说，它们以递归的方式
展开`Promise`

##### Example

```ts twoslash
type A = Awaited<Promise<string>>;
//   ^?

type B = Awaited<Promise<Promise<number>>>;
//   ^?

type C = Awaited<boolean | Promise<number>>;
//   ^?
```

## `Partial<Type>`

<blockquote class=bg-reading>

发布版本: 
[2.1](/docs/handbook/release-notes/typescript-2-1.html#partial-readonly-record-and-pick)

</blockquote>

构造一个将 `Type` 的所有属性设置为optional的类型。 此工具类型将返回一个表示给定类型的所有子集的类型。

##### Example

```ts twoslash
interface Todo {
  title: string;
  description: string;
}

function updateTodo(todo: Todo, fieldsToUpdate: Partial<Todo>) {
  return { ...todo, ...fieldsToUpdate };
}

const todo1 = {
  title: "organize desk",
  description: "clear clutter",
};

const todo2 = updateTodo(todo1, {
  description: "throw out trash",
});
```

## `Required<Type>`

<blockquote class=bg-reading>

发布版本: 
[2.8](/docs/handbook/release-notes/typescript-2-8.html#improved-control-over-mapped-type-modifiers)

</blockquote>

构造一个将 `Type` 的所有属性设置为required的类型。它是[`Partial`]的反向操作(#partialtype)。

##### Example

```ts twoslash
// @errors: 2741
interface Props {
  a?: number;
  b?: string;
}

const obj: Props = { a: 5 };

const obj2: Required<Props> = { a: 5 };
```

## `Readonly<Type>`

<blockquote class=bg-reading>

发布版本:  
[2.1](/docs/handbook/release-notes/typescript-2-1.html#partial-readonly-record-and-pick)

</blockquote>

构造一个将 `Type` 的所有属性设置为`readonly`的类型，这就意味着这些属性不能被重新分配构造类型。

##### Example

```ts twoslash
// @errors: 2540
interface Todo {
  title: string;
}

const todo: Readonly<Todo> = {
  title: "Delete inactive users",
};

todo.title = "Hello";
```

This utility is useful for representing assignment expressions that will fail at runtime (i.e. when attempting to reassign properties of a [frozen object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze)).

此工具对于表示将要在运行时失败的赋值表达式很有用（即，当尝试重新分配 [frozen object] 的属性时(https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze)）

##### `Object.freeze`

```ts
function freeze<Type>(obj: Type): Readonly<Type>;
```

## `Record<Keys, Type>`

<blockquote class=bg-reading>

发布版本:  
[2.1](/docs/handbook/release-notes/typescript-2-1.html#partial-readonly-record-and-pick)

</blockquote>

构造一个对象类型，其属性键为“Keys”，其属性值为“Type”。 此工具可用于将一种类型的属性映射到另一种类型。

##### Example

```ts twoslash
interface CatInfo {
  age: number;
  breed: string;
}

type CatName = "miffy" | "boris" | "mordred";

const cats: Record<CatName, CatInfo> = {
  miffy: { age: 10, breed: "Persian" },
  boris: { age: 5, breed: "Maine Coon" },
  mordred: { age: 16, breed: "British Shorthair" },
};

cats.boris;
// ^?
```

## `Pick<Type, Keys>`

<blockquote class=bg-reading>

发布版本:  
[2.1](/docs/handbook/release-notes/typescript-2-1.html#partial-readonly-record-and-pick)

</blockquote>

通过从 `Type` 中选择一组属性 `Keys`（字符串文字或字符串文字的联合）来构造一个类型。

##### Example

```ts twoslash
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPreview = Pick<Todo, "title" | "completed">;

const todo: TodoPreview = {
  title: "Clean room",
  completed: false,
};

todo;
// ^?
```

## `Omit<Type, Keys>`

<blockquote class=bg-reading>

发布版本:  
[3.5](/docs/handbook/release-notes/typescript-3-5.html#the-omit-helper-type)

</blockquote>

通过从 `Type` 中选择所有属性然后删除 `Keys`（字符串文字或字符串文字的联合）来构造类型。

##### Example

```ts twoslash
interface Todo {
  title: string;
  description: string;
  completed: boolean;
  createdAt: number;
}

type TodoPreview = Omit<Todo, "description">;

const todo: TodoPreview = {
  title: "Clean room",
  completed: false,
  createdAt: 1615544252770,
};

todo;
// ^?

type TodoInfo = Omit<Todo, "completed" | "createdAt">;

const todoInfo: TodoInfo = {
  title: "Pick up kids",
  description: "Kindergarten closes at 5pm",
};

todoInfo;
// ^?
```

## `Exclude<UnionType, ExcludedMembers>`

<blockquote class=bg-reading>

发布版本:  
[2.8](/docs/handbook/release-notes/typescript-2-8.html#predefined-conditional-types)

</blockquote>

通过从“UnionType”中排除所有可分配给“ExcludedMembers”的联合成员来构造一个类型。

##### Example

```ts twoslash
type T0 = Exclude<"a" | "b" | "c", "a">;
//    ^?
type T1 = Exclude<"a" | "b" | "c", "a" | "b">;
//    ^?
type T2 = Exclude<string | number | (() => void), Function>;
//    ^?
```

## `Extract<Type, Union>`

<blockquote class=bg-reading>

发布版本:  
[2.8](/docs/handbook/release-notes/typescript-2-8.html#predefined-conditional-types)

</blockquote>

通过从 `Type` 中提取所有可分配给 `Union` 的联合成员来构造一个类型。

##### Example

```ts twoslash
type T0 = Extract<"a" | "b" | "c", "a" | "f">;
//    ^?
type T1 = Extract<string | number | (() => void), Function>;
//    ^?
```

## `NonNullable<Type>`

<blockquote class=bg-reading>

发布版本:  
[2.8](/docs/handbook/release-notes/typescript-2-8.html#predefined-conditional-types)

</blockquote>

通过从 `Type` 中排除 `null` 和 `undefined` 来构造一个类型。

##### Example

```ts twoslash
type T0 = NonNullable<string | number | undefined>;
//    ^?
type T1 = NonNullable<string[] | null | undefined>;
//    ^?
```

## `Parameters<Type>`

<blockquote class=bg-reading>

发布版本:  
[3.1](https://github.com/microsoft/TypeScript/pull/26243)

</blockquote>

从函数类型 `Type` 的参数使用的类型中构造元组类型。

##### Example

```ts twoslash
// @errors: 2344
declare function f1(arg: { a: number; b: string }): void;

type T0 = Parameters<() => string>;
//    ^?
type T1 = Parameters<(s: string) => void>;
//    ^?
type T2 = Parameters<<T>(arg: T) => T>;
//    ^?
type T3 = Parameters<typeof f1>;
//    ^?
type T4 = Parameters<any>;
//    ^?
type T5 = Parameters<never>;
//    ^?
type T6 = Parameters<string>;
//    ^?
type T7 = Parameters<Function>;
//    ^?
```

## `ConstructorParameters<Type>`

<blockquote class=bg-reading>

发布版本:  
[3.1](https://github.com/microsoft/TypeScript/pull/26243)

</blockquote>

从构造函数类型的类型构造元组或数组类型。 它生成一个包含所有参数类型的元组类型（如果 `Type` 不是函数，则生成类型 `never`）。

##### Example

```ts twoslash
// @errors: 2344
// @strict: false
type T0 = ConstructorParameters<ErrorConstructor>;
//    ^?
type T1 = ConstructorParameters<FunctionConstructor>;
//    ^?
type T2 = ConstructorParameters<RegExpConstructor>;
//    ^?
type T3 = ConstructorParameters<any>;
//    ^?

type T4 = ConstructorParameters<Function>;
//    ^?
```

## `ReturnType<Type>`

<blockquote class=bg-reading>

发布版本:  
[2.8](/docs/handbook/release-notes/typescript-2-8.html#predefined-conditional-types)

</blockquote>

构造一个由函数 `Type` 返回的类型组成的类型。

##### Example

```ts twoslash
// @errors: 2344 2344
declare function f1(): { a: number; b: string };

type T0 = ReturnType<() => string>;
//    ^?
type T1 = ReturnType<(s: string) => void>;
//    ^?
type T2 = ReturnType<<T>() => T>;
//    ^?
type T3 = ReturnType<<T extends U, U extends number[]>() => T>;
//    ^?
type T4 = ReturnType<typeof f1>;
//    ^?
type T5 = ReturnType<any>;
//    ^?
type T6 = ReturnType<never>;
//    ^?
type T7 = ReturnType<string>;
//    ^?
type T8 = ReturnType<Function>;
//    ^?
```

## `InstanceType<Type>`

<blockquote class=bg-reading>

发布版本:  
[2.8](/docs/handbook/release-notes/typescript-2-8.html#predefined-conditional-types)

</blockquote>

构造一个类型，该类型由 `Type` 中的构造函数的实例类型组成。

##### Example

```ts twoslash
// @errors: 2344 2344
// @strict: false
class C {
  x = 0;
  y = 0;
}

type T0 = InstanceType<typeof C>;
//    ^?
type T1 = InstanceType<any>;
//    ^?
type T2 = InstanceType<never>;
//    ^?
type T3 = InstanceType<string>;
//    ^?
type T4 = InstanceType<Function>;
//    ^?
```

## `ThisParameterType<Type>`

<blockquote class=bg-reading>

发布版本:  
[3.3](https://github.com/microsoft/TypeScript/pull/28920)

</blockquote>

如果函数类型没有 `this` 参数，则提取函数类型的 [this](/docs/handbook/functions.html#this-parameters) 参数或 [unknown](/docs/handbook/release-notes/typescript-3-0.html# new-unknown-top-type) 类型。

##### Example

```ts twoslash
function toHex(this: Number) {
  return this.toString(16);
}

function numberToString(n: ThisParameterType<typeof toHex>) {
  return toHex.apply(n);
}
```

## `OmitThisParameter<Type>`

<blockquote class=bg-reading>

发布版本:  
[3.3](https://github.com/microsoft/TypeScript/pull/28920)

</blockquote>

从 `Type` 中删除 [`this`](/docs/handbook/functions.html#this-parameters) 参数。 如果 `Type` 没有明确声明 `this` 参数，则结果只是 `Type`。 否则，从 `Type` 创建一个没有 `this` 参数的新函数类型。 泛型被删除后，只有最后一个重载签名被传递到新的函数类型中。

##### Example

```ts twoslash
function toHex(this: Number) {
  return this.toString(16);
}

const fiveToHex: OmitThisParameter<typeof toHex> = toHex.bind(5);

console.log(fiveToHex());
```

## `ThisType<Type>`

<blockquote class=bg-reading>

发布版本:  
[2.3](https://github.com/microsoft/TypeScript/pull/14141)

</blockquote>

此工具不返回转换后的类型。 相反，它用作上下文 [`this`](/docs/handbook/functions.html#this) 类型的标记。 请注意，必须启用 [`noImplicitThis`](/tsconfig#noImplicitThis) 标志才能使用此工具。

##### Example

```ts twoslash
// @noImplicitThis: false
type ObjectDescriptor<D, M> = {
  data?: D;
  methods?: M & ThisType<D & M>; // Type of 'this' in methods is D & M
};

function makeObject<D, M>(desc: ObjectDescriptor<D, M>): D & M {
  let data: object = desc.data || {};
  let methods: object = desc.methods || {};
  return { ...data, ...methods } as D & M;
}

let obj = makeObject({
  data: { x: 0, y: 0 },
  methods: {
    moveBy(dx: number, dy: number) {
      this.x += dx; // Strongly typed this
      this.y += dy; // Strongly typed this
    },
  },
});

obj.x = 10;
obj.y = 20;
obj.moveBy(5, 5);
```

在上面的例子中，`makeObject` 参数中的 `methods` 对象有一个包含 `ThisType<D & M>` 的上下文类型，因此 [this](/docs/handbook/functions.html#this ) 在 `methods` 方法中是 `{ x: number, y: number } & { moveBy(dx: number, dy: number): number }`的联合体。 注意 `methods` 属性的类型是如何成为方法中的 `this` 类型的推理目标和源。

`ThisType<T>` 标记接口只是在`lib.d.ts` 中声明的一个空接口。 除了在对象字面量的上下文类型中被识别之外，接口的行为就像任何空接口。

## Intrinsic String Manipulation Types

### `Uppercase<StringType>`

### `Lowercase<StringType>`

### `Capitalize<StringType>`

### `Uncapitalize<StringType>`

TypeScript 包含一组可用于系统内的字符串类型操作的类型，以便于使用模板字符串进行操作。 您可以在 [Template Literal Types](/docs/handbook/2/template-literal-types.html#uppercasestringtype) 文档中找到这些内容。
