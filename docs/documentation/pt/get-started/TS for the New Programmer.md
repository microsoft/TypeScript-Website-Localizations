---
title: TypeScript para o novo programador
short: TS para o novo programador
layout: docs
permalink: /pt/docs/handbook/typescript-from-scratch.html
oneline: Aprenda TypeScript do zero
---

Parabéns por escolher o TypeScript como uma das suas primeiras linguagens de programação - você já começou tomando boas decisões.

Você provavelmente já ouviu falar que TypeScript é um "sabor" ou "variante" do JavaScript.

O TypeScript (TS) e o JavaScript (JS) mantém uma relação única dentre as linguagens de programação modernas, então aprender mais sobre esta relação lhe ajudará a entender de que forma o TypeScript amplia o JavaScript.

## O que é o JavaScript? Uma breve história

JavaScript (também conhecido como ECMAScript) iniciou a sua vida como uma simples linguagem de scripting para browsers.
Na época em que foi inventado, esperava-se que ele seria utilizado para embutir pequenas porções de código em uma página web - logo, escrever scripts com mais de algumas dezenas de linhas seria algo incomum. Devido a isto, os primeiros browsers executavam este código de forma bastante lenta.
Ao longo do tempo, no entanto, o JS se tornou mais e mais popular, e desenvolvedores web começaram a utilizá-lo para criar experiências web interativas.

Desenvolvedores de browsers responderam a este aumento do uso do JS otimizando as suas engines de execução (compilação dinâmica) e estendendo o que poderia ser feito com elas (adicionando APIs), o que por sua vez fez com que os desenvolvedores web utilizassem a linguagem ainda mais.
Em sites modernos, o seu browser está frequentemente rodando aplicações que contém centenas de milhares de linhas de código.
Este é o longo e gradual crescimento da web, que iniciou como uma simples rede de páginas estáticas, e evoluiu para uma plataforma para todos os tipos de _aplicações_ ricas.

Mais do que isto, JS se tornou popular o suficiente para ser utilizada fora do contexto dos browsers, como para implementar servidores em JS usando node.js.
A natureza "rode em qualquer lugar" do JS o fez uma escolha atrativa para o desenvolvimento entre plataformas.
Hoje em dia existem muitos desenvolvedores que utilizam _somente_ JavaScript em toda a sua _stack_ de tecnologia!

Para resumir, nós temos uma linguagem que foi projetada para usos rápidos, e que se tornou uma ferramenta completa para escrita de aplicações com milhões de linhas.
Toda linguagem tem suas próprias _peculiaridades_ - estranhezas e surpresas, e o início humilde do JavaScript a fez ter muitas dessas peculiaridades. Alguns exemplos:

- O operador de igualdade do JavaScript (`==`) _modifica_ os seus argumentos, levando a comportamentos inesperados:

  ```js
  if ("" == 0) {
    // É verdade! Mas por quê?
  }
  if (1 < x < 3) {
    // Verdade para *qualquer* valor de x!
  }
  ```

- JavaScript também nos permite acessar propriedades que não estão presentes:

  ```js
  const obj = { width: 10, height: 15 };
  // Por que isso é NaN? Difícil de dizer!
  const area = obj.width * obj.heigth;
  ```

Muitas linguagens de programação iriam disparar um erro na ocorrência de algumas dessas condições, outras iriam fazê-lo durante a compilação - antes de qualquer código ser executado.
Quando você escreve pequenos programas, algumas peculiaridades podem ser irritantes mas administráveis; porém quando você escreve centenas ou milhares de linhas de código, estas constantes surpresas podem se tornar um problema sério.

## TypeScript: Um verificador de tipo estático

Nós dissemos anteriormente que algumas linguagens de programação não iriam permitir nem a inicialização de programas bugados.
A detecção de erros no código sem a necessidade de executá-los é conhecido como _checagem estática_.
Determinar o que é um erro e o que não é baseado nos tipos dos valores que estão sendo trabalhados é conhecido como checagem estática de _tipos_.

O TypeScript procura erros em programas antes mesmo deles serem executados, e faz isso baseando-se nos _tipo dos valores_ que estão sendo utilizados, logo ele é um _verificador de tipo estático_
Por exemplo, o último exemplo acima tem um erro devido ao _tipo_ da variável `obj`.
Aqui está o erro que o TypeScript encontrou:

```ts twoslash
// @errors: 2551
const obj = { width: 10, height: 15 };
const area = obj.width * obj.heigth;
```

### Um superset (super conjunto) tipado do JavaScript

Então, de que forma o TypeScript se relaciona com o JavaScript?

#### Sintaxe

O TypeScript é uma linguagem que é um _superset_ do JavaScript: logo a sintaxe do JS é permitida dentro do TS.
A sintaxe se refere à maneira pela qual nós escrevemos o texto que forma o programa.
Por exemplo, o código abaixo tem um erro de _sintaxe_ porque falta um `)`:

```ts twoslash
// @errors: 1005
let a = (4
```

O TypeScript não considera nenhum código JavaScript como sendo um erro por conta de sua sintaxe.
Isto significa que você pode pegar qualquer código JavaScript válido e colocá-lo em um arquivo TypeScript sem se preocupar como ele foi escrito exatamente.

#### Tipos

Entretanto, TypeScript é um superset _tipado_, o que significa que ele tem regras extras sobre como diferentes tipos de valores podem ser utilizados.
O erro anterior do `obj.heigth` não foi um erro de _sintaxe_, ele foi um erro sobre utilizar um _tipo_ de valor de forma incorreta.

Neste outro exemplo, temos um código JavaScript que vai executar normalmente em seu browser, imprimindo um valor no console:

```js
console.log(4 / []);
```

Este programa, que é sintaticamente correto, irá imprimir `Infinity` no console.
O TypeScript, por outro lado, considera a divisão de um número por um array uma operação sem sentido, o que vai fazê-lo disparar um erro:

```ts twoslash
// @errors: 2363
console.log(4 / []);
```

É possível que você realmente _queria_ dividir um número por um array, talvez somente para ver o que acontece. Mas na maioria dos casos, no entanto, este é um erro de programação.
O verificador de tipo do TypeScript é projetado para permitir a execução de programas corretos, enquanto captura o máximo de erros comuns possível.
(Mais tarde, aprenderemos sobre as configurações que você pode usar para definir como o TypeScript verifica estritamente o seu código.)

Se você mover algum código de um arquivo JavaScript para um arquivo TypeScript, você provavelmente irá ver _erros de tipo_ a depender de como o seu código foi escrito.
Eles podem ser problemas legítimos com o seu código, ou o TypeScript pode estar sendo muito conservador com o mesmo.
Ao longo deste guia nós iremos demonstrar como adicionar alguma sintaxe TypeScript para eliminar tais erros.

#### Comportamento em Runtime (tempo de execução)

O TypeScript é também uma linguagem de programação que preserva o _comportamento de runtime_ do JavaScript.
Por exemplo, a divisão por zero em JavaScript produz `Infinity` ao invés de disparar uma exceção em tempo de execução.
Como princípio, o TypeScript **nunca** muda o comportamento em runtime de um código JavaScript.

Isto significa que se você mover algum código JavaScript para o TypeScript, é **garantido** que ele irá executar da mesma forma, mesmo se o TypeScript pensar que ele tem alguns erros de tipos.

Manter a mesma característica de runtime do JavaScript é uma promessa fundamental do TypeScript pois isto significa que você pode facilmente migrar entre as duas linguagens sem se preocupar com difereças sutis que podem fazer o seu programa parar de rodar.

<!--
Missing subsection on the fact that TS extends JS to add syntax for type
specification.  (Since the immediately preceding text was raving about
how JS code can be used in TS.)
-->

#### Tipos Apagados

A grosso modo, uma vez que o compilador TypeScript finaliza a checagem do seu código, ele _apaga_ os tipos para produzir o código "compilado".
Isto significa que uma vez que o seu código é compilado, o código JS resultante não tem nenhuma informação de tipos.

Isto também significa que o TypeScript nunca muda o _comportamento_ do seu programa baseado nos tipos inferidos.
O resultado final é que enquanto você pode ver erros de tipo durante a compilação, o sistema de tipos em si não tem influência na forma pela qual o seu programa trabalha em tempo de execução.

Finalmente, TypeScript não fornece nenhuma biblioteca adicional em runtime.
Seus programas irão utilizar a mesma biblioteca padrão (ou bibliotecas externas) que os programas JavaScript, logo não existe nenhum framework específico do TypeScript para aprender.

<!--
Should extend this paragraph to say that there's an exception of
allowing you to use newer JS features and transpile the code to an older
JS, and this might add small stubs of functionality when needed.  (Maybe
with an example --- something like `?.` would be good in showing readers
that this document is maintained.)
-->

## Aprendendo JavaScript e TypeScript

Nós frequentemente vemos a pergunta "Devo aprender JavaScript ou TypeScript?".

A resposta é que você não pode aprender TypeScript sem aprender JavaScript!
O TypeScript compartilha a sintaxe e o comportamento em tempo de execução do JavaScript, logo qualquer coisa que você aprender sobre o JavaScript irá ao mesmo tempo ajudá-lo com o TypeScript.

Existem muitos recursos disponíveis para programadores aprenderem JavaScript; você _não_ deve ignorar estes recursos se estiver escrevendo TypeScript.
Por exemplo, no StackOverflow existem 20 vezes mais questões com a tag `javascript` do que a tag `typescript`, mas _todas_ as perguntas taggeadas com `javascript` são aplicáveis ao TypeScript.

Se você se ver procurando por algo do tipo "como ordenar uma lista em TypeScript", lembre-se: **TypeScript é a _runtime_ do JavaScript com um analisador de tipos em tempo de compilação**.
A maneira de ordenar uma lista em TypeScript é a mesma que você utiliza para fazê-lo no JavaScript.
Se você encontrar algum recurso que utiliza TypeScript diretamente, ótimo, mas não se limite a pensar que você precisa de algo específico do TypeScript para questões do dia-a-dia sobre como executar tarefas em tempo de execução

## Próximos passos

Esta foi um breve resumo da sintaxe e ferramentas usadas no dia-a-dia do TypeScript. A partir daqui, você pode:

- Aprender alguns fundamentos do JavaScript, através de:

  - [Recursos JavaScript da Microsoft](https://docs.microsoft.com/javascript/) ou
  - [Guia de JavaScript na Mozilla Web Docs](https://developer.mozilla.org/docs/Web/JavaScript/Guide)

- Continue para [TypeScript for JavaScript Programmers](/docs/handbook/typescript-in-5-minutes.html)
- Leia o Handbook completo [from start to finish](/docs/handbook/intro.html) (30m)
- Explore [Exemplos do playground](/play#show-examples)

<!-- Note: I'll be happy to write the following... -->
<!--
## Types

    * What's a type? (For newbies)
      * A type is a *kind* of value
      * Types implicitly define what operations make sense on them
      * Lots of different kinds, not just primitives
      * We can make descriptions for all kinds of values
      * The `any` type -- a quick desctiption, what it is, and why it's bad
    * Inference 101
      * Examples
      * TypeScript can figure out types most of the time
      * Two places we'll ask you what the type is: Function boundaries, and later-initialized values
    * Co-learning JavaScript
      * You can+should read existing JS resources
      * Just paste it in and see what happens
      * Consider turning off 'strict' -->
