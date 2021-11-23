---
title: Declaration Reference
layout: docs
permalink: /docs/handbook/declaration-files/by-example.html
oneline: "How to create a d.ts file for a module"
---

The purpose of this guide is to teach you how to write a high-quality definition file.
This guide is structured by showing documentation for some API, along with sample usage of that API,
and explaining how to write the corresponding declaration.

These examples are ordered in approximately increasing order of complexity.

## Objects with Properties

_Documentation_

> The global variable `myLib` has a function `makeGreeting` for creating greetings,
> and a property `numberOfGreetings` indicating the number of greetings made so far.

_Code_

```ts
let result = myLib.makeGreeting("hello, world");
console.log("The computed greeting is:" + result);

let count = myLib.numberOfGreetings;
```

_Declaration_

Use `declare namespace` to describe types or values accessed by dotted notation.

```ts
declare namespace myLib {
  function makeGreeting(s: string): string;
  let numberOfGreetings: number;
}
```

## Overloaded Functions

_Documentation_

The `getWidget` function accepts a number and returns a Widget, or accepts a string and returns a Widget array.

_Code_

```ts
let x: Widget = getWidget(43);

let arr: Widget[] = getWidget("all of them");
```

_Declaration_

```ts
declare function getWidget(n: number): Widget;
declare function getWidget(s: string): Widget[];
```

## Reusable Types (Interfaces)

_Documentation_

> When specifying a greeting, you must pass a `GreetingSettings` object.
> This object has the following properties:
>
> 1 - greeting: Mandatory string
>
> 2 - duration: Optional length of time (in milliseconds)
>
> 3 - color: Optional string, e.g. '#ff00ff'

_Code_

```ts
greet({
  greeting: "hello world",
  duration: 4000
});
```

_Declaration_

Use an `interface` to define a type with properties.

```ts
interface GreetingSettings {
  greeting: string;
  duration?: number;
  color?: string;
}

declare function greet(setting: GreetingSettings): void;
```

## Reusable Types (Type Aliases)

_Documentation_

> Anywhere a greeting is expected, you can provide a `string`, a function returning a `string`, or a `Greeter` instance.

_Code_

```ts
function getGreeting() {
  return "howdy";
}
class MyGreeter extends Greeter {}

greet("hello");
greet(getGreeting);
greet(new MyGreeter());
```

_Declaration_

You can use a type alias to make a shorthand for a type:

```ts
type GreetingLike = string | (() => string) | MyGreeter;

declare function greet(g: GreetingLike): void;
```

## Organizing Types

_Documentation_

> The `greeter` object can log to a file or display an alert.
> You can provide LogOptions to `.log(...)` and alert options to `.alert(...)`

_Code_

```ts
const g = new Greeter("Hello");
g.log({ verbose: true });
g.alert({ modal: false, title: "Current Greeting" });
```

_Declaration_

Use namespaces to organize types.

```ts
declare namespace GreetingLib {
  interface LogOptions {
    verbose?: boolean;
  }
  interface AlertOptions {
    modal: boolean;
    title?: string;
    color?: string;
  }
}
```

You can also create nested namespaces in one declaration:

```ts
declare namespace GreetingLib.Options {
  // Refer to via GreetingLib.Options.Log
  interface Log {
    verbose?: boolean;
  }
  interface Alert {
    modal: boolean;
    title?: string;
    color?: string;
  }
}
```

## Classes

_Documentation_

> You can create a greeter by instantiating the `Greeter` object, or create a customized greeter by extending from it.

_Code_

```ts
const myGreeter = new Greeter("hello, world");
myGreeter.greeting = "howdy";
myGreeter.showGreeting();

class SpecialGreeter extends Greeter {
  constructor() {
    super("Very special greetings");
  }
}
```

_Declaration_

Use `declare class` to describe a class or class-like object.
Classes can have properties and methods as well as a constructor.

```ts
declare class Greeter {
  constructor(greeting: string);

  greeting: string;
  showGreeting(): void;
}
```

## Global Variables

_Documentation_

> The global variable `foo` contains the number of widgets present.

_Code_

```ts
console.log("Half the number of widgets is " + foo / 2);
```

_Declaration_

Use `declare var` to declare variables.
If the variable is read-only, you can use `declare const`.
You can also use `declare let` if the variable is block-scoped.

```ts
/** The number of widgets present */
declare var foo: number;
```

## Global Functions

_Documentation_

> You can call the function `greet` with a string to show a greeting to the user.

_Code_

```ts
greet("hello, world");
```

_Declaration_

Use `declare function` to declare functions.

```ts
declare function greet(greeting: string): void;
```

