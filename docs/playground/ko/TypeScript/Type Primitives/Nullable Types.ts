//// {  "order": 3,  "compiler": {    "strictNullChecks": false  }}

// JavaScript는 존재하지 않는 값을 선언하는 두 가지 방법을 갖고 있으며,
// TypeScript는 어떤 대상을 선택적 또는 null 허용으로 선언하기 위해
// 더 많은 방법도 가능하게 하는 추가 구문을 추가합니다.

// 먼저, 두 가지 JavaScript 기본형의
// 차이점입니다: undefined와 null

// undefined는 어떤 대상을 찾지 못했거나 설정되지 않은 경우입니다

const emptyObj = {};
const anUndefinedProperty: undefined = emptyObj["anything"];

// null은 의도적으로
// 값이 없다고 할 때 사용합니다.

const searchResults = {
  video: { name: "LEGO Movie" },
  text: null,
  audio: { name: "LEGO Movie Soundtrack" },
};

// 왜 undefined를 사용하지 않을까요?
// 주로, text가 올바르게 포함됐는지 확인할 수 있기 때문입니다.
// text를 undefined로 반환하면
// 결과는 존재하지 않았던 것과 동일합니다.

// 약간 표면적으로 느껴질 수 있지만,
// JSON 문자열로 변환했을 때 text가 undefined라면,
// 다른 문자열과 동등하게 포함되지 않을 수 있습니다.

// 엄격한 Null 타입

// TypeScript 2.0 이전에는 undefined와 null이 타입 시스템에서 사실상 무시됐었습니다.
// 엄격한 Null 타입은 TypeScript가 타입화 되지 않은
// JavaScript에 더 가까운 코딩 환경을 제공해줍니다.

// 2.0 버전은 "strictNullChecks"라고 불리는 컴파일러 플래그를 추가했고
// 이 플래그는 사람들이 undefined와 null을
// 코드 흐름 분석을 통해 다뤄줘야 하는 타입으로 취급하도록 요구했습니다.
// ( 예시:code-flow에서 더 살펴볼 수 있습니다 )

// TypeScript에 정적 null 검사가 동작하는 차이점의 예시는,
// 아래 "Potential String"를 호버해보세요:

type PotentialString = string | undefined | null;

// PotentialString은 undefined와 null을 버립니다.
// 설정으로 올라가서 strict 모드를 동작시키고 돌아온 뒤,
// PotentialString 위에 호버하면
// 이제 전체 유니언이 표시되는 것을 볼 수 있습니다.

declare function getID(): PotentialString;

const userID = getID();
console.log("User Logged in: ", userID.toUpperCase());

// strict 모드에서만 위 코드는 실패합니다 ^

// 타입 단언 또는 null이 아닌 단언 연산자(!)와 같은 것을 이용하여
// TypeScript에 여러분이 더 많이 알고 있다고 알려주는 방법이 있습니다

const definitelyString1 = getID() as string;
const definitelyString2 = getID()!;

// 또는 if를 사용하여 존재 여부를 안전하게 검사할 수 있습니다:

if (userID) {
  console.log(userID);
}

// 선택적 프로퍼티

// Void

// Void는 값을 반환하지 않는
// 함수의 반환 타입입니다.

const voidFunction = () => {};
const resultOfVoidFunction = voidFunction();

// 이건 보통 실수이며,
// TypeScript는 컴파일러 오류를 얻도록 void 타입을 유지합니다
// - 런타임 중에 정의되지 않더라도 해당됩니다.
