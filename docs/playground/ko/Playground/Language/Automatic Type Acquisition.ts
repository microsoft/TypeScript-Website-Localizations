// 자동 타입 취득은 TypeScript가 npm 내부에 있는
// @types에서 타입 정의를 가져와 JavaScript 사용자에게
// 더 나은 사용자 경험을 제공하기 위한 방법을 의미하는 용어입니다.

// 이제 playground는 TypeScript에 내장된
// 타입 취득 처리와 비슷한(약간 더 제한적이지만)
// 버전이 있습니다.

// 코드에 import를 만들어서 사용할 수 있습니다.
// 자동 타입 취득은 DefinitelyTyped에서 @types를 통하거나
// 자체적으로 의존성 내부에 있는 d.ts 파일을 이용하여 동작합니다.

import { danger } from "danger";

// 내장된 타입에서 연관된 JSDoc을 보기 위해
// 아래의 식별자를 강조하세요:

danger.github;

// 이건 연속적으로 변화하는 의존성도 처리하므로
// 이 경우 danger는 @octokit/rest에도 의존합니다.

danger.github.api.pulls.createComment();

// 타입 취득은 노드의 내장된 모듈도 고려하며
// 그런 의존성을 사용할 때
// 노드의 타입 선언을 가져옵니다.
// 다운로드 할 타입이 많이 있으니
// 다른 것보다 약간 더 오래 걸리는 경향이 있다는 것을 알아두세요!

import { readFileSync } from "fs";

const inputPath = "my/path/file.ts";
readFileSync(inputPath, "utf8");
