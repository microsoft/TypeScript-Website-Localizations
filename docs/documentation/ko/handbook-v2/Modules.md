---
title: Modules
layout: docs
permalink: /ko/docs/handbook/2/modules.html
oneline: "JavaScript가 파일 간 상호작용을 처리하는 방법."
---

JavaScript는 코드를 모듈화하는 다양한 방법들의 오랜 역사를 가지고 있습니다.
2012년에 등장한 TypeScript는 이런 다양한 방법에 대한 지원을 지원해왔지만, 시간이 지남에따라 커뮤니티와 JavaScript 표준은 ES Modules(또는 ES6 모듈)이라고 불리는 형식으로 정착하게 되었습니다. 이는 `import`/`export` 구문으로 알려져 있습니다.

ES Modules는 2015년에 JavaScript 사양에 추가되었고, 2020년쯤에는 대부분의 웹 브라우저와 JavaScript 런타임에서 폭넓게 지원되기 시작했습니다.

이 핸드북에서는 집중적으로 ES Modules와 그 이전에 널리 쓰이던 CommonJS `module.exports = ` 구문을 함께 다룹니다. 다른 모듈 패턴에 대한 내용은 참고 섹션의 [Modules](/docs/handbook/modules.html)에서 확인할 수 있습니다.


## JavaScript 모듈의 정의 방법

TypeScript에서는 ECMAScript 2015와 마찬가지로 파일의 최상위<sup>top-level</sup>에 `import` 또는 `export`가 있으면 그 파일을 모듈<sup>Modules</sup>로 간주합니다.

반대로 파일 최상위에 `import` 또는 `export` 선언이 없으면 스크립트<sup>script</sup>로 취급되며, 이때 해당 내용은 전역 스코프<sup>global scope</sup>에서 참조할 수 있습니다 (모듈에서도 참조할 수 있습니다).

모듈은 전역 스코프가 아닌 자체 스코프<sup>scope</sup> 내에서 실행됩니다.
따라서 모듈 내 변수, 함수, 클래스 등이 `export` 구문으로 명시적으로 내보내지 않으면 모듈 외부에서는 참조할 수 없습니다.
반대로 다른 모듈에서 내보낸 변수, 함수, 클래스, 인터페이스 등을 참조하려면 `import` 구문을 사용해 가져와야 합니다.

## 모듈이 아닌 파일<sup>Non-modules</sup>

시작하기 전에 TypeScript가 무엇을 모듈로 간주하는지 짚고 넘어가야 합니다. JavaScript 사양에 따르면 `import` 또는 `export` 선언 또는 최상위 await가 없으면 JavaScript 파일은 모듈이 아닌 스크립트<sup>script</sup>로 간주합니다.

스크립트 파일 내에서는 변수와 타입이 공유된 전역 스코프에 선언되며, [`outFile`](/tsconfig#outFile) 컴파일러 옵션을 사용해 여러 입력 파일을 하나의 출력 파일로 합치거나, HTML에서 여러 개의 `<script>` 태그를 사용해 이 파일들을 로드합니다 (순서를 지켜야 합니다!).

`import`나 `export`가 없는 파일을 모듈로 처리하려면 다음 줄을 추가하세요:

```ts twoslash
export {};
```

위 한 줄을 추가하면 해당 파일은 아무것도 내보내지 않는 모듈이 됩니다. 이 구문은 module 타겟 설정과 관계없이 동작합니다.

## TypeScript의 모듈

<blockquote class='bg-reading'>
   <p>추가로 읽을 거리:<br />
   <a href='https://exploringjs.com/impatient-js/ch_modules.html#overview-syntax-of-ecmascript-modules'>Impatient JS (Modules)</a><br/>
   <a href='https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Modules'>MDN: JavaScript Modules</a><br/>
   </p>
</blockquote>

TypeScript에서 모듈을 사용할 때 고려할 핵심 사항은 세 가지입니다.

- **Syntax**: What syntax do I want to use to import and export things?
- **Module Resolution**: What is the relationship between module names (or paths) and files on disk?
- **Module Output Target**: What should my emitted JavaScript module look like?

### ES Module 방식

`export default`를 통해 기본 내보내기를 할 수 있습니다.

```ts twoslash
// @filename: hello.ts
export default function helloWorld() {
  console.log("Hello, world!");
}
```

이렇게 내보낸 항목들은 다음처럼 가져옵니다:

```ts twoslash
// @filename: hello.ts
export default function helloWorld() {
  console.log("Hello, world!");
}
// @filename: index.ts
// ---cut---
import helloWorld from "./hello.js";
helloWorld();
```

기본 내보내기 외에도 `default`를 생략한 `export`를 통해 변수와 함수를 여러 개 내보내기 할 수 있습니다:

```ts twoslash
// @filename: maths.ts
export var pi = 3.14;
export let squareTwo = 1.41;
export const phi = 1.61;

export class RandomNumberGenerator {}

export function absolute(num: number) {
  if (num < 0) return num * -1;
  return num;
}
```

위 항목들을 사용할 때는 `import` 구문으로 다른 파일에서 가져와 사용할 수 있습니다:

```ts twoslash
// @filename: maths.ts
export var pi = 3.14;
export let squareTwo = 1.41;
export const phi = 1.61;
export class RandomNumberGenerator {}
export function absolute(num: number) {
  if (num < 0) return num * -1;
  return num;
}
// @filename: app.ts
// ---cut---
import { pi, phi, absolute } from "./maths.js";

console.log(pi);
const absPhi = absolute(phi);
//    ^?
```

### 추가적인 import 문법

import 시 `import {old as new}` 형태로 이름을 변경할 수 있습니다:

```ts twoslash
// @filename: maths.ts
export var pi = 3.14;
// @filename: app.ts
// ---cut---
import { pi as π } from "./maths.js";

console.log(π);
//          ^?
```

위의 문법들을 하나의 `import`문에서 함께 섞어서 사용할 수도 있습니다:

```ts twoslash
// @filename: maths.ts
export const pi = 3.14;
export default class RandomNumberGenerator {}

// @filename: app.ts
import RandomNumberGenerator, { pi as π } from "./maths.js";

RandomNumberGenerator;
// ^?

console.log(π);
//          ^?
```
`* as name` 문법을 사용하면 export된 모든 객체를 하나의 namespace로 모을 수 있습니다:

```ts twoslash
// @filename: maths.ts
export var pi = 3.14;
export let squareTwo = 1.41;
export const phi = 1.61;

export function absolute(num: number) {
  if (num < 0) return num * -1;
  return num;
}
// ---cut---
// @filename: app.ts
import * as math from "./maths.js";

console.log(math.pi);
const positivePhi = math.absolute(math.phi);
//    ^?
```

import "./file"처럼 작성하면 현재 모듈 범위로 어떤 식별자도 들여오지 않고 파일만 로드할 수 있습니다:

```ts twoslash
// @filename: maths.ts
export var pi = 3.14;
// ---cut---
// @filename: app.ts
import "./maths.js";

console.log("3.14");
```

이 경우 `import`문 자체는 아무것도 하지 않는 것처럼 보입니다. 하지만 `maths.ts`의 모든 코드가 실행되기 때문에, 다른 객체에 영향을 주는 부수 효과<sup>side-effect</sup>를 발생시킬 수 있습니다.

#### TypeScript 전용 ES Module 문법

타입은 JavaScript 값과 동일한 문법으로 export/import할 수 있습니다:

```ts twoslash
// @filename: animal.ts
export type Cat = { breed: string; yearOfBirth: number };

export interface Dog {
  breeds: string[];
  yearOfBirth: number;
}

// @filename: app.ts
import { Cat, Dog } from "./animal.js";
type Animals = Cat | Dog;
```

TypeScript는 타입 전용 import를 선언하기 위해 두 가지 개념으로 import 문법을 확장했습니다:

###### `import type`

*오직* 타입만 import할 수 있는 import문입니다:

```ts twoslash
// @filename: animal.ts
export type Cat = { breed: string; yearOfBirth: number };
export type Dog = { breeds: string[]; yearOfBirth: number };
export const createCatName = () => "fluffy";

// @filename: valid.ts
import type { Cat, Dog } from "./animal.js";
export type Animals = Cat | Dog;

// @filename: app.ts
// @errors: 1361
import type { createCatName } from "./animal.js";
const name = createCatName();
```

###### 인라인<sup>inline</sup> `type` imports

TypeScript 4.5부터는 개별 import 앞에 `type`을 붙여서 해당 import가 type이라는 것을 표시할 수 있습니다:

```ts twoslash
// @filename: animal.ts
export type Cat = { breed: string; yearOfBirth: number };
export type Dog = { breeds: string[]; yearOfBirth: number };
export const createCatName = () => "fluffy";
// ---cut---
// @filename: app.ts
import { createCatName, type Cat, type Dog } from "./animal.js";

export type Animals = Cat | Dog;
const name = createCatName();
```

이런 문법들을 통해 Babel, swc, esbuild 같은 TypeScript가 아닌<sup>non-TypeScript</sup> 트랜스파일러들도 안전하게 제거할 수 있는 import문이 무엇인지 알 수 있습니다.

#### CommonJS 동작에 대응하는 ES Module 문법

TypeScript에는 CommonJS와 AMD의 `require`와 *직접적으로* 대응하는 ES Module 문법이 있습니다. *대부분의 경우* ES Module을 사용한 import는 해당 환경의 `require`과 비슷하게 동작하지만, 이 문법을 사용하면 TypeScript 파일이 CommonJS 출력과 1:1로 매칭됩니다:

```ts twoslash
/// <reference types="node" />
// @module: commonjs
// ---cut---
import fs = require("fs");
const code = fs.readFileSync("hello.ts", "utf8");
```
이 문법에 대한 자세한 내용은 [modules reference page](/docs/handbook/modules.html#export--and-import--require)에서 확인할 수 있습니다.

## CommonJS 문법

npm의 대부분 모듈은 CommonJS 형식을 사용합니다. 위의 ES Modules 문법을 사용해서 작성하더라도, CommonJS 문법이 어떻게 동작하는지 간단히 이해하면 디버깅할 때 도움이 됩니다.

#### Export하기

Identifiers are exported via setting the `exports` property on a global called `module`.

`module`이라는 전역 객체의 `exports` 프로퍼티를 설정해서 식별자를 내보내기<sup>export</sup>합니다.

```ts twoslash
/// <reference types="node" />
// ---cut---
function absolute(num: number) {
  if (num < 0) return num * -1;
  return num;
}

module.exports = {
  pi: 3.14,
  squareTwo: 1.41,
  phi: 1.61,
  absolute,
};
```

이후 해당 파일들을 `require`문으로 가져오기<sup>import</sup>할 수 있습니다:

```ts twoslash
// @module: commonjs
// @filename: maths.ts
/// <reference types="node" />
function absolute(num: number) {
  if (num < 0) return num * -1;
  return num;
}

module.exports = {
  pi: 3.14,
  squareTwo: 1.41,
  phi: 1.61,
  absolute,
};
// @filename: index.ts
// ---cut---
const maths = require("./maths");
maths.pi;
//    ^?
```

JavaScript의 구조 분해 할당<sup>destructuring</sup>을 이용하면 좀 더 간단하게 작성할 수도 있습니다:

```ts twoslash
// @module: commonjs
// @filename: maths.ts
/// <reference types="node" />
function absolute(num: number) {
  if (num < 0) return num * -1;
  return num;
}

module.exports = {
  pi: 3.14,
  squareTwo: 1.41,
  phi: 1.61,
  absolute,
};
// @filename: index.ts
// ---cut---
const { squareTwo } = require("./maths");
squareTwo;
// ^?
```

### CommonJS와 ES Modules 호환성

CommonJS와 ES Modules 사이에는 기본 내보내기<sup>default import</sup>와 모듈 네임스페이스 객체<sup>module namespace object</sup> 내보내기를 구분하는 방식에서의 기능적 차이가 있습니다. TypeScript는 두 가지 제약 조건 사이의 마찰을 줄이기 위해 [`esModuleInterop`](/tsconfig#esModuleInterop) 컴파일러 플래그를 제공합니다.

## TypeScript의 모듈 해석<sup>Module Resolution</sup> 옵션

모듈 해석<sup>Module resolution</sup>은 `import`나 `require`문의 문자열을 받아서 그 문자열이 어떤 파일을 가리키는지 결정하는 과정입니다.

TypeScript에는 두 가지 해석<sup>resolution</sup> 전략이 있습니다: 클래식<sup>Classic</sup>과 노드<sup>Node</sup>입니다. Classic은 컴파일러 옵션 [`module`](/tsconfig#module)이 `commonjs`가 아닐 때의 기본값으로, 하위 호환성을 위해 포함되어 있습니다.
Node 전략은 Node.js가 CommonJS 모드에서 동작하는 방식을 재현하되, `.ts`와 `.d.ts`에 대한 추가 검사를 포함합니다.

TypeScript 내에서 module 전략에 영향을 주는 TSConfig 플래그들이 많이 있습니다: [`moduleResolution`](/tsconfig#moduleResolution), [`baseUrl`](/tsconfig#baseUrl), [`paths`](/tsconfig#paths), [`rootDirs`](/tsconfig#rootDirs).

이런 전략들이 어떻게 동작하는지에 대한 전체 세부사항은 [Module Resolution](/docs/handbook/modules/reference.html#the-moduleresolution-compiler-option) 레퍼런스 페이지에서 확인할 수 있습니다.

## TypeScript의 모듈 출력 옵션<sup>Module Output Options</sup>

생성되는 JavaScript 출력에 영향을 주는 두 가지 옵션이 있습니다:

- [`target`](/tsconfig#target): 어떤 JS 기능을 다운레벨링<sup>downlevel</sup>(구 버전 JavaScript 런타임에서 실행되도록 변환)할지와 어떤 기능을 그대로 둘지 결정합니다
- [`module`](/tsconfig#module): 모듈들이 서로 상호작용할 때 사용할 코드를 결정합니다

어떤 [`target`](/tsconfig#target)을 사용할지는 TypeScript 코드가 실행될 JavaScript 런타임 지원 범위에 따라 달라집니다. 예를 들어: 지원해야 하는 가장 오래된 웹 브라우저, 실행할 최소 Node.js 버전, 혹은 Electron 같은 특정 런타임의 제약 조건이 기준이 될 수 있습니다.

모든 모듈 간 통신은 모듈 로더<sup>module loader</sup>를 통해 이루어지며, 컴파일러 옵션 [`module`](/tsconfig#module)이 어떤 로더<sup>loader</sup>을 사용할지 결정합니다.
런타임에 모듈 로더는 모듈을 실행하기 전에 해당 모듈의 모든 의존성을 찾아서 실행하는 역할을 담당합니다.

예를 들어, 아래는 ES Modules 문법을 사용하는 TypeScript 파일이며, [`module`](/tsconfig#module)의 몇 가지 다른 입출력 방식을 보여줍니다:

```ts twoslash
// @filename: constants.ts
export const valueOfPi = 3.142;
// @filename: index.ts
// ---cut---
import { valueOfPi } from "./constants.js";

export const twoPi = valueOfPi * 2;
```

#### `ES2020`

```ts twoslash
// @showEmit
// @module: es2020
// @noErrors
import { valueOfPi } from "./constants.js";

export const twoPi = valueOfPi * 2;
```

#### `CommonJS`

```ts twoslash
// @showEmit
// @module: commonjs
// @noErrors
import { valueOfPi } from "./constants.js";

export const twoPi = valueOfPi * 2;
```

#### `UMD`

```ts twoslash
// @showEmit
// @module: umd
// @noErrors
import { valueOfPi } from "./constants.js";

export const twoPi = valueOfPi * 2;
```

> 참고: ES2020은 기본적으로 원본 `index.ts`와 동일합니다.

사용 가능한 모든 옵션과 각 옵션에서 JavaScript 코드가 어떻게 보이는지는 [`module`에 대한 TSConfig 레퍼런스](/tsconfig#module)에서 확인할 수 있습니다.

## TypeScript 네임스페이스<sup>namespace</sup>

TypeScript에는 ES Modules 표준보다 먼저 나온 `namespaces`라는 자체 모듈 형식이 있습니다. 이 문법은 복잡한 정의 파일<sup>definition files</sup>을 만들 때 유용한 기능들을 많이 제공하며, 지금도 [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)에서 활발하게 사용되고 있습니다. 사용 중단<sup>deprecated</sup>상태는 아니지만, namespaces의 대부분 기능이 ES Modules에도 존재하므로 JavaScript의 방향성과 일치하도록 ES Modules 사용을 권장합니다. namespaces에 대한 자세한 내용은 [namespaces 레퍼런스 페이지](/docs/handbook/namespaces.html)에서 확인할 수 있습니다.
