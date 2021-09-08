---
title: Creating .d.ts Files from .js files
layout: docs
permalink: /zh/docs/handbook/declaration-files/dts-from-js.html
oneline: "如何生成并添加 .d.ts 到 JavaScript 项目"
translatable: true
---

[使用 TypeScript 3.7](/docs/handbook/release-notes/typescript-3-7.html#--declaration-and---allowjs),
TypeScript 新增了对使用 JSDoc 语法的 JavaScript，生成 .d.ts 文件的支持。

这种设置意味着，您可以拥有 TypeScript 支持的编辑器的编辑器体验，而无需将项目移植到TypeScript，也无需在代码库中维护.d.ts文件。

TypeScript 支持绝大多数的 JSDoc 标签，您可以参考 [这里的手册](/docs/handbook/type-checking-javascript-files.html#supported-jsdoc)。

## 配置您的项目去输出 .d.ts 文件

要在项目中添加 .d.ts 文件的构建，最多需要执行四个步骤：

- 添加 TypeScript 到您的开发依赖
- 添加一个 `tsconfig.json` 来配置 TypeScript
- 运行 TypeScript 编译器来生成 JS 文件的 d.ts 文件
- (可选) 编辑 package.json 来指定类型文件

### 添加 TypeScript

您可以在我们的 [安装页面](/download) 中学会如何添加。

### TSConfig
TSConfig 是一份 jsonc 文件，其中配置了您的编译器标记，已经申明从哪里查找文件。
在本例中，您将需要一个如下所示的文件：

```jsonc tsconfig
{
  // Change this to match your project
  "include": ["src/**/*"],

  "compilerOptions": {
    // Tells TypeScript to read JS files, as
    // normally they are ignored as source files
    "allowJs": true,
    // Generate d.ts files
    "declaration": true,
    // This compiler run should
    // only output d.ts files
    "emitDeclarationOnly": true,
    // Types should go into this directory.
    // Removing this would place the .d.ts files
    // next to the .js files
    "outDir": "dist"
  }
}
```

您可以在 [tsconfig 参考](/tsconfig) 学习更多配置。
另一个使用 TSConfig 的选择既是 CLI，它与 CLI 指令的行为一样。

```sh
npx -p typescript tsc src/**/*.js --declaration --allowJs --emitDeclarationOnly --outDir types
```

## 运行编译器

您可以在我们的 [安装页面](/download) 中学会如何操作。

<!-- FIXME：what's meaning -->
You want to make sure these files are included in your package if you have the files in your project's `.gitignore`.

## 编辑 package.json

TypeScript 复制了 `package.json` 中模块的节点解析，另外还有一个查找 .d.ts 文件的步骤。
大致上，解析将从一个可选的 `"types"` 开始检查，之后是 `"main"` 字段，之后尝试查找项目根目录下的 `index.d.ts` 。

| Package.json              |  .d.ts 的默认位置               |
| :------------------------ | :----------------------------- |
| 无 "types" 字段            | 检查 "main", 然后是 index.d.ts  |
| "types": "main.d.ts"      | main.d.ts                      |
| "types": "./dist/main.js" | ./dist/main.d.ts               |

如果缺失, 就找 "main" 字段

| Package.json             |  .d.ts 的默认位置          |
| :----------------------- | :------------------------ |
| 无 "main" 字段            | index.d.ts                |
| "main":"index.js"        | index.d.ts                |
| "main":"./dist/index.js" | ./dist/index.d.ts         |

## Tips

如果您想为您的 .d.ts 文件编写测试，试试这个 [tsd](https://github.com/SamVerschueren/tsd).
