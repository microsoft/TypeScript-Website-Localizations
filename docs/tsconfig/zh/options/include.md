---
display: "Include"
oneline: "要进行编译的文件的路径或匹配器的列表。"
---

指明程序所包含的文件名称或文件匹配器。
他们相对于 `tsconfig.json` 所在的目录进行解析。

```json
{
  "include": ["src/**/*", "tests/**/*"]
}
```

包含的文件:

<!-- TODO: #135
```diff
  .
- ├── scripts
- │   ├── lint.ts
- │   ├── update_deps.ts
- │   └── utils.ts
+ ├── src
+ │   ├── client
+ │   │    ├── index.ts
+ │   │    └── utils.ts
+ │   ├── server
+ │   │    └── index.ts
+ ├── tests
+ │   ├── app.test.ts
+ │   ├── utils.ts
+ │   └── tests.d.ts
- ├── package.json
- ├── tsconfig.json
- └── yarn.lock
``` -->

```
.
├── scripts                ⨯
│   ├── lint.ts            ⨯
│   ├── update_deps.ts     ⨯
│   └── utils.ts           ⨯
├── src                    ✓
│   ├── client             ✓
│   │    ├── index.ts      ✓
│   │    └── utils.ts      ✓
│   ├── server             ✓
│   │    └── index.ts      ✓
├── tests                  ✓
│   ├── app.test.ts        ✓
│   ├── utils.ts           ✓
│   └── tests.d.ts         ✓
├── package.json
├── tsconfig.json
└── yarn.lock
```

`include` 和 `exclude` 匹配器支持的匹配符:

- `*` 匹配零个或多个字符 (不包含目录分割符)
- `?` 匹配任何一个字符 (不包含目录分割符)
- `**/` 匹配任何深度的目录

如果匹配器不包含文件拓展名只，支持特定拓展名的文件。默认支持 `.ts`， `.tsx`和 `.d.ts`，如果开启了  [`allowJs`](#allowJs)，额外支持 `.js` 和 `.jsx`。
