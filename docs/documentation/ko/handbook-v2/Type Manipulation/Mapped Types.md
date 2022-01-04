---
title: Mapped Types
layout: docs
permalink: /ko/docs/handbook/2/mapped-types.html
oneline: "이미 존재하는 타입을 재사용해서 타입을 생성하기"
---

중복을 피하기 위해서 다른 타입을 바탕으로 새로운 타입을 생성할 수 있습니다.

매핑된 타입은 이전에 선언하지 않았던 프로퍼티의 타입을 선언할 수 있는 인덱스 시그니처 문법로 구성됩니다.

```ts twoslash
type Horse = {};
// ---cut---
type OnlyBoolsAndHorses = {
  [key: string]: boolean | Horse;
};

const conforms: OnlyBoolsAndHorses = {
  del: true,
  rodney: false,
};
```

매핑된 타입은 `PropertyKey`([`keyof`을 통해서](/docs/handbook/2/indexed-access-types.html) 자주 생성되는)의 조합을 사용하여 키를 통해 타입을 반복적으로 생성하는 제너릭 타입입니다.

```ts twoslash
type OptionsFlags<Type> = {
  [Property in keyof Type]: boolean;
};
```

다음 예제에서, `OptionsFlags`는 `Type` 타입의 모든 프로퍼티를 가져와서 해당 값을 불린으로 변경합니다.

```ts twoslash
type OptionsFlags<Type> = {
  [Property in keyof Type]: boolean;
};
// ---cut---
type FeatureFlags = {
  darkMode: () => void;
  newUserProfile: () => void;
};

type FeatureOptions = OptionsFlags<FeatureFlags>;
//   ^?
```

### Mapping Modifiers

매핑중에는 추가할 수 있는 수정자로 `readonly`와 `?` 있습니다. 각각 가변성과 선택성에 영향을 미칩니다.

`-` 또는 `+`를 접두사로 붙여서 이런 수정자를 추가하거나 제거할 수 있습니다. 접두사를 추가하지 않으면 `+`로 간주합니다.

```ts twoslash
// 타입의 프로퍼티에서 'readonly' 속성을 제거합니다
type CreateMutable<Type> = {
  -readonly [Property in keyof Type]: Type[Property];
};

type LockedAccount = {
  readonly id: string;
  readonly name: string;
};

type UnlockedAccount = CreateMutable<LockedAccount>;
//   ^?
```

```ts twoslash
// 타입의 프로퍼티에서 'optional' 속성을 제거합니다
type Concrete<Type> = {
  [Property in keyof Type]-?: Type[Property];
};

type MaybeUser = {
  id: string;
  name?: string;
  age?: number;
};

type User = Concrete<MaybeUser>;
//   ^?
```

## Key Remapping via `as`

TypeScript 4.1 이상에서는 매핑된 타입에 `as` 절을 사용해서 매핑된 타입의 키를 다시 매핑할 수 있습니다.

```ts
type MappedTypeWithNewProperties<Type> = {
    [Properties in keyof Type as NewKeyType]: Type[Properties]
}
```

[템플릿 리터럴 타입](/docs/handbook/2/template-literal-types.html)과 같은 기능을 활용해서 이전 프로퍼티에서 새로운 프로퍼티 이름을 만들 수 있습니다.

```ts twoslash
type Getters<Type> = {
    [Property in keyof Type as `get${Capitalize<string & Property>}`]: () => Type[Property]
};

interface Person {
    name: string;
    age: number;
    location: string;
}

type LazyPerson = Getters<Person>;
//   ^?
```

조건부 타입을 통해 `never`를 생성해서 키를 필터링할 수 있습니다.

```ts twoslash
// 'kind' 프로퍼티를 제거합니다
type RemoveKindField<Type> = {
    [Property in keyof Type as Exclude<Property, "kind">]: Type[Property]
};

interface Circle {
    kind: "circle";
    radius: number;
}

type KindlessCircle = RemoveKindField<Circle>;
//   ^?
```

`string | number | symbol` 의 조합뿐만 아니라 모든 타입의 조합을 임의로 매핑할 수 있습니다.

```ts twoslash
type EventConfig<Events extends { kind: string }> = {
    [E in Events as E["kind"]]: (event: E) => void;
}

type SquareEvent = { kind: "square", x: number, y: number };
type CircleEvent = { kind: "circle", radius: number };

type Config = EventConfig<SquareEvent | CircleEvent>
//   ^?
```

### Further Exploration

매핑된 타입은 타입 조작 섹션의 다른 기능들과 잘 동작합니다. 예를 들어 객체의 `pii` 프로퍼티가 `true`로 설정되어 있는지에 따라 `true` 혹은 `false`를 반환하는 [조건부 타입을 사용한 매핑된 타입](/docs/handbook/2/conditional-types.html)이 있습니다.

```ts twoslash
type ExtractPII<Type> = {
  [Property in keyof Type]: Type[Property] extends { pii: true } ? true : false;
};

type DBFields = {
  id: { format: "incrementing" };
  name: { type: string; pii: true };
};

type ObjectsNeedingGDPRDeletion = ExtractPII<DBFields>;
//   ^?
```
