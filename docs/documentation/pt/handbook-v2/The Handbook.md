---
title: O Manual do TypeScript
layout: docs
permalink: /pt/docs/handbook/intro.html
oneline: Seu primeiro passo para aprender TypeScript
handbook: "true"
---

## Sobre este Manual

Mais de 20 anos após sua introdução à comunidade de programação, o JavaScript é hoje uma das linguagens multiplataforma mais difundidas já criadas. Tendo começado como uma pequena linguagem de script para adicionar interatividade trivial a páginas web, o JavaScript cresceu até se tornar uma das linguagens preferidas para aplicações frontend e backend de todos os tamanhos. Embora o tamanho, o escopo e a complexidade dos programas escritos em JavaScript tenham crescido exponencialmente, a capacidade da linguagem JavaScript de expressar as relações entre diferentes unidades de código não acompanhou esse crescimento. Combinada com a semântica de execução (runtime) um tanto peculiar do JavaScript, essa incompatibilidade entre a linguagem e a complexidade dos programas tornou o desenvolvimento em JavaScript uma tarefa difícil de gerenciar em escala.

Os tipos de erro mais comuns que os programadores cometem podem ser descritos como erros de tipo: um certo tipo de valor foi usado onde um tipo diferente de valor era esperado. Isso pode acontecer por causa de simples erros de digitação, de uma falha em entender a superfície de API de uma biblioteca, de suposições incorretas sobre o comportamento em tempo de execução ou de outros erros. O objetivo do TypeScript é ser um verificador estático de tipos para programas JavaScript — em outras palavras, uma ferramenta que roda antes do seu código rodar (estático) e garante que os tipos do programa estão corretos (verificação de tipos).

Se você está chegando ao TypeScript sem experiência prévia em JavaScript, com a intenção de que o TypeScript seja sua primeira linguagem, recomendamos que comece lendo a documentação no [tutorial de JavaScript da Microsoft Learn](https://developer.microsoft.com/javascript/) ou leia o [JavaScript nas Mozilla Web Docs](https://developer.mozilla.org/docs/Web/JavaScript/Guide).
Se você tem experiência em outras linguagens, deve conseguir pegar a sintaxe do JavaScript bem rápido lendo o manual.

## Como este Manual está Estruturado

O manual está dividido em duas seções:

- **O Manual (The Handbook)**

  O Manual do TypeScript pretende ser um documento abrangente que explica o TypeScript para programadores do dia a dia. Você pode lê-lo seguindo de cima para baixo na navegação à esquerda.

  Você deve esperar que cada capítulo ou página lhe proporcione um entendimento sólido dos conceitos apresentados. O Manual do TypeScript não é uma especificação completa da linguagem, mas pretende ser um guia abrangente de todos os recursos e comportamentos da linguagem.

  Um leitor que concluir o percurso deve ser capaz de:

  - Ler e entender a sintaxe e os padrões do TypeScript comumente usados
  - Explicar os efeitos de opções importantes do compilador
  - Prever corretamente o comportamento do sistema de tipos na maioria dos casos

  No interesse da clareza e da concisão, o conteúdo principal do Manual não vai explorar cada caso extremo ou minúcia dos recursos abordados. Você pode encontrar mais detalhes sobre conceitos específicos nos artigos de referência.

- **Arquivos de Referência (Reference Files)**

  A seção de referência, abaixo do manual na navegação, foi construída para fornecer um entendimento mais rico de como uma parte específica do TypeScript funciona. Você pode lê-la de cima para baixo, mas cada seção tem como objetivo fornecer uma explicação mais profunda de um único conceito — ou seja, não há intenção de continuidade.

### Não-Objetivos

O Manual também pretende ser um documento conciso que possa ser lido confortavelmente em algumas horas. Certos tópicos não serão abordados para manter as coisas curtas.

Especificamente, o Manual não introduz por completo conceitos básicos do JavaScript como funções, classes e closures. Onde for apropriado, incluiremos links para leitura de base que você pode usar para se aprofundar nesses conceitos.

O Manual também não pretende ser um substituto para uma especificação da linguagem. Em alguns casos, casos extremos ou descrições formais de comportamento serão omitidos em favor de explicações de alto nível e mais fáceis de entender. Em vez disso, existem páginas de referência separadas que descrevem de forma mais precisa e formal muitos aspectos do comportamento do TypeScript. As páginas de referência não são destinadas a leitores não familiarizados com o TypeScript, então elas podem usar terminologia avançada ou referenciar tópicos sobre os quais você ainda não leu.

Por fim, o Manual não vai cobrir como o TypeScript interage com outras ferramentas, exceto quando necessário. Tópicos como configurar o TypeScript com webpack, rollup, parcel, react, babel, closure, lerna, rush, bazel, preact, vue, angular, svelte, jquery, yarn ou npm estão fora do escopo — você encontra esses recursos em outros lugares na web.

## Comece Por Aqui

Antes de começar com [O Básico](/docs/handbook/2/basic-types.html), recomendamos a leitura de uma das páginas introdutórias a seguir. Essas introduções têm o objetivo de destacar as principais semelhanças e diferenças entre o TypeScript e a sua linguagem de programação preferida, além de esclarecer equívocos comuns específicos dessas linguagens.

- [TypeScript para o Novo Programador](/docs/handbook/typescript-from-scratch.html)
- [TypeScript para Programadores JavaScript](/docs/handbook/typescript-in-5-minutes.html)
- [TypeScript para Programadores Java/C#](/docs/handbook/typescript-in-5-minutes-oop.html)
- [TypeScript para Programadores Funcionais](/docs/handbook/typescript-in-5-minutes-func.html)

Caso contrário, vá direto para [O Básico](/docs/handbook/2/basic-types.html).
