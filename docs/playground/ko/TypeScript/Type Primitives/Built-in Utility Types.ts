//// {  "order": 3,  "compiler": {    "strictNullChecks": true  }}

// 대부분 코드에서 특정한 타입이 유용하다고 느낄 때,
// TypeScript에 추가해서
// 누구나 사용할 수 있게 하여
// 가용성을 지속해서 의존할 수 있습니다

// Partial<Type>

// 타입을 갖고 모든 프로퍼티를
// 선택적 프로퍼티로 변환하세요.

interface Sticker {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  submitter: undefined | string;
}

type StickerUpdateParam = Partial<Sticker>;

// Readonly<Type>

// 객체를 갖고 읽기 전용 프로퍼티를 만드세요.

type StickerFromAPI = Readonly<Sticker>;

// Record<KeysFrom, Type>

// KeysFrom의 프로퍼티 리스트를 사용하는 타입을 만들고
// Type의 값을 전달하세요.

// 키로 사용할 리스트:
type NavigationPages = "home" | "stickers" | "about" | "contact";

// 각각의 ^에 대한 데이터의 형태가 필요합니다:
interface PageInfo {
  title: string;
  url: string;
  axTitle?: string;
}

const navigationInfo: Record<NavigationPages, PageInfo> = {
  home: { title: "Home", url: "/" },
  about: { title: "About", url: "/about" },
  contact: { title: "Contact", url: "/contact" },
  stickers: { title: "Stickers", url: "/stickers/all" },
};

// Pick<Type, Keys>

// Type에서 Keys 프로퍼티 집합을 선택하여 타입을 만드세요.
// 기본적으로 타입에서
// 타입 정보를 추출하기 위한 허용 목록입니다.

type StickerSortPreview = Pick<Sticker, "name" | "updatedAt">;

// Omit<Type, Keys>

// Type에서 Keys 프로퍼티 집합을 제거하여 타입을 만드세요.
// 기본적으로 타입에서
// 타입 정보를 추출하기 위한 차단 목록입니다.

type StickerTimeMetadata = Omit<Sticker, "name">;

// Exclude<Type, RemoveUnion>

// RemoveUnion과 겹치지 않는
// Type 프로퍼티의 모든 프로퍼티 타입을 만드세요.

type HomeNavigationPages = Exclude<NavigationPages, "home">;

// Extract<Type, MatchUnion>

// MatchUnion하고 겹칠 때 포함되는
// Type 프로퍼티의 모든 프로퍼티 타입을 만드세요.

type DynamicPages = Extract<NavigationPages, "home" | "stickers">;

// NonNullable<Type>

// 프로퍼티 집합에서 null과 undefined를 제외하여 타입을 만드세요.
// 유효성 검사를 할 때 유용합니다.

type StickerLookupResult = Sticker | undefined | null;
type ValidatedResult = NonNullable<StickerLookupResult>;

// ReturnType<Type>

// Type에서 반환 값을 추출하세요.

declare function getStickerByID(id: number): Promise<StickerLookupResult>;
type StickerResponse = ReturnType<typeof getStickerByID>;

// InstanceType<Type>

// 클래스의 인스턴스 또는
// 생성자 함수를 가진 객체인 타입을 만드세요.

class StickerCollection {
  stickers: Sticker[];
}

type CollectionItem = InstanceType<typeof StickerCollection>;

// Required<Type>

// 모든 선택적 프로퍼티를
// 필수적인 프로퍼티로 변환하는 타입을 만드세요.

type AccessiblePageInfo = Required<PageInfo>;

// ThisType<Type>

// 다른 타입과 다르게, ThisType은 새로운 타입을 반환하지 않는 대신에
// 함수의 내부 this의 정의를 조작합니다.
// TSConfig에서 noImplicitThis를 실행시켰을 때
// ThisType만 사용할 수 있습니다.

// https://www.typescriptlang.org/docs/handbook/utility-types.html
