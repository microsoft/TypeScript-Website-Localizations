---
title: Entendendo Erros
layout: docs
permalink: /pt/docs/handbook/2/understanding-errors.html
oneline: "Como ler erros do TypeScript."
---

# Entendendo Erros

Sempre que o TypeScript encontra um erro, ele tenta explicar o que deu errado com o máximo de detalhes possível.
Como seu sistema de tipos é estrutural, isso geralmente significa fornecer descrições um tanto longas de onde ele encontrou um problema.

## Terminologia

Existe alguma terminologia que você verá com frequência em mensagens de erro e que é útil entender.

#### _atribuível a_ (assignable to)

O TypeScript considera um tipo _atribuível a_ outro tipo se um for um substituto aceitável para o outro.
Em outras palavras, um `Gato` é _atribuível a_ um `Animal` porque um `Gato` é um substituto aceitável para um `Animal`.

Como o nome indica, essa relação é usada para verificar a validade de uma atribuição `t = s;` examinando os tipos de `t` e `s`.
Também é usada para verificar a maioria dos outros lugares onde dois tipos interagem.
Por exemplo, ao chamar uma função, o tipo de cada argumento deve ser _atribuível ao_ tipo declarado do parâmetro.

Informalmente, se você ver `T não é atribuível a S` (`T is not assignable to S`), pode pensar nisso como o TypeScript dizendo "_`T` e `S` não são compatíveis_".
No entanto, observe que essa é uma relação _direcional_: `S` ser atribuível a `T` não implica que `T` seja atribuível a `S`.

## Exemplos

Vamos olhar para alguns exemplos de mensagens de erro e entender o que está acontecendo.

### Detalhamento de Erros

Cada erro começa com uma mensagem principal, às vezes seguida por mais sub-mensagens.
Você pode pensar em cada sub-mensagem como uma resposta a uma pergunta "por quê?" sobre a mensagem acima dela.
Vamos trabalhar com alguns exemplos para ver como elas funcionam na prática.

Aqui está um exemplo que produz uma mensagem de erro mais longa do que o próprio exemplo:

```ts twoslash
// @errors: 2322
let a: { m: number[] };
let b = { m: [""] };
a = b;
```

O TypeScript encontrou um erro ao verificar a última linha.
Sua lógica para emitir um erro segue da sua lógica para determinar se a atribuição é válida:

1. O tipo de `b` é atribuível ao de `a`? Não. Por quê?
2. Porque o tipo da propriedade `m` é incompatível. Por quê?
3. Porque a propriedade `m` de `b` (`string[]`) não é atribuível à propriedade `m` de `a` (`number[]`). Por quê?
4. Porque o tipo de elemento de um array (`string`) não é atribuível ao do outro (`number`)

### Propriedades Extras

```ts twoslash
// @errors: 2322
type A = { m: number };
const a: A = { m: 10, n: "" };
```

### Atribuições de União

```ts twoslash
// @errors: 2322
type Thing = "none" | { name: string };

const a: Thing = { name: 0 };
```
