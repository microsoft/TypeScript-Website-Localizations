---
display: "Out Dir"
oneline: "Specify an output folder for all emitted files."
---

만일 지정하면, `.js` (이 외에도 `.d.ts`, `.js.map`, 등.) 파일이 지정한 디렉토리로 배출됩니다.
원본 파일의 디렉터리 구조는 보존됩니다; 계산된 루트가 예상과 다를 경우 [rootDir](#rootDir) 을 보세요.

만일 지정하지 않으면, `.js` 파일은 `.ts` 파일이 생성된 곳과 동일한 디렉토리에 방출됩니다:

```sh
$ tsc

example
├── index.js
└── index.ts
```

다음과 같이 `tsconfig.json` 을 작성할 경우:

```json tsconfig
{
  "compilerOptions": {
    "outDir": "dist"
  }
}
```

이러한 설정으로 `tsc`를 실행하면 파일이 지정한 `dist` 폴더로 이동합니다:

```sh
$ tsc

example
├── dist
│   └── index.js
├── index.ts
└── tsconfig.json
```
