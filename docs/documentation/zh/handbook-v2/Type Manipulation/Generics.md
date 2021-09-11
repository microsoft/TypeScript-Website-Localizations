---
title: Generics
layout: docs
permalink: /zh/docs/handbook/2/generics.html
oneline: 泛型：带有参数的类型
---

软件工程的一个主要部分是构建组件，这些组件不仅具有定义良好且一致的 API，而且还具有可重用性。
能够处理现在的数据，也可以处理将来的数据的组件，将使您构建大型软件系统时如虎添翼。

在类似 C# 和 Java 的语言中，创建可复用性组件的一大法宝就是 _泛型_，也就是说，能够创建可以在多种类型而非单一类型上工作的组件。
这让用户可以按自己的类型去使用组件。
## 泛型 Hello World

首先，让我们通过 identity 函数做一个泛型的 「hello world」：
identity 函数是一个返回传入内容的函数。
您可以将其想象为类似 `echo` 命令的方法。

没有泛型的情况下，我们可能必须要给这个 identity 函数指定类型：

```ts twoslash
function identity(arg: number): number {
  return arg;
}
```

或者，我们可以用 `any` 类型来表示这个 identity 函数：

```ts twoslash
function identity(arg: any): any {
  return arg;
}
```

因为使用 `any` 肯定是宽泛的，这导致该函数的 `arg` 可以接收任何和所有的类型，我们实际上就无法得知该函数返回值的类型信息。
如果我们传入一个数字，我们仅能得到的信息就是，其可能会返回任意类型。

相反的，我们需要一种途径去得知参数的类型，从而我们可以利用它去表示将返回何种类型。
在此，我们将使用一个 _类型变量_ ，它是一种工作在类型系统中的变量，而非一般的值。

```ts twoslash
function identity<Type>(arg: Type): Type {
  return arg;
}
```

我们刚刚给 identity 函数添加了一个类型变量 `Type`。
这个 `Type` 允许我们捕获用户传递的参数类型（如 `number`），于是我们待会儿要用到这个信息。
这里，我们再次使用 `Type` 作为返回类型。通过检查，我们现在可以看到参数和返回类型使用了相同的类型。
这让我们将类型信息从函数的一侧，传达到其另一侧。

我们将这种版本的 `identity` 函数称为泛型，因为它适用于一系列类型。
与使用 `any` 不一样，这种方式与使用数字作为参数和返回值的那个第一个 `identity` 函数一样精确（如：它不会丢失任何信息）。

当我们写了这个泛型 identity 函数，我们可以通过两种方式去调用它。
第一种方式是将所有的参数，包括类型的参数，传递给函数：

```ts twoslash
function identity<Type>(arg: Type): Type {
  return arg;
}
// ---cut---
let output = identity<string>("myString");
//       ^?
```

在这里，我们显式地将 `Type` 设置为 `string`，作为函数调用的参数之一，在参数周围使用 `<>` 表示，而不是使用 `()`。

第二种方式也许最常见。这里我们使用 _类型参数推导_ -- 也就是，我们想要编译器通过我们所传参数的类型，去自动为我们设置 `Type` 的值：

```ts twoslash
function identity<Type>(arg: Type): Type {
  return arg;
}
// ---cut---
let output = identity("myString");
//       ^?
```

注意，我们不必显式地传递类型到单方括号（`<>`）里；编译器会顾及 `"myString"` 的值，并设置 `Type` 为其类型。
虽然类型参数推断是保持代码更短和更可读的有用工具，但当编译器无法推断类型时，您可能需要显式地传递类型参数，就像我们在上一个示例中所做的那样，这可能发生在更复杂的示例中。
## 使用泛型类型变量

当您开始使用泛型，您将会注意到，当您创建一个像 `identify` 这样的泛型函数时，编译器会强制您在函数体内正确的使用任意的泛型类型参数。
也就是说，您实际上可以将这些参数视为任何类型。

让我们回头看一下 `identity` 函数：

```ts twoslash
function identity<Type>(arg: Type): Type {
  return arg;
}
```

What if we want to also log the length of the argument `arg` to the console with each call?
We might be tempted to write this:

```ts twoslash
// @errors: 2339
function loggingIdentity<Type>(arg: Type): Type {
  console.log(arg.length);
  return arg;
}
```

When we do, the compiler will give us an error that we're using the `.length` member of `arg`, but nowhere have we said that `arg` has this member.
Remember, we said earlier that these type variables stand in for any and all types, so someone using this function could have passed in a `number` instead, which does not have a `.length` member.

Let's say that we've actually intended this function to work on arrays of `Type` rather than `Type` directly. Since we're working with arrays, the `.length` member should be available.
We can describe this just like we would create arrays of other types:

```ts twoslash {1}
function loggingIdentity<Type>(arg: Type[]): Type[] {
  console.log(arg.length);
  return arg;
}
```

You can read the type of `loggingIdentity` as "the generic function `loggingIdentity` takes a type parameter `Type`, and an argument `arg` which is an array of `Type`s, and returns an array of `Type`s."
If we passed in an array of numbers, we'd get an array of numbers back out, as `Type` would bind to `number`.
This allows us to use our generic type variable `Type` as part of the types we're working with, rather than the whole type, giving us greater flexibility.

We can alternatively write the sample example this way:

```ts twoslash {1}
function loggingIdentity<Type>(arg: Array<Type>): Array<Type> {
  console.log(arg.length); // Array has a .length, so no more error
  return arg;
}
```

You may already be familiar with this style of type from other languages.
In the next section, we'll cover how you can create your own generic types like `Array<Type>`.

## Generic Types

In previous sections, we created generic identity functions that worked over a range of types.
In this section, we'll explore the type of the functions themselves and how to create generic interfaces.

The type of generic functions is just like those of non-generic functions, with the type parameters listed first, similarly to function declarations:

```ts twoslash
function identity<Type>(arg: Type): Type {
  return arg;
}

let myIdentity: <Type>(arg: Type) => Type = identity;
```

We could also have used a different name for the generic type parameter in the type, so long as the number of type variables and how the type variables are used line up.

```ts twoslash
function identity<Type>(arg: Type): Type {
  return arg;
}

let myIdentity: <Input>(arg: Input) => Input = identity;
```

We can also write the generic type as a call signature of an object literal type:

```ts twoslash
function identity<Type>(arg: Type): Type {
  return arg;
}

let myIdentity: { <Type>(arg: Type): Type } = identity;
```

Which leads us to writing our first generic interface.
Let's take the object literal from the previous example and move it to an interface:

```ts twoslash
interface GenericIdentityFn {
  <Type>(arg: Type): Type;
}

function identity<Type>(arg: Type): Type {
  return arg;
}

let myIdentity: GenericIdentityFn = identity;
```

In a similar example, we may want to move the generic parameter to be a parameter of the whole interface.
This lets us see what type(s) we're generic over (e.g. `Dictionary<string>` rather than just `Dictionary`).
This makes the type parameter visible to all the other members of the interface.

```ts twoslash
interface GenericIdentityFn<Type> {
  (arg: Type): Type;
}

function identity<Type>(arg: Type): Type {
  return arg;
}

let myIdentity: GenericIdentityFn<number> = identity;
```

Notice that our example has changed to be something slightly different.
Instead of describing a generic function, we now have a non-generic function signature that is a part of a generic type.
When we use `GenericIdentityFn`, we now will also need to specify the corresponding type argument (here: `number`), effectively locking in what the underlying call signature will use.
Understanding when to put the type parameter directly on the call signature and when to put it on the interface itself will be helpful in describing what aspects of a type are generic.

In addition to generic interfaces, we can also create generic classes.
Note that it is not possible to create generic enums and namespaces.

## Generic Classes

A generic class has a similar shape to a generic interface.
Generic classes have a generic type parameter list in angle brackets (`<>`) following the name of the class.

```ts twoslash
// @strict: false
class GenericNumber<NumType> {
  zeroValue: NumType;
  add: (x: NumType, y: NumType) => NumType;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function (x, y) {
  return x + y;
};
```

This is a pretty literal use of the `GenericNumber` class, but you may have noticed that nothing is restricting it to only use the `number` type.
We could have instead used `string` or even more complex objects.

```ts twoslash
// @strict: false
class GenericNumber<NumType> {
  zeroValue: NumType;
  add: (x: NumType, y: NumType) => NumType;
}
// ---cut---
let stringNumeric = new GenericNumber<string>();
stringNumeric.zeroValue = "";
stringNumeric.add = function (x, y) {
  return x + y;
};

console.log(stringNumeric.add(stringNumeric.zeroValue, "test"));
```

Just as with interface, putting the type parameter on the class itself lets us make sure all of the properties of the class are working with the same type.

As we cover in [our section on classes](/docs/handbook/2/classes.html), a class has two sides to its type: the static side and the instance side.
Generic classes are only generic over their instance side rather than their static side, so when working with classes, static members can not use the class's type parameter.

## Generic Constraints

If you remember from an earlier example, you may sometimes want to write a generic function that works on a set of types where you have _some_ knowledge about what capabilities that set of types will have.
In our `loggingIdentity` example, we wanted to be able to access the `.length` property of `arg`, but the compiler could not prove that every type had a `.length` property, so it warns us that we can't make this assumption.

```ts twoslash
// @errors: 2339
function loggingIdentity<Type>(arg: Type): Type {
  console.log(arg.length);
  return arg;
}
```

Instead of working with any and all types, we'd like to constrain this function to work with any and all types that *also*  have the `.length` property.
As long as the type has this member, we'll allow it, but it's required to have at least this member.
To do so, we must list our requirement as a constraint on what `Type` can be.

To do so, we'll create an interface that describes our constraint.
Here, we'll create an interface that has a single `.length` property and then we'll use this interface and the `extends` keyword to denote our constraint:

```ts twoslash
interface Lengthwise {
  length: number;
}

function loggingIdentity<Type extends Lengthwise>(arg: Type): Type {
  console.log(arg.length); // Now we know it has a .length property, so no more error
  return arg;
}
```

Because the generic function is now constrained, it will no longer work over any and all types:

```ts twoslash
// @errors: 2345
interface Lengthwise {
  length: number;
}

function loggingIdentity<Type extends Lengthwise>(arg: Type): Type {
  console.log(arg.length);
  return arg;
}
// ---cut---
loggingIdentity(3);
```

Instead, we need to pass in values whose type has all the required properties:

```ts twoslash
interface Lengthwise {
  length: number;
}

function loggingIdentity<Type extends Lengthwise>(arg: Type): Type {
  console.log(arg.length);
  return arg;
}
// ---cut---
loggingIdentity({ length: 10, value: 3 });
```

## Using Type Parameters in Generic Constraints

You can declare a type parameter that is constrained by another type parameter.
For example, here we'd like to get a property from an object given its name.
We'd like to ensure that we're not accidentally grabbing a property that does not exist on the `obj`, so we'll place a constraint between the two types:

```ts twoslash
// @errors: 2345
function getProperty<Type, Key extends keyof Type>(obj: Type, key: Key) {
  return obj[key];
}

let x = { a: 1, b: 2, c: 3, d: 4 };

getProperty(x, "a");
getProperty(x, "m");
```

## Using Class Types in Generics

When creating factories in TypeScript using generics, it is necessary to refer to class types by their constructor functions. For example,

```ts twoslash
function create<Type>(c: { new (): Type }): Type {
  return new c();
}
```

A more advanced example uses the prototype property to infer and constrain relationships between the constructor function and the instance side of class types.

```ts twoslash
// @strict: false
class BeeKeeper {
  hasMask: boolean = true;
}

class ZooKeeper {
  nametag: string = "Mikle";
}

class Animal {
  numLegs: number = 4;
}

class Bee extends Animal {
  keeper: BeeKeeper = new BeeKeeper();
}

class Lion extends Animal {
  keeper: ZooKeeper = new ZooKeeper();
}

function createInstance<A extends Animal>(c: new () => A): A {
  return new c();
}

createInstance(Lion).keeper.nametag;
createInstance(Bee).keeper.hasMask;
```

该模式得利于 [mixins](/docs/handbook/mixins.html) 设计模式。
