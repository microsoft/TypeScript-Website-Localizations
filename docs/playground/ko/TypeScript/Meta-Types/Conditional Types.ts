// TypeScript 타입 시스템에서 조건부 타입은
// 간단한 논리를 수행하는 방법을 제공합니다.
// 확실히 고급 기능이며,
// 일상 코드에서는 사용할 필요가 없을 것입니다.

// A의 조건부 타입은 다음과 같습니다:
//
//   A extends B ? C : D
//
// 조건은 타입이 표현식을 확장하는지 여부이며,
// 만약 그렇다면 어떤 타입이 반환되어야 하는지입니다.

// 몇 개의 예시를 살펴봅시다
// 간결함을 위해 제네릭에 단일 문자를 사용할 것입니다.
// 선택 사항이지만
// 60자로 제한하면 화면에 맞추기 어렵습니다.

type Cat = { meows: true };
type Dog = { barks: true };
type Cheetah = { meows: true; fast: true };
type Wolf = { barks: true; howls: true };

// barks 하는 것에 대해서만 일치하는 타입들을 추출하도록 해주는
// 조건부 타입을 만들 수 있습니다.

type ExtractDogish<A> = A extends { barks: true } ? A : never;

// 그러고 나서 ExtractDogish가 감싸는 타입을 만들 수 있습니다:

// 고양이는 짖지 않는다고 하니, never를 반환합니다
type NeverCat = ExtractDogish<Cat>;
// 늑대는 짖는다고 하니, 늑대 형태를 반환합니다
type Wolfish = ExtractDogish<Wolf>;

// 많은 타입의 유니언을 사용하길 원하면서
// 유니언의 잠재적 선택사항의 개수를
// 줄이고 싶을 때 유용합니다:

type Animals = Cat | Dog | Cheetah | Wolf;

// ExtractDogish를 유니언 타입에 적용할 때
// 타입의 각 멤버와 비교하여
// 조건부를 실행하는 것과 같습니다:

type Dogish = ExtractDogish<Animals>;

// = ExtractDogish<Cat> | ExtractDogish<Dog> |
//   ExtractDogish<Cheetah> | ExtractDogish<Wolf>
//
// = never | Dog | never | Wolf
//
// = Dog | Wolf (예시를 살펴보세요:unknown-and-never)

// 타입이 유니언의 각 멤버에 분배하기 때문에
// 분배 조건부 타입이라고 불립니다.

// 지연된 조건부 타입

// 입력에 따라 다른 타입을 반환 할 수 있는
// 더 엄격한 API에 조건부 타입을 사용할 수 있습니다.

// 예를 들어 이 함수는 입력받은 불린에 따라
// 문자열 또는 숫자를 반환 할 수 있습니다.

declare function getID<T extends boolean>(fancy: T): T extends true ? string : number;

// 그러고 나서 타입 시스템이 얼마나 많이
// 불린에 관해서 알고 있는지에 따라 다른 반환 타입을 얻습니다:

let stringReturnValue = getID(true);
let numberReturnValue = getID(false);
let stringOrNumber = getID(Math.random() < 0.5);

// 위의 사례에서 TypeScript는 반환 값을 즉시 알 수 있습니다.
// 그러나, 타입이 아직 알려지지 않은 함수에서
// 조건부 타입을 사용 할 수 있습니다.
// 이건 지연된 조건부 타입이라고 불립니다.

// 위에 있던 Dogish와 같지만, 대신 함수입니다
declare function isCatish<T>(x: T): T extends { meows: true } ? T : undefined;

// TypeScript에게 지연할 때 타입을 추론해야 한다고
// 구체적으로 알릴 수 있는 조건부 타입 내에 추가 유용한 도구가 있는데
// 바로 'infer' 키워드입니다.

// infer는 일반적으로
// 코드에서 기존 타입을 검사하는 메타타입을 만드는 데 사용합니다
// infer를 타입 내부에서 새로운 변수를 만드는 것을 생각해 보세요.

type GetReturnValue<T> = T extends (...args: any[]) => infer R ? R : T;

// 대략적으로:
//
//  - 첫 번째 매개변수에 있는 타입을 가진
//    GetReturnValue 라는 조건부 제네릭 타입입니다.
//
//  - 조건부는 타입이 함수인지 확인하고,
//    만약 그렇다면 함수에 대한 반환 값을 기반으로 하여
//    R이라는 새로운 타입을 만듭니다
//
//  - 검사를 통과하면, 타입 값은 추론된 반환 값이고
//    아니라면 원본 타입입니다
//

type getIDReturn = GetReturnValue<typeof getID>;

// 이것은 함수인지에 대한 검사를 실패하며,
// 전달받은 타입을 반환할 수 있습니다.
type getCat = GetReturnValue<Cat>;
