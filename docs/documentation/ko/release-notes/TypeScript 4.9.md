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
// 각 프로퍼티는 문자열 또는 RGB 튜플일 수 있습니다.
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
`palette`에 타입을 표기해서 `bleu` 오타를 잡을 수도 있지만, 그렇게 되면 각 프로퍼티에 대한 정보를 잃게 됩니다.

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
예를 들어, 우리는 `satisfies`를 사용하여 `palette`의 모든 프로퍼티가 `string | number[]`와 호환되는지 검증할 수 있습니다.

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

// 'red', 'green' 및 'blue' 프로퍼티의 모든 정보가 유지됩니다.
const g: boolean = favoriteColors.green;
```

이따금 우리는 프로퍼티 이름 일치 여부보다 각 프로퍼티의 타입에 관심이 있을 수 있습니다.
이 경우 개체의 모든 프로퍼티 값이 일부 타입을 준수하는지 확인할 수도 있습니다.

```ts
type RGB = [red: number, green: number, blue: number];

const palette = {
    red: [255, 0, 0],
    green: "#00ff00",
    blue: [0, 0]
    //    ~~~~~~ 에러!
} satisfies Record<string, string | RGB>;

// 각 프로퍼티에 대한 정보는 계속 유지됩니다.
const redComponent = palette.red.at(0);
const greenNormalized = palette.green.toUpperCase();
```

더 많은 예시를 보고 싶다면, [제안한 이슈](https://github.com/microsoft/TypeScript/issues/47920) 와 [이를 구현한 pull request](https://github.com/microsoft/TypeScript/pull/46827)를 확인하세요.
우리와 함께 이 기능을 구현한 [Oleksandr Tarasiuk](https://github.com/a-tarasyuk)에게 감사드립니다.

## "in" 연산자를 사용하여 정의되지 않은 프로퍼티로 타입 좁히기

개발자들은 자주 런타임에서 알 수 없는 값을 처리해야 할 때가 있습니다.
서버에서 응답받거나 설정 파일을 읽는 경우처럼 실제로 프로퍼티가 존재하는지 알 수 없는 경우가 흔하게 있습니다.
JavaScript의 `in` 연산자를 사용하면
객체에 프로퍼티가 존재하는지 알 수 있습니다.

이전 TypeScript 버전에서는 명시적으로 프로퍼티가 타입 목록에 없다면 범위를 좁힐 수 있었습니다.

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
        // 이제 'color'의 타입은 HSV 입니다.
    }
    // ...
}
```

여기서, `RGB` 타입에 정의되지 않은 `hue`에 의해 타입이 좁혀지게 되어, `HSV` 타입이 되었습니다.

그러나 프로퍼티가 주어진 타입이 없는 경우에는 어떨까요?
그런 경우, 언어는 큰 도움이 되지 않습니다.
여기 JavaScript로 된 예시를 살펴보겠습니다.

```js
function tryGetPackageName(context) {
    const packageJSON = context.packageJSON;
    // 객체 여부를 확인합니다.
    if (packageJSON && typeof packageJSON === "object") {
        // 문자열 타입의 name 프로퍼티를 가지고 있는지 확인합니다.
        if ("name" in packageJSON && typeof packageJSON.name === "string") {
            return packageJSON.name;
        }
    }

    return undefined;
}
```

이것을 표준 TypeScript로 다시 작성한다면 `context` 타입을 정의해서 사용할 수 있습니다.
하지만 `packageJSON`의 프로퍼티에 `unknown`과 같은 안전한 타입을 사용하면 이전 TypeScript 버전에서 문제가 발생할 수 있습니다.

```ts
interface Context {
    packageJSON: unknown;
}

function tryGetPackageName(context: Context) {
    const packageJSON = context.packageJSON;
    // 객체 여부를 확인합니다.
    if (packageJSON && typeof packageJSON === "object") {
        // 문자열 타입의 name 프로퍼티를 가지고 있는지 확인합니다.
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

`packageJSON`의 타입이 `unknown`에서 `object`로 좁혀졌지만, `in` 연산자는 실제 정의한 타입으로 엄격하게 좁혔기 때문입니다.
결과적으로 `packageJSON`의 타입은 `object`가 되었습니다.

TypeScript 4.9는 프로퍼티가 전혀 정의되지 _않은_ 타입으로 좁힐 때, `in` 연산자를 사용하여 조금 더 강력하게 만듭니다.
이전과 차이는 없지만, 언어 내부적으로 `Record<"property-key-being-checked", unknown>` 타입을 교차합니다.

따라서 위 예시에서, `packageJSON` 타입은 `unknown`에서 `object`로 그다음 `object & Record<"name", unknown>`로 타입이 좁혀집니다.
이를 통해 `packageJSON.name`에 직접 접근이 가능해지고 독립적으로 좁혀집니다.

```ts
interface Context {
    packageJSON: unknown;
}

function tryGetPackageName(context: Context): string | undefined {
    const packageJSON = context.packageJSON;
    // 객체 여부를 확인합니다.
    if (packageJSON && typeof packageJSON === "object") {
        // 문자열 타입의 name 프로퍼티를 가지고 있는지 확인합니다.
        if ("name" in packageJSON && typeof packageJSON.name === "string") {
            // 정상 동작합니다!
            return packageJSON.name;
        }
    }

    return undefined;
}
```

또한 TypeScript 4.9는`in`의 사용성에서 확인하는 부분을 강화하여 왼쪽에는 `string | number | symbol`, 오른쪽에는 `object`로만 할당할 수 있도록 보장합니다.
이를 이용해서 프로퍼티 키가 유효한지, 실수로 프리미티브 검증을 놓쳤는지 확인할 수 있습니다.

더 많은 정보를 얻고 싶다면, [이를 구현한 pull request를 읽어보세요](https://github.com/microsoft/TypeScript/pull/50666)

## <a name="auto-accessors-in-classes"> 클래스의 자동 접근자

TypeScript 4.9는 자동 접근자라고 하는 ECMAScript의 향후 기능을 지원합니다.
자동 접근자는 `accessor` 키워드로 선언된다는 점을 제외하면 클래스의 속성처럼 선언됩니다.

```ts
class Person {
    accessor name: string;

    constructor(name: string) {
        this.name = name;
    }
}
```

내부적으로 이러한 자동 접근자는 도달할 수 없는 private 프로퍼티의 `get` 및 `set` 접근자로 "de-sugar"됩니다.

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

[자세한 내용은 자동 접근자에 대한 원본 pull request](https://github.com/microsoft/TypeScript/pull/49705)에서 확인할 수 있습니다.

## `NaN` 동등성 검사

JavaScript 개발자의 주요 문제는 내장된 동등 연산자를 사용해서 `NaN` 값을 확인하는 점입니다.

`NaN`은 특수 숫자 값으로 "Not a Number"를 의미합니다. 
`NaN`과 동일한 것은 없습니다. 심지어 `NaN`도 마찬가지입니다.

```js
console.log(NaN == 0)  // false
console.log(NaN === 0) // false

console.log(NaN == NaN)  // false
console.log(NaN === NaN) // false
```

하지만 적어도 대칭적으로 *모든 것* 은 항상 `NaN`과 동일하지 않습니다.

```js
console.log(NaN != 0)  // true
console.log(NaN !== 0) // true

console.log(NaN != NaN)  // true
console.log(NaN !== NaN) // true
```

IEEE-754 float를 포함하는 모든 언어가 동일하게 동작하므로, 기술적으로 JavaScript만의 문제는 아닙니다.
JavaScript의 기본 숫자 타입은 부동소수점 숫자이며, JavaScript는 숫자 구문을 종종 `NaN`으로 분석할 수 있습니다.
그러므로 `NaN` 값 확인은 일반적이며, [`Number.isNaN`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN)를 사용하면 올바르게 확인할 수 있습니다. 하지만 위에서 언급했듯이 많은 사람들이 실수로 `someValue === NaN`을 사용해서 확인하게 됩니다.

TypeScript는 이제 `NaN` 값을 직접 비교하면 오류를 보여주고 `Number.isNaN` 사용을 제안합니다.

```ts
function validate(someValue: number) {
    return someValue !== NaN;
    //     ~~~~~~~~~~~~~~~~~
    // error: This condition will always return 'true'.
    //        Did you mean '!Number.isNaN(someValue)'?
}
```

이번 변경은 TypeScript가 현재 객체 및 배열 리터럴에 대한 비교에서 오류를 발생시키는 방식과 유사하게, 초보자 오류를 잡는 데 큰 도움이 될 것이라고 믿습니다.

[이 기능에 기여한](https://github.com/microsoft/TypeScript/pull/50626) [Oleksandr Tarasiuk](https://github.com/a-tarasyuk)에게 감사를 전하고 싶습니다.

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

## "Remove Unused Imports" 와 "Sort Imports" 편집기 명령어

지금까지 TypeScript는 import를 관리하기 위한 편집기 명령어로 단 두 가지만 지원했습니다.
예시를 위해 다음 코드를 참고하세요.

```ts
import { Zebra, Moose, HoneyBadger } from "./zoo";
import { foo, bar } from "./helper";

let x: Moose | HoneyBadger = foo();
```

먼저 사용하지 않는 import를 제거하고 남은 import를 정렬하는 "Organize Imports" 입니다.
이것은 파일을 다음과 같이 재작성합니다.

```ts
import { foo } from "./helper";
import { HoneyBadger, Moose } from "./zoo";

let x: Moose | HoneyBadger = foo();
```

TypeScript 4.3에서, 파일 내 import를 *오직* 정렬만 하고 제거하지는 않는 "Sort Imports"가 도입되었습니다. 이것은 파일을 다음과 같이 재작성합니다.

```ts
import { bar, foo } from "./helper";
import { HoneyBadger, Moose, Zebra } from "./zoo";

let x: Moose | HoneyBadger = foo();
```

"Sort Imports"에 대한 주의 사항은, Visual Studio Code에서 이 기능이 수동으로 트리거할 수 있는 명령이 아닌 on-save 명령으로만 사용할 수 있었다는 점입니다.

TypeScript 4.9는 나머지 절반을 추가하여 이제 "Remove Unused Imports" 기능을 제공합니다.
TypeScript는 이제 사용되지 않는 이름 import 및 구문 import를 제거하지만, 그 외 상대적인 순서는 그대로 유지합니다.

```ts
import { Moose, HoneyBadger } from "./zoo";
import { foo } from "./helper";

let x: Moose | HoneyBadger = foo();
```

이 기능은 두 명령어를 사용하고자 하는 모든 편집기에서 사용 가능합니다.
특히 Visual Studio Code (1.73 이상)에선 이에 대한 빌트인 기능을 지원하며 *또한* Command Palette를 통해 해당 명령어들을 확인할 수 있습니다.
더 세분화된 "Remove Unused Imports" 또는 "Sort Imports" 사용을 선호하는 사용자는 원하는 경우 "Organize Imports" 키 조합을 재할당할 수 있습니다.

[여기서 이 기능의 세부 사항](https://github.com/microsoft/TypeScript/pull/50931)을 볼 수 있습니다.

## `return` 키워드에 대한 Go-to-Definition

TypeScript는 이제 편집기에 `return` 키워드에 대한 go-to-definition 기능이 수행되면 해당 함수의 상단부로 이동할 수 있게 합니다.
이는 `return` 이 어떤 함수에 속하는지 빠르게 파악하는 데 도움이 됩니다.

TypeScript는 이 기능을 [`await`와 `yield`](https://github.com/microsoft/TypeScript/issues/51223) 또는 [`switch`, `case`, 그리고 `default`](https://github.com/microsoft/TypeScript/issues/51225) 같은 더 많은 키워드에도 확장할 예정입니다.

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

## 수정 및 변경사항

### `lib.d.ts` 업데이트

TypeScript는 major break는 피하기 위해 노력하지만, 내장 라이브러리의 아주 작은 변경조차도 문제가 될 수 있습니다.
DOM과 `lib.d.ts` 업데이트의 결과로 major break 는 일어나지 않을 것으로 기대하지만, 종종 작은 문제가 생길 수도 있습니다.

### `Promise.resolve` 를 위한 보다 나은 타입들

현재 `Promise.resolve`는 이것으로 전달되는 Promise-like 타입을 벗겨내기 위해 `Awaited` 타입을 사용합니다.
이는 종종 더 정확한 `Promise` 타입을 반환하지만, 이 개선된 타입이 `Promise` 대신 `any` 또는 `unknown` 타입을 기대하고 있던 기존 코드를 깨버릴 수도 있습니다.
더 자세한 정보는 [original change](https://github.com/microsoft/TypeScript/pull/33074)를 참고하세요.

### JavaScript 내보내기(Emit) 에서 더이상 Import 를 생략하지 않습니다

TypeScript가 JavaScript에 대한 타입 검사 및 컴파일을 처음 지원했을 때 실수로 import 생략이라는 기능을 지원했었습니다.
짧게 말하면, 만약 import 한 것이 값으로 쓰이지 않거나 런타임에서의 값을 참조하지 않는다면 컴파일러는 내보내기 과정에서 해당 import를 제거하는 기능입니다.

이러한 동작은 특히 import가 값을 참조하는지 감지할 때 종종 TypeScript가 부정확한 선언 파일을 신뢰해야 한다는 점에서 아리송했습니다. 
이제 TypeScript는 JavaScript 파일 내의 import를 유지합니다.

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

더 많은 정보는 [implementing change](https://github.com/microsoft/TypeScript/pull/50404)을 참고하세요.

### `exports`가 `typesVersions`보다 우선 순위가 높습니다.

이전에는 TypeScript가 `--moduleResolution node16` 조건의 `package.json`을 통해 리졸브할 때 `exports` 필드보다 `typesVersions` 필드를 우선했습니다.
이 변경 사항이 여러분의 라이브러리에 영향을 미치는 경우 `package.json`의 `exports` 필드에 `types@` version selector를 추가하면 됩니다.

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

더 자세한 정보는 이 [pull request](https://github.com/microsoft/TypeScript/pull/50890)를 참고하세요.

## `SubstitutionType`에서 `substitute`가 `constraint`로 대체됩니다

substitution 타입의 최적화의 일부로 `SubstitutionType` 객체는 effective substitution을 나타내는 (일반적으로 base type과 암시적 constraint의 intersection) `substitution` 속성을 더 이상 포함하지 않습니다. 대신 `constraint` 속성만 포함합니다.

더 자세히 보려면 원본 [pull request](https://github.com/microsoft/TypeScript/pull/50397)에서 읽어보세요.