---
title: Do's and Don'ts
layout: docs
permalink: /docs/handbook/declaration-files/do-s-and-don-ts.html
oneline: "Recommendations for writing d.ts files"
---

## General Types

## `Number`, `String`, `Boolean`, `Symbol` and `Object`

❌ **Don't** ever use the types `Number`, `String`, `Boolean`, `Symbol`, or `Object`
These types refer to non-primitive boxed objects that are almost never used appropriately in JavaScript code.

```ts
/* WRONG */
function reverse(s: String): String;
```

✅ **Do** use the types `number`, `string`, `boolean`, and `symbol`.

```ts
/* OK */
function reverse(s: string): string;
```

Instead of `Object`, use the non-primitive `object` type ([added in TypeScript 2.2](../release-notes/typescript-2-2.html#object-type)).

## Generics

❌ **Don't** ever have a generic type which doesn't use its type parameter.
See more details in [TypeScript FAQ page](https://github.com/Microsoft/TypeScript/wiki/FAQ#why-doesnt-type-inference-work-on-this-interface-interface-foot--).

## any

❌ **Don't** use `any` as a type unless you are in the process of migrating a JavaScript project to TypeScript.  The compiler _effectively_ treats `any` as "please turn off type checking for this thing".  It is similar to putting an `@ts-ignore` comment around every usage of the variable.  This can be very helpful when you are first migrating a JavaScript project to TypeScript as you can set the type for stuff you haven't migrated yet as `any`, but in a full TypeScript project you are disabling type checking for any parts of your program that use it.

In cases where you don't know what type you want to accept, or when you want to accept anything because you will be blindly passing it through without interacting with it, you can use [`unknown`](/play/#example/unknown-and-never).

<!-- TODO: More -->

## Callback Types

## Return Types of Callbacks

<!-- TODO: Reword; these examples make no sense in the context of a declaration file -->

❌ **Don't** use the return type `any` for callbacks whose value will be ignored:

```ts
/* WRONG */
function fn(x: () => any) {
  x();
}
```

✅ **Do** use the return type `void` for callbacks whose value will be ignored:

```ts
/* OK */
function fn(x: () => void) {
  x();
}
```

❔ **Why:** Using `void` is safer because it prevents you from accidentally using the return value of `x` in an unchecked way:

```ts
function fn(x: () => void) {
  var k = x(); // oops! meant to do something else
  k.doSomething(); // error, but would be OK if the return type had been 'any'
}
```

## Optional Parameters in Callbacks

❌ **Don't** use optional parameters in callbacks unless you really mean it:

```ts
/* WRONG */
interface Fetcher {
  getObject(done: (data: any, elapsedTime?: number) => void): void;
}
```

This has a very specific meaning: the `done` callback might be invoked with 1 argument or might be invoked with 2 arguments.
The author probably intended to say that the callback might not care about the `elapsedTime` parameter,
but there's no need to make the parameter optional to accomplish this --
it's always legal to provide a callback that accepts fewer arguments.

✅ **Do** write callback parameters as non-optional:

```ts
/* OK */
interface Fetcher {
  getObject(done: (data: any, elapsedTime: number) => void): void;
}
```

## Overloads and Callbacks

❌ **Don't** write separate overloads that differ only on callback arity:

```ts
/* WRONG */
declare function beforeAll(action: () => void, timeout?: number): void;
declare function beforeAll(
  action: (done: DoneFn) => void,
  timeout?: number
): void;
```

✅ **Do** write a single overload using the maximum arity:

```ts
/* OK */
declare function beforeAll(
  action: (done: DoneFn) => void,
  timeout?: number
): void;
```

❔ **Why:** It's always legal for a callback to disregard a parameter, so there's no need for the shorter overload.
Providing a shorter callback first allows incorrectly-typed functions to be passed in because they match the first overload.

## Function Overloads

## Ordering

❌ **Don't** put more general overloads before more specific overloads:

```ts
/* WRONG */
declare function fn(x: any): any;
declare function fn(x: HTMLElement): number;
declare function fn(x: HTMLDivElement): string;

var myElem: HTMLDivElement;
var x = fn(myElem); // x: any, wat?
```

✅ **Do** sort overloads by putting the more general signatures after more specific signatures:

```ts
/* OK */
declare function fn(x: HTMLDivElement): string;
declare function fn(x: HTMLElement): number;
declare function fn(x: any): any;

var myElem: HTMLDivElement;
var x = fn(myElem); // x: string, :)
```

❔ **Why:** TypeScript chooses the _first matching overload_ when resolving function calls.
When an earlier overload is "more general" than a later one, the later one is effectively hidden and cannot be called.

## Use Optional Parameters

❌ **Don't** write several overloads that differ only in trailing parameters:

```ts
/* WRONG */
interface Example {
  diff(one: string): number;
  diff(one: string, two: string): number;
  diff(one: string, two: string, three: boolean): number;
}
```

✅ **Do** use optional parameters whenever possible:

```ts
/* OK */
interface Example {
  diff(one: string, two?: string, three?: boolean): number;
}
```

Note that this collapsing should only occur when all overloads have the same return type.

❔ **Why:** This is important for two reasons.

TypeScript resolves signature compatibility by seeing if any signature of the target can be invoked with the arguments of the source,
_and extraneous arguments are allowed_.
This code, for example, exposes a bug only when the signature is correctly written using optional parameters:

```ts
function fn(x: (a: string, b: number, c: number) => void) {}
var x: Example;
// When written with overloads, OK -- used first overload
// When written with optionals, correctly an error
fn(x.diff);
```

The second reason is when a consumer uses the "strict null checking" feature of TypeScript.
Because unspecified parameters appear as `undefined` in JavaScript, it's usually fine to pass an explicit `undefined` to a function with optional arguments.
This code, for example, should be OK under strict nulls:

```ts
var x: Example;
// When written with overloads, incorrectly an error because of passing 'undefined' to 'string'
// When written with optionals, correctly OK
x.diff("something", true ? undefined : "hour");
```

## Use Union Types

❌ **Don't** write overloads that differ by type in only one argument position:

```ts
/* WRONG */
interface Moment {
  utcOffset(): number;
  utcOffset(b: number): Moment;
  utcOffset(b: string): Moment;
}
```

✅ **Do** use union types whenever possible:

```ts
/* OK */
interface Moment {
  utcOffset(): number;
  utcOffset(b: number | string): Moment;
}
```

Note that we didn't make `b` optional here because the return types of the signatures differ.

❔ **Why:** This is important for people who are "passing through" a value to your function:

```ts
function fn(x: string): void;
function fn(x: number): void;
function fn(x: number | string) {
  // When written with separate overloads, incorrectly an error
  // When written with union types, correctly OK
  return moment().utcOffset(x);
}
```
