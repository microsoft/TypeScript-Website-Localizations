---
title: 関数型プログラマのための TypeScript
short: 関数型プログラマのための TS
layout: docs
permalink: /ja/docs/handbook/typescript-in-5-minutes-func.html
oneline: 関数型プログラミングのバックグラウンドから TypeScript を学ぶ
---

TypeScript は、Microsoft のプログラマーが伝統的なオブジェクト指向のプログラムを Web に
導入できるようにするために、伝統的なオブジェクト指向の型を JavaScript に導入しようとする
試みから始まりました。開発が進むにつれ、TypeScript の型システムはネイティブ JavaScript の
プログラマーによって書かれたコードをモデル化するように進化してきました。
結果としてこのシステムは強力で、興味深く、そして複雑なものとなります。

本入門書は、TypeScript を学びたいと考えている現役の
Haskell や ML プログラマー向けのものです。TypeScript の型システムが
Haskell の型システムとどのように異なるのかについて説明しています。
また、JavaScript コードのモデル化から生じる TypeScript の
型システムのユニークな機能についても紹介します。

ここでは、オブジェクト指向プログラミングについては扱いません。
実際には TypeScript のオブジェクト指向のプログラムは、オブジェクト指向の
プログラム機能を持つ他の一般的な言語のものとよく似ています。

## 前提

本入門書では、以下のことを知っていることを前提としています:

- JavaScript でプログラムする方法とその利点
- C 系統言語の構文

JavaScript の利点について学ぶ必要がある場合は、
[JavaScript: The Good Parts](http://shop.oreilly.com/product/9780596517748.do)を読んでください。
ミュータブルな値以外をほとんど持たず、値渡しを行う
レキシカルスコープの言語でプログラムを記述する方法を知っている場合は、
この本を読み飛ばすことができるかもしれません。
[R<sup>4</sup>RS Scheme](https://people.csail.mit.edu/jaffer/r4rs.pdf)が良い例です。

[The C++ Programming Language](http://www.stroustrup.com/4th.html)は
C スタイルの型の構文を学ぶには良い場所です。C++とは違い、
TypeScript は`string x`ではなく、`x: string`のように、型を後ろにつけます。

## Haskell にはないコンセプト

## 組み込みの型

JavaScript は 8 つの組み込み型を定義しています:

| 型          | 説明                               |
| ----------- | ---------------------------------- |
| `Number`    | IEEE 754 標準の倍精度浮動小数点数  |
| `String`    | イミュータブルな UTF-16 文字列     |
| `BigInt`    | 任意精度形式の整数                 |
| `Boolean`   | `true`および`false`                |
| `Symbol`    | 一般にキーとして使用される一意の値 |
| `Null`      | Unit 型に相当する値                |
| `Undefined` | 同様に Unit 型に相当する値         |
| `Object`    | レコード構造によく似た値           |

[詳しくは MDN のページをご確認ください](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures).

TypeScript は組み込み型に対応するプリミティブな型を持っています:

- `number`
- `string`
- `bigint`
- `boolean`
- `symbol`
- `null`
- `undefined`
- `object`

### その他の重要な TypeScript の型

| 型                   | 説明                                                        |
| -------------------- | ----------------------------------------------------------- |
| `unknown`            | 最上位の型                                                  |
| `never`              | 最下位の型                                                  |
| オブジェクトリテラル | 例 `{ property: Type }`                                     |
| `void`               | 戻り値の型として使用するために設計された`undefined`の部分型 |
| `T[]`                | ミュータブルな配列、`Array<T>`とも記述可能                  |
| `[T, T]`             | 固定長であるがミュータブルであるタプル                      |
| `(t: T) => U`        | 関数                                                        |

注意点:

1. 関数の構文にはパラメータ名が含まれます。これは慣れるのがとても大変です！

   ```ts
   let fst: (a: any, b: any) => any = (a, b) => a;

   // あるいはもっと正確に:

   let fst: <T, U>(a: T, b: U) => T = (a, b) => a;
   ```

2. オブジェクトリテラル型の構文は、オブジェクトリテラルの値の構文を厳密に反映しています:

   ```ts
   let o: { n: number; xs: object[] } = { n: 1, xs: [] };
   ```

3. `[T, T]`は`T[]`の部分型です。これはタプルがリストに関係しない Haskell とは異なります。

### ボックス化された型

JavaScript にはプリミティブ型と等価であるボックス化された型があり、
プログラマがそれらの型に関連付けるメソッドを持っています。TypeScript では、
それらの違い、例えばプリミティブ型である`number`とボックス化された型である`Number`
の違いを反映しています。ボックス化された型のメソッドはプリミティブ型を
返すので、ボックス化された型が必要とされることはほとんどありません。

```ts
(1).toExponential();
// 上記は次と等しい
Number.prototype.toExponential.call(1);
```

数値リテラルのメソッドを呼び出す際には、パーサに理解させるために
括弧で囲む必要があることに注意してください。

## 漸進的な型付け

TypeScript は、式の型がわからない場合は常に`any`型を使用します。
`Dynamic`と比べると、`any`を型と呼ぶのはおおげさかもしれません。
これは、型チェッカーを無効にしているだけです。例え
ば、任意の値を、値に何らかの方法で型をつけることなく
`any[]`にプッシュすることができます。

```ts twoslash
//  tsconfig.jsonで"noImplicitAny": falseの場合は、anys: any[]とします
const anys = [];
anys.push(1);
anys.push("oh no");
anys.push({ anything: "goes" });
```

そして、`any`型の式はどこでも使うことができます:

```ts
anys.map(anys[1]); // oh no, "oh no"は関数ではありません
```

また、`any`は伝染します &mdash; `any`型の式で初期化した場合、
その変数も`any`型を持ちます。

```ts
let sepsis = anys[0] + anys[1]; // どんな値でも入れることができます
```

TypeScript が`any`を生成した時にエラーを発生させるには、`tsconfig.json`にて、
`"noImplicitAny": true`あるいは`"strict": true`を使用します。

## 構造的型付け

構造的型付けは、ほとんどの関数型プログラマには馴染みあるものですが、
Haskell や多くの ML には構造的型付けはありません。その基本形は
とてもシンプルです:

```ts
// @strict: false
let o = { x: "hi", extra: 1 }; // ok
let o2: { x: string } = o; // ok
```

ここでは、オブジェクトリテラル`{ x: "hi", extra: 1 }`は、
それにマッチするリテラル型`{ x: string, extra: number }`を持っています。
この型は、必要とされるすべてのプロパティを持ち、それらのプロパティは
型に割り当て可能なので、`{ x: string }`に割り当てることができます。
extra プロパティは、割り当てを妨げるものではなく、後者の型を`{ x: string }`の
部分型にします。

名前付き型は、単に型に名前を付けるだけです。割り当てを目的とした場合
以下の、型のエイリアスである`One`とインターフェース型である`Two`との間に
違いはありません。どちらも`p: string`プロパティを持ちます。(しかし、
型のエイリアスは、再帰的定義や型パラメータに関して、インターフェースとは
異なるふるまいをします。)

```ts twoslash
// @errors: 2322
type One = { p: string };
interface Two {
  p: string;
}
class Three {
  p = "Hello";
}

let x: One = { p: "hi" };
let two: Two = x;
two = new Three();
```

## Unions

TypeScript では、Union 型はタグ付けされていません。言い換えると、
Haskell の`data`のような区別された Union ではありません。しかし、
組み込みのタグやその他のプロパティを使って Union 内の型を区別することができます。

```ts twoslash
function start(
  arg: string | string[] | (() => string) | { s: string }
): string {
  // これはJavaScriptでは非常に一般的です
  if (typeof arg === "string") {
    return commonCase(arg);
  } else if (Array.isArray(arg)) {
    return arg.map(commonCase).join(",");
  } else if (typeof arg === "function") {
    return commonCase(arg());
  } else {
    return commonCase(arg.s);
  }

  function commonCase(s: string): string {
    // 最後に、文字列を別の文字列に変換します
    return s;
  }
}
```

`string`、`Array`そして`Function`は、組み込みの型述語があるため、
オブジェクト型は`else`節のために残しておくと便利です。
しかし、実行時に区別するのが難しい Union を生成することも
できてしまいます。新しいコードを記述するときは
区別可能な Union のみを作成するのがベストです。

以下の型は組み込みの述語を持っています:

| 型        | 述語                               |
| --------- | ---------------------------------- |
| string    | `typeof s === "string"`            |
| number    | `typeof n === "number"`            |
| bigint    | `typeof m === "bigint"`            |
| boolean   | `typeof b === "boolean"`           |
| symbol    | `typeof g === "symbol"`            |
| undefined | `typeof undefined === "undefined"` |
| function  | `typeof f === "function"`          |
| array     | `Array.isArray(a)`                 |
| object    | `typeof o === "object"`            |

関数と配列は実行時にはオブジェクトですが、独自の述語を
持っていることに注意してください。

### Intersections

Union に加えて、TypeScript には Intersection もあります:

```ts twoslash
type Combined = { a: number } & { b: string };
type Conflicting = { a: number } & { a: string };
```

`Combined`は、あたかも 1 つのオブジェクトリテラル型として記述されているかのように
`a`と`b`の 2 つのプロパティを持ちます。Intersection と Union は、
競合があった場合には再帰的に処理されるので、`Conflicting.a`は、`number & string`となります。

## Unit 型

Unit 型はプリミティブ型の部分型で、厳密な 1 つのプリミティブな値を
持ちます。例えば、文字列`"foo"`は、`"foo"`という型を持ちます。
JavaScript には組み込みの Enum はないので、代わりに既知の文字列の
セットを使用するのが一般的です。文字列リテラル型の Union によって、
TypeScript は以下のパターンに型をつけることができます:

```ts twoslash
declare function pad(s: string, n: number, direction: "left" | "right"): string;
pad("hi", 10, "left");
```

必要に応じて、コンパイラは、例えば`"foo"`から`string`など、
Unit 型をプリミティブ型へ _拡張_ &mdash; 上位型に変換 &mdash; します。
これはミュータブルな値を扱っている時に起こり、ミュータブル変数の使用を
妨げとなることがあります。

```ts twoslash
// @errors: 2345
declare function pad(s: string, n: number, direction: "left" | "right"): string;
// ---cut---
let s = "right";
pad("hi", 10, s); // error: 'string' is not assignable to '"left" | "right"'
```

どのようにしてエラーが発生するのかについて説明します:

- `"right": "right"`
- `"right"`は、ミュータブル変数に代入されると、`string`に拡張されるので`s: string`となります
- `string`は`"left" | "right"`に割り当てできません

`s`に型アノテーションを付けることで回避することができますが、
これは同時に、`"left" | "right"`型を持たない変数の`s`への代入を
防いでもくれます

```ts twoslash
declare function pad(s: string, n: number, direction: "left" | "right"): string;
// ---cut---
let s: "left" | "right" = "right";
pad("hi", 10, s);
```

## Haskell に似たコンセプト

## 文脈的型

TypeScript では、変数宣言などのように明らかに
型を推論できる箇所がいくつかあります:

```ts twoslash
let s = "I'm a string!";
```

しかし、他の C 構文の言語を使ったことがある人にとっては
思いもよらないようなところでも型を推論します:

```ts twoslash
declare function map<T, U>(f: (t: T) => U, ts: T[]): U[];
let sns = map((n) => n.toString(), [1, 2, 3]);
```

上記で、呼び出し前に`T`と`U`は推論されていないにも関わらず、
`n: number`となります。実際には、`[1,2,3]`を用いて
`T=number`と推論した後、`n => n.toString()`の
戻り値の型から`U=string`を推論します。これによって、
`sns`は`string[]`型を持つようになります。

推論は順番に関係なく動作しますが、インテリセンスは
左から右にしか動作せず、そのため TypeScript では配列を先頭にして
`map`を宣言する方が好ましいことに注意してください:

```ts twoslash
declare function map<T, U>(ts: T[], f: (t: T) => U): U[];
```

文脈的型付けは、オブジェクトリテラルやそうでなければ`string`あるいは`number`と
推論されるような Unit 型に対しても、再帰的に動作します。また、
文脈から戻り値の型を推論することができます:

```ts twoslash
declare function run<T>(thunk: (t: T) => void): T;
let i: { inference: string } = run((o) => {
  o.inference = "INSERT STATE HERE";
});
```

`o`の型は、`{ inference: string }`であると判断されます。なぜなら

1. 宣言の初期化子は、宣言の型`{ inference: string }`によって
   文脈上の型が付けられる
2. 呼び出しの戻り値の型は、推論に文脈上の型を用いるので、
   コンパイラは`T={ inference: string }`と推論する
3. アロー関数は、文脈上の型を用いてパラメータに型を付けるため、
   コンパイラは`o: { inference: string }`を与える

そしてまた、この処理はあなたがタイピングしている間に行われるので、
`o`を入力すると、実際のプログラムにあるようなプロパティに加えて
`inference`プロパティの補完が得られます。
全体的に、この機能のおかげで TypeScript の推論は型を統一する推論エンジンのように
少し思えるかもしれませんが、そうではありません。

## 型エイリアス

型エイリアスは、Haskell の`type`のような単なるエイリアスです。
コンパイラはソースコードで使われているエイリアス名を使用しようとしますが、
常に成功するとは限りません。

```ts twoslash
type Size = [number, number];
let x: Size = [101.1, 999.9];
```

`newtype`に最も近いものは _タグ付きの Intersection_ です:

```ts
type FString = string & { __compileTimeOnly: any };
```

`FString`は、実際には存在しない`__compileTimeOnly`という
名前のプロパティを持っているとコンパイラが考えている以外は、
通常の文字列です。つまり、`FString`は`string`に
割り当てることはできますが、その逆はできません。

## 判別可能な Union

`data`に最も近いものは、判別式プロパティを持つ Union 型で、
通常 TypeScript では、判別可能な Union と呼ばれます。

```ts
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; x: number }
  | { kind: "triangle"; x: number; y: number };
```

Haskell とは違い、タグ、つまり判別式は各オブジェクト型の
プロパティにすぎません。それぞれの型は、固有の Unit 型である
同一のプロパティを持っています。上記は通常の Union 型ですが、
最も先頭の`|`は、Union 型構文では任意です。通常の JavaScript コードを
使って、Union のメンバを判別することができます

```ts twoslash
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; x: number }
  | { kind: "triangle"; x: number; y: number };

function area(s: Shape) {
  if (s.kind === "circle") {
    return Math.PI * s.radius * s.radius;
  } else if (s.kind === "square") {
    return s.x * s.x;
  } else {
    return (s.x * s.y) / 2;
  }
}
```

TypeScript は関数は合計であることを知っているので、`area`の戻り値の型は
`number`であると推論されることに注意してください。もし処理されないメンバがあれば、
代わりに`area`の戻り値の型は`number | undefined`となるでしょう。

また、Haskell とは異なり、共通プロパティはどの Union でも表示されます。
そのため、共通プロパティを有効に使い、Union の複数のメンバを判別することができます。

```ts twoslash
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; x: number }
  | { kind: "triangle"; x: number; y: number };
// ---cut---
function height(s: Shape) {
  if (s.kind === "circle") {
    return 2 * s.radius;
  } else {
    // s.kind: "square" | "triangle"
    return s.x;
  }
}
```

## 型パラメータ

ほとんどの C 系統の言語と同じように、TypeScript は型パラメータの宣言を
必要とします:

```ts
function liftArray<T>(t: T): Array<T> {
  return [t];
}
```

大文字でなければならないということありませんが、型パラメータは慣習的に
大文字の 1 文字で表します。また、型パラメータは、型クラスの制約のように
ふるまう制約を型に与えることもできます。

```ts
function firstish<T extends { length: number }>(t1: T, t2: T): T {
  return t1.length > t2.length ? t1 : t2;
}
```

TypeScript は通常、引数の型に基づいて呼び出しから型引数を推論することが
できるので、型引数は通常必要ありません。

TypeScript は構造型であるため、公称型システムほど、型パラメータを
必要としません。具体的には、関数のポリモーフィックを
作成するためには必要としません。型パラメータは、パラメータが
同じ型であるように制約するなど、型情報を伝播するために
使われるべきです。

```ts
function length<T extends ArrayLike<unknown>>(t: T): number {}

function length(t: ArrayLike<unknown>): number {}
```

最初の`length`では、T は必要ではありません。一度しか
参照されていないので、戻り値や他のパラメータの制約に
使われてはいないことに注意してください。

### 高階型

TypeScript には高階型はないので、以下は正しくありません:

```ts
function length<T extends ArrayLike<unknown>, U>(m: T<U>) {}
```

### ポイントフリープログラミング

ポイントフリープログラミング &mdash; カリー化や関数合成の多用 &mdash; は、
JavaScript でも可能ですが、冗長になる可能性があります。TypeScript では、
ポイントフリープログラムに対する型推論がよく失敗するため、値パラメータの
代わりに、型パラメータを指定することになります。その結果、
非常に冗長になるので、通常はポイントフリースタイルを避けたほうが
良いでしょう。

## モジュールシステム

JavaScript のモダンなモジュール構文は、`import`や`export`を持つファイルは
暗黙的にモジュールとなるという点を除いては、Haskell に少し似ています。

```ts
import { value, Type } from "npm-package";
import { other, Types } from "./local-package";
import * as prefix from "../lib/third-package";
```

commonjs モジュール(node.js で記述されたモジュール)をインポートすることも
できます:

```ts
import f = require("single-function-package");
```

エクスポートリストを使用するか:

```ts
export { f };

function f() {
  return g();
}
function g() {} // gはエクスポートされません
```

あるいは個別にエクスポートして、エクスポートすることができます:

```ts
export function f { return g() }
function g() { }
```

後者のスタイルのほうが一般的ですが、両方とも、同じファイル内であっても
可能です。

## `readonly`と`const`

JavaScript では、デフォルトでは値はミュータブルですが、
`const`を使って変数を宣言すると、その _参照_ はイミュータブルとなります。
参照元は依然、ミュータブルです:

```js
const a = [1, 2, 3];
a.push(102); // ):
a[0] = 101; // D:
```

TypeScript には、これに加え、プロパティに使用する`readonly`修飾子を備えています。

```ts
interface Rx {
  readonly x: number;
}
let rx: Rx = { x: 1 };
rx.x = 12; // エラー
```

また、すべてのプロパティを`readonly`にする Mapped Type の`Readonly<T>`も
導入されました:

```ts
interface X {
  x: number;
}
let rx: Readonly<X> = { x: 1 };
rx.x = 12; // error
```

さらに、副作用のあるメソッドを排除し、配列のインデックスへの
書き込みを禁止する特別な`ReadonlyArray<T>`型と、
この型のための特別な構文があります。

```ts
let a: ReadonlyArray<number> = [1, 2, 3];
let b: readonly number[] = [1, 2, 3];
a.push(102); // error
b[0] = 101; // error
```

配列やオブジェクトリテラルに対して、const を使ったアサーションを
使うこともできます:

```ts
let a = [1, 2, 3] as const;
a.push(102); // error
a[0] = 101; // error
```

しかし、これらの選択肢はどれもデフォルトではなく、そのために
TypeScript のコードで常に使用されているというわけではありません。

## 次のステップ

本ドキュメントは、日常のコードで使用するであろう構文と型についての高度な概要です。ここから次に進みましょう

- ハンドブックを[始めから終わりまで](/docs/handbook/intro.html)読む(30 分)
- [Playground の例](/play#show-examples)を探る
