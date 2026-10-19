---
display: "Allow Unused Labels"
oneline: "Disable error reporting for unused labels."
---

設定値:

- `undefined` （デフォルト）エディターに警告として提案を表示します
- `true` 使用していないラベルは無視されます
- `false` 使用していないラベルについてのコンパイラエラーを発生させます

JavaScriptにおいてLabelを利用することは稀ですが、オブジェクトリテラルを記述しようとしたときにLabel構文になってしまうことがあります。

```ts twoslash
// @errors: 7028
// @allowUnusedLabels: false
function verifyAge(age: number) {
  // 'return'の記述が抜けている 
  if (age > 18) {
    verified: true;
  }
}
```
