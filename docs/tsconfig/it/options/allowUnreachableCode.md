---
display: "Permetti Codice Irraggiungibile"
oneline: "Visualizza un errore quando il codice non verrà mai eseguito"
---

Quando:

- `undefined` (predefinito) fornire suggerimenti come avviso agli editor
- `true` il codice irraggiungibile viene ignorato
- `false` visualizza un errore di compilazione quando viene trovato del codice irraggiungibile

Questi avvertimenti sono solo per codice che probabilmente è irraggiungibile a causa del uso di sintassi JavaScript, per esempio:

```ts
function fn(n: number) {
  if (n > 5) {
    return true;
  } else {
    return false;
  }
  return true;
}
```

Con `"allowUnreachableCode": false`:

```ts twoslash
// @errors: 7027
// @allowUnreachableCode: false
function fn(n: number) {
  if (n > 5) {
    return true;
  } else {
    return false;
  }
  return true;
}
```

Ciò non influisce sugli errori sulla base del codice che _sembra_ di essere irraggiungibile a causa dell analisi del tipo.
