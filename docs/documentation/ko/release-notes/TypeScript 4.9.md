---
title: TypeScript 4.9
layout: docs
permalink: /ko/docs/handbook/release-notes/typescript-4-9.html
oneline: TypeScript 4.9 릴리즈 노트
---

## The `satisfies` Operator

TypeScript developers are often faced with a dilemma: we want to ensure that some expression *matches* some type, but also want to keep the *most specific* type of that expression for inference purposes.

For example:

```ts
// Each property can be a string or an RGB tuple.
const palette = {
    red: [255, 0, 0],
    green: "#00ff00",
    bleu: [0, 0, 255]
//  ^^^^ sacrebleu - we've made a typo!
};

// We want to be able to use array methods on 'red'...
const redComponent = palette.red.at(0);

// or string methods on 'green'...
const greenNormalized = palette.green.toUpperCase();
```

Notice that we've written `bleu`, whereas we probably should have written `blue`.
We could try to catch that `bleu` typo by using a type annotation on `palette`, but we'd lose the information about each property.

```ts
type Colors = "red" | "green" | "blue";

type RGB = [red: number, green: number, blue: number];

const palette: Record<Colors, string | RGB> = {
    red: [255, 0, 0],
    green: "#00ff00",
    bleu: [0, 0, 255]
//  ~~~~ The typo is now correctly detected
};

// But we now have an undesirable error here - 'palette.red' "could" be a string.
const redComponent = palette.red.at(0);
```

The new `satisfies` operator lets us validate that the type of an expression matches some type, without changing the resulting type of that expression.
As an example, we could use `satisfies` to validate that all the properties of `palette` are compatible with `string | number[]`:

```ts
type Colors = "red" | "green" | "blue";

type RGB = [red: number, green: number, blue: number];

const palette = {
    red: [255, 0, 0],
    green: "#00ff00",
    bleu: [0, 0, 255]
//  ~~~~ The typo is now caught!
} satisfies Record<Colors, string | RGB>;

// Both of these methods are still accessible!
const redComponent = palette.red.at(0);
const greenNormalized = palette.green.toUpperCase();
```

`satisfies` can be used to catch lots of possible errors.
For example, we could ensure that an object has *all* the keys of some type, but no more:

```ts
type Colors = "red" | "green" | "blue";

// Ensure that we have exactly the keys from 'Colors'.
const favoriteColors = {
    "red": "yes",
    "green": false,
    "blue": "kinda",
    "platypus": false
//  ~~~~~~~~~~ error - "platypus" was never listed in 'Colors'.
} satisfies Record<Colors, unknown>;

// All the information about the 'red', 'green', and 'blue' properties are retained.
const g: boolean = favoriteColors.green;
```

Maybe we don't care about if the property names match up somehow, but we do care about the types of each property.
In that case, we can also ensure that all of an object's property values conform to some type.

```ts
type RGB = [red: number, green: number, blue: number];

const palette = {
    red: [255, 0, 0],
    green: "#00ff00",
    blue: [0, 0]
    //    ~~~~~~ error!
} satisfies Record<string, string | RGB>;

// Information about each property is still maintained.
const redComponent = palette.red.at(0);
const greenNormalized = palette.green.toUpperCase();
```

For more examples, you can see the [issue proposing this](https://github.com/microsoft/TypeScript/issues/47920) and [the implementing pull request](https://github.com/microsoft/TypeScript/pull/46827).
We'd like to thank [Oleksandr Tarasiuk](https://github.com/a-tarasyuk) who implemented and iterated on this feature with us.

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

## Performance Improvements

TypeScript has a few small, but notable, performance improvements.

First, TypeScript's `forEachChild` function has been rewritten to use a function table lookup instead of a `switch` statement across all syntax nodes.
`forEachChild` is a workhorse for traversing syntax nodes in the compiler, and is used heavily in the binding stage of our compiler, along with parts of the language service.
The refactoring of `forEachChild` yielded up to a 20% reduction of time spent in our binding phase and across language service operations.

Once we discovered this performance win for `forEachChild`, we tried it out on `visitEachChild`, a function we use for transforming nodes in the compiler and language service.
The same refactoring yielded up to a 3% reduction in time spent in generating project output.

The initial exploration in `forEachChild` was [inspired by a blog post](https://artemis.sh/2022/08/07/emulating-calculators-fast-in-js.html) by [Artemis Everfree](https://artemis.sh/).
While we have some reason to believe the root cause of our speed-up might have more to do with function size/complexity than the issues described in the blog post, we're grateful that we were able to learn from the experience and try out a relatively quick refactoring that made TypeScript faster.

Finally, the way TypeScript preserves the information about a type in the true branch of a conditional type has been optimized.
In a type like

```ts
interface Zoo<T extends Animal> {
    // ...
}

type MakeZoo<A> = A extends Animal ? Zoo<A> : never;
```

TypeScript has to "remember" that `A` must also be an `Animal` when checking if `Zoo<A>` is valid.
This is basically done by creating a special type that used to hold the intersection of `A` with `Animal`;
however, TypeScript previously did this eagerly which isn't always necessary.
Furthermore, some faulty code in our type-checker prevented these special types from being simplified.
TypeScript now defers intersecting these types until it's necessary.
For codebases with heavy use of conditional types, you might witness significant speed-ups with TypeScript, but in our performance testing suite, we saw a more modest 3% reduction in type-checking time.

You can read up more on these optimizations on their respective pull requests:

* [`forEachChild` as a jump-table](https://github.com/microsoft/TypeScript/pull/50225)
* [`visitEachChild` as a jump-table](https://github.com/microsoft/TypeScript/pull/50266)
* [Optimize substitition types](https://github.com/microsoft/TypeScript/pull/50397)

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