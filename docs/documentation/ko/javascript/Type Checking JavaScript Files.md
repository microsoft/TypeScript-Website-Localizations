---
title: Type Checking JavaScript Files
layout: docs
permalink: /ko/docs/handbook/type-checking-javascript-files.html
oneline: How to add type checking to JavaScript files using TypeScript
---

`.ts` 파일과 `.js` 파일은 타입을 검사하는 방법에 몇 가지 주목할만한 차이점이 있습니다.

## 클래스 본문의 할당에서 추론된 프로퍼티 (Properties are inferred from assignments in class bodies)

ES2015에는 클래스에 프로퍼티를 선언할 수 있는 수단이 없습니다. 프로퍼티는 객체 리터럴과 같이 동적으로 할당됩니다.

`.js` 파일에서, 컴파일러는 클래스 본문 내부에서 할당된 프로퍼티로부터 프로퍼티들을 추론합니다.
생성자가 정의되어 있지 않거나, 생성자에서 정의된 타입이 `undefined`나 `null`이 아닐 경우, 프로퍼티의 타입은 생성자에서 주어진 타입과 동일합니다.
전자에 해당 프로퍼티의 경우, 할당되었던 모든 값들의 타입을 가진 유니언 타입이 됩니다.
생성자에 정의된 프로퍼티는 항상 존재하는 것으로 가정하는 반면, 메서드, getter, setter에서만 정의된 프로퍼티는 선택적인 것으로 간주합니다.

```js twoslash
// @checkJs
// @errors: 2322
class C {
  constructor() {
    this.constructorOnly = 0;
    this.constructorUnknown = undefined;
  }
  method() {
    this.constructorOnly = false; // 오류, constructorOnly는 Number 타입임
    this.constructorUnknown = "plunkbat"; // 성공, constructorUnknown의 타입은 string | undefined
    this.methodOnly = "ok"; // 성공, 그러나 methodOnly는 undefined 타입 또한 허용됨
  }
  method2() {
    this.methodOnly = true; // 이 또한 성공, methodOnly의 타입은 string | boolean | undefined
  }
}
```

프로퍼티가 클래스 본문에서 설정되지 않았다면, 알 수 없는 것으로 간주합니다.
클래스에 읽기 전용 프로퍼티가 있는 경우, 생성자에서 선언에 JSDoc을 사용하여 타입을 추가하여 표시합니다.
이후엔 초기화하더라도 값을 지정할 필요가 없습니다.

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
c.prop = 0; // 성공
c.count = "string"; // 오류: string 은 number|undefined에 할당할 수 없음
```

## 생성자 함수와 클래스는 동일 (Constructor functions are equivalent to classes)

ES2015 이전에는, JavaScript는 클래스 대신 생성자 함수를 사용했습니다.
컴파일러는 이러한 패턴을 지원하며 생성자 함수를 ES2015 클래스와 동일한 것으로 이해합니다.
앞서 설명한 프로퍼티 추론 규칙 또한 정확히 같은 방식으로 작용합니다.

```js twoslash
// @checkJs
// @errors: 2683 2322
function C() {
  this.constructorOnly = 0;
  this.constructorUnknown = undefined;
}
C.prototype.method = function () {
  this.constructorOnly = false; // 오류
  this.constructorUnknown = "plunkbat"; // 성공, 타입은 string | undefined가 됨
};
```

## CommonJS 모듈 지원 (CommonJS modules are supported)

`.js` 파일에서, TypeScript는 CommonJS 모듈 포맷을 이해합니다.
`exports`와 `module.exports` 할당은 export 선언으로 인식됩니다.
마찬가지로, `require` 함수 호출은 모듈 import로 인식됩니다. 예를 들어:

```js
// `import module "fs"`와 같음
const fs = require("fs");

// `export function readFile`과 같음
module.exports.readFile = function(f) {
    return fs.readFileSync(f);
}
```

JavaScript의 모듈 지원은 TypeScript의 모듈 지원보다 구문적으로 훨씬 관용적입니다.
따라서 대부분의 할당과 선언의 조합이 지원됩니다.

## 클래스, 함수, 객체 리터럴은 네임스페이스 (Classes, functions, and object literals are namespaces)

`.js` 파일에 있는 클래스는 네임스페이스입니다.
예를 들어, 다음과 같이 클래스를 중첩하는 데에 사용할 수 있습니다:

```js twoslash
class C {}
C.D = class {};
```

그리고 ES2015 이전 코드의 경우, 정적 메서드를 나타내는 데에 사용할 수도 있습니다:

```js twoslash
function Outer() {
  this.y = 2;
}

Outer.Inner = function () {
  this.yy = 2;
};

Outer.innter();
```

또한 간단한 네임스페이스를 생성하는 데에 사용할 수도 있습니다:

```js twoslash
var ns = {};
ns.C = class {};
ns.func = function () {};

ns;
```

다른 번형도 허용됩니다:

```js twoslash
// 즉시 호출 함수 (IIFE)
var ns = (function (n) {
  return n || {};
})();
ns.CONST = 1;

// 전역으로 기본 설정
var assign =
  assign ||
  function () {
    // 여기엔 코드를
  };
assign.extra = 1;
```

## 객체 리터럴은 확장 가능 (Object literals are open-ended)

`.ts` 파일에서, 변수 선언을 초기화하는 객체 리터럴은 선언에 해당 타입을 부여합니다.
원본 리터럴에 명시되어 있지 않은 새 멤버는 추가될 수 없습니다.
이 규칙은 `.js` 파일에선 완화됩니다; 객체 리터럴은 원본에 정의되지 않은 새로운 프로퍼티를 조회하고 추가하는 것이 허용되는 확장 가능한 타입(인덱스 시그니처)을 갖습니다.
예를 들어:

```js twoslash
var obj = { a: 1 };
obj.b = 2; // 허용됨
```

객체 리터럴은 마치 닫힌 객체가 아니라 열린 맵(maps)으로 다뤄지도록 `[x:string]: any`와 같은 인덱스 시그니처를 가진 것처럼 동작합니다.

다른 특정 JavaScript 검사 동작과 마찬가지로, 해당 동작은 변수에 JSDoc 타입을 지정하여 변경할 수 있습니다. 예를 들어:

```js twoslash
// @checkJs
// @errors: 2339
/** @type {{a: number}} */
var obj = { a: 1 };
obj.b = 2; // 오류, {a: number}타입엔 b 프로퍼티가 없음
```

## null, undefined 및 빈 배열 이니셜라이저는 any 혹은 any[] 타입 (null, undefined, and empty array initializers are of type any or any[])

null 또는 undefined로 초기화된 변수나 매개변수 또는 프로퍼티는, 엄격한 null 검사가 있더라도 any 타입을 갖게 될 것입니다.
[]로 초기화된 변수나 매개변수 또는 프로퍼티는, 엄격한 null 검사가 있더라도 any[] 타입을 갖게 될 것입니다.
위에서 설명한 여러 이니셜라이저(initializer)를 갖는 프로퍼티만이 유일한 예외입니다.

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

## 함수 매개변수는 기본적으로 선택 사항 (Function parameters are optional by default)

ES2015 이전의 JavaScript는 선택적인 매개변수를 지정할 방법이 없었기 때문에, `.js` 파일에선 모든 함수의 매개변수는 선택적인 것으로 간주됩니다.
선언된 매개변수보다 적은 인수로 호출하는 것이 허용됩니다.

그러나 너무 많은 인수를 넣어 호출하면 오류를 일으킨다는 것에 유의하세요.

예를 들어:

```js twoslash
// @checkJs
// @strict: false
// @errors: 7006 7006 2554
function bar(a, b) {
  console.log(a + " " + b);
}

bar(1); // 성공, 두 번째 인수는 선택 사항임
bar(1, 2);
bar(1, 2, 3); // 오류, 인수의 갯수가 너무 많음
```

JSDoc 표시가 된 함수는 이 규칙에서 예외입니다.
JSDoc의 선택적 매개변수 구문 (`[` `]`) 을 사용하여 선택 사항을 표시할 수 있습니다. 예시:

```js twoslash
/**
 * @param {string} [somebody] - 누군가의 이름
 */
function sayHello(somebody) {
  if (!somebody) {
    somebody = "John Doe";
  }
  console.log("Hello " + somebody);
}

sayHello();
```

## `arguments` 사용으로부터 추론된 var-args 매개변수 선언 (Var-args parameter declaration inferred from use of `arguments`)

`arguments` 참조를 참조하는 본문을 가진 함수는, 암묵적으로 var-args 매개변수(예: `(...arg: any[]) => any`)를 갖는 것으로 간주합니다. JSDoc의 var-args 구문을 사용하여 인수의 타입을 지정할 수 있습니다.

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

## 타입이 지정되지 않은 매개변수는 기본적으로 `any`임 (Unspecified type parameters default to `any`)

JavaScript에는 제네릭 타입의 매개변수를 지정하는 구문이 없으므로, 타입이 지정되지 않은 매개변수는 기본적으로 `any` 타입입니다.

### 확장 절에서 (In extends clause)

예를 들어, `React.Component`는 `Props`와 `State`라는 두 타입의 매개변수를 갖도록 정의되어 있습니다.
`.js` 파일에는 이러한 것들을 확장 절에 지정할 수 있는 정당한 방법이 없습니다. 기본적으로 해당 타입 인수는 `any`가 될 것입니다:

```js
import { Component } from "react";

class MyComponent extends Component {
    render() {
        this.props.b; // this.props의 타입이 any이므로 허용됨
    }
}
```

타입을 명시적으로 지정하려면 JSDoc의 `@augments`를 사용하세요. 예를 들어:

```js
import { Component } from "react";

/**
 * @augments {Component<{a: number}, State>}
 */
class MyComponent extends Component {
    render() {
        this.props.b; // 오류: b 는 {a:number}에 속하지 않음
    }
}
```

### JSDoc 참조에서 (In JSDoc references)

JSDoc의 지정되지 않은 타입 인수는 기본적으로 any입니다:

```js
/** @type{Array} */
var x = [];

x.push(1);        // 성공
x.push("string"); // 성공, x는 Array<any> 타입임

/** @type{Array.<number>} */
var y = [];

y.push(1);        // 성공
y.push("string"); // 오류, string을 number 타입에 할당할 수 없음

```

### 함수 호출에서 (In function calls)

제네릭 함수의 호출은 인수를 사용해 타입 매개변수를 추론합니다. 때때로 이 과정은 추론 소스가 부족하여 어떠한 타입도 추론하지 못하는 경우가 있습니다; 이러한 경우, 매개변수 타입은 기본적으로 `any`입니다. 예를 들어:

```js
var p = new Promise((resolve, reject) => { reject() });

p; // Promise<any>;
```

JSDoc의 모든 기능은 [여기](/docs/handbook/jsdoc-supported-types.html)에서 확인할 수 있습니다.
