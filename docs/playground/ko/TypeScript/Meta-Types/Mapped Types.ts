// 매핑된 타입은 다른 타입을 기반으로 새로운 타입을 만드는 방법입니다.
// 또한 효과적으로 타입을 변환할 수 있습니다.

// 매핑된 타입을 사용하는 일반적인 케이스는
// 기존 타입의 부분적인 하위집합을 다루는 것입니다.
// 예를 들어 다음 API는 Artist를 반환할 수 있습니다:

interface Artist {
  id: number;
  name: string;
  bio: string;
}

// 그러나, Artist의 하위집합만 변경하는 API에
// 수정사항을 보냈었다면
// 일반적으로 추가 타입을 만들어야만 했습니다:

interface ArtistForEdit {
  id: number;
  name?: string;
  bio?: string;
}

// 위에 Artist와 같지 않을 수도 있습니다.
// 매핑된 타입으로 기존 타입에서
// 변화를 만들어 낼 수 있습니다.

type MyPartialType<Type> = {
  // 모든 기존 프로퍼티에 대해서
  // Type의 타입 내부는 ?: 버전으로 변환합니다
  [Property in keyof Type]?: Type[Property];
};

// 이제 edit 인터페이스를 만드는 대신에
// 매핑된 타입을 사용할 수 있습니다:
type MappedArtistForEdit = MyPartialType<Artist>;

// 완벽에 가깝지만,
// id가 절대 발생하면 안되는 null이 될 수 있게 해줍니다.
// 그래서 교집합 타입을 사용하여 빠르게 하나를 개선해 봅시다.
// (예시를 살펴보세요:union-and-intersection-types)

type MyPartialTypeForEdit<Type> = {
  [Property in keyof Type]?: Type[Property];
} & { id: number };

// 매핑된 타입의 부분적인 결과를 가지며
// id: number set를 가진 객체와 병합합니다.
// 효과적으로 id를 강제로 타입 안에 넣어줍니다.

type CorrectMappedArtistForEdit = MyPartialTypeForEdit<Artist>;

// 매핑된 타입이 어떻게 동작하는지에 대한
// 매우 간단한 예시입니다만, 기초 대부분을 다룹니다.
// 더 깊게 살펴보고 싶다면, 핸드북을 참고하세요:
//
// https://www.typescriptlang.org/docs/handbook/advanced-types.html#mapped-types
