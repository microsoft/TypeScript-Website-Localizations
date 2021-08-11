// 명목적 타입 시스템은 각 타입이 고유하고,
// 타입이 같은 데이터를 가지고 있어도
// 타입 간에 할당할 수 없는 것을 의미합니다.

// TypeScript의 타입 시스템은 구조적이어서,
// 타입이 오리 같은 형태를 갖췄다면 오리라고 할 수 있습니다.
// 거위가 오리처럼 같은 속성을 모두 가졌다면 이 역시 오리라고 할 수 있습니다.
// 여기서 더 자세히 배우실 수 있습니다: example:structural-typing

// 문제점이 있을 수 있는데,
// 예를 들어 문자열 또는 숫자는 특별한 컨텍스트를 갖고 있고
// 값을 넘겨줄 수 있게 하고 싶지 않은 경우가 있습니다.
// 예시:
//
// -  사용자 입력 문자열 (유효하지 않은)
// -  변환 문자열
// -  사용자 식별 숫자
// -  액세스 토큰

// 코드를 조금 추가하여,
// 명목적 타입 시스템에서 대부분의 값을 가져올 수 있습니다.

// 일반 문자열을 ValidatedInputString에
// 할당할 수 없게 하는 __brand(관습입니다)라는
// 프로퍼티 형식의 고유 제약으로
// 교차하는 타입을 사용할 것입니다.

type ValidatedInputString = string & { __brand: "User Input Post Validation" };

// 문자열을 ValidatedInputString로 변환하기 위해
// 함수를 사용하지만,
// 주목할 점은 TypeScript에게 참이라고 _알려주는 것_ 입니다.

const validateUserInput = (input: string) => {
  const simpleValidatedInput = input.replace(/\</g, "≤");
  return simpleValidatedInput as ValidatedInputString;
};

// 이제 일반 문자열 타입이 아닌 새로운 명목적 타입만
// 허용하는 함수를 만들 수 있습니다.

const printName = (name: ValidatedInputString) => {
  console.log(name);
};

// 예를 들어, 유효하지 않은 사용자의 입력값이 있으며
// 검사기를 거치고 나면 출력해줍니다:

const input = "\n<script>alert('bobby tables')</script>";
const validatedInput = validateUserInput(input);
printName(validatedInput);

// 반면에, 유효하지 않은 문자열을
// printName에 전달하면 컴파일러 오류가 발생합니다:

printName(input);

// 400개의 댓글이 있는 Github 이슈에서
// 명목적 타입을 만드는 다른 방법과 장단점에 대한
// 종합적인 개요를 읽어볼 수 있습니다:
//
// https://github.com/Microsoft/TypeScript/issues/202
//
// 그리고 훌륭한 요약 글이 있습니다:
//
// https://michalzalecki.com/nominal-typing-in-typescript/
