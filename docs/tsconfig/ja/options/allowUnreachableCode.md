---
display: "Allow Unreachable Code"
oneline: "Disable error reporting for unreachable code."
---

設定値:

- `undefined` （デフォルト）エディターに警告として提案を表示します
- `true` 到達不可能コードは無視されます
- `false` 到達不可能コードについてのコンパイラエラーを発生させます

この警告は、JavaScript 構文の利用によって到達不可能になり得るコードにのみ関係します。例えば:

```ts
function fn(n: number) {
  if (n > 5) {
    return true;
  } else {
    return false;
  }
  return true;
}
```

`"allowUnreachableCode": false`にすると、次のようになります:

```ts twoslash
// @errors: 7027
// @allowUnreachableCode: false
function fn(n: number) {
  if (n > 5) {
    return true;
  } else {
    return false;
  }
  return true;
}
```

このオプションは、型の分析によって到達不可能と判断されたコードについてのエラーには影響しません。
