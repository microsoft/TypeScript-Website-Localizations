---
title: The Basics
layout: docs
permalink: /ko/docs/handbook/2/basic-types.html
oneline: "TypeScript를 배우는 첫 걸음: 기본 타입."
preamble: >
  <p>핸드북의 첫번째 장에 오신 것을 환영하며, 만약 TypeScript를 처음 경험하신다면 '<a href='https://www.typescriptlang.org/ko/docs/handbook/intro.html#%EC%8B%9C%EC%9E%91%ED%95%98%EA%B8%B0-get-started'>시작하기</a>' 가이드 문서 중 하나를 먼저 읽는 것을 추천합니다.</p>
---

JavaScript의 모든 값은 저마다 다양한 동작들을 내장하고 있으며 이는 다양한 연산(Operation)을 실행하여 확인할 수 있습니다.
이는 다소 추상적으로 들릴 수 있는데, 간단한 예시로 `message`라는 이름의 변수에 대하여 실행할 수 있는 몇몇 연산들을 살펴보겠습니다.

```js
// 'message'의 프로퍼티 'toLowerCase'에 접근한 뒤
// 이를 호출합니다
message.toLowerCase();

// 'message'를 호출합니다
message();
```

위 코드를 분석해보면, 우선 첫 번째 실행 코드 줄에서는 `toLowerCase`라는 프로퍼티에 접근한 뒤 이를 호출합니다.
두 번째 줄에서는 `message`를 직접 호출하려 하고 있습니다.

하지만 `message`의 값이 무엇인지 모른다면 - 일반적으로 그렇습니다 - 위 코드의 실행 결과가 무엇인지 확실히 말할 수 없습니다.
각 연산의 동작은 최초에 어떤 값을 가졌는지에 따라 완전히 달라집니다.

- `message`가 호출 가능한가?
- `toLowerCase`라는 프로퍼티를 가지는가?
- 만약 가진다면, `toLowerCase` 또한 호출 가능한가?
- 만약 두 값이 모두 호출 가능하다면, 각각이 무엇을 반환하는가?

이 질문들은 우리가 JavaScript로 코드를 작성할 때 흔히 고민하게 되는 것들이며, 우리는 이와 관련된 세세한 부분들을 전부 놓치지 않고 있기를 늘 바라게 됩니다.

`message`가 아래와 같이 정의되었다고 해봅시다.

```js
const message = "Hello World!";
```

익히 짐작하셨겠지만 여기서 `message.toLowerCase()`를 실행하면, 우리는 동일한 문자열이 소문자로만 이루어져 있는 값을 얻을 것입니다.

그렇다면 앞서 본 코드의 두 번째 라인은 어떨까요?
JavaScript가 익숙하시다면, 예외와 함께 실행이 되지 않을 것을 아실 겁니다.

```txt
TypeError: message is not a function
```

이와 같은 실수를 미리 방지할 수 있다면 참 좋을 것 같습니다.

JavaScript 런타임은 코드가 실행될 때 자신이 무엇을 해야 할지 결정하기 위하여 값의 *타입*, 즉 해당 값이 어떤 동작과 능력을 가지고 있는지를 확인합니다.
이것이 바로 `TypeError`가 암시하는 바입니다. 위 예시에서는 문자열인 `"Hello World"`가 함수로서 호출될 수 없다고 말하고 있는 것이죠.

일부 값들, 이를테면 `string`과 `number`과 같은 원시 타입의 값의 경우 `typeof` 연산자를 사용하면 각 값들의 타입을 실행 시점에 알 수 있습니다.
하지만 그 밖의 값들, 이를테면 함수값의 경우, 앞서 언급된 방식과 같이 해당 값의 타입을 실행 시점의 메커니즘은 존재하지 않습니다.
예를 들어, 아래와 같은 함수를 살펴보겠습니다.

```js
function fn(x) {
  return x.flip();
}
```

위 코드를 보면, 인자로 전달된 객체가 호출 가능한 프로퍼티인 `flip`을 가져야만 위 함수가 잘 작동할 것이라는 것을 우리는 코드를 읽음으로써 *알 수 있습니다.* 하지만 JavaScript는 우리가 알고 있는 이러한 정보를 코드가 실행되는 동안 알지 못합니다.
순수 JavaScript에서 `fn`가 특정 값과 어떤 동작을 수행하는지 알 수 있는 유일한 방법은 호출하고 무슨 일이 벌어지는지 보는 것입니다.
이와 같은 동작은 코드 실행 전에 예측을 어렵게 만듭니다. 다시 말해 코드가 어떤 동작 결과를 보일지 코드를 작성하는 동안에는 알기 어렵습니다.

이런 측면에서 볼 때, *타입*이란 어떤 값이 `fn`으로 전달될 수 있고, 어떤 값은 실행에 실패할 것임을 설명하는 개념입니다.
JavaScript는 오직 *동적* 타입만을 제공하며, 코드를 실행해야만 어떤 일이 벌어지는지 비로소 확인할 수 있습니다.

이에 대한 대안은 *정적* 타입 시스템을 사용하여 코드가 실행되기 *전에* 코드에 대하여 예측하는 것입니다.

## 정적 타입 검사

앞서 살펴본, `string`을 함수로서 호출하고자 했을 때 얻은 `TypeError`의 이야기로 돌아가 봅시다.
*대부분의 사람들은* 코드를 실행했을 때 오류를 보고 싶지 않습니다. 그것은 버그로 여겨집니다!
그리고 새로운 코드를 작성할 때 우리는 새로운 버그를 만들어내지 않도록 최선을 다합니다.

여기서 만약 약간의 코드를 추가하고 파일을 저장한 뒤, 코드를 다시 실행했을 때 바로 오류가 확인된다면, 문제를 신속하게 격리시킬 수 있을 것입니다. 하지만 항상 그렇게 되는 것은 아닙니다.
기능을 충분히 테스트하지 않아서, 잠재적인 오류를 미처 발견하지 못할 수도 있습니다!
또는 운 좋게 오류를 발견했더라도, 결국 상당한 규모의 리팩토링을 거치고 새 코드를 추가하면서 의도치 않게 코드를 깊게 파헤치게 될 수도 있습니다.

이상적으로는, 코드를 실행하기 *전에* 이러한 버그를 미리 발견할 수 있는 도구가 있다면 좋을 것입니다.
TypeScript와 같은 정적 타입 검사기의 역할이 바로 그것입니다.
*정적 타입 시스템*은 우리가 작성한 프로그램에서 사용된 값들의 형태와 동작을 설명합니다.
TypeScript와 같은 타입 검사기는 이 정보를 활용하여 프로그램이 제대로 작동하지 않을 때 우리에게 알려줍니다.

```ts twoslash
// @errors: 2349
const message = "hello!";

message();
```

위의 마지막 예시를 TypeScript로 실행하면, 코드가 실행되기에 앞서 우선 오류 메시지를 확인하게 됩니다.

## 예외가 아닌 실행 실패

지금까지 런타임 오류에 대하여 다루었습니다. 이는 JavaScript 런타임이 무언가 이상하다고 우리에게 직접 말해주는 경우에 해당합니다.
이러한 오류는 예기치 못한 문제가 발생했을 때 JavaScript가 어떻게 대응해야 하는지 [ECMAScript 명세](https://tc39.github.io/ecma262/)에서 명시적인 절차를 제공하기 때문에 발생하는 것입니다.

예를 들어, 명세에 따르면 호출 가능하지 않은 것에 대하여 호출을 시도할 경우 오류가 발생합니다.
이는 "당연한 동작"처럼 들릴 수 있겠으나, 누군가는 객체에 존재하지 않는 프로퍼티에 접근을 시도했을 때에도 역시 오류를 던져야 한다고 생각할 수 있습니다.
하지만 그 대신 JavaScript는 전혀 다르게 반응하며 `undefined`를 반환합니다.

```js
const user = {
  name: "Daniel",
  age: 26,
};

user.location; // undefined 를 반환
```

궁극적으로, 정적 타입 시스템은 어떤 코드가 오류를 발생시키지 않는 "유효한" JavaScript 코드일지라도, 정적 타입 시스템 내에서 오류로 간주되는 경우라면 이를 알려주어야 합니다.
TypeScript에서는, 아래의 코드는 `location`이 정의되지 않았다는 오류를 발생시킵니다.

```ts twoslash
// @errors: 2339
const user = {
  name: "Daniel",
  age: 26,
};

user.location;
```

비록 때로는 이로 인하여 표현의 유연성을 희생해야 하겠지만, 이렇게 함으로서 명시적인 버그는 아니지만 버그로 타당히 간주되는 경우를 잡아내는 데에 그 목적이 있습니다.
그리고 TypeScript는 이러한 겉으로 드러나지 않는 버그를 *꽤 많이* 잡아냅니다.

예를 들어, 오타,

```ts twoslash
// @noErrors
const announcement = "Hello World!";

// 바로 보자마자 오타인지 아실 수 있나요?
announcement.toLocaleLowercase();
announcement.toLocalLowerCase();

// 아마 아래와 같이 적으려 했던 것이겠죠...
announcement.toLocaleLowerCase();
```

호출되지 않은 함수,

```ts twoslash
// @noUnusedLocals
// @errors: 2365
function flipCoin() {
  // 본래 의도는 Math.random()
  return Math.random < 0.5;
}
```

또는 기본적인 논리 오류 등이 있습니다.

```ts twoslash
// @errors: 2367
const value = Math.random() < 0.5 ? "a" : "b";
if (value !== "a") {
  // ...
} else if (value === "b") {
  // 이런, 이 블록은 실행되지 않겠군요
}
```

## 프로그래밍 도구로서의 타입

TypeScript는 우리가 코드 상에서 실수를 저질렀을 때 버그를 잡아줍니다.
그거 좋죠, 그런데 TypeScript는 *여기서 더 나아가서* 우리가 실수를 저지르는 바로 그 순간 이를 막아줍니다.

타입 검사기는 우리가 변수 또는 다른 프로퍼티 상의 올바른 프로퍼티에 접근하고 있는지 여부를 검사할 수 있도록 관련 정보들을 가지고 있습니다.
이 정보를 활용하면 타입 검사기는 우리가 사용할 수 있는 프로퍼티를 *제안*할 수 있게 됩니다.

즉, TypeScript는 코드 수정에 활용될 수 있고, 우리가 코드를 입력할 때 오류 메시지를 제공하거나 코드 완성 기능을 제공할 수 있습니다.
이는 TypeScript에서 도구(Tooling)를 논할 때에 흔히 언급되는 내용입니다.

<!-- prettier-ignore -->
```ts twoslash
// @noErrors
// @esModuleInterop
import express from "express";
const app = express();

app.get("/", function (req, res) {
  res.sen
//       ^|
});

app.listen(3000);
```

TypeScript는 프로그래밍 도구를 중요하게 생각하며, 여기에는 코드 완성 및 오류 메시지 기능 이외에도 다양한 것이 포함됩니다.
TypeScript를 지원하는 코드 편집기는 오류를 자동으로 고쳐주는 "Quick Fixes", 코드를 간편하게 재조직하는 리팩토링, 변수의 정의로 빠르게 이동하는 유용한 네비게이션, 주어진 변수에 대한 모든 참조 검색 등의 기능들을 제공합니다.
이 모든 기능들은 타입 검사기를 기반으로 하며 완전히 크로스 플랫폼으로 동작하므로, [여러분이 주로 사용하는 코드 편집기가 TypeScript를 지원](https://github.com/Microsoft/TypeScript/wiki/TypeScript-Editor-Support)할 확률이 높습니다.

## `tsc`, TypeScript 컴파일러

지금까지 계속 타입 검사에 대하여 이야기했지만, 아직 타입 *검사기*를 사용하지 않았습니다.
우리의 새로운 친구 `tsc`, TypeScript 컴파일러와 첫인사를 나누도록 합시다.
우선, npm을 사용하여 설치하도록 하겠습니다.

```sh
npm install -g typescript
```

> 위 코드를 실행하면 TypeScript 컴파일러 `tsc`가 전역 설치됩니다.
> `tsc`를 로컬 `node_modules` 패키지로부터 실행하고자 한다면 `npx` 또는 유사한 도구를 사용하면 됩니다.

이제 빈 폴더로 이동하여 첫번째 TypeScript 프로그램인 `hello.ts`를 작성해보도록 하겠습니다.

```ts twoslash
// 세상을 맞이하세요.
console.log("Hello world!");
```

코드 상에 아무런 밑줄도 그어지지 않았음에 유의하세요. 이 "hello world" 프로그램은 JavaScript로 작성하는 "hello world" 프로그램과 동일한 모습을 가집니다.
그리고 이제 `typescript` 패키지와 함께 설치된 `tsc` 명령어를 실행하여 타입 검사를 수행합니다.

```sh
tsc hello.ts
```

짜잔!

잠깐, 정확히 *무엇*이 "짜잔"하고 나왔다는 것이죠?
`tsc`를 실행했지만 아무 일도 일어나지 않았습니다!
뭐, 타입 오류가 없었으니, 아무것도 보고될 것이 없고 그래서 콘솔에도 아무런 출력이 나타나지 않았습니다.

하지만 다시 확인해보면, 우리는 그 대신 *파일* 출력을 얻었습니다.
현재 디렉토리를 보면, `hello.ts` 파일 옆에 `hello.js` 파일이 있는 것을 볼 수 있습니다.
이것이 `tsc`가 우리의 `hello.ts` 파일을 JavaScript 파일로 *컴파일* 또는 *변형*한 결과물입니다.
그리고 그 내용을 확인해보면, TypeScript가 `.ts` 파일을 처리한 뒤 뱉어낸 내용을 확인할 수 있습니다.

```js
// 세상을 맞이하세요.
console.log("Hello world!");
```

위 경우, TypeScript가 변형해야 할 내용은 극히 적었고, 따라서 우리가 처음에 작성한 것과 동일한 결과물이 나왔습니다.
컴파일러는 사람이 작성한 듯이 깔끔하고 읽을 수 있는 코드를 만들어내고자 시도합니다.
물론 그것이 항상 쉬운 것은 아니지만, TypeScript는 일관성 있게 들여 쓰기를 수행하고, 여러 줄에 걸쳐 코드가 작성되는 것을 감안하고, 코드 주변에 작성된 주석도 잘 배치해둡니다.

만약 타입 검사 오류가 *주어지면* 어떨까요?
`hello.ts`를 다시 작성해보겠습니다.

```ts twoslash
// @noErrors
// 아래는 실무 수준에서 범용적으로 쓰이는 환영 함수입니다
function greet(person, date) {
  console.log(`Hello ${person}, today is ${date}!`);
}

greet("Brendan");
```

여기서 `tsc hello.ts`를 다시 실행하면, 커맨드 라인 상에서 오류를 얻게 된다는 점에 유의하세요!

```txt
Expected 2 arguments, but got 1.
```

TypeScript는 `greet` 함수에 인자를 전달하는 것을 깜빡했다고 말해주고 있으며, 실제로 그렇습니다.
지금까지 우리는 오직 표준적인 JavaScript만을 작성했을 뿐인데, 여전히 타입 검사를 통하여 코드 상의 문제를 발견해낼 수 있었습니다.
고마워, TypeScript!

### 오류 발생시키기

앞서 살펴 본 예시에서 눈치 채셨는지 모르겠지만, `hello.js` 파일의 내용이 또 한 번 수정되었습니다.
파일을 열어보면, 입력으로 사용된 코드 파일과 실질적으로 동일하다는 것을 알 수 있습니다.
우리 코드를 보고 `tsc`가 오류를 발생시켰다는 점을 감안하면 다소 놀랍게 느껴질 수도 있지만, 이는 TypeScript의 핵심 가치 중 하나에 기반한 동작입니다. 그것은 바로, 대부분의 경우 *당신이* TypeScript보다 더 잘 알고 있을 것이라는 생각입니다.

앞에서도 말씀드렸듯이 코드에 대한 타입 검사는 프로그램이 실행할 수 있는 동작을 제한합니다. 따라서 타입 검사가 허용 또는 제한하는 동작의 범위에는 어느 정도 절충과 타협이 존재합니다.
대부분의 경우 문제가 발생하지 않지만, 타입 검사가 방해가 되는 시나리오 또한 존재합니다.
예를 들어, JavaScript로 작성된 코드를 TypeScript로 마이그레이션하는 과정에서 타입 검사 오류가 발생하는 경우를 떠올려보세요.
결국에는 타입 검사를 통과하도록 코드를 수정해나가겠지만, 사실 원본 JavaScript 코드는 이미 제대로 잘 작동하고 있는 상태였습니다!
TypeScript로 변환하는 작업 때문에 코드 실행이 중단되어야 할 이유가 있을까요?

그래서 TypeScript는 당신을 방해하지 않습니다.
물론, 시간이 흐름에 따라 좀 더 실수에 방어적으로 대응하고, TypeScript가 보다 엄격하게 동작하기를 원할 수도 있습니다.
이 경우 `--noEmitOnError` 컴파일러 옵션을 사용하면 됩니다.
`hello.ts` 파일을 수정한 뒤 위 플래그 옵션을 사용하여 `tsc`를 실행해보세요.

```sh
tsc --noEmitOnError hello.ts
```

`hello.js`가 하나도 수정되지 않는다는 것을 확인할 수 있습니다.

## 명시적 타입

지금까지는 아직 TypeScript에게 `person` 또는 `date`가 무엇인지 알려주지 않았습니다.
코드를 수정하여 TypeScript가 `person`이 `string`이고 `date`가 `Date` 객체이어야 한다는 것을 알려주도록 하죠.
또한 `date`의 `toDateString()` 메서드를 사용하겠습니다.

```ts twoslash
function greet(person: string, date: Date) {
  console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}
```

방금 우리는 `person`과 `date`에 대하여 *타입 표기*를 수행하여 `greet`가 호출될 때 함께 사용될 수 있는 값들의 타입을 설명했습니다.
해당 시그니처는 "`greet`는 `string` 타입의 `person`과 `Date` 타입의 `date`을 가진다"고 해석할 수 있습니다.

이것이 있다면, TypeScript는 우리가 해당 함수를 올바르지 못하게 사용했을 경우 이를 알려줄 수 있게 됩니다.
예를 들어...

```ts twoslash
// @errors: 2345
function greet(person: string, date: Date) {
  console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}

greet("Maddison", Date());
```

어?
TypeScript가 두번째 인자에 대하여 오류를 보고했는데요, 왜 그랬을까요?

아마도 놀랍게도, JavaScript에서 `Date()`를 호출하면 `string`을 반환합니다.
반면, `new Date()`를 사용하여 `Date` 타입을 생성해야 비로소 처음 기대했던 결과를 반환받을 수 있게 됩니다.

어쨌든, 이 오류는 아주 빠르게 고칠 수 있습니다.

```ts twoslash {4}
function greet(person: string, date: Date) {
  console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}

greet("Maddison", new Date());
```

명시적인 타입 표기를 항상 작성할 필요는 없다는 것을 꼭 기억해두세요.
많은 경우, TypeScript는 생략된 타입 정보를 *추론할 수* (또는 "알아낼 수") 있습니다.

```ts twoslash
let msg = "hello there!";
//  ^?
```

`msg`가 `string` 타입을 가진다는 사실을 TypeScript에게 알려주지 않았더라도 TypeScript는 이를 알아낼 수 있습니다.
이는 기본 기능이며, 타입 시스템이 알아서 올바른 타입을 어떻게든 잘 알아낼 수 있다면 타입 표기를 굳이 적지 않는 것이 가장 좋습니다.

> 참고: 바로 위 코드의 말풍선은 에디터에서 해당 코드를 작성했을 때, 해당 변수에 마우스 호버시 화면에 나타나는 내용입니다.

## 지워진 타입

앞서 작성한 함수 `greet`을 `tsc`로 컴파일하여 JavaScript 출력을 얻었을 때 어떤 일이 일어나는지 보도록 하겠습니다.

```ts twoslash
// @showEmit
// @target: es5
function greet(person: string, date: Date) {
  console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}

greet("Maddison", new Date());
```

여기서 두 가지를 알 수 있습니다.

1. `person`과 `date` 인자는 더 이상 타입 표기를 가지지 않습니다.
2. "템플릿 문자열" - 백틱(`` ` `` 문자)을 사용하여 작성된 문장 - 은 연결 연산자(`+`)로 이루어진 일반 문자열로 변환되었습니다.

두번째 항목에 대하여서는 이후 자세히 다루도록 하고 우선 첫번째 항목에 초점을 두도록 하겠습니다.
타입 표기는 JavaScript(또는 엄밀히 말하여 ECMAScript)의 일부가 아니므로, TypeScript를 수정 없이 그대로 실행할 수 있는 브라우저나 런타임은 현재 존재하지 않습니다.
이것이 TypeScript를 사용하고자 할 때 다른 무엇보다도 컴파일러가 필요한 이유입니다. TypeScript 전용 코드를 제거하거나 변환하여 실행할 수 있도록 만들 방법이 필요합니다.
대부분의 TypeScript 전용 코드는 제거되며, 마찬가지로 타입 표기 또한 완전히 지워집니다.

> **기억하세요**: 타입 표기는 프로그램의 런타임 동작을 전혀 수정하지 않습니다.

## 다운레벨링

앞서 언급된 또 다른 차이점은, 바로 템플릿 문자열이 아래의 내용에서,

```js
`Hello ${person}, today is ${date.toDateString()}!`;
```

아래의 내용으로 다시 작성되었다는 점입니다.

```js
"Hello " + person + ", today is " + date.toDateString() + "!";
```

왜 이러한 일이 생겼을까요?

템플릿 문자열은 ECMAScript 2015(a.k.a. ECMAScript 6, ES2015, ES6, 등. *더 묻지 마세요*)라고 불리는 버전의 ECMAScript에서 등장한 기능입니다.
TypeScript는 새 버전의 ECMAScript의 코드를 ECMAScript 3 또는 ECMAScript 5와 같은 보다 예전 버전의 것들로 다시 작성해 줍니다.
새로운 또는 "상위" 버전의 ECMAScript를 예전의 또는 "하위" 버전의 것으로 바꾸는 과정을 *다운레벨링*이라 부르기도 합니다.

TypeScript는 ES3라는 아주 구버전의 ECMAScript를 타겟으로 동작하는 것이 기본 동작입니다.
`--target` 플래그를 설정하면 보다 최근 버전을 타겟으로 변환을 수행할 수도 있습니다.
`--target es2015`를 실행하면 TypeScript가 ECMAScript 2015를 타겟으로 동작할 수 있으며, 이는 ECMAScript 2015가 지원되는 런타임이기만 하면 해당 코드가 실행될 수 있도록 변환된다는 의미입니다.
따라서 `tsc --target es2015 input.ts`를 실행하면 아래와 같은 출력을 얻게 됩니다.

```js
function greet(person, date) {
  console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}
greet("Maddison", new Date());
```

> 타겟 버전의 기본값은 ES3이지만, 현존하는 대다수의 브라우저들은 ES2015를 지원하고 있습니다.
> 따라서 특정 구버전 브라우저에 대한 호환성 유지가 주요 이슈가 아니라면, 대부분의 경우 안심하고 ES2015 또는 그 이상을 컴파일러 타겟으로 지정할 수 있습니다.

## 엄격도

TypeScript의 타입 검사기를 사용하는 목적은 사용자마다 다양합니다.
누군가는 프로그램 일부만 타입 검사를 수행하는 느슨한 수준을 유지하면서도, 유용한 프로그래밍 도구로서의 기능은 온전히 활용하고 싶을 수 있습니다.
이는 TypeScript를 사용할 때 기본으로 제공하고자 하는 경험입니다. 타입 검사는 선택 사항이며, 타입 추론은 가장 관대한 기준으로 이루어지고, 잠재적인 `null`/`undefined` 값에 대한 검사는 이루어지지 않습니다.
이러한 기본 경험은 개발 경험을 방해하지 않는 방향으로 이루어집니다. 앞서 언급하였던, 오류 발생 시 `tsc`가 오류를 처리하는 방식과 유사합니다.
기존의 JavaScript에서 마이그레이션을 하는 입장이라면, 이는 첫발을 디디기 위한 적당한 수준이라고 볼 수 있습니다.

이와 반대로, 대다수의 사용자들은 TypeScript가 최대한으로 타입 검사를 수행해주기를 선호합니다. 이것이 TypeScript에서 엄격도 설정을 제공하는 이유이기도 합니다.
이러한 엄격도 설정을 활용하면 정적 타입 검사기를 마치 (코드 검사가 이루어졌는지 여부만을 단순히 따지는) 스위치 수준의 장치에서 마치 다이얼에 가까운 장치로 만들 수 있습니다.
다이얼을 더 멀리 돌릴수록, TypeScript는 더 많은 것을 검사해줄 겁니다.
그러면 할 일이 조금 더 생기겠지만, 길게 봤을 때 분명 그만한 가치가 있으며, 보다 철저한 검사와 정밀한 도구 기능을 사용할 수 있게 됩니다.
가능하다면, 새로 작성하는 코드에서는 항상 엄격도를 활성화해야 합니다.

TypeScript에는 켜고 끌 수 있는 타입 검사 엄격도 플래그가 몇 가지 존재하며, 앞으로 사용되는 모든 예시 코드는 별도 설명이 없다면 모든 플래그를 활성화한 상태로 작성됩니다.
CLI에서 `--strict` 플래그를 설정하거나 [`tsconfig.json`](https://www.typescriptlang.org/ko/docs/handbook/tsconfig-json.html)에 `"strict": true`를 추가하면 모든 플래그를 동시에 활성화하게 되지만, 각각의 플래그를 개별적으로 끌 수도 있습니다.
반드시 알아야 하는 두 가지 가장 주요한 옵션은 `noImplicitAny`와 `strictNullChecks`입니다.

### `noImplicitAny`

몇몇 경우에서 TypeScript는 값의 타입을 추론하지 않고 가장 관대한 타입인 `any`로 간주한다는 사실을 기억하시기 바랍니다.
이는 최악의 경우는 아닙니다. 어쨌든, 타입을 `any`로 간주하는 것은 일반적인 JavaScript에서는 당연한 일이기도 합니다.

하지만, `any`를 사용하면 애초에 TypeScript를 사용하는 이유가 무색해지는 경우가 많습니다.
프로그램에서 타입을 더 구체적으로 사용할수록, 더 많은 유효성 검사와 도구 기능을 사용할 수 있으며, 이는 곧 코드 상에서 보다 적은 버그를 만나게 된다는 의미입니다.
`noImplicitAny` 플래그를 활성화하면 타입이 `any`로 암묵적으로 추론되는 변수에 대하여 오류를 발생시킵니다.

### `strictNullChecks`

`null`과 `undefined`와 같은 값은 다른 타입의 값에 할당할 수 있는 것이 기본 동작입니다.
이는 코드 작성을 쉽게 만들어주지만, `null`과 `undefined`의 처리를 잊는 것은 세상의 셀 수 없이 많은 버그들의 원인입니다. 혹자는 이를 [백만 불 짜리 실수](https://www.youtube.com/watch?v=ybrQvs4x0Ps)라고 일컫기도 합니다!
`strictNullChecks` 플래그는 `null`과 `undefined`를 보다 명시적으로 처리하며, `null` 및 `undefined` 처리를 *잊었는지* 여부를 걱정하는 데에서 우리를 *해방시켜* 줍니다.
