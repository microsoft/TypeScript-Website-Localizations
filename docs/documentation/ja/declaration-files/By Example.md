---
title: 宣言リファレンス
layout: docs
permalink: /ja/docs/handbook/declaration-files/by-example.html
oneline: "モジュール用の.d.tsファイルの作り方"
---

本ガイドの目的は、すぐれた宣言ファイルの書き方を示すことです。
本ガイドは、ある API の仕様と、その API の使い方の例示で構成されており、
それに対応する宣言の記述方法について解説しています。

以下のサンプルは、複雑度がほぼ高い順に並んでいます。

## プロパティを持つオブジェクト

_仕様_

> グローバス変数`myLib`は、挨拶を作る`makeGreeting`関数と、
> これまで作られた挨拶の数を示すプロパティ`numberOfGreetings`を持っています。

_コード例_

```ts
let result = myLib.makeGreeting("hello, world");
console.log("The computed greeting is:" + result);

let count = myLib.numberOfGreetings;
```

_宣言_

ドット記法でアクセス可能な型や値を記述するには、`declare namespace`を使います。

```ts
declare namespace myLib {
  function makeGreeting(s: string): string;
  let numberOfGreetings: number;
}
```

## オーバーロードされた関数

_仕様_

`getWidget`関数は、数値を受け取って Widget を返したり、あるいは文字列を受け取って Widget の配列を返します。

_コード例_

```ts
let x: Widget = getWidget(43);

let arr: Widget[] = getWidget("all of them");
```

_宣言_

```ts
declare function getWidget(n: number): Widget;
declare function getWidget(s: string): Widget[];
```

## 再利用可能な型 (インターフェース)

_仕様_

> `GreetingSettings`オブジェクトを渡して、挨拶を指定します。
> このオブジェクトは次のようなプロパティを持っています:
>
> 1 - greeting: 必須の文字列
>
> 2 - duration: 任意の時間の長さ (ミリ秒単位)
>
> 3 - color: 任意の文字列 (例：　'#ff00ff')

_コード例_

```ts
greet({
  greeting: "hello world",
  duration: 4000,
});
```

_宣言_

`interface`を使用して、プロパティを持つ型を定義します。

```ts
interface GreetingSettings {
  greeting: string;
  duration?: number;
  color?: string;
}

declare function greet(setting: GreetingSettings): void;
```

## 再利用可能な型 (タイプエイリアス)

_仕様_

> 挨拶が期待される場所に対して、`string`、`string`を返す関数、あるいは`Greeter`インスタンスを与えることができます。

_コード例_

```ts
function getGreeting() {
  return "howdy";
}
class MyGreeter extends Greeter {}

greet("hello");
greet(getGreeting);
greet(new MyGreeter());
```

_宣言_

型の省略表現を作るために、タイプエイリアスを使うことができます:

```ts
type GreetingLike = string | (() => string) | MyGreeter;

declare function greet(g: GreetingLike): void;
```

## 型の整理

_仕様_

> `greeter`オブジェクトは、ファイルにログを記録したり、アラートを表示したりすることができます。
> ログオプションは`.log(...)`に、アラートオプションは`.alert(...)`に与えることができます。

_コード例_

```ts
const g = new Greeter("Hello");
g.log({ verbose: true });
g.alert({ modal: false, title: "Current Greeting" });
```

_宣言_

名前空間を使って型を整理します。

```ts
declare namespace GreetingLib {
  interface LogOptions {
    verbose?: boolean;
  }
  interface AlertOptions {
    modal: boolean;
    title?: string;
    color?: string;
  }
}
```

宣言でネストした名前空間を作ることもできます：

```ts
declare namespace GreetingLib.Options {
  // GreetingLib.Options.Logで参照します
  interface Log {
    verbose?: boolean;
  }
  interface Alert {
    modal: boolean;
    title?: string;
    color?: string;
  }
}
```

## クラス

_仕様_

> `Greeter`オブジェクトをインスタンス化して greeter を作成したり、それを拡張してカスタマイズした greeter を作成することができます。

_コード例_

```ts
const myGreeter = new Greeter("hello, world");
myGreeter.greeting = "howdy";
myGreeter.showGreeting();

class SpecialGreeter extends Greeter {
  constructor() {
    super("Very special greetings");
  }
}
```

_宣言_

クラスやクラスライクなオブジェクトを記述するには、`declare class`を使います。
クラスはコンストラクタだけではなく、プロパティやメソッドを持つことができます。

```ts
declare class Greeter {
  constructor(greeting: string);

  greeting: string;
  showGreeting(): void;
}
```

## グローバル変数

_仕様_

> グローバル変数`foo`には、存在する widget の数が格納されています。

_コード例_

```ts
console.log("Half the number of widgets is " + foo / 2);
```

_宣言_

変数を宣言するには、`declare var`を使います。
変数が読み取り専用の場合には、`declare const`を使用することができます。
また、変数がブロックスコープに制限される場合は、`declare let`を使うこともできます。

```ts
/** 存在する widget の数 */
declare var foo: number;
```

## グローバル関数

_仕様_

> 文字列を与えて関数`greet`を呼び出すと、ユーザーに挨拶を表示することができます。

_コード例_

```ts
greet("hello, world");
```

_宣言_

関数を宣言するには、`declare function`を使用します。

```ts
declare function greet(greeting: string): void;
```
