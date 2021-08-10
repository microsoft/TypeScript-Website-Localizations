// 유니언 타입은 객체가 하나 이상의
// 타입이 될 수 있도록 선언하는 방법입니다.

type StringOrNumber = string | number;
type ProcessStates = "open" | "closed";
type OddNumbersUnderTen = 1 | 3 | 5 | 7 | 9;
type AMessyUnion = "hello" | 156 | { error: true };

// "open"과 "closed"을 문자열과 대비하여 사용하는 것이 새롭게 느껴지신다면,
// 다음을 확인해보세요: example:literals

// 하나의 유니언에 서로 다른 타입을 혼합할 수 있으며,
// 여기서 중요한 점은 값은 그 타입 중 하나라는 것입니다.

// TypeScript는 실행 중에 어떤 값이 될 수 있는지
// 결정하는 방법을 알아낼 것입니다.

// 예를 들어, 유니언은 가끔 타입을
// 여러 개 사용함으로써 기존 의도와 달라질 수 있습니다:

type WindowStates = "open" | "closed" | "minimized" | string;

// 위에를 호버해보면, WindowStates가 유니언 타입이 아닌
// string 타입으로 되는 것을 확인할 수 있습니다.
// 이에 대한 내용은 예시:type-widening-and-narrowing에서 다룹니다.

// 유니언이 OR이면, 교집합은 AND입니다.
// 교집합 타입은 새로운 타입을 생성하기 위해 두 개의 타입이 교차하는 경우입니다.
// 이를 통해 타입 구성이 가능합니다.

interface ErrorHandling {
  success: boolean;
  error?: { message: string };
}

interface ArtworksData {
  artworks: { title: string }[];
}

interface ArtistsData {
  artists: { name: string }[];
}

// 이런 인터페이스는 일관된 오류 핸들링과
// 자체 데이터 모두를 갖는 응답으로 구성할 수 있습니다.

type ArtworksResponse = ArtworksData & ErrorHandling;
type ArtistsResponse = ArtistsData & ErrorHandling;

// 예를 들어:

const handleArtistsResponse = (response: ArtistsResponse) => {
  if (response.error) {
    console.error(response.error.message);
    return;
  }

  console.log(response.artists);
};

// 교집합과 유니언이 혼합된 타입은
// 객체가 두 개의 값 중 하나를 포함해야 할 때
// 정말 유용합니다:

interface CreateArtistBioBase {
  artistID: string;
  thirdParty?: boolean;
}

type CreateArtistBioRequest = CreateArtistBioBase & ({ html: string } | { markdown: string });

// 이제 artistID와 html 또는 markdown 둘 중 하나를
// 포함할 때만 요청을 생성할 수 있습니다

const workingRequest: CreateArtistBioRequest = {
  artistID: "banksy",
  markdown: "Banksy is an anonymous England-based graffiti artist...",
};

const badRequest: CreateArtistBioRequest = {
  artistID: "banksy",
};
