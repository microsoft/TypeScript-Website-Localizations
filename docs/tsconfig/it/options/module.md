---
display: "Modulo"
oneline: "Definisce il sistema di moduli previsto per il runtime"
---

Definisce il sistema di moduli per il programma. Consulta la sezione <a href='/docs/handbook/modules.html#ambient-modules'> Moduli </a> per più informazioni. Per i progetti che utilizzano node è probabile che tu voglia `"CommonJS"`.

Questo è un output di esempio:

```ts twoslash
// @filename: costanti.ts
export const valoreDiPi = 3.142;
// ---cut---
// @filename: index.ts
import { valoreDiPi } from "./costanti";

export const doppioPi = valoreDiPi * 2;
```

#### `CommonJS`

```ts twoslash
// @showEmit
// @module: commonjs
// @filename: costanti.ts
export const valoreDiPi = 3.142;
// @filename: index.ts
// ---cut---
import { valoreDiPi } from "./costanti";

export const doppioPi = valoreDiPi * 2;
```

#### `UMD`

```ts twoslash
// @showEmit
// @module: umd
// @filename: costanti.ts
export const valoreDiPi = 3.142;
// ---cut---
// @filename: index.ts
import { valoreDiPi } from "./costanti";

export const doppioPi = valoreDiPi * 2;
```

#### `AMD`

```ts twoslash
// @showEmit
// @module: amd
// @filename: costanti.ts
export const valoreDiPi = 3.142;
// ---cut---
// @filename: index.ts
import { valoreDiPi } from "./costanti";

export const doppioPi = valoreDiPi * 2;
```

#### `System`

```ts twoslash
// @showEmit
// @module: system
// @filename: costanti.ts
export const valoreDiPi = 3.142;
// ---cut---
// @filename: index.ts
import { valoreDiPi } from "./costanti";

export const doppioPi = valoreDiPi * 2;
```

#### `ESNext`

```ts twoslash
// @showEmit
// @module: esnext
// @filename: costanti.ts
export const valoreDiPi = 3.142;
// ---cut---
// @filename: index.ts
import { valoreDiPi } from "./costanti";

export const doppioPi = valoreDiPi * 2;
```

#### `ES2020`

```ts twoslash
// @showEmit
// @module: es2020
// @filename: costanti.ts
export const valoreDiPi = 3.142;
// ---cut---
// @filename: index.ts
import { valoreDiPi } from "./costanti";

export const doppioPi = valoreDiPi * 2;
```

### `None`

```ts twoslash
// @showEmit
// @module: none
// @filename: costanti.ts
export const valoreDiPi = 3.142;
// ---cut---
// @filename: index.ts
import { valoreDiPi } from "./costanti";

export const doppioPi = valoreDiPi * 2;
```
