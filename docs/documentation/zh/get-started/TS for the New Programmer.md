---
title: 面向编程初学者的 TypeScript
short: 面向编程初学者的 TS
layout: docs
permalink: /zh/docs/handbook/typescript-from-scratch.html
oneline: 从零开始学习 TypeScript
---

恭喜你选择 TypeScript 作为第一门编程语言 —— 你已经做出了明智的决定！

或许你已经听说 TypeScript 是 JavaScript 的“调味料”或“变体”。在现代编程语言中，TypeScript（TS）和 JavaScript（JS）之间的关系相当独特，因此进一步了解这种关系，将帮助你了解如何把 TypeScript 添加到 JavaScript 中。

## 什么是 JavaScript? 一段简史

JavaScript（也称为ECMAScript）诞生时是一种简单的浏览器脚本语言。当它被发明时，它被期望用于网页中嵌入的简短代码片段。这些片段通常不超过几十行。因此，早期的 Web 浏览器执行此类代码的速度非常慢。但是，随着时间的流逝，JS 变得越来越流行，并且 Web 开发者开始使用它来创造交互式体验。

Web 浏览器开发者通过优化执行引擎（动态编译）和扩展可以完成的功能（添加API）来应对 JS 日益增加的使用量，这反过来又使 Web 开发者更多地使用 JS。在现代网站上，你的浏览器经常运行超过数十万行代码的应用程序。这是“网络”的长期而渐进的发展，从一个简单的静态页面网络开始，逐渐演变成一个用于各种丰富 _应用程序_ 的平台。

不仅如此，JS已经变得足够流行，以至于可以在浏览器环境之外使用。例如用 node.js 实现 JS 服务器。JS “随处运行”的特性使其成为跨平台开发的颇具吸引力的选择。如今，有许多开发者 _只_ 使用 JavaScript 便可完成全栈编程！

总之，我们有一种专为快速使用而设计的语言，后来发展为功能强大的工具，可以编写具有数百万行的应用程序。每种语言都有它的 _怪异之处_， 令人感到古怪或者惊异。JavaScript 略显简陋的开端使得它有 _很多_ 个怪异之处。 一些例子：


- JavaScript的等于运算符（`==`）_强制_ 其参数，导致意外行为： 

  ```js
  if ("" == 0) {
    // 他们相等！但是为什么呢？？
  }
  if (1 < x < 3) {
    // x是 *任何* 值都为真！
  }
  ```

- JavaScript 还允许访问不存在的属性：

  ```js
  const obj = { width: 10, height: 15 };
  // 为什么是 NaN？拼写好难！
  const area = obj.width * obj.heigth;
  ```

大多数编程语言会在发生此类错误时抛出错误提示，有些会在编译期间（在任何代码运行之前）这样做。在编写小型程序时，这种诡异表现很烦人，但很容易管理。 当编写具有成百上千行代码的应用程序时，这些源源不断的惊喜将是一个严重的问题。

## TypeScript: 静态类型检查器

前面我们提到，一些语言根本不允许那些错误的程序运行。在不运行代码的情况下检测其中的错误称为 _静态检查_ 。根据被操作的值的种类来确定是什么错误和什么不是错误，这称为静态 _类型_ 检查。

TypeScript 在执行之前，基于 _值的类型_ 检查程序是否有错误。它是 _静态类型检查器_。例如，基于 `obj` 的 _类型_，TypeScript 在上面的最后一个示例中发现了一个错误：

```ts twoslash
// @errors: 2551
const obj = { width: 10, height: 15 };
const area = obj.width * obj.heigth;
```

### JavaScript 的类型化超集

不过，TypeScript 与 JavaScript 是什么关系呢？

#### 语法

TypeScript 是 JavaScript 的 _超集_ ：因此 JS 语法是合法的 TS。语法是指我们编写文本以组成程序的方式。例如，这段代码有一个 _语法_ 错误，因为它缺少一个 `）`：

```ts twoslash
// @errors: 1005
let a = (4
```

TypeScript 不会将任何 JavaScript 代码视为错误。这意味着你可以将任何有效的 JavaScript 代码放在 TypeScript 文件中，而不必担心它的确切编写方式。

#### 类型

但是，TypeScript 是一个 _类型化_ 的超集，意味着它添加了针对如何使用不同类型的值的规则。之前关于 `obj.heigth` 的错误不是 _语法_ 错误，而是以不正确的方式使用了某种值（ _类型_ ）。

再举一个例子，这段 JavaScript 代码可以在浏览器中运行，它 _会_ 打印一个值：

```js
console.log(4 / []);
```

该语法合法的程序打印出 `Infinity` 。但是，TypeScript 认为将数字除以数组是无意义的操作，并且会报错：

```ts twoslash
// @errors: 2363
console.log(4 / []);
```

你可能 _真的_ 想将数字除以数组，也许只是想看看会发生什么，但是在大多数时候，这是编程错误。TypeScript 的类型检查器旨在允许正确的程序通过，同时仍然捕获尽可能多的常见错误。（稍后，我们将学习如何配置 TypeScript，从而控制检查代码的严格程度。）

如果将某些代码从 JavaScript 文件移动到 TypeScript 文件，可能会出现 _类型错误_ ，具体取决于代码的编写方式。这些或许是代码真实存在的问题，或者 TypeScript 过于保守。在本指南中，我们将演示如何增添各种 TypeScript 语法来消除此类错误。

#### 运行时行为 

TypeScript 保留了 JavaScript 的 _运行时行为_ 。例如，在JavaScript 中被零除的结果是 `Infinity`，而不是抛出运行时异常。原则上，TypeScript **绝不** 改变 JavaScript 代码的运行时行为。

这意味着，如果将代码从 JavaScript 迁移到 TypeScript ，即使 TypeScript 认为代码有类型错误，也可以 **保证** 以相同的方式运行。

保持与 JavaScript 运行时行为相同是 TypeScript 的基本承诺。因为这意味着你可以轻松地在两种语言之间转换，而不必担心一些细微差别可能会使程序停止工作。

<!--
Missing subsection on the fact that TS extends JS to add syntax for type
specification.  (Since the immediately preceding text was raving about
how JS code can be used in TS.)
-->

#### 擦除类型

粗略地说，一旦 TypeScript 的编译器完成了检查代码的工作，它就会 _擦除_ 类型以生成最终的“已编译”代码。这意味着一旦您的代码被编译，生成的普通 JS 代码便没有类型信息。

这也意味着 TypeScript 绝不会根据它推断的类型更改程序的 _行为_ 。最重要的是，尽管您可能会在编译过程中看到类型错误，但类型系统自身与程序如何运行无关。

最后，TypeScript 不提供任何额外运行时库。你的程序会使用与 JavaScript 程序相同的标准库（或外部库）。因此你不需要学习其他专属于 TypeScript 的框架。

<!--
Should extend this paragraph to say that there's an exception of
allowing you to use newer JS features and transpile the code to an older
JS, and this might add small stubs of functionality when needed.  (Maybe
with an example --- something like `?.` would be good in showing readers
that this document is maintained.)
-->

## 学习 JavaScript 和 TypeScript

我们经常看到这样的问题：“我该学习 JavaScript 还是 TypeScript？”。

答案是，不学习 JavaScript，就无法学习 TypeScript！TypeScript 共用了 JavaScript 的语法和运行时行为。因此，对JavaScript 的任何了解都可以帮助你学习 TypeScript 。

程序员可以使用很多很多资源来学习 JavaScript 。如果你正在编写 TypeScript，_不应该_ 忽略这些资源。例如，带有 `javascript` 标签的 StackOverflow 问题大约比 `typescript` 标签的多20倍，但是 _所有_ `javascript`问题也适用于 TypeScript 。

如果你正在搜索“如何在 TypeScript 中对列表进行排序”之类的内容，请记住： **TypeScript 是带有编译时类型检查器的 JavaScript 运行时** 。在 TypeScript 中对列表进行排序的方式与在 JavaScript 中相同。如果你找到直接使用 TypeScript 的资源，那也很好，但解决运行时任务的日常问题时，不要局限地认为你需要特定于 TypeScript 的答案。

## 下一步

以下是 TypeScript 中常用语法和工具的简要介绍。在这里，你可以：

- 学习一些 JavaScript 基础知识 （[Mozilla Web Docs 的 JavaScript 指南 ](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide) 是个不错的开始）
- 继续阅读 [JavaScript 程序员的 TypeScript](/docs/handbook/typescript-in-5-minutes.html)
- 阅读完整手册 [从头至尾](/docs/handbook/intro.html) (30m)
- 探索 [游乐场示例](/play#show-examples)

<!-- Note: I'll be happy to write the following... -->
<!--
## Types

    * What's a type? (For newbies)
      * A type is a *kind* of value
      * Types implicitly define what operations make sense on them
      * Lots of different kinds, not just primitives
      * We can make descriptions for all kinds of values
      * The `any` type -- a quick desctiption, what it is, and why it's bad
    * Inference 101
      * Examples
      * TypeScript can figure out types most of the time
      * Two places we'll ask you what the type is: Function boundaries, and later-initialized values
    * Co-learning JavaScript
      * You can+should read existing JS resources
      * Just paste it in and see what happens
      * Consider turning off 'strict' -->
