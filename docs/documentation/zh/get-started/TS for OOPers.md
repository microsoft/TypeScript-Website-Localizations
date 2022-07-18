---
title: 为 Java/C# Programmers 准备的 TypeScript
short: 为 Java/C# Programmers 准备的 TS
layout: docs
permalink: /zh/docs/handbook/typescript-in-5-minutes-oop.html
oneline: 如果你有面向对象语言的背景，请学习 TypeScript
---

对于习惯于使用静态类型的其他语言（如 C# 和 Java）的程序员来说，TypeScript 是一个很受欢迎的选择。

TypeScript 的类型系统也提供了许多相同的优点，比如更好的代码补全、更早的错误检测以及程序各部分之间更清晰的通信。
虽然 TypeScript 为这些开发人员提供了许多熟悉的特性，但有必要来看看 JavaScript（以及TypeScript）与传统的 OOP 语言有何不同。
了解这些差异将有助于你编写更好的 JavaScript 代码，并避免程序员直接从 Java/C# 转向 TypeScript 时可能陷入的常见陷阱。

## 一起学习 JavaScript

如果你已经熟悉 JavaScript，但主要是 Java 或 C# 程序员，这个介绍页面可以帮助您解释一些常见的误解和陷阱，你可能容易受到它们的影响。
TypeScript 组织类型的一些方式与 Java 或 C# 有很大的不同，在学习 TypeScript 时记住这些是很重要的。

如果你是一个 Java 或 C# 程序员，对 JavaScript 不熟悉，我们建议你先学习一点 JavaScript ，以理解JavaScript 的运行时行为。
因为 TypeScript 不会改变你的代码的运行方式，所以你仍然需要学习 JavaScript 是如何工作的，这样才能编写出真正有意义的代码!

一定要记住 TypeScript 和 JavaScript 使用相同的_运行环境_，所以任何关于如何完成特定运行时行为的资源(将字符串转换为数字、显示警告、将文件写入磁盘等)都同样适用于 TypeScript 程序。
不要把自己局限于 TypeScript 的资源。

## 重新思考类的概念

C# 和 Java 可能会被我们称为 _强制的 OOP_ 语言。
在这些语言中，_class_ 是代码组织的基本单位，也是运行时所有数据_和_行为的基本容器，强制所有功能和数据都保存在类中，对于某些问题，可以是一个很好的领域模型。但并不是每个领域都需要这样表示。

### 自由的函数和数据

在 JavaScript 中，函数可以存在于任何地方，数据可以自由传递，而不需要在预定义的内部的 `class` 或者 `struct` 当中。
这种灵活性是极其强大的。
在没有隐去 OOP 层次结构的情况下，处理数据的“自由”函数（那些与类无关的函数）往往是用JavaScript 编写程序的首选模型。

### 静态类

此外，C# 和 Java 中的某些构造，如单例和静态类，在 TypeScript 中是不必要的。

## TypeScript 中的 OOP

也就是说，如果你愿意，你仍然可以使用类！有些问题很适合用传统的 OOP 层次结构来解决，而 TypeScript 对 JavaScript 类的支持将使这些模型更加强大。TypeScript 支持许多常见的模式，如实现接口、继承、和静态方法。

我们将在本指南后面提及类的有关内容。

## 重新思考类型的概念

TypeScript 对 _类型_ 的理解实际上与 C# 或 Java 有很大的不同，让我们来探讨一些区别。

### 名义上的具体的类型系统

在 C# 或 Java 中，任何给定的值或对象都有一个精确的类型—— `null`、基本类型或已知的类类型。
我们可以调用 `value.GetType()`或 `value.getClass()` 这样的方法来在运行时查询确切的类型。
这种类型的定义将保留在某个类中，除非存在显式继承关系或共同实现的接口，否则我们不能使用具有相似结构（shape）的两个类来代替彼此。

这些描述了“名义上的具体的类型系统”。
我们在代码中编写的类型在运行时存在，类型是通过它们的声明而不是它们的结构来关联的。

### 把类型视作集合

在 C# 或 Java 中，考虑运行时类型与其编译时声明之间的一一对应是有意义的。

在 TypeScript 中，最好把类型看作是共享某些共同东西的值的集合。因为类型只是集合，所以特定的值可以同时属于一些集合。

一旦你开始把类型看作集合，某些操作就会变得非常自然。例如，在 C# 中，传递一个值是既可以是`string` 类型也可以是 `int` 类型是很尴尬的，因为没有一个类型代表这种值。

在 TypeScript 当中，一旦你意识到每个类型都只是一个集合，这就变得非常自然了。你如何描述一个属于 `string` 集合或 `number` 集合的值？它只是属于这些集合的并集 ：`string | number`。

TypeScript 提供了许多以集合论方式处理类型的机制，如果将类型视为集合，你会发现它们更直观。

### 擦除的结构类型（Erased Structral Type）

在 TypeScript 中，对象不是单一的、精确的类型。例如，如果我们构造一个符合接口的对象，我们可以在使用接口的地方使用对象，即使两者之间没有声明关系。

```ts twoslash
interface Pointlike {
  x: number;
  y: number;
}
interface Named {
  name: string;
}

function logPoint(point: Pointlike) {
  console.log("x = " + point.x + ", y = " + point.y);
}

function logName(x: Named) {
  console.log("Hello, " + x.name);
}

const obj = {
  x: 0,
  y: 0,
  name: "Origin",
};

logPoint(obj);
logName(obj);
```

TypeScript 的类型系统是 _structral_ 的，而不是名义上的： 我们可以将 `obj` 用作 `Pointlike`，因为它具有 `x` 和 `y` 属性，这两个属性都是数字。
类型之间的关系取决于它们所包含的属性，而不是它们是否以某种特定关系的声明。

TypeScript 的类型系统也是不具体的：运行时没有任何东西可以告诉我们 `obj` 是 `Pointlike`。
实际上 `Pointlike` 类型不存在于任何形式当中。

回到类型视作集合的想法上面，我们可以想到 `obj` 是`Pointlike`集合和 `Named` 集合的成员。

### 结构类型的结果

OOP 程序员经常对结构类型的两个特殊方面感到惊讶。

#### 空类型（Empty Type）

首先， 空类型似乎违背了预期：

```ts twoslash
class Empty {}

function fn(arg: Empty) {
  // 好像什么都没做？
}

// 没有错误，但似乎不是空的?
fn({ k: 10 });
```

TypeScript 通过查看所提供的参数是否为有效的 `Empty` 来确定此处对 `fn` 的调用是否有效。
它通过检查 `{ k: 10 }` 和 `class Empty { }` 是否具有相同的结构来实现这一目标。
我们可以看到 `{ k: 10 }` 有 `Empty` 的所有属性，因为 `Empty` 没有属性。
因此，这是一个有效的调用！

这似乎令人惊讶，但最终它与名义上的 OOP 语言中强制实施的关系非常相似。
子类不能移除其基类的属性，因为这样做会破坏派生类和基类之间的自然子类型关系。
结构类型系统只是通过描述子类型具有兼容类型的属性来隐式地识别这种关系。

#### 相同类型

另一个经常出现的惊讶来源是相同的类型：

```ts
class Car {
  drive() {
    // 踩油门
  }
}
class Golfer {
  drive() {
    // 把球打得很远
  }
}

// 没有错误吗？
let w: Car = new Golfer();
```

同样，这不是一个错误，因为这些类的结构是相同的。虽然这看起来可能是一个潜在的混乱来源，但在实践中，不相关的相同类并不常见。

我们将在“类”一章中了解有关类之间如何相互关联的更多信息。

### 反射

OOP 程序员习惯于能够查询任何值的类型，甚至是泛型的类型：

```csharp
// C#
static void LogType<T>() {
    Console.WriteLine(typeof(T).Name);
}
```

由于 TypeScript 的类型系统被完全擦除，因此有关泛型类型参数的实例化的信息在运行时不可用。

JavaScript确实有一些有限的原始运算符，如 `typeof` 和 `instanceof` ，但请记住，这些运算符输出的是类型擦除后存在的值。
例如，`typeof (new Car())` 将是 `"object"` 而不是 `Car` 或者 `"Car"`。

## 下一步

这是对日常使用 TypeScript 的语法和工具的简要概述。从这里，您可以：

- 阅读完整手册[由始至终](/docs/handbook/intro.html)（30 分钟）
- 探索 [Playground 示例](/play#show-examples)
