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

## File-Watching Now Uses File System Events

In earlier versions, TypeScript leaned heavily on *polling* for watching individual files.
Using a polling strategy meant checking the state of a file periodically for updates.
On Node.js, [`fs.watchFile`](https://nodejs.org/docs/latest-v18.x/api/fs.html#fswatchfilefilename-options-listener) is the built-in way to get a polling file-watcher.
While polling tends to be more predictable across platforms and file systems, it means that your CPU has to periodically get interrupted and check for updates to the file, even when nothing's changed.
For a few dozen files, this might not be noticeable;
but on a bigger project with lots of files - or lots of files in `node_modules` - this can become a resource hog.

Generally speaking, a better approach is to use file system events.
Instead of polling, we can announce that we're interested in updates of specific files and provide a callback for when those files *actually do* change.
Most modern platforms in use provide facilities and APIs like `CreateIoCompletionPort`, `kqueue`, `epoll`, and `inotify`.
Node.js mostly abstracts these away by providing [`fs.watch`](https://nodejs.org/docs/latest-v18.x/api/fs.html#fswatchfilename-options-listener).
File system events usually work great, but there are [lots of caveats](https://nodejs.org/docs/latest-v18.x/api/fs.html#caveats) to using them, and in turn, to using the `fs.watch` API.
A watcher needs to be careful to consider [inode watching](https://nodejs.org/docs/latest-v18.x/api/fs.html#inodes), [unavailability on certain file systems](https://nodejs.org/docs/latest-v18.x/api/fs.html#availability) (e.g.networked file systems), whether recursive file watching is available, whether directory renames trigger events, and even file watcher exhaustion!
In other words, it's not quite a free lunch, especially if you're looking for something cross-platform.

As a result, our default was to pick the lowest common denominator: polling.
Not always, but most of the time.

Over time, we've provided the means to [choose other file-watching strategies](https://www.typescriptlang.org/docs/handbook/configuring-watch.html).
This allowed us to get feedback and harden our file-watching implementation against most of these platform-specific gotchas.
As TypeScript has needed to scale to larger codebases, and has improved in this area, we felt swapping to file system events as the default would be a worthwhile investment.

In TypeScript 4.9, file watching is powered by file system events by default, only falling back to polling if we fail to set up event-based watchers.
For most developers, this should provide a much less resource-intensive experience when running in `--watch` mode, or running with a TypeScript-powered editor like Visual Studio or VS Code.

[The way file-watching works can still be configured](https://www.typescriptlang.org/docs/handbook/configuring-watch.html) through environment variables and `watchOptions` - and [some editors like VS Code can support `watchOptions` independently](https://code.visualstudio.com/docs/getstarted/settings#:~:text=typescript%2etsserver%2ewatchOptions).
Developers using more exotic set-ups where source code resides on a networked file systems (like NFS and SMB) may need to opt back into the older behavior; though if a server has reasonable processing power, it might just be better to enable SSH and run TypeScript remotely so that it has direct local file access.
VS Code has plenty of [remote extensions](https://marketplace.visualstudio.com/search?term=remote&target=VSCode&category=All%20categories&sortBy=Relevance) to make this easier.

You can [read up more on this change on GitHub](https://github.com/microsoft/TypeScript/pull/50366).

## "Remove Unused Imports" 와 "Sort Imports" 편집기 명령어

이전까지 Typescript 는 import 를 관리하기 위한 편집기 명령어로 두 가지만을 지원했습니다.
예시를 위해 다음 코드를 참고하세요.

```ts
import { Zebra, Moose, HoneyBadger } from "./zoo";
import { foo, bar } from "./helper";

let x: Moose | HoneyBadger = foo();
```

첫 번째는 사용되지 않는 import 를 제거하고 남은 import 를 정렬하는 "Organize Imports" 입니다.
이것은 파일을 다음과 같이 재작성합니다.

```ts
import { foo } from "./helper";
import { HoneyBadger, Moose } from "./zoo";

let x: Moose | HoneyBadger = foo();
```

Typescript 4.3 에서는, 파일 내 import를 *오직* 정렬만 하고 제거하지는 않는 "Sort Imports" 가 소개되었습니다. 이것은 파일을 다음과 같이 재작성합니다.

```ts
import { bar, foo } from "./helper";
import { HoneyBadger, Moose, Zebra } from "./zoo";

let x: Moose | HoneyBadger = foo();
```

"Sort Imports" 에 대한 주의 사항은, Visual Studio Code 에서 이 기능이 수동으로 트리거할 수 있는 명령이 아닌 on-save 명령으로만 사용할 수 있었다는 점입니다.

Typescript 4.9 는 나머지 절반을 추가하여 이제 "Remove Unused Improts" 기능을 제공합니다.
TypeScript는 이제 사용되지 않는 이름 import 및 구문 import를 제거하지만, 그 외 상대적인 순서는 그대로 유지합니다.

```ts
import { Moose, HoneyBadger } from "./zoo";
import { foo } from "./helper";

let x: Moose | HoneyBadger = foo();
```

이 기능은 두 명령어를 사용하고자 하는 모든 편집기에서 사용 가능합니다.
특히 Visual Studio Code (1.73 이상) 에선 이에 대한 빌트인 기능을 지원하며 *또한* Command Palette 를 통해 해당 명령어들을 확인할 수 있습니다.
더 세분화된 "Remove Unused Imports" 또는 "Sort Imports" 사용을 선호하는 사용자는 원하는 경우 "Organize Imports" 키 조합을 재할당할 수 있습니다.

[여기서 이 기능의 세부 사항](https://github.com/microsoft/TypeScript/pull/50931)을 볼 수 있습니다.

## `return` 키워드에 대한 Go-to-Definition

Typescript는 이제 편집기에서 return 키워드에 대한 go-to-definition 기능이 수행되면 해당 함수의 상단부로 이동할 수 있게 합니다.
이는 `return` 이 어떤 함수에 속하는지 빠르게 파악하는 데 도움이 됩니다.

Typescript 는 이 기능을 [`await`와 `yield`](https://github.com/microsoft/TypeScript/issues/51223) 또는 [`switch`, `case`, 그리고 `default`](https://github.com/microsoft/TypeScript/issues/51225) 같은 더 많은 키워드에도 확장할 것으로 기대합니다.

[Oleksandr Tarasiuk](https://github.com/a-tarasyuk) 덕분에 [이 기능이 구현되었습니다](https://github.com/microsoft/TypeScript/pull/51227).

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