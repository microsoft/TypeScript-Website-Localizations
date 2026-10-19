---
title: Modules - Theory
short: Theory
layout: docs
permalink: /ko/docs/handbook/modules/theory.html
oneline: Typescript가 Javascript 모듈을  모델링 하는 방법
translatable: true
---

## JS의 모듈과 스크립트

JS가 브라우저에서만 실행되던 초기에는 모듈이 없었지만 HTML에서 여러 스크립트 태그를 사용하여 웹 페이지의 자바스크립트를 여러 파일로 분할하는 것이 가능해졌습니다.

이러한 형태로 사용했죠.

```HTML
<html>
	<head>
		<script src="a.js"></script>
		<script src="b.js"></script>
	</head>
	<body></body>
</html>
```

이 접근 방식은 특히 웹 페이지가 점점 더 커지고 복잡해지면서 몇 가지 단점이 생겼습니다. 특히 같은 페이지에 로드된 모든 스크립트는 '전역 범위'라고 부르는 동일한 범위를 공유하므로 스크립트가 서로의 변수와 함수를 덮어쓰지 않도록 매우 주의해야 했습니다.

파일에 고유한 범위를 부여하면서 다른 파일에서 코드 조각들을 사용할 수 있는 방법을 제공하여 이 문제를 해결하는 모든 시스템을 "모듈 시스템"이라고 부를 수 있습니다. (모듈 시스템의 각 파일을 "모듈"이라고 말하는 것이 당연하게 들릴 수도 있지만, 이 용어는 모듈 시스템 외부에서 전역 범위로 실행되는 스크립트 파일과 대조하기 위해 자주 사용됩니다).

> [많은 모듈 시스템이 있고](https://github.com/myshov/history-of-javascript/tree/master/4_evolution_of_js_modularity) TypeScript는 [여러 가지를 지원하지만](https://www.typescriptlang.org/tsconfig/#module) 이 문서에서는 현재 가장 중요한 두 가지 시스템에 초점을 맞출 것인데, 바로 ECMAScript 모듈(ESM)과 CommonJS(CJS)입니다.
>
> ECMAScript 모듈(ESM)은 언어에 내장된 모듈 시스템으로, 최신 브라우저와 v12부터 Node.js에서 지원됩니다. 전용 `import` 및 `export` 구문을 사용합니다:

> ```javascript
> // a.js
> export default 'Hello from a.js';
> ```
>
> ```js
> // b.js
> import a from './a.js';
> console.log(a); // 'Hello from a.js'
> ```
>
> CommonJS(CJS)는 ESM이 언어 사양에 포함되기 전에 원래 Node.js에 제공되었던 모듈 시스템입니다. 이는 ESM과 함께 Node.js에서 여전히 지원되고 있습니다. CJS는 일반 JavaScript 객체와 `exports`, `require`라는 이름의 함수를 사용합니다.
>
> ```js
> // a.js
> exports.message = 'Hello from a.js';
> ```
>
> ```js
> // b.js
> const a = require('./a');
> console.log(a.message); // 'Hello from a.js'
> ```

따라서 TypeScript는 파일이 CommonJS 또는 ECMAScript 모듈임을 감지하면 해당 파일에 고유한 범위가 있을 것으로 가정하고 시작합니다. 하지만 그 이후에는 컴파일러의 작업이 조금 더 복잡해집니다.

## 모듈과 관련한 TS의 작업

TypeScript 컴파일러의 주요 목표는 컴파일 시 특정 종류의 런타임 오류를 포착하여 이를 방지하는 것입니다. Typescript 컴파일러는 모듈의 포함 여부와 관계없이 코드의 의도된 런타임 환경(예: 사용 가능한 전역)에 대해 알아야 합니다. 만약 모듈이 포함된 경우, 컴파일러가 작업을 수행하기 위해서는 몇가지 추가 질문이 필요하게 됩니다. 몇 줄의 입력 코드를 예시로 살펴봅시다.

```ts
import sayHello from 'greetings';
sayHello('world');
```

이 파일을 확인하려면 컴파일러가 `sayHello`의 유형(하나의 문자열 인수를 받을 수 있는 함수인가?)을 알아야 합니다. 여기서 아래의 추가 질문들이 생기게 됩니다.

1. 모듈 시스템이 이 타입스크립트 파일을 직접 로드할 것인가, 아니면 TS컴파일러가 타입스크립트 파일에서 생성한 자바스크립트 파일을 로드할 것인가?
2. 로드할 파일 이름과 디스크의 위치를 통해 모듈 시스템이 예상하는 모듈의 종류는 무엇인가? (CJS, ESM)
3. 트랜스파일링이 완료된 자바스크립트가 만들어진 경우, 이 파일에 있는 모듈 구문(ts파일 내부의코드들)이 출력 코드에서 어떻게 변환되는가? (ESM or CJS)
4. 모듈 시스템은 `"greetings"`로 지정된 모듈을 찾기 위해 어느 위치(디렉토리)에서 찾는가?
5. 해당 조회로 확인된 파일은 어떤 종류의 모듈인가?
6. 모듈 시스템이 (2)에서 검색된 모듈 종류가 (3)에서 결정된 구문으로 (5)에서 검색된 모듈 종류를 참조할 수 있도록 허용하는가?
7. `"greetings"` 모듈이 분석됐을때, 해당 모듈의 어떤 부분이 `"sayHello"`로 바인딩되는가?

위의 모든 질문은 호스트의 특성, 즉 모듈 로드 동작을 지시하기 위해 최종적으로 트랜스파일링된 JavaScript(또는 경우에 따라 TypeScript)를 소비하는 시스템 일반적으로 런타임(예: Node.js) 또는 번들러(예: Webpack)에 따라 달라지게 됩니다.

ECMAScript 사양은 ESM import와 export 가 서로 연결되는 방식으로 정의하지만 module resolution라고 하는 (4)의 파일 조회가 어떻게 이루어지는지는 명시하지 않으며, CommonJS 같은 다른 모듈 시스템에 대해서는 아무 것도 언급하지 않습니다. 따라서 런타임과 번들러, 특히 ESM과 CJS를 모두 지원하려는 런타임과 번들러는 자체 규칙을 자유롭게 설계할 수 있게됩니다. 따라서 TypeScript가 위의 질문에 답하는 방식은 코드가 실행되는 위치에 따라 크게 달라질 수 있게 됩니다. 하나의 정답은 존재하지 않으므로, 우리는 컴파일러에게 설정파일(tsconfig)을 통해 규칙을 알려주어야 합니다.

명심해야 할 또 다른 핵심 아이디어는 타입스크립트는 거의 항상 입력 타입스크립트(또는 자바스크립트!) 파일이 아닌 출력 파일(트랜스파일링된 자바스크립트 파일)의 관점에서 이러한 질문을 생각한다는 것입니다. 오늘날 일부 런타임과 번들러는 TypeScript 파일을 직접 로드하는 기능을 지원하며, 이러한 경우 입력 파일과 출력 파일을 분리해서 생각하는 것은 의미가 없습니다. 이 문서의 대부분은 TypeScript 파일이 JavaScript 파일로 컴파일된 후 런타임 모듈 시스템에 의해 로드되는 경우에 대해 설명합니다. 이러한 경우를 살펴보는 것은 컴파일러의 옵션과 동작을 이해하는 데 필수적이며, 여기서부터 시작하면 esbuild, Bun 및 [기타 TypeScript 우선 런타임과 번들러](#module-resolution-for-bundlers-typescript-runtimes-and-nodejs-loaders)에 대해 생각할 때 더 쉽게 단순화할 수 있습니다. 따라서 현재로서는 출력 파일 측면에서 모듈과 관련하여 TypeScript가 하는 일을 요약할 수 있습니다.

타입스크립트는 **호스트의 규칙**을 충분히 이해한 후에 아래의 일을 수행합니다.

1. 파일을 유효한 **출력 모듈 형식**으로 컴파일한다.
2. **결과 코드**에서 **import가 성공적으로 되는지** 확인한다.
3. **import한 이름**에 어떤 **타입**을 할당할지 알아낸다.

## Host가 누구인가?

계속 진행하기 전에, 호스트라는 용어가 자주 등장하기 때문에 호스트가 무엇인지 짚고 넘어가는 것이 좋을 것 같습니다.

앞서 우리는 호스트가 "모듈 로딩 동작을 지시하기 위해 궁극적으로 출력 코드를 소비하는 시스템"이라고 정의했습니다. 다시 말해, TypeScript의 모듈 분석이 모델링하려고 하는 것은 TypeScript 외부의 시스템인 것입니다.

- 트랜스 파일링된 결과 코드(`tsc` 또는 타사 트랜스파일러에 의해 생성된 것이든)가 Node.js와 같은 런타임에서 직접 실행되는 경우 런타임이 호스트가 됩니다
- 런타임이 TypeScript 파일을 직접 소비하거나,"출력 코드"가 없는 경우에도 런타임이 호스트입니다.
- 번들러가 TypeScript 입력 또는 출력을 소비하고 번들을 생성하는 경우, 번들러는 호스트입니다. 왜냐하면 번들러는 원래 import/require를 살펴보고 참조한 파일을 조회한 다음 새 파일 또는 파일 집합을 생성하기때문입니다. (해당 번들 자체는 모듈로 구성될 수 있으며, 이를 실행하는 런타임이 호스트가 되지만 TypeScript는 번들러 이후에 일어나는 모든 일에 대해 알지 못합니다).
- 다른 트랜스파일러, 옵티마이저 또는 포맷터가 TypeScript의 트랜스파일링 결과를 실행하고는 있으나 imports와 exports를 그대로 두고있다면, 해당 트랜스파일러, 옵티마이저, 포맷터들은 TypeScript가 신경 쓰는 호스트가 아닙니다.
- 웹 브라우저에서 모듈을 로드할 때 TypeScript가 모델링해야 하는 동작은 실제로 웹 서버와 브라우저에서 실행 중인 모듈 시스템으로 나뉩니다. 브라우저의 JavaScript 엔진(또는 RequireJS와 같은 스크립트 기반 모듈 로드 프레임워크)은 허용되는 모듈 형식을 제어하고, 웹 서버는 한 모듈이 다른 모듈 로드 요청을 트리거할 때 어떤 파일을 전송할지 결정합니다.
- TypeScript 컴파일러 자체는 다른 호스트를 모델링하는 것 외에 모듈과 관련된 어떠한 동작도 제공하지 않으므로 호스트가 아닙니다.

## 모듈의 결과 형태

모든 프로젝트에서 모듈에 대한 첫 번째 질문에 답해야 하는 것은 호스트가 어떤 종류의 모듈을 기대하는지에 대한 것입니다. 따라서 TypeScript는 각 ts파일에 대한 js의 출력 형식을 설정할 수가 있습니다. 때로는 호스트가 한 가지 종류의 모듈만 지원하는 경우가 있습니다. 예를 들어, 브라우저에서는 ESM만 지원하고, Node.js v11 이하에서는CJS 하나만 지원합니다. Node.js v12 이상에서는 CJS와 ES 모듈을 모두 허용하지만 파일 확장명과 `package.json` 파일을 사용하여 각 파일의 형식을 결정하고 파일 내용이 예상 형식과 일치하지 않으면 오류를 발생시킵니다.

`module` 컴파일러 옵션은 ts컴파일러에 이 정보를 제공합니다. 이 옵션의 주요 목적은 컴파일을 통해 JavaScript의 모듈 형식(ESM인지 CJS인지)을 제어하는 것이지만, 각 파일의 모듈 종류를 감지하는 방법, 서로 다른 모듈 종류를 서로 가져올 수 있는 방법, `import.meta` 및 최상위 `await` 같은 기능을 사용할 수 있는지 여부를 컴파일러에 알려주는 역할도 합니다. 따라서 TypeScript 프로젝트에서 `noEmit` 옵션을 사용하더라도 `module`에 대한 올바른 설정을 선택하는 것은 여전히 중요한 것입니다. 앞서 설명했듯이 컴파일러는 모듈 시스템을 정확하게 이해해야 imports에 대한 타입을 검사(IntelliSense 제공도)할 수 있습니다. 프로젝트에 적합한 모듈 설정을 선택하는 방법에 대한 지침은 [컴파일러 옵션 선택하기](https://www.typescriptlang.org/docs/handbook/modules/guides/choosing-compiler-options.html)를 참조하십시오.

사용 가능한 모듈 설정은 다음과 같습니다.

- [**`node16`**](/docs/handbook/modules/reference.html#node16-nodenext): 특정 상호 운용성 및 탐지 규칙과 함께 ES 모듈과 CJS 모듈을 둘다 지원하는 Node.js v16+의 모듈 시스템입니다.

- [**`nodenext`**](/docs/handbook/modules/reference.html#node16-nodenext): 현재 node16과 동일하지만 Node.js의 모듈 시스템이 발전함에 따라 최신 Node.js 버전을 반영합니다.
- [**`es2015`**](/docs/handbook/modules/reference.html#es2015-es2020-es2022-esnext): JavaScript 모듈에 대한 ES2015 언어 사양을 반영합니다.(es2015부터 `import`와 `export`가 도입되었습니다.)
- [**`es2020`**](/docs/handbook/modules/reference.html#es2015-es2020-es2022-esnext): es2015에 더해 `export * as ns from "mod"` `import.meta` 지원이 추가되었습니다.
- [**`es2022`**](/docs/handbook/modules/reference.html#es2015-es2020-es2022-esnext): `es2020`에 최상위 await에 대한 지원을 추가되었습니다.
- [**`esnext`**](/docs/handbook/modules/reference.html#es2015-es2020-es2022-esnext): 현재 es2022와 동일하지만, 향후 사양 버전에 포함될 것으로 예상되는 module-related Stage 3+ proposals과 같은 최신 ECMAScript 사양을 반영합니다.
- **[`commonjs`](/docs/handbook/modules/reference.html#commonjs), [`system`](/docs/handbook/modules/reference.html#system), [`amd`](/docs/handbook/modules/reference.html#amd), and [`umd`](/docs/handbook/modules/reference.html#umd)**: 각각은 명명된 모듈 시스템의 모든 것을 방출하며 모든 것을 해당 모듈 시스템으로 성공적으로 가져올 수 있다고 가정합니다. 새 프로젝트에는 더 이상 권장되지 않으며 이 문서에서 자세히 다루지 않습니다.

> 모듈 형식 감지 및 상호 운용성에 대한 Node.js의 규칙에 따라 tsc에서 내보내는 모든 파일이 각각 ESM 또는 CJS인 경우에도 Node.js에서 실행되는 프로젝트의 모듈을 esnext 또는 commonjs로 지정하는 것은 올바르지 않습니다. Node.js에서 실행하려는 프로젝트에 대한 올바른 모듈 설정은 node16과 nodenext뿐입니다. 전체 ESM Node.js 프로젝트에 대해 트랜스파일링되는 JavaScript는 esnext와 nodenext를 사용하는 컴파일 간에 동일하게 보일 수 있지만 type check는 다를 수 있기 때문입니다.

### 모듈 형식 감지

Node.js는 ES 모듈과 CJS 모듈을 모두 이해하지만 각 파일의 형식은 파일 확장명과 파일 디렉토리 및 모든 상위 디렉터리 검색에서 찾은 첫 번째 `package.json` 파일의 `type` 필드에 따라 결정됩니다.

- `.mjs` 및 `.cjs` 파일은 항상 각각 ES 모듈 및 CJS 모듈로 해석됩니다.
- 가장 가까운 `package.json` 파일에 `"module"` 값이 있는 유형 필드가 있는 경우 `.js` 파일은 ES 모듈로 해석된다. `package.json` 파일이 없거나 유형 필드가 누락되었거나 다른 값을 갖는 경우 `.js` 파일은 CJS 모듈로 해석됩니다.

이러한 규칙에 따라 파일이 ES 모듈로 판단되면 Node.js가 파일의 범위에 CommonJS `module` 및 `require` 객체를 주입하지 않습니다. 반대로 파일이 CJS 모듈로 판단되면 파일의 `import` 및 `export` 선언이 구문 오류 충돌을 일으킵니다.

`module` 컴파일러 옵션이 `node16` 또는 `nodenext`로 설정된 경우 TypeScript는 프로젝트의 입력 파일에 동일한 알고리즘을 적용하여 각 해당 출력 파일의 모듈 종류를 결정합니다. `--module nodenext`를 사용하는 예제 프로젝트에서 모듈 형식이 어떻게 감지되는지 살펴봅시다.

| Input file name                  | Contents               | Output file name | Module kind | Reason                                  |
| -------------------------------- | ---------------------- | ---------------- | ----------- | --------------------------------------- |
| `/package.json`                  | `{}`                   |                  |             |                                         |
| `/main.mts`                      |                        | `/main.mjs`      | ESM         | File extension                          |
| `/utils.cts`                     |                        | `/utils.cjs`     | CJS         | File extension                          |
| `/example.ts`                    |                        | `/example.js`    | CJS         | No `"type": "module"` in `package.json` |
| `/node_modules/pkg/package.json` | `{ "type": "module" }` |                  |             |                                         |
| `/node_modules/pkg/index.d.ts`   |                        |                  | ESM         | `"type": "module"` in `package.json`    |
| `/node_modules/pkg/index.d.cts`  |                        |                  | CJS         | File extension                          |

입력 파일 확장자가 `.mts` 또는 `.cts`인 경우, Node.js는 출력 `.mjs` 파일을 ES 모듈로, 출력 `.cjs` 파일을 CJS 모듈로 처리하기 때문에 TypeScript는 해당 파일을 각각 ES 모듈 또는 CJS 모듈로 처리합니다.
입력 파일 확장자가 `.ts`인 경우 TypeScript는 출력 `.js` 파일을 발견할 때 가장 가까운 `package.json` 파일을 참조하여 모듈 형식을 결정해야 하는데, 이는 Node.js가 `.js`결과물을 처리하는 방식과 동일하기 때문입니다. (알아두세요: pkg 종속성의 `.d.cts` 및 `.d.ts` 선언 파일에도 동일한 규칙이 적용됩니다. 이들은 컴파일에 대한 일부로 출력 파일을 생성하지는 않지만, `.d.ts`파일의 존재는 해당하는 `.js` 파일의 존재를 의미합니다. 이 파일은 아마 `pkg` 라이브러리의 저자가 라이브러리의 .ts 파일에 대해 tsc를 실행할 때 생성되었을 것입니다. 따라서 Node.js는 이를 ES 모듈로 해석해야합니다. 이는 .js 확장자와 `/node_modules/pkg/package.json`의 `"type": "module"` 필드의 존재 때문입니다. 선언 파일은 [이후 섹션](#the-role-of-declaration-files)에서 자세히 다루겠습니다.)

"입력 파일의 감지된 모듈 형식"은 TypeScript가 입력 파일을 분석하여 어떤 모듈 형식인지 판단하는 것을 의미합니다. TypeScript는 이렇게 감지된 모듈 형식을 활용하여, 각 출력 파일에 Node.js가 기대하는 문법을 생성합니다.

만약 TypeScript가 `/example.js`에 `import` 및 `export` 문을 포함한 코드를 생성한다면, 이 파일을 파싱하는 동안 Node.js가 충돌을 일으킵니다. 이는 Node.js가 CommonJS 모듈 형식으로 예상하는데, ECMAScript 모듈 형식의 코드를 파싱하는 것이기 때문입니다.
만약 TypeScript가 `/main.mjs`에 `require`를 포함한 코드를 생성한다면, 이 파일을 실행하는 동안 Node.js가 충돌을 일으킵니다. 이는 Node.js가 ECMAScript 모듈 형식으로 예상하는데, CommonJS 모듈 형식의 코드를 실행하는 것이기 때문입니다. 이처럼 모듈 형식은 코드 생성뿐만이 아니라, TypeScript에서의 타입 검사 및 module Resolution 규칙을 결정하는 데에도 사용됩니다. 다시 한 번 되짚어볼만한 내용은 `--module node16` 및 `--module nodenext`에서 TypeScript의 동작은 전적으로 Node.js의 동작에 의해 동기화된다는 것입니다. TypeScript의 목표는 컴파일 타임에 잠재적인 런타임 오류를 포착하는 것이므로 런타임에 어떤 일이 일어날지에 대한 매우 정확한 모델이 필요합니다. 모듈 종류 감지를 위한 이 상당히 복잡한 규칙들은 Node.js에서 실행되는 코드를 검사하는 데 필요하지만, Node.js가 아닌 호스트에 적용하면 지나치게 엄격하거나 부정확할 수 있습니다.

### 모듈 입력 구문

ts파일에 작성한 구문과 JS 파일로 트랜스파일된 출력 모듈 구문은 다소 분리되어 있다는 점을 유의해야합니다.
예를들어 ESM 가져오기가 있는 파일을 살펴보면

```ts
import { sayHello } from 'greetings';
sayHello('world');
```

이는 ESM 형식으로도, 혹은 아래와 같이 CommonJS로도 트랜스파일링될 수 있습니다.

```js
Object.defineProperty(exports, '__esModule', { value: true });

const greetings_1 = require('greetings');

(0, greetings_1.sayHello)('world');
```

이는 `module` 컴파일러 옵션에 따라(만약 `module` 옵션이 두 종류 이상의 모듈을 지원한다면(nodenext 등) [모듈 형식 감지 규칙](#module-format-detection)에 따라) 달라집니다. 따라서 일반적으로는 ts파일의 내용을 살펴보는 것만으로는 결과물이 ES 모듈인지 CJS 모듈인지 판단할 수가 없습니다.

> 오늘날 대부분의 TypeScript 파일은 출력 형식과 관계없이 ESM 구문 (import 및 export 문)을 사용하여 작성됩니다. 이것은 ESM이 널리 지원되기까지의 오랜 기간 동안의 발전의 유산입니다. ECMAScript 모듈은 2015년에 표준화되었으며, 2017년에는 대부분의 브라우저에서 지원되었으며, 2019년에는 Node.js v12에 포함되었습니다. 이 기간 동안 ESM이 JavaScript 모듈의 미래라는 것은 명백했지만, 매우 적은 런타임만이 이를 소비할 수 있었습니다. Babel과 같은 도구들은 JavaScript를 ESM으로 작성하고 다른 모듈 형식으로 다운레벨링하여 Node.js나 브라우저에서 사용할 수 있도록 만들었습니다. TypeScript도 이에 이어 ES 모듈 구문을 지원하고 원래의 CommonJS에서 영감을 받은 `import fs = require("fs")` 구문 사용을 [1.5 릴리스에서](<(https://devblogs.microsoft.com/typescript/announcing-typescript-1-5/).>) 부드럽게 권장했습니다.
>
> 이 "author ESM, output anything" 전략의 장점은 TypeScript이 표준 JavaScript 구문을 사용할 수 있어서 작성 경험이 새로운 사용자에게 익숙하고 (이론적으로) 미래에 ESM 출력을 대상으로하는 프로젝트를 쉽게 시작할 수 있다는 것입니다. 그러나 ESM 및 CJS 모듈이 Node.js에서 공존하고 상호 운용될 수 있게 된 후에만 완전히 드러난 세 가지 주요 단점이 있습니다:

> 1. Node.js에서 ESM/CJS 상호 운용성이 작동할 것으로 예상했던 초기 가정들이 틀렸으며, 오늘날에는 TypeScript 모듈의 구성 공간이 매우 큽니다.
> 2. 입력 파일의 구문이 모두 ESM처럼 보일 때, 작성자나 코드 리뷰어가 실행 중에 파일의 모듈 종류를 잊어버리기 쉽습니다. 그리고 Node.js의 상호 운용성 규칙 때문에 각 파일의 모듈 종류가 매우 중요해졌습니다.
> 3. 입력 파일이 ESM으로 작성되면 대응하는 유형 선언 출력 파일 (`.d.ts` 파일)의 구문도 ESM과 동일합니다. 그러나 해당하는 JavaScript 파일은 어떤 모듈 형식으로도 발행될 수 있기 때문에 TypeScript는 유형 선언의 내용만으로 파일의 모듈 종류를 알 수 없습니다. 또한 ESM/CJS 상호 운용성의 특성 때문에 TypeScript는 올바른 유형을 제공하고 충돌을 일으키는 가져오기를 방지하기 위해 모든 것의 모듈 종류를 알아야합니다.
>    TypeScript 5.0에서는 verbatimModuleSyntax라는 새로운 컴파일러 옵션이 도입되어 import 및 export 문이 어떻게 출력될 것인지를 정확하게 알려줍니다. 이 플래그를 사용하면 입력 파일에서 import 및 export 문은 컴파일 전에 가장 적은 변환을 거칠 형식으로 작성되어야 합니다.

### ESM과 CJS의 상호운용성

ES 모듈이 CommonJS 모듈을 `import할` 수 있을까요? 그렇다면, default import는 `exports` 또는 `exports.default`에 연결될까요? CommonJS 모듈은 ES 모듈을 `require`할 수 있을까요? CommonJS는 ECMAScript 명세의 일부가 아니기 때문에, 런타임, 번들러 및 트랜스파일러들은 ESM이 2015년에 표준화된 이후로 이러한 질문에 대한 자체적인 답변을 만들어왔으며, 따라서 표준 상호 운용성 규칙이 존재하지 않습니다.

오늘날, 대부분의 런타임과 번들러는 크게 세 가지 범주로 나눌 수 있습니다.

1. ESM Only
   브라우저 엔진과 같은 일부 런타임은 ECMAScript 모듈만 지원합니다.
2. Bundler-like:
   Babel과 같은 도구는 ES 모듈을 CommonJS로 변환하여 사용합니다. 이 ESM을 CJS로 변환한 파일들이 수동으로 작성된 CJS 파일들과 상호 작용하는 방식은 번들러와 트랜스파일러를 위한 사실상의 표준이된 상호 운용성 규칙입니다.
3. Node.js
   Node.js에서는 CommonJS 모듈이 ES 모듈을 동기적으로 로드할 수 없고, (`require`를 사용했을때) 오직 동적 `import()` 호출로만 비동기적으로 로드할 수 있습니다. ES 모듈은 항상 `exports`에 바인딩되는 CJS 모듈을 기본으로 가져올 수 있습니다. (즉, `__esModule`과 같은 Babel 스타일 CJS 출력의 기본 가져오기는 Node.js와 일부 번들러 사이에서 다르게 작동합니다.)

TypeScript는 올바른 타입을 제공하고 런타임에서 충돌이 발생할 수 있는 imports 대한 오류를 보장하기 위해 어떤 모듈 간 상호 작용 규칙을 설정했는지 알아야 합니다. 예를 들어, `module` 컴파일러 옵션을 `node16` 또는 `nodenext`로 설정하면 Node.js의 규칙이 강제됩니다. 다른 모든 module 설정은 [`esModuleInterop`](/docs/handbook/modules/reference.html#esModuleInterop) 옵션을 결합하면 TypeScript에서 번들러와 유사한 상호 운용성이 발생합니다.(--module esnext를 사용하면 CommonJS 모듈을 작성하는 것은 방지하지만 종속성으로 가져올 수 있습니다. 현재 ES 모듈이 CommonJS 모듈을 가져오는 것을 방지하는 TypeScript 설정은 없습니다. 이것은 직접 브라우저 코드를 작성하는 데 적합합니다.)

### 모듈의 식별자는 변환되지 않는다.

`module` 컴파일러 옵션은 입력 파일에서 가져오기(import)와 내보내기(export)를 출력 파일의 다른 모듈 형식으로 변환할 수 있지만, 모듈 식별자(`import`다음에 오는 `from`과 `require`에 오는 문자열)의 변환은 일으키지 않습니다.

예를들어 아래 코드는

```ts
import { add } from './math.mjs';
add(1, 2);
```

이렇게 변환될 수도 있지만

```ts
import { add } from './math.mjs';
add(1, 2);
```

CJS로 변환하는 경우 아래와 같이 변환됩니다.

```ts
const math_1 = require('./math.mjs');
math_1.add(1, 2);
```

`module` 컴파일러 옵션에 따라 달라지겠지만, 모듈 식별자는 항상 "./math.mjs"입니다. 모듈 식별자를 변환, 대체 또는 변경하는 컴파일러 옵션이 없습니다. 따라서 모듈 식별자는 코드의 대상 런타임이나 번들러에서 작동하는 방식으로 작성되어야 합니다. TypeScript는 이러한 출력 상대적인 지정자를 이해하는 것이 중요합니다. 모듈 지정자에 의해 참조된 파일을 찾는 과정을 *module resolution*이라고 합니다.

## Module Resolution

[첫 예시](#typescripts-job-concerning-modules)로 돌아가서 배운 것을 확인해봅시다.

```ts
import sayHello from 'greetings';
sayHello('world');
```

지금까지 호스트의 모듈 시스템과 TypeScript의 `module` 컴파일러 옵션이 이 코드에 어떤 영향을 미칠 수 있는지 살펴보았습니다. 이제 우리는 이 코드가 입력 구문(ts)은 ESM처럼 보이지만 `module` 컴파일러 옵션, 파일 확장자 및 `package.json` `"type"` 필드에 따라 출력 형식이 달라진다는 것을 알고 있습니다.
또한 `sayHello`가 바인딩되는 대상, 심지어 import의 허용 여부도 이 파일의 모듈 종류와 대상 파일에 따라 달라질 수 있다는 것도 알고 있습니다. 하지만 대상 파일을 어떻게 *찾는지*는 아직 이야기 하지 않았습니다.

### Module resolution은 호스트가 결정한다.

ECMAScript 명세는 `import`와 `export`에 대한 해석을 어떻게 파싱할지 정의하지 않고 있기때문에, 호스트 환경에 따라 module resolution을 정의할 수 있습니다. 새로운 JavaScript 런타임을 개발한다면, module resolution을 자유롭게 만들 수 있습니다.

예를들어 이런식으로도 만들 수 있습니다.

```ts
import monkey from '🐒'; // Looks for './eats/bananas.js'
import cow from '🐄'; // Looks for './eats/grass.js'
import lion from '🦁'; // Looks for './eats/you.js'
```

이렇게 작성했음에도 불구하고, 이 런타임은 "표준 호환 ESM(ESM 호환)"을 구현한다고 주장할 수 있습니다. 그러나 이러한 경우 TypeScript는 이러한 런타임의 module resolution 알고리즘에 대한 내장 지식이 없으면 `monkey`, `cow`, `lion과` 같은 변수에 어떤 유형을 할당해야 하는지 알 수가 없습니다.따라서 TypeScript는 호스트 환경의 module resolution 알고리즘에 대한 내용을 알고 있어야 합니다. `moduleResolution` 옵션은 `module`옵션으로 출력 모듈형식을 알려주는 것 처럼, 모듈식별자를 파일로 가져오는데 사용하는 알고리즘을 명시합니다. 이것이 TypeScript가 emit 중에 import식별자(모듈식별자)을 수정하지 않는 이유이기도 합니다. import 식별자(모듈식별자)와 실제 파일 간의 관계는 호스트에 따라 정의되며, TypeScript는 호스트가 아니기 때문입니다.

사용 가능한 `moduleResolution` 옵션은 다음과 같습니다.

- [**`classic`**](/docs/handbook/modules/reference.html#classic): TypeScript의 가장 오래된 module resolution로, 이는 안타깝게도 `module`이 `commonjs`, `node16`, 또는 `nodenext`가 아닌 다른 것으로 설정된 경우 기본값입니다. 다양한 RequireJS 구성에 대해 최선의 노력 해결을 제공하기 위해 만들어졌을 것습니다. 새로운 프로젝트에 사용해서는 안 되며(또는 RequireJS나 다른 AMD 모듈 로더를 사용하지 않는 이전 프로젝트에도), TypeScript 6.0에서 폐지 예정입니다.
- [**`node10`**](/docs/handbook/modules/reference.html#node10-formerly-known-as-node): 이전의 `node`옵션으로, 이것은 `module`이 `commonjs`로 설정된 경우 불행하게도 기본값입니다. 이것은 v12 이전의 Node.js 버전을 상당히 잘 모델링하며, 때로는 대부분의 번들러가 module resolution을 수행하는 근사값일 수도 있습니다. 이것은 `node_modules`에서 패키지를 찾고, 디렉토리 `index.js` 파일을 로드하며, 상대적인 모듈 지정자에서 `.js` 확장자를 생략하는 것을 지원합니다. 그러나 Node.js v12에서 ES 모듈을 위한 다른 module resolution 규칙이 도입되었기 때문에, 현대 버전의 Node.js에 대한 좋은 모델은 아닙니다. 새로운 프로젝트에 사용해서는 안 됩니다.
- [**`node16`**](/docs/handbook/modules/reference.html#node16-nodenext-1): 이것은 `--module node16`의 상반되는 모드이며, 해당 `module` 설정과 함께 기본으로 설정됩니다. Node.js v12 이후, ESM 및 CJS를 모두 지원하는데, 각각 자체 module resolution 알고리즘을 사용합니다. Node.js에서 import 문과 동적 `import()` 호출에서 모듈 지정자에서 파일 확장자나 `/index.js` 접미사를 생략할 수 없습니다. 그러나 `require` 호출에서는 가능합니다. 이 module resolution는 `--module node16`에 의해 시행되는 [모듈 형식 감지 규칙](#module-format-detection)에 의해 필요한 경우 해당 제한을 이해하고 강제합니다. (`node16` 및 `nodenext`의 경우, `module`과 `moduleResolution`은 함께 작동합니다: 다른 하나를 설정하면 지원되지 않는 동작을 하고, 미래에는 오류가 될 수 있습니다.)
- [**`nodenext`**](/docs/handbook/modules/reference.html#node16-nodenext-1): 현재 `node16`과 동일하며, 이는 `--module nodenext`의 짝이 되는 모드이며, 해당 `module` 설정과 함께 기본으로 설정됩니다. 이것은 새로운 Node.js module resolution 기능이 추가될 때까지 볼 수 있는 전망적인 모드입니다.
- [**`bundler`**](/docs/handbook/modules/reference.html#bundler): Node.js v12에서는 npm 패키지를 가져오기 위한 새로운 module resolution 기능을 도입했는데, `package.json`의 `"exports"` 및 `"imports"` 필드입니다. 이러한 기능을 많은 번들러가 채택했지만, ESM import에 대한 엄격한 규칙은 채택하지 않았습니다. 이 module resolution는 번들러를 대상으로하는 코드의 기본 알고리즘을 제공합니다. 기본적으로` package.json`의 `"exports"` 및 `"imports"`를 지원하지만 무시할 수도 있습니다. 이것은 `module`을 `esnext`로 설정해야 합니다.

### Typescript는 호스트의 Module Resolution을 모방하면서도 타입정보를 추가하여 작동한다.

타입스크립트의 모듈에 대한 [일](#typescripts-job-concerning-modules)을 할때 중요한 세가지 구성요소를 떠올려봅시다.

1. 파일을 유효한 **출력 모듈 형식**으로 컴파일한다.
2. **결과 코드**에서 **import가 성공적으로 되는지** 확인한다.
3. **import한 이름**에 어떤 **타입**을 할당할지 알아낸다.

Module Resolution은 마지막 두개를 수행하는데에 필요합니다.
그러나 대부분의 시간을 입력 코드를 작업하는데에 쓰기때문에 우리는 (2)에 대해 잊기가 쉽습니다.
즉 module Resolution의 구성 요소는 입력파일과 동일한 모듈 식별자를 포함하는 결과 코드에서의 import 또는 require 호출이 실제로 실행되는지를 확인하는 것입니다.
다음의 예제를 살펴봅시다.

```ts
// @Filename: math.ts
export function add(a: number, b: number) {
  return a + b;
}

// @Filename: main.ts
import { add } from './math';
add(1, 2);
```

위코드에서 `"./math"`로부터의 import 문을 볼 때, 다음과 같이 생각하기가 쉽습니다.
"컴파일러는 이 경로(확장자 없는)를 따라가서 `add`함수에 타입을 할당하는구나."

<img src="./diagrams/theory.md-1.svg" width="400" alt="A simple flowchart diagram. A file (rectangle node) main.ts resolves (labeled arrow) through module specifier './math' to another file math.ts." />

![](https://i.imgur.com/LMZgdr8.png)

이게 완전히 틀렸다고는 말할 수 없지만, 실제로는 좀 더 복잡합니다. 하지만 `"./math"`의 module Resolution은 (그리고 `add`의 타입)은 트랜스파일링된 파일에서 런타임에서 실제로 발생하는 상황을 반영해야 합니다. 이 과정을 좀 더 자세히 살펴봅시다.

![A flowchart diagram with two groups of files: Input files and Output files. main.ts (an input file) maps to output file main.js, which resolves through the module specifier "./math" to math.js (another output file), which maps back to the input file math.ts.](./diagrams/theory.md-2.svg)

이 모델은 TypeScript에게 두가지를 알려줍니다. 첫째는 module resolution은 주로 트랜스파일링된 파일 간의 호스트의 module resolution 알고리즘을 정확하게 모델링하는 것이며, 두번째는 타입 정보를 찾기 위해 약간의 리매핑이 적용된다는 점을 명확하게 보여줍니다. 이제는 단순한 모델을 통해서는 이해하기 어려운 또 다른 예제를 살펴봅시다.

```ts
// @moduleResolution: node16
// @rootDir: src
// @outDir: dist

// @Filename: src/math.mts
export function add(a: number, b: number) {
  return a + b;
}

// @Filename: src/main.mts
import { add } from './math.mjs';
add(1, 2);
```

Node.js의 ESM `import` 선언은 파일 확장자를 포함해야 하는 엄격한 모듈 해결 알고리즘을 사용합니다. 입력 파일에 대해서만 생각할 때, `"./math.mjs"`가 `math.mts`로 해석되는 것은 약간 이상합니다. 왜냐하면 `outDir`을 사용하여 컴파일된 출력을 다른 디렉토리에 넣었기 때문에 `math.mjs`는 `main.mts` 옆에 실제로 존재하지 않거든요! 왜 이게 해결되어야 할까요? 새로운 모델을 살펴봅시다.

![A flowchart diagram with identical structure to the one above. There are two groups of files: Input files and Output files. src/main.mts (an input file) maps to output file dist/main.mjs, which resolves through module specifier "./math.mjs" to dist/math.mjs (another output file), which maps back to input file src/math.mts.](./diagrams/theory.md-3.svg)

이 모델을 이해한다고 해서 입력 파일에서 출력 파일 확장자를 보는 것의 이상함이 즉시 사라지지는 않을 수 있습니다. 이건 약간의 지름길같은 느낌으로 생각하는 편이 이해하기 좋습니다. 즉, `"./math.mjs"`는 입력 파일 `math.mts`를 뜻합니다. 출력 확장자를 작성해야 하지만 컴파일러는 `.mjs`를 작성할 때 .`mts`를 찾을 수 있다는 것을 알고 있습니다. 이는 컴파일러 내부에서 동작하는 방식이나, TypeScript의 module resolution이 위에서 본 것처럼 방식으로 작동하는 이유를 설명하기도 합니다. 출력 파일의 모듈 식별자가 입력 파일의 모듈 식별자와 [동일](#module-specifiers-are-not-transformed)하기 때문에 출력 파일을 유효하게 검증하고 type을 할당하는 데 사용할 수 있는 것입니다.

### declaration file의 역할

이전 예제에서 입력 및 출력 파일 간의 "재매핑"이 module Resolution에서 작동하는 것을 보았습니다. 그러나 라이브러리 코드를 가져올 때는 어떻게 될까요? 라이브러리가 TypeScript로 작성되었더라도 원본 소스 코드를 배포하지 않았을 수 있습니다. 라이브러리의 JavaScript 파일을 TypeScript 파일로 다시 변환할 수 없기에, import가 런타임에서 작동하는지 확인할 수 는 있겠지만, 타입을 할당하고 체크할 수는 없을 것입니다. 어떻게 타입을 할당하고, 체크하는 것일까요?

여기서 선언 파일(`.d.ts`, `.d.mts` 등)이 중요한 역할을 합니다. 선언 파일이 어떻게 해석되는지 이해하는 가장 좋은 방법은 선언 파일이 어디에서 오는지 이해하는 것입니다. 입력 파일에서 `tsc --declaration`을 실행하면 하나의 출력 JavaScript 파일과 하나의 declaration 파일이 생성됩니다.

<img src="./diagrams/declaration-files.svg" width="400" style="background-color: white; border-radius: 8px;" alt="A diagram showing the relationship between different file types. A .ts file (top) has two arrows labeled 'generates' flowing to a .js file (bottom left) and a .d.ts file (bottom right). Another arrow labeled 'implies' points from the .d.ts file to the .js file." />

이러한 관계 때문에 컴파일러는 declaration 파일을 볼 때마다 declaration 파일의 타입 정보로 완벽하게 설명되는 대응하는 JavaScript 파일이 있다고 가정합니다. 성능상의 이유로 모든 module resolution 모드에서 컴파일러는 항상 TypeScript와 declaration 파일을 먼저 찾고, 하나를 찾으면 해당 JavaScript 파일을 계속 찾지 않습니다. TypeScript 입력 파일을 찾으면 컴파일 후에 JavaScript 파일이 존재하게 될 것이고, 선언 파일을 찾으면 이미 컴파일(아마도 다른 사람이 이미 컴파일한 것)이 이루어져서 선언 파일과 동시에 JavaScript 파일이 생성되었다는 것을 알기 때문입니다.

선언 파일은 컴파일러에게 JavaScript 파일이 존재한다는 사실뿐만 아니라 그 이름과 확장자도 알려줍니다.
이런식으로 말이죠.

| 선언 파일 확장자 | JavaScript 파일 확장자 | TypeScript 파일 확장자 |
| ---------------- | ---------------------- | ---------------------- |
| `.d.ts`          | `.js`                  | `.ts`                  |
| `.d.ts`          | `.js`                  | `.tsx`                 |
| `.d.mts`         | `.mjs`                 | `.mts`                 |
| `.d.cts`         | `.cjs`                 | `.cts`                 |
| `.d.*.ts`        | `.*`                   |                        |

마지막 행은 allowArbitraryExtensions 컴파일러 옵션을 사용하여 JS가 아닌 파일을 JS 객체로 가져오는 경우를 지원하기 위한 것을 나타냅니다. 예를 들어, styles.css라는 파일은 styles.d.css.ts라는 선언 파일로 표현될 수 있습니다.

> 잠깐! 많은 선언 파일은 `tsc`로 생성되지 않고 수작업으로 작성됩니다. "DefinitelyTyped이란거도 있잖아요?"라고 반문할 수도 있습니다. 이건 사실입니다. 하지만 선언 파일을 손으로 작성하거나 심지어 외부 빌드 도구의 출력을 표현하기 위해 파일을 이동/복사/이름을 변경하는 것은 위험하고 오류가 발생하기 쉬운 모험입니다. `tsc`를 사용하여 JavaScript와 선언 파일을 모두 생성하지 않는 DefinitelyTyped 기여자와 tsc를 사용하지 않는 라이브러리 작성자는 모든 JavaScript 파일에 동일한 이름과 일치하는 확장자를 가진 동일한 이름의 선언 파일이 있는지 확인해야 합니다. 이 구조에서 벗어나면 최종 사용자에게 TypeScript 오류가 발생할 수 있습니다. npm 패키지 [`@arethetypeswrong/cli`](https://www.npmjs.com/package/@arethetypeswrong/cli)는 이러한 오류가 게시되기 전에 이를 포착하고 설명하는 데 도움이 될 수 있습니다.

### 번들러, TypeScript 런타임 및 Node.js 로더에 대한 Module Resolution

지금까지 우리는 입력파일과 출력파일사이의 차이를 강조했습니다.
파일 확장자를 상대적인 모듈 지정자에 명시할 때 TypeScript는 보통 [출력 파일 확장자를 사용하게](#typescript-imitates-the-hosts-module-resolution-but-with-types) 합니다.

```ts
// @Filename: src/math.ts
export function add(a: number, b: number) {
  return a + b;
}

// @Filename: src/main.ts
import { add } from './math.ts';
//                  ^^^^^^^^^^^
// An import path can only end with a '.ts' extension when 'allowImportingTsExtensions' is enabled.
```

이 제한은 TypeScript가 확장자를 [`.js`로 변경하지 않기](#module-specifiers-are-not-transformed) 때문에 적용됩니다. 그리고 만약 결과 JS파일에 `"./math.ts"`가 있다면, 이 가져오기는 실행 중에 다른 JS 파일로 해석되지 않고, ts파일을 가져오려고 할 것입니다. TypeScript는 앞의 예시처럼 안전하지 않은(앞에서는 ts확장자를 import하는) 출력 JS 파일을 생성하는 것을 방지하려고 합니다. 하지만 만약 출력 JS 파일이 없다면 어떻게 될까요? 아래의 경우 출력 JS파일이 없을 수 있습니다.

1. 코드들을 번들링하고, 번들러가 메모리에서 TypeScript 파일을 변환하도록 구성되어 있으며, 이때 번들을 생성하기 위해 작성한 모든 import를 분석하고 처리하는경우
2. Deno나 Bun과 같은 TypeScript 런타임에서 이 코드를 직접 실행하는 경우
3. Node용 `ts-node`, `tsx` 또는 다른 변환 로더를 사용하는 경우

이러한 경우에는 `noEmit`(또는 `emitDeclarationOnly`)와 `allowImportingTsExtensions`를 활성화하여 안전하지 않은 JavaScript 파일의 생성을 비활성화하고 `.ts` 확장자로 끝나는 import에 대한 오류를 제거할수 있습니다.

`allowImportingTsExtensions`의 여부에 관계없이, 호스트에 가장 적합한 `moduleResolution` 설정을 선택하는 것은 여전히 중요합니다. 예를들어 번들러 및 Bun 런타임의 경우, 이 설정은 `bundler`입니다. 이러한 module resolver들은 Node.js에서 영감을 받았지만 Node.js의 import에 적용되는 [확장자 검색을 비활성화하는](#extension-searching-and-directory-index-files) 엄격한 ESM resolution 알고리즘을 채택하지 않았습니다. moduleResolution을 `bundler`로 변경하는 것은 이를 반영하여 `package.json` `"exports"` 지원을 활성화하고 항상 확장자 없는 import를 허용합니다. 추가 지침은 [컴파일러 옵션 선택](/docs/handbook/modules/guides/choosing-compiler-options.html) 을 참고하세요.

### 라이브러리를 위한 Module Resolution

앱을 컴파일할 때 TypeScript 프로젝트의 `moduleResolution` 옵션을 선택하는 것은 module resolution [호스트](#module-resolution-is-host-defined)가 누구인지에 따라 결정됩니다. 그러나 라이브러리를 컴파일할 때는 결과 코드가 어디에서 실행될지는 알 수 없지만, 어찌됐던 최대한 많은 곳에서 실행되기를 원합니다. 따라서 `"module": "nodenext"` (암시적으로 [`"moduleResolution": "nodenext"`](/docs/handbook/modules/reference.html#node16-nodenext)가 함께 포함됨)를 사용하는 것이 출력 JavaScript의 모듈 스펙터의 호환성을 극대화하는 가장 좋은 방법입니다. 왜냐하면 이렇게 하면 Node.js의 더 엄격한 import module resolution 규칙을 준수하도록 강제되기 때문입니다.
예를 들어, 라이브러리가 `"moduleResolution": "bundler"` (또는 더 나쁜 경우 `"node10"`)로 컴파일되면 어떻게 될지 살펴봅시다.

```ts
export * from './utils';
```

만약 `./utils.ts` (또는 `./utils/index.ts`)가 존재한다면, 번들러가 해결할 것이므로, `"moduleResolution": "bundler"`는 에러를 발생시키지 않습니다.
하지만 `"module": "esnext"`로 컴파일된 경우, 이 export 문에 대한 JavaScript 결과물은 typescript파일의 내용과 정확히 동일합니다. 만약 이 JavaScript가 npm에 배포된다면, 번들러를 사용하는 프로젝트에서는 사용할 수 있겠지만, Node.js에서 실행될 때는 아래와 같이 에러가 발생하게 될 것입니다.

```
Error [ERR_MODULE_NOT_FOUND]: Cannot find module '.../node_modules/dependency/utils' imported from .../node_modules/dependency/index.js Did you mean to import ./utils.js?
```

반면에, 만약 이렇게 작성했다면

```js
export * from './utils.js';
```

Node.js와 번들러에서 모두 작동하는 JS결과물이 만들어집니다.

간단히 말해서, `"moduleResolution": "bundler"`는 번들러에서만 작동하는 코드를 생성할 수 있게 해주는 것입니다. 마찬가지로, `"moduleResolution": "nodenext"`는 출력이 Node.js에서 작동하는지만 확인합니다.
하지만 대부분의 경우, Node.js에서 작동하는 모듈 코드는 다른 런타임 및 번들러에서도 작동합니다.
물론, 이 가이드는 라이브러리가 `tsc`로부터 출력을 제공하는 경우에만 적용됩니다. 라이브러리가 번들링되기 전에 제공되는 경우, `"moduleResolution": "bundler"`는 허용될 수 있습니다. 라이브러리의 최종 빌드를 생성하기 위해 모듈 형식이나 모듈 식별자를 변경하는 모든 빌드 도구는 제품의 모듈 코드의 안전성과 호환성을 보장하는 책임을 져야 하며, `tsc`는 런타임에서 어떤 모듈 코드가 존재할지 알 수 없기 때문에 이 작업에 기여할 수 없습니다.
