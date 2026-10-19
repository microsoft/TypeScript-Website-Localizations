---
title: 工具类型
layout: docs
permalink: /zh/docs/handbook/utility-types.html
oneline: TypeScript 中的全局类型
translatable: true
---

TypeScript 提供了一些工具类型以便于常见的类型转换。这些工具类型在全局范围内可用。

## `Partial<Type>`

构建一个 `Type` 中所有属性都设置为可选的类型。这个工具将返回一个类型，代表一个给定类型的所有子集。

##### 示例

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

构造一个由 `Type` 中所有属性组成的类型，这些属性都被设置为必填。与 [`Partial`](#partialtype) 是相反的。

##### 示例

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

构造一个 `Type` 中所有属性都被设置为可读的类型，这意味着构建出的类型的属性不能被重新分配。

##### 示例

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

这个工具对于将在运行时失败的赋值表达式很有用（例如：当试图重新分配 [frozen object]((https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze)) 的属性时）。

##### `Object.freeze`

```ts
function freeze<Type>(obj: Type): Readonly<Type>;
```

## `Record<Keys,Type>`

构建一个对象类型，它的属性键是 `Keys`，它的属性值是 `Type`。这个工具可以用来将一个类型的属性映射到另一个类型。

##### 示例

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

通过从 `Type` 中挑选属性集 `Keys` （字符串字面量或联合的字符串字面量）来构造一个类型。

##### 示例

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

通过从 `Type` 中选取所有属性，然后删除 `Keys` （字符串字面量或联合的字符串字面量）来构建一个类型。

##### 示例

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

## `Exclude<Type, ExcludedUnion>`

通过从 `Type` 中排除所有可分配给 `ExcludedUnion` 的联合成员来构造一个类型。

##### 示例

```ts twoslash
type T0 = Exclude<"a" | "b" | "c", "a">;
//    ^?
type T1 = Exclude<"a" | "b" | "c", "a" | "b">;
//    ^?
type T2 = Exclude<string | number | (() => void), Function>;
//    ^?
```

## `Extract<Type, Union>`

通过从 `Type` 中提取所有可分配给 `Union` 的联合成员来构造一个类型。

##### 示例

```ts twoslash
type T0 = Extract<"a" | "b" | "c", "a" | "f">;
//    ^?
type T1 = Extract<string | number | (() => void), Function>;
//    ^?
```

## `NonNullable<Type>`

通过从 `Type` 中排除 `null` 和 `undefined` 来构造一个类型。

##### 示例

```ts twoslash
type T0 = NonNullable<string | number | undefined>;
//    ^?
type T1 = NonNullable<string[] | null | undefined>;
//    ^?
```

## `Parameters<Type>`

从一个函数类型 `Type` 的参数中使用的类型构建一个元组类型。

##### 示例

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

从构造函数的类型中构建一个元组或数组类型。它产生一个具有所有参数类型的元组类型（如果 `Type` 不是一个函数，则产生 `never` 类型）。

##### 示例

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

构建一个由函数 `Type` 的返回类型组成的类型。

##### 示例

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

构建一个由 `Type` 中的构造函数的实例类型组成的类型。

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

提取函数类型的 [this](/docs/handbook/functions.html#this-parameters) 参数的类型，如果函数类型没有 `this` 参数，则提取一个 [unkonwn](/docs/handbook/release-notes/typescript-3-0.html#new-unknown-top-type) 类型

##### 示例

```ts twoslash
function toHex(this: Number) {
  return this.toString(16);
}

function numberToString(n: ThisParameterType<typeof toHex>) {
  return toHex.apply(n);
}
```

## `OmitThisParameter<Type>`

从 `Type` 中删除 [`this`](/docs/handbook/functions.html#this-parameters)参数。如果 `Type` 没有明确声明 `this` 参数， 结果只是 `Type`。否则，将从 `Type` 中创建一个没有 `this` 参数的新函数类型。泛型被清除，只有最后的重载签名被传播到新的函数类型中。

##### 示例

```ts twoslash
function toHex(this: Number) {
  return this.toString(16);
}

const fiveToHex: OmitThisParameter<typeof toHex> = toHex.bind(5);

console.log(fiveToHex());
```

## `ThisType<Type>`

这个工具并不会返回一个转换后的类型。相反，它是上下文 [`this`](/docs/handbook/functions.html#this) 类型的一个标记。请注意，必须启用 `--noImplicitThis` 标志才能使用这个工具。

##### 示例

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

在上面的例子中，`makeObject` 的参数中的 `methods` 对象有一个包括 `ThisType<D & M>` 的上下文类型，因此 `methods` 对象中的 [this](/docs/handbook/functions.html#this) 的类型是：`{ x: number, y: number } & { moveBy(dx: number, dy: number): number }`。注意 `methods` 属性的类型是如何同时推断目标和 methods 中的 `this` 类型的来源。

`ThisType<T>` 标记接口只是在 `lib.d.ts` 中声明的一个空接口。除了在对象字面量的上下文类型中被识别之外，该接口的行为与所有的空接口一样。

## Intrinsic String Manipulation Types

### `Uppercase<StringType>`

### `Lowercase<StringType>`

### `Capitalize<StringType>`

### `Uncapitalize<StringType>`

为了帮助模板字符串字面量的字符串操作，TypeScript 包含了一组类型，可以在类型系统中用于字符串操作。你可以在 [Template Literal Types](/docs/handbook/2/template-literal-types.html#uppercasestringtype) 文档中找到这些。
