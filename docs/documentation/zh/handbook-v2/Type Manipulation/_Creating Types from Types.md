---
title: Creating Types from Types
layout: docs
permalink: /zh/docs/handbook/2/types-from-types.html
oneline: "您可通过现有类型创建更多类型的几种方式概览。"
---

TypeScript 的类型系统非常强大，因为它允许用其他类型表示类型。

这个说法的最简单的形式就是泛型，实际上我们有各种各样的类型运算符。
也可以用我们已有的 _值_ 来表示类型。

通过组合各种类型的运算符，我们可以以简洁、可维护的方式表达复杂的操作和值。
在本节中，我们将介绍用现有类型或值表示新类型的方法。

- [泛型](/zh/docs/handbook/2/generics.html) - 接收参数的类型
- [Keyof 类型运算符](/zh/docs/handbook/2/keyof-types.html) - 通过 `keyof` 运算符创建新类型
- [Typeof 类型运算符](/zh/docs/handbook/2/typeof-types.html) - 通过 `typeof` 运算符创建新类型
- [按索引访问类型](/zh/docs/handbook/2/indexed-access-types.html) - 通过 `Type['a']` 语法访问一个类型的子集
- [条件类型](/zh/docs/handbook/2/conditional-types.html) - 在类型系统中像 if 语句那样的类型
- [映射类型](/zh/docs/handbook/2/mapped-types.html) - 通过已有类型的属性映射创建类型
- [模版字面量类型](/zh/docs/handbook/2/template-literal-types.html) - 已映射类型，其通过模版字面量字符串，改变其属性
