//// {  "order": 1,  "compiler": {    "strict": false  }}

// JavaScript 오브젝트는
// 이름이 있는 키로 래핑된 값의 모음입니다.

const userAccount = {
  name: "Kieron",
  id: 0,
};

// 이런 오브젝트를 더 크고, 더 복잡한
// 데이터 모델로 만들기 위해 합칠 수 있습니다.

const pie = {
  type: "Apple",
};

const purchaseOrder = {
  owner: userAccount,
  item: pie,
};

// 단어 몇 개를 마우스로 호버해보면 (purchaseOrder 위에 호버해보세요),
// TypeScript가 JavaScript를 이름표가 붙은 타입으로
// 어떻게 해석하는지 확인할 수 있습니다. 

// 값은 "."를 통해 구매 주문에 대한 사용자 이름에
// 접근할 수 있습니다:
console.log(purchaseOrder.item.type);

// () 사이에 있는 코드의 각 부분에 마우스로 호버해보면,
// TypeScript가 각 부분에 대해 더 많은 정보를 제공하는 것을 확인할 수 있습니다.
// 아래에 다시 작성해보세요:

// 문자별로 다음 줄에 이것을 복사해보세요:
//
//   purchaseOrder.item.type

// TypeScript는 이 파일에서 사용 가능한 JavaScript 오브젝트에 대한 피드백을
// playground에 제공하며, 오타를 방지할 수 있게 해주고
// 다른 곳에서 찾아볼 필요 없이
// 추가 정보를 제공해줍니다.

// TypeScript는 배열에도 동일한 기능을 제공합니다.
// 여기에 구매 주문만 포함된 배열이 있습니다.

const allOrders = [purchaseOrder];

// allOrders에 호버해보면,
// 호버 정보가 []로 끝나기 때문에 배열이라는 것을 알 수 있습니다.
// 인덱스(0부터 시작하는)와 함께 대괄호를 사용함으로써
// 첫 번째 순서에 접근할 수 있습니다.

const firstOrder = allOrders[0];
console.log(firstOrder.item.type);

// 오브젝트를 얻기 위한 다른 방법은
// 오브젝트를 제거하기 위해 배열을 꺼내오는 것입니다.
// 이렇게 하면 배열에서 오브젝트를 제거하고, 반환합니다.
// 내부의 기존 데이터를 변경하므로
// 배열을 변형한다고 불립니다.

const poppedFirstOrder = allOrders.pop();

// 이제 allOrders는 비어 있습니다.
// 데이터를 변형하는 것은 여러모로 유용할 수 있습니다만,
// 코드베이스의 복잡성을 줄이는 한 가지 방법은 변형을 방지하는 것입니다.
// 대신에 TypeScript는 읽기 전용으로 배열을 선언하는 방법을 제공합니다:

// 구매 주문 형태를 기반으로 하는 타입을 생성합니다:
type PurchaseOrder = typeof purchaseOrder;

// 구매 주문의 읽기 전용 배열을 생성합니다
const readonlyOrders: readonly PurchaseOrder[] = [purchaseOrder];

// 맞아요! 확실히 코드가 좀 많습니다.
// 여기에 4가지 새로운 것이 있습니다:
//
//  type PurchaseOrder - TypeScript에 새로운 타입을 선언합니다.
//
//  typeof - 다음에 전달되는 상수 기반의 타입을 설정하기 위해
//           타입 추론 시스템을 사용합니다.
//
//  purchaseOrder - 변수 purchaseOrder를 얻고
//                  이것이 주문 배열에 있는 모든 오브젝트의 형태라고
//                  TypeScript에 알려줍니다.
//
//  readonly - 이 오브젝트는 변형을 지원하지 않으며,
//             한 번 생성되면 배열의 내용이
//             항상 동일하게 유지됩니다.
//
// 이제 readonlyOrders에서 pop을 시도하면,
// TypeScript는 오류를 발생시킵니다.

readonlyOrders.pop();

// 거의 모든 곳에서 readonly을 사용할 수 있으며,
// 여기저기에 약간의 추가 문법이 있지만,
// 많은 추가 안전성을 제공합니다.

// readonly에 대해 더 많이 알아볼 수 있습니다:
//  - https://www.typescriptlang.org/docs/handbook/interfaces.html#readonly-properties
//  - https://basarat.gitbooks.io/typescript/content/docs/types/readonly.html

// 그리고 함수 예시에서
// JavaScript와 TypeScript에 대해 계속 배울 수 있습니다:
// example:functions
//
// 또는 불변성에 대해 더 알고 싶다면:
// example:immutability
