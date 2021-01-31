---
display: "Charset"
oneline: "Imposta manualmente la codifica del testo per la lettura dei file"
---

Nelle versioni precedenti di TypeScript, questo controllava che tipo di codifica veniva usato quando si leggeva un file di testo dal disco. Oggi, TypeScript assume che la codifica UTF-8, pero correttamente rileverà anche UTF-16 (BE e LE) o UTF-8 [BOMs](https://it.wikipedia.org/wiki/Byte_Order_Mark).
