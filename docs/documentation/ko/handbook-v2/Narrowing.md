---
title: Narrowing
layout: docs
permalink: /ko/docs/handbook/2/narrowing.html
oneline: "프로젝트에서 TypeScript가 어떻게 많은 양의 타입 문법을 제거하기 위해 JavaScript 지식을 사용하는지 이해합니다."
---

`padLeft`라는 함수가 있다고 가정합니다.

```ts twoslash
function padLeft(padding: number | string, input: string): string {
  throw new Error("Not implemented yet!");
}
```

`padding`의 타입이 `number`일 땐, `input` 앞에 `padding`만큼 여백을 추가합니다.
`padding`의 타입이 `string`일 땐, `input` 앞에 `padding`을 바로 붙여야 합니다.
이런 `padLeft`가 `padding`이 `number`일 때 어떻게 동작하는지 확인해 봅시다.

```ts twoslash
// @errors: 2345
function padLeft(padding: number | string, input: string) {
  return " ".repeat(padding) + input;
}
```

오 이런, `padding`에서 오류가 발생했습니다.
TypeScript는 `number | string`에 `number`를 할당할 때 우리의 의도와 다르다고 해석하여 경고를 하고, 이건 올바른 결과입니다.
다시 말하면, 우린 `padding`이 `number`인지, `string`일 땐 어떻게 처리할 지 명시적으로 확인하지 않았습니다. 그럼 정확하게 수정해봅시다.

```ts twoslash
function padLeft(padding: number | string, input: string) {
  if (typeof padding === "number") {
    return " ".repeat(padding) + input;
  }
  return padding + input;
}
```

이 JavaScript 코드가 재미없어 보인다면, 정확하게 보고 있습니다.
우리가 표시한 주석을 제외하곤, TypeScript 코드는 JavaScript와 다를 바 없어 보입니다.
TypeScript의 타입 시스템은 일반적인 JavaScript 코드를 최대한 쉽게 작성해서 타입의 안정성을 얻는 것이 목표입니다.

별거 아닌 것처럼 보여도, 사실 여기 안에선 많은 일들이 벌어지고 있습니다.
TypeScript가 정적 타입을 사용해서 런타임 값을 분석하는 것과 마찬가지로, 타입에 영향을 줄 수 있는 `if/else`, 조건부 삼진법, 루프, 진실성 검사 등과 같은 JavaScript 런타임 제어 흐름 구조에 타입 분석을 겹처서 진행합니다.

`if` 검사에서, TypeScript는 `typeof padding === "number"`를 확인하고 _type guard_ 라고 하는 특수한 형태의 코드로 인식합니다.
TypeScript는 현재 위치에서 가능한 값의 가장 구체적인 타입을 분석하기 위해 취할 수 있는 실행 경로를 따르게 됩니다.
이러 특수한 검사(_type guards_ 라고 불리는)와 함께 할당 부분과 선언된 타입을 더 세분화하는 과정을 _narrowing_ 이라고 합니다.
많은 에디터에서 이러 타입들이 변화되는 것을 확인할 수 있으며, 다음 예에서도 볼 수 있습니다.

```ts twoslash
function padLeft(padding: number | string, input: string) {
  if (typeof padding === "number") {
    return " ".repeat(padding) + input;
    //                ^?
  }
  return padding + input;
  //     ^?
}
```

TypeScript narrowing을 이해하기 위해선 알아야 할 몇 가지 다른 구조가 있습니다.

## `typeof` type guards

지금까지 살펴 본 것처럼, JavaScript는 런타임시에 우리가 값의 타입에 대한 기본적인 정보를 알 수 있는 `typeof` 연산자를 제공합니다.
TypeScript는 다음과 같은 특정한 문자열 집합을 반환할 것으로 예상합니다.

- `"string"`
- `"number"`
- `"bigint"`
- `"boolean"`
- `"symbol"`
- `"undefined"`
- `"object"`
- `"function"`

`padLeft`에서 본 것처럼 이 연산자는 많은 JavaScript 라이브러리에서 등장하며, TypeScript는 각 분기들에서 타입을 좁혀서 이해할 수 있습니다.

TypeScript에서는 `typeof`에 의해서 반환되는 값을 확인하는 행위를 type guard라고 합니다.
`typeof`가 값에 동작하는 방식을 TypeScript가 인코딩하기 때문에 JavaScript의 여러 특징에 대해서도 잘 알고 있습니다.
예를 들어 위의 목록에서 `typeof`는 문자열 `null`을 반환하지 않습니다.
다음 예를 확인하세요.

```ts twoslash
// @errors: 2531
function printAll(strs: string | string[] | null) {
  if (typeof strs === "object") {
    for (const s of strs) {
      console.log(s);
    }
  } else if (typeof strs === "string") {
    console.log(strs);
  } else {
    // do nothing
  }
}
```

`printAll` 함수에서 `str`이 객체인지 확인하여 배열 타입인지(JavaScript에서는 배열이 객체 타입으로 강제할 수 있습니다.) 
그러나 JavaScript에서 `typeof null`은 실제로 `"object"` 입니다!
이건 역사적으로 아주 불행한 사건입니다.

경험이 충분히 있는 사용자들은 놀라지 않겠지만, JavaScript에서 모든 사람들이 이 문제를 마주친 것은 아닙니다. 다행히 TypeScript는 `strs`가 `string[]`이 아닌 `string[] | null`로 좁혀졌음을 알려줍니다.

이건 소위 "truthiness" 확인이라고 부르는 좋은 예시가 될 수 있습니다.

# Truthiness narrowing

Truthiness는 사전에서 찾을 수 있는 단어는 아니지만, JavaScript에서는 많이 들을 수 있습니다.

JavaScript에서는 조건문, `%%`, `||`, `if` 구문, Boolean 부정(`!`)등에서 어떤 표현식이든 사용할 수 있습니다.
예를 들어, `if` 구문은 조건이 항상 `boolean`이라고 예상하지 않습니다.

```ts twoslash
function getUsersOnlineMessage(numUsersOnline: number) {
  if (numUsersOnline) {
    return `There are ${numUsersOnline} online now!`;
  }
  return "Nobody's here. :(";
}
```

JavaScript에서 `if`와 같은 구조는 처음에 조건 결과를 `boolean`과 같게 "강제"한 다음에 결과가 `true`인지 `false`인지에 따라 분기를 선택합니다.
다음과 같은 값들은

- `0`
- `NaN`
- `""` (빈 문자열)
- `0n` (0의 `bigint` 버전)
- `null`
- `undefined`

모두 `false`로, 그 외의 값은 전부 `true`로 강제합니다.
항상 `Boolean` 함수를 사용하거나 더 짧은 이중-불린 부정(!!)을 `boolean` 으로 값을 강제할 수 있습니다. ( 전자는 `boolean` 타입으로 추론하고, 후자는 TypeScript가 더 좁은 리터럴 불린 값인 `true`로 추론합니다.)

```ts twoslash
// 두 결과 모두 `true` 입니다.
Boolean("hello"); // type: boolean, value: true
!!"world"; // type: true,    value: true
```

대부분 이러한 방식을 통해 `null` 또는 `undefined`와 같은 값에서 보호합니다.
예를 들어, `printAll` 함수에 적용해 보겠습니다.

```ts twoslash
function printAll(strs: string | string[] | null) {
  if (strs && typeof strs === "object") {
    for (const s of strs) {
      console.log(s);
    }
  } else if (typeof strs === "string") {
    console.log(strs);
  }
}
```

`strs`가 참 값인지 확인해서 위 오류를 제거한 것을 알 수 있습니다.
이렇게 하면 적어도 다음과 같은 코드가 실행될 때 발생할 수 있는 오류를 방지할 수 있습니다.

```txt
TypeError: null is not iterable
```

원시 값에 대한 truthiness 검사는 종종 오류가 발생하기 쉽다는 점을 명심하세요.
예를 들어 `printAll`을 작성할 때 다른 방식을 생각해볼 수 있습니다.

```ts twoslash {class: "do-not-do-this"}
function printAll(strs: string | string[] | null) {
  // !!!!!!!!!!!!!!!!
  //  DON'T DO THIS!
  //   KEEP READING
  // !!!!!!!!!!!!!!!!
  if (strs) {
    if (typeof strs === "object") {
      for (const s of strs) {
        console.log(s);
      }
    } else if (typeof strs === "string") {
      console.log(strs);
    }
  }
}
```

함수 전체에 참 값 검사로 감쌌지만, 미묘한 차이가 있습니다. 빈 문자열을 더 이상 올바르게 처리할 수 없습니다.

TypeScript는 여기서 전혀 문제가 되지 않지만, JavaScript가 익숙하지 않다면 주의해야 합니다.
TypeScript는 버그를 초기에 잡을 수 있도록 도울 수 있지만 값을 이용해서 _아무 것도_ 하지 않기로 결정한다면, 지나치게 규정되지 않은 상태에서 버그가 수행할 수 있는 작업만 할 수 있습니다.
linter를 사용하면 이러한 상황을 처리할 수 있습니다.

마지막으로 truthiness를 좁힐 수 있는 방식은 부울 부정 `!`이 부정 분기에서 걸러 낼 수 있습니다.

```ts twoslash
function multiplyAll(
  values: number[] | undefined,
  factor: number
): number[] | undefined {
  if (!values) {
    return values;
  } else {
    return values.map((x) => x * factor);
  }
}
```

## Equality narrowing

TypeScript는 `switch` 구문이나 `===`, `!==`, `==`, `!=`과 같은 같음 비교를 통해서 타입을 좁힐 수 있습니다.
예를 들면

```ts twoslash
function example(x: string | number, y: string | boolean) {
  if (x === y) {
    // 이제 'x'와 'y'에 대해서 아무 'string' 메서드를 호출 할 수 있습니다.
    x.toUpperCase();
    // ^?
    y.toLowerCase();
    // ^?
  } else {
    console.log(x);
    //          ^?
    console.log(y);
    //          ^?
  }
}
```

위의 예제에서 `x`와 `y`가 같다는 것을 확인했을 때, TypeScript는 둘의 타입이 같아야 한다는 것을 알 수 있습니다.
`x`와 `y`가 가질 수 있는 공통 타입이 `string`이 유일하기 때문에, TypeScript는 `x`와 `y`가 첫 번째 분기에서 `string`이여야 한다는 것을 알 수 있습니다.

변수가 아닌 특정 리터럴 값에 대해서도 검사가 가능합니다.
truthiness narrowing 섹션에서, `printAll` 함수는 실수로 빈 문자열을 제대로 처리하지 못해 오류가 발생하기 쉬웠습니다.
하지만 `null`을 차단하기 위해 특정한 검사를 할 수 있고, TypeScript는 올바르게 `strs`에서 `null` 타입을 제거할 수 있습니다.

```ts twoslash
function printAll(strs: string | string[] | null) {
  if (strs !== null) {
    if (typeof strs === "object") {
      for (const s of strs) {
        //            ^?
        console.log(s);
      }
    } else if (typeof strs === "string") {
      console.log(strs);
      //          ^?
    }
  }
}
```

JavaScript의 느슨한 동등 검사인 `==`와 `!=` 또한 올바르게 타입을 좁힐 수 있습니다.
하지만 익숙하지 않다면, 어떤 `== null`이 실제로 `null` 값인지 검사하는 것 뿐만 아니라 잠재적으로 `undefined` 인지 검사하게 됩니다.
`== undefined` 또한 마찬가지 입니다. `null`이거나 `undefined` 인지 검사합니다.

```ts twoslash
interface Container {
  value: number | null | undefined;
}

function multiplyValue(container: Container, factor: number) {
  // 타입에서 'null'과 'undefined' 제거
  if (container.value != null) {
    console.log(container.value);
    //                    ^?

    // 이제 'container.value' 를 안전하게 곱할 수 있습니다.
    container.value *= factor;
  }
}
```

## The `in` operator narrowing

JavaScript는 이름을 통해 속성이 객체 안에 있는지 확인하는 `in` 연산자가 있습니다.
TypeScript는 이 연산자를 사용해서 잠재적인 타입을 좁힐 수 있습니다.

예를 들어, 코드에서 `"value in x`가 있을 때 `"value"`는 문자열 리터럴이며 `x`는 유니언 타입입니다.
"true" 분기는 `x`가 `value`를 옵셔널이거나 필수적인 프로퍼티로 있다고 타입을 좁히고, "false" 분기는 `value`가 옵셔널이거나 프로퍼티로 없다고 타입을 좁히게 됩니다.

```ts twoslash
type Fish = { swim: () => void };
type Bird = { fly: () => void };

function move(animal: Fish | Bird) {
  if ("swim" in animal) {
    return animal.swim();
  }

  return animal.fly();
}
```

타입이 좁혀질 때 양쪽 모두 옵셔널 프로퍼티가 존재하며, 예를 들어 사람이 수영과 비행을 (올바른 장비와 함께) 할 수 있다면 `in` 검사시에 모두 나타나야 합니다.

<!-- prettier-ignore -->
```ts twoslash
type Fish = { swim: () => void };
type Bird = { fly: () => void };
type Human = { swim?: () => void; fly?: () => void };

function move(animal: Fish | Bird | Human) {
  if ("swim" in animal) {
    animal;
//  ^?
  } else {
    animal;
//  ^?
  }
}
```

## `instanceof` narrowing

JavaScript는 하나의 값이 다른 값의 "인스턴스" 여부를 확인하는 연산자가 있습니다.
보다 구체적으로 JavaScript에서 `x instanceof Foo`는 `x`의 _prototype chain_ 에 `Foo.prototype`을 포함하고 있는지 검사합니다.
여기보단 classes에서 더 자세히 확인할 수 있고, `new`를 이용해서 생성하는 대부분의 값에 대해선 여전히 유용합니다.
짐작하셨겠지만, `instanceof`는 또한 type guard이며, TypeScript는 `instanceof`를 통해 분기를 좁힐 수 있습니다.

```ts twoslash
function logValue(x: Date | string) {
  if (x instanceof Date) {
    console.log(x.toUTCString());
    //          ^?
  } else {
    console.log(x.toUpperCase());
    //          ^?
  }
}
```

## Assignments

앞서 언급했듯이 어떤 변수를 할당할 때, TypeScript는 할당의 오른쪽을 보고 왼쪽의 타입을 적절하게 좁힙니다.

```ts twoslash
let x = Math.random() < 0.5 ? 10 : "hello world!";
//  ^?
x = 1;

console.log(x);
//          ^?
x = "goodbye!";

console.log(x);
//          ^?
```

이러한 할당들은 전부 유효합니다.
관찰하고 있던 `x`의 타입이 첫 번째 할당에서 `number`로 변경되어도, `x`에 `string`을 할당할 수 있습니다.
처음에 `x`의 _선언된 타입_ 이 `string | number`이고, 할당은 선언된 타입에 의해서 항상 검사되기 때문입니다.

만약 우리가 `x`에 `boolean`을 할당했다면, 선언된 타입의 일부가 아니기 때문에 오류를 확인할 수 있습니다.

```ts twoslash
// @errors: 2322
let x = Math.random() < 0.5 ? 10 : "hello world!";
//  ^?
x = 1;

console.log(x);
//          ^?
x = true;

console.log(x);
//          ^?
```

## Control flow analysis

지금까지 TypeScript가 특정 분기내에서 어떻게 타입이 좁아지는지에 대해 몇 가지 기본적인 예를 살펴봤습니다.
하지만 그냥 모든 변수에서 `if`, `while`, 조건문 등에서 타입 가드를 찾는 것보다 더 많은 일들이 일어나고 있습니다.
예를 들면

```ts twoslash
function padLeft(padding: number | string, input: string) {
  if (typeof padding === "number") {
    return " ".repeat(padding) + input;
  }
  return padding + input;
}
```

`padLeft`는 첫 번째 `if` 블락에서 반환을 하고 있습니다.
TypeScript는 이 코드를 분석해서 `padding`이 `number`인 경우 본문의 나머지 부분인(`return padding + input;`)에 _도달할 수 없음_ 을 알 수 있습니다.
결과적으로 함수의 나머지 부분에서 `padding`의 타입을(`string | number`에서 `string`으로 좁히면서) `number`를 제거할 수 있습니다.

도달가능성에 기반해서 코드를 분석하는 것을 _control flow analysis_ 라고 하며, TypeScript는 이 흐름 분석을 통해서 type guard나 할당을 마주쳤을 때 타입을 좁게 만듭니다.
변수를 분석할 때, 제어 흐름은 분할했다가 다시 병합할 수 있으며, 각 지점에서 변수들은 다른 타입을 가질 수 있습니다.

```ts twoslash
function example() {
  let x: string | number | boolean;

  x = Math.random() < 0.5;

  console.log(x);
  //          ^?

  if (Math.random() < 0.5) {
    x = "hello";
    console.log(x);
    //          ^?
  } else {
    x = 100;
    console.log(x);
    //          ^?
  }

  return x;
  //     ^?
}
```

## Using type predicates

지금까지 기존의 JavaScript 구조체들과 함께 타입을 좁혀왔지만, 때로는 코드에서 타입이 어떻게 변하는지보다 직접 통제가 필요할 수 있습니다.

사용자-정의된 type guard를 정의하려면, 반환 타입이 _type predicate_ 인 함수를 정의하기만 하면 됩니다.

```ts twoslash
type Fish = { swim: () => void };
type Bird = { fly: () => void };
declare function getSmallPet(): Fish | Bird;
// ---cut---
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}
```

이 예제에서 `pet is Fish`는 type predicate 입니다.
predicate는 `parameterName is Type` 형태를 취하고 있으며, `parameterName`은 현재 함수 시그니처의 인자 이름이여야 합니다.

어떤 변수와 함께 `isFish`가 호출되면, TypeScript는 원래 타입과 호환이 될 때 변수를 특정 타입으로 _좁힙니다._

```ts twoslash
type Fish = { swim: () => void };
type Bird = { fly: () => void };
declare function getSmallPet(): Fish | Bird;
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}
// ---cut---
// 'swim'과 'fly에 대한 호출은 이제 괜찮습니다.
let pet = getSmallPet();

if (isFish(pet)) {
  pet.swim();
} else {
  pet.fly();
}
```

TypeScript는 `if`분기에서 `pet`이 `Fish`라는 걸 알고 있을 뿐만 아니라,
`else` 분기에서는 `Fish`가 _없으니_ 반드시 `Bird`인 것도 알고 있습니다.

Type guard인 `isFish`를 사용해서 `Fish | Bird` 배열을 필터링하고 `Fish` 배열을 얻을 수 있습니다.

```ts twoslash
type Fish = { swim: () => void; name: string };
type Bird = { fly: () => void; name: string };
declare function getSmallPet(): Fish | Bird;
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}
// ---cut---
const zoo: (Fish | Bird)[] = [getSmallPet(), getSmallPet(), getSmallPet()];
const underWater1: Fish[] = zoo.filter(isFish);
// or, equivalently
const underWater2: Fish[] = zoo.filter(isFish) as Fish[];

// predicate는 더 복잡한 예제에서 반복해서 사용해야 할 수 있습니다.
const underWater3: Fish[] = zoo.filter((pet): pet is Fish => {
  if (pet.name === "sharkey") return false;
  return isFish(pet);
});
```

추가적으로 classes는 타입을 줄이기 위해 [`this is Type` 사용할 수](/docs/handbook/2/classes.html#this-based-type-guards) 있습니다.

# Discriminated unions

지금까지 살펴본 예제들은 `string`, `boolean` 그리고 `number`와 같이 단순한 타입으로 단일 변수를 좁히는데 집중했습니다.
위 경우가 흔하지만, JavaScript에서 대부분 복잡한 구조를 다뤄보도록 하겠습니다.

동기 부여를 위해, 원과 정사각형 모양을 암호화한다고 상상해보겠습니다.
원은 지름을 측정하고 정사각형은 측면 길이를 측정합니다.
여기서 모양을 다루기 위해 `kind`라는 필드를 사용하겠습니다.
`Shape`을 정의하는 첫 번째 예제입니다.

```ts twoslash
interface Shape {
  kind: "circle" | "square";
  radius?: number;
  sideLength?: number;
}
```

`"circle"`과 `"square"`이라는 문자열 리터럴 타입의 union을 사용해서 도형을 원으로 처리할지 사각형으로 처리할지 알려줍니다.
`string` 대신에 `"circle" | "square"`을 사용해서 오타 문제를 방지할 수 있습니다.

```ts twoslash
// @errors: 2367
interface Shape {
  kind: "circle" | "square";
  radius?: number;
  sideLength?: number;
}

// ---cut---
function handleShape(shape: Shape) {
  // oops!
  if (shape.kind === "rect") {
    // ...
  }
}
```

원 혹은 정사각형을 다룰지에 따라 올바르게 동작하는 `getArea` 함수를 작성할 수 있습니다.
먼저 원에 대해서 작성하겠습니다.

```ts twoslash
// @errors: 2532
interface Shape {
  kind: "circle" | "square";
  radius?: number;
  sideLength?: number;
}

// ---cut---
function getArea(shape: Shape) {
  return Math.PI * shape.radius ** 2;
}
```

<!-- TODO -->

[`strictNullChecks`](/tsconfig#strictNullChecks)에서 오류를 발생시킵니다. `radius`가 정의되지 않았기 때문 적절한 오류입니다.
하지만 `kind` 프로퍼티를 이용해서 적절하게 검사하면 어떻게 될까요?

```ts twoslash
// @errors: 2532
interface Shape {
  kind: "circle" | "square";
  radius?: number;
  sideLength?: number;
}

// ---cut---
function getArea(shape: Shape) {
  if (shape.kind === "circle") {
    return Math.PI * shape.radius ** 2;
  }
}
```

흠 TypeScript는 여전히 무엇을 해야할지 모릅니다.
드디어 타입 검사기보다 우리가 더 많이 아는 부분에 도착했습니다.
non-null assertion(`shape.radius` 뒤에 `!`)를 통해서 `radius`가 확실하게 존재하는 것을 알려줄 수 있습니다.

```ts twoslash
interface Shape {
  kind: "circle" | "square";
  radius?: number;
  sideLength?: number;
}

// ---cut---
function getArea(shape: Shape) {
  if (shape.kind === "circle") {
    return Math.PI * shape.radius! ** 2;
  }
}
```

하지만 이상적으로 느껴지지 않습니다.
non-null assertions (`!`)을 이용해서 타입 검사기에 `shape.radius`가 정의된걸 알려야 하고, 이는 코드가 변경되면 오류가 발생하기 쉽습니다.
또한 [`strictNullChecks`](/tsconfig#strictNullChecks)를 제외하면 이러한 필드는 실수로 접근할 수 있습니다(옵셔널 프로퍼티는 단지 읽을 때 항상 있는 것으로 간주됩니다).
우린 분명히 더 잘 할 수 있습니다.

`Shape` 인코딩의 문제는 타입 검사기가 `kind` 프로퍼티를 가지고 `radius`가 있는지 `sideLength`가 있는지 알 수 없기 때문입니다.
타입 검사기에 이러한 점을 알려줄 수 있는 방법이 필요합니다.
이 점을 생각해서, 또다른 `Shape`를 정의하겠습니다.

```ts twoslash
interface Circle {
  kind: "circle";
  radius: number;
}

interface Square {
  kind: "square";
  sideLength: number;
}

type Shape = Circle | Square;
```

여기서는 `Shape`를 `kind` 프로퍼티에 따라서 적절하게 두 가지 타입으로 분리했지만, `radius`와 `sideLength`는 각각의 타입에 필수 프로퍼티로 선언되었습니다.

`Shape`의 `radius`에 접근할 때 어떤 결과가 발생하는지 살펴보세요.

```ts twoslash
// @errors: 2339
interface Circle {
  kind: "circle";
  radius: number;
}

interface Square {
  kind: "square";
  sideLength: number;
}

type Shape = Circle | Square;

// ---cut---
function getArea(shape: Shape) {
  return Math.PI * shape.radius ** 2;
}
```

`Shape`에 대한 첫 번째 정의와 마찬가지로 오류가 발생하고 있습니다.
`radius`가 옵셔널일 때 오류가 발생하는데([`strictNullChecks`](/tsconfig#strictNullChecks) 일 때만), TypeScript는 프로퍼티가 있는지 알 수 없기 때문입니다.
이제 `Shape`은 union이고 TypeScript는 `shape`은 `Square`일 수 있으며 `Square`에는 `radius`가 정의되지 않았다고 알려줍니다.
두 해석 모두 올바르지만, 새 `Shape`은 여전히 [`strictNullChecks`](/tsconfig#strictNullChecks) 외부에서 오류를 발생시킵니다.

하지만 `kind` 프로퍼티를 이용해서 다시 한번 확인하면 어떻게 될까요?

```ts twoslash
interface Circle {
  kind: "circle";
  radius: number;
}

interface Square {
  kind: "square";
  sideLength: number;
}

type Shape = Circle | Square;

// ---cut---
function getArea(shape: Shape) {
  if (shape.kind === "circle") {
    return Math.PI * shape.radius ** 2;
    //               ^?
  }
}
```

오류는 이제 사라졌습니다!
union의 모든 타입이 문자 그대로의 타입을 가진 공통 프로퍼티를 포함하면, TypeScript는 이를 _구별가능한 union_ 으로 간주해서 union의 요소를 좁힐 수 있습니다.

이 경우, `kind`가 공통 프로퍼티(`Shape`의 구별 가능한 프로퍼티로 고려되는)입니다. 
`kind` 프로퍼티가 `"circle`인지 검사하는 동안, `kind` 프로퍼티가 `"circle"`이 아닌 프로퍼티는 전부 제거되었습니다.
이렇게 `shape`은 `Circle`로 좁혀졌습니다.

`switch` 구문도 똑같이 검사가 동작합니다.
성가신 `!` non-null assertions 없이도 완전한 `getArea`를 작성할 수 있습니다.

```ts twoslash
interface Circle {
  kind: "circle";
  radius: number;
}

interface Square {
  kind: "square";
  sideLength: number;
}

type Shape = Circle | Square;

// ---cut---
function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    //                 ^?
    case "square":
      return shape.sideLength ** 2;
    //       ^?
  }
}
```

여기서 가장 중요한 점은 `Shape`의 인코딩입니다.
`Circle`과 `Square`가 `kind` 필드로 두 개의 타입으로 구분할 수 있다는 올바른 정보를 TypeScript에게 알려주는 것은 정말 중요합니다.
이렇게 하면 지금껏 작성한 JavaScript와 별 차이 없는 안전한 타입의 TypeScript 코드를 작성할 수 있습니다.
거기서부터 타입 시스템은 "올바르게" 동작할 수 있고, `switch` 구문에서 각 분기마다 정확한 타입을 확인할 수 있습니다.

> 그 외에 위의 예제에서 많은 시도를 해보고, 반환 키워드를 제거 해보세요.
> 타입 검사는 `switch`문의 다른 절에서 떨어질 때 버그를 방지하는데 도움이 될 수 있습니다.

원과 정사각형 이상으로 구분할 수 있는 unions는 유용합니다.
네트워크를 통해 메세지를 보내거나(클라이언트/서버 통신) 상태 관리 프레임워크에서 mutation을 코딩할 때와 같은 모든 종류의 메세징 체계를 JavaScript에서 나타내는 데 유용합니다.

# The `never` type

타입이 좁혀질 때, 모든 가능성을 제거하고 남는 것이 없는 상황이까지 줄일 수 있습니다.
이 경우 TypeScript는 존재하지 않는 상태를 나타내기 위해 `never` 타입을 사용합니다.

# Exhaustiveness checking

`never` 타입은 모든 타입에 할당할 수 있지만 `never` 자체르 ㄹ제외하고 `never`에 할당할 수 있는 타입은 없습니다. 즉 범위를 좁히거나 switch 구문에서 철저하게 확인할 때 `never`를 사용할 수 있습니다.

예를 들어, 도형을 `never`에 할당하려는 `getArea` 함수에 `default`를 추가하면 모든 사례가 처리되지 않을 때 동작합니다.

```ts twoslash
interface Circle {
  kind: "circle";
  radius: number;
}

interface Square {
  kind: "square";
  sideLength: number;
}
// ---cut---
type Shape = Circle | Square;

function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.sideLength ** 2;
    default:
      const _exhaustiveCheck: never = shape;
      return _exhaustiveCheck;
  }
}
```

`Shape` union에 새 멤버를 추가하면 TypeScript 오류가 발생합니다.

```ts twoslash
// @errors: 2322
interface Circle {
  kind: "circle";
  radius: number;
}

interface Square {
  kind: "square";
  sideLength: number;
}
// ---cut---
interface Triangle {
  kind: "triangle";
  sideLength: number;
}

type Shape = Circle | Square | Triangle;

function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.sideLength ** 2;
    default:
      const _exhaustiveCheck: never = shape;
      return _exhaustiveCheck;
  }
}
```
