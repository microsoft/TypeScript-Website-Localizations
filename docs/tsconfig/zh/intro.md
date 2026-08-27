---
header: TSConfig 介绍
firstLine: TSConfig 文件象征着，它所在的目录是一个 TypeScript 项目或者 JavaScript 项目的根目录...
---


TSConfig 文件象征着，它所在的目录是一个 TypeScript 项目或者 JavaScript 项目的根目录。
TSConfig 文件可以是 `tsconfig.json` 或 `jsconfig.json`，它们的配置相同。

此页涵盖了 TSConfig 文件中可用的所有不同选项。同时没有按照线性叙述来构建，而是分为了5个主要部分:

- 一个配置项的分类概览
- [root fields](#Project_Files_0): 告知 TypeScript 哪些文件需要被处理
- [`compilerOptions`](#compilerOptions): 本页的主要内容
- [`watchOptions`](#watchOptions): 配置监听模式
- [`typeAcquisition`](#typeAcquisition): 配置 JavaScript 项目使用类型的方式

如果你是从零开始 TSConfig，可以考虑使用 `tsc --init` 或者 [TSConfig base](https://github.com/tsconfig/bases#centralized-recommendations-for-tsconfig-bases) 来进行配置。