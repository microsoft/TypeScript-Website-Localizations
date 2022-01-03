//// { "compiler": { "ts": "3.8.3" } }
// 이전 버전의 TypeScript에서
// 검사기는 유니언의 선언되지 않은 필드가
// 색인된 타입과 동일한지 확인하지 않았습니다.

// 여기에서 색인된 타입에 관해 배워볼 수 있습니다: example:indexed-types

// 예를 들어, 아래에 있는 IdentifierCache는
// 객체에 있는 키가 숫자임을 보여줍니다:

type IdentifierCache = { [key: string]: number };

// 'file_a'가 문자열 값을 가지고 있어서
// 실패를 의미합니다

const cacheWithString: IdentifierCache = { file_a: "12343" };

// 그러나, 유니언에 넣을 때는
// 유효성 검사가 실행되지 않았습니다:

let userCache: IdentifierCache | { index: number };
userCache = { file_one: 5, file_two: "abc" };

// 이 부분은 고쳐졌고,
// 컴파일러에서 'file_two'에 관한 오류가 발생합니다.

// 키가 다른 타입일 때도 고려합니다
// 예를 들어: ([key: string] 그리고 [key: number])

type IdentifierResponseCache = { [key: number]: number };

let resultCache: IdentifierCache | IdentifierResponseCache;
resultCache = { file_one: "abc" };
