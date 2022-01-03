//// { compiler: { ts: "4.0.2" } }
// 가변 튜플은 제네릭이 동작하는 방식처럼 타입을 타입 검사기에 전달하기 위해
// 나머지 연산자(...)를 처리하는 기능을 튜플에게 제공합니다.

// 꽤 고급 주제라서 이해하기 어렵더라도 너무 걱정하지 마세요.
// example:generic-functions 그리고 example:tuples를 기반으로 합니다.

// 먼저 튜플 앞에 항상 숫자를 붙이는
// 항상 앞에 붙이는 가변 튜플이 있습니다:

type AddMax<T extends unknown[]> = [max: number,  ...rest: T];
//          ^ T를 제한하기 위해 사용한 제네릭
//                                                ^ 어디에 병합하는지 나타내기 위해 사용한 ...

// 합성할 때 사용 할 수 있습니다:
type MaxMin = AddMax<[min: number]>
type MaxMinDiameter = AddMax<[min: number, diameter: number]>

// 튜플 이후에도 똑같이 사용 할 수 있습니다:
type SuffixDIContext<T extends unknown[]> = [...first: T, context: any];
type DIContainer = SuffixDIContext<[param: string]>

// 이 메커니즘은 여러 개의 입력 매개변수와 합칠 수 있습니다.
// 예를 들어, 이 함수는 두 개의 배열을 병합하지만
// 배열이 시작, 중단하는 곳을 나타내기 위해 '\0' 기호를 사용합니다.
function joinWithNullTerminators<T extends unknown[], U extends unknown[]>(t: [...T], u: [...U]) {
    return ['\0', ...t, '\0', ...u, '\0'] as const;
}

// TypeScript는 다음과 같이 함수의 반환 타입을 추론할 수 있습니다:
const result = joinWithNullTerminators(['variadic', 'types'], ["terminators", 3]);

// 이런 도구를 사용하여 함수형 프로그래밍에서 잘 적용된 개념인
// curry 함수처럼 올바르게 입력 할 수 있습니다:

function curry<T extends unknown[], U extends unknown[], R>(f: (...args: [...T, ...U]) => R, ...a: T) {
    return (...b: U) => f(...a, ...b);
}

// 세 가지 제네릭 인수가 있습니다:
// - T: curry 함수에 입력 배열인 매개변수
// - U: curry 함수에 _전달되지 않고_ 반환 함수에 적용하기 위해 필요한 매개변수
// - R: 함수에 전달한 반환 타입

const sum = (left: number, right: number,) => left + right

const a = curry(sum, 1, 2)
const b = curry(sum, 1)(2)
const c = curry(sum)(1, 2)

// 여기에서 더 많은 코드 예시와 함께 더 상세한 설명을 찾아볼 수 있습니다
// https://github.com/microsoft/TypeScript/pull/39094
 
