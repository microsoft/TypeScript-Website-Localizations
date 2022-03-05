---
title: Keyof Type Operator
layout: docs
permalink: /ko/docs/handbook/2/keyof-types.html
oneline: "타입 컨텍스트에서 keyof 연산자 사용하기"
---

## `keyof` 타입 연산자

`keyof` 연산자는 객체 타입에서 객체의 키 값들을 숫자나 문자열 리터럴 유니언을 생성합니다.
아래 타입 P는 "x" | "y"와 동일한 타입입니다.

```ts twoslash
type Point = { x: number; y: number };
type P = keyof Point;
//   ^?
```

만약 타입이 `string`이나 `number` 인덱스 시그니쳐를 가지고 있다면, `keyof`는 해당 타입을 리턴합니다.

```ts twoslash
type Arrayish = { [n: number]: unknown };
type A = keyof Arrayish;
//   ^?

type Mapish = { [k: string]: boolean };
type M = keyof Mapish;
//   ^?
```

위 예제에서 주목할 점은 `M`은 `string | number`라는 점입니다. -- JavaScript 객체 키는 항상 문자열을 강제하기 때문에, `obj[0]`은 `obj["0"]`과 동일합니다.

`keyof` 타입은 우리가 추후에 학습할 매핑된 타입과 함께 사용할 때 특히 유용합니다.
