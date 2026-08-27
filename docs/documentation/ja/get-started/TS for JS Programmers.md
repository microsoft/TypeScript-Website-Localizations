---
title: JavaScript プログラマのための TypeScript
short: JS プログラマのための TypeScript
layout: docs
permalink: /ja/docs/handbook/typescript-in-5-minutes.html
oneline: TypeScript がどのように JavaScript を拡張するのか学ぶ
---

TypeScript は、JavaScript と奇妙な関係にあります。TypeScript は、JavaScript のすべての機能を提供し、その上に、TypeScript の型システムというレイヤーを追加します。

例えば JavaScript には`string`や`number`、`object`といった言語プリミティブがありますが、これらが矛盾なく代入されているかどうかは検証しません。しかし、TypeScript は検証します。

これは既存の動作する JavaScript コードも TypeScript のコードであることを意味します。TypeScript の主な利点は、コード内の予期せぬ動作を強調表示し、バグの可能性を減らすことができることです。

本チュートリアルでは TypeScript の型システムに焦点を当てて、TypeScript の簡単な概要を説明します。

## 推論による型

TypeScript は JavaScript 言語を理解しており、多くのケースで型を生成します。
例えば、変数を作成して特定の値に代入する場合、TypeScript はその値を型として使用します。

```ts twoslash
let helloWorld = "Hello World";
//  ^?
```

JavaScript がどのように動作するのか理解することで、TypeScript は JavaScript コードを受け入れながらも型を持つ型システムを構築することができます。これにより、コードの中で型を明示するために余計な文字を追加することのない型システムを提供することができます。このようにして、上記の例では TypeScript は`helloWorld`が`string`であるということを認識します。

Visual Studio Code で JavaScript を書いていて、エディタの自動補完を使ったことがあるかもしれません。Visual Studio Code は、JavaScript での作業を簡単にするために内部で TypeScript を使用しています。

## 型の定義

JavaScript で使用できるデザインパターンは多岐にわたります。しかし、型を自動的に推論することを難しくしてしまうデザインパターン(例えば、動的プログラミングを使用するパターンなど)もあります。このようなケースをカバーするために、TypeScript は JavaScript 言語の拡張機能をサポートし、TypeScript に型が何であるかを伝えるためのスペースを確保しています。

例えば、`name: string`と`id: number`を含む、推論された型を持つオブジェクトを作成するには、次のように記述できます:

```ts twoslash
const user = {
  name: "Hayes",
  id: 0,
};
```

このオブジェクトの形状は、`interface`宣言を使って明示的に記述することができます:

```ts twoslash
interface User {
  name: string;
  id: number;
}
```

変数宣言の後に`: TypeName`といった構文を使うことで、JavaScript オブジェクトが新しい`interface`の形状に適合することを宣言することができます。

```ts twoslash
interface User {
  name: string;
  id: number;
}
// ---cut---
const user: User = {
  name: "Hayes",
  id: 0,
};
```

もし定義したインターフェースと一致しないオブジェクトを作成した場合は、TypeScript は警告を発します:

```ts twoslash
// @errors: 2322
interface User {
  name: string;
  id: number;
}

const user: User = {
  username: "Hayes",
  id: 0,
};
```

JavaScript はクラスおよびオブジェクト指向プログラミングをサポートしているため、TypeScript も同様にサポートしています。そのためクラスを使ったインターフェース宣言を使うことができます:

```ts twoslash
interface User {
  name: string;
  id: number;
}

class UserAccount {
  name: string;
  id: number;

  constructor(name: string, id: number) {
    this.name = name;
    this.id = id;
  }
}

const user: User = new UserAccount("Murphy", 1);
```

インターフェースを使ってパラメータや関数の戻り値に型注釈を付けることができます:

```ts twoslash
// @noErrors
interface User {
  name: string;
  id: number;
}
// ---cut---
function getAdminUser(): User {
  //...
}

function deleteUser(user: User) {
  // ...
}
```

`boolean`、`bigint`、`null`、`number`、`string`、`symbol`、`object`および`undefined`という JavaScript で利用可能なプリミティブな型がわずかですが存在しており、これらはインターフェース内で使用できます。TypeScript はこれらを少し拡張しています。例えば、`any`(何でも許可する)や、[`unknown`](/play#example/unknown-and-never)(この型を使う人に、型が何であるかを宣言させる)、[`never`](/play#example/unknown-and-never) (この型が生じる可能性がない)、そして`void` (`undefined`を返す、あるいは戻り値がない関数)があります。

型を構築するための構文は[インターフェースと型エイリアス](/play/?e=83#example/types-vs-interfaces)の 2 つあります。基本は`interface`を、特定の機能が必要な場合は`type`を使うと良いでしょう。

## 型の組み合わせ

TypeScript では、単純な型を組み合わせて複雑な型を作ることができます。よく用いられる方法としては、Union を使う方法とジェネリクスを使う方法の 2 つがあります。

### Unions

Union では、型を多くの型のうちの一つであると宣言することができます。例えば、`boolean`型を`true`あるは`false`のどちらかであると記述することができます:

```ts twoslash
type MyBool = true | false;
```

_注意:_ 上記の`MyBool`にマウスカーソルを合わせると、`boolean`に分類されていることが分かります。これは構造的型システムの特性です。このことについては後述します。

Union 型は、ある値が許可される`string`や`number`の[リテラル](/docs/handbook/literal-types.html)の集合を記述するためによく使用されます。

```ts twoslash
type WindowStates = "open" | "closed" | "minimized";
type LockStates = "locked" | "unlocked";
type OddNumbersUnderTen = 1 | 3 | 5 | 7 | 9;
```

Union では、異なる型を扱うこともできます。例えば、`array`あるいは`string`を受け取る関数があるかもしれません:

```ts twoslash
function getLength(obj: string | string[]) {
  return obj.length;
}
```

変数の型を知るには`typeof`を使用します:

| 型        | 述語                               |
| --------- | ---------------------------------- |
| string    | `typeof s === "string"`            |
| number    | `typeof n === "number"`            |
| boolean   | `typeof b === "boolean"`           |
| undefined | `typeof undefined === "undefined"` |
| function  | `typeof f === "function"`          |
| array     | `Array.isArray(a)`                 |

例えば、関数に、文字列あるいは配列を渡すかどうかによって異なる値を返すようにすることができます。

<!-- prettier-ignore -->
```ts twoslash
function wrapInArray(obj: string | string[]) {
  if (typeof obj === "string") {
    return [obj];
//          ^?
  } else {
    return obj;
  }
}
```

### ジェネリクス

ジェネリクスは型に変数を提供します。よく使われるのは配列です。ジェネリクスを使わない配列は任意の値を含むことができます。ジェネリクスを使った配列は、その配列が含むことのできる値を記述できます。

```ts
type StringArray = Array<string>;
type NumberArray = Array<number>;
type ObjectWithNameArray = Array<{ name: string }>;
```

ジェネリクスを使用する独自の型を宣言することができます:

```ts twoslash
// @errors: 2345
interface Backpack<Type> {
  add: (obj: Type) => void;
  get: () => Type;
}

// 次の行はTypeScriptに`backpack`という定数があることを伝え、
// それがどこで定義されているのかを気にしないように伝える省略表現です。
declare const backpack: Backpack<string>;

// 上記でBackpackの変数部分として文字列を宣言したため、objectは文字列です。
const object = backpack.get();

// 変数部分は文字列なので、add関数に数値を渡すことはできません。
backpack.add(23);
```

## 構造的型システム

TypeScript の中心となる原則の一つは、型チェックは値が持つ _形状_ に焦点を当てるというものです。これは"ダックタイピング"や、あるいは"構造的型付け"と呼ばれることがあります。

構造的型システムでは、2 つのオブジェクトが同じ形状ならば、それらは同じ型であるとみなされます。

```ts twoslash
interface Point {
  x: number;
  y: number;
}

function logPoint(p: Point) {
  console.log(`${p.x}, ${p.y}`);
}

// "12, 26"と出力されます
const point = { x: 12, y: 26 };
logPoint(point);
```

`point`変数は`Point`型として宣言されていません。しかし、TypeScript は型チェックにおいて、`point`の形状と`Point`の形状を比較します。2 つは同じ形状であるため、コードは型チェックをパスします。

オブジェクトのフィールドの部分集合が一致するだけでも形状は一致しているとみなされます

```ts twoslash
// @errors: 2345
interface Point {
  x: number;
  y: number;
}

function logPoint(p: Point) {
  console.log(`${p.x}, ${p.y}`);
}
// ---cut---
const point3 = { x: 12, y: 26, z: 89 };
logPoint(point3); // "12, 26"と出力されます

const rect = { x: 33, y: 3, width: 30, height: 80 };
logPoint(rect); // "33, 3"と出力されます

const color = { hex: "#187ABF" };
logPoint(color);
```

クラスおよびオブジェクトがどのように形状に一致するかについて違いはありません:

```ts twoslash
// @errors: 2345
interface Point {
  x: number;
  y: number;
}

function logPoint(p: Point) {
  console.log(`${p.x}, ${p.y}`);
}
// ---cut---
class VirtualPoint {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

const newVPoint = new VirtualPoint(13, 56);
logPoint(newVPoint); // "13, 56"と出力されます
```

オブジェクトやクラスが必要なプロパティをすべて持っていれば、実装の詳細に関わらず、TypeScript はそれらが一致しているとみなします。

## 次のステップ

以上、TypeScript でよく使われる構文とツールについての簡単な概要でした。ここから以下のステップに進むことができます:

- ハンドブックを[始めから終わりまで](/docs/handbook/intro.html)読む (30 分)
- [Playground の例](/play#show-examples)を探る
