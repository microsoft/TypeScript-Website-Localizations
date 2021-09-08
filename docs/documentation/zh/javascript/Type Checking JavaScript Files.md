---
title: Type Checking JavaScript Files
layout: docs
permalink: /zh/docs/handbook/type-checking-javascript-files.html
oneline: 如何使用 TypeScript 给 JavaScript 文件添加类型检查
---

与 `.ts` 文件相比较，`.js` 文件的检查机制有一些明显的区别。

## 属性是从类主体中的赋值推断出来的

ES2015 没有方法在类里面声明其属性。属性是动态赋值的，就像对象字面量。

在 `.js` 文件中，编译器从类主体中的属性赋值推断属性。
属性的类型就是构造函数中所赋予的类型，除非在那里没有指定，或者在构造函数中指定的是 undefined 或者 null。
因此，类型是这些赋值中所有右侧值的类型的并集。
在构造函数中被定义的属性总是被设定为存在，而那些定义在方法、getters 或者 setters 中的就被看作是可选的。

```js twoslash
// @checkJs
// @errors: 2322
class C {
  constructor() {
    this.constructorOnly = 0;
    this.constructorUnknown = undefined;
  }
  method() {
    this.constructorOnly = false;
    this.constructorUnknown = "plunkbat"; // 没问题，constructorUnknown 的类型是 string | undefined
    this.methodOnly = "ok"; // 没问题，但是 methodOnly 的类型依然是 undefined
  }
  method2() {
    this.methodOnly = true; // 也没有问题， methodOnly 的类型是 string | boolean | undefined
  }
}
```

如果属性从来没有在类主体中设置过，那他们被认定为 unknown。
如果您的类中具有只能读取的属性，请在构造函数中添加声明，然后使用 JSDoc 对其进行注释，以指定类型。
如果以后才会对其进行初始化，您甚至不必给出值：

```js twoslash
// @checkJs
// @errors: 2322
class C {
  constructor() {
    /** @type {number | undefined} */
    this.prop = undefined;
    /** @type {number | undefined} */
    this.count;
  }
}

let c = new C();
c.prop = 0; // OK
c.count = "string";
```

## 构造函数与类是等同的

在 ES2015 之前，JavaScript 是使用构造器函数而非类。
编译器支持这种模式，且将构造器函数理解为等同于 ES2015 的类。
属性的推断规则与上述的方式完全相同。

```js twoslash
// @checkJs
// @errors: 2683 2322
function C() {
  this.constructorOnly = 0;
  this.constructorUnknown = undefined;
}
C.prototype.method = function () {
  this.constructorOnly = false;
  this.constructorUnknown = "plunkbat"; // OK, the type is string | undefined
};
```

## 支持 CommonJS 模块

在一个 `.js` 文件中，TypeScript 能理解 CommonJS 模块格式。
`exports` 与 `module.exports` 的赋值被认定为 export 声明。
类似的, `require` 方法的调用，被视为模块引入。例如:

```js
// 等同 `import module "fs"`
const fs = require("fs");

// 等同 `export function readFile`
module.exports.readFile = function (f) {
  return fs.readFileSync(f);
};
```

在语法上，Javascript 中的模块支持，比 TypeScript 的更具宽松。
其支持大多数赋值和声明的组合。
## 类型，函数和对象字面量都是命名空间

在 `.js` 文件中，类型是命名空间。
它可以用来嵌套类型，比如：

```js twoslash
class C {}
C.D = class {};
```

并且，对于 ES2015 之前的代码，它可以用来模仿静态方法：

```js twoslash
function Outer() {
  this.y = 2;
}

Outer.Inner = function () {
  this.yy = 2;
};

Outer.Inner();
```

它也可以用来创建一个简单的命名空间：

```js twoslash
var ns = {};
ns.C = class {};
ns.func = function () {};

ns;
```

也支持其它的变体：

```js twoslash
// IIFE
var ns = (function (n) {
  return n || {};
})();
ns.CONST = 1;

// defaulting to global
var assign =
  assign ||
  function () {
    // code goes here
  };
assign.extra = 1;
```

## 对象字面量是开放的

一个 `.ts` 文件中，一个初始化了变量声明的对象字面量，即赋予了其声明的类型。
不允许加入原始字面量中所未指定的新成员。
该规则在 `.js` 文件中变为宽松了；对象字面量有这开放的类型（索引签名），其允许添加和查看最初没有被定义的属性。
比如：

```js twoslash
var obj = { a: 1 };
obj.b = 2; // Allowed
```

对象字面量的这一行为就好像其有一个索引签名 `[x:string]: any`，这样使其作为开放的 map 对待，而非封闭对象。
就像其他特殊的 JS 检查行为，这些行为可以通过为其变量指定一个 JSDoc 类型而改变。比如：

```js twoslash
// @checkJs
// @errors: 2339
/** @type {{a: number}} */
var obj = { a: 1 };
obj.b = 2;
```

## null、undefined 和空数组初始化为 any 或者 any[] 类型

任何变量、参数或者属性，一旦被初始化为 `null` 或者 `undefined`，其类型就会为 any，即使开启了严格的 `null` 检查。
任何变量、参数或者属性，一旦被初始化为 `[]` ，其类型将为 `any[]`，即使开启了严格的 `null` 检查。
唯一的例外是如上所述具有多个初始值设定项的属性。

```js twoslash
function Foo(i = null) {
  if (!i) i = 1;
  var j = undefined;
  j = 2;
  this.l = [];
}

var foo = new Foo();
foo.l.push(foo.i);
foo.l.push("end");
```

## 函数的参数默认是可选的

由于在 ES2015 之前的 JavaScript中，没有办法制定参数的可选性，所以 `.js` 所有的方法的参数都被视为可选的。
调用时传递的参数少于所声明的个数，是被允许的。

需要注意的是，调用时传递过多的参数是错误的。

比如：

```js twoslash
// @checkJs
// @strict: false
// @errors: 7006 7006 2554
function bar(a, b) {
  console.log(a + " " + b);
}

bar(1); // 没问题，第二个参数被视为可选
bar(1, 2);
bar(1, 2, 3); // 报错了，传递过多的参数
```

JSDoc 注释的函数不在此规则之中。
使用 JSDoc 可选参数语法(`[` `]`)来表示可选性。比如：

```js twoslash
/**
 * @param {string} [somebody] - Somebody's name.
 */
function sayHello(somebody) {
  if (!somebody) {
    somebody = "John Doe";
  }
  console.log("Hello " + somebody);
}

sayHello();
```

## 使用了 `arguments` 的 Var-args 参数声明推断

如果一个函数体引用了 `arguments` 引用，则隐式认为该函数具有 var-arg 参数（就像`(...arg: any[]) => any`）。使用 JSDoc 的 var-arg 语法来指定参数的类型。

```js twoslash
/** @param {...number} args */
function sum(/* numbers */) {
  var total = 0;
  for (var i = 0; i < arguments.length; i++) {
    total += arguments[i];
  }
  return total;
}
```

## 未指定类型的参数被视为 `any` 类型

由于没有在 JavaScript 中没有指定泛型类型参数的自然语法，所以为制定类型的参数默认为 `any`。

### 在 extends 子句中

举个例子， `React.Component` 被定义为有两个参数，为 `Props` 和 `State`。
在 `.js` 文件中，没有合理的方式，在扩展子句中去指定它们，于是这两个参数就为 `any`：

```js
import { Component } from "react";

class MyComponent extends Component {
  render() {
    this.props.b; // Allowed, since this.props is of type any
  }
}
```

使用 `@augments` 来明确指定类型。比如：

```js
import { Component } from "react";

/**
 * @augments {Component<{a: number}, State>}
 */
class MyComponent extends Component {
  render() {
    this.props.b; // Error: b does not exist on {a:number}
  }
}
```

### 在JSDoc 参照中

JSDoc 中未指定类型的参数默认为 any：

```js twoslash
/** @type{Array} */
var x = [];

x.push(1); // 没问题
x.push("string"); // 没问题， x 的类型为 Array<any>

/** @type{Array.<number>} */
var y = [];

y.push(1); // 没问题
y.push("string"); // 报错， string 不能飞配给 number 类型
```

### 在函数调用中

泛型函数的调用，使用泛型参数来推断类型参数。有的时候这一过程无法推断出任何类型，主要是因为缺乏推断来源；因此，类型参数将默认设为 `any`。比如：

```js
var p = new Promise((resolve, reject) => {
  reject();
});

p; // Promise<any>;
```

了解JSDoc中的所有可用功能，请参阅 [此手册](/docs/handbook/jsdoc-supported-types.html)。
