---
display: "No Implicit Use Strict"
oneline: "Disable 'use strict' in the JS emit"
---

これは必要ないはずです。ES6でないターゲットでモジュールを出力する際に、TypeScriptはデフォルトで`"use strict;"`という前置きをファイルの一番始めに出力します。
この設定は、この前置きを無効にします。
