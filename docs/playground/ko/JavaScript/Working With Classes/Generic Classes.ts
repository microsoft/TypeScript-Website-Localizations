//// {  "order": 3}

// 먼저 이 방식으로 이해하는 게 훨씬 쉬우므로
// 예시는 대부분 TypeScript로 작성했습니다.
// 마지막에는 JSDoc을 사용하여 동일한 클래스를 만드는 방법을 다룰 겁니다.

// 제네릭 클래스는 특정 타입이 다른 타입에 따라 동작한다는 것을 보여주는 하나의 방식입니다.
// 예를 들어, 여기에는 한 종류만 있지만
// 여러 가지 물건을 담을 수 있는 하나의 서랍이 있습니다:

class Drawer<ClothingType> {
  contents: ClothingType[] = [];

  add(object: ClothingType) {
    this.contents.push(object);
  }

  remove() {
    return this.contents.pop();
  }
}

// Drawer를 사용하기 위해서
// 또 다른 타입이 필요합니다:

interface Sock {
  color: string;
}

interface TShirt {
  size: "s" | "m" | "l";
}

// 새로운 Drawer를 만들 때 Sock 타입을 전달하여
// 양말 전용의 새로운 Drawer를 만들 수 있습니다:
const sockDrawer = new Drawer<Sock>();

// 이제 양말을 서랍에 추가하거나 삭제할 수 있습니다:
sockDrawer.add({ color: "white" });
const mySock = sockDrawer.remove();

// 티셔츠를 위한 서랍도 만들 수 있습니다:
const tshirtDrawer = new Drawer<TShirt>();
tshirtDrawer.add({ size: "m" });

// 여러분이 조금 별나신 편이라면,
// 유니언을 사용하여 양말과 티셔츠가 섞인 서랍을 만들 수도 있습니다

const mixedDrawer = new Drawer<Sock | TShirt>();

// 추가 TypeScript 구문 없이 Drawer와 같은 클래스를 만드는 것은
// JSDoc에서 템플릿 태그 사용을 요구합니다.
// 이 예시에서 템플릿 변수를 정의하고,
// 클래스에 프로퍼티를 제공할 것입니다:

// playground에서 작업하기 위해서,
// JavaScript 파일로 설정을 변경하고
// 위에 있는 TypeScript 코드를 제거해야 합니다

/**
 * @template {{}} ClothingType
 */
class Dresser {
  constructor() {
    /** @type {ClothingType[]} */
    this.contents = [];
  }

  /** @param {ClothingType} object */
  add(object) {
    this.contents.push(object);
  }

  /** @return {ClothingType} */
  remove() {
    return this.contents.pop();
  }
}

// 그러고 나서 JSDoc을 통해 새로운 타입을 만듭니다:

/**
 * @typedef {Object} Coat 의류 아이템
 * @property {string} color 코트 색상
 */

// Dresser 클래스의 새로운 인스턴스를 생성할 때
// 코트를 다루는 Dresser로
// 변수를 할당하기 위해 @type을 사용합니다.

/** @type {Dresser<Coat>} */
const coatDresser = new Dresser();

coatDresser.add({ color: "green" });
const coat = coatDresser.remove();
