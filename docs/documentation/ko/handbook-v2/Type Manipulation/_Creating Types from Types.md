---
title: Creating Types from Types
layout: docs
permalink: /ko/docs/handbook/2/types-from-types.html
oneline: "An overview of the ways in which you can create more types from existing types."
---

TypeScript의 타입 시스템은 _다른 타입들의 측면에서_ 타입들을 표현할 수 있기에 매우 강력합니다.

이 발상의 가장 단순한 형태는 제네릭입니다. 추가로 다양한 종류의 _타입 연산자들_ 을 사용할 수 있습니다. 또한 이미 알고 있는 _값(values)_ 의 관점에서 타입들을 표현 가능합니다.

다양한 타입 연산자들을 결합함으로써 복잡한 연산과 값을 간결하고 유지 관리하기 쉬운 방식으로 표현할 수 있습니다. 이 섹션에서는 기존 타입 또는 값으로 새 타입을 표현하는 방법을 다룹니다.

- [Generics](/docs/handbook/2/generics.html) - 매개변수를 취하는 타입
- [Keyof Type Operator](/docs/handbook/2/keyof-types.html) - 새로운 타입을 생성하기 위해 `keyof` 연산자 사용하기
- [Typeof Type Operator](/docs/handbook/2/typeof-types.html) - 새로운 타입을 생성하기 위해 `typeof` 연산자 사용하기
- [Indexed Access Types](/docs/handbook/2/indexed-access-types.html) - 타입의 부분집합에 접근하기 위해 `Type['a']` 문법 사용하기
- [Conditional Types](/docs/handbook/2/conditional-types.html) - 타입 시스템에서 if문처럼 동작하는 타입
- [Mapped Types](/docs/handbook/2/mapped-types.html) - 이미 존재하는 타입의 각 프로퍼티들을 매핑한 타입 생성하기
- [Template Literal Types](/docs/handbook/2/template-literal-types.html) - 템플릿 리터럴 문자열을 이용해서 매핑된 타입들의 프로퍼티 바꾸기
