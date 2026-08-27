---
title: Declarações de Tipo
layout: docs
permalink: /pt/docs/handbook/2/type-declarations.html
oneline: "Como o TypeScript fornece tipos para JavaScript não tipado."
---

Ao longo das seções que você leu até agora, estivemos demonstrando conceitos básicos do TypeScript usando as funções embutidas presentes em todos os runtimes de JavaScript.
No entanto, quase todo JavaScript hoje inclui muitas bibliotecas para realizar tarefas comuns.
Ter tipos para as partes da sua aplicação que _não são_ o seu código vai melhorar muito a sua experiência com TypeScript.
De onde vêm esses tipos?

## Com o Que se Parecem as Declarações de Tipo?

Digamos que você escreva um código como este:

```ts twoslash
// @errors: 2339
const k = Math.max(5, 6);
const j = Math.mix(7, 8);
```

Como o TypeScript sabia que `max` estava presente, mas `mix` não, mesmo que a implementação de `Math` não fizesse parte do seu código?

A resposta é que existem _arquivos de declaração_ (declaration files) descrevendo esses objetos embutidos.
Um arquivo de declaração fornece uma forma de _declarar_ a existência de alguns tipos ou valores sem realmente fornecer implementações para esses valores.

## Arquivos `.d.ts`

O TypeScript tem dois tipos principais de arquivos.
Arquivos `.ts` são arquivos de _implementação_ que contêm tipos e código executável.
Esses são os arquivos que produzem saídas `.js`, e são onde você normalmente escreveria seu código.

Arquivos `.d.ts` são arquivos de _declaração_ que contêm _apenas_ informação de tipo.
Esses arquivos não produzem saídas `.js`; eles são usados apenas para verificação de tipos.
Vamos aprender mais sobre como escrever nossos próprios arquivos de declaração mais tarde.

## Definições de Tipo Embutidas

O TypeScript inclui arquivos de declaração para todas as APIs embutidas padronizadas disponíveis nos runtimes de JavaScript.
Isso inclui coisas como métodos e propriedades de tipos embutidos como `string` ou `function`, nomes de nível superior como `Math` e `Object`, e seus tipos associados.
Por padrão, o TypeScript também inclui tipos para coisas disponíveis ao rodar dentro do navegador, como `window` e `document`; estes são coletivamente chamados de APIs do DOM.

O TypeScript nomeia esses arquivos de declaração com o padrão `lib.[algo].d.ts`.
Se você navegar até um arquivo com esse nome, pode saber que está lidando com alguma parte embutida da plataforma, não com código do usuário.

### Configuração `target`

Os métodos, propriedades e funções disponíveis para você variam, na verdade, com base na _versão_ do JavaScript em que seu código está rodando.
Por exemplo, o método `startsWith` de strings está disponível apenas a partir da versão do JavaScript conhecida como _ECMAScript 6_.

Estar ciente de qual versão do JavaScript seu código vai rodar no fim das contas é importante porque você não quer usar APIs que são de uma versão mais nova do que a plataforma na qual você faz deploy.
Esta é uma das funções da configuração de compilador [`target`](/tsconfig#target).

O TypeScript ajuda com esse problema variando quais arquivos `lib` são incluídos por padrão com base na sua configuração [`target`](/tsconfig#target).
Por exemplo, se [`target`](/tsconfig#target) for `ES5`, você vai ver um erro ao tentar usar o método `startsWith`, porque esse método só está disponível no `ES6` ou posterior.

### Configuração `lib`

A configuração [`lib`](/tsconfig#lib) permite um controle mais granular sobre quais arquivos de declaração embutidos são considerados disponíveis no seu programa.
Veja a página de documentação sobre [`lib`](/tsconfig#lib) para mais informações.

## Definições Externas

Para APIs não embutidas, há uma variedade de formas de obter arquivos de declaração.
Como você faz isso depende exatamente de qual biblioteca você está obtendo tipos.

### Tipos Empacotados

Se uma biblioteca que você está usando é publicada como um pacote npm, ela pode já incluir arquivos de declaração de tipo como parte de sua distribuição.
Você pode ler a documentação do projeto para descobrir, ou simplesmente tentar importar o pacote e ver se o TypeScript consegue resolver os tipos automaticamente para você.

Se você é autor de um pacote considerando empacotar definições de tipo com seu pacote, pode ler nosso guia sobre [empacotar definições de tipo](/docs/handbook/declaration-files/publishing.html#including-declarations-in-your-npm-package).

### DefinitelyTyped / `@types`

O [repositório DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped/) é um repo centralizado que armazena arquivos de declaração para milhares de bibliotecas.
A grande maioria das bibliotecas comumente usadas tem arquivos de declaração disponíveis no DefinitelyTyped.

Definições no DefinitelyTyped também são publicadas automaticamente no npm sob o escopo `@types`.
O nome do pacote de tipos é sempre o mesmo que o nome do próprio pacote subjacente.
Por exemplo, se você instalou o pacote npm `react`, pode instalar seus tipos correspondentes rodando

```sh
npm install --save-dev @types/react
```

O TypeScript encontra automaticamente definições de tipo em `node_modules/@types`, então não há nenhum outro passo necessário para deixar esses tipos disponíveis no seu programa.

### Suas Próprias Definições

No caso incomum de uma biblioteca não empacotar seus próprios tipos e não ter uma definição no DefinitelyTyped, você pode escrever um arquivo de declaração você mesmo.
Veja o apêndice [Escrevendo Arquivos de Declaração](/docs/handbook/declaration-files/introduction.html) para um guia.

Se você quiser silenciar avisos sobre um módulo específico sem escrever um arquivo de declaração, também pode declarar rapidamente o módulo como tipo `any` colocando uma declaração vazia para ele em um arquivo `.d.ts` no seu projeto.
Por exemplo, se você quisesse usar um módulo chamado `some-untyped-module` sem ter definições para ele, você escreveria:

```ts twoslash
declare module "some-untyped-module";
```
