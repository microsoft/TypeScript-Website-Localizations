// 새로운 Playground와 함께라면 우리는 코드를
// 동작하게 할 수 있는 환경의 더 많은 권한을 가지게 됩니다.
// 새로운 Playground는 이제 monaco-editor와
// monaco-typescript가 느슨하게 결합된 편집 경험을 제공할 것입니다.

// https://github.com/microsoft/monaco-editor
// https://github.com/microsoft/monaco-typescript

// 여기서 느슨한 결합이란 Playground가
// 유저에게 monaco-typescript가 통합한 수많은 버전의
// Typrscript build 중 고를 수 있게 하는 것 입니다.

// 우리는 monaco-editor와
// moncao-typescript의 복사본을 만들 수 있는 인프라가 있습니다.
// 그말인 즉슨 우리는 이제 다음과 같은 내용들을 지원합니다:

// - TypeScript 베타 버전
// - TypeScript의 야간 빌드
// - TypeScript Pull Request 버전
// - 이전 버전의 TypeScript

// via https://github.com/orta/make-monaco-builds

// 새로운 Playground가 다른 버전들의
// Typescript와 지원할 수 있는 기본 설계는
// 아래의 사이트로부터 파생되었습니다:

// https://github.com/agentcooper/typescript-play