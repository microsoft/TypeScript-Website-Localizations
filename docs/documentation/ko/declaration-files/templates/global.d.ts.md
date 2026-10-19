---
title: "Global .d.ts"
layout: docs
permalink: /ko/docs/handbook/declaration-files/templates/global-d-ts.html
---

## 전역 라이브러리

<!--
  TODO:

  1. mention that global nearly always means 'browser'
  2. if you have a global library that you suspect is UMD, look for instructions on
     a. how to import it
     b. -OR- how to make it work with webpack
  3. Make the page follow the structure of documentation,usage,source example.

  -->

_전역_ 라이브러리는 전역 스코프(즉, `import`형식을 사용하지 않고)에서 접근할 수 있는 라이브러리입니다.
많은 라이브러리는 사용을 위해 간단히 하나 이상의 전역 변수를 노출합니다.
예를 들어, [jQuery](https://jquery.com/)를 사용하고 있다면, `$` 변수를 단순히 참조하여 사용할 수 있습니다.

```ts
$(() => {
  console.log("hello!");
});
```

HTML 스크립트 태그로 _전역_ 라이브러리를 사용하는 방법에 대한 지침을 문서에서 자주 볼 수 있습니다.

```html
<script src="http://a.great.cdn.for/someLib.js"></script>
```

오늘날 대부분의 전역에서 접근 가능한 유명 라이브러리들은 실제로 UMD 라이브러리로 작성되었습니다(아래 참조).
UMD 라이브러리 문서는 전역 라이브러리 문서와 구별하기 어렵습니다.
전역 선언 파일을 작성하기 전에, 라이브러리가 UMD가 아닌지 확인하십시오.

## **코드에서 전역 라이브러리 식별하기**

전역 라이브러리 코드는 보통 매우 간단합니다.
전역 "Hello, world" 라이브러리는 다음과 같습니다.

```js
function createGreeting(s) {
  return "Hello, " + s;
}
```

혹은 다음과 같습니다.

```js
window.createGreeting = function (s) {
  return "Hello, " + s;
};
```

전역 라이브러리 코드를 볼 때 보통 다음과 같은 것을 보게 됩니다.

- 최상위-레벨 `var` 선언 또는 `function` 선언
- 한가지 이상의 `window.someName` 할당
- DOM 인터페이스 `document` 나 `window`가 존재한다는 가정

반면에, 다음은 볼 수 없습니다.

- `require`나 `define` 같은 모듈 로더에 확인 또는 사용
- `var fs = require("fs");` 형태의 CommonJS/Node.js 스타일 import
- `define(...)` 호출
- 라이브러리를 `require` 또는 import하는 방법을 설명하는 문서

## 전역 라이브러리 예시

전역 라이브러리를 UMD 라이브러리로 바꾸는 것이 쉽기 때문에, 전역 스타일로 작성된 인기 라이브러리는 거의 없습니다.
그러나, 작은 라이브러리이거나 DOM을 필요로 하는 (또는 _의존성이 없는_) 라이브러리는 전역일 수 있습니다.

## 전역 라이브러리 템플릿

아래에서 예시 DTS를 볼 수 있습니다:

```ts
// Type definitions for [~THE LIBRARY NAME~] [~OPTIONAL VERSION NUMBER~]
// Project: [~THE PROJECT NAME~]
// Definitions by: [~YOUR NAME~] <[~A URL FOR YOU~]>

/*~ 이 라이브러리가 호출 가능하다면 (예: myLib(3) 형태로 호출 가능)
 *~ 이곳에 호출 시그니처를 포함하십시오.
 *~ 그렇지 않다면 이 부분을 삭제하십시오.
 */
declare function myLib(a: string): string;
declare function myLib(a: number): number;

/*~ 유효한 타입 이름으로 라이브러리를 사용하고 싶다면,
 *~ 여기에 작성할 수 있습니다.
 *~
 *~ 예를 들어, 다음과 같이 작성할 수 있습니다. 'var x: myLib';
 *~ 실제로 의미가 있는지 확인하십시오! 그렇지 않다면 이 선언을 삭제하고
 *~ 아래 네임스페이스 내부에 타입을 추가하십시오.
 */
interface myLib {
  name: string;
  length: number;
  extras?: string[];
}

/*~ 라이브러리가 전역 변수로 노출된 속성을 가지고 있다면,
 *~ 여기에 작성하십시오.
 *~ 또한, 타입(인터페이스 및 타입 별칭)도 여기에 작성해야 합니다.
 */
declare namespace myLib {
  //~ 'myLib.timeout = 50;'이라고 작성할 수 있습니다.
  let timeout: number;

  //~ 'myLib.version'에 접근할 수 있지만, 변경할 수는 없습니다.
  const version: string;

  //~ 'let c = new myLib.Cat(42)' 형태로 클래스를 생성할 수 있습니다.
  //~ 또는 'function f(c: myLib.Cat) { ... }' 형태로 참조할 수 있습니다.
  class Cat {
    constructor(n: number);

    //~ 'Cat' 인스턴스에서 'c.age'를 읽을 수 있습니다.
    readonly age: number;

    //~ 'Cat' 인스턴스에서 'c.purr()'를 호출할 수 있습니다.
    purr(): void;
  }

  //~ 다음과 같이 변수를 선언할 수 있습니다.
  //~ 'var s: myLib.CatSettings = { weight: 5, name: "Maru" };'
  interface CatSettings {
    weight: number;
    name: string;
    tailLength?: number;
  }

  //~ 다음과 같이 작성할 수 있습니다.
  //~ 'const v: myLib.VetID = "bob";'
  //~ 'const v: myLib.VetID = 42;'
  type VetID = string | number;

  //~ 'myLib.checkCat(c)' 또는 'myLib.checkCat(c, v);'를 호출할 수 있습니다.
  function checkCat(c: Cat, s?: VetID);
}
```
