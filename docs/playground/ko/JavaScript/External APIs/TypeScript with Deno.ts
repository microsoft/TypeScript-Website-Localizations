//// { order: 3 }

// Deno는 보안에 중점을 둔 v8 기반의
// 진행중인 JavaScript와 TypeScript 런타임입니다.

// https://deno.land

// Deno는 JavaScript가 파일시스템 또는 네트워크 접근을 줄여주는
// 샌드박스 기반의 권한 시스템을 가지고 있고,
// 로컬에 내려받고 캐시 되는 불러오기에 기반을 둔 http 사용합니다.

// 스크립트하기 위해 deno를 사용하는 예시가 있습니다:

import compose from "https://deno.land/x/denofun/lib/compose.ts";

function greet(name: string) {
  return `Hello, ${name}!`;
}

function makeLoud(x: string) {
  return x.toUpperCase();
}

const greetLoudly = compose(makeLoud, greet);

// "HELLO, WORLD!." 출력
greetLoudly("world");

import concat from "https://deno.land/x/denofun/lib/concat.ts";

// "helloworld" 반환
concat("hello", "world");
