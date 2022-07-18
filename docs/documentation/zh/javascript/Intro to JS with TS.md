---
title: 使用 TypeScript 来编写 JavaScript 项目
layout: docs
permalink: /zh/docs/handbook/intro-to-js-ts.html
oneline: 如何使用 TypeScript 向 JavaScript 添加类型检查
translatable: true
---

在一般的代码中，TypeScript 中的类型系统的严格程度是不一样的：

- 只基于 JavaScript 代码推断
- 增强的  JavaScript 类型推断（[通过  JSDoc](/docs/handbook/jsdoc-supported-types.html)）
- 在 JavaScript 文件里面使用 `// @ts-check` 
- TypeScript 代码
- TypeScript 的 [`strict`](/tsconfig#strict) 模式

每一步都代表着向更安全的类型系统迈进，但并不是每个项目都需要级别最高的验证。

## TypeScript 与 JavaScript

在使用某些编辑器时，它可以为使用 TypeScript 提供工具，如自动补全，跳转到特定位置。还有一些重构工具，如重命名。
[主页](/) 有一个包含 TypeScript 插件的编辑器列表。

## 通过 JSDoc 在 JS 中提供类型提示

在 `.js` 文件里，类型通常可以被推断出来。当无法推断类型时，可以使用 JSDoc 语法来指定。

声明之前的 JSDoc 注释，将用于设置该声明的类型。例如：

```js twoslash
/** @type {number} */
var x;

x = 0; // OK
x = false; // OK?!
```

你可以[在 JSDoc 支持的类型列表](/docs/handbook/jsdoc-supported-types.html)找到支持的 JSDoc 模式的完整说明。

## `@ts-check`

上述代码示例的最后一行会在 TypeScript 中引发错误，但在 JS 项目中，默认情况下不会引发错误。
要在 JavaScript 文件显示错误，请在 `.js` 文件的第一行中添加： `// @ts-check`。

```js twoslash
// @ts-check
// @errors: 2322
/** @type {number} */
var x;

x = 0; // OK
x = false; // Not OK
```

如果你有许多 JavaScript 文件要显示错误，则可以使用 [`jsconfig.json`](/docs/handbook/tsconfig-json.html) 来代替注释。
你可以通过在文件中添加`// @ts-nocheck` 注释来跳过检查某些文件。

TypeScript 可能会提供你不想看到的错误，在这种情况下，你可以通过在前一行添加 `// @ts-ignore` 或 `// @ts-expect-error` 来忽略某一行上的错误。

```js twoslash
// @ts-check
/** @type {number} */
var x;

x = 0; // OK
// @ts-expect-error
x = false; // Not OK
```

要了解有关 TypeScript 如何解释 JavaScript 的更多信息，请阅读 [TS 是如何解释 JS 的](/docs/handbook/type-checking-javascript-files.html)。
