---
title: 与构建工具集成
layout: docs
permalink: /zh/docs/handbook/integrating-with-build-tools.html
oneline: 如何将TypeScript与其他构建工具一起使用
translatable: true
---

## Babel

### 安装

```sh
npm install @babel/cli @babel/core @babel/preset-typescript --save-dev
```

### .babelrc

```js
{
  "presets": ["@babel/preset-typescript"]
}
```

### 命令行执行

```sh
./node_modules/.bin/babel --out-file bundle.js src/index.ts
```

### package.json

```js
{
  "scripts": {
    "build": "babel --out-file bundle.js main.ts"
  },
}
```

### 命令行执行 Babel

```sh
npm run build
```

## Browserify

### 安装

```sh
npm install tsify
```

### 命令行执行

```sh
browserify main.ts -p [ tsify --noImplicitAny ] > bundle.js
```

### 使用 API

```js
var browserify = require("browserify");
var tsify = require("tsify");

browserify()
  .add("main.ts")
  .plugin("tsify", { noImplicitAny: true })
  .bundle()
  .pipe(process.stdout);
```

更多细节: [smrq/tsify](https://github.com/smrq/tsify)

## Grunt

### 安装

```sh
npm install grunt-ts
```

### 基础 Gruntfile.js

```js
module.exports = function (grunt) {
  grunt.initConfig({
    ts: {
      default: {
        src: ["**/*.ts", "!node_modules/**/*.ts"],
      },
    },
  });
  grunt.loadNpmTasks("grunt-ts");
  grunt.registerTask("default", ["ts"]);
};
```

更多细节: [TypeStrong/grunt-ts](https://github.com/TypeStrong/grunt-ts)

## Gulp

### 安装

```sh
npm install gulp-typescript
```

### 基础 gulpfile.js

```js
var gulp = require("gulp");
var ts = require("gulp-typescript");

gulp.task("default", function () {
  var tsResult = gulp.src("src/*.ts").pipe(
    ts({
      noImplicitAny: true,
      out: "output.js",
    })
  );
  return tsResult.js.pipe(gulp.dest("built/local"));
});
```

更多细节: [ivogabe/gulp-typescript](https://github.com/ivogabe/gulp-typescript)

## Jspm

### 安装

```sh
npm install -g jspm@beta
```

注意：目前 jspm 中支持TypeScript版本是 0.16beta

更多细节: [TypeScriptSamples/jspm](https://github.com/Microsoft/TypeScriptSamples/tree/master/jspm)

## MSBuild

更新项目文件，包括本地安装`Microsoft.TypeScript.Default.props` (顶部) 和 `Microsoft.TypeScript.targets` (底部):

```xml
<?xml version="1.0" encoding="utf-8"?>
<Project ToolsVersion="4.0" DefaultTargets="Build" xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
  <!-- Include default props at the top -->
  <Import
      Project="$(MSBuildExtensionsPath32)\Microsoft\VisualStudio\v$(VisualStudioVersion)\TypeScript\Microsoft.TypeScript.Default.props"
      Condition="Exists('$(MSBuildExtensionsPath32)\Microsoft\VisualStudio\v$(VisualStudioVersion)\TypeScript\Microsoft.TypeScript.Default.props')" />

  <!-- TypeScript configurations go here -->
  <PropertyGroup Condition="'$(Configuration)' == 'Debug'">
    <TypeScriptRemoveComments>false</TypeScriptRemoveComments>
    <TypeScriptSourceMap>true</TypeScriptSourceMap>
  </PropertyGroup>
  <PropertyGroup Condition="'$(Configuration)' == 'Release'">
    <TypeScriptRemoveComments>true</TypeScriptRemoveComments>
    <TypeScriptSourceMap>false</TypeScriptSourceMap>
  </PropertyGroup>

  <!-- Include default targets at the bottom -->
  <Import
      Project="$(MSBuildExtensionsPath32)\Microsoft\VisualStudio\v$(VisualStudioVersion)\TypeScript\Microsoft.TypeScript.targets"
      Condition="Exists('$(MSBuildExtensionsPath32)\Microsoft\VisualStudio\v$(VisualStudioVersion)\TypeScript\Microsoft.TypeScript.targets')" />
</Project>
```

有关定义 MSBuild 编译器选项的更多详细信息: [在 MSBuild 项目中设置编译器选项](/docs/handbook/compiler-options-in-msbuild.html)

## NuGet

- 右键单击 -> 管理 NuGet 包
- 搜索 `Microsoft.TypeScript.MSBuild`
- 点击 `Install`
- 安装完成后重新构建!

更多详细信息可以查看 [Package Manager Dialog](http://docs.nuget.org/Consume/Package-Manager-Dialog) 和 [using nightly builds with NuGet](https://github.com/Microsoft/TypeScript/wiki/Nightly-drops#using-nuget-with-msbuild)

## Rollup

### 安装

```
npm install @rollup/plugin-typescript --save-dev
```

请注意，`typescript`和`tslib`都是此插件的对等依赖项（peerDependencies），需要单独安装。

### 使用

创建一个 `rollup.config.js` [配置文件](https://www.rollupjs.org/guide/en/#configuration-files) 并且导入插件:

```js
// rollup.config.js
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: {
    dir: 'output',
    format: 'cjs'
  },
  plugins: [typescript()]
};
```

## Svelte Compiler

### 安装

```
npm install --save-dev svelte-preprocess
```

请注意，`typescript` 是此插件的 peerDependencies， 需要单独安装。 `tslib` 也没有提供。

你也可以考虑使用 [`svelte-check`](https://www.npmjs.com/package/svelte-check) 进行 CLI 类型检查。

### 使用

创建一个 `svelte.config.js` 配置文件并且导入插件:

```js
// svelte.config.js
import preprocess from 'svelte-preprocess';

const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess()
};

export default config;
```

现在你可以指定脚本块中用TypeScript编写:

```
<script lang="ts">
```

## Vite

Vite 支持开箱即用的导入`.ts`文件。它只执行转译而不进行类型检查。 它也要求`compilerOptions`中的一些选项要具有特定的值。有关详细信息，请参阅 [Vite 文档](https://vitejs.dev/guide/features.html#typescript)。

## Webpack

### 安装

```sh
npm install ts-loader --save-dev
```

### 使用 Webpack 5 或 4 版本时的基本 webpack.config.js

```js
const path = require('path');

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
```

[此处查看更多ts-loader详细信息](https://www.npmjs.com/package/ts-loader).

备选方案:

- [awesome-typescript-loader](https://www.npmjs.com/package/awesome-typescript-loader)
