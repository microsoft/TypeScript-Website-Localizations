---
title: tsconfig.json 是什么
layout: docs
permalink: /zh/docs/handbook/tsconfig-json.html
oneline: 了解 TSConfig 的工作原理
translatable: true
---

## 概览

当目录中出现了 `tsconfig.json` 文件，则说明该目录是 TypeScript 项目的根目录。`tsconfig.json` 文件指定了编译项目所需的根目录下的文件以及编译选项。

JavaScript 项目可以使用 `jsconfig.json` 文件，它的作用与 `tsconfig.json` 基本相同，只是默认启用了一些 JavaScript 相关的编译选项。

一个项目将以下列之一的方式编译：

## 使用 `tsconfig.json` 或者 `jsconfig.json`

- 在调用 tsc 命令并且没有其它输入文件参数时，编译器将由当前目录开始向父级目录寻找包含 tsconfig 文件的目录。

- 调用 tsc 命令并且没有其他输入文件参数，可以使用 `--project` （或者只是 `-p`）的命令行选项来指定包含了 `tsconfig.json` 的目录，或者包含有效配置的 `.json` 文件路径。

当命令行中指定了输入文件参数， `tsconfig.json` 文件会被忽略。

## 示例

`tsconfig.json` 文件示例：

- 使用 `files` 属性

  ```json tsconfig
  {
    "compilerOptions": {
      "module": "commonjs",
      "noImplicitAny": true,
      "removeComments": true,
      "preserveConstEnums": true,
      "sourceMap": true
    },
    "files": [
      "core.ts",
      "sys.ts",
      "types.ts",
      "scanner.ts",
      "parser.ts",
      "utilities.ts",
      "binder.ts",
      "checker.ts",
      "emitter.ts",
      "program.ts",
      "commandLineParser.ts",
      "tsc.ts",
      "diagnosticInformationMap.generated.ts"
    ]
  }
  ```

- 使用 `"include"` 和 `"exclude"` 属性

  ```json  tsconfig
  {
    "compilerOptions": {
      "module": "system",
      "noImplicitAny": true,
      "removeComments": true,
      "preserveConstEnums": true,
      "outFile": "../../built/local/tsc.js",
      "sourceMap": true
    },
    "include": ["src/**/*"],
    "exclude": ["node_modules", "**/*.spec.ts"]
  }
  ```

## 基本的 TSConfig

根据你要在其中运行代码的不同的 JavaScript 运行时环境，你可以在 [github.com/tsconfig/bases](https://github.com/tsconfig/bases/) 上寻找一个合适的基本配置。
你可以通过扩展这些已经处理过不同的 JavaScript 运行时环境的 `tsconfig.json` 文件来简化你项目中的 `tsconfig.json`。

举个例子，如果你的项目是基于 Node.js 12.x 写的，那么你可以使用 npm 模块：[`@tsconfig/node12`](https://www.npmjs.com/package/@tsconfig/node12)：

```json tsconfig
{
  "extends": "@tsconfig/node12/tsconfig.json",

  "compilerOptions": {
    "preserveConstEnums": true
  },

  "include": ["src/**/*"],
  "exclude": ["node_modules", "**/*.spec.ts"]
}
```

这使你的 `tsconfig.json` 专注在你的项目的目标环境上，而不是所有可能的运行时环境。现在已经有了一些 tsconfig 基础配置，我们希望社区能够为不同的环境添加更多的内容。

- [推荐配置](https://www.npmjs.com/package/@tsconfig/recommended)
- [Node 10](https://www.npmjs.com/package/@tsconfig/node10)
- [Node 12](https://www.npmjs.com/package/@tsconfig/node12)
- [Node 14](https://www.npmjs.com/package/@tsconfig/node14)
- [Deno](https://www.npmjs.com/package/@tsconfig/deno)
- [React Native](https://www.npmjs.com/package/@tsconfig/react-native)
- [Svelte](https://www.npmjs.com/package/@tsconfig/svelte)

## 细节

当`"compilerOptions"` 属性忽略时，会使用编译器的默认配置。请参考我们支持的[编译器选项](/tsconfig)列表。

## TSConfig 参考

想要了解更多的配置选项的信息，请访问 [TSConfig Reference](/tsconfig)。

## 协议

`tsconfig.json` 的协议可以在这里找到 [the JSON Schema Store](http://json.schemastore.org/tsconfig)。
