---
title: TypeScript para o Novo Programador
short: TS para o Novo Programador
layout: docs
permalink: /pt/docs/handbook/typescript-from-scratch.html
oneline: Aprenda TypeScript do zero
---

Parabéns por escolher TypeScript como uma das suas primeiras linguagens - você já está fazendo boas decisões!

Você provavelmente já deve ter ouvido que TypeScript é um "sabor" ou uma "variante" do JavaScript. O relacionamento entre TypeScript (TS) e JavaScript (JS) é único entre linguagens de programação modernas, então aprender mais sobre esse relacionamento vai te ajudar a entender como TypeScript soma ao JavaScript.

## O Que é JavaScript? Uma Breve História

JavaScript (também conhecido como ECMAScript) começou sua vida como uma lingaugem de script simples para navegadores. Na época em que foi inventada, sempre foi esperado que fosse usada para pequenos snippets de código embarcados em uma página web - escrevendo mais do que uma dúzia de linhas de código seria algo incomum. Por isso, navegadores jovens da época executavam tal código bem devagar. Entretanto, com o tempo, JS se tornou mais e mais popular e desenvolvedores web começaram a usar ele para criar experiências interativas.

Desenvolvedores de navegadores web responderam a esse uso aumentado de JS otimizando seus motores de execução (compilação dinâmica) e extendendo o que poderia ser feito com ele (adicionando APIs), o que por sua vez fez os desenvolvedores web o usarem ainda mais. Em websites modernos, seu browser frequentemente está rodando aplicações que têm centenas de milhares de linhas de código. Esse é o crescimento longo e gradual da "web", começando como uma rede simples de páginas estáticas e evoluindo em uma plataforma para _aplicações_ ricas de todos os tipos.

Mais do que isso, JS se tornou popular o suficiente para ser usado fora do contexto de navegadores, como a implementação de servidores JS usando node.js. A natureza de "rodar em qualquer lugar" do JS faz ele ser uma escolha atrativa para desenvolvimento multiplataforma. Há muitos desenvolvedores nesses dias que usam _apenas_ JavaScript para programar toda seu conjunto de aplicações!

Para resumir, nós temos uma linguagem que foi desenvolvida para usos rápidos e então cresceu para uma ferramenta completa para escrever aplicações com milhões de linhas. Toda linguagem tem suas próprias _individualidades_ - uniquicidades e surpresas e o começo humilde do JavaScript faz com que ele tenha _muitas_ dessas. Alguns exemplos:

- O operador de igualidade do JavaScript (`==`) _coage_ seus argumentos, levando a comportamento inesperado:

  ```js
  if ('' == 0) {
  	// É! mas porque??
  }
  if (1 < x < 3) {
  	// Verdadeiro para qualquer valor de x!
  }
  ```

- JavaScript também permite acessar propriedades que não estão presentes:

  ```js
  const obj = { width: 10, height: 15 };
  // Porque isso é NaN? Ortografia é difícil!
  const area = obj.width * obj.heigth;
  ```

A maioria das linguagens de programação lançariam um erro quando esse tipo de situação ocorresse, algumas fariam isso em tempo de compilação - antes de qualquer código estar sendo executado. Quando escrevendo programas pequenos, tais individualidades são irritantes mas gerenciáveis; quando escrevendo aplicações com centenas ou milhares de linhas de código, essas surpresas constantes são um problema sério.

## TypeScript: Um Verificador de Tipos Estáticos

Nós dissemos antes que algumas linguagens não permitiriam esses programas bugados nem serem executados. Detecção de erros sem execução do código é chamada de _verificação estática_. Determinar o que é um erro e o que não é baseado nos tipos dos valores sendo operados é chamado de verificação estática de _tipos_.

TypeScript verifica um programa por erros antes de sua execução e faz isso baseado nos _tipos dos valores_, é um _verificador de tipo estático_. Por exemplo, o último exemplo acima tem um erro por causa do _tipo_ de `obj`. Aqui está o erro que o TypeScript encontra:

```ts twoslash
// @errors: 2551
const obj = { width: 10, height: 15 };
const area = obj.width * obj.heigth;
```

### Um Superconjunto Tipado de JavaScript

Como TypeScript se realaciona com JavaScript então?

#### Sintaxe

TypeScript é uma linguagem que é um _superconjunto_ de JavaScript: sintaxe JS é, logo, válida em TS. Sintaxe se refere à forma que escrevemos texto para formar um programa. Por exemplo, este código tem um erro de _sintaxe_ porque falta um `)`:

```ts twoslash
// @errors: 1005
let a = (4
```

TypeScript não considera qualquer código JavaScript como um erro por sua sintaxe. Isso significa que você pode pegar qualquer código funcional JavaScript e colocar em um arquivo TypeScript sem se preocupar em como está escrito.

#### Tipos

Entretanto, TypeScript é um superconjunto _tipado_, significando que adiciona regras sobre como diferentes tipos de valores podem ser usados. O erro anterior sobre `obj.heigth` não era um erro de _sintaxe_: é um erro de uso de um tipo de valor (um _tipo_) de uma maneira incorreta.

Como outro exemplo, isso é um código JavaScript que você pode rodar no seu browser e ele _vai_ exibir um valor:

```js
console.log(4 / []);
```

Este programa sintaticamente legal exibe `Infinity`. TypeScript por sua vez considera a divisão de um número por um array uma operação sem sentido e vai exibir um erro:

```ts twoslash
// @errors: 2363
console.log(4 / []);
```

É possível que você realmente _queira_ dividir um núemro po rum array, talvez só para ver o que acontece, mas na maior parte do tempo isso é um erro de programação. O verificador de tipo do TypeScript é desenvolvido para permitir programas corretos enquanto previne quantos erros comuns forem possíveis. (Mais tarde, aprenderemos sobre configurações que você pode usar para configurar quão estritamente o TypeScript verifica seu código.)

Se você move algum código de um arquivo JavaScript para um arquivo TypeScript, você pode ver _erros de tipo_ dependendo de como o código é escrito. Esses podem ser problemas legítimos com o código ou TypeScript sendo conservador em excesso. Por meio deste guia nós vamos demonstrar como adicionar várias sintaxes do TypeScript para eliminar tais erros.

#### Comportamento em Tempo de Execução

TypeScript também é uma linguagem de programação que preserva o _comportamento de tempo de execução_ do JavaScript. Por exemplo, dividir por zero em JavaScript produz `Infinity` ao invés de lançar um erro em tempo de execução. Como um princípio, o TypeScript **nunca** muda o comporatmento de tempo de execução de código JavaScript.

Isso significa que você mover código do JavaScript do TypeScript, é **garantido** que vai rodar da mesma forma mesmo que o TypeScript pensa que o código tem erros de tipos.

Mantendo o mesmo comportamento em tempo de execução que o JavaScript é uma promessa fundamental do TypeScript porque significa que você pode facilmente transitar entre duas linguagens sem se preocupar com diferenças sutis que podem fazer seu programa parar de funcionar.

<!--
Subseção removida sobre o fato de que TS extende o JS para adicionar sintaxe de especificação de tipo.  (Já que o texto anterior já fala sobre como código JS pode ser usado em TS.)
-->

#### Tipos Apagados

A grosso modo, uma vez que o compilador do TypeScript terminou de verificar o seu código, ele _apaga_ os tipos para produzir o código resultante "compilado". Isso significa que uma vez que seu código for compilado, o código JS puro de resultado não tem informação de tipo.

Isso também significa que o TypeScript nunca muda o _comportamento_ do seu programa baseado nos tipos que infere. O fim disso é que enquanto você vê erros de tipo durante a compilação, o sistema de tipos em si não tem influência sobre como seu programa funciona quando roda.

Finalmente, TypeScript não fornece nenhuma biblioteca de tempo de execução adicional. Seus programas vão usar as mesmas bibliotecas padrão (ou externas) que os programas JavaScript, então não há ferramentas específicas do TypeScript adicionais para se aprender.

<!--
Deveria extender este parágrafo para dizer que há uma exceção de permitir que você use novas funcionalidades do JS e transpilar o código para um JS mais antigo e isso pode adicionar alguns contratempos de funcionalidades quando necessário. (Talvez com um exemplo --- algo como `?.` seria bom em mostrar aos leitores que este documento é mantido.)
-->

## Aprendendo JavaScript e TypeScript

Nós frequentemente vemos a questão "Eu deveria aprender JavaScript ou TypeScript?".

A resposta é que vocẽ não pode aprender TypeScript sem aprender JavaScript! TypeScript compartilha sintaxe e comportamento de tempo de execução com JavaScript, então qualquer coisa que você queira aprender sobre JavaScript estará ajudando você a aprender TypeScript ao mesmo tempo.

Hà muitos, muitos recursos disponíveis para programadores aprenderem JavaScript; você _não_ deveria ignorar estes recursos se você está escrevendo TypeScript. Por exemplo, há cerca de 20 vezes mais questões no StackOverflow marcadas com `javascript` do que com `typescript`, mas _todas_ as questões `javascript` também se aplicam ao TypeScript.

Se você se encontra procurando por algo como "como organizar uma lista em TypeScript", lembre-se: **TypeSript é o ambiente de execução do JavaScript com verificador de tipo em tempo de compilação**. A forma com que você organiza uma lista em TypeScript é a mesma no JavaScript. Se você encontrar um recurso que usa TypeScript diretamente isso é ótimo também, mas não se limite a pensar que você precisa de respostas específicas do TypeScript para questões do dia a dia sobre como alcançar tarefas do ambiente de execução.

## Próximos Passos

Esse foi um pequeno resumo da sintaxe e ferramentas usadas no TypeScript no dia-a-dia. Daqui, você pode:

- Aprender alguns fundamentos do JavaScript, nós recomendamos:

  - [Microsoft's JavaScript Resources](https://docs.microsoft.com/javascript/) or
  - [JavaScript guide at the Mozilla Web Docs](https://developer.mozilla.org/docs/Web/JavaScript/Guide)

- Continuar para [TypeScript para programadores JavaScript](/docs/handbook/typescript-in-5-minutes.html)
- Ler o Handbook completo [from start to finish](/docs/handbook/intro.html) (30m)
- Explorar os [exemplos do Playground](/play#show-examples)

<!-- Nota: Estaria feliz em escrever sobre os seguintes... -->
<!--
## Tipos

    * O que é um tipo? (For newbies)
      * Um tipo é um *formato* de um valor
      * Tipos definem implicitamente quais operadores fazem sentido para eles
      * Muitos formatos diferentes, não só primitivos
      * Nós podemos fazer descrições para todos os formatos de valores
      * O tipo `any` -- uma descrição rápida, o que é e porque é ruim
    * Inferência Básica
      * Exemplos
      * TypeScript pode descobrir tipos na maior parte do tempo
      * Dois lugares onde vamos te perguntar o tipo são: Parâmetros de funções e valores inicializados tardiamente
    * Co-aprendendo JavaScript
      * Você pode+deve ler recursos JS existentes
      * Apenas cole e veja o que acontece
      * Considere desligar o modo 'strict' -->
