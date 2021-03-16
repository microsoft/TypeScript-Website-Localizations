---
title: Consumption
layout: docs
permalink: /pt/docs/handbook/declaration-files/consumption.html
oneline: "Como baixar arquivos d.ts para seu projeto"
---

## Baixando

Obter declarações de tipo não requer ferramentas além do npm.

Como um exemplo, obter as declarações para uma biblioteca como lodash não requer nada mais do que o seguinte comando

```cmd
npm install --save-dev @types/lodash
```
Repare que se o pacote npm já inclui seu arrquivo de declaração como descrito em [Publicando](/docs/handbook/declaration-files/publishing.html), baixar o pacote `@types` correspondente não é necessário.

## Consumindo

A partir daí, você poderá usar lodash em seu código TypeScript sem problemas.
Isso funciona para ambos os módulos e código global.

Por exemplo, uma vez que você tenha instalado suas declaração de tipo, você pode usar importações e escrever 

```ts
import * as _ from "lodash";
_.padStart("Hello TypeScript!", 20, " ");
```

ou se você não estiver usando módulos, você pode apenas usar a variaável global `_`.

```ts
_.padStart("Hello TypeScript!", 20, " ");
```

## Procurando

A maioria das vezes, pacotes de declaração de tipo devem sempre ter o mesmo nome que o nome do pacote `npm`, mas prefixado com `@types/`,
mas se você precisar, você pode verificar isso [Pesquisa de Tipo](https://aka.ms/types) para achar o pacote da sua bibliote favorita.

> Nota: Se a declaração do arquivo que você está pesquisando não estiver presente, você pode sempre contribuir de volta e ajudar o próximo desenvolvedor que estiver procurando por isso.
> Por favor consulte o DefinitelyTyped [página de guia de contribuição](http://definitelytyped.org/guides/contributing.html) para detalhes.