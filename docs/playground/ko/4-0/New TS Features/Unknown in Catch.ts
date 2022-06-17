//// { "compiler": { "ts": "4.0.2" } }

// JavaScript는 모든 값을 던질 수 있기 때문에
// TypeScript는 오류 타입 선언을 지원하지 않습니다.

try {
  // ..
} catch (e) {}

// 이것은 catch 절의 `e`가 기본적으로 any 타입인 것을 의미합니다.
// 이것은 임의의 속성에 접근할 수 있는 자유를 허용합니다.
// 4.0에서는 `any`와 `unknown`을 모두 허용하도록 catch절의
// 타입 할당 제한을 완화했습니다.

// any와 동일한 동작:
try {
  // ..
} catch (e) {
  e.stack
}

// unknown을 사용한 명시적 동작:

try {
  // ..
} catch (e: unknown) {
  // 타입 시스템이 `e`가 무엇인지 알기 전에 사용할 수 없습니다.
  // 자세한 내용은 다음을 참조하세요:
  // example:unknown-and-never
  e.stack

  if (e instanceof SyntaxError) {
    e.stack
  }
}
