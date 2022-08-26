//// {  "compiler": {},  "order": 1}

// JavaScript의 유연성 때문에,
// 가정을 검증하기 위해서 코드에 런타임 검사를 추가하는 것이 좋습니다.

// 일반적으로 단언(또는 불변)이라고 불리며
// 변수가 예상한 것과 일치하지 않을 때
// 초기에 에러를 발생시키는 작은 기능입니다.

// Node는 이 기능을 즉시 사용할 수 있는 함수를 가지고 있으며,
// assert라고 불리며 import 없이 사용할 수 있습니다.

// 우리는 스스로 정의할 것입니다.
// value가 true라고 하는 
// 표현식을 단언하는 함수를 선언합니다:
declare function assert(value: unknown): asserts value;

// 이제 enum의 타입이 유효한지 검사하기 위해 assert를 사용합니다
declare const maybeStringOrNumber: string | number;
assert(typeof maybeStringOrNumber === "string");

// TypeScript 3.7에서, 코드 흐름 분석은
// 코드가 무엇인지 알아내기 위해
// 이런 함수의 종류를 사용할 수 있습니다.
// 아래의 변수를 호버해보면 - 하나의 문자열 또는 숫자에서
// 하나의 문자열로 좁혀진 것을 확인할 수 있습니다.

maybeStringOrNumber;

// 추론된 코드 전체에 있는 타입을 보장하기 위해
// 단언 함수를 사용할 수 있습니다.
// 예를 들어 TypeScript는 위에 assert 선언을 통해
// 파라미터에 타입을 추가할 필요 없이
// 함수가 숫자를 반환한다는 것을 알고 있습니다.

function multiply(x: any, y: any) {
  assert(typeof x === "number");
  assert(typeof y === "number");

  return x * y;
}

// 단언 함수는 타입 가드와 형제입니다
// 예시: 타입 가드는 함수를 통해 제어 흐름이 계속 동작할 때,
// 제어 흐름에 영향을 준다는 것을 제외합니다.

// 예를 들어, enum을 좁히기 위해
// 단언 함수를 사용할 수 있습니다:

declare const oneOfFirstFiveNumbers: 1 | 2 | 3 | 4 | 5;

declare function isOdd(param: unknown): asserts param is 1 | 3 | 5;
declare function isBelowFour(param: unknown): asserts param is 1 | 2 | 3 | 4;

// enum을 다음과 같이 줄여야 합니다: 1 | 3 | 5

isOdd(oneOfFirstFiveNumbers);
oneOfFirstFiveNumbers;

// 그리고 enum의 가능한 상태를 다음과 같이 줄입니다: 1 | 3

isBelowFour(oneOfFirstFiveNumbers);
oneOfFirstFiveNumbers;

// TypeScript 3.7에서 단언 함수의 기능 중 일부 입문서입니다
// - 릴리스 노트를 읽어보면
// 더 많은 것을 알아낼 수 있습니다:
//
// https://devblogs.microsoft.com/typescript/announcing-typescript-3-7/
