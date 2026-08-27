---
title: Conceptos Básicos
layout: docs
permalink: /docs/handbook/2/basic-types.html
oneline: "Primer paso para aprender TypeScript: Los tipos básicos."
preamble: >
  <p>Bienvenido a la primera página del manual. Si esta es tu primera experiencia con TypeScript, quizá quieras empezar con una de las guías de '<a href='https://www.typescriptlang.org/docs/handbook/intro.html#get-started'>Comenzando</a>'</p>
---

Cada valor en JavaScript tiene un conjunto de comportamientos que puedes observar al ejecutar distintas operaciones.
Suena abstracto, pero como ejemplo rápido, considera algunas operaciones que podríamos ejecutar sobre una variable llamada `message`.

```js
// Accessing the property 'toLowerCase'
// on 'message' and then calling it
message.toLowerCase();

// Calling 'message'
message();
```

Si desglosamos esto, la primera línea de código ejecutable accede a una propiedad llamada `toLowerCase` y luego la llama.
La segunda intenta llamar a `message` directamente.


Pero suponiendo que no sabemos el valor de `message` —y eso es bastante común—, no podemos decir con certeza qué resultados obtendremos al intentar ejecutar cualquiera de este código.
El comportamiento de cada operación depende completamente del valor que teníamos en primer lugar.

- ¿Es `message` invocable?
- ¿Tiene una propiedad llamada `toLowerCase`?
- Si la tiene, ¿`toLowerCase` es invocable?
- Si ambos valores son invocables, ¿qué devuelven?

Las respuestas a estas preguntas suelen ser cosas que mantenemos en nuestra cabeza cuando escribimos JavaScript, y tenemos que esperar haber recordado todos los detalles correctamente.

Supongamos que `message` se definió de la siguiente manera.

```js
const message = "Hello World!";
```

Como probablemente adivinaste, si intentamos ejecutar `message.toLowerCase()`, obtendremos la misma cadena pero en minúsculas.

¿Y qué pasa con esa segunda línea de código?
Si estás familiarizado con JavaScript, sabrás que esto falla con una excepción:

```txt
TypeError: message is not a function
```

Sería genial poder evitar errores como este.

Cuando ejecutamos nuestro código, la forma en que el entorno de ejecución de JavaScript elige qué hacer es determinando el _tipo_ del valor: qué comportamientos y capacidades tiene.
Eso es parte de lo que sugiere ese `TypeError`: está diciendo que la cadena `"Hello World!"` no puede ser llamada como una función.

Para algunos valores, como los primitivos `string` y `number`, podemos identificar su tipo en tiempo de ejecución usando el operador `typeof`.
Pero para otras cosas como funciones, no hay un mecanismo de tiempo de ejecución correspondiente para identificar sus tipos.
Por ejemplo, considera esta función:

```js
function fn(x) {
  return x.flip();
}
```

Podemos _observar_ al leer el código que esta función solo funcionará si se le da un objeto con una propiedad `flip` invocable, pero JavaScript no expone esta información de una manera que podamos comprobar mientras el código se está ejecutando.
La única forma en JavaScript puro de saber qué hace `fn` con un valor en particular es llamarlo y ver qué sucede.
Este tipo de comportamiento hace que sea difícil predecir lo que hará el código antes de ejecutarlo, lo que significa que es más difícil saber lo que tu código va a hacer mientras lo escribes.

Visto de esta manera, un _tipo_ es el concepto de describir qué valores se pueden pasar a `fn` y cuáles harán que falle.
JavaScript solo proporciona realmente _tipado dinámico_: ejecutar el código para ver qué sucede.

La alternativa es usar un sistema de tipos _estático_ para hacer predicciones sobre lo que se espera que haga el código _antes_ de ejecutarlo.


## Comprobación de tipos estática

Piensa en ese `TypeError` que obtuvimos antes al intentar llamar a un `string` como función.
_A la mayoría de las personas_ no les gusta obtener ningún tipo de error al ejecutar su código: ¡eso se considera un bug!
Y cuando escribimos código nuevo, intentamos evitar introducir nuevos errores.

Si agregamos solo un poco de código, guardamos el archivo, volvemos a ejecutar el código y vemos el error de inmediato, podríamos aislar el problema rápidamente; pero eso no siempre es el caso.
Puede que no hayamos probado la funcionalidad lo suficiente, así que tal vez nunca nos encontremos con un error potencial que se lanzaría.
O si tuvimos la suerte de ver el error, podríamos haber terminado haciendo grandes refactorizaciones y agregando mucho código diferente que nos vemos obligados a revisar.

Idealmente, podríamos tener una herramienta que nos ayude a encontrar estos errores _antes_ de que nuestro código se ejecute.
Eso es lo que hace un comprobador de tipos estático como TypeScript.
Los _sistemas de tipos estáticos_ describen las formas y comportamientos que tendrán nuestros valores cuando ejecutemos nuestros programas.
Un comprobador de tipos como TypeScript usa esa información y nos dice cuándo las cosas podrían estar saliéndose de control.

```ts twoslash
// @errors: 2349
const message = "hello!";

message();
```

Ejecutar ese último ejemplo con TypeScript nos dará un mensaje de error antes de ejecutar el código.


## Fallos que no son excepciones

Hasta ahora hemos estado hablando de cosas como errores en tiempo de ejecución: casos en los que el entorno de ejecución de JavaScript nos dice que algo no tiene sentido.
Esos casos surgen porque la [especificación ECMAScript](https://tc39.github.io/ecma262/) tiene instrucciones explícitas sobre cómo debe comportarse el lenguaje cuando se encuentra con algo inesperado.

Por ejemplo, la especificación dice que intentar llamar algo que no es invocable debe lanzar un error.
Quizá eso suene como un "comportamiento obvio", pero podrías imaginar que acceder a una propiedad que no existe en un objeto también debería lanzar un error.
En cambio, JavaScript nos da un comportamiento diferente y devuelve el valor `undefined`:

```js
const user = {
  name: "Daniel",
  age: 26,
};

user.location; // devuelve undefined
```

En última instancia, un sistema de tipos estático tiene que decidir qué código debe marcar como error en su sistema, incluso si es JavaScript "válido" que no lanzará un error de inmediato.
En TypeScript, el siguiente código produce un error sobre que `location` no está definido:

```ts twoslash
// @errors: 2339
const user = {
  name: "Daniel",
  age: 26,
};

user.location;
```

A veces eso implica un compromiso en lo que puedes expresar, pero la intención es detectar bugs legítimos en nuestros programas.
Y TypeScript detecta _muchos_ bugs legítimos.

Por ejemplo: errores de tipeo,

```ts twoslash
// @noErrors
const announcement = "Hello World!";

// ¿Qué tan rápido puedes detectar los errores de tipeo?
announcement.toLocaleLowercase();
announcement.toLocalLowerCase();

// Probablemente quisimos escribir esto...
announcement.toLocaleLowerCase();
```

funciones no llamadas,

```ts twoslash
// @noUnusedLocals
// @errors: 2365
function flipCoin() {
  // Debería ser Math.random()
  return Math.random < 0.5;
}
```

o errores lógicos básicos.

```ts twoslash
// @errors: 2367
const value = Math.random() < 0.5 ? "a" : "b";
if (value !== "a") {
  // ...
} else if (value === "b") {
  // Oops, inalcanzable
}
```


## Tipos para herramientas

TypeScript puede detectar errores cuando cometemos equivocaciones en nuestro código.
Eso es genial, pero TypeScript _también_ puede evitar que cometamos esos errores en primer lugar.

El comprobador de tipos tiene información para verificar cosas como si estamos accediendo a las propiedades correctas en variables y otros objetos.
Una vez que tiene esa información, también puede empezar a _sugerir_ qué propiedades podrías querer usar.

Eso significa que TypeScript también puede aprovecharse para editar código, y el comprobador de tipos principal puede proporcionar mensajes de error y autocompletado mientras escribes en el editor.
Eso es parte de lo que la gente suele referirse cuando habla de herramientas en TypeScript.

<!-- prettier-ignore -->
```ts twoslash
// @noErrors
// @esModuleInterop
import express from "express";
const app = express();

app.get("/", function (req, res) {
  res.sen
//       ^|
});

app.listen(3000);
```

TypeScript se toma en serio las herramientas, y eso va más allá de los autocompletados y errores mientras escribes.
Un editor que soporte TypeScript puede ofrecer "correcciones rápidas" para arreglar errores automáticamente, refactorizaciones para reorganizar el código fácilmente y funciones útiles de navegación para saltar a definiciones de una variable o encontrar todas las referencias a una variable dada.
Todo esto se construye sobre el comprobador de tipos y es completamente multiplataforma, así que es probable que [tu editor favorito tenga soporte para TypeScript](https://github.com/Microsoft/TypeScript/wiki/TypeScript-Editor-Support).


## `tsc`, el compilador de TypeScript

Hemos estado hablando de comprobación de tipos, pero aún no hemos usado nuestro comprobador de tipos.
Conozcamos a nuestro nuevo amigo `tsc`, el compilador de TypeScript.
Primero necesitaremos instalarlo usando npm.

```sh
npm install -g typescript
```

> Esto instala el compilador de TypeScript `tsc` globalmente.
> Puedes usar `npx` u otras herramientas similares si prefieres ejecutar `tsc` desde un paquete local en `node_modules`.

Ahora vamos a una carpeta vacía y probemos a escribir nuestro primer programa en TypeScript: `hello.ts`:

```ts twoslash
// Saluda al mundo.
console.log("Hello world!");
```

Observa que no hay nada especial aquí; este programa "hello world" es idéntico a lo que escribirías en JavaScript.
Y ahora comprobemos los tipos ejecutando el comando `tsc` que fue instalado por el paquete `typescript`.

```sh
tsc hello.ts
```

¡Tada!

Espera, ¿"tada" _qué_ exactamente?
Ejecutamos `tsc` y no pasó nada.
Bueno, no hubo errores de tipo, así que no obtuvimos ninguna salida en la consola porque no había nada que reportar.

Pero revisa de nuevo: obtuvimos un _archivo_ de salida.
Si miramos en nuestro directorio actual, veremos un archivo `hello.js` junto a `hello.ts`.
Ese es el resultado de nuestro archivo `hello.ts` después de que `tsc` lo _compila_ o _transforma_ en un archivo JavaScript plano.
Y si revisamos el contenido, veremos lo que TypeScript genera después de procesar un archivo `.ts`:

```js
// Saluda al mundo.
console.log("Hello world!");
```

En este caso, había muy poco que TypeScript tuviera que transformar, así que se ve idéntico a lo que escribimos.
El compilador intenta emitir código limpio y legible que parezca escrito por una persona.
A veces no es tan fácil, pero TypeScript indenta de forma consistente, es cuidadoso cuando el código abarca varias líneas y trata de mantener los comentarios.

¿Y si _sí_ introducimos un error de comprobación de tipos?
Reescribamos `hello.ts`:

```ts twoslash
// @noErrors
// Esta es una función saludadora de uso general de grado industrial:
function greet(person, date) {
  console.log(`Hello ${person}, today is ${date}!`);
}

greet("Brendan");
```

Si ejecutamos `tsc hello.ts` de nuevo, ¡verás que obtenemos un error en la línea de comandos!

```txt
Expected 2 arguments, but got 1.
```

TypeScript nos está diciendo que olvidamos pasar un argumento a la función `greet`, y con razón.
Hasta ahora solo hemos escrito JavaScript estándar, ¡y aun así la comprobación de tipos pudo encontrar problemas en nuestro código!
¡Gracias TypeScript!


## Emisión con errores

Algo que quizás no notaste en el último ejemplo es que nuestro archivo `hello.js` cambió de nuevo.
Si abrimos ese archivo veremos que el contenido básicamente sigue siendo igual al archivo de entrada.
Eso puede ser un poco sorprendente dado que `tsc` reportó un error sobre nuestro código, pero esto se basa en uno de los valores fundamentales de TypeScript: muchas veces, _tú_ sabrás mejor que TypeScript.

Para reiterar lo anterior, la comprobación de tipos limita los tipos de programas que puedes ejecutar, así que hay un compromiso sobre lo que un comprobador de tipos considera aceptable.
La mayoría de las veces eso está bien, pero hay escenarios donde esas comprobaciones pueden estorbar.
Por ejemplo, imagina que migras código JavaScript a TypeScript e introduces errores de comprobación de tipos.
Eventualmente limpiarás todo para el comprobador de tipos, ¡pero ese código JavaScript original ya funcionaba!
¿Por qué convertirlo a TypeScript debería impedirte ejecutarlo?

Así que TypeScript no se interpone en tu camino.
Por supuesto, con el tiempo, quizá quieras ser más estricto contra los errores y hacer que TypeScript actúe de forma más estricta.
En ese caso, puedes usar la opción del compilador [`noEmitOnError`](/tsconfig#noEmitOnError).
Prueba a cambiar tu archivo `hello.ts` y ejecutar `tsc` con esa bandera:

```sh
tsc --noEmitOnError hello.ts
```

Verás que `hello.js` nunca se actualiza.


## Tipos explícitos

Hasta ahora, no le hemos dicho a TypeScript qué son `person` o `date`.
Editaremos el código para decirle a TypeScript que `person` es un `string` y que `date` debe ser un objeto `Date`.
También usaremos el método `toDateString()` en `date`.

```ts twoslash
function greet(person: string, date: Date) {
  console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}
```

Lo que hicimos fue agregar _anotaciones de tipo_ en `person` y `date` para describir con qué tipos de valores se puede llamar a `greet`.
Puedes leer esa firma como "`greet` recibe un `person` de tipo `string` y un `date` de tipo `Date`".

Con esto, TypeScript puede decirnos sobre otros casos en los que `greet` podría haber sido llamada incorrectamente.
Por ejemplo...

```ts twoslash
// @errors: 2345
function greet(person: string, date: Date) {
  console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}

greet("Maddison", Date());
```

¿Eh?
TypeScript reportó un error en nuestro segundo argumento, ¿pero por qué?

Quizá sorprendentemente, llamar a `Date()` en JavaScript devuelve un `string`.
Por otro lado, construir un `Date` con `new Date()` realmente nos da lo que esperábamos.

De todos modos, podemos arreglar rápidamente el error:

```ts twoslash {4}
function greet(person: string, date: Date) {
  console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}

greet("Maddison", new Date());
```

Ten en cuenta que no siempre tenemos que escribir anotaciones de tipo explícitas.
En muchos casos, TypeScript puede incluso _inferir_ (o "averiguar") los tipos por nosotros aunque los omitamos.

```ts twoslash
let msg = "hello there!";
//  ^?
```

Aun cuando no le dijimos a TypeScript que `msg` tenía el tipo `string`, pudo averiguarlo.
Eso es una característica, y lo mejor es no agregar anotaciones cuando el sistema de tipos terminaría infiriendo el mismo tipo de todos modos.

> Nota: El globo de mensaje dentro del ejemplo de código anterior es lo que tu editor mostraría si pasaras el cursor sobre la palabra.


## Tipos eliminados

Veamos qué sucede cuando compilamos la función `greet` anterior con `tsc` para obtener JavaScript:

```ts twoslash
// @showEmit
// @target: es5
function greet(person: string, date: Date) {
  console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}

greet("Maddison", new Date());
```

Observa dos cosas aquí:

1. Nuestros parámetros `person` y `date` ya no tienen anotaciones de tipo.
2. Nuestra "template string" —esa cadena que usaba acentos graves (el carácter `` ` ``)— fue convertida a cadenas planas con concatenaciones.

Más sobre ese segundo punto más adelante, pero enfoquémonos ahora en el primero.
Las anotaciones de tipo no son parte de JavaScript (o ECMAScript para ser precisos), así que realmente no hay navegadores ni otros entornos de ejecución que puedan ejecutar TypeScript sin modificar.
Por eso TypeScript necesita un compilador: necesita una forma de eliminar o transformar cualquier código específico de TypeScript para que puedas ejecutarlo.
La mayor parte del código específico de TypeScript se elimina, y de igual manera, aquí nuestras anotaciones de tipo fueron completamente eliminadas.

> **Recuerda**: Las anotaciones de tipo nunca cambian el comportamiento en tiempo de ejecución de tu programa.


## Downleveling

Otra diferencia respecto a lo anterior es que nuestra template string fue reescrita de

```js
`Hello ${person}, today is ${date.toDateString()}!`;
```

a

```js
"Hello ".concat(person, ", today is ").concat(date.toDateString(), "!");
```

¿Por qué sucedió esto?

Las template strings son una característica de una versión de ECMAScript llamada ECMAScript 2015 (también conocida como ECMAScript 6, ES2015, ES6, etc. —_no preguntes_).
TypeScript tiene la capacidad de reescribir código de versiones más nuevas de ECMAScript a versiones más antiguas como ECMAScript 3 o ECMAScript 5 (ES5).
Este proceso de pasar de una versión más nueva o "alta" de ECMAScript a una más antigua o "baja" a veces se llama _downleveling_.

Por defecto, TypeScript apunta a ES5, una versión extremadamente antigua de ECMAScript.
Podríamos haber elegido algo un poco más reciente usando la opción [`target`](/tsconfig#target).
Ejecutar con `--target es2015` hace que TypeScript apunte a ECMAScript 2015, lo que significa que el código debería poder ejecutarse donde sea que se soporte ECMAScript 2015.
Así que ejecutar `tsc --target es2015 hello.ts` nos da la siguiente salida:

```js
function greet(person, date) {
  console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}
greet("Maddison", new Date());
```

> Aunque el objetivo predeterminado es ES5, la gran mayoría de los navegadores actuales soportan ES2015.
> Por lo tanto, la mayoría de los desarrolladores pueden especificar ES2015 o superior como objetivo de forma segura, a menos que la compatibilidad con ciertos navegadores antiguos sea importante.


## Estrictitud

Diferentes usuarios llegan a TypeScript buscando distintas cosas en un comprobador de tipos.
Algunas personas buscan una experiencia más flexible y opcional que ayude a validar solo algunas partes de su programa, y aun así tener buenas herramientas.
Esta es la experiencia predeterminada con TypeScript, donde los tipos son opcionales, la inferencia toma los tipos más permisivos y no hay comprobación para valores potencialmente `null`/`undefined`.
Al igual que `tsc` emite código incluso con errores, estos valores predeterminados están pensados para no estorbarte.
Si estás migrando JavaScript existente, eso podría ser un primer paso deseable.

En contraste, muchos usuarios prefieren que TypeScript valide tanto como sea posible desde el principio, y por eso el lenguaje también proporciona configuraciones de estrictitud.
Estas configuraciones convierten la comprobación de tipos estática de un interruptor (o tu código se comprueba o no) en algo más parecido a una perilla.
Cuanto más subas esa perilla, más comprobará TypeScript por ti.
Esto puede requerir un poco de trabajo extra, pero en general vale la pena a largo plazo y permite comprobaciones más exhaustivas y herramientas más precisas.
Cuando sea posible, una nueva base de código debería activar siempre estas comprobaciones estrictas.

TypeScript tiene varias banderas de estrictitud de comprobación de tipos que se pueden activar o desactivar, y todos nuestros ejemplos estarán escritos con todas ellas activadas a menos que se indique lo contrario.
La bandera [`strict`](/tsconfig#strict) en la CLI, o `"strict": true` en un [`tsconfig.json`](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) las activa todas a la vez, pero podemos desactivarlas individualmente.
Las dos más importantes que debes conocer son [`noImplicitAny`](/tsconfig#noImplicitAny) y [`strictNullChecks`](/tsconfig#strictNullChecks).


## `noImplicitAny`

Recuerda que en algunos lugares, TypeScript no intenta inferir tipos por nosotros y en su lugar recurre al tipo más permisivo: `any`.
Esto no es lo peor que puede pasar; después de todo, usar `any` es simplemente la experiencia de JavaScript puro.

Sin embargo, usar `any` a menudo derrota el propósito de usar TypeScript en primer lugar.
Cuanto más tipado esté tu programa, más validación y mejores herramientas tendrás, lo que significa que encontrarás menos errores mientras programas.
Activar la bandera [`noImplicitAny`](/tsconfig#noImplicitAny) generará un error en cualquier variable cuyo tipo se infiera implícitamente como `any`.


## `strictNullChecks`

Por defecto, valores como `null` y `undefined` son asignables a cualquier otro tipo.
Esto puede hacer que escribir cierto código sea más fácil, pero olvidar manejar `null` y `undefined` es la causa de innumerables bugs en el mundo; algunos lo consideran un [error de mil millones de dólares](https://www.youtube.com/watch?v=ybrQvs4x0Ps)!
La bandera [`strictNullChecks`](/tsconfig#strictNullChecks) hace que el manejo de `null` y `undefined` sea más explícito, y _nos ahorra_ preocuparnos por si _olvidamos_ manejar `null` y `undefined`.
