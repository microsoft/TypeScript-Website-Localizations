---
title: TypeScript 4.9
layout: docs
permalink: /ko/docs/handbook/release-notes/typescript-4-9.html
oneline: TypeScript 4.9 릴리즈 노트
---

## `satisfies` 연산자

TypeScript 개발자들은 종종 딜레마에 직면합니다. 우리는 일부 표현식이 타입과 *일치*하는지 확인하고 싶지만, 추론을 위해 표현식의 *가장 구체적인 타입*을 유지하고 싶을 때가 있습니다.

예를 들어

```ts
// 각 속성은 문자열 또는 RGB 튜플일 수 있습니다.
const palette = {
    red: [255, 0, 0],
    green: "#00ff00",
    bleu: [0, 0, 255]
//  ^^^^ sacrebleu - 오타를 냈습니다!
};

// 우리는 배열 메서드를 'red'에 사용하고 싶습니다...
const redComponent = palette.red.at(0);

// 혹은 'green'에 문자열 메서드를 사용하고 싶을 수 있습니다...
const greenNormalized = palette.green.toUpperCase();
```

우리는 `bleu` 대신, `blue`를 썼어야 했습니다.
`palette`에 타입을 표기해서 `bleu` 오타를 잡을 수도 있지만, 그렇게 되면 각 속성에 대한 정보를 잃게 됩니다.

```ts
type Colors = "red" | "green" | "blue";

type RGB = [red: number, green: number, blue: number];

const palette: Record<Colors, string | RGB> = {
    red: [255, 0, 0],
    green: "#00ff00",
    bleu: [0, 0, 255]
//  ~~~~ 이제 오타를 올바르게 감지했습니다.
};

// 하지만 여기서 원치 않는 문제가 발생했습니다. 'palette.red'가 문자열이 "될 수 있다"는것 입니다.
const redComponent = palette.red.at(0);
```

`satisfies` 연산자를 사용하면 표현식의 결과 타입을 변경하지 않고 표현식의 타입이 특정 타입과 일치하는지 검증할 수 있습니다.
예를 들어, 우리는 `satisfies`를 사용하여 `palette`의 모든 속성이 `string | number[]`와 호환되는지 검증할 수 있습니다.

```ts
type Colors = "red" | "green" | "blue";

type RGB = [red: number, green: number, blue: number];

const palette = {
    red: [255, 0, 0],
    green: "#00ff00",
    bleu: [0, 0, 255]
//  ~~~~ 오타가 잡혔습니다!
} satisfies Record<Colors, string | RGB>;

// 두 메서드 모두 여전히 접근할 수 있습니다!
const redComponent = palette.red.at(0);
const greenNormalized = palette.green.toUpperCase();
```

`satisfies`는 많은 오류를 탐지하는데 사용할 수 있습니다.
예를 들면, 객체가 특정 타입의 *모든* 키를 가지지만, 그 이상은 가지지 않도록 할 수 있습니다.

```ts
type Colors = "red" | "green" | "blue";

// 'Colors' 키가 정확한지 확인합니다.
const favoriteColors = {
    "red": "yes",
    "green": false,
    "blue": "kinda",
    "platypus": false
//  ~~~~~~~~~~ 에러 - "platypus"는 'Colors' 리스트에 없습니다.
} satisfies Record<Colors, unknown>;

// 'red', 'green' 및 'blue' 속성의 모든 정보가 유지됩니다.
const g: boolean = favoriteColors.green;
```

이따금 우리는 속성 이름 일치 여부보다 각 속성의 타입에 관심이 있을 수 있습니다.
이 경우 개체의 모든 속성 값이 일부 타입을 준수하는지 확인할 수도 있습니다.

```ts
type RGB = [red: number, green: number, blue: number];

const palette = {
    red: [255, 0, 0],
    green: "#00ff00",
    blue: [0, 0]
    //    ~~~~~~ 에러!
} satisfies Record<string, string | RGB>;

// 각 속성에 대한 정보는 계속 유지됩니다.
const redComponent = palette.red.at(0);
const greenNormalized = palette.green.toUpperCase();
```

더 많은 예시를 보고 싶다면, [제안한 이슈](https://github.com/microsoft/TypeScript/issues/47920) 와 [이를 구현한 pull request](https://github.com/microsoft/TypeScript/pull/46827)를 확인하세요.
우리와 함께 이 기능을 구현한 [Oleksandr Tarasiuk](https://github.com/a-tarasyuk)에게 감사드립니다.

## Unlisted Property Narrowing with the `in` Operator

As developers, we often need to deal with values that aren't fully known at runtime.
In fact, we often don't know if properties exist, whether we're getting a response from a server or reading a configuration file.
JavaScript's `in` operator can check whether a property 
exists on an object.

Previously, TypeScript allowed us to narrow away any types that don't explicitly list a property.

```ts
interface RGB {
    red: number;
    green: number;
    blue: number;
}

interface HSV {
    hue: number;
    saturation: number;
    value: number;
}

function setColor(color: RGB | HSV) {
    if ("hue" in color) {
        // 'color' now has the type HSV
    }
    // ...
}
```

Here, the type `RGB` didn't list the `hue` and got narrowed away, and leaving us with the type `HSV`.

But what about examples where no type listed a given property?
In those cases, the language didn't help us much.
Let's take the following example in JavaScript:

```js
function tryGetPackageName(context) {
    const packageJSON = context.packageJSON;
    // Check to see if we have an object.
    if (packageJSON && typeof packageJSON === "object") {
        // Check to see if it has a string name property.
        if ("name" in packageJSON && typeof packageJSON.name === "string") {
            return packageJSON.name;
        }
    }

    return undefined;
}
```

Rewriting this to canonical TypeScript would just be a matter of defining and using a type for `context`;
however, picking a safe type like `unknown` for the `packageJSON` property would cause issues in older versions of TypeScript.

```ts
interface Context {
    packageJSON: unknown;
}

function tryGetPackageName(context: Context) {
    const packageJSON = context.packageJSON;
    // Check to see if we have an object.
    if (packageJSON && typeof packageJSON === "object") {
        // Check to see if it has a string name property.
        if ("name" in packageJSON && typeof packageJSON.name === "string") {
        //                                              ~~~~
        // error! Property 'name' does not exist on type 'object.
            return packageJSON.name;
        //                     ~~~~
        // error! Property 'name' does not exist on type 'object.
        }
    }

    return undefined;
}
```

This is because while the type of `packageJSON` was narrowed from `unknown` to `object`, the `in` operator strictly narrowed to types that actually defined the property being checked.
As a result, the type of `packageJSON` remained `object`.

TypeScript 4.9 makes the `in` operator a little bit more powerful when narrowing types that *don't* list the property at all.
Instead of leaving them as-is, the language will intersect their types with `Record<"property-key-being-checked", unknown>`.

So in our example, `packageJSON` will have its type narrowed from `unknown` to `object` to `object & Record<"name", unknown>`
That allows us to access `packageJSON.name` directly and narrow that independently.

```ts
interface Context {
    packageJSON: unknown;
}

function tryGetPackageName(context: Context): string | undefined {
    const packageJSON = context.packageJSON;
    // Check to see if we have an object.
    if (packageJSON && typeof packageJSON === "object") {
        // Check to see if it has a string name property.
        if ("name" in packageJSON && typeof packageJSON.name === "string") {
            // Just works!
            return packageJSON.name;
        }
    }

    return undefined;
}
```

TypeScript 4.9 also tightens up a few checks around how `in` is used, ensuring that the left side is assignable to the type `string | number | symbol`, and the right side is assignable to `object`.
This helps check that we're using valid property keys, and not accidentally checking primitives.

For more information, [read the implementing pull request](https://github.com/microsoft/TypeScript/pull/50666)

## <a name="auto-accessors-in-classes"> Auto-Accessors in Classes

TypeScript 4.9 supports an upcoming feature in ECMAScript called auto-accessors.
Auto-accessors are declared just like properties on classes, except that they're declared with the `accessor` keyword.

```ts
class Person {
    accessor name: string;

    constructor(name: string) {
        this.name = name;
    }
}
```

Under the covers, these auto-accessors "de-sugar" to a `get` and `set` accessor with an unreachable private property.

```ts
class Person {
    #__name: string;

    get name() {
        return this.#__name;
    }
    set name(value: string) {
        this.#__name = name;
    }

    constructor(name: string) {
        this.name = name;
    }
}
```

You can [read up more about the auto-accessors pull request on the original PR](https://github.com/microsoft/TypeScript/pull/49705).

## Checks For Equality on `NaN`

A major gotcha for JavaScript developers is checking against the value `NaN` using the built-in equality operators.

For some background, `NaN` is a special numeric value that stands for "Not a Number".
Nothing is ever equal to `NaN` - even `NaN`!

```js
console.log(NaN == 0)  // false
console.log(NaN === 0) // false

console.log(NaN == NaN)  // false
console.log(NaN === NaN) // false
```

But at least symmetrically *everything* is always not-equal to `NaN`.

```js
console.log(NaN != 0)  // true
console.log(NaN !== 0) // true

console.log(NaN != NaN)  // true
console.log(NaN !== NaN) // true
```

This technically isn't a JavaScript-specific problem, since any language that contains IEEE-754 floats has the same behavior;
but JavaScript's primary numeric type is a floating point number, and number parsing in JavaScript can often result in `NaN`.
In turn, checking against `NaN` ends up being fairly common, and the correct way to do so is to use [`Number.isNaN`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN) - *but* as we mentioned, lots of people accidentally end up checking with `someValue === NaN` instead.

TypeScript now errors on direct comparisons against `NaN`, and will suggest using some variation of `Number.isNaN` instead.

```ts
function validate(someValue: number) {
    return someValue !== NaN;
    //     ~~~~~~~~~~~~~~~~~
    // error: This condition will always return 'true'.
    //        Did you mean '!Number.isNaN(someValue)'?
}
```

We believe that this change should strictly help catch beginner errors, similar to how TypeScript currently issues errors on comparisons against object and array literals.

We'd like to extend our thanks to [Oleksandr Tarasiuk](https://github.com/a-tarasyuk) who [contributed this check](https://github.com/microsoft/TypeScript/pull/50626).

## 파일 시스템 이벤트를 사용한 파일 감시

이전 버전에서 TypeScript는 개별 파일을 감시하기 위해 *폴링*에 크게 의존했습니다.
폴링 전략을 사용하는 것은 업데이트를 위해 주기적으로 파일 상태를 감시함을 의미합니다.
Node.js에서 [`fs.watchFile`](https://nodejs.org/docs/latest-v18.x/api/fs.html#fswatchfilefilename-options-listener)은 폴링 파일 감시자를 가져오는 기본 제공 방법입니다.
폴링은 플랫폼과 파일 시스템에서 보다 예측 가능한 경향이 있지만 CPU가 주기적으로 중단되어 변경된 사항이 없을 때에도 파일 업데이트를 확인해야 합니다.
파일이 수십 개라면 큰 차이가 없을 수 있습니다.
하지만 파일이 많고 더 큰 프로젝트에서 또는 `node_modules`에 많은 파일이 있는 경우, 폴링은 자원을 많이 차지할 수 있습니다.

일반적으로 더 좋은 접근 방식은 파일 시스템 이벤트를 사용하는 것입니다.
폴링하는 대신 특정 파일의 업데이트에 관심이 있음을 알리고 해당 파일이 *실제로* 변경될 때 콜백을 제공할 수 있습니다.
대부분의 최신 플랫폼은 `CreateIoCompletionPort`, `kqueue`, `epoll` 및 `inotify`와 같은 기능과 API를 제공합니다.
Node.js는 대부분 [`fs.watch`](https://nodejs.org/docs/latest-v18.x/api/fs.html#fswatchfilename-options-listener)를 제공하여 이를 추상화합니다.
파일 시스템 이벤트는 일반적으로 잘 동작하지만 이를 사용하고 `fs.watch` API를 사용하는 데 [많은 주의 사항](https://nodejs.org/docs/latest-v18.x/api/fs.html#caveats)이 있습니다.
감시자는 [inode 감시](https://nodejs.org/docs/latest-v18.x/api/fs.html#inodes),[특정 파일 시스템에서 비가용성](https://nodejs.org/docs/latest-v18.x/api/fs.html#availability) (예를 들면 네트워크 파일 시스템), 재귀 파일 감시가 사용 가능한지 여부, 디렉터리 이름 변경이 이벤트를 트리거하는지 여부, 파일 감시자 고갈까지 고려해야 합니다!
특히 크로스 플랫폼을 찾고 있다면 쉽지 않습니다.

결과적으로 우리는 기본 값으로 폴링이라는 가장 낮은 공통분모를 선택하는 것이었습니다.
항상 그런 것은 아니지만 대부분의 경우에 해당했습니다.

시간이 지남에 따라 우리는 [다른 파일 감시 전략을 선택](https://www.typescriptlang.org/docs/handbook/configuring-watch.html)할 수 있는 수단을 제공했습니다.
이를 통해 피드백을 받고 대부분 플랫폼 문제들에 대해 파일 감시 구현을 강화할 수 있었습니다.
TypeScript가 더 큰 코드베이스로 확장되어야 하고 이 영역에서 개선되었으므로 파일 시스템 이벤트를 기본값으로 바꾸는 것이 가치 있는 투자라고 생각했습니다.

TypeScript 4.9에서 파일 감시는 기본적으로 파일 시스템 이벤트에 의해 구동되며 이벤트 기반 감시자를 설정하지 못한 경우에만 폴링으로 돌아갑니다.
대부분의 개발자에게 `--watch` 모드에서 실행하거나 Visual Studio 또는 VS Code와 같은 TypeScript 기반 편집기로 실행할 때 훨씬 덜 리소스 집약적인 환경을 제공해야 합니다.

[파일 감시가 작동하는 방식은 여전히 ​​환경 변수 및 `watchOptions`를 통해 구성](https://www.typescriptlang.org/docs/handbook/configuring-watch.html)할 수 있으며 [VS Code와 같은 일부 편집기는 `watchOptions`를 독립적으로 지원할 수 있습니다.](https://code.visualstudio.com/docs/getstarted/settings#:~:text=typescript%2etsserver%2ewatchOptions)
NFS 및 SMB와 같은 네트워크 파일 시스템에 소스 코드가 상주하는 좀 더 특이한 설정을 사용하는 개발자는 이전 동작을 다시 선택해야 할 수 있습니다. 하지만 서버에 적절한 처리 능력이 있는 경우 SSH를 활성화하고 TypeScript를 원격으로 실행하여 직접 로컬 파일에 액세스할 수 있도록 하는 것이 더 나을 수 있습니다.
VS Code에는 이 작업을 더 쉽게 수행할 수 있는 [원격 익스텐션](https://marketplace.visualstudio.com/search?term=remote&target=VSCode&category=All%20categories&sortBy=Relevance)이 많이 있습니다.

GitHub에서 [이 변경 사항에 대해 자세히](https://github.com/microsoft/TypeScript/pull/50366) 알아볼 수 있습니다.

## "Remove Unused Imports" and "Sort Imports" Commands for Editors

Previously, TypeScript only supported two editor commands to manage imports.
For our examples, take the following code:

```ts
import { Zebra, Moose, HoneyBadger } from "./zoo";
import { foo, bar } from "./helper";

let x: Moose | HoneyBadger = foo();
```

The first was called "Organize Imports" which would remove unused imports, and then sort the remaining ones.
It would rewrite that file to look like this one:

```ts
import { foo } from "./helper";
import { HoneyBadger, Moose } from "./zoo";

let x: Moose | HoneyBadger = foo();
```

In TypeScript 4.3, we introduced a command called "Sort Imports" which would *only* sort imports in the file, but not remove them - and would rewrite the file like this.

```ts
import { bar, foo } from "./helper";
import { HoneyBadger, Moose, Zebra } from "./zoo";

let x: Moose | HoneyBadger = foo();
```

The caveat with "Sort Imports" was that in Visual Studio Code, this feature was only available as an on-save command - not as a manually triggerable command.

TypeScript 4.9 adds the other half, and now provides "Remove Unused Imports".
TypeScript will now remove unused import names and statements, but will otherwise leave the relative ordering alone.

```ts
import { Moose, HoneyBadger } from "./zoo";
import { foo } from "./helper";

let x: Moose | HoneyBadger = foo();
```

This feature is available to all editors that wish to use either command;
but notably, Visual Studio Code (1.73 and later) will have support built in *and* will surface these commands via its Command Palette.
Users who prefer to use the more granular "Remove Unused Imports" or "Sort Imports" commands should be able to reassign the "Organize Imports" key combination to them if desired.

You can [view specifics of the feature here](https://github.com/microsoft/TypeScript/pull/50931).

## Go-to-Definition on `return` Keywords

In the editor, when running a go-to-definition on the `return` keyword, TypeScript will now jump you to the top of the corresponding function.
This can be helpful to get a quick sense of which function a `return` belongs to.

We expect TypeScript will expand this functionality to more keywords [such as `await` and `yield`](https://github.com/microsoft/TypeScript/issues/51223) or [`switch`, `case`, and `default`](https://github.com/microsoft/TypeScript/issues/51225).

[This feature was implemented](https://github.com/microsoft/TypeScript/pull/51227) thanks to [Oleksandr Tarasiuk](https://github.com/a-tarasyuk).

## 성능 개선

TypeScript에는 몇 가지 작지만 주목할 만한 성능 개선이 있습니다.

첫째, 모든 구문 노드에서 `switch` 문 대신 함수 테이블 조회를 사용하도록 TypeScript의 `forEachChild` 함수가 리팩터링되었습니다.
`forEachChild`는 컴파일러에서 구문 노드를 순회하기 위한 작업 도구이며 언어 서비스의 일부와 함께 컴파일러의 바인딩 단계에서 많이 사용됩니다.
`forEachChild` 리팩터링은 바인딩 단계와 언어 서비스 작업 전반에 소요되는 시간을 최대 20% 단축했습니다.

`forEachChild`에 대한 성능 향상을 확인한 후 컴파일러 및 언어 서비스에서 노드를 변환하는 데 사용하는 함수인 `visitEachChild`에서 리팩터링을 시도했습니다.
동일한 리팩터링으로 프로젝트 결과를 생성하는 데 소요되는 시간이 최대 3% 감소했습니다.

`forEachChild`의 초기 탐색은 [Artemis Everfree](https://artemis.sh/)의 [블로그 게시물에서 영감](https://artemis.sh/2022/08/07/emulating-calculators-fast-in-js.html)을 받았습니다.
속도 향상의 근본 원인이 블로그 게시물에 설명된 문제보다 기능 크기/복잡성과 더 관련이 있다고 믿을만한 이유가 있지만 경험을 통해 배우고 TypeScript를 더 빠르게 만든 상대적으로 빠른 리팩토링을 시험해 볼 수 있었던 것에 감사드립니다.

마지막으로 TypeScript가 조건부 유형의 실제 분기에서 타입에 대한 정보를 보존하는 방식이 최적화되었습니다.
다음과 같은 타입에서

```ts
interface Zoo<T extends Animal> {
    // ...
}

type MakeZoo<A> = A extends Animal ? Zoo<A> : never;
```

TypeScript는 `Zoo<A>`가 유효한지 확인할 때 `A`도 `Animal`이어야 한다는 것을 "기억"해야 합니다.
기본적으로 `A`와 `Animal`의 교차점을 유지하는 데 사용되는 특수 타입을 생성하여 수행됩니다.
그러나 TypeScript는 이전에 이 작업을 열심히 수행했으며 항상 필요한 것은 아닙니다.
또한 타입 검사기의 일부 잘못된 코드로 인해 이러한 특수 타입이 단순화되지 않았습니다.
TypeScript는 이제 필요할 때까지 이러한 타입의 교차를 연기합니다.
조건부 타입을 많이 사용하는 코드베이스의 경우 TypeScript를 사용하여 상당한 속도 향상을 목격할 수 있지만 성능 테스트 제품군에서는 유형 검사 시간이 3% 더 완만하게 감소했습니다.

각각의 풀 리퀘스트에서 더 자세히 알아볼 수 있습니다.

* [`forEachChild` 점프 테이블](https://github.com/microsoft/TypeScript/pull/50225)
* [`visitEachChild` 점프 테이블](https://github.com/microsoft/TypeScript/pull/50266)
* [대체 타입 최적화](https://github.com/microsoft/TypeScript/pull/50397)

## Correctness Fixes and Breaking Changes

### `lib.d.ts` Updates

While TypeScript strives to avoid major breaks, even small changes in the built-in libraries can cause issues.
We don't expect major breaks as a result of DOM and `lib.d.ts` updates, but there may be some small ones.

### Better Types for `Promise.resolve` 

`Promise.resolve` now uses the `Awaited` type to unwrap Promise-like types passed to it.
This means that it more often returns the right `Promise` type, but that improved type can break existing code if it was expecting `any` or `unknown` instead of a `Promise`.
For more information, [see the original change](https://github.com/microsoft/TypeScript/pull/33074).

### JavaScript Emit No Longer Elides Imports

When TypeScript first supported type-checking and compilation for JavaScript, it accidentally supported a feature called import elision.
In short, if an import is not used as a value, or the compiler can detect that the import doesn't refer to a value at runtime, the compiler will drop the import during emit.

This behavior was questionable, especially the detection of whether the import doesn't refer to a value, since it means that TypeScript has to trust sometimes-inaccurate declaration files.
In turn, TypeScript now preserves imports in JavaScript files.

```js
// Input:
import { someValue, SomeClass } from "some-module";

/** @type {SomeClass} */
let val = someValue;

// Previous Output:
import { someValue } from "some-module";

/** @type {SomeClass} */
let val = someValue;

// Current Output:
import { someValue, SomeClass } from "some-module";

/** @type {SomeClass} */
let val = someValue;
```

More information is available at [the implementing change](https://github.com/microsoft/TypeScript/pull/50404).

### `exports` is Prioritized Over `typesVersions`

Previously, TypeScript incorrectly prioritized the `typesVersions` field over the `exports` field when resolving through a `package.json` under `--moduleResolution node16`.
If this change impacts your library, you may need to add `types@` version selectors in your `package.json`'s `exports` field.

```diff
  {
      "type": "module",
      "main": "./dist/main.js"
      "typesVersions": {
          "<4.8": { ".": ["4.8-types/main.d.ts"] },
          "*": { ".": ["modern-types/main.d.ts"] }
      },
      "exports": {
          ".": {
+             "types@<4.8": "4.8-types/main.d.ts",
+             "types": "modern-types/main.d.ts",
              "import": "./dist/main.js"
          }
      }
  }
```

For more information, [see this pull request](https://github.com/microsoft/TypeScript/pull/50890).

## `substitute` Replaced With `constraint` on `SubstitutionType`s

As part of an optimization on substitution types, `SubstitutionType` objects no longer contain the `substitute` property representing the effective substitution (usually an intersection of the base type and the implicit constraint) - instead, they just contain the `constraint` property.

For more details, [read more on the original pull request](https://github.com/microsoft/TypeScript/pull/50397).