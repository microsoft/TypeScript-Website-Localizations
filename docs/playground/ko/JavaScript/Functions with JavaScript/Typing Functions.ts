// TypeScript의 추론으로 제공되는 정보로도 충분합니다만,
// 함수의 형태를 문서화하는
// 다양한 방법을 제공하는 많은 방식이 있습니다.

// 우선 좋은 위치는 선택적 매개변수를 살펴보는 것입니다.
// 이는 매개변수를 생략할 수 있다는 것을 알려주는 방법입니다.

let i = 0;
const incrementIndex = (value?: number) => {
  i += value === undefined ? 1 : value;
};

// 이 함수는 다음과 같이 호출할 수 있습니다:

incrementIndex();
incrementIndex(0);
incrementIndex(3);

// 함수를 작성할 때 타입 추론을 제공하는
// 함수 매개변수를 입력할 수 있습니다.

const callbackWithIndex = (callback: (i: number) => void) => {
  callback(i);
};

// 함수 인터페이스를 임베딩하면
// 화살표 때문에 읽기 어려울 수 있습니다.
// 타입 별칭을 사용하여 함수 매개변수에 이름을 지정하게 합니다.

type NumberCallback = (i: number) => void;
const callbackWithIndex2 = (callback: NumberCallback) => {
  callback(i);
};

// 다음과 같이 호출할 수 있습니다:

callbackWithIndex(index => {
  console.log(index);
});

// 위에 있는 index에 호버하면
// TypeScript가 index를 숫자로 정확히 추론한 것을 확인해볼 수 있습니다.

// 인스턴스 참조로 함수를 전달할 때도, TypeScript 추론은 동작합니다.
// 확인하기 위해,
// number를 string으로 변경했던 함수를 사용합니다:

const numberToString = (n: number) => {
  return n.toString();
};

// 모든 number를 string으로 변환하기 위하여
// 배열에 map과 같은 함수에서 사용할 수 있으며,
// 아래에 있는 stringedNumbers에 호버해보면 예상된 타입을 확인할 수 있습니다.
const stringedNumbers = [1, 4, 6, 10].map(i => numberToString(i));

// 코드를 간소화하여, 직접 함수를 전달할 수 있고
// 더 집중된 코드로 동일한 결과를 얻을 수 있습니다:
const stringedNumbersTerse = [1, 4, 6, 10].map(numberToString);

// 많은 타입을 수용하는 함수가 있을 수도 있지만,
// 몇 개의 프로퍼티에만 관심이 있을 것입니다.
// 이것은 타입에서 색인 된 시그니처에 대한 유용한 사례입니다.
// 다음 타입은 이 함수가 프로퍼티 이름이 포함되어 있다면
// 어떠한 객체도 사용해도 괜찮다고 선언합니다:

interface AnyObjectButMustHaveName {
  name: string;
  [key: string]: any;
}

const printFormattedName = (input: AnyObjectButMustHaveName) => {};

printFormattedName({ name: "joey" });
printFormattedName({ name: "joey", age: 23 });

// index-signatures에 관해 더 배우고 싶다면
// 다음 내용을 권장합니다:
//
// https://www.typescriptlang.org/docs/handbook/interfaces.html#excess-property-checks
// https://basarat.gitbooks.io/typescript/docs/types/index-signatures.html

// tsconfig flag인 suppressExcessPropertyErrors를 통해
// 모든 곳에서 이런 종류의 동작을 또한 허용할 수 있다고
// 하지만, 여러분의 API를 사용하는 다른 사람이
// 이 설정을 해제했는지는 알 수 없습니다.

// JavaScript에 있는 함수는 다른 매개변수 모음을 허용합니다.
// 설명을 위한 두 가지 공통 패턴이 있습니다:
// 매개변수 또는 반환에 대한 유니언 타입과 함수 오버로드.

// 매개변수에 유니언 타입을 사용하는 것은
// 한 개 또는 두 개의 변경 점만 있고,
// 함수 간에 문서 변경이 필요하지 않는 경우에 의미 있습니다.

const boolOrNumberFunction = (input: boolean | number) => {};

boolOrNumberFunction(true);
boolOrNumberFunction(23);

// 반면에 함수 오버로드는 매개변수와 반환 타입에 대한
// 더 다양한 구문을 제공합니다.

interface BoolOrNumberOrStringFunction {
  /** bool 타입을 갖고, bool 타입을 반환 */
  (input: boolean): boolean;
  /** number 타입을 갖고, number 타입을 반환 */
  (input: number): number;
  /** string 타입을 갖고, bool 타입을 반환 */
  (input: string): boolean;
}

// 처음 보는 선언이라면,
// TypeScript에 이 파일의 런타임에서는 존재하지 않더라도
// 무언가 존재한다고 알려줍니다.
// 부작용과 함께 매핑된 코드는 유용하지만,
// 많은 코드가 있는 구현을 만드는 데모에 매우 유용합니다.

declare const boolOrNumberOrStringFunction: BoolOrNumberOrStringFunction;

const boolValue = boolOrNumberOrStringFunction(true);
const numberValue = boolOrNumberOrStringFunction(12);
const boolValue2 = boolOrNumberOrStringFunction("string");

// 위 값과 함수에 호버해보면
// 올바른 문서와 반환 값을 확인할 수 있습니다.

// 함수 오버로드를 사용하는 것으로도 충분합니다만,
// 입력과 반환 값의 다른 타입을 다루기 위한 다른 도구가 있으며
// 이는 제네릭입니다.

// 타입 정의에서 placeholder 변수로
// 타입을 가지는 방법을 제공합니다.

// example:generic-functions
// example:function-chaining
