---
title: Everyday Types
layout: docs
permalink: /docs/handbook/2/everyday-types.html
oneline: "언어의 원시 타입들."
---

이번 장에서는 JavaScript 코드에서 찾아볼 수 있는 가장 흔한 타입들을 다루고, 이 타입들을 TypeScript에서 어떻게 기술하는지 각각의 대응하는 방식들에 대하여 설명하겠습니다.
이 문서에서 빠짐없이 전부 다루고자 하는 것이 아니며, 타입을 만들고 사용하는 더 많은 방법들은 이후 이어지는 장에서 다룰 것입니다.

타입은 단지 타입 표기 이외에도 훨씬 다양한 _위치_에 나타날 수 있습니다.
타입 자체에 대하여 배우는 것과 더불어, 새로운 구조체를 만들고자 할 때 타입을 참조하는 경우들에 대하여 알아볼 것입니다.

우선 JavaScript 또는 TypeScript 코드를 작성할 때 가장 기본적이면서 흔히 만날 수 있는 타입들을 다시 살펴보는 데에서 시작해보겠습니다.
이 타입들은 이후에 다루는 보다 복잡한 타입을 이루는 핵심 구성 요소입니다.

## 원시 타입 : `string`, `number`, 그리고 `boolean`

JavaScript에서 아주 흔하게 사용되는 세 가지의 [원시 타입](https://developer.mozilla.org/ko/docs/Glossary/Primitive)으로 `string`, `number`, 그리고 `boolean`이 있습니다.
이 타입들은 TypeScript에서 각자 대응하는 타입이 존재합니다.
아마도 예상하셨듯이, 이 타입들은 JavaScript에서 각 타입 별 값에 `typeof` 연산자를 사용하였을 때 얻을 수 있는 것과 동일한 이름을 가집니다.

- `string`은 `"Hello, world"`와 같은 문자열 값을 나타냅니다
- `number`은  `42`와 같은 숫자를 나타냅니다. JavaScript는 정수를 위한 런타임 값을 별도로 가지지 않으므로, `int` 또는 `float`과 같은 것은 존재하지 않습니다. 모든 수는 단순히 `number`입니다
- `boolean`은 `true`와 `false`라는 두 가지 값만을 가집니다

> `String`, `Number`, `Boolean`와 같은 (대문자로 시작하는) 타입은 유효한 타입이지만, 코드 상에서 이러한 특수 내장 타입을 사용하는 경우는 극히 드뭅니다. _항상_ `string`, `number`, `boolean` 타입을 사용하세요.

## 배열

`[1, 2, 3]`과 같은 배열의 타입을 지정할 때 `number[]` 구문을 사용할 수 있습니다. 이 구문은 모든 타입에서 사용할 수 있습니다(예를 들어, `string[]`은 문자열의 배열입니다).
위 타입은 `Array<number>`과 같은 형태로 적힐 수 있으며, 동일한 의미를 가집니다.
`T<U>` 구문에 대한 내용은 _제네릭_을 다룰 때 좀 더 알아보겠습니다.

> `[number]`는 전혀 다른 의미를 갖비니다. _튜플 타입_ 부분을 참조하세요.

## `any`

TypeScript는 또한 `any`라고 불리는 특별한 타입을 가지고 있으며, 특정 값으로 인하여 타입 검사 오류가 발생하는 것을 원하지 않을 때에 사용할 수 있습니다.

어떤 값의 타입이 `any`이면, 해당 값에 대하여 임의의 속성에 접근할 수 있고(이 때 반환되는 값의 타입도 `any`입니다), 함수인 것처럼 호출할 수 있고, 다른 임의의 타입의 값에 할당하거나(받거나), 그 밖에도 구문적으로 유효한 것이라면 무엇이든 할 수 있습니다.

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

`any` 타입은 코드 상의 특정 라인에 문제가 없다고 TypeScript를 안심시킨다는 목적 단지 하나 때문에 긴 타입을 새로 정의하고 싶지 않을 때 유용하게 사용할 수 있습니다.

### `noImplicitAny`

타입을 지정되지 않은 값에 대하여 TypeScript가 문맥으로부터 그 타입을 추론해낼 수 없다면, 컴파일러는 `any` 타입을 부여하는 것이 기본 동작입니다.

하지만 이런 상황은 보통 선호되지 않습니다. 왜냐하면 `any`는 타입 검사가 이루어지지 않기 때문입니다.
컴파일러 플래그 [`noImplicitAny`](/tsconfig#noImplicitAny)를 사용하면 암묵적으로 `any`로 간주되는 모든 경우에 오류를 발생시킵니다.

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
예를 들어, 변수의 타입은 해당 변수의 초기값의 타입을 바탕으로 추론됩니다.

```ts twoslash
// 타입 표기가 필요하지 않습니다. 'myName'은 'string' 타입으로 추론됩니다.
let myName = "Alice";
```

대부분의 경우 추론 규칙을 명시적으로 학습하지 않아도 됩니다.
이제 막 TypeScript를 시작하는 단계라면, 가능한 타입 표기를 적게 사용하도록 해보세요. 코드 흐름을 완전히 파악하는 데에 타입이 그다지 많이 필요햐지 않다는 사실에 놀라실 겁니다.

## 함수

함수는 JavaScript에서 데이터를 주고 받는 주요 수단입니다.
TypeScript에서는 함수의 입력 및 출력의 타입을 지정할 수 있습니다.

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

매개변수에 타입을 표기했다면, 해당 함수에 대한 인자는 검사가 이루어집니다.

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
경우에 따라 문서화를 목적으로, 또는 코드의 잘못된 수정을 미연에 방지하고자, 혹은 지극히 개인적인 선호에 의하여 명시적인 타입 표기를 수행하는 코드도 존재합니다.

### 익명 함수

익명 함수는 함수 선언과는 조금 다릅니다.
함수가 코드 상에서 위치한 곳을 보고 해당 함수가 어떻게 호출될지 알아낼 수 있다면, TypeScript는 해당 함수의 매개 변수에 자동으로 타입을 부여합니다.

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
객체는 프로퍼티를 가지는 JavaScript 값을 말하는데, 거의 대부분의 경우가 이에 해당하죠!
객체 타입을 정의하려면, 해당 객체의 프로퍼티들과 각 프로퍼티들의 타입들을 나열하기만 하면 됩니다.

예를 들어, 아래 함수는 좌표로 보이는 객체를 받고 있습니다.

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
만약 타입을 지정하지 않는다면, 해당 프로퍼티는 `any` 타입으로 간주됩니다.

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

  // 최신 JavaScript 문법을 사용하였을 때 또다른 안전한 코드
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
유니언 타입인 값이 코드 상에 _존재할 때_, 이를 어떻게 사용해아 할까요?

TypeScript에서 유니언을 다룰 때에는 해당 유니언 타입의 _모든_ 멤버에 대하여 유효한 작업일 때에만 허용됩니다.
예를 들어 `string | number`라는 유니언 타입의 경우, `string` 타입에만 유효한 메서드는 사용할 수 없습니다.

```ts twoslash
// @errors: 2339
function printId(id: number | string) {
  console.log(id.toUpperCase());
}
```

이를 해결하려면 코드 상에서 유니언을 _좁혀야_ 하는데, 이는 타입 표기가 없는 JavaScript에서 벌어지는 일과 동일합니다.
_좁히기_란 TypeScript가 코드 구조를 바탕으로 어떤 값을 보다 구체적인 타입으로 추론할 수 있을 때에 발생합니다.

예를 들어, TypeScript는 오직 `string` 값만이 `typeof` 연산의 결과값으로 `"string"`을 가질 수 있다는 것을 알고 있습니다.

```ts twoslash
function printId(id: number | string) {
  if (typeof id === "string") {
    // 이 분기에서 id는 `string` 타입을 가집니다
    console.log(id.toUpperCase());
  } else {
    // 여기에서 id는 'number' 타입을 가집니다
    console.log(id);
  }
}
```

또다른 예시는 `Array.isArray`와 같은 함수를 사용하는 것입니다.
Another example is to use a function like `Array.isArray`:

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

`else` 분기문에서는 별도 처리를 하지 않아도 된다는 점에 유의하시기 바랍니다. `x`의 타입이 `string[]`가 아니라면, `x`의 타입은 반드시 `string`일 것입니다.

때로는 유니언의 모든 멤버가 무언가 공통점을 가지는 경우도 있습니다.
에를 들어, 배열과 문자열은 둘 다 `slice` 메서드를 내장합니다.
유니언의 모든 멤버가 어떤 프로퍼티를 공통으로 가진다면, 좁히기 없이도 해당 프로퍼티를 사용할 수 있게 됩니다.

```ts twoslash
// 반환 타입은 number[] | string 으로 추론됩니다
function getFirstThree(x: number[] | string) {
  return x.slice(0, 3);
}
```

> 유니언은 의미 상 _합집합_을 뜻하는데, 실제로는 유니언 타입이 프로퍼티들의 _교집합_을 가리키는 것처럼 보여 헷갈리게 느낄 수 있습니다.
> 이는 지극히 우연이 아닙니다. _유니언_이라는 명칭은 타입 이론에서 비롯된 것입니다.
> `number | string` _유니언_ 타입은 각각의 타입을 가지는 _값들에 대하여_ 합집합을 취하여 구성됩니다.
> 두 집합과 각각의 집합에 대한 특성이 주어졌을 때, 두 집합의 _유니언_에는 각각의 특성들의 _교집합_만이 적용된다는 점에 유의하시기 바랍니다.
> 예를 들어, 한 방에는 모자를 쓰고 키가 큰 사람들이 있고 다른 방에는 모자를 쓰고 스페인어를 사용하는 사람들이 있다고 합시다. 이때 두 방을 합친다면, _모든_ 사람들에 대하여 우리가 알 수 있는 사실은 바로 누구나 반드시 모자를 쓰고 있다는 것입니다.

## 타입 별칭

지금까지는 객체 타입과 유니언 타입을 사용할 때 직접 해당 타입을 표기하였습니다.
이는 편리하지만, 똑같은 타입을 한 번 이상 재사용하거나 또다른 이름으로 가리키고 싶은 경우도 존재합니다.

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
별칭을 사용하는 것은, 별도로 이름붙인 타입을 새로 작성하는 것입니다.
다시 말해, 아래 코드는 틀린 것처럼 _보일 수_ 있지만, TypeScript에서는 이것이 정상인데 그 이유는 각각의 타입들이 동일 타입에 대한 별칭들이기 때문입니다.

```ts twoslash
declare function getInput(): string;
declare function sanitize(str: string): string;
// ---중간 생략---
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

_인터페이스 선언_은 객체 타입을 만드는 또다른 방법입니다.

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

앞서 타입 별칭을 사용한 것과 마찬가지로, 위 예시 코드는 타입이 부여되지 않은 임의의 객체를 사용한 것과 동일하게 작동합니다.
TypeScript는 오직 `printCoord`에 전달된 값의 _구조_에만 관심을 가집니다. 즉, 예측된 프로퍼티를 가지고 있는지 여부만을 따집니다.
이처럼, 타입이 가지는 구조와 능력에만 관심을 가진다는 점은 TypeScript가 _구조적_ 타입 시스템이라고 불리는 이유입니다.

### Differences Between Type Aliases and Interfaces

Type aliases and interfaces are very similar, and in many cases you can choose between them freely.
Almost all features of an `interface` are available in `type`, the key distinction is that a type cannot be re-opened to add new properties vs an interface which is always extendable.

<table class='full-width-table'>
  <tbody>
    <tr>
      <th><code>Interface</code></th>
      <th><code>Type</code></th>
    </tr>
    <tr>
      <td>
        <p>Extending an interface</p>
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
        <p>Extending a type via intersections</p>
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
        <p>Adding new fields to an existing interface</p>
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
        <p>A type cannot be changed after being created</p>
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

You'll learn more about these concepts in later chapters, so don't worry if you don't understand all of these right away.

- Prior to TypeScript version 4.2, type alias names [_may_ appear in error messages](/play?#code/PTAEGEHsFsAcEsA2BTATqNrLusgzngIYDm+oA7koqIYuYQJ56gCueyoAUCKAC4AWHAHaFcoSADMaQ0PCG80EwgGNkALk6c5C1EtWgAsqOi1QAb06groEbjWg8vVHOKcAvpokshy3vEgyyMr8kEbQJogAFND2YREAlOaW1soBeJAoAHSIkMTRmbbI8e6aPMiZxJmgACqCGKhY6ABGyDnkFFQ0dIzMbBwCwqIccabcYLyQoKjIEmh8kwN8DLAc5PzwwbLMyAAeK77IACYaQSEjUWZWhfYAjABMAMwALA+gbsVjoADqgjKESytQPxCHghAByXigYgBfr8LAsYj8aQMUASbDQcRSExCeCwFiIQh+AKfAYyBiQFgOPyIaikSGLQo0Zj-aazaY+dSaXjLDgAGXgAC9CKhDqAALxJaw2Ib2RzOISuDycLw+ImBYKQflCkWRRD2LXCw6JCxS1JCdJZHJ5RAFIbFJU8ADKC3WzEcnVZaGYE1ABpFnFOmsFhsil2uoHuzwArO9SmAAEIsSFrZB-GgAjjA5gtVN8VCEc1o1C4Q4AGlR2AwO1EsBQoAAbvB-gJ4HhPgB5aDwem-Ph1TCV3AEEirTp4ELtRbTPD4vwKjOfAuioSQHuDXBcnmgACC+eCONFEs73YAPGGZVT5cRyyhiHh7AAON7lsG3vBggB8XGV3l8-nVISOgghxoLq9i7io-AHsayRWGaFrlFauq2rg9qaIGQHwCBqChtKdgRo8TxRjeyB3o+7xAA), sometimes in place of the equivalent anonymous type (which may or may not be desirable). Interfaces will always be named in error messages.
- Type aliases may not participate [in declaration merging, but interfaces can](/play?#code/PTAEEEDtQS0gXApgJwGYEMDGjSfdAIx2UQFoB7AB0UkQBMAoEUfO0Wgd1ADd0AbAK6IAzizp16ALgYM4SNFhwBZdAFtV-UAG8GoPaADmNAcMmhh8ZHAMMAvjLkoM2UCvWad+0ARL0A-GYWVpA29gyY5JAWLJAwGnxmbvGgALzauvpGkCZmAEQAjABMAMwALLkANBl6zABi6DB8okR4Jjg+iPSgABboovDk3jjo5pbW1d6+dGb5djLwAJ7UoABKiJTwjThpnpnGpqPBoTLMAJrkArj4kOTwYmycPOhW6AR8IrDQ8N04wmo4HHQCwYi2Waw2W1S6S8HX8gTGITsQA).
- Interfaces may only be used to [declare the shapes of object, not re-name primitives](/play?#code/PTAEAkFMCdIcgM6gC4HcD2pIA8CGBbABwBtIl0AzUAKBFAFcEBLAOwHMUBPQs0XFgCahWyGBVwBjMrTDJMAshOhMARpD4tQ6FQCtIE5DWoixk9QEEWAeV37kARlABvaqDegAbrmL1IALlAEZGV2agBfampkbgtrWwMAJlAAXmdXdy8ff0Dg1jZwyLoAVWZ2Lh5QVHUJflAlSFxROsY5fFAWAmk6CnRoLGwmILzQQmV8JmQmDzI-SOiKgGV+CaYAL0gBBdyy1KCQ-Pn1AFFplgA5enw1PtSWS+vCsAAVAAtB4QQWOEMKBuYVUiVCYvYQsUTQcRSBDGMGmKSgAAa-VEgiQe2GLgKQA).
- Interface names will [_always_ appear in their original form](/play?#code/PTAEGEHsFsAcEsA2BTATqNrLusgzngIYDm+oA7koqIYuYQJ56gCueyoAUCKAC4AWHAHaFcoSADMaQ0PCG80EwgGNkALk6c5C1EtWgAsqOi1QAb06groEbjWg8vVHOKcAvpokshy3vEgyyMr8kEbQJogAFND2YREAlOaW1soBeJAoAHSIkMTRmbbI8e6aPMiZxJmgACqCGKhY6ABGyDnkFFQ0dIzMbBwCwqIccabcYLyQoKjIEmh8kwN8DLAc5PzwwbLMyAAeK77IACYaQSEjUWY2Q-YAjABMAMwALA+gbsVjNXW8yxySoAADaAA0CCaZbPh1XYqXgOIY0ZgmcK0AA0nyaLFhhGY8F4AHJmEJILCWsgZId4NNfIgGFdcIcUTVfgBlZTOWC8T7kAJ42G4eT+GS42QyRaYbCgXAEEguTzeXyCjDBSAAQSE8Ai0Xsl0K9kcziExDeiQs1lAqSE6SyOTy0AKQ2KHk4p1V6s1OuuoHuzwArMagA) in error messages, but _only_ when they are used by name.

For the most part, you can choose based on personal preference, and TypeScript will tell you if it needs something to be the other kind of declaration. If you would like a heuristic, use `interface` until you need to use features from `type`.

## Type Assertions

Sometimes you will have information about the type of a value that TypeScript can't know about.

For example, if you're using `document.getElementById`, TypeScript only knows that this will return _some_ kind of `HTMLElement`, but you might know that your page will always have an `HTMLCanvasElement` with a given ID.

In this situation, you can use a _type assertion_ to specify a more specific type:

```ts twoslash
const myCanvas = document.getElementById("main_canvas") as HTMLCanvasElement;
```

Like a type annotation, type assertions are removed by the compiler and won't affect the runtime behavior of your code.

You can also use the angle-bracket syntax (except if the code is in a `.tsx` file), which is equivalent:

```ts twoslash
const myCanvas = <HTMLCanvasElement>document.getElementById("main_canvas");
```

> Reminder: Because type assertions are removed at compile-time, there is no runtime checking associated with a type assertion.
> There won't be an exception or `null` generated if the type assertion is wrong.

TypeScript only allows type assertions which convert to a _more specific_ or _less specific_ version of a type.
This rule prevents "impossible" coercions like:

```ts twoslash
// @errors: 2352
const x = "hello" as number;
```

Sometimes this rule can be too conservative and will disallow more complex coercions that might be valid.
If this happens, you can use two assertions, first to `any` (or `unknown`, which we'll introduce later), then to the desired type:

```ts twoslash
declare const expr: any;
type T = { a: 1; b: 2; c: 3 };
// ---cut---
const a = (expr as any) as T;
```

## Literal Types

In addition to the general types `string` and `number`, we can refer to _specific_ strings and numbers in type positions.

One way to think about this is to consider how JavaScript comes with different ways to declare a variable. Both `var` and `let` allow for changing what is held inside the variable, and `const` does not. This is reflected in how TypeScript creates types for literals.

```ts twoslash
let changingString = "Hello World";
changingString = "Olá Mundo";
// Because `changingString` can represent any possible string, that
// is how TypeScript describes it in the type system
changingString;
// ^?

const constantString = "Hello World";
// Because `constantString` can only represent 1 possible string, it
// has a literal type representation
constantString;
// ^?
```

By themselves, literal types aren't very valuable:

```ts twoslash
// @errors: 2322
let x: "hello" = "hello";
// OK
x = "hello";
// ...
x = "howdy";
```

It's not much use to have a variable that can only have one value!

But by _combining_ literals into unions, you can express a much more useful concept - for example, functions that only accept a certain set of known values:

```ts twoslash
// @errors: 2345
function printText(s: string, alignment: "left" | "right" | "center") {
  // ...
}
printText("Hello, world", "left");
printText("G'day, mate", "centre");
```

Numeric literal types work the same way:

```ts twoslash
function compare(a: string, b: string): -1 | 0 | 1 {
  return a === b ? 0 : a > b ? 1 : -1;
}
```

Of course, you can combine these with non-literal types:

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

There's one more kind of literal type: boolean literals.
There are only two boolean literal types, and as you might guess, they are the types `true` and `false`.
The type `boolean` itself is actually just an alias for the union `true | false`.

### Literal Inference

When you initialize a variable with an object, TypeScript assumes that the properties of that object might change values later.
For example, if you wrote code like this:

```ts twoslash
declare const someCondition: boolean;
// ---cut---
const obj = { counter: 0 };
if (someCondition) {
  obj.counter = 1;
}
```

TypeScript doesn't assume the assignment of `1` to a field which previously had `0` is an error.
Another way of saying this is that `obj.counter` must have the type `number`, not `0`, because types are used to determine both _reading_ and _writing_ behavior.

The same applies to strings:

```ts twoslash
// @errors: 2345
declare function handleRequest(url: string, method: "GET" | "POST"): void;
// ---cut---
const req = { url: "https://example.com", method: "GET" };
handleRequest(req.url, req.method);
```

In the above example `req.method` is inferred to be `string`, not `"GET"`. Because code can be evaluated between the creation of `req` and the call of `handleRequest` which could assign a new string like `"GUESS"` to `req.method`, TypeScript considers this code to have an error.

There are two ways to work around this.

1. You can change the inference by adding a type assertion in either location:

   ```ts twoslash
   declare function handleRequest(url: string, method: "GET" | "POST"): void;
   // ---cut---
   // Change 1:
   const req = { url: "https://example.com", method: "GET" as "GET" };
   // Change 2
   handleRequest(req.url, req.method as "GET");
   ```

   Change 1 means "I intend for `req.method` to always have the _literal type_ `"GET"`", preventing the possible assignment of `"GUESS"` to that field after.
   Change 2 means "I know for other reasons that `req.method` has the value `"GET"`".

2. You can use `as const` to convert the entire object to be type literals:

   ```ts twoslash
   declare function handleRequest(url: string, method: "GET" | "POST"): void;
   // ---cut---
   const req = { url: "https://example.com", method: "GET" } as const;
   handleRequest(req.url, req.method);
   ```

The `as const` suffix acts like `const` but for the type system, ensuring that all properties are assigned the literal type instead of a more general version like `string` or `number`.

## `null` and `undefined`

JavaScript has two primitive values used to signal absent or uninitialized value: `null` and `undefined`.

TypeScript has two corresponding _types_ by the same names. How these types behave depends on whether you have the `strictNullChecks` option on.

### `strictNullChecks` off

With `strictNullChecks` _off_, values that might be `null` or `undefined` can still be accessed normally, and the values `null` and `undefined` can be assigned to a property of any type.
This is similar to how languages without null checks (e.g. C#, Java) behave.
The lack of checking for these values tends to be a major source of bugs; we always recommend people turn `strictNullChecks` on if it's practical to do so in their codebase.

### `strictNullChecks` on

With `strictNullChecks` _on_, when a value is `null` or `undefined`, you will need to test for those values before using methods or properties on that value.
Just like checking for `undefined` before using an optional property, we can use _narrowing_ to check for values that might be `null`:

```ts twoslash
function doSomething(x: string | undefined) {
  if (x === undefined) {
    // do nothing
  } else {
    console.log("Hello, " + x.toUpperCase());
  }
}
```

### Non-null Assertion Operator (Postfix `!`)

TypeScript also has a special syntax for removing `null` and `undefined` from a type without doing any explicit checking.
Writing `!` after any expression is effectively a type assertion that the value isn't `null` or `undefined`:

```ts twoslash
function liveDangerously(x?: number | undefined) {
  // No error
  console.log(x!.toFixed());
}
```

Just like other type assertions, this doesn't change the runtime behavior of your code, so it's important to only use `!` when you know that the value _can't_ be `null` or `undefined`.

### Enums

Enums are a feature added to JavaScript by TypeScript which allows for describing a value which could be one of a set of possible named constants. Unlike most TypeScript features, this is _not_ a type-level addition to JavaScript but something added to the language and runtime. Because of this, it's a feature which you should know exists, but maybe hold off on using unless you are sure. You can read more about enums in the [Enum reference page](/docs/handbook/enums.html).

### Less Common Primitives

It's worth mentioning the rest of the primitives in JavaScript which are represented in the type system.
Though we will not go into depth here.

##### `bigint`

From ES2020 onwards, there is a primitive in JavaScript used for very large integers, `BigInt`:

```ts twoslash
// @target: es2020

// Creating a bigint via the BigInt function
const oneHundred: bigint = BigInt(100);

// Creating a BigInt via the literal syntax
const anotherHundred: bigint = 100n;
```

You can learn more about BigInt in [the TypeScript 3.2 release notes](/docs/handbook/release-notes/typescript-3-2.html#bigint).

##### `symbol`

There is a primitive in JavaScript used to create a globally unique reference via the function `Symbol()`:

```ts twoslash
// @errors: 2367
const firstName = Symbol("name");
const secondName = Symbol("name");

if (firstName === secondName) {
  // Can't ever happen
}
```

You can learn more about them in [Symbols reference page](/docs/handbook/symbols.html).
