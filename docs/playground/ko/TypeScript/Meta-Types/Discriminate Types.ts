// 식별된 타입 유니언은
// 잠재적인 객체의 집합을 하나의 특별한 객체로 줄이기 위해
// 코드 흐름 분석을 사용하는 것입니다.
//
// 이 패턴은
// 다른 문자열 또는 숫자 상수를 가진
// 비슷한 객체 집합에 대해 잘 동작합니다
// 예: 이벤트로 지어진 목록, 또는 버전이 매겨진 객체의 집합

type TimingEvent = { name: "start"; userStarted: boolean } | { name: "closed"; duration: number };

// 이벤트가 이 함수에 들어왔을 때,
// 두 가지 잠재적인 타입 중의 하나가 될 수 있습니다.

const handleEvent = (event: TimingEvent) => {
  // event.name에 비교하는 swtich문을 사용하여
  // TypeScript의 코드 흐름 분석은
  // 객체가 유니언 중 하나의 타입에 의해서만 표현될 수 있다는 것을 알아낼 수 있습니다.

  switch (event.name) {
    case "start":
      // 이름이 "start"인
      // TimingEvent 내부의 유일한 타입이기 때문에
      // userStarted에 안전하게 접근할 수 있다는 것을 의미합니다.
      const initiatedByUser = event.userStarted;
      break;

    case "closed":
      const timespan = event.duration;
      break;
  }
};

// 이 패턴은 식별자로써 사용할 수 있는
// 숫자와 같습니다.

// 이 예제에서,
// 식별된 유니언과 처리해야 하는 추가 오류 상태가 있습니다.

type APIResponses = { version: 0; msg: string } | { version: 1; message: string; status: number } | { error: string };

const handleResponse = (response: APIResponses) => {
  // 오류 케이스를 처리하고 반환하세요
  if ("error" in response) {
    console.error(response.error);
    return;
  }

  // 이제 TypeScript는 APIResponse가
  // 오류 타입이 될 수 없다는 사실을 알고 있습니다.
  // 오류가 있었다면, 함수는 반환했을 것입니다.
  // 아래의 response에 호버하여 확인해볼 수 있습니다.

  if (response.version === 0) {
    console.log(response.msg);
  } else if (response.version === 1) {
    console.log(response.status, response.message);
  }
};

// 유니언의 모든 부분이 확인되었다는 것을 보장할 수 있으니
// if문 대신에 switch문을 사용하는 것이 더 낫습니다.
// 핸드북에 never 타입을 사용하는
// 좋은 패턴이 있습니다: 

// https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
