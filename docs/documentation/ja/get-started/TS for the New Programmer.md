---
title: 新米プログラマーのための TypeScript
short: 新米プログラマーのための TS
layout: docs
permalink: /ja/docs/handbook/typescript-from-scratch.html
oneline: ゼロから TypeScript を学ぶ
---

初めての言語のひとつとして TypeScript を選んだこと、おめでとうございます -- 良い選択をしましたね！

おそらく TypeScript が JavaScript"風"だとか"亜種"だとかはすでに聞いたことがあるでしょう。
TypeScript(TS) と JavaScript(JS) の関係は、モダンなプログラミング言語の中ではとてもユニークなものなので、これらの関係を学ぶことで TypeScript が JavaScript をどのように強力にしたのか理解することができます。

## JavaScript とは？簡潔な歴史

JavaScript(別名 ECMAScript) は、ブラウザ用のシンプルなスクリプト言語として生まれました。
この言語が発明された当時は、Web ページに埋め込まれた短いコードのスニペットとして使われることが期待されていました - 数十行以上のコードを書くことはややまれだったでしょう。
そのため、初期の Web ブラウザではそのようなコードの実行はとても遅いものでした。
しかし、時が経つにつれ、JS の人気はいよいよ増していき、Web 開発者はインタラクティブな体験を作るために使いはじめます。

Web ブラウザの開発者は、JS の使用量の増大に対して、実行エンジンの最適化(動的コンパイル)や JS でできることの拡張(API の追加)によって対応し、これによって Web 開発者はさらに JS を使うようになりました。
モダンな Web サイトでは、ブラウザは何十万行にも及ぶコードのアプリケーションを頻繁に実行しています。
これが、静的なページのシンプルなネットワークとしてはじまり、あらゆる種類のリッチな _アプリケーション_ のためのプラットフォームへと進化していく"Web"の長く緩やかな成長過程です。

それ以上に、JS は node.js を使った JS サーバーの実装など、ブラウザのコンテキストの外側でも使えるほど普及してきました。
"どこでも実行できる"という JS の性質は、クラスプラットフォーム開発にとって魅力的な選択肢です。
今日では、スタック全体をプログラムするために JavaScript _だけ_ を使う開発者もたくさんいます。

要約すると、手早く使用するために設計された言語があり、それが何百万行ものアプリケーションを記述するための本格的なツールとして成長した、ということです。
どんな言語でも、独自の _癖_ (特異性や意外性) がありますが、JavaScript にはその謙虚なはじまりゆえに、とくに _たくさん_ 癖があります。いくつか例を見てみましょう:

- JavaScript の等価演算子(`==`)は、引数を _型強制_ しますが、これは予期しないふるまいを引き起こします:

  ```js
  if ("" == 0) {
    // これは等価です！ でもなぜ？？
  }
  if (1 < x < 3) {
    // x が "どのような" 値であっても True です！
  }
  ```

- JavaScript では、存在しないプロパティにアクセスすることもできます:

  ```js
  const obj = { width: 10, height: 15 };
  // なぜこれが NaN なのか？正しくスペルを打つのが難しい！
  const area = obj.width * obj.heigth;
  ```

ほとんどのプログラミング言語は、こういったエラーが起こった時にはエラーをスローしてくれます。コンパイル中、つまりコードの実行前にエラーのスローを行う言語もあります。
小さなプログラムを書いているときはこういった癖は迷惑ですが、なんとかなります。対して、何百、何千行といったコードのアプリケーションを書いているときは、こうした癖が次々と表出し、深刻な問題となります。

## TypeScript: 静的な型チェッカー

いくつかの言語ではこういったバグだらけのプログラムを実行することはできないと前述しました。
コードを実行せずにエラーを検出することを、 _静的チェック_ と言います。
何がエラーで何がエラーでないのか、操作されている値の種類に基づいて検出することは、静的な _型_ チェックと呼ばれています。

TypeScript は、実行前にプログラムのエラーがないかチェックしますが、これは _値の種類_ に基づいて行われるので _静的な型チェッカー_ と言えます。
例えば、前述の最後の例では`obj`の _型_ が原因でエラーが出ています。
以下は、TypeScript が検出したエラーです:

```ts twoslash
// @errors: 2551
const obj = { width: 10, height: 15 };
const area = obj.width * obj.heigth;
```

### JavaScript の型付きスーパーセット

ところで、TypeScript は JavaScript とどんな関係にあるのでしょうか？

#### 構文

TypeScript は JavaScript の _スーパーセット_ である言語です。したがって JS の構文は正しい TS です。
構文とは、プログラムを形成するテキストの書き方のことを言います。
例えば、以下のコードには`)`がないので _構文_ エラーになります。

```ts twoslash
// @errors: 1005
let a = (4
```

TypeScript は、どんな JavaScript コードであっても、構文が原因でエラーになるとは考えません。
つまり、JavaScript がいったいどのように書かれているのかについては気にする必要はなく、動作する JavaScript コードであれば何でも TypeScript のファイルに入れることができるということです。

#### 型

しかし、TypeScript は _型付き_ のスーパーセットです。つまり、異なる種類の値がどのように使われることができるかといったルールを追加するという言語であるということです。
前述の`obj.heigth`のエラーは _構文_ のエラーではありません。ある種の値(_型_)を間違った方法で使ったことによるエラーです。

別の例として、以下はブラウザで実行でき、値をログに出力するであろう JavaScript コードです。

```js
console.log(4 / []);
```

これは構文的に正しいプログラムで、`Infinity`と出力します。
しかし、TypeScript は配列による数値の除算を意味のない操作だとみなし、エラーを出すでしょう。

```ts twoslash
// @errors: 2363
console.log(4 / []);
```

何が起こるのか単に確かめるために、配列で数値を割ろうとした可能性もありますが、たいていの場合はプログラミング上のミスでしょう。
TypeScript の型チェッカーは、正しいプログラムは通過させ、同時に可能な限り、よくあるエラーをキャッチできるように設計されています。
(後ほど、TypeScript がコードをチェックする厳しさの度合いを調節する設定について学びます。)

JavaScript ファイルから TypeScript ファイルにコードを移した場合、コードの記述方法によっては _型エラー_ が表示されるかもしれません。
これらはコードにある理にかなった問題かもしれませんし、TypeScript が過度に保守的になっているのかもしれません。
本ガイドでは、このようなエラーを排除するための様々な TypeScript 構文を追加する方法について説明します。

#### 実行中の動作

TypeScript は JavaScript の _実行中の動作_ を維持するプログラミング言語でもあります。
例えば、JavaScript では 0 で除算すると実行時の例外が発生するのではなく、`Infinity`が生成されます。
原則として、TypeScript は JavaScript コードの実行時の動作を **決して** 変更しません。

つまり、JavaScript から TypeScript にコードを移行した場合、TypeScript がコードに型エラーを検出したとしても、同じように実行されることが **保証** されています。

JavaScript と同じ実行時の動作を維持することは、TypeScript の基本的な約束です。というのも、これはプログラムが動作しなくなる可能性があるようなささいな違いについて気にすることなく、2 つの言語間を簡単に移行できることを意味するからです。

<!--
Missing subsection on the fact that TS extends JS to add syntax for type
specification.  (Since the immediately preceding text was raving about
how JS code can be used in TS.)
-->

#### 型の削除

大ざっぱに言ってしまえば、いったん TypeScript のコンパイラがコードのチェックを終えると、"コンパイルされた"コードを生成するために型を _削除_ します。
つまり、ひとたびコードがコンパイルされれば、結果として生じる JS コードには型情報が含まれないということです。

これはまた、TypeScript が推測した型に基づいてプログラムの _動作_ を変更することは決してないということを意味します。
要するに、コンパイル中に型エラーが表示されるかもしれませんが、型システム自体はプログラムの実行中の動作とは関係がないということです。

そして最後に、TypeScript はランタイムライブラリを追加しません。
あなたのプログラムは JavaScript プログラムと同じ標準ライブラリ(または外部ライブラリ)を使用するので、学習が必要な TypeScript 特有のフレームワークが追加されるということはありません。

<!--
Should extend this paragraph to say that there's an exception of
allowing you to use newer JS features and transpile the code to an older
JS, and this might add small stubs of functionality when needed.  (Maybe
with an example --- something like `?.` would be good in showing readers
that this document is maintained.)
-->

## JavaScript と TypeScript の学習

"JavaScript と TypeScript、どちらを学ぶべきか？"という質問をよく目にします。

答えとしては、JavaScript を学ばずして TypeScript を学ぶことはできません！
TypeScript は JavaScript と構文および実行中の動作を共有しているので、JavaScript を学ぶことは、同時に TypeScript を学ぶことにもつながります。

プログラマが JavaScript を学ぶための資料はとてもたくさんあります。TypeScript を書いているのであれば、こうした資料は無視できません。
例えば、StackOverflow には`javascript`のタグが付いた質問は`typescript`の約 20 倍ありますが、`javascript`の質問は _すべて_ TypeScript にも当てはまります。

もし"TypeScript でリストをソートする方法"といったものを検索していることに気づいたら、**TypeScript はコンパイル時の型チェッカーを備えた JavaScript のランタイム** であることを思い出してください。
TypeScript でリストをソートする方法は、JavaScript で行う方法と同じです。
TypeScript を直接使用している資料を見つけた場合は、それは素晴らしいことですが、実行時のタスクを達成する方法についてのありふれた質問に対して、TypeScript 特有の答えが必要だと、思考を制限しないようにしてください。

---

ここからは JavaScript の基礎を学ぶことをおすすめします。([Mozilla Web Docs の JavaScript ガイド](https://developer.mozilla.org/docs/Web/JavaScript/Guide)は良いスタート地点です。)

慣れてきたら、[JavaScript プログラマのための TypeScript](/docs/handbook/typescript-in-5-minutes.html)や、その後に[ハンドブック](/docs/handbook/intro.html)あるいは[Playground 例](/play#show-examples)を読んでみてください。

<!-- Note: I'll be happy to write the following... -->
<!--
## Types

    * What's a type? (For newbies)
      * A type is a *kind* of value
      * Types implicitly define what operations make sense on them
      * Lots of different kinds, not just primitives
      * We can make descriptions for all kinds of values
      * The `any` type -- a quick desctiption, what it is, and why it's bad
    * Inference 101
      * Examples
      * TypeScript can figure out types most of the time
      * Two places we'll ask you what the type is: Function boundaries, and later-initialized values
    * Co-learning JavaScript
      * You can+should read existing JS resources
      * Just paste it in and see what happens
      * Consider turning off 'strict' -->
