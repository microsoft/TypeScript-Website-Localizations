---
display: "Out File"
oneline: "Specify a file that bundles all outputs into one JavaScript file. If `declaration` is true, also designates a file that bundles all .d.ts output."
---

만일 지정하면, 모든 _전역_ (비모듈) 파일이 지정된 단일 출력 파일에 연결됩니다.

만일 `module` 이 `system` 또는 `amd` 일 경우, 모든 모듈 파일도 모든 전역 컨텐츠 뒤에 이 파일에 연결됩니다.

참고: `outFile` 은 `module` 이 `None` 이거나, `System`, `AMD` 가 아니면 _사용할 수 없습니다_.
이 옵션은 bundle CommonJS 또는 ES6 모듈에 사용할 수 _없습니다_.
