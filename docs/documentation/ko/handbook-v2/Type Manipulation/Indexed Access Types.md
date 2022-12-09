---
title: Indexed Access Types
layout: docs
permalink: /ko/docs/handbook/2/indexed-access-types.html
oneline: "Type['a'] 구문을 사용해서 타입의 내부 요소에 접근하기"
---

타입의 특정 프로퍼티를 찾기 위해서 _인덱싱된 접근 타입_ 을 사용할 수 있습니다.

```ts twoslash
type Person = { age: number; name: string; alive: boolean };
type Age = Person["age"];
//   ^?
```

인덱싱된 타입은 그 자체로도 타입이라서 유니언, `keyof` 혹은 타입 전체에 사용할 수 있습니다.

```ts twoslash
type Person = { age: number; name: string; alive: boolean };
// ---cut---
type I1 = Person["age" | "name"];
//   ^?

type I2 = Person[keyof Person];
//   ^?

type AliveOrName = "alive" | "name";
type I3 = Person[AliveOrName];
//   ^?
```

존재하지 않는 프로퍼티를 인덱싱하려고 하면 오류가 발생합니다.

```ts twoslash
// @errors: 2339
type Person = { age: number; name: string; alive: boolean };
// ---cut---
type I1 = Person["alve"];
```

또 다른 예로는 임의의 타입을 `number`로 인덱싱해서 배열 요소의 타입을 가져올 수 있습니다.
`typeof`와 결합하면 편리하게 배열 리터럴의 요소 타입을 캡쳐할 수 있습니다.

```ts twoslash
const MyArray = [
  { name: "Alice", age: 15 },
  { name: "Bob", age: 23 },
  { name: "Eve", age: 38 },
];

type Person = typeof MyArray[number];
//   ^?
type Age = typeof MyArray[number]["age"];
//   ^?
// Or
type Age2 = Person["age"];
//   ^?
```

인덱싱할 때 변수 참조를 위해 사용된 `const`는 사용할 수 없고, 오로지 타입만 사용 가능합니다.


```ts twoslash
// @errors: 2538 2749
type Person = { age: number; name: string; alive: boolean };
// ---cut---
const key = "age";
type Age = Person[key];
```

하지만, 비슷한 스타일의 리팩터로 타입 별칭을 사용할 수 있습니다.

```ts twoslash
type Person = { age: number; name: string; alive: boolean };
// ---cut---
type key = "age";
type Age = Person[key];
```
