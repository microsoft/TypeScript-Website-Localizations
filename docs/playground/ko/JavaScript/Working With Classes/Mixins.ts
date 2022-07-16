//// {  "order": 4}

// TypeScript가 지원하는 JavaScript에 있는 클래스를 위해
// 가짜 다중 상속 패턴인 믹스인이 있습니다.
// 다중 상속 패턴은 많은 클래스가 합쳐진
// 하나의 클래스를 생성할 수 있게 해줍니다.

// 시작하기 위해, 다른 클래스로부터 확장하는 타입이 필요합니다.
// 주요 책임은 전달받은 타입이
// 하나의 클래스라고 선언하는 것입니다.

type Constructor = new (...args: any[]) => {};

// 그러고 나서 래핑하여 최종 클래스에 확장하는
// 클래스 시리즈를 생성할 수 있습니다.
// 비슷한 객체가 다른 능력을 갖출 때, 이 패턴은 잘 동작합니다.

// 믹스인은 캡슐화된 private 프로퍼티로 변경하기 위해
// scale 프로퍼티를 getter와 setter를 함께 추가합니다:

function Scale<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    // 믹스인은 private/protected 프로퍼티를 선언할 수 없겠지만,
    // ES2020 private 필드를 사용할 수 있습니다
    _scale = 1;

    setScale(scale: number) {
      this._scale = scale;
    }

    get scale(): number {
      return this._scale;
    }
  };
}

// 믹스인은 현대식 컴퓨터가 깊이를 만드는 데 사용하는
// 알파 구성요소에 대한 추가 메서드를 추가합니다:

function Alpha<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    alpha = 1;

    setHidden() {
      this.alpha = 0;
    }

    setVisible() {
      this.alpha = 1;
    }

    setAlpha(alpha: number) {
      this.alpha = alpha;
    }
  };
}

// 확장될 간단한 스프라이트 기반 클래스:

class Sprite {
  name = "";
  x = 0;
  y = 0;

  constructor(name: string) {
    this.name = name;
  }
}

// 서로 다른 기능을 가진
// 2개의 다른 스프라이트 타입을 만듭니다:

const ModernDisplaySprite = Alpha(Scale(Sprite));
const EightBitSprite = Scale(Sprite);

// 이런 클래스의 인스턴스를 생성하는 것은
// 믹스인 때문에 객체가 서로 다른
// 프로퍼티와 메서드의 모음을 가진다는 것을 나타냅니다:

const flappySprite = new ModernDisplaySprite("Bird");
flappySprite.x = 10;
flappySprite.y = 20;
flappySprite.setVisible();
flappySprite.setScale(0.8);
console.log(flappySprite.scale);

const gameBoySprite = new EightBitSprite("L block");
gameBoySprite.setScale(0.3);

// EightBitSprite가 알파로 변경하기 위한
// 믹스인이 없으니 실패합니다:
gameBoySprite.setAlpha(0.5);

// 래핑한 클래스에 대해 더 많이 보장하길 원한다면,
// 제네릭과 함께 생성자를 사용할 수 있습니다.

type GConstructor<T = {}> = new (...args: any[]) => T;

// 이제 이 믹스인이 기반 클래스가 특정한 형태일 때만
// 적용할 수 있도록 선언할 수 있습니다.

type Moveable = GConstructor<{ setXYAcceleration: (x: number, y: number) => void }>;

// GConstructor에 대한 매개변수에 있는
// 함수 존재 여부에 따라서 믹스인을 생성할 수 있습니다.

function Jumpable<TBase extends Moveable>(Base: TBase) {
  return class extends Base {
    jump() {
      // 이 믹스인은 이제 setXYAcceleration에 대하여 알고 있습니다
      this.setXYAcceleration(0, 20);
    }
  };
}

// 믹스인 계층에 setXYAcceleration를 추가하는 클래스가 
// 존재할 때까지 이 스프라이트를 생성할 수 없습니다:
const UserSprite = new Jumpable(ModernDisplaySprite);
