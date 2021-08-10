---
display: "No Resolve"
oneline: "Disallow `import`s, `require`s or `<reference>`s from expanding the number of files TypeScript should add to a project."
---

기본적으로 TypeScript는 `import` 및 `<reference` 지시문에 대한 초기 파일 세트를 검사하고 이러한 확인된 파일을 프로그램에 추가합니다.

`noResolve`가 설정되어 있으면 이 프로세스가 발생하지 않습니다.
그러나, `import`문은 여전히 유효한 모듈인지 확인하기 위해 검사되므로, 다른 방법으로 이것이 충족되는지 확인해야 합니다.
