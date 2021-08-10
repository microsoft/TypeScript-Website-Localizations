---
title: Introdução
layout: docs
permalink: /pt/docs/handbook/declaration-files/introduction.html
oneline: "Como escrever um Arquivo de Declaração TypeScript (d.ts) de alta qualidade"
---

A seção Arquivos de declaração é designada a ensinar você como escrever um Arquivo de Declaração TypeScript de alta qualidade. Precisamos assumir uma familiaridade básica com a linguagem TypeScript para começar.

Caso ainda não tenha feito, você deveria ler o [Manual do TypeScript](/docs/handbook/basic-types.html)
<!-- para você mesmo se familiarizar com conceitos básicos, especialmente tipos e módulos. -->

O caso mais comum para aprender como os arquivos .d.ts funcionam é quando você está escrevendo um pacote npm sem tipos.
Nesse caso, você pode ir direto para [Módulos .d.ts](/docs/handbook/declaration-files/templates/module-d-ts.html).

A seção Arquivos de declaração é dividida nas seguintes partes:

## [Referência de Declaração](/docs/handbook/declaration-files/by-example.html)

Nós geralmente enfrentamos a tarefa de escrever um arquivo de declaração somente quando temos exemplos da biblioteca subjacente para nos orientar.
A seção [Referência de declaração](/docs/handbook/declaration-files/by-example.html) mostra vários padrões comuns de API e como escrever declarações para cada um deles.
Este guia é voltado aos iniciantes em TypeScript que talvez não estejam ainda familiarizados com todas as construções de linguagem em TypeScript.

## [Estruturas da Biblioteca](/docs/handbook/declaration-files/library-structures.html)

O guia [Estruturas da Biblioteca](/docs/handbook/declaration-files/library-structures.html) ajuda você a entender formatos comuns de biblioteca e como escrever um arquivo de declaração apropriado para cada formato.
Se você está editando um arquivo existente, você provavelmente não precisa ler esta seção.
Autores de novos arquivos de declaração recomendam fortemente a leitura desta seção para entender propriamente como o formato da biblioteca influencia a escrita do arquivo de declaração.

Na seção Template você encontrará vários arquivos de declaração que servem como um ponto de partida útil quando se está escrevendo um novo arquivo. Se você já conhece a sua estrutura, veja a seção Template d.ts na barra lateral.

## [O que fazer e o que Não fazer](/docs/handbook/declaration-files/do-s-and-don-ts.html)

Muitos erros comuns em arquivos de declaração podem ser facilmente evitados.
A seção [O que fazer e o que Não fazer](/docs/handbook/declaration-files/do-s-and-don-ts.html) identifica erros comuns, 
descreve como detectá-los, e como corrigi-los.
Todos devem ler esta seção para evitar erros comuns.

## [Análise profunda](/docs/handbook/declaration-files/deep-dive.html)

Para autores experientes interessados na mecânica por trás dos arquivos de declaração,
a seção [Análise profunda](/docs/handbook/declaration-files/deep-dive.html) explica vários conceitos avançados na escrita da declaração, 
e mostra como aproveitar esses conceitos para criar arquivos de declaração limpos e mais intuitivos.

## [Publicar no npm](/docs/handbook/declaration-files/publishing.html)

A seção [Publicação](/docs/handbook/declaration-files/publishing.html) explica como publicar seus arquivos de declaração em um pacote npm, e como gerenciar seus pacotes dependentes.

## [Buscar e instalar Arquivos de Declaração](/docs/handbook/declaration-files/consumption.html)

Para usuário de bibliotecas Javascript, a seção [Consumo](/docs/handbook/declaration-files/consumption.html) oferece alguns passos para localizar e instalar arquivos de declaração correspondentes.
