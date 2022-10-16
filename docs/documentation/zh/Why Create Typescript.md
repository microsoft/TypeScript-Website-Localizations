---
title: 为何要创建 TypeScript
layout: docs
permalink: /zh/why-create-typescript.html
oneline: 为何要创建 TypeScript
translatable: true
---

TypeScript 是由 MicroSoft 公司创建的一门基于 JavaScript 的语言。这篇文章是关于 JavaScript 是什么，TypeScript 如何扩展 JavaScript 以及 TypeScript 解决了哪些问题的非技术概述。

## JavaScript 是什么？

因为 TypeScript 扩展了 JavaScript，所以这是一个很好的起点。JavaScript通常会用于创建网站。当创建一个网站时，你使用三种语言编写: HTML、CSS 和 JavaScript(JS)。总体来讲，HTML 定义了页面显示的内容，CSS 定义了页面的样式，JS 则定义了页面的交互行为。

我们称拥有这些技能的为"前端"开发人员。你可以使用这三门语言在浏览器里面创建页面，比如Safari、Firefox、Edge、或者 Chrome。由于 web 在商业和信息共享中非常流行，所以对于擅长使用这三门语言的开发人员有大量的市场需求。

与"前端"开发角色相关的是"后端"开发人员的一组技能，这些技能是创建与 Web 浏览器通信的计算机后端服务（通过传递 HTML/CSS/JS）或者到另一个计算机服务（通过更直接地发送数据）。你无需使用 HTML、CSS 或 JS 来编写这种类型的代码，但它通常是你工作的最终结果，因为它恰好会展示在网页浏览器中。

## 编程语言是做什么的？

编程语言是人类和计算机之间交流的一种方式。人们阅读代码的时间要比编写代码的时间多很多 —— 因此开发人员创建了擅长用少量代码解决特定问题的编程语言。这是一个使用 JavaScript 的示例：

```shell
var name = "Danger"
console.log("Hello, " + name)
```

第一行创建了一个变量（实际上是一个可以存储其他数据的容器），然后第二行将文本输出至控制台（例如在 DOS 或终端窗口）`"Hello, Danger"`。

JavaScript 被设计为一种脚本语言进行工作，这意味着代码从文件头部开始，然后逐行向下运行该代码。为了提供一些对照，下面用 Java 来实现相同的行为功能，它用不同的语言约束进行构建：

```shell
class Main {
  public static void main(String[] args) {
    String name = "Danger";
    System.out.println("Hello, " + name);
  }
}
```

这两种代码示例做了同样的事情，但是 Java 示例带有很多不明确告诉计算机做什么的内容，例如 `class Main {`，`public static void main(String[] args) {`，还有两个额外花括号`}`。它还在某些代码的末尾有分号。这些编程语言都没有错，Java 旨在构建与 JavaScript 不同的东西，这些额外的代码在构建 Java 应用的约束下是有意义的。

为了理解关键点，我们可以重点比较这突出的一行：

```shell
// JavaScript
var name = "Danger"

// Java
String name = "Danger";
```

这两行代码都声明了一个名为 `name` 的变量，包含了一个 `"Danger"` 的值。

在 JavaScript 中，你使用缩写 `var` 来声明变量。同时，在 Java 中，你需要声明变量包含的数据类型。在这个例子中是包含了一个 `String` 类型的变量。（string 是字符集合的编程术语。它们`看起来像'这个'`。如果你想了解更多，这个 [5分钟视频](https://www.youtube.com/watch?v=czTWbdwbt7E) 是一个很好的入门方式。）

这两个变量都包含一个 string 类型数据，但不同的是，在 Java 中该变量只能包含一个字符串，因为这是我们在创建变量时所定义的。在 JS 中，变量可以更改为任何值，比如数字或日期列表。

请看：

```shell
// Before in JS
var name = "Danger"
// Also OK
var name = 1
var name = false
var name = ["2018-02-03", "2019-01-12"]

// Before in Java
String name = "Danger";
// Not OK, the code wouldn't be accepted by Java
String name = 1;
String name = false
String name = new String[]{"2018-02-03", "2019-01-12"};
```

这些权衡差异放在 1995 年创建这些语言时的大背景下是有意义的。JavaScript 最初被设计为一种用于处理网站内简单交互的轻量级编程语言。Java 则是专门为开发可以在任何计算机上运行的复杂应用程序而创建的。它们被用在构建不同规模的代码库中，因此需要程序员编写不同类型的代码。

Java 要求程序员对其变量值更加明确，因为他们希望构建的程序更加复杂。而 JavaScript 通过省略细节信息来选择易读性的提升，并且预期代码库要小得多。

## 什么是 TypeScript？

TypeScript 是一门编程语言 —— 它包含所有的 JavaScript，并且还有更多的语法功能。使用我们上面的示例，来比较 "Hello, Danger" 这个脚本在 JavaScript 和 TypeScript 中的差异：

```shell
// JavaScript
var name = "Danger"
console.log("Hello, " + name)

// TypeScript
var name = "Danger"
console.log("Hello, " + name)

// Yep, you're not missing something, there's no difference
```

由于 TypeScript 的目标是仅扩展 JavaScript，因此我们看到当前的 JavaScript 代码同样可以在 TypeScript 中运行。TypeScript 为 JavaScript 的扩展旨在帮助你更明确地知道代码中使用了什么类型的数据，有点像 Java。

这个是相同的示例，但使用 TypeScript 来更明确地定义变量是什么类型：

```shell
var name: string = "Danger"
console.log("Hello, " + name)
```

这个额外的 `: string` 让开发者可以确定 `name` 只能是一个字符串类型数据。以这种方式标明变量也让 TypeScript 有机会验证它们是否匹配。这非常有用，因为跟踪变量值的类型变化在一个或者两个时看起来很容易，但是一旦它开始达到数百个，就需要跟踪很多。编写类型有助于程序员对他们的代码更有信心，因为类型系统会捕获错误。

简单来说，我们称这些标注为"类型系统"。因此命名为 _Type_ Script。TypeScript 的口号之一是"可扩展的 JavaScript"，它声明这些额外的类型标注可以帮助你开发更大的项目。这是因为您可以预先验证代码的正确性。这意味着你可以更少关注每一次修改代码是否会对代码其他部分造成影响。

在 90 年代，或许直到 5-10 年前，在 JavaScript 应用程序中没有类型系统是没问题的，因为当前创建的应用程序无论在大小还是复杂性方面都仅限于网站的前端部分。然而今天，JavaScript 几乎在任何地方都会使用，几乎可以构建在计算机上运行的任何应用。大量移动端和桌面应用程序都在使用 JavaScript 和 Web 技术。

这些项目在创建和理解时都相当复杂，添加类型系统大大降低了对这些应用程序进行修改的复杂性。

## TypeScript 能解决什么问题？

通常，可以通过编写自动化测试来确保你的代码中没有错误，然后手动验证代码是否按你的预期工作，最后让另一个人验证它是否正确。

像微软这种规模的公司并不多，但是在大型代码库中编写 JavaScript 的许多问题都是相同的。许多 JavaScript 应用程序由成百上千个文件组成。对单个文件的更改可能会影响其他很多文件的代码，就像将一块鹅卵石扔进池塘会导致涟漪扩散到岸边。

验证项目中每个部分之间的关系是很耗时的，使用 TypeScript 等类型检查语言可以自动处理并在开发过程中提供即时反馈。

TypeScript 的这些功能可以帮助开发人员对他们的代码更有信心，并节省大量时间来验证他们没有意外影响项目。
