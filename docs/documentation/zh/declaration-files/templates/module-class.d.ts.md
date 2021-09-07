---
title: "Module: Class"
layout: docs
permalink: /docs/handbook/declaration-files/templates/module-class-d-ts.html
---

<!--
TODO:

1. Not clear why UMD is thrown in here.
2. Give both commonjs and ES module examples.
-->

For example, when you want to work with JavaScript code which looks like:

```ts
const Greeter = require("super-greeter");

const greeter = new Greeter();
greeter.greet();
```

To handle both importing via UMD and modules:

```ts
// Type definitions for [~THE LIBRARY NAME~] [~OPTIONAL VERSION NUMBER~]
// Project: [~THE PROJECT NAME~]
// Definitions by: [~YOUR NAME~] <[~A URL FOR YOU~]>

/*~ This is the module template file for class modules.
 *~ You should rename it to index.d.ts and place it in a folder with the same name as the module.
 *~ For example, if you were writing a file for "super-greeter", this
 *~ file should be 'super-greeter/index.d.ts'
 */

// Note that ES6 modules cannot directly export class objects.
// This file should be imported using the CommonJS-style:
//   import x = require('[~THE MODULE~]');
//
// Alternatively, if --allowSyntheticDefaultImports or
// --esModuleInterop is turned on, this file can also be
// imported as a default import:
//   import x from '[~THE MODULE~]';
//
// Refer to the TypeScript documentation at
// https://www.typescriptlang.org/docs/handbook/modules.html#export--and-import--require
// to understand common workarounds for this limitation of ES6 modules.

/*~ If this module is a UMD module that exposes a global variable 'myClassLib' when
 *~ loaded outside a module loader environment, declare that global here.
 *~ Otherwise, delete this declaration.
 */
export as namespace "super-greeter";

/*~ This declaration specifies that the class constructor function
 *~ is the exported object from the file
 */
export = Greeter;

/*~ Write your module's methods and properties in this class */
declare class Greeter {
  constructor(customGreeting?: string);

  greet: void;

  myMethod(opts: MyClass.MyClassMethodOptions): number;
}

/*~ If you want to expose types from your module as well, you can
 *~ place them in this block.
 *~
 *~ Note that if you decide to include this namespace, the module can be
 *~ incorrectly imported as a namespace object, unless
 *~ --esModuleInterop is turned on:
 *~   import * as x from '[~THE MODULE~]'; // WRONG! DO NOT DO THIS!
 */
declare namespace MyClass {
  export interface MyClassMethodOptions {
    width?: number;
    height?: number;
  }
}
```
