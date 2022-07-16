//// {  "order": 3,  "isJavaScript": true}

// 기본적으로 TypeScript는 JavaScript 내부에서 오류 메시지를 제공하지 않습니다.
// 대신에 도구는 에디터를 위해
// 다양한 지원을 제공하는 것에 집중합니다.

// 하지만, 오류를 활성화하는 것은 매우 쉽습니다.
// 일반적인 JS 파일에서, TypeScript 에러 메시지를 활성화하기 위해
// 요구되는 모든 것은 다음의 주석을 추가하는 것입니다:

// @ts-check

let myString = "123";
myString = {};

// 이것은 JS 파일 내에 많은 빨간 물결선을 추가하기 시작할 수도 있습니다.
// JavaScript 안에서 계속 작업하는 동안,
// 이런 오류를 고치기 위한 몇 개의 도구가 있습니다.

// 코드 변경이 생기지 않는다고 생각하는 몇몇 더 까다로운 오류의 경우,
// TypeScript에 무슨 타입이 되어야 하는지 알려주기 위해
// JSDoc 어노테이션을 사용할 수 있습니다:

/** @type {string | {}} */
let myStringOrObject = "123";
myStringOrObject = {};

// 여기에서 더 자세히 읽어볼 수 있습니다: example:jsdoc-support

// TypeScript 에 다음 오류를 무시하도록 하여
// 오류를 중요하지 않다고 선언할 수 있습니다:

let myIgnoredError = "123";
// @ts-ignore
myStringOrObject = {};

// 여러분의 JavaScript를 변경하기 위하여
// 코드 흐름을 통해 타입 추론을 사용할 수 있습니다: example:code-flow
