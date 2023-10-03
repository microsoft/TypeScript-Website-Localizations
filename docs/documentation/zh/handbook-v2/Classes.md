---
title: 类
layout: docs
permalink: /zh/docs/handbook/2/classes.html
oneline: "TypeScript 的类如何工作"
---

<blockquote class='bg-reading'>
  <p>背景阅读：<br /><a href='https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes'>Classes (MDN)</a></p>
</blockquote>

TypeScript 提供对 ES2015 中被引入的 `class` 关键字的完全支持。

和其他 JavaScript 语言功能一样，TypeScript 添加了类型注解和其他语法来允许你表达类和其他类型之间的关系。

## 类成员

这里有一个最基础的类 - 空的类：

```ts twoslash
class Point {}
```

这个类还不怎么有用，所以让我们开始添加一些成员。

### 字段

字段声明在类中创造了一个公开的可写属性：

```ts twoslash
// @strictPropertyInitialization: false
class Point {
  x: number;
  y: number;
}

const pt = new Point();
pt.x = 0;
pt.y = 0;
```

与其他部分一样，类型注解是可选的，但是如果未指定，则隐式声明为 `any`。

字段也可也有 _初始化器_；初始化器将在类实例化时自动执行。

```ts twoslash
class Point {
  x = 0;
  y = 0;
}

const pt = new Point();
// 打印 0, 0
console.log(`${pt.x}, ${pt.y}`);
```

像 `const`，`let` 和 `var` 一样，类的属性的初始化器可以用于推导其类型。

```ts twoslash
// @errors: 2322
class Point {
  x = 0;
  y = 0;
}
// ---cut---
const pt = new Point();
pt.x = "0";
```

#### `--strictPropertyInitialization`

[`strictPropertyInitialization`（严格属性初始化）](/tsconfig#strictPropertyInitialization)设置控制是否需要在构造函数中初始化类字段。

```ts twoslash
// @errors: 2564
class BadGreeter {
  name: string;
}
```

```ts twoslash
class GoodGreeter {
  name: string;

  constructor() {
    this.name = "hello";
  }
}
```

注意，字段需要在 _构造函数中初始化_。
TypeScript 不分析从构造函数中调用其他方法的初始化，因为派生类可能覆盖那些方法，并且没能初始化那些成员。

如果你明确打算通过构造函数以外的方式初始化字段（例如也许一个外部库为你的类填充），你可以使用 _确定赋值断言运算符_ `!`：

```ts twoslash
class OKGreeter {
  // 未初始化，但不是错误
  name!: string;
}
```

### `readonly`

字段可以有 `readonly` 修饰符作为前缀。
这将保护在构造函数之外对字段的赋值。

```ts twoslash
// @errors: 2540 2540
class Greeter {
  readonly name: string = "world";

  constructor(otherName?: string) {
    if (otherName !== undefined) {
      this.name = otherName;
    }
  }

  err() {
    this.name = "不行";
  }
}
const g = new Greeter();
g.name = "也不行";
```

### 构造函数

<blockquote class='bg-reading'>
   <p>背景阅读：<br />
   <a href='https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/constructor'>Constructor (MDN)</a><br/>
   </p>
</blockquote>

类的构造函数和普通函数非常相似。
你可以为参数添加类型注解，默认值和重载：

```ts twoslash
class Point {
  x: number;
  y: number;

  // 具有默认值的普通签名
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
}
```

```ts twoslash
class Point {
  // 重载
  constructor(x: number, y: string);
  constructor(s: string);
  constructor(xs: any, y?: any) {
    // 待定
  }
}
```

类的构造函数签名和函数签名之间只有几个区别:

- 构造函数不能有类型参数 - 这些参数属于外部的类声明，我们稍后将对此进行学习
- 构造函数不能有返回类型注解 - 返回的内容始终是类实例类型

#### Super 调用

就像在 JavaScript 中一样，如果你有一个基类，你需要在使用任何 `this.` 成员之前在构造函数体中调用 `super();`：

```ts twoslash
// @errors: 17009
class Base {
  k = 4;
}

class Derived extends Base {
  constructor() {
    // 在 ES5 中打印错误的值；在 ES6 中抛出异常
    console.log(this.k);
    super();
  }
}
```

忘记调用 `super` 在 JavaScript 中是一个容易犯的错误，但 TypeScript 会在必要时告诉你。

### 方法

<blockquote class='bg-reading'>
   <p>背景阅读：<br />
   <a href='https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Method_definitions'>Method definitions</a><br/>
   </p>
</blockquote>

类里的函数类型的属性称为 _方法_。
方法可以使用与函数和构造函数相同的类型注解：

```ts twoslash
class Point {
  x = 10;
  y = 10;

  scale(n: number): void {
    this.x *= n;
    this.y *= n;
  }
}
```

除了标准类型注解之外，TypeScript 不会向方法添加任何其他新内容。

注意在方法内部，仍然需要通过 `this` 访问字段和其他方法。
方法体中的非限定名称将始终引用封闭作用域中的内容：

```ts twoslash
// @errors: 2322
let x: number = 0;

class C {
  x: string = "hello";

  m() {
    // 这将试图修改第 1 行中的 `x`，而不是类的属性
    x = "world";
  }
}
```

### Getters / Setters

类还可以具有 _访问器_：

```ts twoslash
class C {
  _length = 0;
  get length() {
    return this._length;
  }
  set length(value) {
    this._length = value;
  }
}
```

> 注意，没有额外逻辑的 get/set 字段在 JavaScript 中没什么用。
> 如果你在 get/set 操作中不需要添加其他逻辑，则可以暴露为公共字段。

TypeScript 对访问器有一些特殊的推导规则：

- 如果 `get` 存在，但 `set` 不存在，则该属性自动为 `readonly`
- 如果未指定 setter 参数的类型，则可以根据 getter 的返回类型推断
- Getters 和 Setters 必须有着相同的 [成员可见性](#成员可见性)

从 [TypeScript 4.3](https://devblogs.microsoft.com/typescript/announcing-typescript-4-3/) 开始，setter 的类型参数允许使用联合类型。

```ts twoslash
class Thing {
  _size = 0;

  get size(): number {
    return this._size;
  }

  set size(value: string | number | boolean) {
    let num = Number(value);

    // 不允许 NaN, Infinity, 等等
    if (!Number.isFinite(num)) {
      this._size = 0;
      return;
    }

    this._size = num;
  }
}
```

### 索引签名

类可以声明索引签名；与[其他对象类型的索引签名](/docs/handbook/2/objects.html#index-signatures)进行相同工作：

```ts twoslash
class MyClass {
  [s: string]: boolean | ((s: string) => boolean);

  check(s: string) {
    return this[s] as boolean;
  }
}
```

由于索引签名类型还需要捕获方法的类型，要有效地使用这些类型并不容易。
一般来说，最好将索引数据存储在另一个位置，而不是存储在类实例自身上。

## 类层次

和具有面向对象功能的其他语言一样，JavaScript 中的类可以从基类继承。

### `implements` 子句

你可以使用 `implements` 子句来检查类是否满足特定的 `interface`。
如果类没有正确实现它，则会产生错误：

```ts twoslash
// @errors: 2420
interface Pingable {
  ping(): void;
}

class Sonar implements Pingable {
  ping() {
    console.log("ping!");
  }
}

class Ball implements Pingable {
  pong() {
    console.log("pong!");
  }
}
```

类也可以实现多个接口，例如 `class C implements A, B {`。

#### 警告

一个重点需要理解：`implements` 子句只检查该类是否可以视为接口类型。
它 _完全_ 不会更改类的类型或其方法。
一个常见的错误来源是假设 `implements` 子句将更改类类型 - 它不会！

```ts twoslash
// @errors: 7006
interface Checkable {
  check(name: string): boolean;
}

class NameChecker implements Checkable {
  check(s) {
    // 注意，此处没有错误
    return s.toLowercse() === "ok";
    //         ^？
  }
}
```

在这个例子中，我们可能期待 `s` 的类型会受到 `check` 的 `name: string` 参数的影响。
它不是 - `implements` 子句不会改变如何检查类体或其类型推断。

同样，实现具有可选属性的接口不会创建该属性：

```ts twoslash
// @errors: 2339
interface A {
  x: number;
  y?: number;
}
class C implements A {
  x = 0;
}
const c = new C();
c.y = 10;
```

### `extends` 子句

<blockquote class='bg-reading'>
   <p>背景阅读：<br />
   <a href='https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/extends'>extends keyword (MDN)</a><br/>
   </p>
</blockquote>

类可以从基类 `extends`。
派生类具有其基类的所有属性和方法，并且可以定义其他成员。

```ts twoslash
class Animal {
  move() {
    console.log("继续前进！");
  }
}

class Dog extends Animal {
  woof(times: number) {
    for (let i = 0; i < times; i++) {
      console.log("汪！");
    }
  }
}

const d = new Dog();
// 基类方法
d.move();
// 派生类方法
d.woof(3);
```

#### 重写方法

<blockquote class='bg-reading'>
   <p>背景阅读：<br />
   <a href='https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super'>super keyword (MDN)</a><br/>
   </p>
</blockquote>

派生类还可以重写基类字段或属性。
可以使用 `super.` 语法来访问基类方法。
注意，由于 JavaScript 的类是一个简单的查找对象，因此没有“超级字段”的概念。

TypeScript 强制派生类始终是其基类的子类型。

例如，下面是重写方法的合法方法：

```ts twoslash
class Base {
  greet() {
    console.log("Hello, world!");
  }
}

class Derived extends Base {
  greet(name?: string) {
    if (name === undefined) {
      super.greet();
    } else {
      console.log(`Hello, ${name.toUpperCase()}`);
    }
  }
}

const d = new Derived();
d.greet();
d.greet("reader");
```

重要的一点是，派生类遵守其的基类约定。
记住，通过基类引用引用派生类实例非常常见（并且总是合法！）：

```ts twoslash
class Base {
  greet() {
    console.log("Hello, world!");
  }
}
declare const d: Base;
// ---cut---
// 通过基类的引用引用派生类的实例
const b: Base = d;
// 没问题
b.greet();
```

如果 `Derived` 没有遵守 `Base` 的约定怎么办？

```ts twoslash
// @errors: 2416
class Base {
  greet() {
    console.log("Hello, world!");
  }
}

class Derived extends Base {
  // 使这个参数为必要
  greet(name: string) {
    console.log(`Hello, ${name.toUpperCase()}`);
  }
}
```

如果我们不管错误编译此代码，则这个例子将触发崩溃：

```ts twoslash
declare class Base {
  greet(): void;
}
declare class Derived extends Base {}
// ---cut---
const b: Base = new Derived();
// 崩溃，因为 `name` 未定义
b.greet();
```

#### 纯类型字段声明

当 `target >= ES2022` 或 [`useDefineForClassFields`](/tsconfig#useDefineForClassFields) 为 `true` 时，类字段将在父类构造函数完成后初始化，覆盖父类设置的任何值。当你只想为继承的字段重新声明为更准确的类型时，这可能是一个问题。若要处理这种情况，可以使用 `declare` 来向 TypeScript 指示此字段声明不应有运行时效果。

```ts twoslash
interface Animal {
  dateOfBirth: any;
}

interface Dog extends Animal {
  breed: any;
}

class AnimalHouse {
  resident: Animal;
  constructor(animal: Animal) {
    this.resident = animal;
  }
}

class DogHouse extends AnimalHouse {
  // 不会生成 JavaScript 代码，
  // 只确保类型正确
  declare resident: Dog;
  constructor(dog: Dog) {
    super(dog);
  }
}
```

#### 初始化顺序

某些情况下，JavaScript 类的初始化顺序可能令人惊讶。
让我们考虑如下代码：

```ts twoslash
class Base {
  name = "基";
  constructor() {
    console.log("我的名字是 " + this.name);
  }
}

class Derived extends Base {
  name = "派生";
}

// 打印 "基" 而不是 "派生"
const d = new Derived();
```

发生了什么？

根据 JavaScript 所定义的类初始化的顺序是：

- 初始化基类字段
- 基类构造函数运行
- 初始化派生类字段
- 派生类构造函数运行

这意味着基类构造函数在其自己的构造函数中看到了自己的 `name` 值，因为派生类字段的初始化尚未运行。

#### 继承内置类型

> 注意：如果你不打算继承 `Array`, `Error`, `Map` 等内置类型，或者你的编译目标明确设置为 `ES6`/`ES2015` 或更高版本，则可以跳过本节

在 ES2015 中，返回对象的构造函数隐式地将 `this` 的值替换为 `super(...)` 的任何调用方。
生成的构造函数代码必须捕获 `super(...)` 的任何潜在返回值，并将其替换为 `this`。

因此，继承 `Error`，`Array` 和其他类型可能不按预期工作。
这是因为 `Error`，`Array` 等的构造函数使用 ECMAScript 6 的 `new.target` 来调整原型链；
但是，在 ECMAScript 5 中调用构造函数时，无法确保 `new.target` 的值。
默认情况下，其他向下编译器通常具有相同的限制。

对于如下所示的子类：

```ts twoslash
class MsgError extends Error {
  constructor(m: string) {
    super(m);
  }
  sayHello() {
    return "hello " + this.message;
  }
}
```

你可能会发现：

- 方法可能是子类型返回到一个 `undefined` 的对象，因此 `sayHello` 的调用将导致错误。
- `instanceof` 可能会在子类和它们的实例间失效，所以 `(new MsgError()) instanceof MsgError` 将返回 `false`。

作为建议，你可以手动的在任何 `super(...)` 调用前立即调整原型。

```ts twoslash
class MsgError extends Error {
  constructor(m: string) {
    super(m);

    // 显式设置原型。
    Object.setPrototypeOf(this, MsgError.prototype);
  }

  sayHello() {
    return "hello " + this.message;
  }
}
```

但是，`MsgError` 的任何子类也必须手动设置原型。
对于不支持 [`Object.setPrototypeOf`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf) 的运行时，你可以使用 [`__proto__`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/proto) 替代。

不幸的是，[这些解决方法不适用于 IE 10 以及更早版本](<https://msdn.microsoft.com/en-us/library/s4esdbwz(v=vs.94).aspx>).
可以手动将方法从原型复制到实例本身（例如 `MsgError.prototype` 到 `this`），但原型链本身无法固定。

## 成员可见性

TypeScript 可以控制某些方法或属性是否对类外部的代码可见。

### `public`

类成员的默认可见性为 `public`。
`public` 成员可以被任何地方访问：

```ts twoslash
class Greeter {
  public greet() {
    console.log("嗨！");
  }
}
const g = new Greeter();
g.greet();
```

由于 `public` 是默认的可见性修饰符，因此永远不 _需要_ 在类成员上编写它，但可能会出于风格/可读性原因选择这样做。

### `protected`

`protected` 成员仅对该类的子类可见。

```ts twoslash
// @errors: 2445
class Greeter {
  public greet() {
    console.log("Hello, " + this.getName());
  }
  protected getName() {
    return "嗨！";
  }
}

class SpecialGreeter extends Greeter {
  public howdy() {
    // 可以在此处访问受保护的成员
    console.log("Howdy, " + this.getName());
    //                          ^^^^^^^^^^^^^^
  }
}
const g = new SpecialGreeter();
g.greet(); // 可行
g.getName();
```

#### Exposure of `protected` members

派生类需要遵守其基类的约定，但可能会选择公开具有更多功能的基类的子类型。
这包括使 `protected` 成员 `public`：

```ts twoslash
class Base {
  protected m = 10;
}
class Derived extends Base {
  // 无修饰符，因此默认值为 `public`
  m = 15;
}
const d = new Derived();
console.log(d.m); // 可行
```

注意， `Derived` 已经能够自由地读写 `m`，因此这不会有意义地改变这种情况的“安全性”。
这里要注意的主要一点是，在派生类中，如果为了不是故意暴露，我们需要小心地重复 `protected` 修饰符。

#### 跨层次 `protected` 访问

不同的 OOP 语言对通过基类引用访问 `protected` 成员是否合法存在分歧：

```ts twoslash
// @errors: 2446
class Base {
  protected x: number = 1;
}
class Derived1 extends Base {
  protected x: number = 5;
}
class Derived2 extends Base {
  f1(other: Derived2) {
    other.x = 10;
  }
  f2(other: Base) {
    other.x = 10;
  }
}
```

例如，Java 认为这合法。
另一方面，C# 和 C++ 决定此代码非法。

TypeScript 与 C# 和 C++ 站在一起，因为只有通过 `Derived2` 及其子类型访问 `x` 才合法，`Derived1` 并不包含在内。
此外，如果通过一个 `Derived1` 访问 `x` 合法（当然是这样！），然后通过基类的引用访问它，永远不会改善这种情况。

参见 [为什么我无法从派生类访问受保护的成员？](https://blogs.msdn.microsoft.com/ericlippert/2005/11/09/why-cant-i-access-a-protected-member-from-a-derived-class/) 以获得更多的 C# 对此的解释。

### `private`

`private` 类似 `protected`，但是禁止子类访问成员：

```ts twoslash
// @errors: 2341
class Base {
  private x = 0;
}
const b = new Base();
// 无法从类外部访问
console.log(b.x);
```

```ts twoslash
// @errors: 2341
class Base {
  private x = 0;
}
// ---cut---
class Derived extends Base {
  showX() {
    // 无法从子类访问
    console.log(this.x);
  }
}
```

由于 `private` 成员对派生类不可见，因此派生类无法增加其可见性：

```ts twoslash
// @errors: 2415
class Base {
  private x = 0;
}
class Derived extends Base {
  x = 1;
}
```

#### 跨层次 `private` 访问

不同的 OOP 语言对同一类的不同实例是否可以访问彼此的 `private` 成员存在分歧。
像 C++、Java、C#、Swift 和 PHP 这样的语言允许这样做，但 Ruby 不允许。

TypeScript 允许跨层次 `private` 访问：

```ts twoslash
class A {
  private x = 10;

  public sameAs(other: A) {
    // 没有错误
    return other.x === this.x;
  }
}
```

#### 警告

和 TypeScript 的类型系统的其他方面一样，`private` 和 `protected` [仅在类型检查期间强制执行](https://www.typescriptlang.org/play?removeComments=true&target=99&ts=4.3.4#code/PTAEGMBsEMGddAEQPYHNQBMCmVoCcsEAHPASwDdoAXLUAM1K0gwQFdZSA7dAKWkoDK4MkSoByBAGJQJLAwAeAWABQIUH0HDSoiTLKUaoUggAW+DHorUsAOlABJcQlhUy4KpACeoLJzrI8cCwMGxU1ABVPIiwhESpMZEJQTmR4lxFQaQxWMm4IZABbIlIYKlJkTlDlXHgkNFAAbxVQTIAjfABrAEEC5FZOeIBeUAAGAG5mmSw8WAroSFIqb2GAIjMiIk8VieVJ8Ar01ncAgAoASkaAXxVr3dUwGoQAYWpMHBgCYn1rekZmNg4eUi0Vi2icoBWJCsNBWoA6WE8AHcAiEwmBgTEtDovtDaMZQLM6PEoQZbA5wSk0q5SO4vD4-AEghZoJwLGYEIRwNBoqAzFRwCZCFUIlFMXECdSiAhId8YZgclx0PsiiVqOVOAAaUAFLAsxWgKiC35MFigfC0FKgSAVVDTSyk+W5dB4fplHVVR6gF7xJrKFotEk-HXIRE9PoDUDDcaTAPTWaceaLZYQlmoPBbHYx-KcQ7HPDnK43FQqfY5+IMDDISPJLCIuqoc47UsuUCofAME3Vzi1r3URvF5QV5A2STtPDdXqunZDgDaYlHnTDrrEAF0dm28B3mDZg6HJwN1+2-hg57ulwNV2NQGoZbjYfNrYiENBwEFaojFiZQK08C-4fFKTVCozWfTgfFgLkeT5AUqiAA)。

这意味着 JavaScript 运行时构造（如 `in` 或简单属性查找）仍然可以访问 `private` 或 `protected` 成员：

```ts twoslash
class MySafe {
  private secretKey = 12345;
}
```

```js
// 在 JavaScript 文件中...
const s = new MySafe();
// 将打印 12345
console.log(s.secretKey);
```

`private` 还允许在类型检查期间使用括号表示法进行访问。这使得 `private` 声明的字段可能更容易被单元测试之类的东西访问，缺点是这些字段是 _软私有_ 并且没有严格执行私有策略。

```ts twoslash
// @errors: 2341
class MySafe {
  private secretKey = 12345;
}

const s = new MySafe();

// 类型检查期间不允许
console.log(s.secretKey);

// 可行
console.log(s["secretKey"]);
```

不像 TypeScripts 的 `private`，JavaScript 的[私有字段](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields)（`#`）在编译后保持私有，并且不提供前面提到的逃脱出口，如括号表示法访问，使它们 _硬私有_。

```ts twoslash
class Dog {
  #barkAmount = 0;
  personality = "高兴";

  constructor() {}
}
```

```ts twoslash
// @target: esnext
// @showEmit
class Dog {
  #barkAmount = 0;
  personality = "高兴";

  constructor() {}
}
```

编译到 ES2021 或更低版本时，TypeScript 将使用 WeakMaps 代替 `#`。

```ts twoslash
// @target: es2015
// @showEmit
class Dog {
  #barkAmount = 0;
  personality = "happy";

  constructor() {}
}
```

如果需要保护类中的值免受恶意参与者的攻击，则应使用提供硬运行时私有的机制，例如闭包、WeakMaps 或私有字段。请注意，这些在运行时添加的私有检查可能会影响性能。

## 静态成员

<blockquote class='bg-reading'>
   <p>背景阅读：<br />
   <a href='https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/static'>Static Members (MDN)</a><br/>
   </p>
</blockquote>

类可以具有 `静态` 成员。
这些成员不与类的特定实例相关联。
它们可以通过类构造函数对象本身进行访问：

```ts twoslash
class MyClass {
  static x = 0;
  static printX() {
    console.log(MyClass.x);
  }
}
console.log(MyClass.x);
MyClass.printX();
```

静态成员也可以有 `public`，`protected` 和 `private` 可见性修饰符：

```ts twoslash
// @errors: 2341
class MyClass {
  private static x = 0;
}
console.log(MyClass.x);
```

静态成员也被继承：

```ts twoslash
class Base {
  static getGreeting() {
    return "Hello world";
  }
}
class Derived extends Base {
  myGreeting = Derived.getGreeting();
}
```

### 特殊静态成员名

通常，覆盖 `Function` 原型的属性不安全/不可能。

由于类本身是可以使用 `new` 调用的函数，因此有些名字不能作为 `static` 使用。
函数属性例如 `name`, `length` 和 `call` 不能合法的定义为 `static` 成员：

```ts twoslash
// @errors: 2699
class S {
  static name = "S!";
}
```

### 为什么没有静态类？

TypeScript（和 JavaScript）没有与 C# 相同的称为 `static class` 的构造。

这些构造 _只_ 存在与，强制所有数据和函数都位于一个类中的语言。因为该限制在 TypeScript 中不存在，所以不需要它们。
在 JavaScript/TypeScript 中只有一个实例的类典型的只是一个普通的 _对象_。

例如，我们在 TypeScript 中不需要“静态类”语法，因为普通对象（甚至是顶级函数）也可以完成这项工作：

```ts twoslash
// 不必要的“静态”类
class MyStaticClass {
  static doSomething() {}
}

// 首选（备选 1）
function doSomething() {}

// 次选 (备选 2)
const MyHelperObject = {
  dosomething() {},
};
```

## 类中的 `static` 块

静态块允许你编写一系列具有自己的作用域的语句，这些语句可以访问此类中的私有字段。这意味着我们可以编写具有全部功能的初始化代码，没有泄漏变量，并且可以完全访问我们类的内部结构。

```ts twoslash
declare function loadLastInstances(): any[]
// ---cut---
class Foo {
    static #count = 0;

    get count() {
        return Foo.#count;
    }

    static {
        try {
            const lastInstances = loadLastInstances();
            Foo.#count += lastInstances.length;
        }
        catch {}
    }
}
```

## 泛型类

和接口一样，类也可以是泛型的。
当泛型类使用 `new` 实例化时，其类型参数的推断方式与在函数调用中相同：

```ts twoslash
class Box<Type> {
  contents: Type;
  constructor(value: Type) {
    this.contents = value;
  }
}

const b = new Box("hello!");
//    ^?
```

类可以像接口一样使用泛型约束和默认值。

### 静态成员的类型参数

此代码不合法，原因可能并不明显：

```ts twoslash
// @errors: 2302
class Box<Type> {
  static defaultValue: Type;
}
```

请记住，类型总是被完全擦除！
在运行时，只有 _一个_ `Box.defaultValue` 属性。
这意味着设置 `Box<string>.defaultValue`（如果可能的话）_也_ 更改 `Box<number>.defaultValue` - 不好。
泛型类的 `static` 成员永远不能引用类的类型参数。

## 类的 `this` 在运行时的表现

<blockquote class='bg-reading'>
   <p>背景阅读：<br />
   <a href='https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this'>this keyword (MDN)</a><br/>
   </p>
</blockquote>

需要记住重要的一点：TypeScript 不会改变 JavaScript 的运行时行为，并且 JavaScript 以运行时行为特殊而闻名。

JavaScript 对 `this` 的处理确实不寻常：

```ts twoslash
class MyClass {
  name = "我的类";
  getName() {
    return this.name;
  }
}
const c = new MyClass();
const obj = {
  name: "对象",
  getName: c.getName,
};

// 打印“对象”，而不是“我的类”
console.log(obj.getName());
```

长话短说，默认情况下函数中的 `this` 值取决于 _函数被如何调用_.
在此示例中，由于函数是通过 `obj` 的引用调用的，因此 `this` 是 `obj` 而不是类实例。

这和你想要的不符！
TypeScript 提供了一些方法来缓解或防止此类错误。

### 箭头函数

<blockquote class='bg-reading'>
   <p>背景阅读：<br />
   <a href='https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions'>Arrow functions (MDN)</a><br/>
   </p>
</blockquote>

如果你有一个通常以丢失其 `this` 上下文的方式调用的函数，则可以有意使用使用箭头函数属性而不是方法定义：

```ts twoslash
class MyClass {
  name = "我的类";
  getName = () => {
    return this.name;
  };
}
const c = new MyClass();
const g = c.getName;
// 打印“我的类”，而不是崩溃
console.log(g());
```

这需要一些权衡：

- `this` 值保证在运行时是正确的，即使对于未使用 TypeScript 检查的代码也是如此
- 这将使用更多的内存，因为每个类实例都以这种方式定义每个自己的函数的副本
- 不能在派生类中使用 `super.getName`，因为原型链中没有用于从中获取基类方法的入口

### `this` 参数

在方法或函数定义中，名为 `this` 的起始参数在 TypeScript 中具有特殊含义。
这些参数在编译过程中被移除：

```ts twoslash
type SomeType = any;
// ---cut---
// TypeScript 使用 'this'
function fn(this: SomeType, x: number) {
  /* ... */
}
```

```js
// 输出的 JavaScript
function fn(x) {
  /* ... */
}
```

TypeScript 检查使用 `this` 参数调用的函数是否是在正确的上下文中完成的。
我们可以在方法定义中添加一个 `this` 参数，而不是使用箭头函数，静态的强制确保正确调用该方法：

```ts twoslash
// @errors: 2684
class MyClass {
  name = "MyClass";
  getName(this: MyClass) {
    return this.name;
  }
}
const c = new MyClass();
// 可行
c.getName();

// 错误，导致崩溃
const g = c.getName;
console.log(g());
```

此方法和箭头函数方法需要进行相反的权衡：

- JavaScript 调用方可能仍然错误地使用类方法，而没有意识到它。
- 每个类定义只分配一个函数，而不是每个类实例有一个函数。
- 基类方法定义仍可通过 `super` 调用。

## `this` 类型

在类中，名为 `this` 的特殊类型将 _动态的_ 引用到当前类的类型。
让我们看看它的用处：

<!-- prettier-ignore -->
```ts twoslash
class Box {
  contents: string = "";
  set(value: string) {
//  ^?
    this.contents = value;
    return this;
  }
}
```

这里 TypeScript 推断出 `set` 的返回值为 `this` 而不是 `Box`。
让我们制作一个 `Box` 的子类型：

```ts twoslash
class Box {
  contents: string = "";
  set(value: string) {
    this.contents = value;
    return this;
  }
}
// ---cut---
class ClearableBox extends Box {
  clear() {
    this.contents = "";
  }
}

const a = new ClearableBox();
const b = a.set("hello");
//    ^?
```

你还可以在参数类型注释中使用 `this`：

```ts twoslash
class Box {
  content: string = "";
  sameAs(other: this) {
    return other.content === this.content;
  }
}
```

这与编写 `other: Box` 不同 - 如果你有一个派生类，它的 `sameAs` 方法现在将仅接受同一派生类的其他实例：

```ts twoslash
// @errors: 2345
class Box {
  content: string = "";
  sameAs(other: this) {
    return other.content === this.content;
  }
}

class DerivedBox extends Box {
  otherContent: string = "?";
}

const base = new Box();
const derived = new DerivedBox();
derived.sameAs(base);
```

### 基于 `this` 的类型保护

你可以在类和接口中的方法的返回位置使用 `this is Type`。
当和类型窄化混合时 (例如 `if` 语句)，目标对象的类型会被窄化为指定的 `Type`。

<!-- prettier-ignore -->
```ts twoslash
// @strictPropertyInitialization: false
class FileSystemObject {
  isFile(): this is FileRep {
    return this instanceof FileRep;
  }
  isDirectory(): this is Directory {
    return this instanceof Directory;
  }
  isNetworked(): this is Networked & this {
    return this.networked;
  }
  constructor(public path: string, private networked: boolean) {}
}

class FileRep extends FileSystemObject {
  constructor(path: string, public content: string) {
    super(path, false);
  }
}

class Directory extends FileSystemObject {
  children: FileSystemObject[];
}

interface Networked {
  host: string;
}

const fso: FileSystemObject = new FileRep("foo/bar.txt", "foo");

if (fso.isFile()) {
  fso.content;
// ^?
} else if (fso.isDirectory()) {
  fso.children;
// ^?
} else if (fso.isNetworked()) {
  fso.host;
// ^?
}
```

基于此类型的保护的一个常见用途是允许对特定字段进行延迟验证。例如，当 `hasValue` 被验证为真时，这种情况会从框内的值中删除 `undefined`：

```ts twoslash
class Box<T> {
  value?: T;

  hasValue(): this is { value: T } {
    return this.value !== undefined;
  }
}

const box = new Box();
box.value = "Gameboy";

box.value;
//  ^?

if (box.hasValue()) {
  box.value;
  //  ^?
}
```

## 参数属性

TypeScript 提供了将构造函数参数转换为具有相同名称和值的类属性的特殊语法。
这种语法被称为 _参数属性_，通过在构造函数的参数上添加一个 `public`，`private`，`protected` 或者 `readonly` 前缀完成。
生成的字段获得以下修饰符：

```ts twoslash
// @errors: 2341
class Params {
  constructor(
    public readonly x: number,
    protected y: number,
    private z: number
  ) {
    // 不再需要 body
  }
}
const a = new Params(1, 2, 3);
console.log(a.x);
//            ^?
console.log(a.z);
```

## 类表达式

<blockquote class='bg-reading'>
   <p>背景阅读：<br />
   <a href='https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/class'>Class expressions (MDN)</a><br/>
   </p>
</blockquote>

类表达式与类声明非常相似。
唯一真正的区别是类表达式不需要名称，尽管我们可以通过它们绑定的任何标识符来引用它们：

```ts twoslash
const someClass = class<Type> {
  content: Type;
  constructor(value: Type) {
    this.content = value;
  }
};

const m = new someClass("Hello, world");
//    ^?
```

## `abstract` 类和成员

TypeScript 中的类、方法和字段可以是 _抽象的_.

一个 _抽象方法_ 或 _抽象字段_ 是没有提供实现的声明。
这些成员必须存在于 _抽象类_，不能直接实例化。

抽象类的作用是充当实现所有抽象成员的子类的基类。
当一个类没有任何抽象成员时，它被称为 _具体类_。

让我们看一个例子：

```ts twoslash
// @errors: 2511
abstract class Base {
  abstract getName(): string;

  printName() {
    console.log("Hello, " + this.getName());
  }
}

const b = new Base();
```

我们不能用 `new` 来实例化 `Base`，因为它是抽象的。
相反，我们需要创建一个派生类并实现抽象成员：

```ts twoslash
abstract class Base {
  abstract getName(): string;
  printName() {}
}
// ---cut---
class Derived extends Base {
  getName() {
    return "world";
  }
}

const d = new Derived();
d.printName();
```

注意，如果我们忘记实现基类的抽象成员，将得到一个错误：

```ts twoslash
// @errors: 2515
abstract class Base {
  abstract getName(): string;
  printName() {}
}
// ---cut---
class Derived extends Base {
  // 忘记做任何事情
}
```

### 抽象构造签名

有时，你希望接受某个类构造函数，该函数生成从某个抽象类派生的类的实例。

例如，你可能希望编写以下代码：

```ts twoslash
// @errors: 2511
abstract class Base {
  abstract getName(): string;
  printName() {}
}
class Derived extends Base {
  getName() {
    return "";
  }
}
// ---cut---
function greet(ctor: typeof Base) {
  const instance = new ctor();
  instance.printName();
}
```

TypeScript 正确地告诉你你正在尝试实例化抽象类。
毕竟，考虑到 `greet` 的定义，编写这段代码完全合法，最终会尝试构造一个抽象类：

```ts twoslash
declare const greet: any, Base: any;
// ---cut---
// 坏！
greet(Base);
```

相反，你希望编写一个函数来接受带有构造签名的内容：

```ts twoslash
// @errors: 2345
abstract class Base {
  abstract getName(): string;
  printName() {}
}
class Derived extends Base {
  getName() {
    return "";
  }
}
// ---cut---
function greet(ctor: new () => Base) {
  const instance = new ctor();
  instance.printName();
}
greet(Derived);
greet(Base);
```

现在，TypeScript 正确地告诉你可以调用哪些类构造函数 - `Derived` 可以，因为它是具体的，但 `Base` 不能。

## 类之间的关系

在大多数情况下，TypeScript 会对类在结构上进行比较，与其他类型相同。

例如，这两个类可以相互代替，因为它们相同：

```ts twoslash
class Point1 {
  x = 0;
  y = 0;
}

class Point2 {
  x = 0;
  y = 0;
}

// 可行
const p: Point1 = new Point2();
```

同样，即使没有显式继承，类之间的子类型关系也存在：

```ts twoslash
// @strict: false
class Person {
  name: string;
  age: number;
}

class Employee {
  name: string;
  age: number;
  salary: number;
}

// 可行
const p: Person = new Employee();
```

这听起来很简单，但有一些情况似乎比其他情况更奇怪。

空类没有成员。
在结构化类型系统中，没有成员的类型通常是其他任何东西的超类。
因此，如果你写了一个空的类（不要！），任何东西都可以用来代替它：

```ts twoslash
class Empty {}

function fn(x: Empty) {
  // 不能用 'x’ 做任何事情，所以我不会
}

// 一切都如所愿！
fn(window);
fn({});
fn(fn);
```
