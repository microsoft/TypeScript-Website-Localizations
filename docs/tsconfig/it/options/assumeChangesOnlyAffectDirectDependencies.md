---
display: "Assicura Che I Cambiamenti Influiscano Soltanto Su Dipendenze Dirette"
oneline: "Un'opzione della modalità watch che è drasticamente più veloce, ma a volte imprecisa"
---

Quando questa opzione viene abilitata, TypeScript eviterà la verifica/ricostruzione di assolutamente tutti i file, e verificherà/ricostruirà solo i file che sono stati modificati o che potrebbero essere stati interessati dalle modifiche.

Questo può essere considerato come una implementazione rapida (fast & loose) del algoritmo watching che può drasticamente ridurre i tempi di ricostruzione a scapito di dover eseguire occasionalmente la compilazione completa per ottenere tutti i messaggi di errore del compilatore.
