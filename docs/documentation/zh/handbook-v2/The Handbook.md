---
title: The TypeScript Handbook
layout: docs
permalink: /zh/docs/handbook/intro.html
oneline: 初探 TypeScript
handbook: "true"
---

## 关于这本手册

JavaScript 被引入编程社区 20 多年后，现在已成为有史以来最广泛使用的跨平台语言之一。JavaScript 最初是一种小型脚本语言，用于为网页添加零星的交互性，现在已成为各种规模的前端和后端应用程序的首选语言。随着使用 JavaScript 编写的程序的规模、领域和复杂度指数级增长，其根本不具备能力来表达不同单元代码之间的相关性。再加上 JavaScript 特有的运行时语义，这种语言与程序复杂性之间的不搭调，让 JavaScript 的开发成为了难以进行大规模管理的任务。

程序员写代码最典型的错误可以称为类型错误：一个明确类型的值被用在了期望是别的类型的值的地方。这可能只是一个简单的打字疏误，对库外层 API 的误解，对运行时行为的不当猜测，抑或别的错误。TypeScript 的目的就是成为 JavaScript 程序的静态类型检查器 - 换而言之，是一个在您的代码运行（静态的）之前运行的，以确保程序的类型时正确的工具（已类型检查的）。

如果您是在没有 JavaScript 背景下接触 TypeScript 的，意图让 TypeScript 成为您的第一个开发语言，我们推荐您首先阅读这些文档 [Microsoft Learn JavaScript tutorial](https://docs.microsoft.com/javascript/) 或者 [JavaScript at the Mozilla Web Docs](https://developer.mozilla.org/docs/Web/JavaScript/Guide)。
如果您有其他语言的开发经验，您应该通过阅读本手册就能来非常快速地掌握 JavaScript 语法

## 本操作手册的结构

本操作手册分为两个章节：

- **手册**

  TypeScript 手册有意作为一份综合性的文档，来向日常程序员们解释 TypeScript。您可以在左侧导航栏中从上到下阅读手册。

  你应该期望每一章或每一页都能让你对给定的概念有一个深刻的理解。TypeScript 手册不是一个完整的语言规范，但它旨在全面指导语言的所有特性和行为。

  完成演练的读者应能够：

  - 阅读并理解常用的 TypeScript 语法和模式
  - 解释重要编译器选项的效果
  - 在大多数情况下，正确预测类型系统行为

  为了清晰和简洁起见，本手册的主要内容不会探讨所涵盖特征的每一个边缘情况或细节。您可以在参考文章中找到有关特定概念的更多详细信息。

- **参考文件**

  导航中手册下方的参考部分旨在更深入地了解 TypeScript 的特定部分是如何工作的。你可以自上而下地阅读，但每一部分的目的都是对一个概念进行更深入的解释——这意味着没有连续性的目标。

### 非目标

该手册也是一份简明的文件，可以在几个小时内轻松阅读。为了保持简短，某些主题将不会被涵盖。

具体来说，该手册没有完全介绍核心 JavaScript 基础知识，如函数、类和闭包。在适当的情况下，我们将包括背景阅读的链接，您可以使用这些链接来阅读这些概念。

本手册也无意取代语言规范。在某些情况下，边缘案例或行为的正式描述将被跳过，以支持更高层次、更容易理解的解释。相反，有单独的参考页，更精确和正式地描述TypeScript行为的许多方面。参考页不适用于不熟悉TypeScript的读者，因此它们可能会使用您尚未阅读过的高级术语或参考主题。

最后，除了必要的地方，本手册不会介绍 TypeScript 如何与其他工具交互。诸如如何使用 webpack、rollup、packet、react、babel、closure、lerna、rush、bazel、preact、vue、angular、svelte、jquery、warn 或 npm 配置 TypeScript 等主题不在讨论范围之内-您可以在web上的其他地方找到这些资源。

## 入门
在开始学习[基础知识]（/docs/handbook/2/basic types.html）之前，我们建议先阅读以下介绍页面之一。这些介绍旨在强调 TypeScript 和您喜欢的编程语言之间的关键相似性和差异，并澄清这些语言特有的常见误解。



- [TypeScript for New Programmers](/docs/handbook/typescript-from-scratch.html)
- [TypeScript for JavaScript Programmers](/docs/handbook/typescript-in-5-minutes.html)
- [TypeScript for OOP Programmers](/docs/handbook/typescript-in-5-minutes-oop.html)
- [TypeScript for Functional Programmers](/docs/handbook/typescript-in-5-minutes-func.html)

否则跳转至  [The Basics](/docs/handbook/2/basic-types.html) 或者在[Epub](/assets/typescript-handbook.epub) 获取副本或者 [PDF](/assets/typescript-handbook.pdf) 形式。
