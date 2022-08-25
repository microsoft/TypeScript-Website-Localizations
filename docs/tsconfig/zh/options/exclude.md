---
display: "Exclude"
oneline: "过滤 [`include`](#include) 选项."
---

在解析 [`include`](#include) 选项时,需要跳过的文件名称或文件匹配器的列表.

**Important**: `exclude` _仅仅_ 改变 [`include`](#include) 选项包含的文件.
`exclude` 指定的文件可能仍然是你代码的一部分,由于 被 `import` 引入到你的代码中 ,或者被 `types` 包含,或者使用 `/// <reference` 引入,或者 包含在 [`files`](#files) 中.

它不是一种 **阻止** 文件被包含在代码库中的机制-它只是改变 [`include`](#include) 配置项查找的内容
