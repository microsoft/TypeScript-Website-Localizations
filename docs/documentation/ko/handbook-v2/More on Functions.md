---
title: More on Functions
layout: docs
permalink: /ko/docs/handbook/2/functions.html
oneline: "TypeScript에서 함수가 어떻게 동작하는지 알아봅시다."
---

지역 함수이건, 다른 모듈에서 불러온 함수이건, 어떤 클래스의 메서드이건, 함수는 어느 어플리케이션 에서도 기초적인 구성 요소의 역할을 합니다.
함수는 값입니다. 그리고 다른 값처럼, TypeScript 에서는 함수들이 호출 될 수 있는 방법을 서술하는 방법이 많이 있습니다.
함수를 설명하는 타입들을 작성하는 방법들을 알아봅시다.

## 함수 타입 표현식

함수를 설명하는 가장 간단한 방법은 _함수 타입 표현식_ 입니다.
이 타입은 화살표 함수와 문법적으로 유사합니다.

```ts twoslash
function greeter(fn: (a: string) => void) {
  fn("Hello, World");
}

function printToConsole(s: string) {
  console.log(s);
}

greeter(printToConsole);
```

`(a: string) => void` 라는 문법은 "문자열 타입 `a`를 하나의 매개변수로 가지고 반환값이 없는 함수"를 의미합니다.
함수 선언처럼, 매개변수의 타입이 지정되지 않으면, 암묵적으로 `any`가 됩니다.

> 매개변수 이름이 **필수** 라는것을 명심하십시오. 함수 타입 `(string) => void`는 "`any` 타입을 가진 `string`이라는 이름의 매개변수를 가진 함수를 뜻합니다!

물론 타입 별칭을 사용해서 함수의 타입에 이름을 붙일 수 있습니다.

```ts twoslash
type GreetFunction = (a: string) => void;
function greeter(fn: GreetFunction) {
  // ...
}
```

## 호출 시그니처

JavaScript 에서, 함수들은 호출이 가능할 뿐만 아니라, 프로퍼티도 가질 수 있습니다.
하지만, 함수 타입 표현식 문법은 프로퍼티를 정의하는것을 허락하지 않습니다.
만약 우리가 호출 가능하면서 프로퍼티를 가진 무언가를 설명하려고 하면, 객체 타입에 _호출 시그니처_ 를 사용하여 표현할 수 있습니다.

```ts twoslash
type DescribableFunction = {
  description: string;
  (someArg: number): boolean;
};
function doSomething(fn: DescribableFunction) {
  console.log(fn.description + " returned " + fn(6));
}
```

이 문법은 함수 타입 표현식과 다릅니다. 매개변수 타입과 반환값의 타입 사이에 `=>`가 아닌 `:`를 사용해야 합니다.

## 구성 시그니처

JavaScript 함수는 `new`연산자를 통해서도 호출 될 수 있습니다.
TypeScript는 이런 것들이 주로 새로운 객체를 생성하는데 사용되기 때문에 _생성자_ 로 간주합니다.
여러분은 호출 시그니처 앞에 `new` 키워드를 붙임으로서, *구성 시그니처*를 작성할 수 있습니다.

```ts twoslash
type SomeObject = any;
// ---cut---
type SomeConstructor = {
  new (s: string): SomeObject;
};
function fn(ctor: SomeConstructor) {
  return new ctor("hello");
}
```

JavaScript의 `Date` 객체와 같은 몇몇 객체는 `new`가 있든 없든 호출 될 수 있습니다.
여러분은 호출 시그니처와 구성 시그니처를 임의로 같은 타입에서 결합시킬 수 있습니다.

```ts twoslash
interface CallOrConstruct {
  new (s: string): Date;
  (n?: number): number;
}
```

## 제네릭 함수

입력 값이 출력 값의 타입과 관련이 있거나, 두 입력값의 타입이 서로 관련이 있는 형태의 함수를 작성하는것은 흔히 일어나는 일입니다.
잠시 배열의 첫번째 원소를 반환하는 함수를 생각해 봅시다.

```ts twoslash
function firstElement(arr: any[]) {
  return arr[0];
}
```

함수는 제 역할을 하지만, 아쉽게도 반환 타입이 `any` 입니다.
함수가 배열 원소의 타입을 반환한다면 더 나을 것 같습니다.

TypeScript에서, _제네릭_ 문법이 두 값 사이의 상관관계를 표현하기 위해서 사용됩니다.
우리는 함수 시그니처에서 *타입 매개변수*를 선언함으로서 그런 표현을 할 수 있습니다.

```ts twoslash
function firstElement<Type>(arr: Type[]): Type | undefined {
  return arr[0];
}
```

타입 매개변수 `Type`을 이 함수에 선언하고, 필요한 두 곳에 사용함으로서 우리는 함수의 입력 값(배열)과 출력(반환 값) 사이에 연결고리를 만들었습니다.
이제 우리가 이 함수를 호출할 때, 더 특정한 타입을 얻을 수 있습니다.

```ts twoslash
declare function firstElement<Type>(arr: Type[]): Type | undefined;
// ---cut---
// s는 "string" 타입
const s = firstElement(["a", "b", "c"]);
// n은 "number" 타입
const n = firstElement([1, 2, 3]);
// u는 "undefined" 타입
const u = firstElement([]);
```

### 추론(Inference)

이 예제에서 우리는 `Type`을 특정하지 않았음에 주목하세요.
여기서 타입은 _추론되었습니다_ 즉 TypeScript에 의해서 자동적으로 선택된 것 입니다.

우리는 다중 타입 매개변수 또한 사용할 수 있습니다.
예를 들어서, `map`의 스탠드얼론 버전은 아래와 같을 것 입니다.

```ts twoslash
// prettier-ignore
function map<Input, Output>(arr: Input[], func: (arg: Input) => Output): Output[] {
  return arr.map(func);
}

// 매개변수 'n'의 타입은 'string' 입니다.
// 'parsed'는 number[] 타입을 하고 있습니다.
const parsed = map(["1", "2", "3"], (n) => parseInt(n));
```

이 예제에서 TypeScript는 `Input` 타입과(입력으로 주어진 `string` 배열로부터) `Output`타입을 함수 표현식의 반활 값(`number`)를 통해서 추론 할 수 있는 점을 눈여겨 보십시오.

### 타입 제한 조건

우리는 _모든_ 타입에 대해서 동작하는 제네릭 함수들을 작성하였습니다.
가끔, 우리는 두 값을 연관시키기 원하지만 특정한 값들의 부분집합에 한해서만 동작하기를 원할때가 있습니다.
이러한 경우에 우리는 *타입 제한 조건*을 사용하여, 타입 매개변수가 받아드릴 수 있는 타입들을 제한할 수 있습니다.

두 값중에 더 긴 것을 반환하는 함수를 작성해 봅시다.
이 작업을 위해, 우리는 number인 `length` 프로퍼티가 필요합니다.
우리는 `extends`절을 이용해서 타입 매개변수를 그 타입으로 _제한_ 할 수 있습니다.

```ts twoslash
// @errors: 2345 2322
function longest<Type extends { length: number }>(a: Type, b: Type) {
  if (a.length >= b.length) {
    return a;
  } else {
    return b;
  }
}

// longerArray 의 타입은 'number[] 입니다'
const longerArray = longest([1, 2], [1, 2, 3]);
// longerString 의 타입은 'alice' | 'bob' 입니다.
const longerString = longest("alice", "bob");
// 에러! number에는 'length' 프로퍼티가 없습니다.
const notOK = longest(10, 100);
```

이 예시에서는 몇 가지 흥미로운 점에 주목해야 합니다.
우리는 TypeScript가 `longest`의 반환 타입을 _추론_ 하도록 허용했습니다.
반환 타입 추론은 제네릭 함수에서도 작동합니다.

우리가 `Type`을 `{ length:number }`로 제한했기에, 우리는 `a`와 `b` 매개변수에 대해서 `.length` 프로퍼티에 접근 할 수 있었습니다.
타입 제한이 없다면, 이러한 값들이 length 프로퍼티를 가지지 않는 다른 타입일 수 있기 때문에, 우리는 이런 프로퍼티에 접근 할 수 없었을 것입니다.

`longerArray`와 `longerString`의 타입은 인수를 기반으로 추론되었습니다.
제네릭은 두개 이상의 값을 같은 타입으로 연관짓는것 이라는 사실을 기억해야 합니다!

결국 우리가 원하는 대로 `longest(10,100)`은 `number`타입이 `.length` 프로퍼티를 가지고 있지 않았기 때문에 호출이 거부된것을 볼 수 있습니다.

### 제한된 값으로 작업하기

다음은 제네릭 타입 제약 조건을 사용할 때, 흔히 범할 수 있는 실수입니다.

```ts twoslash
// @errors: 2322
function minimumLength<Type extends { length: number }>(
  obj: Type,
  minimum: number
): Type {
  if (obj.length >= minimum) {
    return obj;
  } else {
    return { length: minimum };
  }
}
```

이 함수는 문제가 없는것처럼 보입니다. `Type`은 `{ lenght: number }`로 제한되어 있고, 함수는 `Type`이나 저 제약조건을 만족하는 값을 반환합니다.
문제는 이 함수가 제약사항을 만족하는 _어떤_ 객체가 아닌, 입력된 _어떤_ 객체를 반환한다는 점입니다.
만약 이 코드가 유효하다면, 여러분들은 확실히 동작하지 않을 아래의 코드를 작성할 수 있을 것입니다.

```ts twoslash
declare function minimumLength<Type extends { length: number }>(
  obj: Type,
  minimum: number
): Type;
// ---cut---
// 'arr' gets value { length: 6 }
const arr = minimumLength([1, 2, 3], 6);
// 여기서 배열은 'slice' 메서드를 가지고 있지만
// 반환된 객체는 그렇지 않기에 에러가 발생합니다!
console.log(arr.slice(0));
```

### 타입 인수를 명시하기

TypeScript는 제네릭 호출에서 의도된 타입을 대체로 추론해 내지만, 항상 그렇지는 않습니다.
예를 들어서, 여러분들이 두 배열을 결합하는 함수를 하나 작성했다고 합시다.

```ts twoslash
function combine<Type>(arr1: Type[], arr2: Type[]): Type[] {
  return arr1.concat(arr2);
}
```

일반적으로 짝이 맞지 않는 배열과 함께 해당 함수를 부르는것은 잘못된 것일 것입니다.

```ts twoslash
// @errors: 2322
declare function combine<Type>(arr1: Type[], arr2: Type[]): Type[];
// ---cut---
const arr = combine([1, 2, 3], ["hello"]);
```

만약 여러분이 이런것을 의도하셨다면, 여러분은 수동으로 `Type`을 명시해야 합니다.

```ts twoslash
declare function combine<Type>(arr1: Type[], arr2: Type[]): Type[];
// ---cut---
const arr = combine<string | number>([1, 2, 3], ["hello"]);
```

### 좋은 제네릭 함수를 작성하기 위한 가이드라인

제네릭 함수를 작성하는것은 재미있고, 타입 매개 변수를 사용하는 것이 쉬울 수 있습니다.
너무 많은 타입 매개변수나 제한 조건을 꼭 필요하지 않은 곳에 사용하는것은 추론을 덜 성공하여 여러분의 함수 호출자를 불만스럽게 만들 수 있습니다.

#### 타입 매개변수를 누르기

여기 비슷해 보이는 두 함수를 쓰는 방법이 있습니다.

```ts twoslash
function firstElement1<Type>(arr: Type[]) {
  return arr[0];
}

function firstElement2<Type extends any[]>(arr: Type) {
  return arr[0];
}

// a: number (good)
const a = firstElement1([1, 2, 3]);
// b: any (bad)
const b = firstElement2([1, 2, 3]);
```

처음 보기에는 동일하게 보일 수 있습니다만, `firstElement1`이 이 함수를 작성하는데 더 좋은 방법입니다.
이 함수의 추론된 반환 타입은 `Type` 입니다만, `firstElement2`의 추론된 반환 타입은 TypeScript가 호출 중에 타입을 해석하기 위해서 "기다리기" 보다 호출 시점에 `arr[0]` 표현식을 타입 제한 조건을 이용해서 해석하기 때문에 `any`가 됩니다.

> **규칙**: 가능하다면, 타입 매개변수를 제약하기 보다는 타입 매개변수 그 자체를 사용하십시오.

#### 더 적은 타입 매개변수를 사용하기

다음은 유사한 함수의 또 다른 쌍 입니다.

```ts twoslash
function filter1<Type>(arr: Type[], func: (arg: Type) => boolean): Type[] {
  return arr.filter(func);
}

function filter2<Type, Func extends (arg: Type) => boolean>(
  arr: Type[],
  func: Func
): Type[] {
  return arr.filter(func);
}
```

우리는 _두 값을 연관시키지 않는_ 타입 매개변수 `Func`를 만들었습니다.
이는 타입 인수를 원하는 호출자가 아무 이유 없이 추가 타입 인수를 제공해야 하기 때문에, 상당히 좋지 않습니다.
`Func`는 함수를 더 읽고 이해하기 어렵게 만들 뿐이지, 아무것도 하지 않습니다!

> **규칙**: 항상 가능하다면 타입 매개변수를 최소로 사용하십시오

#### 타입 매개변수는 두번 나타나야 합니다.

가끔 우리는 함수가 제네릭이 필요 없을 수 있다는 사실을 간과합니다.

```ts twoslash
function greet<Str extends string>(s: Str) {
  console.log("Hello, " + s);
}

greet("world");
```

우리는 간단한 버전을 쉽게 작성할 수 있었을 것입니다.

```ts twoslash
function greet(s: string) {
  console.log("Hello, " + s);
}
```

타입 매개변수는 *여러 값의 타입을 연관*시키는 용도로 사용함을 기억해 주십시오.
만약 타입 매개변수가 함수 시그니처에서 한번만 사용되었다면, 어떤것도 연관시키지 않고 있는 것입니다.

> **규칙**: 만약 타입 매개변수가 한 장소에만 나온다면, 정말로 필요한건지 다시 생각해 보십시오.

## 선택적 매개변수

JavaScript에서 쓰이는 함수는 종종 다변적인 수의 인자들을 사용합니다.
예를 들어서 `number`의 `toFixed` 메서드는 선택적으로 자릿수를 사용합니다.

```ts twoslash
function f(n: number) {
  console.log(n.toFixed()); // 0 arguments
  console.log(n.toFixed(3)); // 1 argument
}
```

TypeScript에서 우리는 매개변수를 `?`로 표시함으로 *선택적*으로 만들 수 있습니다.

```ts twoslash
function f(x?: number) {
  // ...
}
f(); // OK
f(10); // OK
```

매개변수의 타입이 `number`로 특정되었지만, JavaScript에서 명시되지 않은 매개변수는 `undefined`가 되기 때문에, `x` 매개변수는 실질적으로 `number | undefined` 타입이 될것입니다.

여러분은 매개변수 *기본값*또한 제공할 수 있습니다.

```ts twoslash
function f(x = 10) {
  // ...
}
```

이제 `f`의 본문 내에서 모든 `undefined` 인수가 `10`으로 대체되기 때문에 `x`의 타입은 `number`가 될 것 입니다.
매개변수가 선택적일 때, 호출자는 `undefined`를 넘김으로서, "누락된" 인수를 흉내낼 수 있습니다.

```ts twoslash
declare function f(x?: number): void;
// cut
// All OK
f();
f(10);
f(undefined);
```

### 콜백 함수에서의 선택적 매개변수

선택적 매개변수 및 함수 타입 표현식에 대해 알게 되면, 콜백을 호출하는 함수를 작성할 때 아래와 같은 실수를 범하기 쉽습니다.

```ts twoslash
function myForEach(arr: any[], callback: (arg: any, index?: number) => void) {
  for (let i = 0; i < arr.length; i++) {
    callback(arr[i], i);
  }
}
```

사람들이 `index?`를 선택적 매개변수로 사용하기 위해 작성할 때 보통 의도하는것은 두 호출 모두 유효하기를 바라는 것입니다.

```ts twoslash
// @errors: 2532
declare function myForEach(
  arr: any[],
  callback: (arg: any, index?: number) => void
): void;
// ---cut---
myForEach([1, 2, 3], (a) => console.log(a));
myForEach([1, 2, 3], (a, i) => console.log(a, i));
```

_실제로_ 이것이 의미하는 바는 _`callback`이 하나의 인수로 호출될 수 있음_ 입니다.
다시말해, 이전의 함수 정의는 구현이 다음과 같을 수 도 있다고 하는것과 같습니다.

```ts twoslash
// @errors: 2532
function myForEach(arr: any[], callback: (arg: any, index?: number) => void) {
  for (let i = 0; i < arr.length; i++) {
    // 오늘은 index를 제공하고 싶지 않아
    callback(arr[i]);
  }
}
```

결국, TypeScript는 이러한 의미를 강제하여 실제로 일어나지 않을 에러를 발생시킵니다.

<!-- prettier-ignore -->
```ts twoslash
// @errors: 2532
declare function myForEach(
  arr: any[],
  callback: (arg: any, index?: number) => void
): void;
// ---cut---
myForEach([1, 2, 3], (a, i) => {
  console.log(i.toFixed());
});
```

JavaScript에서, 매개변수에 지정된것 보다 많은 인수를 전달하여 호출되면, 남은 인수들은 단순히 무시됩니다.
TypeScript도 같은 방식으로 동작합니다.
(같은 타입을 가진)매개변수가 더 적은 함수는 더 많은 매개변수가 있는 함수를 대체할 수 있습니다.

> 콜백에 대한 함수 타입을 작성할 때, 해당 인수 없이 _호출할_ 의도가 없는 한, _절대로_ 선택적 매개변수를 사용하지 마십시오.

## 함수 오버로드

몇몇 JavaScript 함수는 다양한 인수의 개수, 타입을 통해서 호출될 수 있습니다.
예를 들어서, 여러분은 `Date`를 생성하고, 타임스탬프 하나(인자 한개)를 받을 수도 있고, 월/일/년도 형식(인자 3개)를 받는 함수를 만들 수 있을 것입니다.

TypeScript에서는, 우리는 다른 방법으로 호출될 수 있는 함수를 *오버로드 시그니처*를 작성함으로 묘사할 수 있습니다.
그러기 위해서, 함수 시그니처 몇개(보통 2개 이상)을 적은 다음, 함수 본문을 작성하면 됩니다.

```ts twoslash
// @errors: 2575
function makeDate(timestamp: number): Date;
function makeDate(m: number, d: number, y: number): Date;
function makeDate(mOrTimestamp: number, d?: number, y?: number): Date {
  if (d !== undefined && y !== undefined) {
    return new Date(y, mOrTimestamp, d);
  } else {
    return new Date(mOrTimestamp);
  }
}
const d1 = makeDate(12345678);
const d2 = makeDate(5, 5, 5);
const d3 = makeDate(1, 3);
```

이 예시에서, 우리는 두개의 오버로드를 작성하였습니다. 하나는 한개의 인수를 받고, 다른 하나는 인수 세개를 받습니다.
처음에 쓴 이 두 시그니처들을 _오버로드 시그니처_ 라고 합니다.

그리고, 우리는 호환 가능한 시그니처와 함께 함수 구현을 작성하였습니다.
함수는 _구현_ 시그니처를 가지고 있습니다만, 이 시그니처는 직접 호출될 수 없습니다.
우리가 필수적인 매개변수 뒤에 두개의 선택적 매개변수를 작성하였지만, 우리는 두개의 매개변수 만으로는 이 함수를 호출 할 수 없습니다!

### 오버로드 시그니처와 구현 시그니처

이것은 일반적인 혼동의 원인입니다.
사람들은 종종 아래 처럼 코드를 작성하고, 왜 에러가 있는지 이해하지 못하는 경우가 있습니다.

```ts twoslash
// @errors: 2554
function fn(x: string): void;
function fn() {
  // ...
}
// 0개의 인자로 호출하기를 예상했음
fn();
```

다시 한번 강조하지만, 함수 본문을 작성하기 위해 사용된 시그니처는 외부에서 "보이지 않습니다".

> *구현*의 시그니처는 외부에서 보이지 않습니다.
> 오버로드된 함수를 작성할 때, 여러분들은 *두개 이상*의 시그니처를 함수 구현 위에 작성해야 합니다.

또한 구현 시그니처는 오버로드된 시그니처와 _호환되어야_ 합니다.
예를 들어, 아래의 함수들은 구현 시그니처가 오버로드들과 올바르게 일치하지 않기 때문에 오류가 있습니다.

```ts twoslash
// @errors: 2394
function fn(x: boolean): void;
// 인수 타입이 옳지 않습니다.
function fn(x: string): void;
function fn(x: boolean) {}
```

```ts twoslash
// @errors: 2394
function fn(x: string): string;
// 반환 타입이 옳지 않습니다.
function fn(x: number): boolean;
function fn(x: string | number) {
  return "oops";
}
```

### 좋은 오버로드 작성하기

제네릭처럼, 함수 오버로드를 작성 할 때 따라야 할 몇몇 가이드라인이 있습니다.
다음의 규칙을 따르는것은 여러분의 함수들을 부르기 쉽고, 이해하기 쉽고, 구현하기 쉽게 만들어 줄 것입니다.

문자열 혹은 배열의 길이를 반환하는 함수를 생각해 봅시다.

```ts twoslash
function len(s: string): number;
function len(arr: any[]): number;
function len(x: any) {
  return x.length;
}
```

이 함수는 괜찮습니다. 우리는 이 함수를 문자열이나 배열을 통해서 호출할 수 있습니다.
하지만, TypeScript는 하나의 오버로드를 통해서만 함수를 해석하기에, 우리는 이 함수를 문자열 _또는_ 배열이 될 수 있는 값을 통해서 호출할 수 없습니다.

```ts twoslash
// @errors: 2769
declare function len(s: string): number;
declare function len(arr: any[]): number;
// ---cut---
len(""); // OK
len([0]); // OK
len(Math.random() > 0.5 ? "hello" : [0]);
```

두 오버로드 모두 같은 인수 개수와, 같은 반환 타입을 가지기 때문에, 우리는 오버로드 되지 않은 함수의 형태로 다음과 같이 작성 할 수 있습니다.

```ts twoslash
function len(x: any[] | string) {
  return x.length;
}
```

훨씬 낫습니다!
호출자는 이 함수를 두가지 값 중 하나를 이용하여 호출할 수 있으며, 추가적으로 정확한 구현 시그니처를 찾을 필요도 없어졌습니다.

> 가능하다면 오버로드 대신 유니온 타입을 사용하십시오

### 함수 내에서 `this` 선언하기

TypeScript는 함수 안에서의 `this`가 무엇이 되어야 할지, 아래의 예시처럼 코드 흐름 분석을 통해서 추론합니다.

```ts twoslash
const user = {
  id: 123,

  admin: false,
  becomeAdmin: function () {
    this.admin = true;
  },
};
```

TypeScript는 함수 `user.becomeAdmin`이 외부 객체 `user`에 상응하는 `this`를 가지고 있다고 이해합니다.이것은 많은 경우에 충분할 수 있습니다만, 여러분들은 `this`객체가 표현하는 것에 대해서 더 많은 통제가 필요한 경우가 많을 겁니다. JavaScript 명세에서는 `this`라는 이름의 매개변수를 가질 수 없다고 나와 있기에, TypeScript는 해당 문법 공간을 함수 본문에서 `this`의 타입을 정의하는데 사용하도록 허락해 줍니다.

```ts twoslash
interface User {
  id: number;
  admin: boolean;
}
declare const getDB: () => DB;
// ---cut---
interface DB {
  filterUsers(filter: (this: User) => boolean): User[];
}

const db = getDB();
const admins = db.filterUsers(function (this: User) {
  return this.admin;
});
```

이 패턴은 일반적으로 다른 객체가 함수를 호출할 때 제어하는 콜백 스타일 API에서 흔히 사용됩니다. 이런 효과를 얻기 위해서는 화살표 함수가 아닌 `function` 키워드를 사용해야 합니다.

```ts twoslash
// @errors: 7041 7017
interface User {
  id: number;
  isAdmin: boolean;
}
declare const getDB: () => DB;
// ---cut---
interface DB {
  filterUsers(filter: (this: User) => boolean): User[];
}

const db = getDB();
const admins = db.filterUsers(() => this.admin);
```

## 알아야 할 다른 타입

함수 타입에 대해서 작업을 할 때, 자주 나타나는 몇가지 추가 타입들이 더 있습니다.
모든 타입처럼, 이 타입들을 어디서나 사용하실 수 있습니다만, 이 타입들은 특별히 함수라는 맥락에 관련이 깊습니다.

### `void`

`void`는 값을 반환하지 않는 함수의 반환 값을 의미합니다.
함수에 `return`문이 없거나, 명시적으로 값을 반환하지 않을 때, 추론되는 타입입니다.

```ts twoslash
// 추론된 반환 타입은 void 입니다.
function noop() {
  return;
}
```

JavaScript에서는, 아무것도 반환하지 않는 함수는 암묵적으로 `undefined` 값을 반환합니다.
하지만 TypeScript에서 `void`와 `undefined`는 같은 것으로 간주되지 않습니다.
이 장의 끝에서 다 자세한 내용들을 다루도록 하겠습니다.

> `void`는 `undefined`과 같지 않습니다.

### `object`

특별한 타입 `object`는 원시 값(`string`, `number`, `bigint`, `boolean`, `symbol`, `null`, `undefined`)이 아닌 모든 값을 지칭합니다.
이것은 _빈 객체 타입_ `{ }`와는 다르고, 전역 타입 `Object`와도 다릅니다.
아마도 여러분은 `Object`를 사용할 일이 없을 것입니다.

> `object`는 `Object`가 아닙니다.. **항상** `object`를 사용하십시오!

JavaScript에서 함수 값은 객체입니다. 프로퍼티가 있고, 프로토타입 체인에 `Object.prototype`가 있고, `instanceof Object`이면서, `Object.keys`를 호출할 수 있고, 기타 등등이 있습니다.
이러한 이유로, TypeScript에서 함수 타입은 `object`로 간주됩니다.

### `unknown`

`unknown` 타입은 *모든 값*을 나타냅니다.
`any` 타입과 유사합니다만, `unknown` 타입에 어떤 것을 대입하는 것이 유효하지 않기 때문에 더 안전합니다.

```ts twoslash
// @errors: 2571
function f1(a: any) {
  a.b(); // OK
}
function f2(a: unknown) {
  a.b();
}
```

이는 `any` 형태의 값을 함수 본문에 사용하지 않고도, 아무 값이나 받는 함수를 표현 할 수 있기 때문에, 함수 타입을 설명하는데에 유용하게 쓰입니다.

반대로, 여러분들은 unknown 타입의 값을 반환하는 함수를 표현할 수 있습니다.

```ts twoslash
declare const someRandomString: string;
// ---cut---
function safeParse(s: string): unknown {
  return JSON.parse(s);
}

// 'obj'를 사용할 때 조심해야 합니다!
const obj = safeParse(someRandomString);
```

### `never`

어떤 함수는 _결코(never)_ 값을 반환하지 않습니다

```ts twoslash
function fail(msg: string): never {
  throw new Error(msg);
}
```

`never` 타입은 결코 관측될 수 없는 값을 의미합니다.
반환 타입에서는, 해당 함수가 예외를 발생시키거나, 프로그램 실행을 종료함을 의미합니다.

`never`은 TypeScript가 유니온에 아무것도 남아있지 않다고 판단했을 때 또한 나타납니다.

```ts twoslash
function fn(x: string | number) {
  if (typeof x === "string") {
    // do something
  } else if (typeof x === "number") {
    // do something else
  } else {
    x; // 'never' 타입이 됨!
  }
}
```

### `Function`

전역 타입 `Function`은 `bind`, `call`, `apply` 그리고 JavaScript 함수 값에 있는 다른 프로퍼티를 설명하는데에 사용됩니다.
또한 여기에는 `Function`타입의 값은 언제나 호출될 수 있다는 값을 가지며, 이러한 호출은 `any`를 반환합니다.

```ts twoslash
function doSomething(f: Function) {
  return f(1, 2, 3);
}
```

이는 _타입되지 않은 함수 호출_ 이며, 안전하지 않은 `any` 타입을 반환하기에 일반적으로 피하는것이 가장 좋습니다.

만약 여러분이 임의의 함수를 허용해야 하지만, 호출할 생각이 없다면 `() => void` 타입이 일반적으로 더 안전합니다.

## 나머지 매개변수와 인수

<blockquote class='bg-reading'>
   <p>배경지식 읽기:<br />
   <a href='https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Functions/rest_parameters'>나머지 매개변수(Rest Parameter)</a><br/>
   <a href='https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Spread_syntax'>전개 구문(Spread Syntax)</a><br/>
   </p>
</blockquote>

### 나머지 매개변수(Rest Parameter)

선택적 매개변수와 오버로드를 사용하여 다양한 정해진 인수들을 받아드릴 수 있지만, 우리는 _정해지지 않은_ 수의 인수를 받아드리는 함수를 *나머지 매개변수*를 이용하여 정의할 수 있습니다.

나머지 매개변수는 다른 모든 매개변수 뒤에 나타나며, `...` 구문을 사용합니다.

```ts twoslash
function multiply(n: number, ...m: number[]) {
  return m.map((x) => n * x);
}
// 'a' gets value [10, 20, 30, 40]
const a = multiply(10, 1, 2, 3, 4);
```

TypeScrript에서는, 이러한 매개변수에 대한 타입 표기는 암묵적으로 `any`가 아닌 `any[]`를 사용하며, 타입 표현식은 `Array<T>` 또는 `T[]` 또는 튜플 타입(나중에 배울 것입니다)으로 표현해야 합니다.

### 나머지 인수(Rest Argument)

반대로 우리는 전개 구문을 사용하여 배열에서 제공되는 인수의 개수를 *제공*할 수 있습니다.
예를 들어, 배열의 `push` 메서드는 인수를 몇개든 받을 수 있습니다.

```ts twoslash
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
arr1.push(...arr2);
```

일반적으로 TypeScript는 배열이 불변하다고 간주하지 않습니다.
이로 인해 다음과 같은 놀라운 동작이 발생할 수 있습니다.

```ts twoslash
// @errors: 2556
// 추론된 타입은 0개 이상의 숫자를 가지는 배열인 number[]
// 명시적으로 2개의 숫자를 가지는 배열로 간주되지 않습니다
const args = [8, 5];
const angle = Math.atan2(...args);
```

이러한 상황의 최선의 해결책은 코드에 따라서 다르지만, 일반적으로 `const` 콘텍스트가 가장 간단한 해결책 입니다.

```ts twoslash
// 길이가 2인 튜플로 추론됨
const args = [8, 5] as const;
// OK
const angle = Math.atan2(...args);
```

나머지 인수를 사용하는 것은 오래된 런타임을 대상으로 할 때, [`downlevelIteration`](/tsconfig#downlevelIteration)을 필요로 할 수 있습니다.

<!-- TODO link to downlevel iteration -->

## 매개변수 분해(Parameter Destructing)

<blockquote class='bg-reading'>
   <p>배경지식 읽기:<br />
   <a href='https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment'>구조분해 할당</a><br/>
   </p>
</blockquote>

매개변수 분해를 사용하여 인수로 제공된 객체를 함수 본문에서 하나 이상의 지역 변수로 편리하게 언팩 할 수 있습니다.
JavaScript에서는 아래의 형태처럼 생겼습니다.

```js
function sum({ a, b, c }) {
  console.log(a + b + c);
}
sum({ a: 10, b: 3, c: 9 });
```

객체를 위한 타입 표기는 분해 구문 뒤에 위치하게 됩니다.

```ts twoslash
function sum({ a, b, c }: { a: number; b: number; c: number }) {
  console.log(a + b + c);
}
```

약간 장황하게 느껴질 수 있지만, 여기에서도 이름 붙은 타입을 사용할 수 있습니다.

```ts twoslash
// 이전 예제와 동일
type ABC = { a: number; b: number; c: number };
function sum({ a, b, c }: ABC) {
  console.log(a + b + c);
}
```

## 함수의 할당가능성

### `void` 반환 타입

함수의 `void` 반환 타입은 몇몇 일반적이지는 않지만 예측할 수 있는 동작을 발생시킬 수 있습니다.

`void` 반환 타입으로의 문맥적 타이핑은 함수를 아무것도 반환하지 **않도록** 강제하지 **않습니다**.이를 설명하는 또 다른 방법은, `void` 반환 타입을 가지는 문맥적 함수 타입(`type vf = () => void`)가 구현되었을 때, *아무값*이나 반환 될 수 있지만, 무시됩니다.

그러므로 후술할 타입 `() => void`의 구현들은 모두 유효합니다.

```ts twoslash
type voidFunc = () => void;

const f1: voidFunc = () => {
  return true;
};

const f2: voidFunc = () => true;

const f3: voidFunc = function () {
  return true;
};
```

그리고 이러한 함수의 반환값이 다른 변수에 할당될 때, 이들은 여전히 `void`타입을 유지할 것입니다.

```ts twoslash
type voidFunc = () => void;

const f1: voidFunc = () => {
  return true;
};

const f2: voidFunc = () => true;

const f3: voidFunc = function () {
  return true;
};
// ---cut---
const v1 = f1();

const v2 = f2();

const v3 = f3();
```

이러한 동작이 존재하기에, `Array.prototype.push`가 number를 반환하고, `Array.prototype.forEach` 메서드가 `void` 반환 타입을 가지는 함수를 예상함에도 다음 코드는 유효할 수 있습니다.

```ts twoslash
const src = [1, 2, 3];
const dst = [0];

src.forEach((el) => dst.push(el));
```

유의해야할 한가지 다른 경우가 있습니다. 리터럴 함수 정의가 `void` 반환 값을 가지고 있다면, 그 함수는 어떠한 것도 반환해서는 **안됩니다**.

```ts twoslash
function f2(): void {
  // @ts-expect-error
  return true;
}

const f3 = function (): void {
  // @ts-expect-error
  return true;
};
```

`void`에 대한 더 많은 내용은 다음 문서 항목을 참조해 주십시오.

- [v1 handbook](https://www.typescriptlang.org/docs/handbook/basic-types.html#void)
- [v2 handbook](https://www.typescriptlang.org/docs/handbook/2/functions.html#void)
- [FAQ - "Why are functions returning non-void assignable to function returning void?"](https://github.com/Microsoft/TypeScript/wiki/FAQ#why-are-functions-returning-non-void-assignable-to-function-returning-void)
