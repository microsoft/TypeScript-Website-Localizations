---
display: "Disabilita il caricamento del progetto di riferimento"
oneline: "Riduce il numero di progetti caricati automaticamente da TypeScript"
---

In programmi multi progetto di TypeScript, TypeScript carichera tutti i progetti disponibili in memoria con il obiettivo di fornire un risultato più accurato per il editor che richiede un grafico di conoscenza completo come "Trova tutti i riferimenti".

Se il tuo progetto è grande, puoi usare il _flag_ `disableReferencedProjectLoad` per disabilitare il caricamento automatico di tutti i progetti. Cosi i progetti vengono caricati dinamicamente quando apri le cartelle attraverso il tuo editor.