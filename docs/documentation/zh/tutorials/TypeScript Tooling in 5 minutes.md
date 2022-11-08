---
title: 5分钟了解TypeScript工具
layout: docs
permalink: /zh/docs/handbook/typescript-tooling-in-5-minutes.html
oneline: 一个了解如何使用TypeScript来创建小型网站的教程
# translatable: true
---

让我们从`用TypeScript构建一个简单的web应用程序`开始。

## 安装TypeScript

有两种主要方法在项目中使用TypeScript：

- 通过npm（Node.js包管理器）
- 通过安装TypeScript的Visual Studio插件

Visual Studio 2017和Visual Studio 2015 Update 3默认包含TypeScript语言支持，但不包括TypeScript编译器`tsc`。

如果没有在Visual Studio中安装TypeScript，您可以在这里[下载它](/download)。

使用npm:

```shell
> npm install -g typescript
```

## 构建第一个TypeScript文件

在编辑器中，在`greeter.ts`中键入以下JavaScript代码：

```ts twoslash
// @noImplicitAny: false
function greeter(person) {
  return "Hello, " + person;
}

let user = "Jane User";

document.body.textContent = greeter(user);
```

## 编译您的代码

我们使用了`.ts`扩展名，但这段代码只是JavaScript。您可以直接从现有的JavaScript应用程序中复制/粘贴此内容。


在命令行中，运行TypeScript编译器：

```shell
tsc greeter.ts
```

会生成一个`greeter.js`的JavaScript文件，其中内容与您输入的JavaScript相同。这表明了我们正在JavaScript应用程序中使用TypeScript！

现在我们可以开始使用TypeScript提供的一些新工具。向`person`函数参数添加`:string`类型注释，如下所示：

```ts twoslash
function greeter(person: string) {
  return "Hello, " + person;
}

let user = "Jane User";

document.body.textContent = greeter(user);
```

## 类型注解

TypeScript中的类型注释是用来约束函数或变量类型的一种轻量级方式。在这个例子中，我们指明了要使用单个字符串参数来调用greeter函数。然后我们尝试下改为传递数组参数来调用greeter：

```ts twoslash
// @errors: 2345
function greeter(person: string) {
  return "Hello, " + person;
}

let user = [0, 1, 2];

document.body.textContent = greeter(user);
```

重新编译时，您将看到一个错误：

```shell
error TS2345: Argument of type 'number[]' is not assignable to parameter of type 'string'.
```

同样，尝试删除greeter调用的所有参数，TypeScript会告诉您：您调用了这个函数，但参数的数量不是预期的。在这两种情况下，TypeScript都可以基于代码的结构和提供的类型注释提供静态分析。

请注意，尽管有报错，但`greeter.js`文件仍然被创建成功了。也就是说，即使代码中有报错，也可以正常使用TypeScript。但在这种情况下，被TypeScript警告的代码可能无法按预期运行。

## 接口

让我们进一步完善我们的示例。这里我们使用一个`interface`接口来描述具有firstName和lastName字段的对象。
在TypeScript中，如果两种类型的内部结构相一致，则它们被认为是一致的。
这允许我们通过只定义接口所需的结构来实现接口，而不需要显式的使用`implements`关键字。

```ts twoslash
interface Person {
  firstName: string;
  lastName: string;
}

function greeter(person: Person) {
  return "Hello, " + person.firstName + " " + person.lastName;
}

let user = { firstName: "Jane", lastName: "User" };

document.body.textContent = greeter(user);
```

## 类

最后，让我们用`class`类扩展一下这个示例。
TypeScript支持JavaScript中的新功能，例如支持基于类的面向对象编程。

在这里，我们将创建一个带有构造函数和几个公共字段的`Student`类。
请注意，类和接口可以很好地结合在一起，并且允许程序员来决定正确的抽象级别。

另外需要注意的一点是，在构造函数的参数上使用`public`是一种简写，它将自动为我们创建具有相同名称的属性。

```ts twoslash
class Student {
  fullName: string;
  constructor(
    public firstName: string,
    public middleInitial: string,
    public lastName: string
  ) {
    this.fullName = firstName + " " + middleInitial + " " + lastName;
  }
}

interface Person {
  firstName: string;
  lastName: string;
}

function greeter(person: Person) {
  return "Hello, " + person.firstName + " " + person.lastName;
}

let user = new Student("Jane", "M.", "User");

document.body.textContent = greeter(user);
```

重新运行`tsc greeter.ts`，您将看到生成的JavaScript与之前的代码相同。
TypeScript中的类只是JavaScript中常用的基于原型的面向对象的简写。

## 运行您的TypeScript web应用

现在在`greeter.html`中键入以下内容：

```html
<!DOCTYPE html>
<html>
  <head>
    <title>TypeScript Greeter</title>
  </head>
  <body>
    <script src="greeter.js"></script>
  </body>
</html>
```

在浏览器中打开`greeter.html`去运行您的第一个简单的TypeScript web应用程序！

小提示：在Visual Studio中打开`greeter.ts`，或将代码复制到[TypeScript Playground](https://www.typescriptlang.org/play)中。
您可以将光标悬停在标识符上来查看其类型。
请注意，在某些情况下，类型会自动为您推到。
重新键入最后一行，并根据DOM元素的类型查看约束列表和参数帮助。
将光标放在greeter函数的引用上，然后按F12键转到其定义。
还请注意，您可以右键单击符号并使用重构对其进行重命名。

类型提示借由一些JavaScript编辑器工具一起工作，比如上面说到的Visual Studio或者TypeScript自带的编译平台TypeScript Playground。
有关TypeScript中可能的更多示例，请参阅网站的“示例”部分。

![Visual Studio picture](/images/docs/greet_person.png)
