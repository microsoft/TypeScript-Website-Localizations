---
title: What is a tsconfig.json
layout: docs
permalink: /ko/docs/handbook/tsconfig-json.html
oneline: Learn about how a TSConfig works
translatable: true
---

## 개요 (Overview)

디렉토리에 `tsconfig.json` 파일이 있다면 해당 디렉토리가 TypeScript 프로젝트의 루트가 됩니다.  
`tsconfig.json` 파일은 프로젝트를 컴파일하는 데 필요한 루트 파일과 컴파일러 옵션을 지정합니다.

JavaScript 프로젝트는 `jsconfig.json` 파일을 대신 사용할 수 있습니다. 이 파일은 `tsconfig.json` 파일과 거의 동일하게 동작하지만, 몇몇 JavaScript 관련 컴파일러 플래그가 기본으로 활성화되어 있습니다.

프로젝트는 다음 방법들로 컴파일됩니다:

## `tsconfig.json` 또는 `jsconfig.json` 사용하기 (Using `tsconfig.json` or `jsconfig.json`)

* 입력 파일 없이 `tsc`를 호출하면 컴파일러는 현재 디렉토리에서부터 시작하여 상위 디렉토리 체인으로 `tsconfig.json` 파일을 검색합니다.
* 입력 파일이 없이 `tsc`와 `tsconfig.json` 파일이 포함된 디렉토리 경로 또는 설정이 포함된 유효한 경로의 `.json` 파일 경로를 지정하는  `--project` (또는 `-p`) 커맨드 라인 옵션을 사용할 수 있습니다.

커맨드 라인에 입력 파일을 지정하면 `tsconfig.json` 파일이 무시됩니다.

## 예제 (Examples)

`tsconfig.json` 예제 파일들:

* `"files"` 속성 사용하기

  ```json tsconfig
  {
    "compilerOptions": {
      "module": "commonjs",
      "noImplicitAny": true,
      "removeComments": true,
      "preserveConstEnums": true,
      "sourceMap": true
    },
    "files": [
      "core.ts",
      "sys.ts",
      "types.ts",
      "scanner.ts",
      "parser.ts",
      "utilities.ts",
      "binder.ts",
      "checker.ts",
      "emitter.ts",
      "program.ts",
      "commandLineParser.ts",
      "tsc.ts",
      "diagnosticInformationMap.generated.ts"
    ]
  }
  ```

* `"include"` 와 `"exclude"` 속성 사용하기

  ```json  tsconfig
  {
    "compilerOptions": {
      "module": "system",
      "noImplicitAny": true,
      "removeComments": true,
      "preserveConstEnums": true,
      "outFile": "../../built/local/tsc.js",
      "sourceMap": true
    },
    "include": ["src/**/*"],
    "exclude": ["node_modules", "**/*.spec.ts"]
  }
  ```

## TSConfig Bases

Depending on the JavaScript runtime environment which you intend to run your code in, there may be a base configuration which you can use at [github.com/tsconfig/bases](https://github.com/tsconfig/bases/).
These are `tsconfig.json` files which your project extends from which simplifies your `tsconfig.json` by handling the runtime support.

For example, if you were writing a project which uses Node.js version 12 and above, then you could use the npm module [`@tsconfig/node12`](https://www.npmjs.com/package/@tsconfig/node12):

```json tsconfig
{
  "extends": "@tsconfig/node12/tsconfig.json",

  "compilerOptions": {
    "preserveConstEnums": true
  },

  "include": ["src/**/*"],
  "exclude": ["node_modules", "**/*.spec.ts"]
}
```

This lets your `tsconfig.json` focus on the unique choices for your project, and not all of the runtime mechanics. There are a few tsconfig bases already, and we're hoping the community can add more for different environments.

- [Recommended](https://www.npmjs.com/package/@tsconfig/recommended)
- [Node 10](https://www.npmjs.com/package/@tsconfig/node10)
- [Node 12](https://www.npmjs.com/package/@tsconfig/node12)
- [Node 14](https://www.npmjs.com/package/@tsconfig/node14)
- [Deno](https://www.npmjs.com/package/@tsconfig/deno)
- [React Native](https://www.npmjs.com/package/@tsconfig/react-native)
- [Svelte](https://www.npmjs.com/package/@tsconfig/svelte)

## 상세 설명 (Details)

`"compilerOptions"` 속성은 생략될 수 있으며 생략하면 컴파일러의 기본 값이 사용됩니다. 지원되는 전체 목록은 [컴파일러 옵션](/docs/handbook/compiler-options.html)를 참고하세요.

## TSConfig 레퍼런스

TSConfig 레퍼런스를 보려면 [여기](/tsconfig)로 이동하세요.

## 스키마 (Schema)

`tsconfig.json` 스키마는 [http://json.schemastore.org/tsconfig](http://json.schemastore.org/tsconfig)에서 찾을 수 있습니다.
