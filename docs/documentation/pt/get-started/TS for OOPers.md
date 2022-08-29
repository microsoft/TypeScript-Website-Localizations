---
title: TypeScript para programadores Java/C#
short: TS para programadores Java/C#
layout: docs
permalink: /pt/docs/handbook/typescript-in-5-minutes-oop.html
oneline: Aprenda TypeScript se você tem um background com linguagens orientadas a objeto
---

TypeScript é uma escolha popular para programadores acostumados com outras linguagens com tipagem estática, como C# e Java.

O sistema de tipos do TypeScript oferece muitos dos mesmos benefícios, como melhor conclusão de código, detecção prematura de erros e comuincação mais clara entre partes do seu programa. Enquanto o TypeScript fornece muitas features familiares para esses desenvolvedores, é válido dar um passo atrás para ver o quanto JavaScript (por consequência TypeScript) difere das linguagens orientadas a objeto. Entender essas diferenças vão te ajudar a escrever um código JavaScript melhor e evitar armadilhas comuns que programadores que vão diretamente de C#/Java para TypeScript caem.

## Co-aprendendo JavaScript

Se você já é familiar com JavaScript mas é primariamente um programador Java ou C#, essa página introdutória pode ajudar a explicar alguns dos equívocos e armadilhas comuns que você pode estar suscetível. Algumas das formas de modelos de tipo do TypeScript são bem diferentes de Java ou C# e é importante manter esses em mente quando se aprende TypeScript.

Se você é um desenvolvedor Java ou C# que é novo no JavaScript em geral, nós recomendamos aprender um pouco de JavaScript _sem_ tipos primeiro para entender o comportamento do JavaScript em tempo de execução. Porque o TypeScript não muda a forma que seu código é _executado_, você ainda vai ter que aprender como o JavaScript funciona para escrever código que realmente faz alguma coisa!

É importante lembrar que TypeScript usa o mesmo _ambiente de execução_ que o JavaScript, então qualquer recursos sobre como realizar determinado comportamento em tempo de execução (converter uma string para um número, exibir um alerta, escrever um arquivo em disco, etc.) vai sempre se aplicar igualmente para programas TypeScript. Não se limite a recursos específicos do TypeScript!

## Repensando a Classe

C# e Java são o que podemos chamar de linguagens _obrigatoriamente orientadas a objeto_. Nessas linguagens, a _classe_ é a unidade básica de organização de código e também o recipiente básico de todos os dados _e_ comportamento em tempo de execução. Forçar todas as funcionalidades e dados a serem contidos em classes pode ser um bom modelo de domínio para alguns problemas, mas nem todo domínio _precisa_ ser representado dessa forma.

### Funções Livres e Dados

Em JavaScript, funções podem existir em qualquer lugar e dados podem ser enviados livremente sem estar dentro de uma `class` ou `struct` pré definida. Essa flexiblidade é extremamente poderosa. Funções "livres" (aquelas que não são associadas à uma classe) trabalhando sobre os dados sem uma hierarquia de orientação a objeto implicada tendem a ser o modelo preferido para escrever programas em JavaScript.

### Classes Estáticas

Adicionalmente, certos construtos de C# e Java tais como singletons e classes estáticas são desnecessários em TypeScript.

## POO em TypeScript

Com isso dito, você ainda pode usar classes se quiser! Alguns problemas são adequados a serem resolvidosp por hierarquia de POO tradicional e o suporte do TypeScript a classes JavaScript fará esses modelos ainda mais poderosos. TypeScript suporta muitos padrões comuns tais como implementar interfaces, herança e métodos estáticos.

Nós cobriremos classes mais tarde neste guia.

## Repensando Tipos

O entendimento do TypeScript de um _tipo_ é atualmente bem diferente do de C# ou Java. Vamos explorar algumas diferenças.

### Sistema de Tipos Nominal Reificado

Em C# ou Java, qualquer dado valor ou objeto tem um tipo exato - seja `null`, um primitivo, ou uma classe conhecida. Nós podemos chamar métodos como `value.GetType()` ou `value.getClass()` para buscar o tipo exato em tempo de execução. A definição desse tipo vai residir em uma classe em algum lugar com algum nome e nós não podemos usar duas classes com formatos similares no lugar uma da outra a não ser que haja uma relação de herança explícita ou uma interface comum implementada.

Estes aspectos descrevem um sistema de tipo _nominal, reificado_. Os tipos que escrevemos no código são presentes em tempos de execução e esses tipos são relacionados por suas declarações, não suas estruturas.

## Tipos como Conjuntos

Em C# ou Java, é siginficante pensar em uma correspondência um pra um entre os tipos de tempo de execução e suas declarações de tempo de compilação.

Em TypeScript, é melhor pensar em um tipo como um _conjunto de valores_ que compartilham algo em comum. Por tipos serem apenas conjuntos, um valor particular pode pertencer à _muitos_ conjuntos ao mesmo tempo.

Uma vez que você começa a pensar em tipos como conjuntos, certas operações se tornam bastante naturais. Por exemplo, em C#, é bem estranho enviar um valor que _pode ser_ uma `string` ou um `int`, porque não há um tipo único que represente este valor.

Em TypeScript, isso se torna bem natural uma vez que você realiza que todo tipo é apenas um conjunto. Como você descreve um valor que pode pertencer ao conjunto `string` ou ao conjunto `number`? Ele simplesmente pertence à _união_ desses conjuntos: `string | number`.

TypeScript fornece um número de mecanismos para trabalhar com tipos em forma de conjuntos e você vai descobrir que eles são mais intuitivos se você pensar em tipos como conjuntos.

### Tipos Estruturais Apagados

Em TypeScript, objetos _não_ são de um tipo exato. Por Exemplo, se construímos um objeto que satisfaz uma interface, nós podemos usar este objeto onde aquela interface é esperada mesmo que não haja relação delcarativa entre os dois.

```ts twoslash
interface Ponto {
	x: number;
	y: number;
}
interface Nomeada {
	nome: string;
}

function exibirPonto(point: Ponto) {
	console.log('x = ' + point.x + ', y = ' + point.y);
}

function exibirNome(x: Nomeada) {
	console.log('Olá, ' + x.nome);
}

const obj = {
	x: 0,
	y: 0,
	nome: 'Origem'
};

exibirPonto(obj);
exibirNome(obj);
```

O sistema de tipos do TypeScript é _estrutural_, não nominal: Nós podemos usar `obj` como um `Ponto` porque as propriedades `x` e `y` são ambas números. A relação entre os tipos são determinadas pelas propriedades que eles contém, não se foram declarados com determinada relação.

O sistema de tipos do TypeScript também não é _reificado_: Nâo há nada em tempo de execução que nós dirá se aquele `obj` é um `Ponto`. Na verdade, o tipo `Ponto` não é presente em _nenhuma forma_ em tempo de execução.

Voltando para a ideia de `tipos como conjuntos`, nós podemos pensar que `obj` é um membro tanto do conjunto de valores `Ponto` quanto do conjunto de valores `Nomeada`.

### Consequências da Tipagem Estrutural

Programadores POO são frequentementes surpreendidos pelos aspectos particulares da tipagem estrutural.

#### Tipos Vazios

O primeiro é que o _tipo vazio_ parece desafiar as expectativas:

```ts twoslash
class Vazio {}

function fn(arg: Vazio) {
	// fazer algo?
}

// Sem erro, mas isso não é um 'Vazio' ?
fn({ k: 10 });
```

TypeScript determina se a chamada para `fn` é válida por checar se o argumento fornecido é um `Vazio` válido. Ele faz isso examinando a `estrutura` de `{ k: 10 }` e `class Vazio { }`. Nós podemos ver que `{ k: 10 }` tem todas as propriedades que `Vazio` tem, porque `Vazio` não tem propriedades. Logo, é uma chamada válida.

Isso pode parecer muito surpreendente, mas, em última análise, é uma relação muito similar a uma aplicada em linguagens de POO nominais. Uma subclasse não pode _remover_ uma propriedade de sua classe base, porque fazer isso destruiria a relação natural de subtipo entre a classe derivada e sua base. Sistemas de tipagem estrutural simplesmente identificam esse relacionamento implicitamente descrevendo subtipos em termos de tendo propriedades de tipos compatíveis.

### Tipos Idênticos

Outra frequente fonte de supresa vem com tipos idênticos:

```ts
class Carro {
	dirigir() {
		// pressionar o acelerador
	}
}
class Golfer {
	dirigir() {
		// jogar a bola para longe
	}
}

// Sem erro?
let w: Carro = new Golfer();
```

Novamente, isso não é um erro porque as _estruturas_ dessas classes são as mesmas. Enquanto isso pode parecer como uma potencial fonte de confusão, na prática, classes idênticas que não deveriam ser relacionadas não são comuns.

Nós aprendemos mais sobre como classes se relacionam umas com as outras no capítulo Classes.

### Reflexão

Programadores POO são acostumados a serem capazes de pegar o tipo de qualquer valor, até um genérico:

```csharp
// C#
static void TipoDoLog<T>() {
    Console.WriteLine(typeof(T).Name);
}
```

Porque o sistema de tipos do TypeScript é totalmente apagado, informação sobre e.g. a instanciação de um parâmetro de tipo genérico não está disponível em tempo de execução.

JavaScript tem alguns primitivos limitados como `typeof` e `instanceof`, mas lembre-se que esses operadores ainda funcionarão nos valores porque eles existem no código de saída com tipo apagado. Por exemplo `typeof (new Carro())` será `object`, não `Carro` ou `"Carro"`

## Próximos Passos

Essa documentação é uma resumo de alto nível da sintaxe e tipos qeu você usaria em código no dia-a-dia. Daqui você deve:

- Ler o Handbook completo [from start to finish](/docs/handbook/intro.html) (30m)
- Explorar os [exemplos do Playground](/play#show-examples)
