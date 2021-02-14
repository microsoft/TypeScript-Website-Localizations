---
display: "watchDirectory"
oneline: "Specify how directories are watched on systems that lack recursive file-watching functionality."
---

再帰的なファイル監視機能を持たないシステムで、ディレクトリツリー全体を監視する方法を指定します。

- `fixedPollingInterval`: すべてのディレクトリの変更を一定間隔で毎秒数回チェックします。
- `dynamicPriorityPolling`: 変更頻度の低いディレクトリがチェックされる頻度が低くなるような動的なキューを使用します。
- `useFsEvents` (デフォルト): ディレクトリの変更に対するオペレーティングシステム/ファイルシステムのネイティブイベントの使用を試みます。
