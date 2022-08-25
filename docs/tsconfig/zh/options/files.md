---
display: "Files"
oneline: "一个数组,每一项是项目所需包含文件的路径. 和 [`include`](#include) 不同的是, files 不支持路径匹配."
---

明确指出项目所需包含的文件.如果找不到任何能包含的文件,会报错.

```json tsconfig
{
  "compilerOptions": {},
  "files": [
    "core.ts",
    "sys.ts",
    "types.ts",
    "scanner.ts",
    "parser.ts",
    "utilities.ts",
    "binder.ts",
    "checker.ts",
    "tsc.ts"
  ]
}
```

这个配置在文件数量比较小并且不需要引用一些全局文件的时候很有用.
也可以使用 [`include`](#include) 实现更多配置能力.
