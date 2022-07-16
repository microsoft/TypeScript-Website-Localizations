//// {  "order": 0}

// 클래스는 생성자를 이용해서 생성되는
// JavaScript 오브젝트의 특별한 타입입니다.
// 클래스는 오브젝트와 아주 흡사하게 동작하며
// Java/C#/Swift 같은 언어와 비슷한 상속 구조를 가집니다.

// 클래스 예시:

class Vendor {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  greet() {
    return "Hello, welcome to " + this.name;
  }
}

// 인스턴스는 new 키워드를 이용해서 생성할 수 있으며
// 메서드를 호출하고
// 오브젝트의 프로퍼티에 접근할 수 있습니다.

const shop = new Vendor("Ye Olde Shop");
console.log(shop.greet());

// 오브젝트를 하위 클래스로 만들 수 있습니다.
// 이름뿐만 아니라 다양한 음식을 가진 카트:

class FoodTruck extends Vendor {
  cuisine: string;

  constructor(name: string, cuisine: string) {
    super(name);
    this.cuisine = cuisine;
  }

  greet() {
    return "Hi, welcome to food truck " + this.name + ". We serve " + this.cuisine + " food.";
  }
}

// 새로운 FoodTruck을 생성하기 위하여
// 매개변수가 2개 필요하다고 작성했기 때문에
// TypeScript는 매개변수를 하나만 사용할 경우, 에러를 표시합니다:

const nameOnlyTruck = new FoodTruck("Salome's Adobo");

// 매개변수 2개를 정확하게 전달하면
// FoodTruck의 새로운 인스턴스를 생성할 수 있습니다:

const truck = new FoodTruck("Dave's Doritos", "junk");
console.log(truck.greet());
