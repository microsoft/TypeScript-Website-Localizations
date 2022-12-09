---
title: Typeof Type Operator
layout: docs
permalink: /ko/docs/handbook/2/typeof-types.html
oneline: "타입 컨텍스트에서 typeof 연산자 사용하기."
---

## `typeof` 타입 연산자

JavaScript에서는 이미 _표현식_ 컨텍스트에서 사용할 수 있는 `typeof` 연산자가 있습니다.

```ts twoslash
// "string"을 출력합니다
console.log(typeof "Hello world");
```

TypeScript는 _타입_ 컨텍스트에서 변수나 프로퍼티의 타입을 추론할 수 있는 `typeof` 연산자를 추가합니다.

```ts twoslash
let s = "hello";
let n: typeof s;
//  ^?
```

기본 타입에 대해선 별로 유용하진 않지만, 다른 타입 연산자와 함께 `typeof`를 사용하여 많은 패턴을 편리하게 표현할 수 있습니다.
예를 들어, 미리 정의된 타입인 `ReturnType<T>` 부터 살펴보겠습니다.
위 타입은 _함수 타입_ 을 받으면서 반환되는 타입을 제공합니다.

```ts twoslash
type Predicate = (x: unknown) => boolean;
type K = ReturnType<Predicate>;
//   ^?
```

함수 이름에 `ReturnType`을 사용하면, 안내 오류를 확인할 수 있습니다.

```ts twoslash
// @errors: 2749
function f() {
  return { x: 10, y: 3 };
}
type P = ReturnType<f>;
```

_값_ 과 _타입_ 은 같지 않다는 것을 명심하세요.
_값 `f`_ 의 _타입_ 을 추론하기 위해서 `typeof`를 사용합니다.

```ts twoslash
function f() {
  return { x: 10, y: 3 };
}
type P = ReturnType<typeof f>;
//   ^?
```

### 제한

TypeScript는 `typeof`를 사용할 수 있는 표현식의 종류를 의도적으로 제한합니다.

특히, 식별자(예: 변수이름) 혹은 프로퍼티에서만 `typeof`를 사용할 수 있습니다.
실행 중인 것으로 생각되는 코드 작성의 실수를 피하는데 도움을 줄 수 있지만, 그렇진 않습니다.

```ts twoslash
// @errors: 1005
declare const msgbox: () => boolean;
// type msgbox = any;
// ---cut---
// Meant to use = ReturnType<typeof msgbox>
let shouldContinue: typeof msgbox("Are you sure you want to continue?");
```
