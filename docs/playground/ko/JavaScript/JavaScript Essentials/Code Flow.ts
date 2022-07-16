//// {  "order": 3,  "compiler": {    "strictNullChecks": true  }}

// JavaScript 파일 내부의 코드 흐름은
// 프로그램 전반에 걸쳐 어떻게 타입에 영향을 미칠 수 있는가.

const users = [{ name: "Ahmed" }, { name: "Gemma" }, { name: "Jon" }];

// "jon"이라는 사용자를 찾을 수 있는지 살펴볼 것입니다.
const jon = users.find((u) => u.name === "jon");

// 위의 경우에, 'find'는 실패할 것입니다.
// 이런 경우에 우리는 오브젝트를 가지고 있지 않습니다. 이것은 타입을 생성합니다:
//
//   { name: string } | undefined
//
// 아래에 있는 3개의 'jon'에 마우스를 올려보면,
// 단어가 어디에 있는지에 따라서 타입이 어떻게 변하는지 볼 수 있을 것입니다:

if (jon) {
  jon;
} else {
  jon;
}

// '{ name: string } | undefined' 타입은
// 유니온 타입이라고 불리는 TypeScript 기능을 사용합니다.
// 유니온 타입은 오브젝트가 많은 것 중의 하나가 될 수 있도록 선언하는 방법입니다.
//
// 파이프는 서로 다른 타입 사이에서 구분자로서 동작합니다.
// JavaScript의 동적인 특성은
// 많은 함수가 연관되지 않은 타입의 오브젝트를 받고 반환하는 것을 의미하고,
// 우리가 어느 것을 다룰지 표현할 수 있어야 합니다.

// 이것을 몇 가지 방법으로 사용할 수 있습니다.
// 다른 타입의 값이 있는 배열을 살펴보며 시작해봅시다.

const identifiers = ["Hello", "World", 24, 19];

// 첫 번째 요소의 타입에 대하여 검사하기 위해
// JavaScript 'typeof x === y' 문법을 사용할 수 있습니다.
// 서로 다른 위치 사이에서 어떻게 변하는지
// 아래의 'randomIdentifier'에 호버하여 확인해볼 수 있습니다

const randomIdentifier = identifiers[0];
if (typeof randomIdentifier === "number") {
  randomIdentifier;
} else {
  randomIdentifier;
}

// 제어 흐름 분석은 우리가 바닐라 JavaScript를 작성할 수 있으며,
// TypeScript가 서로 다른 위치에 있는 코드 타입이
// 어떻게 변화하는지를 이해하려 한다는 것을 의미합니다.

// 제어 흐름 분석에 대해 더 배워보기:
// - example:type-guards

// 예시를 통해 계속 읽고 싶다면
// 몇 개의 다른 장소로 넘어가기:
//
// - 모던 JavaScript: example:immutability
// - 타입 가드: example:type-guards
// - JavaScript 예시가 포함된 함수형 프로그래밍:function-chaining
