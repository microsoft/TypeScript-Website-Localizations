// 타입 가드는 코드를 통해 코드 흐름 분석에 영향을 주는 용어입니다.
// TypeScript는 런타임에서 객체가 유효한지 판단하는 
// 기존의 JavaScript 동작을 이용해서 코드 흐름에 영향을 줄 수 있습니다.
// 이 예시는 여러분이 다음 예제를 읽어봤다고 가정하겠습니다:code-flow

// 예시를 실행해보기 위해 어떤 클래스를 생성해볼 것입니다.
// 여기에 인터넷 또는 전화 주문을 다루는 시스템이 있습니다.

interface Order {
  address: string;
}
interface TelephoneOrder extends Order {
  callerNumber: string;
}
interface InternetOrder extends Order {
  email: string;
}

// 두 개의 Order 서브 타입 또는 undefined가 될 수 있는 타입이 있습니다
type PossibleOrders = TelephoneOrder | InternetOrder | undefined;

// PossibleOrder를 반환하는 함수가 있습니다
declare function getOrder(): PossibleOrders;
const possibleOrder = getOrder();

// 특정 키가 유니언을 좁히기 위한 객체에 있는지 확인하는
// "in" 연산자를 사용할 수 있습니다.
// ("in"은 객체 키를 검사하기 위한 JavaScript 연산자입니다.)

if ("email" in possibleOrder) {
  const mustBeInternetOrder = possibleOrder;
}

// 인터페이스를 따르는 클래스가 있는 경우
// JavaScript "instanceof" 연산자를 사용할 수 있습니다:

class TelephoneOrderClass {
  address: string;
  callerNumber: string;
}

if (possibleOrder instanceof TelephoneOrderClass) {
  const mustBeTelephoneOrder = possibleOrder;
}

// 유니언을 좁을 좁히기 위해
// JavaScript "typeof" 연산자를 사용할 수 있습니다.
// JavaScript 내의 기본형(문자열, 객체, 숫자 같은)만 동작합니다.

if (typeof possibleOrder === "undefined") {
  const definitelyNotAnOder = possibleOrder;
}

// 여기에서 typeof가 가능한 값의 전체 리스트를
// 확인할 수 있습니다: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/typeof

// JavaScript 연산자를 사용하는 것은 여러분을 여기까지만 도달할 수 있게 만듭니다.
// 자체 객체 타입을 검사하고 싶다면,
// 타입 서술어 함수를 사용할 수 있습니다.

// 타입 서술어 함수는
// 함수가 true를 반환할 때 반환 타입이 코드 흐름 분석에
// 정보를 제공하는 함수입니다.

// possible order를 사용하면서, possibleOrder가 어느 타입인지 선언하기 위해서
// 두 가지 타입 가드를 사용할 수 있습니다:

function isAnInternetOrder(order: PossibleOrders): order is InternetOrder {
  return order && "email" in order;
}

function isATelephoneOrder(order: PossibleOrders): order is TelephoneOrder {
  return order && "calledNumber" in order;
}

// 이제 if문 내부에서 타입이 어떤 possibleOrder인지 좁히기 위해
// if문 안에서 이러한 함수들을 사용할 수 있습니다:

if (isAnInternetOrder(possibleOrder)) {
  console.log("Order received via email:", possibleOrder.email);
}

if (isATelephoneOrder(possibleOrder)) {
  console.log("Order received via phone:", possibleOrder.callerNumber);
}

// 여기에서 코드 흐름 분석에 대해 더 읽어볼 수 있습니다:
//
//  - example:code-flow
//  - example:type-guards
//  - example:discriminate-types
