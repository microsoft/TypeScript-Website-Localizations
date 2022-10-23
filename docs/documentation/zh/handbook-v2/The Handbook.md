---
title: TypeScript 手册
layout: docs
permalink: /zh/docs/handbook/intro.html
oneline: 学习 TypeScript 的第一步
handbook: "true"
---

## 关于本手册

在被引入编程社区 20 多年后，JavaScript 现在是有史以来最广泛使用的跨平台语言之一。JavaScript 最初是一种用于向网页添加微不足道的交互性的小型脚本语言，现已发展成为各种规模的前端和后端应用程序的首选语言。虽然用 JavaScript 编写的程序的大小、范围和复杂性呈指数级增长，但 JavaScript 语言表达不同代码单元之间关系的能力却没有。结合 JavaScript 相当特殊的运行时语义，语言和程序复杂性之间的这种不匹配使得 JavaScript 开发成为一项难以大规模管理的任务。

程序员编写的最常见的错误类型可以描述为类型错误：在预期不同类型的值的地方使用了某种类型的值。这可能是由于简单的拼写错误、未能理解库的 API 表面、对运行时行为的错误假设或其他错误。TypeScript 的目标是成为 JavaScript 程序的静态类型检查器 - 换句话说，一个在代码运行之前运行的工具（静态）并确保程序的类型正确（类型检查）。

如果您在没有 JavaScript 背景的情况下使用 TypeScript，并且打算将 TypeScript 作为您的第一语言，我们建议您首先开始阅读 [Microsoft 学习 JavaScript 教程](https://docs.microsoft.com/javascript/) 上的文档或阅读 [Mozilla 网络文档中的 JavaScript](https://developer.mozilla.org/docs/Web/JavaScript/Guide)。
如果您有其他语言的经验，您应该能够通过阅读手册很快掌握 JavaScript 语法。

## 本手册的结构是怎样的

手册分为两部分：

- **手册**

  TypeScript 手册旨在成为向日常程序员解释 TypeScript 的综合文档。您可以在左侧导航中从上到下阅读手册。

  您应该期望每一章或每一页都能为您提供对给定概念的深刻理解。TypeScript 手册不是一个完整的语言规范，但它旨在成为该语言所有特性和行为的一个综合指南。

  完成演练的读者应该能够：

  - 阅读并理解常用的 TypeScript 语法和模式
  - 解释重要编译器选项的影响
  - 在大多数情况下正确预测类型系统行为

  为清晰和简洁起见，本手册的主要内容不会探讨所涵盖功能的所有边缘情况或细节。您可以在参考文章中找到有关特定概念的更多详细信息。

- **参考文件**

  导航中手册下方的参考部分旨在提供对 TypeScript 特定部分如何工作的更丰富的理解。您可以从上到下阅读它，但每个部分都旨在为单个概念提供更深入的解释 - 这意味着没有连续性的目标。

### 非目标

该手册还旨在成为一份简洁的文档，可以在几个小时内轻松阅读。为了简短起见，某些主题不会被涵盖。

具体来说，该手册没有完全介绍核心 JavaScript 基础知识，如函数、类和闭包。在适当的情况下，我们将包含指向背景阅读的链接，您可以使用这些链接来阅读这些概念。

该手册也不打算替代语言规范。在某些情况下，将跳过边缘情况或对行为的正式描述，转而采用更易于理解的高级解释。相反，有单独的参考页面更准确、更正式地描述了 TypeScript 行为的许多方面。参考页面不适用于不熟悉 TypeScript 的读者，因此他们可能会使用您尚未阅读的高级术语或参考主题。

最后，除非必要，否则手册不会涵盖 TypeScript 如何与其他工具交互。诸如如何使用 webpack、rollup、parcel、react、babel、closure、lerna、rush、bazel、preact、vue、angular、svelte、jquery、yarn 或 npm 配置 TypeScript 等主题超出了范围 - 您可以在其他地方找到这些资源在网上。

## 立即开始

在开始使用[基础知识](/zh/docs/handbook/2/basic-types.html)之前，我们建议您阅读以下介绍性页面之一。这些介绍旨在突出 TypeScript 与您喜欢的编程语言之间的主要相似之处和不同之处，并澄清针对这些语言的常见误解。

- [适用于新手程序员的 TypeScript](/zh/docs/handbook/typescript-from-scratch.html)
- [适用于 JavaScript 程序员的 TypeScript](/zh/docs/handbook/typescript-in-5-minutes.html)
- [适用于 OOP 程序员的 TypeScript](/zh/docs/handbook/typescript-in-5-minutes-oop.html)
- [适用于函数式程序员的 TypeScript](/zh/docs/handbook/typescript-in-5-minutes-func.html)

否则，请跳转到[基础知识](/zh/docs/handbook/2/basic-types.html) 或获取一份 [Epub](/assets/typescript-handbook.epub) 或 [PDF](/assets/typescript-handbook.pdf) 格式的副本。
