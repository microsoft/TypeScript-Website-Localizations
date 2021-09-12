---
title: JS Projects Utilizing TypeScript
layout: docs
permalink: /zh/docs/handbook/intro-to-js-ts.html
oneline: 如何使用 TypeScript 给 JavaScript 文件添加类型检查
translatable: true
---

在不同代码库中，TypeScript 的类型系统有不同级别的严格性：
- 仅基于 JavaScript 代码推断的类型系统
- 在 JavaScript 中 [通过 JSDoc](/docs/handbook/jsdoc-supported-types.html) 增加类型
- 在 JavaScript 文件中使用 `// @ts-check`
- TypeScript 代码
- TypeScript 代码，其 [`strict`](/tsconfig#strict) 设置为开启

每一步都代表着向更安全的类型系统的迈进，但并非每个项目都需要这种级别的验证。
## 使用 JavaScript 的 TypeScript

就是当你使用的一个编辑器，它使用 TypeScript 来提供如自动补全，标识跳转的工具，还有像重命名这样的重构工具。
在 [首页](/) 有一个自带 TypeScript 插件的编辑器清单。

## 在 JS 中通过 JSDoc 提供类型提示

在一个 `.js` 文件中，类型时通常是可以被推断的。当类型不能被推断时，他们也可以使用 JSDoc 语法加以指定。

JSDoc 注释出现在声明之前，将用于设置该声明的类型。例如：

```js twoslash
/** @type {number} */
var x;

x = 0; // OK
x = false; // OK?!
```

您可以在 [受 JSDoc 支持的类型](/docs/handbook/jsdoc-supported-types.html) 中找到 JSDoc 所支持的模式的完整清单。

## `@ts-check`

上面代码示例中的最后一行，在 TypeScript 中会引发报错，不过默认在 JS 项目中却不会。
要使其在您的 JavaScript 中也报错，请添加： `// @ts-check` 到您的 `.js` 文件的第一行，让 TypeScript 去触发该错误。


```js twoslash
// @ts-check
// @errors: 2322
/** @type {number} */
var x;

x = 0; // OK
x = false; // Not OK
```

如果您有大量的 JavaScript 文件，您若想添加错误提示，那么您可以转为使用 [`jsconfig.json`](/docs/handbook/tsconfig-json.html)。
您可以通过给文件添加 `// @ts-nocheck` 注释以跳过个别文件的检查。

TypeScript 有时会有意料之外的报错，这种情形下您可以通过在上一行添加 `// @ts-ignore` 或者 `// @ts-expect-error` 来忽略这些报错。

```js twoslash
// @ts-check
/** @type {number} */
var x;

x = 0; // OK
// @ts-expect-error
x = false; // Not OK
```

要学习有关 JavaScript 如何被 TypeScript 解释，请参阅 [TS 类型如何检查 JS](/docs/handbook/type-checking-javascript-files.html)
