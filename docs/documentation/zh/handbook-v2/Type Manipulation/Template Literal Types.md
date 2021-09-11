---
title: Template Literal Types
layout: docs
permalink: /zh/docs/handbook/2/template-literal-types.html
oneline: "通过摸板文本字符串生成变更属性的映射类型。"
---

模板文本类型基于 [字符串文本类型](/docs/handbook/2/everyday-types.html#literal-types) 创建，并且能够通过联合来扩展多个字符串。

它们和 [JavaScript 中的模版字面量字符串](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) 的语法是一样的，只是用在了做类型。
当使用具体的文本类型，模板文本通过连接内容生成新的字符串文本类型。

```ts twoslash
type World = "world";

type Greeting = `hello ${World}`;
//   ^?
```

当在插值位置使用联合时，类型就是是各个联合成员表示的每个可能字符串文字的集合：

```ts twoslash
type EmailLocaleIDs = "welcome_email" | "email_heading";
type FooterLocaleIDs = "footer_title" | "footer_sendoff";

type AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}_id`;
//   ^?
```

对于模板文字中的每个插值位置，并集将交叉相乘：

```ts twoslash
type EmailLocaleIDs = "welcome_email" | "email_heading";
type FooterLocaleIDs = "footer_title" | "footer_sendoff";
// ---cut---
type AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}_id`;
type Lang = "en" | "ja" | "pt";

type LocaleMessageIDs = `${Lang}_${AllLocaleIDs}`;
//   ^?
```

我们一般建议人们使用提前生成的大型字符串联合，但这在较小的情况下很有用。

### 类型中的字符串联合

当要基于现有字符串来定义新字符串时，模版文本就大展神威了。

比如，JavaScript 中的一个常见模式是基于一个对象上现有的字段做扩展。我们要为一个函数提供类型定义，其增加了对 `on` 函数的支持，该函数可以让您知道何时发生了变化：

```ts twoslash
// @noErrors
declare function makeWatchedObject(obj: any): any;
// ---cut---
const person = makeWatchedObject({
  firstName: "Saoirse",
  lastName: "Ronan",
  age: 26,
});

person.on("firstNameChanged", (newValue) => {
  console.log(`firstName was changed to ${newValue}!`);
});
```

我们注意到 `on` 监听的是 `firstNameChanged` 事件，而不是 `firstName`，类型系统中模版文本就为处理这种字符串操作铺好了路。

```ts twoslash
type PropEventSource<Type> = {
    on(eventName: `${string & keyof Type}Changed`, callback: (newValue: any) => void): void;
};

/// 用 'on' 方法创建一个 "watched object"
/// 这样您就可以监听属性的变化了
declare function makeWatchedObject<Type>(obj: Type): Type & PropEventSource<Type>;
```

有了它，我们可以以给定的错误属性，来创建一些错误内容：

```ts twoslash
// @errors: 2345
type PropEventSource<Type> = {
    on(eventName: `${string & keyof Type}Changed`, callback: (newValue: any) => void): void;
};

declare function makeWatchedObject<T>(obj: T): T & PropEventSource<T>;
// ---cut---
const person = makeWatchedObject({
  firstName: "Saoirse",
  lastName: "Ronan",
  age: 26
});

person.on("firstNameChanged", () => {});

// 可以防止打错字
person.on("firstName", () => {});

person.on("frstNameChanged", () => {});
```

### 模版文本的推断

请注意，最后的示例中没有重复使用原始值的类型。回调函数使用了 `any`。模版文本类型可以从替换位置进行类型推断。

我们可以将最后示例设置为泛型，从 `eventName` 字符串的部分内容推断，计算出关联的属性。

```ts twoslash
type PropEventSource<Type> = {
    on<Key extends string & keyof Type>
        (eventName: `${Key}Changed`, callback: (newValue: Type[Key]) => void ): void;
};

declare function makeWatchedObject<Type>(obj: Type): Type & PropEventSource<Type>;

const person = makeWatchedObject({
  firstName: "Saoirse",
  lastName: "Ronan",
  age: 26
});

person.on("firstNameChanged", newName => {
    //                        ^?
    console.log(`new name is ${newName.toUpperCase()}`);
});

person.on("ageChanged", newAge => {
    //                  ^?
    if (newAge < 0) {
        console.warn("warning! negative age");
    }
})
```

这里我们把 `on` 变成了泛型方法。

当用户通过字符串 `"firstNameChange"` 调用的时候，TypeScript 会尝试推断 `Key` 的正确类型。
通过这样，它会去匹配在 `"Changed"` 前面的内容作为 `Key`，并且推断其为字符串 `"firstName"`。

当 TypeScript 计算出这一点，`on` 方法可以得到原始对象上 `firstName` 的类型，在这里它是一个 `string` 类型。

同样的，当使用 `"ageChanged"` 进行调用的使用，TypeScript 会发现 `number` 类型的 `age`。

可以用不同方式进行推断，一般都是分解字符串，然后用不同的方式再组装起来。

## 内置字符串操作类型

为了辅助字符串操作，TypeScript 有一套用在字符串操作的类型集合。出于性能考虑，这些类型内置在编译器，在 TypeScript 附带的 `.d.ts` 中找不到。
### `Uppercase<StringType>`

将字符串中的每个字符转为大写。

##### 示例

```ts twoslash
type Greeting = "Hello, world"
type ShoutyGreeting = Uppercase<Greeting>
//   ^?

type ASCIICacheKey<Str extends string> = `ID-${Uppercase<Str>}`
type MainID = ASCIICacheKey<"my_app">
//   ^?
```

### `Lowercase<StringType>`

将字符串中的每个字符转为小写。

##### 示例

```ts twoslash
type Greeting = "Hello, world"
type QuietGreeting = Lowercase<Greeting>
//   ^?

type ASCIICacheKey<Str extends string> = `id-${Lowercase<Str>}`
type MainID = ASCIICacheKey<"MY_APP">
//   ^?
```

### `Capitalize<StringType>`

将字符串中的首个字符转为大写。
##### Example

```ts twoslash
type LowercaseGreeting = "hello, world";
type Greeting = Capitalize<LowercaseGreeting>;
//   ^?
```

### `Uncapitalize<StringType>`

将字符串中的首个字符转为等效的小写字符

##### 示例

```ts twoslash
type UppercaseGreeting = "HELLO WORLD";
type UncomfortableGreeting = Uncapitalize<UppercaseGreeting>;
//   ^?
```

<details>
    <summary>内置字符操作类型的细节</summary>
    <p>从 TypeScript 4.1 开始，这些内在函数的代码直接使用 JavaScript 字符串运行时函数进行操作，并且不支持区域本地化设置。</p>
    <code><pre>
function applyStringMapping(symbol: Symbol, str: string) {
    switch (intrinsicTypeKinds.get(symbol.escapedName as string)) {
        case IntrinsicTypeKind.Uppercase: return str.toUpperCase();
        case IntrinsicTypeKind.Lowercase: return str.toLowerCase();
        case IntrinsicTypeKind.Capitalize: return str.charAt(0).toUpperCase() + str.slice(1);
        case IntrinsicTypeKind.Uncapitalize: return str.charAt(0).toLowerCase() + str.slice(1);
    }
    return str;
}</pre></code>
</details>
