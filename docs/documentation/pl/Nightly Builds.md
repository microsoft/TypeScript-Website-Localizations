---
title: Nocna kompilacja
layout: docs
permalink: /pl//docs/handbook/nightly-builds.html
oneline: Jak korzystać z nocnej kompilacji języka TypeScript
translatable: true
---

Nocna kompilacja z gałęzi „master” [TypeScript](https://github.com/Microsoft/TypeScript/tree/master) jest publikowana o północy czasu PST do npm.
Oto, jak możesz go pobrać i używać ze swoimi narzędziami.

## Używając npm

```shell
npm install -g typescript@next
```

## Aktualizując IDE, aby korzystało z nocnych kompilacji

Możesz także zaktualizować swoje IDE, aby korzystać z nocnego zrzutu.
Najpierw musisz zainstalować pakiet przez npm.
Możesz zainstalować pakiet npm globalnie lub w lokalnym folderze `node_modules`.

W pozostałej części tej sekcji założono, że `typescript@next` jest już zainstalowany.

### Visual Studio Code

Zaktualizuj plik `.vscode / settings.json`, dodając:

```json
"typescript.tsdk": "<ścieżka do twojego folderu>/node_modules/typescript/lib"
```

Więcej informacji można znaleźć pod adresem [Dokumentacja VSCode](https://code.visualstudio.com/Docs/languages/typescript#_using-newer-typescript-versions).

### Sublime Text

Zaktualizuj plik `Settings - User`, dodając:

```json
"typescript_tsdk": "<ścieżka do twojego folderu>/node_modules/typescript/lib"
```

Więcej informacji można znaleźć pod adresem [Dokumentacja dotycząca instalacji wtyczki TypeScript do Sublime Text](https://github.com/Microsoft/TypeScript-Sublime-Plugin#installation).

### Visual Studio 2013 oraz 2015

> Uwaga: większość zmian nie wymaga instalowania nowej wersji wtyczki VS TypeScript.

Wersja nocna obecnie nie zawiera pełnej konfiguracji wtyczki, ale pracujemy również nad publikacją instalatora co noc.

1. Pobierz skrypt [VSDevMode.ps1](https://github.com/Microsoft/TypeScript/blob/master/scripts/VSDevMode.ps1).

   > Zobacz także naszą stronę wiki na [przy użyciu pliku usługi języka niestandardowego](https://github.com/Microsoft/TypeScript/wiki/Dev-Mode-in-Visual-Studio#using-a-custom-language-service-file).

2. W oknie poleceń programu PowerShell uruchom:

Dla VS 2015:

```posh
VSDevMode.ps1 14 -tsScript <ścieżka do twojego folderu>/node_modules/typescript/lib
```

Dla VS 2013:

```posh
VSDevMode.ps1 12 -tsScript <ścieżka do twojego folderu>/node_modules/typescript/lib
```

### IntelliJ IDEA (Mac)

Idź do `Preferences` > `Languages & Frameworks` > `TypeScript`:

> TypeScript Version: jeśli zainstalowano z npm: `/usr/local/lib/node_modules/typescript/lib`

### IntelliJ IDEA (Windows)

Idź do `File` > `Settings` > `Languages & Frameworks` > `TypeScript`:

> TypeScript Version: jeśli zainstalowano z npm: `C:\Users\USERNAME\AppData\Roaming\npm\node_modules\typescript\lib`
