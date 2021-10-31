---
display: "watchFile"
oneline: "tecnica con come i singoli file vengono identificati"
---

Definisce la strategia in quanto i singoli file dovrebbero essere osservati per le modifiche

- `fixedPollingInterval`: Controlla tutti i file per le modifiche più volte al secondo a un intervallo predeterminato.
- `priorityPollingInterval`: Controlla tutti i file per le modifiche più volte al secondo, ma utilizzando l'euristica per controllare alcuni tipi di file più spesso di altri.
- `dynamicPriorityPolling`: Utilizza una coda dinamica in cui i file meno modificati vengono controllati meno frequentemente.
- `useFsEvents` (modelo): Tentativi di utilizzare la funzionalità degli eventi di modifica dei file nativi del sistema operativo.
- `useFsEventsOnParentDirectory`: Tentativi di utilizzare l'implementazione nativa del sistema operativo degli eventi di modifica per rilevare le modifiche alla directory padre di un file.
