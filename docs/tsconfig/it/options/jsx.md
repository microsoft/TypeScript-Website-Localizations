---
display: "JSX"
oneline: "Controlla come viene emesso JSX"
---

Controlla come i costrutti JSX vengono emessi in file Javascript. Questo influisce sull'output solo nel caso il file JS termini con `.tsx`.

- `react`: Genera dei file `.js` con JSX modificato nelle chiamate `React.createElements` equivalenti.
- `react-jsx`: Genera dei file `.js` con JSX modificato nelle chiamate `_jsx`.
- `react-jsxdev`: Genera dei file `.js` con JSX modificato in chiamate `_jsx`.
- `preserve`: Genera dei file `.jsx` con JSX invariato.
- `react-native`: Genera dei file `.js` con JSX invariato.

### Per esempio

Questo codice esempio：

```tsx
export const ciaoMondo = () => <h1>Ciao mondo</h1>;
```

Predefinito: `"react"`

```tsx twoslash
declare module JSX {
  interface Element {}
  interface IntrinsicElements {
    [s: string]: any;
  }
}
// @showEmit
// @noErrors
export const ciaoMondo = () => <h1>Ciao mondo</h1>;
```

Conservare: `"preserve"`

```tsx twoslash
declare module JSX {
  interface Element {}
  interface IntrinsicElements {
    [s: string]: any;
  }
}
// @showEmit
// @noErrors
// @jsx: preserve
export const ciaoMondo = () => <h1>Ciao mondo</h1>;
```

React Native: `"react-native"`

```tsx twoslash
declare module JSX {
  interface Element {}
  interface IntrinsicElements {
    [s: string]: any;
  }
}
// @showEmit
// @noErrors
// @jsx: react-native
export const ciaoMondo = () => <h1>Ciao mondo</h1>;
```

React 17 convertito: `"react-jsx"`<sup>[[1]](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html)</sup>

```tsx twoslash
declare module JSX {
  interface Element {}
  interface IntrinsicElements {
    [s: string]: any;
  }
}
// @showEmit
// @noErrors
// @jsx: react-jsx
export const ciaoMondo = () => <h1>Ciao mondo</h1>;
```

React 17 dev convertito: `"react-jsxdev"`<sup>[[1]](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html)</sup>

```tsx twoslash
declare module JSX {
  interface Element {}
  interface IntrinsicElements {
    [s: string]: any;
  }
}
// @showEmit
// @noErrors
// @jsx: react-jsxdev
export const ciaoMondo = () => <h1>Ciao mondo</h1>;
```
