---
title: O Básico
layout: docs
permalink: /pt/docs/handbook/2/basic-types.html
oneline: "Primeiro passo no aprendizado de TypeScript: os tipos básicos."
preamble: >
  <p>Bem-vindo à primeira página do manual. Se esta é sua primeira experiência com TypeScript, talvez você prefira começar por um dos guias de '<a href='https://www.typescriptlang.org/pt/docs/handbook/intro.html#comece-por-aqui'>Comece Por Aqui</a>'.</p>
---

Todo e qualquer valor em JavaScript tem um conjunto de comportamentos que você pode observar ao executar diferentes operações.
Isso soa abstrato, mas, como um exemplo rápido, considere algumas operações que poderíamos executar sobre uma variável chamada `message`.

```js
// Acessando a propriedade 'toLowerCase'
// em 'message' e então chamando-a
message.toLowerCase();

// Chamando 'message'
message();
```

Se destrincharmos isso, a primeira linha de código executável acessa uma propriedade chamada `toLowerCase` e então a chama.
A segunda tenta chamar `message` diretamente.

Mas supondo que não saibamos o valor de `message` — e isso é bem comum —, não podemos dizer com segurança quais resultados obteremos ao tentar rodar qualquer parte desse código.
O comportamento de cada operação depende inteiramente de qual valor tínhamos em primeiro lugar.

- `message` é chamável?
- Ela tem uma propriedade chamada `toLowerCase`?
- Se tiver, `toLowerCase` é chamável?
- Se ambos os valores forem chamáveis, o que eles retornam?

As respostas a essas perguntas geralmente são coisas que mantemos em mente quando escrevemos JavaScript, e temos que torcer para ter acertado todos os detalhes.

Digamos que `message` foi definida da seguinte forma.

```js
const message = "Hello World!";
```

Como você provavelmente consegue adivinhar, se tentarmos rodar `message.toLowerCase()`, obteremos a mesma string só que em letras minúsculas.

E quanto àquela segunda linha de código?
Se você é familiarizado com JavaScript, sabe que isso falha com uma exceção:

```txt
TypeError: message is not a function
```

Seria ótimo se pudéssemos evitar erros como esse.

Quando rodamos nosso código, a forma como o runtime do JavaScript escolhe o que fazer é descobrindo o _tipo_ (type) do valor — que tipos de comportamentos e capacidades ele tem.
É em parte disso que aquele `TypeError` está falando — ele está dizendo que a string `"Hello World!"` não pode ser chamada como uma função.

Para alguns valores, como os primitivos `string` e `number`, podemos identificar seu tipo em tempo de execução usando o operador `typeof`.
Mas para outras coisas, como funções, não há um mecanismo correspondente em tempo de execução para identificar seus tipos.
Por exemplo, considere esta função:

```js
function fn(x) {
  return x.flip();
}
```

Podemos _observar_, ao ler o código, que essa função só vai funcionar se receber um objeto com uma propriedade `flip` chamável, mas o JavaScript não expõe essa informação de uma forma que possamos verificar enquanto o código está rodando.
A única maneira, em JavaScript puro, de saber o que `fn` faz com um valor específico é chamá-la e ver o que acontece.
Esse tipo de comportamento torna difícil prever o que o código vai fazer antes de ele rodar, o que significa que é mais difícil saber o que seu código vai fazer enquanto você o escreve.

Visto dessa forma, um _tipo_ é o conceito de descrever quais valores podem ser passados para `fn` e quais vão fazê-la quebrar.
O JavaScript só fornece, de fato, tipagem _dinâmica_ — rodar o código para ver o que acontece.

A alternativa é usar um sistema de tipos _estático_ para fazer previsões sobre o que o código deve fazer _antes_ de ele rodar.

## Verificação estática de tipos

Lembre-se daquele `TypeError` que obtivemos antes ao tentar chamar uma `string` como uma função.
_A maioria das pessoas_ não gosta de receber nenhum tipo de erro ao rodar seu código — esses são considerados bugs!
E quando escrevemos código novo, fazemos o nosso melhor para evitar introduzir novos bugs.

Se adicionarmos só um pouco de código, salvarmos o arquivo, rodarmos o código de novo e imediatamente virmos o erro, talvez consigamos isolar o problema rapidamente; mas nem sempre é assim.
Pode ser que não tenhamos testado o recurso a fundo o suficiente, então talvez nunca cheguemos a esbarrar em um erro em potencial que seria lançado!
Ou, se tivéssemos a sorte de testemunhar o erro, talvez tivéssemos acabado fazendo grandes refatorações e adicionando um monte de código diferente pelo qual somos forçados a vasculhar.

O ideal seria termos uma ferramenta que nos ajudasse a encontrar esses bugs _antes_ de o código rodar.
É isso que um verificador estático de tipos como o TypeScript faz.
_Sistemas de tipos estáticos_ descrevem os formatos e comportamentos do que nossos valores serão quando rodarmos nossos programas.
Um verificador de tipos como o TypeScript usa essa informação e nos avisa quando as coisas podem estar saindo dos trilhos.

```ts twoslash
// @errors: 2349
const message = "hello!";

message();
```

Rodar aquele último exemplo com o TypeScript vai nos dar uma mensagem de erro antes mesmo de rodarmos o código.

## Falhas que não geram exceções

Até agora estivemos discutindo certas coisas, como erros em tempo de execução — casos em que o runtime do JavaScript nos diz que acha que algo não faz sentido.
Esses casos surgem porque [a especificação do ECMAScript](https://tc39.github.io/ecma262/) tem instruções explícitas sobre como a linguagem deve se comportar quando encontra algo inesperado.

Por exemplo, a especificação diz que tentar chamar algo que não é chamável deve lançar um erro.
Talvez isso soe como "comportamento óbvio", mas você poderia imaginar que acessar uma propriedade que não existe em um objeto também deveria lançar um erro.
Em vez disso, o JavaScript nos dá um comportamento diferente e retorna o valor `undefined`:

```js
const user = {
  name: "Daniel",
  age: 26,
};

user.location; // retorna undefined
```

No fim das contas, um sistema de tipos estático tem que decidir qual código deve ser sinalizado como erro em seu sistema, mesmo que seja JavaScript "válido" que não vai lançar um erro imediatamente.
No TypeScript, o código a seguir produz um erro sobre `location` não estar definida:

```ts twoslash
// @errors: 2339
const user = {
  name: "Daniel",
  age: 26,
};

user.location;
```

Embora às vezes isso implique um trade-off no que você pode expressar, a intenção é capturar bugs legítimos em nossos programas.
E o TypeScript captura _muitos_ bugs legítimos.

Por exemplo: erros de digitação,

```ts twoslash
// @noErrors
const announcement = "Hello World!";

// Quão rápido você consegue identificar os erros de digitação?
announcement.toLocaleLowercase();
announcement.toLocalLowerCase();

// Provavelmente queríamos escrever isto...
announcement.toLocaleLowerCase();
```

funções não chamadas,

```ts twoslash
// @noUnusedLocals
// @errors: 2365
function flipCoin() {
  // Deveria ser Math.random()
  return Math.random < 0.5;
}
```

ou erros básicos de lógica.

```ts twoslash
// @errors: 2367
const value = Math.random() < 0.5 ? "a" : "b";
if (value !== "a") {
  // ...
} else if (value === "b") {
  // Ops, inalcançável
}
```

## Tipos para Ferramentas

O TypeScript consegue capturar bugs quando cometemos erros em nosso código.
Isso é ótimo, mas o TypeScript _também_ consegue evitar que cometamos esses erros logo de início.

O verificador de tipos tem informação para checar coisas como se estamos acessando as propriedades certas em variáveis e em outras propriedades.
Uma vez que ele tem essa informação, também pode começar a _sugerir_ quais propriedades você talvez queira usar.

Isso significa que o TypeScript também pode ser aproveitado para editar código, e o verificador de tipos central pode fornecer mensagens de erro e autocompletar enquanto você digita no editor.
Essa é parte do que as pessoas costumam mencionar quando falam de ferramental (tooling) no TypeScript.

<!-- prettier-ignore -->
```ts twoslash
// @noErrors
// @esModuleInterop
import express from "express";
const app = express();

app.get("/", function (req, res) {
  res.sen
//       ^|
});

app.listen(3000);
```

O TypeScript leva o ferramental a sério, e isso vai além de autocompletar e erros enquanto você digita.
Um editor que suporta TypeScript pode entregar "quick fixes" para corrigir erros automaticamente, refatorações para reorganizar código facilmente e recursos úteis de navegação para pular para as definições de uma variável, ou encontrar todas as referências a uma dada variável.
Tudo isso é construído sobre o verificador de tipos e é totalmente multiplataforma, então é provável que [o seu editor favorito tenha suporte a TypeScript disponível](https://github.com/Microsoft/TypeScript/wiki/TypeScript-Editor-Support).

## `tsc`, o compilador do TypeScript

Estivemos falando sobre verificação de tipos, mas ainda não usamos nosso _verificador_ de tipos.
Vamos nos familiarizar com nosso novo amigo `tsc`, o compilador do TypeScript.
Primeiro, vamos precisar baixá-lo via npm.

```sh
npm install -g typescript
```

> Isso instala o Compilador do TypeScript `tsc` globalmente.
> Você pode usar `npx` ou ferramentas similares se preferir rodar o `tsc` a partir de um pacote local em `node_modules`.

Agora, vamos para uma pasta vazia e tentar escrever nosso primeiro programa em TypeScript: `hello.ts`:

```ts twoslash
// Saúda o mundo.
console.log("Hello world!");
```

Repare que não há nada de extravagante aqui; este programa "hello world" parece idêntico ao que você escreveria para um programa "hello world" em JavaScript.
E agora vamos verificar seus tipos rodando o comando `tsc`, que foi instalado para nós pelo pacote `typescript`.

```sh
tsc hello.ts
```

Tcharam!

Espera, "tcharam" o _quê_ exatamente?
Rodamos o `tsc` e nada aconteceu!
Bem, não havia erros de tipo, então não recebemos nenhuma saída no console, já que não havia nada a relatar.

Mas verifique de novo — recebemos a saída de um _arquivo_ em vez disso.
Se olharmos no nosso diretório atual, veremos um arquivo `hello.js` ao lado de `hello.ts`.
Essa é a saída do nosso arquivo `hello.ts` depois que o `tsc` o _compila_ ou _transforma_ em um arquivo JavaScript puro.
E se verificarmos o conteúdo, veremos o que o TypeScript cospe depois de processar um arquivo `.ts`:

```js
// Saúda o mundo.
console.log("Hello world!");
```

Nesse caso, havia muito pouco para o TypeScript transformar, então parece idêntico ao que escrevemos.
O compilador tenta emitir código limpo e legível que pareça algo que uma pessoa escreveria.
Embora isso nem sempre seja tão fácil, o TypeScript indenta de forma consistente, presta atenção em quando nosso código se estende por diferentes linhas e tenta manter os comentários por perto.

E se nós _de fato_ introduzíssemos um erro de verificação de tipos?
Vamos reescrever o `hello.ts`:

```ts twoslash
// @noErrors
// Esta é uma função de saudação de uso geral de qualidade industrial:
function greet(person, date) {
  console.log(`Hello ${person}, today is ${date}!`);
}

greet("Brendan");
```

Se rodarmos `tsc hello.ts` de novo, repare que recebemos um erro na linha de comando!

```txt
Expected 2 arguments, but got 1.
```

O TypeScript está nos dizendo que esquecemos de passar um argumento para a função `greet`, e com razão.
Até agora escrevemos apenas JavaScript padrão, e mesmo assim a verificação de tipos conseguiu encontrar problemas no nosso código.
Valeu, TypeScript!

## Emitindo Mesmo com Erros

Uma coisa que você talvez não tenha notado no último exemplo é que nosso arquivo `hello.js` mudou de novo.
Se abrirmos esse arquivo, veremos que o conteúdo ainda parece basicamente o mesmo do nosso arquivo de entrada.
Isso pode ser um pouco surpreendente, dado o fato de que o `tsc` relatou um erro sobre nosso código, mas isso se baseia em um dos valores centrais do TypeScript: na maior parte do tempo, _você_ vai saber mais do que o TypeScript.

Reiterando o que foi dito antes, verificar os tipos de um código limita os tipos de programas que você pode rodar, então há um trade-off em quais tipos de coisas um verificador de tipos considera aceitáveis.
Na maior parte do tempo isso é tranquilo, mas há cenários em que essas verificações atrapalham.
Por exemplo, imagine-se migrando código JavaScript para TypeScript e introduzindo erros de verificação de tipos.
Eventualmente você vai dar um jeito de arrumar as coisas para o verificador de tipos, mas aquele código JavaScript original já estava funcionando!
Por que convertê-lo para TypeScript deveria impedir você de rodá-lo?

Então o TypeScript não fica no seu caminho.
Claro, com o tempo, você pode querer ser um pouco mais defensivo contra erros e fazer o TypeScript agir de forma um pouco mais estrita.
Nesse caso, você pode usar a opção de compilador [`noEmitOnError`](/tsconfig#noEmitOnError).
Tente mudar seu arquivo `hello.ts` e rodar o `tsc` com essa flag:

```sh
tsc --noEmitOnError hello.ts
```

Você vai notar que o `hello.js` nunca é atualizado.

## Tipos Explícitos

Até agora, não dissemos ao TypeScript o que `person` ou `date` são.
Vamos editar o código para dizer ao TypeScript que `person` é uma `string` e que `date` deve ser um objeto `Date`.
Também vamos usar o método `toDateString()` em `date`.

```ts twoslash
function greet(person: string, date: Date) {
  console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}
```

O que fizemos foi adicionar _anotações de tipo_ (type annotations) em `person` e `date` para descrever com que tipos de valores `greet` pode ser chamada.
Você pode ler essa assinatura como "`greet` recebe uma `person` do tipo `string` e uma `date` do tipo `Date`".

Com isso, o TypeScript pode nos avisar sobre outros casos em que `greet` pode ter sido chamada incorretamente.
Por exemplo...

```ts twoslash
// @errors: 2345
function greet(person: string, date: Date) {
  console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}

greet("Maddison", Date());
```

Hã?
O TypeScript relatou um erro no nosso segundo argumento, mas por quê?

Talvez surpreendentemente, chamar `Date()` em JavaScript retorna uma `string`.
Por outro lado, construir um `Date` com `new Date()` de fato nos dá o que estávamos esperando.

De qualquer forma, podemos corrigir o erro rapidamente:

```ts twoslash {4}
function greet(person: string, date: Date) {
  console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}

greet("Maddison", new Date());
```

Tenha em mente que nem sempre precisamos escrever anotações de tipo explícitas.
Em muitos casos, o TypeScript consegue até mesmo _inferir_ (ou "descobrir") os tipos para nós, mesmo que os omitamos.

```ts twoslash
let msg = "hello there!";
//  ^?
```

Mesmo que não tenhamos dito ao TypeScript que `msg` tinha o tipo `string`, ele conseguiu descobrir isso.
Isso é um recurso, e o melhor é não adicionar anotações quando o sistema de tipos acabaria inferindo o mesmo tipo de qualquer forma.

> Nota: a bolha de mensagem dentro do exemplo de código anterior é o que seu editor mostraria se você tivesse passado o mouse sobre a palavra.

## Tipos Apagados

Vamos dar uma olhada no que acontece quando compilamos a função `greet` acima com o `tsc` para gerar JavaScript:

```ts twoslash
// @showEmit
// @target: es5
function greet(person: string, date: Date) {
  console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}

greet("Maddison", new Date());
```

Repare em duas coisas aqui:

1. Nossos parâmetros `person` e `date` não têm mais anotações de tipo.
2. Nossa "template string" — aquela string que usava crases (o caractere `` ` ``) — foi convertida em strings comuns com concatenações.

Mais sobre esse segundo ponto depois, mas vamos agora focar no primeiro ponto.
Anotações de tipo não fazem parte do JavaScript (ou do ECMAScript, para ser pedante), então realmente não existem navegadores ou outros runtimes que consigam simplesmente rodar TypeScript sem modificação.
É por isso que o TypeScript precisa de um compilador, para começo de conversa — ele precisa de alguma forma de remover ou transformar qualquer código específico de TypeScript para que você possa rodá-lo.
A maior parte do código específico de TypeScript é apagada, e da mesma forma, aqui nossas anotações de tipo foram completamente apagadas.

> **Lembre-se**: anotações de tipo nunca mudam o comportamento em tempo de execução do seu programa.

## Downleveling

Outra diferença em relação ao exemplo acima foi que nossa template string foi reescrita de

```js
`Hello ${person}, today is ${date.toDateString()}!`;
```

para

```js
"Hello ".concat(person, ", today is ").concat(date.toDateString(), "!");
```

Por que isso aconteceu?

Template strings são um recurso de uma versão do ECMAScript chamada ECMAScript 2015 (também conhecida como ECMAScript 6, ES2015, ES6, etc. — _não pergunte_).
O TypeScript tem a capacidade de reescrever código de versões mais novas do ECMAScript para versões mais antigas, como ECMAScript 3 ou ECMAScript 5 (também conhecida como ES5).
Esse processo de migrar de uma versão mais nova ou "mais alta" do ECMAScript para uma mais antiga ou "mais baixa" é às vezes chamado de _downleveling_.

Por padrão, o TypeScript mira no ES5, uma versão extremamente antiga do ECMAScript.
Poderíamos ter escolhido algo um pouco mais recente usando a opção [`target`](/tsconfig#target).
Rodar com `--target es2015` muda o alvo do TypeScript para ECMAScript 2015, o que significa que o código deve conseguir rodar em qualquer lugar onde o ECMAScript 2015 seja suportado.
Então rodar `tsc --target es2015 hello.ts` nos dá a seguinte saída:

```js
function greet(person, date) {
  console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}
greet("Maddison", new Date());
```

> Embora o alvo padrão seja o ES5, a grande maioria dos navegadores atuais suporta o ES2015.
> A maioria dos desenvolvedores pode, portanto, especificar com segurança o ES2015 ou superior como alvo, a menos que a compatibilidade com certos navegadores ancestrais seja importante.

## Strictness (Modo Estrito)

Diferentes usuários chegam ao TypeScript buscando coisas diferentes em um verificador de tipos.
Algumas pessoas estão procurando uma experiência opcional mais flexível, que pode ajudar a validar apenas algumas partes do seu programa e ainda ter um ferramental decente.
Essa é a experiência padrão com o TypeScript, em que os tipos são opcionais, a inferência adota os tipos mais lenientes e não há verificação para valores potencialmente `null`/`undefined`.
Muito parecido com a forma como o `tsc` emite diante de erros, esses padrões estão estabelecidos para não atrapalhar você.
Se você está migrando JavaScript existente, esse pode ser um primeiro passo desejável.

Em contraste, muitos usuários preferem que o TypeScript valide o máximo que puder logo de cara, e é por isso que a linguagem também fornece configurações de modo estrito (strictness).
Essas configurações de modo estrito transformam a verificação estática de tipos de um interruptor (ou seu código é verificado ou não) em algo mais próximo de um botão de ajuste.
Quanto mais você gira esse botão para cima, mais o TypeScript vai verificar para você.
Isso pode exigir um pouco de trabalho extra, mas, de modo geral, se paga no longo prazo, e habilita verificações mais completas e um ferramental mais preciso.
Quando possível, uma base de código nova deveria sempre ativar essas verificações de modo estrito.

O TypeScript tem várias flags de rigor (strictness) na verificação de tipos que podem ser ligadas ou desligadas, e todos os nossos exemplos serão escritos com todas elas habilitadas, a menos que dito o contrário.
A flag [`strict`](/tsconfig#strict) na CLI, ou `"strict": true` em um [`tsconfig.json`](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html), ativa todas elas simultaneamente, mas podemos optar por desativá-las individualmente.
As duas mais importantes que você deveria conhecer são [`noImplicitAny`](/tsconfig#noImplicitAny) e [`strictNullChecks`](/tsconfig#strictNullChecks).

## `noImplicitAny`

Lembre-se de que, em alguns lugares, o TypeScript não tenta inferir tipos para nós e, em vez disso, recorre ao tipo mais leniente: `any`.
Essa não é a pior coisa que pode acontecer — afinal, recorrer a `any` é simplesmente a experiência comum do JavaScript de qualquer forma.

No entanto, usar `any` muitas vezes anula o propósito de usar o TypeScript em primeiro lugar.
Quanto mais tipado for seu programa, mais validação e ferramental você terá, o que significa que vai esbarrar em menos bugs enquanto programa.
Ativar a flag [`noImplicitAny`](/tsconfig#noImplicitAny) vai emitir um erro em qualquer variável cujo tipo seja implicitamente inferido como `any`.

## `strictNullChecks`

Por padrão, valores como `null` e `undefined` são atribuíveis a qualquer outro tipo.
Isso pode facilitar a escrita de certos códigos, mas esquecer de tratar `null` e `undefined` é a causa de incontáveis bugs no mundo — alguns consideram isso um [erro de um bilhão de dólares](https://www.youtube.com/watch?v=ybrQvs4x0Ps)!
A flag [`strictNullChecks`](/tsconfig#strictNullChecks) torna o tratamento de `null` e `undefined` mais explícito e nos _poupa_ de nos preocuparmos se _esquecemos_ de tratar `null` e `undefined`.
