---
display: "Extends"
oneline: "指定一个路径或者 node 模块引用用于配置继承"
---

`extends` 的值是要继承的配置文件的路径。
路径可以使用 POSIX 风格(Linux MacOS) 或者 Windows 风格(路径中的 `\` 需要转义)。

TSConfig 中的配置会覆盖继承的配置。 相对路径计算是以其所在配置文件为基准，不受继承影响。

注意: [`files`](#files)，[`include`](#include) 和 `exclude` 会覆盖继承的配置，配置文件不允许循环继承。

[`references`](#references) 是唯一不被继承的顶级配置项。

##### Example

`configs/base.json`:

```json tsconfig
{
  "compilerOptions": {
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

`tsconfig.json`:

```json tsconfig
{
  "extends": "./configs/base",
  "files": ["main.ts", "supplemental.ts"]
}
```

`tsconfig.nostrictnull.json`:

```json tsconfig
{
  "extends": "./tsconfig",
  "compilerOptions": {
    "strictNullChecks": false
  }
}
```

可配置相对路径的配置项，相对路径计算是以该配置项所在配置文件为基准，不受继承影响。
