// TypeScript는 구조적 타입 시스템입니다.
// 구조적 타입 시스템은 타입을 비교할 때,
// TypeScript는 타입의 멤버만 고려한다는 것을 의미합니다.

// 두 가지 타입을 만들 수 있지만,
// 서로 할당할 수 없는 명목적 타입 시스템과는 대조적입니다.
// example:nominal-typing 를 참고하세요.

// 예를 들어, 구조적 타입 시스템에서
// 이러한 두 가지 인터페이스는 서로 양도할 수 있습니다.

interface Ball {
  diameter: number;
}
interface Sphere {
  diameter: number;
}

let ball: Ball = { diameter: 10 };
let sphere: Sphere = { diameter: 20 };

sphere = ball;
ball = sphere;

// Ball과 Sphere의 모든 멤버를
// 구조적으로 포함하는 타입을 추가하면,
// ball이나 sphere가 되도록 설정할 수도 있습니다.

interface Tube {
  diameter: number;
  length: number;
}

let tube: Tube = { diameter: 12, length: 3 };

tube = ball;
ball = tube;

// ball은 length를 갖고 있지 않아서, tube 변수에 할당할 수 없습니다.
// 하지만, Ball의 모든 멤버는
// tube 내부에 속하니 할당할 수 있습니다.

// TypeScript는 타입의 각 멤버를
// 서로 비교하여 동등한지 확인합니다.

// 함수는 JavaScript에서 객체이며
// 비슷한 방식으로 비교합니다.
// 매개변수에 유용한 추가 트릭이 하나 있습니다:

let createBall = (diameter: number) => ({ diameter });
let createSphere = (diameter: number, useInches: boolean) => {
  return { diameter: useInches ? diameter * 0.39 : diameter };
};

createSphere = createBall;
createBall = createSphere;

// TypeScript는 매개변수의 (숫자)는 (숫자, 불린)과 같다고 하지만,
// (숫자, 불린)은 (숫자)와 같다고 하지 않습니다

// JavaScript 코드가 필요 없어 졌을 때
// 매개변수 전달을 생략하는 게 아주 흔한 일이라서
// TypeScript는 첫 번째 할당에 있는 불린을 버립니다.

// 예를 들어 배열의 forEach의 콜백은 세 가지 매개변수를 갖고 있는데
// 값, 인덱스, 전체 배열입니다.
// TypeScript가 매개변수 버리기를 제공하지 않았다면,
// 함수와 일치시키기 위해 모든 선택 사항을 포함했어야 합니다:

[createBall(1), createBall(2)].forEach((ball, _index, _balls) => {
  console.log(ball);
});

// 아무도 필요로 하지 않습니다.

// 반환 타입은 객체처럼 간주하고,
// 일부 차이점은 위의 같은 객체 비교 규칙으로 비교합니다.

let createRedBall = (diameter: number) => ({ diameter, color: "red" });

createBall = createRedBall;
createRedBall = createBall;

// 첫 번째 할당은 동작하지만 (둘 다 diameter가 있음),
// 두 번째는 동작하지 않습니다. (ball은 color가 없음)
