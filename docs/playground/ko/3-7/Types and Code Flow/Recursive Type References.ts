//// { "compiler": {  }, "order": 2 }

// 타입 vs 인터페이스 사용하기 중에 선택하는 것은
// 각 기능의 제약에 관한 것입니다.
// 3.7에서, 인터페이스가 아닌 타입에 있는 제약 중 한 가지를 제거했습니다.

// example:types-vs-interfaces에서 더 많은 내용을 찾아보실 수 있습니다

// 타입 자체적으로 내부에서 정의하는
// 타입을 참조할 수 없었습니다.
// 인터페이스 내부에 존재하지 않는 한계였었고,
// 약간의 작업으로 해결할 수 있었습니다.

// 예를 들어, 3.6에서 이건 가능하지 않습니다:
type ValueOrArray<T> = T | Array<ValueOrArray<T>>;

// 타입을 인터페이스와 혼합한 구현은
// 이렇게 보일 것입니다.
type ValueOrArray2<T> = T | ArrayOfValueOrArray<T>;
interface ArrayOfValueOrArray<T> extends Array<ValueOrArray2<T>> { }

// 자신을 참조하여 동작하는 JSON의
// 종합적인 정의를 허용합니다.

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

const exampleStatusJSON: Json = {
  available: true,
  username: "Jean-loup",
  room: {
    name: "Highcrest",
    // 함수를 Json 타입에 추가할 수 없습니다
    // update: () => {}
  },
};

// 3.7 베타 배포 노트와 PR에서 더 많이 배울 수 있습니다:
//
// https://devblogs.microsoft.com/typescript/announcing-typescript-3-7/
// https://github.com/microsoft/TypeScript/pull/33050
