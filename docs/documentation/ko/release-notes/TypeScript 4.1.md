---
title: TypeScript 4.1
layout: docs
permalink: /ko/docs/handbook/release-notes/typescript-4-1.html
oneline: TypeScript 4.1 Release Notes
---

## 템플릿 리터럴 타입 (Template Literal Types)

Typescript에서 string 리터럴 타입은 특정한 문자열의 집합을 예상하는 함수들과 API들을 모델링할 수 있게 합니다.

```ts twoslash
// @errors: 2345
function setVerticalAlignment(location: "top" | "middle" | "bottom") {
  // ...
}

setVerticalAlignment("middel");
```

이것은 string 리터럴 타입이 기본적으로 string 값에 대해 맞춤법 검사를 할 수 있다는 점에서 꽤 괜찮습니다.
또한 매핑된 타입에서 프로퍼티 이름으로서 string 리터럴을 사용할 수 있다는 점에서도 장점을 가집니다.

이러한 면에서, string 리터럴을 건축 블럭(building blocks)들처럼 사용할 수 있습니다.

```ts
type Options = {
  [K in "noImplicitAny" | "strictNullChecks" | "strictFunctionTypes"]?: boolean;
};
// same as
//   type Options = {
//       noImplicitAny?: boolean,
//       strictNullChecks?: boolean,
//       strictFunctionTypes?: boolean
//   };
```
하지만 저 string 리터럴 타입들을 건축 블럭처럼 사용할 수 있는 다른 경우가 있습니다: 다른 string 리터럴 타입들을 만들어낼 때

위같은 이유로, Typescript 4.1에서는 template 리터럴 string 타입을 추가했습니다. 
이것은 [template literal strings in JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)과 같은 문법을 가지고 있습니다.
하지만 이와 달리 template 리터럴 string 타입은 타입을 정의하는 위치에서 사용됩니다.
이것을 구체적인 리터럴 타입들과 사용한다면, 이것은 두 값들을 합쳐서 새로운 string 리터럴 타입을 생성합니다.

```ts twoslash
type World = "world";

type Greeting = `hello ${World}`;
//   ^?
```
유니온 타입을 대신해서 이를 사용하면 무슨 일이 일어날까요? 

이것은 각 유니온 멤버들이 나타낼 수 있는 모든 string 리터럴 집합을 생성합니다.

```ts twoslash
type Color = "red" | "blue";
type Quantity = "one" | "two";

type SeussFish = `${Quantity | Color} fish`;
//   ^?
```
이것들은 릴리즈 노트에 귀여운 예제들보다 더 많은 곳에서 사용될 수 있습니다.

예를들어, 다양한 UI 컴포넌트 라이브러리들은 주로 수직 및 수평 정렬을 할 수 있는 방법을 제공하고, 종종 `"bottom-right"`와 같은 문자열을 단순히 사용하여 정렬을 할 수 있게 합니다.
`"top"`, `"middle"`, `"bottom"`과 같은 수직 정렬과 `"left"`, `"center"`, `"right"`와 같은 수평 정렬을 dash를 사이로 하여 조합하면 9가지 경우의 문자열이 존재합니다. 

```ts twoslash
// @errors: 2345
type VerticalAlignment = "top" | "middle" | "bottom";
type HorizontalAlignment = "left" | "center" | "right";

// Takes
//   | "top-left"    | "top-center"    | "top-right"
//   | "middle-left" | "middle-center" | "middle-right"
//   | "bottom-left" | "bottom-center" | "bottom-right"

declare function setAlignment(value: `${VerticalAlignment}-${HorizontalAlignment}`): void;

setAlignment("top-left");   // works!
setAlignment("top-middel"); // error!
setAlignment("top-pot");    // error! but good doughnuts if you're ever in Seattle
```

UI API의 정렬에 대한 예제가 인터넷 상에 **많이** 있음에도 불구하고, 이것은 아직까지도 우리가 수동적으로 이것을 작성한다는 점에서 단순한 예시(toy example)에 불과합니다.

사실, 9개의 string들에 대해선, 문제가 없어보이지만, 만약에 엄청나게 많은 문자열들이 필요하다면 앞으로의 타입 검사를 위한 시간을 절약하기 위해서는 자동적으로 문자열들을 생성하는 것을 고려하게 될것입니다.

이것의 진정한 가치는 새로운 string 리터럴을 동적으로 생성한다는 데에서 옵니다.
예를들어, 객체를 가져오고, 거의 동일한 객체를 만드는 `makeWatchedObject` API를 떠올려보세요. 그리고 `on` method로 프로퍼티들의 변화를 감지한다고 합시다.
```ts
let person = makeWatchedObject({
  firstName: "Homer",
  age: 42, // give-or-take
  location: "Springfield",
});

person.on("firstNameChanged", () => {
  console.log(`firstName was changed!`);
});
```

Notice that `on` listens on the event `"firstNameChanged"`, not just `"firstName"`.
여기서 on 메소드는 `"firstName"`가 아닌 `"firstNameChanged"` 이벤트에 대기(listen)한다는 점에 유의하세요.

어떻게 on 메소드의 타입을 정할 수 있을까요?
```ts twslash
type PropEventSource<T> = {
    on(eventName: `${string & keyof T}Changed`, callback: () => void): void;
};

/// 감시 대상 객체를 on 메소드와 함께 만들어서
/// 프로퍼티의 변화를 감시할 수 있게됩니다.
declare function makeWatchedObject<T>(obj: T): T & PropEventSource<T>;
```

이처럼, 잘못된 값이 들어오면, 에러를 내는 것을 만들어낼 수 있습니다!
```ts twoslash
// @errors: 2345
type PropEventSource<T> = {
    on(eventName: `${string & keyof T}Changed`, callback: () => void): void;
};
declare function makeWatchedObject<T>(obj: T): T & PropEventSource<T>;
let person = makeWatchedObject({
  firstName: "Homer",
  age: 42, // 대략
  location: "Springfield",
});

// ---생략---
// error!
person.on("firstName", () => {});

// error!
person.on("frstNameChanged", () => {});
```

또한, 템플릿 리터럴 타입을 이용해서 특별한 것을 할 수 있습니다. : 치환하는 위치에서 추론(_infer_)하기

위 예제 부분에서  관련된 프로퍼티를 파악할 수 있도록, `eventName`문자열 부분에서 추론하는 제네릭 예시를 만들어 볼 수 있습니다.  

```ts twoslash
type PropEventSource<T> = {
    on<K extends string & keyof T>
        (eventName: `${K}Changed`, callback: (newValue: T[K]) => void ): void;
};

declare function makeWatchedObject<T>(obj: T): T & PropEventSource<T>;

let person = makeWatchedObject({
    firstName: "Homer",
    age: 42,
    location: "Springfield",
});

//작동합니다! 'newName'의 타입은 'string'입니다.
person.on("firstNameChanged", newName => {
    // 'newName'의 타입은 'fistName'의 타입과 같습니다. 
    console.log(`new name is ${newName.toUpperCase()}`);
});

// 작동합니다! 'newAge'의 타입은 'number'입니다.
person.on("ageChanged", newAge => {
    if (newAge < 0) {
        console.log("warning! negative age");
    }
})
```

제네릭 메소드에서 `on`을 만들어냈습니다.
`on` 메소드가 `"firstNameChanged"`와 같이 호출되면, Typescript는 `K`와 일치하는 타입인지 추론할 것 입니다.
이를 위해서, Typescript는 `K`와 `"Changed"`를 대조할 것이고, `"firstName"` string을 유추하게 될것입니다.
Typescript가 파악하고 나면, `on`메소드는 원본 객체에서 `firstName`의 타입을 가져 올 것입니다. (이 경우의 타입은 `string` 입니다.)
비슷하게, `"ageChanged"`와 같이 호출된다면, `age`프로퍼티의 타입을 찾아낼 것입니다. (이 경우의 타입은 `number` 입니다.)

추론은 문자열들을 분해하고, 재구성하기 위해 서로 다른 방식으로 결합될 수 있습니다.
사실, 이 string 리터럴 타입을 수정하는데 도움을 주기 위해, 대소문자를 구분하기 위한 몇개의 유틸리티 타입 별칭을 추가했습니다. (예시. 소문자를 대문자로 변환할 때) 

```ts twoslash
type EnthusiasticGreeting<T extends string> = `${Uppercase<T>}`

type HELLO = EnthusiasticGreeting<"hello">;
//   ^?
```

새로운 타입 별칭들은 `Uppercase`, `Lowercase`, `Capitalize`, `Uncapitalize`입니다.

앞 2개는 모든 문자를 바꾸고, 뒤 2개는 맨 앞 문자만을 바꿉니다.

더 자세한 사항은 [원본 pull request를 확인하세요.](https://github.com/microsoft/TypeScript/pull/40336) 그리고 [타입 별칭 도우미(helper)로 바꾸기 위한 진행중인 pull request](https://github.com/microsoft/TypeScript/pull/40580)도 확인하세요.

##  매핑된 타입들에서의 키 리매핑 (Key Remapping in Mapped Types)

우선, 매핑 타입은 임의적인 키들을 바탕으로 새로운 객체를 만들어 내거나
```ts
type Options = {
  [K in "noImplicitAny" | "strictNullChecks" | "strictFunctionTypes"]?: boolean;
};
// same as
//   type Options = {
//       noImplicitAny?: boolean,
//       strictNullChecks?: boolean,
//       strictFunctionTypes?: boolean
//   };
```
또는, 다른 객체 타입을 바탕으로 새로운 객체 타입들을 생성할 수 있다. 

```ts
/// 'Partial<T>'가 'T'와 같지만, 각 프로퍼티는 선택 사항으로 표시되어 있음.
type Partial<T> = {
  [K in keyof T]?: T[K];
};
```

지금까지, 매핑된 타입들은 제공되어진 키가 있어야만, 새로운 객체 타입들을 만들어 낼 수 있었습니다. 하지만, 대부분의 경우 입력 기반으로 새 키를 생성하거나, 키를 필터링 할 수 있습니다.

이것이 Typescript 4.1이 `as`식별자를 사용하여 키들을 재배치하는 것을 허용하는 이유입니다.

```ts
type MappedTypeWithNewKeys<T> = {
    [K in keyof T as NewKeyType]: T[K]
    //            ^^^^^^^^^^^^^
    //            이것이 새 문법입니다!
}
```
이 새로운 `as` 식별자로 템플릿 리터럴 타입처럼 이전 객체 프로퍼티의 이름을 통해 새로운 프로퍼티의 이름을 쉽게 만들어 낼 수 있습니다.

```ts twoslash
type Getters<T> = {
    [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K]
};

interface Person {
    name: string;
    age: number;
    location: string;
}

type LazyPerson = Getters<Person>;
//   ^?
```

그리고 `never`를 생성함으로서 키들을 탐색할 수 있습니다.
따라서, 몇몇 경우에서 추가로 `Omit` helper 타입을 사용할 필요가 없습니다. 

```ts twoslash
// 'kind' 프로퍼티를 삭제하기
type RemoveKindField<T> = {
    [K in keyof T as Exclude<K, "kind">]: T[K]
};

interface Circle {
    kind: "circle";
    radius: number;
}

type KindlessCircle = RemoveKindField<Circle>;
//   ^?
```
더 많은 정보를 보려면, [Github에서의 원본 pull request](https://github.com/microsoft/TypeScript/pull/40336)를 확인하세요.

## 재귀적 조건 타입 (Recursive Conditional Types)

JavaScript에서 임의적 수준에서 컨테이너 타입들을 평탄화하고, 만들어낼 수 있는 함수는 흔합니다.
예를들면, `Promise`인스턴스에 존재하는 `.then()` 메소드를 생각해봅시다.
`.then(...)`은 "promise답지 않은"값을 찾을 때 까지 각 promise를 풀어 헤치고, 그 값을 callback 함수로 넘깁니다.  
또한, `Array`의 평탄화하기에 얼마나 깊은 지를 파라미터로 하는 `flat`메소드가 존재합니다.

모든 실용적인 의도와 목적에서 Typescript의 타입 시스템에서 이를 설명하는 것은 불가능합니다.
이것을 위해 여러 트릭(hacks)들이 있었지만, 결국 그것들은 매우 불합리해 보였습니다.


위 상황이 바로 Typescript 4.1이 조건부 타입에 대한 여러 제한을 완화시킨 이유입니다. - 따라서 이런 패턴들을 설계(model)할 수 있습니다.
Typescript 4.1에서 재귀적 타입 추론을 쉽게 하기 위해서, 이제는 조건부 타입이 직접 재귀적으로 참조할 수 있게 되었습니다. 
예를들어, 다차원 배열의 요소 타입들을 쓰고 싶다면, 밑 `deepFlatten` 타입을 사용할 수 있습니다.

```ts
type ElementType<T> = T extends ReadonlyArray<infer U> ? ElementType<U> : T;

function deepFlatten<T extends readonly unknown[]>(x: T): ElementType<T>[] {
  throw "not implemented";
}

// 모두 'number[]' 타입을 반환합니다.
deepFlatten([1, 2, 3]);
deepFlatten([[1], [2, 3]]);
deepFlatten([[1], [[2]], [[[3]]]]);
```

비슷하게, Typescript 4.1에서는 `Awaited`의 타입을 사용함으로서, `Promise`를 풀어 헤칠 수 있습니다.

```ts
type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T;

/// `promise.then(...)`과 비슷하지만, 타입에 대해서는 더 정확함.
declare function customThen<T, U>(
  p: Promise<T>,
  onFulfilled: (value: Awaited<T>) => U
): Promise<Awaited<U>>;
```

이러한 재귀적 타입들은 강력하지만 책임감 있고, 적게 사용해야 합니다.


먼저, 이러한 재귀적 타입들은 많은 작업을 수행하게 하고, 따라서 타입 확인 시간을 늘어나게 합니다.
콜라츠 추측과, 피보나치 수열의 숫자들을 모델링하는 것은 재미있겠지만, 절대로 npm의 `.d.ts`파일에서는 하지마세요.

또한 계산 집약적인 것을 떠나서, 이러한 타입들은 충분히 복잡한 입력에 대한 내부 재귀 깊이 한계에 도달할 수 있습니다.
재귀 한계에 도달하면, compile-time 에러가 발생하게 됩니다. 
일반적으로, 좀 더 현실적인 예에서 타입을 쓰는 것을 실패하는 것보다 이러한 타입들을 전혀 사용하지 않는 것이 더 낫습니다.

[보충 자료](https://github.com/microsoft/TypeScript/pull/40002)를 참고하세요.

## 확인된 인덱스 접근 (Checked Indexed Accesses (`--noUncheckedIndexedAccess`))

TypeScript는 _index signatures_ 라고 불리는 기능을 갖고 있습니다.
이 시그니처들은 타입 시스템에 유저가 임의적 이름의 프로퍼티들에 접근할 수 있다는 신호를 보내는 방법입니다.
```ts twoslash
interface Options {
  path: string;
  permissions: number;

  // 추가된 프로퍼티들은 이 index signature에 의해 찾아집니다.
  [propName: string]: string | number;
}

function checkOptions(opts: Options) {
  opts.path; // string
  opts.permissions; // number
  // 모두 허용됩니다!
  // 모두 'string | number' 타입을 가집니다.
  opts.yadda.toString();
  opts["foo bar baz"].toString();
  opts[Math.random()].toString();
}
```

위에 예제에서, `Option`는 아직 프로퍼티 목록에 없는 추가될 모든 프로퍼티들은 `string | number` 타입을 가져야 한다는 index 시그니처를 가지고 있습니다.

이것은 당신이 무엇을 하고 있는지를 알기 쉽다는 점에서 가끔 간편하지만, 사실은 Javascript의 가장 중요한 가치는 가능한 모든 프로퍼티 이름을 지원하지 않는다는 것입니다.
에를들어, 대부분의 타입들은 예전 예제처럼 `Math.random()`을 통해 만들어진 프로퍼티 키의 값이 존재하지 않을 것입니다.
많은 사용자들은 이 동작들을 원하지 않을 수 있고, 이것이 `--stringNullChecks`의 완전한 엄격한 검사에 영향받지 않는 것처럼 느껴질 수 있습니다.

이것이 바로 TypeScript 4.1이 `--noUncheckedIndexedAccess`라는 새로운 플래그(flag)를 탑재한 이유입니다.
이 모드에서는, 모든 프로퍼티 접근과 (예를들어, `foo.bar`) 인덱스 접근 (예를들어, `foo["bar"]`)들이 잠재적으로 undefined로 여겨집니다.
이는 위 예제에서 `opts.yadda`가 `string | number`의 타입을 가지는 것이 아니라 `string | number | undefined`의 타입을 가진다는 것을 의미합니다. 
만약에 프로퍼티에 접근해야 한다면, 먼저, 이 프로퍼티의 존재를 확인해야하거나, non-null 추측 연산자 (접두문자 `!`)를 사용해야 합니다.
```ts twoslash
// @errors: 2532
// @noUncheckedIndexedAccess
interface Options {
  path: string;
  permissions: number;

  // Extra properties are caught by this index signature.
  [propName: string]: string | number;
}
// ---cut---
function checkOptions(opts: Options) {
  opts.path; // string
  opts.permissions; // number

  // These are not allowed with noUncheckedIndexedAccess
  opts.yadda.toString();
  opts["foo bar baz"].toString();
  opts[Math.random()].toString();

  // Checking if it's really there first.
  if (opts.yadda) {
    console.log(opts.yadda.toString());
  }

  // Basically saying "trust me I know what I'm doing"
  // with the '!' non-null assertion operator.
  opts.yadda!.toString();
}
```

`--noUncheckedIndexedAccess`를 사용하면 배열에 접근하는 것이 엄격하게 검사될 것이고, 범위를 확인하는 반복문에서도 검사될 것입니다.

```ts twoslash
// @errors: 2532
// @noUncheckedIndexedAccess
function screamLines(strs: string[]) {
  // 에러가 발생할 것임.
  for (let i = 0; i < strs.length; i++) {
    console.log(strs[i].toUpperCase());
  }
}
```

만약에 인덱스들이 필요하지 않는다면, `for`-`of` 반복문이나, `forEach`를 사용해서 각각의 요소를 반복해서 접근할 수 있습니다.
```ts twoslash
// @noUncheckedIndexedAccess
function screamLines(strs: string[]) {
  // 정상적으로 작동
  for (const str of strs) {
    console.log(str.toUpperCase());
  }

  // 정상적으로 작동 
  strs.forEach((str) => {
    console.log(str.toUpperCase());
  });
}
```
이 플래그는 out-of-bounds(범위 초과) 에러를 잡는데 유용할 수 있지만, 코드의 길이가 길어집니다. 따라서, `--string` 플래그를 통해 자동적으로 활성화되지 않습니다; 하지만, 이 기능에 관심이 있다면, 자유롭게 시도하여, 팀의 코드베이스에 적합한지 판단해 보세요.

[보충 pull request](https://github.com/microsoft/TypeScript/pull/39560)를 통해 더 자세히 배울 수 있습니다.
You can learn more [at the implementing pull request](https://github.com/microsoft/TypeScript/pull/39560).

## `baseUrl`없는 `paths` (`paths` without `baseUrl`)

경로 매핑을 사용하는 것은 매우 일반적이며, 종종 더 나은 import를 위해, monorepo linking을 시뮬레이션하기 위해 사용됩니다.

불행하게도, 경로 매핑을 활성화하기 위해 `paths`를 지정하려면 `baseUrl`이라고 불리는 옵션을 지정해야합니다.
이로 인해 auto-imports에서 잘못된 경로를 가져오는 경우가 가끔 있었습니다.
TypeScript 4.1은 `paths`옵션은 `baseUrl` 옵션 없이 사용될 수 있습니다.
이 수정 사항은 이러한 문제 중 일부를 피하는 데 도움이 됩니다.

## `checkJS`의 `allowJS` 내장 (`checkJs` Implies `allowJs`)

이전에는, JavaScript 프로젝트를 검사하기 위해서는 `allowJS`와 `checkJS`를 설정했어야 했습니다. 
이것은 약간 짜증나는 경험이였습니다. 따라서 `checkJS`는 이제 `allowJS`를 기본적으로 내장합니다.
[더 자세한 내용은 이 pull request를 참고하세요](https://github.com/microsoft/TypeScript/pull/40275).



## React 17 JSX 공장 (React 17 JSX Factories)


TypeScript 4.1은 React 17의 `jsx`와 `jsxs` factory 함수를 새로운 두 jsx 컴파일러 옵션을 통해 지원합니다.

- `react-jsx`
- `react-jsxdev`

이 옵션들은 개별적으로 production과 development 컴파일의 구분을 의도했습니다.
종종 하나의 옵션이 다른 옵션으로 확장할 수 있습니다.
예를들어, production 빌드를 위한 `tsconfig.json` 아마 이럴 겁니다.
```json tsconfig
// ./src/tsconfig.json
{
  "compilerOptions": {
    "module": "esnext",
    "target": "es2015",
    "jsx": "react-jsx",
    "strict": true
  },
  "include": ["./**/*"]
}
```

또한, development 빌드를 위한 것은 아마 이럴 겁니다.

```json tsconfig
// ./src/tsconfig.dev.json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "jsx": "react-jsxdev"
  }
}
```

더 자세한 정보는, [이 PR을 확인하세요](https://github.com/microsoft/TypeScript/pull/39199)

## JSDoc `@see` 태그를 위한 에디터 지원 (Editor Support for the JSDoc `@see` Tag)

JSDoc 태그 `@see` 태그는 TypeScript와 JavaScript에서 이제 더욱 강력하게 지원합니다.

따라서 태그 뒤에 점으로 표시된 이름에 정의로 이동과 같은 기능을 사용할 수 있습니다.

예를 들어, JSDco 코멘트에 `first`나 `C`의 정으로 이동하는 것은 다음 예제와 같이 동작합니다.

```ts
// @filename: first.ts
export class C {}

// @filename: main.ts
import * as first from "./first";

/**
 * @see first.C
 */
function related() {}
```

활발한 기여자 [Wenlu Wang](https://github.com/Kingwl)님께 [이것](https://github.com/microsoft/TypeScript/pull/39760)을 추가해 주신 것에 대해 감사합니다!

## 큰 변화 (Breaking Changes)

### `lib.d.ts`의 변화들 (`lib.d.ts` Changes)

`lib.d.ts`는 DOM 타입이 자동으로 생성되는 방법때문에 변경된 API 집합이 있을 수 있습니다.
구체적인 변화중 하나는, `Reflect.enumerate`가 ES2016에서 제외되었다는 것입니다.

### `abstract` 멤버들은 `async`로 표시될 수 없음 (`abstract` Members Can't Be Marked `async`)

`abstract`로 표시된 멤버들은 더 이상 `async`로 표시되지 않습니다.
여기서 호출자들은 반환 타입에만 관심이 있으므로`async` 키워드를 제거 했습니다.

### `any`/`unknown`의 잘못된 위치로의 전파 (`any`/`unknow` Are Propagated in Falsy Positions)

예전에는 `foo`의 타입이 `any`또는 `unknown`인 `foo && somethingElse`의 타입이 `somethingElse`의 타입으로 결정되었습니다.

예를들어, 예전에 예제에서의 `x` 타입은 `{someProp: string}` 였습니다.

```ts
declare let foo: unknown;
declare let somethingElse: { someProp: string };

let x = foo && somethingElse;
```

하지만, TypeScript 4.1에서는 이 타입을 추론하는데 더욱 신경쓰기로 했습니다.
아무것도 `&&`의 왼쪽 타입에 대해 알려진 게 없으면, 오른쪽이 아닌 바깥쪽으로 영향을 끼치게 하였습니다.

여기서 가장 흔히 볼 수 있는 패턴은 `boolean`과의 일치를 확인할때, 특히, 조건자 함수에서 나타나는 경향이 있습니다.

```ts
function isThing(x: any): boolean {
  return x && typeof x === "object" && x.blah === "foo";
}
```

종종 적절한 해결책은 `foo && someExpression`에서 `!!foo && someExpression`으로 바꾸는 것입니다.

### resolove의 파라미터가 더 이상 선택적이지 않습니다. (`resolve`'s Parameters Are No Longer Optional in `Promise`s)


코드를 밑처럼 작성할때

```ts
new Promise((resolve) => {
  doSomethingAsync(() => {
    doSomething();
    resolve();
  });
});
```

이러한 에러를 확인할 수 있을 것입니다.

```
  resolve()
  ~~~~~~~~~
error TS2554: Expected 1 arguments, but got 0.
  An argument for 'value' was not provided.
```

이것은 `resolve`가 더 이상 선택적 파라미터를 받지 않기 때문입니다. 그래서 기본적으로 이것은 이제 값을 전달해야 합니다.
Often this catches legitimate bugs with using `Promise`s.
종종 이것은 `Promise`를 사용하면서 정상적인 버그를 잡습니다.
이것을 해결하기 위한 흔한 방법은, 정확한 인자를 넘겨주거나, 명시적인 타입 인자를 넘겨주는 것입니다.

```ts
new Promise<number>((resolve) => {
  //     ^^^^^^^^
  doSomethingAsync((value) => {
    doSomething();
    resolve(value);
    //      ^^^^^
  });
});
```

하지만 가끔 `resolve()`가 인자 없이 호출되어야 할 때가 존재합니다.
이 상황에서는 `Promise`에 명시적인 `void` 제네릭 타입 인자를 넘겨 줄 수 있습니다. (예시. `Promise<void>`처럼 작성하기)
TypeScript 4.1의 이 새로운 기능에서 잠재적으로 `void` 전달 파라미터는 선택 사항이 될 수 있습니다. 
```ts
new Promise<void>((resolve) => {
  //     ^^^^^^
  doSomethingAsync(() => {
    doSomething();
    resolve();
  });
});
```

TypeScript 4.1은 이 문제를 해결하는 데 도움이 되는 빠른 해결 방법을 제공합니다.
TypeScript 4.1 ships with a quick fix to help fix this break.

### 조건부 전파가 선택적인 프로퍼티를 만듦 (Conditional Spreads Create Optional Properties)

JavaScript에서는 `{ ... foo}`와 같은 객체 분산이 잘못된 값에 대해서는 수행되지 않습니다.
따라서 이 코드에서 `{ ... foo}`와 `foo` 값이 만약 `null`이거나 `undefined`이면 건너뜁니다.

많은 사용자들이 이것을 "조건적으로" 프로퍼티들에게 퍼트리기 위해 사용합니다.

```ts
interface Person {
  name: string;
  age: number;
  location: string;
}

interface Animal {
  name: string;
  owner: Person;
}

function copyOwner(pet?: Animal) {
  return {
    ...(pet && pet.owner),
    otherStuff: 123,
  };
}

// 또한 optional chaning을 사용할 수 있음

function copyOwner(pet?: Animal) {
  return {
    ...pet?.owner,
    otherStuff: 123,
  };
}
```

여기 만약에, `pet`이 선언되었다면 `pet.owner`의 프로퍼티들이 전파될 것입니다. 그렇지 않으면, 반환된 객체에 프로퍼티가 전파되지 않습니다.

`copyOwner`의 반환 타입은 예전에 각 분산에 기반한 유니온 타입이였습니다.

```
{ x: number } | { x: number, name: string, age: number, location: string }
```


이것은 작업이 어떻게 수행되는지를 정확히 모델링했습니다. 만약 `pet`이 선언되었다면 `Person`에서 온 모든 프로퍼티들이 나타날 것입니다; 그렇지 않으면, 어떤 프로퍼티도 그 결과에 따라 정의되지 않게 됩니다.
이것은 전체만 있게 하거나 아예 아무것도 없게 하는(all-or-nothing) 작업입니다.

하지만, 이러한 패턴이 극단적으로 발전하여 하나의 객체에 수백 개의 확산이 이루어졌으며, 각 확산은 잠재적으로 수백 또는 수천개의 프로퍼티를 추가할 수 있게 되는 상황을 보게 되었습니다.

이는 다양한 이유로 결국은 엄청나게 비용만 비싸게 들고, 대부분의 상황에서 별로 이득이 되지 않는 것으로 밝혀졌습니다.

TypeScript 4.1에서는 가끔 반환된 타입이 모든 옵션 프로퍼티를 사용할 수 있습니다.

```
{
    x: number;
    name?: string;
    age?: number;
    location?: string;
}
```

결국 이것은 더 효율적으로 작동하고, 가독성이 더 좋게 됩니다..

자세한 사항은, [원본 수정 사항을 참고하세요](https://github.com/microsoft/TypeScript/pull/40778)
지금 당장 이 동작이 완벽하게 일관되지 않지만, 우리는 향후 릴리즈에서는 보다 깨끗하고 예측 가능한 결과가 나올 것으로 기대합니다.


### 일치하지 않은 파라미터는 더 이상 연관되지 않음 (Unmatched parameters are no longer related)

TypeScript는 서로 일치하지 않은 매개 파라미터를 `any` 타입과 연관시켰습니다.
[TypeScript 4.1의 변화들](https://github.com/microsoft/TypeScript/pull/41308)로 인해 TypeScript는 완전히 이러한 과정을 건너뜁니다.
이것은 지정가능한 몇몇 경우들이 실패하지 않는 것을 의미하고, overload 해결의 일부 사례도 잘 실패할 수 있게 된다는 것도 의미합니다.
예를 들어, Node.js에서의 `util.promisify`의 오버로드에 대한 해결책이 TypeScript 4.1에서 다른 오버로드를 선택하면, 가끔은 하위 부분에서 새 오류 또는 다른 오류를 발생시킬 수 있습니다.
오류를 피하려면 해결책으로 타입 assertion을 사용하는 것이 가장 좋을 것입니다.