---
title: Generics
layout: docs
permalink: /zh/docs/handbook/2/generics.html
oneline: 接收参数的类型
---

软件工程的一个主要部分是构建组件，这些组件不仅具有定义良好且一致的 API，而且还具有可重用性。
那些既可以处理现在的数据，也可以处理将来的数据的组件，使您在构建大型软件系统时灵活自如。

在类似 C# 和 Java 的语言中，创建可复用性组件的一大法宝就是 _泛型_，也就是说，能够创建可以在多种类型而非单一类型上工作的组件。
它允许用户可以按照他们自己的类型使用这些组件。
## 泛型 Hello World

首先，让我们通过 identity 函数做一个泛型的 「hello world」：
identity 函数是一个返回传入内容的函数。
您可以将其想象为类似 `echo` 命令的方法。

没有泛型的情况下，我们可能必须要给这个 `identity` 函数指定类型：

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

我们要是想每次调用时，把参数 `arg` 的长度达打印到控制台会怎样？
我们暂且这样写：

```ts twoslash
// @errors: 2339
function loggingIdentity<Type>(arg: Type): Type {
  console.log(arg.length);
  return arg;
}
```

当我们这样写，编译器将会给我们报错，说我们正在使用 `arg` 的 `.length` 成员，但是我们并没有说过 `arg` 上有该成员。
请记住，我们之前说过，这些类型变量表示 any 和全部的类型，因此使用此函数的人可能会传入一个没有 `.length` 成员的 `number`。

我们说，我们实际上打算这个函数在 `Type` 数组上工作，而非直接在 `Type`。由于我们使用的是数组，所以才应该有 `.length` 成员。

我们可以像我们将创建其他类型的数组那样描述它：

```ts twoslash {1}
function loggingIdentity<Type>(arg: Type[]): Type[] {
  console.log(arg.length);
  return arg;
}
```

我们可以把 `loggingIdentity` 的类型理解成 「泛型函数 `loggingIdentity` 接收一个类型参数 `Type`，以及一个参数 `arg`, 该参数是一个以 `Type` 为元素的数组类型，然后返回值是 `Type` 数组」。

我们如果传递一个数字数组，我们将得到一个数字数组返回，因为 `Type` 被绑定为 `number`。

这使得我们可以使用类型变量 `type` 作为我们正在处理的类型中的一部分，而不是整个类型，给了我们更大的灵活性。

我们也可以这样编写示例：

```ts twoslash {1}
function loggingIdentity<Type>(arg: Array<Type>): Array<Type> {
  console.log(arg.length); // Array has a .length, so no more error
  return arg;
}
```

这样的类型样式您可能在别的语言中似曾相识。
下一章节，我们将介绍如何创建一个您自己的一个像 `Array<Type>` 这样的泛型。

## 泛型类型

在上一章节中，我们创建了一个泛型函数 `identity`，它适用于一系列类型。
本章节我们将探索函数自身的类型，以及如何创建泛型接口。

泛型函数的类型就和那些非泛型函数差不多，首先列出类型参数，就好像声明一个函数：

```ts twoslash
function identity<Type>(arg: Type): Type {
  return arg;
}

let myIdentity: <Type>(arg: Type) => Type = identity;
```

我们也可能在为泛型的类型参数使用不同的名称，只要类型变量的个数与类型变量实际使用的一致即可。

```ts twoslash
function identity<Type>(arg: Type): Type {
  return arg;
}

let myIdentity: <Input>(arg: Input) => Input = identity;
```

我们也可以将泛型类型签名，写成对象字面量那样：

```ts twoslash
function identity<Type>(arg: Type): Type {
  return arg;
}

let myIdentity: { <Type>(arg: Type): Type } = identity;
```

这让我们开始编写第一个泛型接口。
让我们来从上面例子中提取对象字面量，在将其移至一个接口上：

```ts twoslash
interface GenericIdentityFn {
  <Type>(arg: Type): Type;
}

function identity<Type>(arg: Type): Type {
  return arg;
}

let myIdentity: GenericIdentityFn = identity;
```

在类似的示例中，我们可能希望将泛型参数移动为整个接口的参数。

这让我们可以看到我们的泛型是什么类型（例如，`Dictionary<string>` 而不仅仅是 `Dictionary`）。

这使类型参数对接口的所有其他成员可见。

```ts twoslash
interface GenericIdentityFn<Type> {
  (arg: Type): Type;
}

function identity<Type>(arg: Type): Type {
  return arg;
}

let myIdentity: GenericIdentityFn<number> = identity;
```

请注意，我们对示例稍微做了点改动。

我们现在没有描述泛型函数，而是有一个非泛型函数签名，它是泛型类型的一部分。

当我们使用 `GenericIdentityFn`，我们现在还要指定对应类型的参数（这里是：`number`），这有效的限定了底层调用签名将使用的内容。
理解何时将类型参数直接放在调用签名上，以及何时放在接口它本身上，这将有助于描述类型的那个方面是泛型的。

除了泛型接口，我们还可以创建泛型类。
请注意，不能创建泛型枚举和命名空间。

## 泛型类

泛型类形似泛型接口。
泛型类在类名称后面的尖括号 `<>` 内，有一个通用类型参数列表。

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
这是对 `GenericNumber` 类的一种相当字面的用法，但是您可能已经注意到，并没有限制它只能使用 `number` 类型。

我们还可以使用 `string` 又或者其他更多复杂的对象。

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

和使用接口一样，给类其本身传类型参数，可以确保类的所有属性都使用相同的类型。

正如我们在 [关于类的章节](/docs/handbook/2/classes.html) 中所述，一个类它的类型分两个方面：静态方面和实例方面。

泛型类只适用于它们的实例方面而没有使用静态方面，所以当使用类时，静态成员就不能使用类的类型参数。

## 泛型限制

如果您还记得前面的一个示例，那么您有时可能希望编写一个通用函数，该函数可以在一组类型上工作，您对该组类型将具有的功能有一些了解。
在我们的 `loggingIdentity` 示例中，我们希望能够访问 `arg` 的 `.length` 属性，但编译器无法证明每个类型都有一个 `.length` 属性，因此它警告我们不能这样假设。

```ts twoslash
// @errors: 2339
function loggingIdentity<Type>(arg: Type): Type {
  console.log(arg.length);
  return arg;
}
```

我们不想使用任意和全部类型，而是寄希望于约束这个函数，让其可以使用任何和全部，同时**还**需要有 `.length` 属性。
只要类型有这个成员，我们就允许使用它，但至少是改成员是必须的。

要做到这一点，我们必须将我们的需求列为 `类型` 的约束条件。

为此，我们将创建一个描述约束的接口。
在这里，我们将创建一个具有单个 `.length` 属性的接口，然后使用此接口和 `extends` 关键字来表示我们的约束：

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

相反，我们需要传入其类型具有所有必需属性的值：

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

## 在泛型约束中使用类型参数

可以声明受其他类型参数约束的类型参数。

例如，这里我们希望从给定名称的对象中获取属性。

我们希望确保不会意外获取 `obj` 上不存在的属性，因此我们将在这两种类型之间放置一个约束：

```ts twoslash
// @errors: 2345
function getProperty<Type, Key extends keyof Type>(obj: Type, key: Key) {
  return obj[key];
}

let x = { a: 1, b: 2, c: 3, d: 4 };

getProperty(x, "a");
getProperty(x, "m");
```

## 在泛型中使用 class 类型

当在 TypeScript 中使用泛型创建一个工厂函数，必须用 class 的构造函数引用到 class 的类型。比如，

```ts twoslash
function create<Type>(c: { new (): Type }): Type {
  return new c();
}
```

更高级的示例，使用 prototype 属性来推断和约束构造函数和类类型的实例端之间的关系。

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
