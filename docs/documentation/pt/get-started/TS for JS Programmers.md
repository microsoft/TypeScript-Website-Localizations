---
title: TypeScript para programadores JavaScript
short: TypeScript para programadores JavaScript
layout: docs
permalink: /pt/docs/handbook/typescript-in-5-minutes.html
oneline: Aprenda como o TypeScript extende o JavaScript
---

TypeScript tem uma relação incomum com JavaScript. TypeScript oferece todas as features do JavaScript, e uma camada adicional no topo deste: o sistema de tipos do TypeScript.

Por exemplo, JavaScript oferece primitivos de linguagem como `string` e `number`, mas não checa consistentemente que você atribuiu estes. TypeScript checa.

Isso significa que seu código JavaScript existente também é código TypeScript. O benefício principal do TypeScript é que ele pode destacar comportamento inesperado no seu código, diminuindo a chance de bugs.

Este tutorial fornece um resumo do TypeScript, focando no seu sistema de tipos.

## Tipos por Inferência

TypeScript conhece a linguagem JavaScript e vai gerar tipos para você em muitos casos. Por exemplo quando criando uma variável e atribuindo à um determinado valor, TypeScript usará o valor como seu tipo.

```ts twoslash
let olaMundo = 'Olá Mundo';
//  ^?
```

Entendendo como o JavaScript funciona, TypeScript pode construir um sistema de tipos que aceita código JavaScript mas tem tipos. Isso oferece um sistema de tipos sem a necessidade de adicionar caracteres extra para fazer com que os tipos sejam explícitos no seu código. É assim que o TypeScript sabe que `olaMundo` é uma `string` no exemplo acima.

Você já pode ter escrito código JavaScript no Visual Studio Code, e teve auto-complete do editor. Visual Studio Code usa TypeScript por baixo dos panos para tornar mais fácil o trabalho com JavaScript.

## Definindo Tipos

Você pode usar uma ampla variedade de tipos de padrões de projetos no JavaScript. Entretanto, alguns padrões de projeto tornam a inferência de tipos automática difícil (por exemplo, padrões que usam programação dinâmica). Para cobrir estes casos, TypeScript suporta uma extensão do JavaScript, que oferece lugares para que você diga ao TypeScript quais deveriam ser os tipos.

Por exemplo, para criar um objteo com um tipo inferido que inclui `name: string` e `id: number`, você pode escrever:

```ts twoslash
const usuario = {
	nome: 'Hayes',
	id: 0
};
```

Você pode explicitamente descrever a forma desse objeto usando uma declaração de `interface`:

```ts twoslash
interface Usuario {
	nome: string;
	id: number;
}
```

Você pode então declarar um objeto JavaScript conforme o formato da sua nova `interface` usando a sintaxe `: TypeName` depois da declaração de uma variável:

```ts twoslash
interface Usuario {
	nome: string;
	id: number;
}
// ---cut---
const usuario: Usuario = {
	nome: 'Hayes',
	id: 0
};
```

Se você fornecer um objeto que não corresponde a interface que você forneceu, o TypeScript vai te alertar:

```ts twoslash
// @errors: 2322
interface Usuario {
	nome: string;
	id: number;
}

const usuario: Usuario = {
	nomeDeUsuario: 'Hayes',
	id: 0
};
```

Já que o JavaScript suporta classes e programação orientada a objeto, TypeScript também. Você pode usar a declaração de interface com classes:

```ts twoslash
interface Usuario {
	nome: string;
	id: number;
}

class UsuarioConta {
	nome: string;
	id: number;

	constructor(nome: string, id: number) {
		this.nome = nome;
		this.id = id;
	}
}

const usuario: Usuario = new UsuarioConta('Murphy', 1);
```

Você pode usar interfaces para tipar parâmetros e valores de retorno em funções:

```ts twoslash
// @noErrors
interface Usuario {
	nome: string;
	id: number;
}
// ---cut---
function buscarUsuarioAdmin(): Usuario {
	//...
}

function deletarUsuario(usuario: Usuario) {
	// ...
}
```

Já há um pequeno conjunto de tipos primitivos disponíveis em JavaScript: `boolean`, `bigint`, `null`, `number`, `string`, `symbol`, e `undefined`, que você pode usar em uma interface. TypeScript extende essa lista com mais alguns como `any` (permitir qualquer coisa), [`unknown`](/play#example/unknown-and-never) (garanta que alguém usando esse tipo declare qual tipo é), [`never`](/play#example/unknown-and-never) (não é possível que esse tipo aconteça), e `void` (uma função que retorna `undefined` ou que não tem valor de retorno).

Você verá que há duas sintaxes para construir tipos: [Interfaces e Types](/play/?e=83#example/types-vs-interfaces). Você deve preferir `interface`. Use `type` quando precisar de funcionalidades específicas.

## Compondo Tipos

Com TypeScript, você pode criar tipos complexos combinando os simples. Existem duas formas populares de fazer isso: com uniões, e com genéricos.

### Uniões

Com uma união, você pode declarar que um tipo pode ser um de muitos. Por exemplo, você pode descrever um tipo `boolean` como sendo `true` ou `false`:

```ts twoslash
type MeuBooleano = true | false;
```

_Nota:_ se você passar o mouse por cima do `MeuBoleano` acima, você verá que é classificado como `boolean`. Essa é uma propriedade do Sistema de Tipos Estruturais. Mais sobre isso abaixo.

Um caso de uso popular de tipos uniões é para descrever o valor que um conjunto de [literais](/docs/handbook/2/everyday-types.html#literal-types) de `string` ou `number` pode ter:

```ts twoslash
type EstadoDaJanela = 'aberto' | 'fechado' | 'minimizado';
type EstadosDeBloqueio = 'trancado' | 'destrancado';
type NumerosImparesMenoresQue10 = 1 | 3 | 5 | 7 | 9;
```

Uniões fornecem uma forma de gerenciar tipos diferentes também. Por exemplo, você pode ter uma função que recebe como argumento um `array` ou uma `string`:

```ts twoslash
function buscarComprimento(obj: string | string[]) {
	return obj.length;
}
```

Para saber o tipo de uma variável, use `typeof`:

| Tipo      | Predicado                          |
| --------- | ---------------------------------- |
| string    | `typeof s === "string"`            |
| number    | `typeof n === "number"`            |
| boolean   | `typeof b === "boolean"`           |
| undefined | `typeof undefined === "undefined"` |
| function  | `typeof f === "function"`          |
| array     | `Array.isArray(a)`                 |

Por exemplo, você pode fazer uma função retornar diferentes tipos dependendo se uma string ou um array forem passados:

<!-- prettier-ignore -->
```ts twoslash
function envolverEmArray(obj: string | string[]) {
  if (typeof obj === "string") {
    return [obj];
//          ^?
  }
  return obj;
}
```

### Genéricos

Genéricos fornecem variáveis para tipos. Um exemplo comum é um array. Um array sem genéricos pode conter qualquer coisa. Um array com genéricos pode descrever os valores que aquele array contém.

```ts
type ArrayDeStrings = Array<string>;
type ArrayDeNumeros = Array<number>;
type ObjetoComNomeArray = Array<{ nome: string }>;
```

Você pode declarar seus próprios tipos usando genéricos:

```ts twoslash
// @errors: 2345
interface Mochila<Tipo> {
	adicionar: (obj: Tipo) => void;
	buscar: () => Tipo;
}

// Esse é um atalho para dizer ao Typescript que há uma
// constante chamada mochila, e não se preocupar de onde ela veio.
declare const mochila: Mochila<string>;

// objeto é uma string, porque nós o declaramos acima como a parte variável de Mochila.
const objeto = mochila.buscar();

// Já que a variável mochila é uma string, você não pode passar um número para a função adicionar.
mochila.adicionar(23);
```

## Sistema de Tipos Estruturais

Um dos princípios centrais do TypeScript é que a checagem de tipo é focada no _formato_ que os valores têm. Isso é chamado as vezes de "tipagem do pato" ou "tipagem estrutural".

Em um sistema de tipagem estruturado, se dois objetos tem o mesmo formato, eles são considerados do mesmo tipo.

```ts twoslash
interface Ponto {
	x: number;
	y: number;
}

function exibirPonto(p: Ponto) {
	console.log(`${p.x}, ${p.y}`);
}

// exibe "12, 26"
const ponto = { x: 12, y: 26 };
exibirPonto(ponto);
```

A variável `ponto` nunca é declarada como sendo do tipo `Ponto`. Entretanto, o TypeScript compara o formato de `ponto` ao formato de `Ponto` na checagem de tipo. Eles têm o mesmo formato, então o código passa.

A correspondência de tipo só requere que um subconjunto de campos do objeto sejam correspondentes:

```ts twoslash
// @errors: 2345
interface Ponto {
	x: number;
	y: number;
}

function exibirPonto(p: Ponto) {
	console.log(`${p.x}, ${p.y}`);
}
// ---cut---
const ponto3 = { x: 12, y: 26, z: 89 };
exibirPonto(ponto3); // logs "12, 26"

const rect = { x: 33, y: 3, largura: 30, altura: 80 };
exibirPonto(rect); // logs "33, 3"

const color = { hex: '#187ABF' };
exibirPonto(color);
```

Não há diferença entre como as classes e os objetos se conformam aos formatos:

```ts twoslash
// @errors: 2345
interface Ponto {
	x: number;
	y: number;
}

function exibirPonto(p: Ponto) {
	console.log(`${p.x}, ${p.y}`);
}
// ---cut---
class PontoVirtual {
	x: number;
	y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}
}

const novoPontoV = new PontoVirtual(13, 56);
exibirPonto(novoPontoV); // logs "13, 56"
```

Se o objeto ou classe tem todas as propriedades requeridas, TypeScript dirá que eles são correspondentes, independente dos detalhes de implementação.

## Próximos Passos

Essa documentação é uma resumo de alto nível da sintaxe e tipos qeu você usaria em código no dia-a-dia. Daqui você deve:

- Ler o Handbook completo [from start to finish](/docs/handbook/intro.html) (30m)
- Explorar os [exemplos do Playground](/play#show-examples)
