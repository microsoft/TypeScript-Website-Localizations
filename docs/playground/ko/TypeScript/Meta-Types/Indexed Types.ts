// 타입을 복제하는 자신을 발견할 때가 있습니다.
// 일반적인 예시는 자동으로 생성된
// API 응답의 중첩된 자원입니다.

interface ArtworkSearchResponse {
  artists: {
    name: string;
    artworks: {
      name: string;
      deathdate: string | null;
      bio: string;
    }[];
  }[];
}

// 이 인터페이스가 수작업으로 만들어졌다면
// artworks를 인터페이스로 가져오는 것을 상상하기 쉽습니다:

interface Artwork {
  name: string;
  deathdate: string | null;
  bio: string;
}

// 그러나, 이 경우엔 API를 제어하지 않고
// 인터페이스를 수작업으로 만들었다면
// 응답을 변경할 때 ArtworkSearchResponse의 artworks 부분과
// Artwork가 동기화되지 않을 수 있습니다.

// 이에 대한 해결책은 JavaScript가 문자열을 통해
// 프로퍼티에 접근하는 방법을 복제하는 색인 된 타입입니다.

type InferredArtwork = ArtworkSearchResponse["artists"][0]["artworks"][0];

// InferredArtwork는 타입의 프로퍼티를 찾아보고
// 색인한 하위집합에
// 새로운 이름을 지어서 생성됩니다.
