---
title: Everyday Types
layout: docs
permalink: /ko/docs/handbook/2/everyday-types.html
oneline: "언어의 원시 타입들."
---

이번 장에서는 JavaScript 코드에서 찾아볼 수 있는 가장 흔한 타입들을 다루고, 이 타입들을 TypeScript에서 어떻게 기술하는지 각각의 대응하는 방식에 대하여 설명하겠습니다.
이 문서에서 빠짐없이 전부 다루고자 하는 것이 아니며, 타입을 만들고 사용하는 더 많은 방법들은 이후 이어지는 장에서 다룰 것입니다.

타입은 단지 타입 표기 이외에도 훨씬 다양한 _위치_에 나타날 수 있습니다.
타입 자체에 대하여 배우는 것과 더불어, 새로운 구조체를 만들고자 할 때 타입을 참조하는 경우들에 대하여 알아볼 것입니다.

우선 JavaScript 또는 TypeScript 코드를 작성할 때 가장 기본적이면서 흔히 만날 수 있는 타입들을 다시 살펴보는 데에서 시작해보겠습니다.
이 타입들은 이후에 다루는 보다 복잡한 타입을 이루는 핵심 구성 요소입니다.

## 원시 타입 : `string`, `number`, 그리고 `boolean`

JavaScript에서 아주 흔하게 사용되는 세 가지의 [원시 타입](https://developer.mozilla.org/ko/docs/Glossary/Primitive)으로 `string`, `number`, 그리고 `boolean`이 있습니다.
이 타입들은 TypeScript에서 각자 대응하는 타입이 존재합니다.
아마도 예상하셨듯이, 이 타입들은 JavaScript에서 각 타입별 값에 `typeof` 연산자를 사용하였을 때 얻을 수 있는 것과 동일한 이름을 가집니다.

- `string`은 `"Hello, world"`와 같은 문자열 값을 나타냅니다
- `number`은  `42`와 같은 숫자를 나타냅니다. JavaScript는 정수를 위한 런타임 값을 별도로 가지지 않으므로, `int` 또는 `float`과 같은 것은 존재하지 않습니다. 모든 수는 단순히 `number`입니다
- `boolean`은 `true`와 `false`라는 두 가지 값만을 가집니다

> `String`, `Number`, `Boolean`와 같은 (대문자로 시작하는) 타입은 유효한 타입이지만, 코드상에서 이러한 특수 내장 타입을 사용하는 경우는 극히 드뭅니다. _항상_ `string`, `number`, `boolean` 타입을 사용하세요.

## 배열

`[1, 2, 3]`과 같은 배열의 타입을 지정할 때 `number[]` 구문을 사용할 수 있습니다. 이 구문은 모든 타입에서 사용할 수 있습니다(예를 들어, `string[]`은 문자열의 배열입니다).
위 타입은 `Array<number>`와 같은 형태로 적을 수 있으며, 동일한 의미를 가집니다.
`T<U>` 구문에 대한 내용은 _제네릭_을 다룰 때 좀 더 알아보겠습니다.

> `[number]`는 전혀 다른 의미를 가집니다. _튜플 타입_ 부분을 참조하세요.

## `any`

TypeScript는 또한 `any`라고 불리는 특별한 타입을 가지고 있으며, 특정 값으로 인하여 타입 검사 오류가 발생하는 것을 원하지 않을 때 사용할 수 있습니다.

어떤 값의 타입이 `any`이면, 해당 값에 대하여 임의의 속성에 접근할 수 있고(이때 반환되는 값의 타입도 `any`입니다), 함수인 것처럼 호출할 수 있고, 다른 임의 타입의 값에 할당하거나(받거나), 그 밖에도 구문적으로 유효한 것이라면 무엇이든 할 수 있습니다.

```ts twoslash
let obj: any = { x: 0 };
// 아래 이어지는 코드들은 모두 오류 없이 정상적으로 실행됩니다.
// `any`를 사용하면 추가적인 타입 검사가 비활성화되며,
// 당신이 TypeScript보다 상황을 더 잘 이해하고 있다고 가정합니다.
obj.foo();
obj();
obj.bar = 100;
obj = "hello";
const n: number = obj;
```

`any` 타입은 코드상의 특정 라인에 문제가 없다고 TypeScript를 안심시킨다는 목적 단지 하나 때문에 긴 타입을 새로 정의하고 싶지 않을 때 유용하게 사용할 수 있습니다.

### `noImplicitAny`

타입이 지정되지 않은 값에 대하여 TypeScript가 문맥으로부터 그 타입을 추론해낼 수 없다면, 컴파일러는 `any` 타입을 부여하는 것이 기본 동작입니다.

하지만 이런 상황은 보통 선호되지 않습니다. 왜냐하면 `any`는 타입 검사가 이루어지지 않기 때문입니다.
컴파일러 플래그 [`noImplicitAny`](/tsconfig#noImplicitAny)를 사용하면 암묵적으로 `any`로 간주하는 모든 경우에 오류를 발생시킵니다.

## 변수에 대한 타입 표기

`const`, `var`, 또는 `let` 등을 사용하여 변수를 선언할 때, 변수의 타입을 명시적으로 지정하기 위하여 타입 표기를 추가할 수 있으며 이는 선택 사항입니다.

```ts twoslash
let myName: string = "Alice";
//        ^^^^^^^^ 타입 표기
```

> TypeScript는 `int x = 0;`과 같이 "타입을 왼쪽에 쓰는" 식의 표기법을 사용하지 않습니다.
> 타입 표기는 항상 타입의 대상 _뒤쪽에_ 위치합니다.

하지만 대부분의 경우, 타입 표기는 필요하지 않습니다.
가능하다면 TypeScript는 자동으로 코드 내의 있는 타입들을 _추론_하고자 시도합니다.
예를 들어, 변수의 타입은 해당 변수의 초깃값의 타입을 바탕으로 추론됩니다.

```ts twoslash
// 타입 표기가 필요하지 않습니다. 'myName'은 'string' 타입으로 추론됩니다.
let myName = "Alice";
```

대부분의 경우 추론 규칙을 명시적으로 학습하지 않아도 됩니다.
이제 막 TypeScript를 시작하는 단계라면, 가능한 타입 표기를 적게 사용하도록 해보세요. 코드 흐름을 완전히 파악하는 데에 타입이 그다지 많이 필요하지 않다는 사실에 놀라실 겁니다.

## 함수

함수는 JavaScript에서 데이터를 주고 받는 주요 수단입니다.
TypeScript에서는 함수의 입력 및 출력 타입을 지정할 수 있습니다.

### 매개변수 타입 표기

함수를 선언할 때, 함수가 허용할 매개변수 타입을 선언하기 위하여 각 매개변수 뒤에 타입을 표기할 수 있습니다.
매개변수 타입은 매개변수 이름 뒤에 표기합니다.

```ts twoslash
// 매개변수 타입 표기
function greet(name: string) {
  //                 ^^^^^^^^
  console.log("Hello, " + name.toUpperCase() + "!!");
}
```

매개변수에 타입이 표기되었다면, 해당 함수에 대한 인자는 검사가 이루어집니다.

```ts twoslash
// @errors: 2345
declare function greet(name: string): void;
// ---셍략---
// 만약 실행되면 런타임 오류가 발생하게 됩니다!
greet(42);
```

> 매개변수에 타입을 표기하지 않았더라도, 여전히 TypeScript는 올바른 개수의 인자가 전달되었는지 여부를 검사합니다.

### 반환 타입 표기

반환 타입 또한 표기할 수 있습니다.
반환 타입은 매개변수 목록 뒤에 표기합니다.

```ts twoslash
function getFavoriteNumber(): number {
  //                        ^^^^^^^^
  return 26;
}
```

변수의 타입 표기와 마찬가지로, 반환 타입은 표기하지 않아도 되는 것이 일반적입니다. 왜냐하면 TypeScript가 해당 함수에 들어있는 `return` 문을 바탕으로 반환 타입을 추론할 것이기 때문입니다.
위 예시에서 사용된 타입 표기는 큰 의미를 갖지 않습니다.
때에 따라 문서화를 목적으로, 또는 코드의 잘못된 수정을 미연에 방지하고자, 혹은 지극히 개인적인 선호에 의하여 명시적인 타입 표기를 수행하는 코드도 존재합니다.

### 익명 함수

익명 함수는 함수 선언과는 조금 다릅니다.
함수가 코드상에서 위치한 곳을 보고 해당 함수가 어떻게 호출될지 알아낼 수 있다면, TypeScript는 해당 함수의 매개 변수에 자동으로 타입을 부여합니다.

아래는 그 예시입니다.

Here's an example:

```ts twoslash
// @errors: 2551
// 아래 코드에는 타입 표기가 전혀 없지만, TypeScript는 버그를 감지할 수 있습니다.
const names = ["Alice", "Bob", "Eve"];

// 함수에 대한 문맥적 타입 부여
names.forEach(function (s) {
  console.log(s.toUppercase());
});

// 화살표 함수에도 문맥적 타입 부여는 적용됩니다
names.forEach((s) => {
  console.log(s.toUppercase());
});
```

매개 변수 `s`에는 타입이 표기되지 않았음에도 불구하고, TypeScript는 `s`의 타입을 알아내기 위하여 배열의 추론된 타입과 더불어 `forEach` 함수의 타입을 활용하였습니다.

이 과정은 _문맥적 타입 부여_라고 불리는데, 왜냐하면 함수가 실행되는 _문맥_을 통하여 해당 함수가 가져야 하는 타입을 알 수 있기 때문입니다.
추론 규칙과 비슷하게, 이 과정이 어떻게 일어나는지를 명시적으로 배울 필요는 없지만, 이것이 _실제로 일어나는 과정_이라는 것을 이해하면 타입 표기가 불필요한 경우를 구분하는 데에 도움이 됩니다.
값이 발생하는 문맥이 해당 값의 타입에 영향을 끼치는 예시들은 이후에 살펴보도록 하겠습니다.

## 객체 타입

원시 타입을 제외하고 가장 많이 마주치는 타입은 _객체 타입_입니다.
객체는 프로퍼티를 가지는 JavaScript 값을 말하는데, 대부분의 경우가 이에 해당하죠!
객체 타입을 정의하려면, 해당 객체의 프로퍼티들과 각 프로퍼티의 타입들을 나열하기만 하면 됩니다.

예를 들어, 아래 함수는 좌표로 보이는 객체를 인자로 받고 있습니다.

```ts twoslash
// 매개 변수의 타입은 객체로 표기되고 있습니다.
function printCoord(pt: { x: number; y: number }) {
  //                      ^^^^^^^^^^^^^^^^^^^^^^^^
  console.log("The coordinate's x value is " + pt.x);
  console.log("The coordinate's y value is " + pt.y);
}
printCoord({ x: 3, y: 7 });
```

위에서 매개변수는 `x`와 `y`라는 두 개의 프로퍼티로 이루어진 타입으로 표기되고 있는데, 두 값은 모두 `number` 타입입니다.
각 프로퍼티를 구분할 때 `,` 또는 `;`를 사용할 수 있고, 가장 마지막에 위치한 구분자의 표기는 선택 사항입니다.

각 프로퍼티의 타입 표기 또한 선택 사항입니다.
만약 타입을 지정하지 않는다면, 해당 프로퍼티는 `any` 타입으로 간주합니다.

### 옵셔널 프로퍼티

객체 타입은 일부 또는 모든 프로퍼티의 타입을 선택적인 타입, 즉 _옵셔널_로 지정할 수 있습니다.
프로퍼티 이름 뒤에 `?`를 붙이면 됩니다.

```ts twoslash
function printName(obj: { first: string; last?: string }) {
  // ...
}
// 둘 다 OK
printName({ first: "Bob" });
printName({ first: "Alice", last: "Alisson" });
```

JavaScript에서는 존재하지 않는 프로퍼티에 접근하였을 때, 런타임 오류가 발생하지 않고 `undefined` 값을 얻게 됩니다.
이 때문에 옵셔널 프로퍼티를 _읽었을_ 때, 해당 값을 사용하기에 앞서 `undefined`인지 여부를 확인해야 합니다.

```ts twoslash
// @errors: 2532
function printName(obj: { first: string; last?: string }) {
  // 오류 - `obj.last`의 값이 제공되지 않는다면 프로그램이 멈추게 됩니다!
  console.log(obj.last.toUpperCase());
  if (obj.last !== undefined) {
    // OK
    console.log(obj.last.toUpperCase());
  }

  // 최신 JavaScript 문법을 사용하였을 때 또 다른 안전한 코드
  console.log(obj.last?.toUpperCase());
}
```

## 유니언 타입

TypeScript의 타입 시스템에서는 기존의 타입을 기반으로 다양한 연산자를 사용하여 새로운 타입을 만들 수 있습니다.
몇몇 타입들을 사용하는 법을 알았으니, 이제 이 타입들을 _조합하여_ 흥미로운 방식으로 사용해볼 시간입니다.

### 유니언 타입 정의하기

타입을 조합하는 첫 번째 방법은 _유니언_ 타입을 사용하는 것입니다.
유니언 타입은 서로 다른 두 개 이상의 타입들을 사용하여 만드는 것으로, 유니언 타입의 값은 타입 조합에 사용된 타입 중 _무엇이든 하나_를 타입으로 가질 수 있습니다.
조합에 사용된 각 타입을 유니언 타입의 _멤버_라고 부릅니다.

문자열 또는 숫자를 받을 수 있는 함수를 작성해보겠습니다.

```ts twoslash
// @errors: 2345
function printId(id: number | string) {
  console.log("Your ID is: " + id);
}
// OK
printId(101);
// OK
printId("202");
// 오류
printId({ myID: 22342 });
```

### 유니언 타입 사용하기

유니언 타입에 맞는 값을 _제공하는_ 것은 간단합니다. 유니언 타입의 멤버 중 하나에 해당하는 타입을 제공하면 됩니다.
유니언 타입인 값이 코드상에 _존재할 때_, 이를 어떻게 사용해야 할까요?

TypeScript에서 유니언을 다룰 때는 해당 유니언 타입의 _모든_ 멤버에 대하여 유효한 작업일 때에만 허용됩니다.
예를 들어 `string | number`라는 유니언 타입의 경우, `string` 타입에만 유효한 메서드는 사용할 수 없습니다.

```ts twoslash
// @errors: 2339
function printId(id: number | string) {
  console.log(id.toUpperCase());
}
```

이를 해결하려면 코드상에서 유니언을 _좁혀야_ 하는데, 이는 타입 표기가 없는 JavaScript에서 벌어지는 일과 동일합니다.
_좁히기_란 TypeScript가 코드 구조를 바탕으로 어떤 값을 보다 구체적인 타입으로 추론할 수 있을 때 발생합니다.

예를 들어, TypeScript는 오직 `string` 값만이 `typeof` 연산의 결괏값으로 `"string"`을 가질 수 있다는 것을 알고 있습니다.

```ts twoslash
function printId(id: number | string) {
  if (typeof id === "string") {
    // 이 분기에서 id는 'string' 타입을 가집니다

    console.log(id.toUpperCase());
  } else {
    // 여기에서 id는 'number' 타입을 가집니다
    console.log(id);
  }
}
```

또 다른 예시는 `Array.isArray`와 같은 함수를 사용하는 것입니다.

```ts twoslash
function welcomePeople(x: string[] | string) {
  if (Array.isArray(x)) {
    // 여기에서 'x'는 'string[]' 타입입니다
    console.log("Hello, " + x.join(" and "));
  } else {
    // 여기에서 'x'는 'string' 타입입니다
    console.log("Welcome lone traveler " + x);
  }
}
```

`else` 분기 문에서는 별도 처리를 하지 않아도 된다는 점에 유의하시기 바랍니다. `x`의 타입이 `string[]`가 아니라면, `x`의 타입은 반드시 `string`일 것입니다.

때로는 유니언의 모든 멤버가 무언가 공통점을 가질 수도 있습니다.
에를 들어, 배열과 문자열은 둘 다 `slice` 메서드를 내장합니다.
유니언의 모든 멤버가 어떤 프로퍼티를 공통으로 가진다면, 좁히기 없이도 해당 프로퍼티를 사용할 수 있게 됩니다.

```ts twoslash
// 반환 타입은 'number[] | string'으로 추론됩니다
function getFirstThree(x: number[] | string) {
  return x.slice(0, 3);
}
```

> 유니언은 의미상 _합집합_을 뜻하는데, 실제로는 유니언 타입이 프로퍼티들의 _교집합_을 가리키는 것처럼 보여 헷갈리게 느낄 수 있습니다.
> 이는 지극히 우연이 아닙니다. _유니언_이라는 명칭은 타입 이론에서 비롯된 것입니다.
> `number | string` _유니언_ 타입은 각각의 타입을 가지는 _값들에 대하여_ 합집합을 취하여 구성됩니다.
> 두 집합과 각각의 집합에 대한 특성이 주어졌을 때, 두 집합의 _유니언_에는 각각의 특성들의 _교집합_만이 적용된다는 점에 유의하시기 바랍니다.
> 예를 들어, 한 방에는 모자를 쓰고 키가 큰 사람들이 있고 다른 방에는 모자를 쓰고 스페인어를 사용하는 사람들이 있다고 합시다. 이때 두 방을 합친다면, _모든_ 사람들에 대하여 우리가 알 수 있는 사실은 바로 누구나 반드시 모자를 쓰고 있다는 것입니다.

## 타입 별칭

지금까지는 객체 타입과 유니언 타입을 사용할 때 직접 해당 타입을 표기하였습니다.
이는 편리하지만, 똑같은 타입을 한 번 이상 재사용하거나 또 다른 이름으로 부르고 싶은 경우도 존재합니다.

_타입 별칭_은 바로 이런 경우를 위하여 존재하며, _타입_을 위한 _이름_을 제공합니다.
타입 별칭의 구문은 아래와 같습니다.

```ts twoslash
type Point = {
  x: number;
  y: number;
};

// 앞서 사용한 예제와 동일한 코드입니다
function printCoord(pt: Point) {
  console.log("The coordinate's x value is " + pt.x);
  console.log("The coordinate's y value is " + pt.y);
}

printCoord({ x: 100, y: 100 });
```

타입 별칭을 사용하면 단지 객체 타입뿐이 아닌 모든 타입에 대하여 새로운 이름을 부여할 수 있습니다.
예를 들어, 아래와 같이 유니언 타입에 대하여 타입 별칭을 부여할 수도 있습니다.

```ts twoslash
type ID = number | string;
```

타입 별칭은 _단지_ 별칭에 지나지 않는다는 점에 유의하시기 바랍니다. 즉, 타입 별칭을 사용하여도 동일 타입에 대하여 각기 구별되는 "여러 버전"을 만드는 것은 아닙니다.
별칭을 사용하는 것은, 별도로 이름 붙인 타입을 새로 작성하는 것입니다.
다시 말해, 아래 코드는 틀린 것처럼 _보일 수_ 있지만, TypeScript에서는 이것이 정상인데 그 이유는 각각의 타입들이 동일 타입에 대한 별칭들이기 때문입니다.

```ts twoslash
declare function getInput(): string;
declare function sanitize(str: string): string;
// ---cut---
type UserInputSanitizedString = string;

function sanitizeInput(str: string): UserInputSanitizedString {
  return sanitize(str);
}

// 보안 처리를 마친 입력을 생성
let userInput = sanitizeInput(getInput());

// 물론 새로운 문자열을 다시 대입할 수도 있습니다
userInput = "new input";
```

## 인터페이스

_인터페이스 선언_은 객체 타입을 만드는 또 다른 방법입니다.

```ts twoslash
interface Point {
  x: number;
  y: number;
}

function printCoord(pt: Point) {
  console.log("The coordinate's x value is " + pt.x);
  console.log("The coordinate's y value is " + pt.y);
}

printCoord({ x: 100, y: 100 });
```

타입 별칭을 사용한 경우와 마찬가지로, 위 예시 코드는 마치 타입이 없는 임의의 익명 객체를 사용하는 것처럼 동작합니다.
TypeScript는 오직 `printCoord`에 전달된 값의 _구조_에만 관심을 가집니다. 즉, 예측된 프로퍼티를 가졌는지 여부만을 따집니다.
이처럼, 타입이 가지는 구조와 능력에만 관심을 가진다는 점은 TypeScript가 _구조적_ 타입 시스템이라고 불리는 이유입니다.

### 타입 별칭과 인터페이스의 차이점

타입 별칭과 인터페이스는 매우 유사하며, 대부분의 경우 둘 중 하나를 자유롭게 선택하여 사용할 수 있습니다.
`interface`가 가지는 대부분의 기능은 `type`에서도 동일하게 사용 가능합니다. 이 둘의 가장 핵심적인 차이는, 타입은 새 프로퍼티를 추가하도록 개방될 수 없는 반면, 인터페이스의 경우 항상 확장될 수 있다는 점입니다.

<table class='full-width-table'>
  <tbody>
    <tr>
      <th><code>인터페이스</code></th>
      <th><code>타입</code></th>
    </tr>
    <tr>
      <td>
        <p>인터페이스 확장하기</p>
        <code><pre>
interface Animal {
  name: string
}<br/>
interface Bear extends Animal {
  honey: boolean
}<br/>
const bear = getBear()
bear.name
bear.honey
        </pre></code>
      </td>
      <td>
        <p>교집합을 통하여 타입 확장하기</p>
        <code><pre>
type Animal = {
  name: string
}<br/>
type Bear = Animal & {
  honey: Boolean
}<br/>
const bear = getBear();
bear.name;
bear.honey;
        </pre></code>
      </td>
    </tr>
    <tr>
      <td>
        <p>기존의 인터페이스에 새 필드를 추가하기</p>
        <code><pre>
interface Window {
  title: string
}<br/>
interface Window {
  ts: TypeScriptAPI
}<br/>
const src = 'const a = "Hello World"';
window.ts.transpileModule(src, {});
        </pre></code>
      </td>
      <td>
        <p>타입은 생성된 뒤에는 달라질 수 없다</p>
        <code><pre>
type Window = {
  title: string
}<br/>
type Window = {
  ts: TypeScriptAPI
}<br/>
<span style="color: #A31515"> // Error: Duplicate identifier 'Window'.</span><br/>
        </pre></code>
      </td>
    </tr>
    </tbody>
</table>

위 개념에 대하여서는 이후에 이어지는 장에서 좀 더 자세히 배우므로, 지금 위 내용을 잘 이해하지 못하였더라도 걱정하지 마세요.

- TypeScript 4.2 이전 버전에서는, 타입 별칭 이름이 오류 메시지에 [나타날 수 있고](/play?#code/PTAEGEHsFsAcEsA2BTATqNrLusgzngIYDm+oA7koqIYuYQJ56gCueyoAUCKAC4AWHAHaFcoSADMaQ0PCG80EwgGNkALk6c5C1EtWgAsqOi1QAb06groEbjWg8vVHOKcAvpokshy3vEgyyMr8kEbQJogAFND2YREAlOaW1soBeJAoAHSIkMTRmbbI8e6aPMiZxJmgACqCGKhY6ABGyDnkFFQ0dIzMbBwCwqIccabcYLyQoKjIEmh8kwN8DLAc5PzwwbLMyAAeK77IACYaQSEjUWZWhfYAjABMAMwALA+gbsVjoADqgjKESytQPxCHghAByXigYgBfr8LAsYj8aQMUASbDQcRSExCeCwFiIQh+AKfAYyBiQFgOPyIaikSGLQo0Zj-aazaY+dSaXjLDgAGXgAC9CKhDqAALxJaw2Ib2RzOISuDycLw+ImBYKQflCkWRRD2LXCw6JCxS1JCdJZHJ5RAFIbFJU8ADKC3WzEcnVZaGYE1ABpFnFOmsFhsil2uoHuzwArO9SmAAEIsSFrZB-GgAjjA5gtVN8VCEc1o1C4Q4AGlR2AwO1EsBQoAAbvB-gJ4HhPgB5aDwem-Ph1TCV3AEEirTp4ELtRbTPD4vwKjOfAuioSQHuDXBcnmgACC+eCONFEs73YAPGGZVT5cRyyhiHh7AAON7lsG3vBggB8XGV3l8-nVISOgghxoLq9i7io-AHsayRWGaFrlFauq2rg9qaIGQHwCBqChtKdgRo8TxRjeyB3o+7xAA), 때로는 동등한 익명 타입을 대신하여 나타날 수 있습니다(이는 경우에 따라 바람직할 수도 있고 아닐 수도 있습니다). 인터페이스는 항상 오류 메시지에 이름이 나타납니다.
- 타입 별칭은 [선언 병합에 포함될 수 없지만, 인터페이스는 포함될 수 있습니다](/play?#code/PTAEEEDtQS0gXApgJwGYEMDGjSfdAIx2UQFoB7AB0UkQBMAoEUfO0Wgd1ADd0AbAK6IAzizp16ALgYM4SNFhwBZdAFtV-UAG8GoPaADmNAcMmhh8ZHAMMAvjLkoM2UCvWad+0ARL0A-GYWVpA29gyY5JAWLJAwGnxmbvGgALzauvpGkCZmAEQAjABMAMwALLkANBl6zABi6DB8okR4Jjg+iPSgABboovDk3jjo5pbW1d6+dGb5djLwAJ7UoABKiJTwjThpnpnGpqPBoTLMAJrkArj4kOTwYmycPOhW6AR8IrDQ8N04wmo4HHQCwYi2Waw2W1S6S8HX8gTGITsQA).
- 인터페이스는 [오직 객체의 모양을 선언하는 데에만 사용되며, 기존의 원시 타입에 별칭을 부여하는 데에는 사용할 수는 없습니다](/play?#code/PTAEAkFMCdIcgM6gC4HcD2pIA8CGBbABwBtIl0AzUAKBFAFcEBLAOwHMUBPQs0XFgCahWyGBVwBjMrTDJMAshOhMARpD4tQ6FQCtIE5DWoixk9QEEWAeV37kARlABvaqDegAbrmL1IALlAEZGV2agBfampkbgtrWwMAJlAAXmdXdy8ff0Dg1jZwyLoAVWZ2Lh5QVHUJflAlSFxROsY5fFAWAmk6CnRoLGwmILzQQmV8JmQmDzI-SOiKgGV+CaYAL0gBBdyy1KCQ-Pn1AFFplgA5enw1PtSWS+vCsAAVAAtB4QQWOEMKBuYVUiVCYvYQsUTQcRSBDGMGmKSgAAa-VEgiQe2GLgKQA).
- 인터페이스의 이름은 [항상 있는 그대로](/play?#code/PTAEGEHsFsAcEsA2BTATqNrLusgzngIYDm+oA7koqIYuYQJ56gCueyoAUCKAC4AWHAHaFcoSADMaQ0PCG80EwgGNkALk6c5C1EtWgAsqOi1QAb06groEbjWg8vVHOKcAvpokshy3vEgyyMr8kEbQJogAFND2YREAlOaW1soBeJAoAHSIkMTRmbbI8e6aPMiZxJmgACqCGKhY6ABGyDnkFFQ0dIzMbBwCwqIccabcYLyQoKjIEmh8kwN8DLAc5PzwwbLMyAAeK77IACYaQSEjUWY2Q-YAjABMAMwALA+gbsVjNXW8yxySoAADaAA0CCaZbPh1XYqXgOIY0ZgmcK0AA0nyaLFhhGY8F4AHJmEJILCWsgZId4NNfIgGFdcIcUTVfgBlZTOWC8T7kAJ42G4eT+GS42QyRaYbCgXAEEguTzeXyCjDBSAAQSE8Ai0Xsl0K9kcziExDeiQs1lAqSE6SyOTy0AKQ2KHk4p1V6s1OuuoHuzwArMagA) 오류 메시지에 나타납니다. 단, 이는 _오직_ 코드상에서 해당 인터페이스가 이름으로 사용되었을 때에만 해당합니다.

대부분의 경우 개인적 선호에 따라 인터페이스와 타입 중에서 선택할 수 있으며, 필요하다면 TypeScript가 다른 선택을 제안할 것입니다. 잘 모르겠다면, 우선 `interface`를 사용하고 이후 문제가 발생하였을 때 `type`을 사용하기 바랍니다.

## 타입 단언

때로는 TypeScript보다 당신이 어떤 값의 타입에 대한 정보를 더 잘 아는 경우도 존재합니다.

예를 들어 코드상에서 `document.getElementById`가 사용되는 경우, TypeScript는 이때 `HTMLElement` 중에 _무언가_가 반환된다는 것만을 알 수 있는 반면에, 당신은 페이지 상에서 사용되는 ID로는 언제나 `HTMLCanvasElement`가 반환된다는 사실을 이미 알고 있을 수도 있습니다.

이런 경우, _타입 단언_을 사용하면 타입을 좀 더 구체적으로 명시할 수 있습니다.

```ts twoslash
const myCanvas = document.getElementById("main_canvas") as HTMLCanvasElement;
```

타입 표기와 마찬가지로, 타입 단언은 컴파일러에 의하여 제거되며 코드의 런타임 동작에는 영향을 주지 않습니다.

꺾쇠괄호를 사용하는 것 또한 (코드가 `.tsx` 파일이 아닌 경우) 가능하며, 이는 동일한 의미를 가집니다.

```ts twoslash
const myCanvas = <HTMLCanvasElement>document.getElementById("main_canvas");
```

> 기억하세요: 타입 단언은 컴파일 시간에 제거되므로, 타입 단언에 관련된 검사는 런타임 중에 이루어지지 않습니다.
> 타입 단언이 틀렸더라도 예외가 발생하거나 `null`이 생성되지 않을 것입니다.

TypeScript에서는 _보다 구체적인_ 또는 _덜 구체적인_ 버전의 타입으로 변환하는 타입 단언만이 허용됩니다.
이러한 규칙은 아래와 같은 "불가능한" 강제 변환을 방지합니다.

```ts twoslash
// @errors: 2352
const x = "hello" as number;
```

이 규칙이 때로는 지나치게 보수적으로 작용하여, 복잡하기는 하지만 유효할 수 있는 강제 변환이 허용되지 않기도 합니다.
이런 경우, 두 번의 단언을 사용할 수 있습니다. `any`(또는 이후에 소개할 `unknown`)로 우선 변환한 뒤, 그다음 원하는 타입으로 변환하면 됩니다.

```ts twoslash
declare const expr: any;
type T = { a: 1; b: 2; c: 3 };
// ---cut---
const a = (expr as any) as T;
```

## 리터럴 타입

`string`과 `number`와 같은 일반적인 타입 이외에도, _구체적인_ 문자열과 숫자 값을 타입 위치에서 지정할 수 있습니다.

이를 이해하려면, JavaScript에서 변수 선언에 제공되는 다양한 방법들을 떠올려보시기 바랍니다. `var`와 `let` 모두 변수에 저장 가능한 값의 종류를 변경할 수 있으며, `const`는 이것이 불가능합니다. 이러한 특징들은 TypeScript가 리터럴 값을 위한 타입을 생성하는 방식에 그대로 반영됩니다.

```ts twoslash
let changingString = "Hello World";
changingString = "Olá Mundo";
// 변수 `changingString`은 어떤 문자열이든 모두 나타낼 수 있으며,
// 이는 TypeScript의 타입 시스템에서 문자열 타입 변수를 다루는 방식과 동일합니다.
changingString;
// ^?

const constantString = "Hello World";
// 변수 `constantString`은 오직 단 한 종류의 문자열만 나타낼 수 있으며,
// 이는 리터럴 타입의 표현 방식입니다.
constantString;
// ^?
```

리터럴 타입은 그 자체만으로는 그다지 유의미하지 않습니다.

```ts twoslash
// @errors: 2322
let x: "hello" = "hello";
// OK
x = "hello";
// ...
x = "howdy";
```

단 하나의 값만을 가질 수 있는 변수는 그다지 쓸모가 없죠!

하지만 리터럴을 유니언과 _함께 사용하면_, 보다 유용한 개념들을 표현할 수 있게 됩니다. 예를 들어, 특정 종류의 값들만을 인자로 받을 수 있는 함수를 정의하는 경우가 있습니다.

```ts twoslash
// @errors: 2345
function printText(s: string, alignment: "left" | "right" | "center") {
  // ...
}
printText("Hello, world", "left");
printText("G'day, mate", "centre");
```

숫자 리터럴 타입 또한 같은 방식으로 사용할 수 있습니다.

```ts twoslash
function compare(a: string, b: string): -1 | 0 | 1 {
  return a === b ? 0 : a > b ? 1 : -1;
}
```

물론, 리터럴이 아닌 타입과도 함께 사용할 수 있습니다.

```ts twoslash
// @errors: 2345
interface Options {
  width: number;
}
function configure(x: Options | "auto") {
  // ...
}
configure({ width: 100 });
configure("auto");
configure("automatic");
```

또 하나의 리터럴 타입이 있습니다. 바로 불 리터럴 타입입니다.
불 리터럴에는 오직 두 개의 타입만이 존재하며, 이는 익히 예상하셨듯이 `true`와 `false`입니다.
`boolean` 타입 자체는 사실 단지 `true | false` 유니언 타입의 별칭입니다.

### 리터럴 추론

객체를 사용하여 변수를 초기화하면, TypeScript는 해당 객체의 프로퍼티는 이후에 그 값이 변화할 수 있다고 가정합니다.
예를 들어, 아래와 같은 코드를 작성하는 경우를 보겠습니다.

```ts twoslash
declare const someCondition: boolean;
// ---cut---
const obj = { counter: 0 };
if (someCondition) {
  obj.counter = 1;
}
```

기존에 값이 `0`이었던 필드에 `1`을 대입하였을 때 TypeScript는 이를 오류로 간주하지 않습니다.
이를 달리 말하면 `obj.counter`는 반드시 `number` 타입을 가져야 하며, `0` 리터럴 타입을 가질 수 없다는 의미입니다. 왜냐하면 타입은 _읽기_ 및 _쓰기_ 두 동작을 결정하는 데에 사용되기 때문입니다.

동일한 사항이 문자열에도 적용됩니다.

```ts twoslash
// @errors: 2345
declare function handleRequest(url: string, method: "GET" | "POST"): void;
// ---cut---
const req = { url: "https://example.com", method: "GET" };
handleRequest(req.url, req.method);
```

위 예시에서 `req.method`는 `string`으로 추론되지, `"GET"`으로 추론되지 않습니다. `req`의 생성 시점과 `handleRequest`의 호출 시점 사이에도 얼마든지 코드 평가가 발생할 수 있고, 이때 `req.method`에 `"GUESS"`와 같은 새로운 문자열이 대입될 수도 있으므로, TypeScript는 위 코드에 오류가 있다고 판단합니다.

이러한 경우를 해결하는 데에는 두 가지 방법이 있습니다.

1. 둘 중에 한 위치에 타입 단언을 추가하여 추론 방식을 변경할 수 있습니다.

   ```ts twoslash
   declare function handleRequest(url: string, method: "GET" | "POST"): void;
   // ---cut---
   // 수정 1:
   const req = { url: "https://example.com", method: "GET" as "GET" };
   // 수정 2
   handleRequest(req.url, req.method as "GET");
   ```

   수정 1은 `req.method`가 항상 _리터럴 타입_ `"GET"`이기를 의도하며, 이에 따라 해당 필드에 `"GUESS"`와 같은 값이 대입되는 경우를 미연에 방지하겠다"는 것을 의미합니다.
   수정 2는 "무슨 이유인지, `req.method`가 `"GET"`을 값으로 가진다는 사실을 알고 있다"는 것을 의미합니다.

2. `as const`를 사용하여 객체 전체를 리터럴 타입으로 변환할 수 있습니다.

   ```ts twoslash
   declare function handleRequest(url: string, method: "GET" | "POST"): void;
   // ---cut---
   const req = { url: "https://example.com", method: "GET" } as const;
   handleRequest(req.url, req.method);
   ```

`as const` 접미사는 일반적인 `const`와 유사하게 작동하는데, 해당 객체의 모든 프로퍼티에 `string` 또는 `number`와 같은 보다 일반적인 타입이 아닌 리터럴 타입의 값이 대입되도록 보장합니다.

## `null`과 `undefined`

JavaScript에는 빈 값 또는 초기화되지 않은 값을 가리키는 두 가지 원시값이 존재합니다. 바로 `null`과 `undefined`입니다.

TypeScript에는 각 값에 대응하는 동일한 이름의 두 가지 _타입_이 존재합니다. 각 타입의 동작 방식은 `strictNullChecks` 옵션의 설정 여부에 따라 달라집니다.

### `strictNullChecks`가 설정되지 않았을 때

`strictNullChecks`가 _설정되지 않았다면_, 어떤 값이 `null` 또는 `undefined`일 수 있더라도 해당 값에 평소와 같이 접근할 수 있으며, `null`과 `undefined`는 모든 타입의 변수에 대입될 수 있습니다.
이는 Null 검사를 하지 않는 언어(C#, Java 등)의 동작 방식과 유사합니다.
Null 검사의 부재는 버그의 주요 원인이 되기도 합니다. 별다른 이유가 없다면, 코드 전반에 걸쳐 `strictNullChecks` 옵션을 설정하는 것을 항상 권장합니다.

### `strictNullChecks` 설정되었을 때

`strictNullChecks`가 _설정되었다면_, 어떤 값이 `null` 또는 `undefined`일 때, 해당 값과 함께 메서드 또는 프로퍼티를 사용하기에 앞서 해당 값을 테스트해야 합니다.
옵셔널 프로퍼티를 사용하기에 앞서 `undefined` 여부를 검사하는 것과 마찬가지로, _좁히기_를 통하여 `null`일 수 있는 값에 대한 검사를 수행할 수 있습니다.

```ts twoslash
function doSomething(x: string | undefined) {
  if (x === undefined) {
    // 아무 것도 하지 않는다
  } else {
    console.log("Hello, " + x.toUpperCase());
  }
}
```

### Null 아님 단언 연산자 (접미사 `!`)


TypeScript에서는 명시적인 검사를 하지 않고도 타입에서 `null`과 `undefined`를 제거할 수 있는 특별한 구문을 제공합니다.
표현식 뒤에 `!`를 작성하면 해당 값이 `null` 또는 `undefined`가 아니라고 타입 단언하는 것입니다.

```ts twoslash
function liveDangerously(x?: number | undefined) {
  // 오류 없음
  console.log(x!.toFixed());
}
```

다른 타입 단언과 마찬가지로 이 구문은 코드의 런타임 동작을 변화시키지 않으므로, `!` 연산자는 반드시 해당 값이 `null` 또는 `undefined`가 _아닌_ 경우에만 사용해야 합니다.

## 열거형

열거형은 TypeScript가 JavaScript에 추가하는 기능으로, 어떤 값이 _이름이 있는 상수 집합_에 속한 값 중 하나일 수 있도록 제한하는 기능입니다. 대부분의 TypeScript 기능과 달리, 이 기능은 JavaScript에 타입 수준이 _아닌_, 언어와 런타임 수준에 추가되는 기능입니다. 따라서 열거형이 무엇인지는 알 필요가 있겠으나, 그 사용법을 명확하게 파악하지 않았다면 실제 사용은 보류하는 것이 좋습니다. 열거형에 대한 자세한 내용을 확인하려면 [열거형 문서](https://www.typescriptlang.org/ko/docs/handbook/enums.html)를 읽어보시기 바랍니다.

## 자주 사용되지 않는 원시형 타입

앞서 언급한 타입 이외에, 타입 시스템에 존재하는 나머지 JavaScript 원시 타입들을 다루도록 하겠습니다.
물론, 여기서 깊게 다루지는 않을 것입니다.

#### `bigint`

ES2020 이후, 아주 큰 정수를 다루기 위한 원시 타입이 JavaScript에 추가되었습니다. 바로 `bigint`입니다.

```ts twoslash
// @target: es2020

// BigInt 함수를 통하여 bigint 값을 생성
const oneHundred: bigint = BigInt(100);

// 리터럴 구문을 통하여 bigint 값을 생성
const anotherHundred: bigint = 100n;
```

BigInt에 대한 더 자세한 내용은 [TypeScript 3.2 릴리즈 노트]((/docs/handbook/release-notes/typescript-3-2.html#bigint))에서 확인할 수 있습니다.

#### `symbol`

`symbol`은 전역적으로 고유한 참조값을 생성하는 데에 사용할 수 있는 원시 타입이며, `Symbol()` 함수를 통하여 생성할 수 있습니다.

```ts twoslash
// @errors: 2367
const firstName = Symbol("name");
const secondName = Symbol("name");

if (firstName === secondName) {
  // 절대로 일어날 수 없습니다
}
```

Symbol에 대한 더 자세한 내용은 [심벌 문서](https://www.typescriptlang.org/ko/docs/handbook/symbols.html)에서 확인할 수 있습니다.
