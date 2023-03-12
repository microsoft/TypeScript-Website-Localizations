---
title: Template Literal Types
layout: docs
permalink: /ko/docs/handbook/2/template-literal-types.html
oneline: "템플릿 리터럴으로 속성을 변경하는 매핑 유형 생성하기"
---

템플릿 리터럴 타입은 [문자열 리터럴 타입](/docs/handbook/2/everyday-types.html#리터럴-타입)을 기반으로 하며, 유니언을 통해 많은 문자열로 확장할 수 있습니다.

템플릿 리터럴 타입은 [JavaScript의 템플릿 리터럴 문자열](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Template_literals)과 동일한 구문을 가지지만, 값이 아닌 타입으로 사용됩니다.
구체적인 리터럴 타입과 함께 사용될 때, 템플릿 리터럴은 내용을 연결하여 새로운 문자열 리터럴 타입을 생성합니다.

```ts twoslash
type World = "world";

type Greeting = `hello ${World}`;
//   ^?
```

기입한 위치에 유니언이 사용될 때, 그 타입은 해당 유니언의 멤버로 나타낼 수 있는 모든 리터럴의 집합입니다.

```ts twoslash
type EmailLocaleIDs = "welcome_email" | "email_heading";
type FooterLocaleIDs = "footer_title" | "footer_sendoff";

type AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}_id`;
//   ^?
```

템플릿 리터럴을 기입한 각 위치마다 유니언이 교차하여 새로운 타입이 생성됩니다.

```ts twoslash
type EmailLocaleIDs = "welcome_email" | "email_heading";
type FooterLocaleIDs = "footer_title" | "footer_sendoff";
// ---cut---
type AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}_id`;
type Lang = "en" | "ja" | "pt";

type LocaleMessageIDs = `${Lang}_${AllLocaleIDs}`;
//   ^?
```

일반적으로 복잡한 문자열 유니언에 대해서는 사전 생성을 권장하지만, 이렇게 간단한 경우에서는 유용합니다.

### 타입에서 문자열 유니언

템플릿 리터럴의 강점은 타입 내부의 정보에 근거한 새로운 문자열을 정의할 때 나타납니다.

함수 (`makeWatchedObject`)가 passedObject에 새 함수인 `on()`을 추가하는 경우를 생각해봅시다. JavaScript에서는 `makeWatchedObject(baseObject)`와 같이 호출됩니다. 우리는 기본 객체를 다음과 같이 생각해볼 수 있습니다.

```ts twoslash
// @noErrors
const passedObject = {
  firstName: "Saoirse",
  lastName: "Ronan",
  age: 26,
};
```

기본 객체에는 `on` 함수가 추가되며, 이 함수는 두 인자로 `eventName` (`string`) 과 `callBack` (`function`)가 예상됩니다.

`eventName`은 `attributeInThePassedObject + "Changed"`타입이어야 합니다. 따라서 기본 객체의 속성인 `firstName`에서 파생된 `firstNameChanged`입니다.

호출될 때 `callBack`함수는 다음과 같습니다.

* `attributeInThePassedObject`와 연결된 유형의 값이 전달되어야 합니다. 따라서 `firstName`이 `string`타입일 경우 `firstNameChanged`의 콜백은 호출 시 `string`이 전달되어야 합니다. `age`와 연관된 이벤트도 마찬가지입니다.
* `void`리턴 타입이 있어야 합니다.(설명의 간결함을 위해)

`on()`의 초기 함수 시그니처는 다음과 같습니다. `on(eventName: string, callBack: (newValue: any) => void)`
The naive function signature of `on()` might thus be: `on(eventName: string, callBack: (newValue: any) => void)`. 그러나, 앞의 설명에서 우리는 코드에 기록하고자 하는 중요한 타입 제약을 확인했습니다. 템플릿 리터럴 타입을 사용하려면 이러한 제약 조건을 코드에 적용할 수 있습니다.

```ts twoslash
// @noErrors
declare function makeWatchedObject(obj: any): any;
// ---cut---
const person = makeWatchedObject({
  firstName: "Saoirse",
  lastName: "Ronan",
  age: 26,
});

// makeWatchedObject가 익명 객체에 `on`을 추가했습니다.

person.on("firstNameChanged", (newValue) => {
  console.log(`firstName was changed to ${newValue}!`);
});
```

`on`은 `"firstNameChanged"`이벤트를 듣지만, `"firstName"`이 아닌 `"firstNameChanged"`이벤트를 듣습니다. 우리의 초기 `on()` 사양은 더 견고하게 만들 수 있습니다. 이 경우, `on()`의 대상 속성 이름의 유니언에 "Changed"가 끝에 추가된 유효한 이벤트 이름의 유니언으로 제한됩니다. 우리는 JavaScript에서 이러한 계산을 수행하는 데 익숙합니다. 예컨대, ``Object.keys(passedObject).map(x => `${x}Changed`)``와 같은 방식으로 수행할 수 있습니다. 타입 시스템 내부의 템플릿 리터럴은 문자열 조작에 대한 유사한 접근 방식을 제공합니다.

```ts twoslash
type PropEventSource<Type> = {
    on(eventName: `${string & keyof Type}Changed`, callback: (newValue: any) => void): void;
};

/// 'on'메서드가 있는 "watched object"를 생성합니다. 
/// 그러면, 속성의 변경 내용을 확인할 수 있습니다.
declare function makeWatchedObject<Type>(obj: Type): Type & PropEventSource<Type>;
```

이를 통해, 우리는 잘못된 속성이 제공될 때 오류가 발생하는 기능을 구현할 수 있습니다.

```ts twoslash
// @errors: 2345
type PropEventSource<Type> = {
    on(eventName: `${string & keyof Type}Changed`, callback: (newValue: any) => void): void;
};

declare function makeWatchedObject<T>(obj: T): T & PropEventSource<T>;
// ---cut---
const person = makeWatchedObject({
  firstName: "Saoirse",
  lastName: "Ronan",
  age: 26
});

person.on("firstNameChanged", () => {});

// Prevent easy human error (using the key instead of the event name)
person.on("firstName", () => {});

// It's typo-resistant
person.on("frstNameChanged", () => {});
```

### 템플릿 리터럴로 추론하기

원래 전달된 객체의 정보를 모두 고려하지 않았음에 유의하세요. `firstName`의 변경(i.e. `firstNameChanged` 이벤트)가 일어난 경우, 우리는 콜백이 `string`타입의 인자를 받을 것으로 예상해야  합니다. 마찬가지로 `age` 변경의 콜백은 `number` 인자를 받을 것으로 예상해야합니다. 우리는 `callBack`의 인수에 `any`를 사용하여 단순하게 처리하고 있습니다. 여기서 템플릿 리터럴 타입을 사용하면 속성의 데이터 유형이 해당 속성의 콜백 첫 번째 인수와 동일한 유형이 되도록 보장할 수 있습니다.

이를 가능하게 하는 핵심은 이렇습니다. 우리는 제네릭을 사용하는 함수를 사용할 수 있습니다.

1. 첫 번째 인자에서 사용되는 리터럴이 리터럴 유형으로 캡처됩니다.

2. 해당 리터럴 타입은 제네릭의 유효한 속성 유니언에 해당하는지 확인하여 유효성을 검증할 수 있습니다.

3. 확인된 속성의 타입은 인덱스 액세스를 사용하여 제네릭 구조체에서 찾을 수 있습니다.

4. 이 타입 정보를 적용하여 콜백 함수의 인자 타입이 동일한 타입임을 보장할 수 있습니다.

```ts twoslash
type PropEventSource<Type> = {
    on<Key extends string & keyof Type>
        (eventName: `${Key}Changed`, callback: (newValue: Type[Key]) => void ): void;
};

declare function makeWatchedObject<Type>(obj: Type): Type & PropEventSource<Type>;

const person = makeWatchedObject({
  firstName: "Saoirse",
  lastName: "Ronan",
  age: 26
});

person.on("firstNameChanged", newName => {
    //                        ^?
    console.log(`new name is ${newName.toUpperCase()}`);
});

person.on("ageChanged", newAge => {
    //                  ^?
    if (newAge < 0) {
        console.warn("warning! negative age");
    }
})
```

여기서는 `on`을 제너릭 메서드로 만들었습니다.

사용자가 문자열 `"firstNameChanged"`로 호출할 때, TypeScript는 `Key`에 적합한 타입을 추론하려고 할 것입니다.
이를 위해, `Key`를 `"Changed"` 이전의 내용과 일치시켜 문자열`"firstName"`을 추론합니다.
TypeScript가 이를 알아내면 `on`메서드는 원래 객체에서 `firstName`의 유형을 가져올 수 있으며, 이 경우 `string`입니다.
`"ageChanged"`로 호출될 때도 마찬가지로 TypeScript는 `age`프로퍼티를 위한 `number`타입을 찾습니다.

추론은 종종 문자열을 분해하고 다른 방식으로 다시 구성하는 방식으로 결합합니다.

## 내장 문자열 조작 유형

문자열 조작을 돕기 위해 TypeScript에서는 문자열 조작에 사용될 수 있는 일련의 유형이 포함되어 있습니다. 이러한 유형은 성능을 위해 컴파일러에 내장되어 있으며, TypeScript와 함께 제공되는 `.d.ts`파일에서 찾을 수 없습니다.

### `Uppercase<StringType>`

문자열의 각 문자를 대문자로 변환합니다.

#### 예제

```ts twoslash
type Greeting = "Hello, world"
type ShoutyGreeting = Uppercase<Greeting>
//   ^?

type ASCIICacheKey<Str extends string> = `ID-${Uppercase<Str>}`
type MainID = ASCIICacheKey<"my_app">
//   ^?
```

### `Lowercase<StringType>`

문자열의 각 문자를 소문자로 변환합니다.

#### 예제

```ts twoslash
type Greeting = "Hello, world"
type QuietGreeting = Lowercase<Greeting>
//   ^?

type ASCIICacheKey<Str extends string> = `id-${Lowercase<Str>}`
type MainID = ASCIICacheKey<"MY_APP">
//   ^?
```

### `Capitalize<StringType>`

문자열의 첫 번째 문자를 대문자로 변환합니다.

#### 예제

```ts twoslash
type LowercaseGreeting = "hello, world";
type Greeting = Capitalize<LowercaseGreeting>;
//   ^?
```

### `Uncapitalize<StringType>`

문자열의 첫 번째 문자를 소문자로 변환합니다.

#### 예제

```ts twoslash
type UppercaseGreeting = "HELLO WORLD";
type UncomfortableGreeting = Uncapitalize<UppercaseGreeting>;
//   ^?
```

<details>
<summary>
    내장 문자열 조작 타입에 대한 기술적 세부 정보
    </summary>
    <p>
    이러한 내장 함수의 코드는 TypeScript 4.1을 기준으로 JavaScript 문자열 런타임 함수를 직접 사용하며 조작하여 로케일을 인식하지 않습니다.
    </p>
    <code><pre>
function applyStringMapping(symbol: Symbol, str: string) {
    switch (intrinsicTypeKinds.get(symbol.escapedName as string)) {
        case IntrinsicTypeKind.Uppercase: return str.toUpperCase();
        case IntrinsicTypeKind.Lowercase: return str.toLowerCase();
        case IntrinsicTypeKind.Capitalize: return str.charAt(0).toUpperCase() + str.slice(1);
        case IntrinsicTypeKind.Uncapitalize: return str.charAt(0).toLowerCase() + str.slice(1);
    }
    return str;
}</pre></code>
</details>
