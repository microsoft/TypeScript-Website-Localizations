---
title: Declaration Reference
layout: docs
permalink: /pt/docs/handbook/declaration-files/by-example.html
oneline: "Como criar um arquivo d.ts para um módulo"
---

O propósito desse guia é te ensinar como escrever um arquivo de definição de alta qualidade.
A estrutura desse guia exibe a documentação de uma API, juntamente com amostras de uso e explicações de como escrever a declaração correspondente.

Esses exemplos são ordenados por ordem crescente aproximada de complexidade.

## Objetos com Propriedades

_Documentação_

> A variável global `minhaLib` possui uma função `criaCumprimento` para criar saudações,
> e uma propriedade `numeroDeCumprimentos` indicando o numero de cumprimentos feitos ate ali.

_Código_

```ts
let resultado = minhaLib.criaCumprimento("Olá, mundo");
console.log("O cumprimento computado é:" + resultado);

let count = minhaLib.numeroDeCumprimentos;
```

_Declaração_

Use `declare namespace` para descrever tipos ou valores acessados via notação por ponto.

```ts
declare namespace minhaLib {
  function criaCumprimento(s: string): string;
  let numeroDeCumprimentos: number;
}
```

## Funções Sobrecarregadas

_Documentação_

A função `pegaFerramenta` aceita um número e retorna uma Ferramenta, ou aceita uma string e retorna um array de Ferramentas.

_Código_

```ts
let x: Ferramenta = pegaFerramenta(43);

let arr: Ferramenta[] = pegaFerramenta("todas");
```

_Declaração_

```ts
declare function pegaFerramenta(n: number): Ferramenta;
declare function pegaFerramenta(s: string): Ferramenta[];
```

## Tipos Reutilizáveis (Interfaces)

_Documentação_

> Ao especificar uma saudação, você deve passar um objeto `ConfiguracoesCumprimento`.
> Esse objeto tem as seguintes propriedades: 
>
> 1 - cumprimento: String obrigatória
>
> 2 - duracao: Comprimento de tempo opcional (em milissegundos)
>
> 3 - cor: String opcional, ex: '#ff00ff'

_Código_

```ts
cumprimenta({
  cumprimento: "olá mundo",
  duracao: 4000
});
```

_Declaração_

Use uma `interface` para definir um tipo com propriedades.

```ts
interface ConfiguracoesCumprimento {
  cumprimento: string;
  duracao?: number;
  cor?: string;
}

declare function cumprimenta(setting: ConfiguracoesSaudacao): void;
```

## Tipos reutilizáveis (Tipo Aliases)

_Documentação_

> Em qualquer lugar que um cumprimento é esperado, você pode prover uma `string`, uma função retornando uma `string`, ou uma instancia de `Cumprimentador`.

_Código_

```ts
function pegaCumprimento() {
  return "oopa";
}
class MeuCumprimentador extends Cumprimentador {}

cumprimenta("olá");
cumprimenta(pegaCumprimento);
cumprimenta(new MeuCumprimentador());
```

_Declaração_

Você pode usar um alias para fazer uma abreviação para um tipo:

```ts
type ComoUmCumprimentador = string | (() => string) | MeuCumprimentador;

declare function cumprimenta(g: ComoUmCumprimentador): void;
```

## Organizando Tipos

_Documentação_

> O objeto `cumprimentador` pode passar log para um arquivo ou mostrar um alerta.
> Você pode prover LogOptions para `.log(...)` e opções de alerta para `.alert(...)`

_Código_

```ts
const g = new Cumprimentador("Olá");
g.log({ verbose: true });
g.alert({ modal: false, title: "Cumprimento Atual" });
```

_Declaração_

Use namespaces para organizar tipos.

```ts
declare namespace CumprimentoLib {
  interface LogOptions {
    verbose?: boolean;
  }
  interface AlertOptions {
    modal: boolean;
    title?: string;
    color?: string;
  }
}
```

Voce também pode criar namespaces aninhados em uma declaração:

```ts
declare namespace CumprimentoLib.Options {
  // Faz referência via CumprimentoLib.Options.Log
  interface Log {
    verbose?: boolean;
  }
  interface Alert {
    modal: boolean;
    title?: string;
    color?: string;
  }
}
```

## Classes

_Documentação_

> Você pode criar um cumprimentador ao instanciar o objeto `Cumprimentador`, ou ao criar um cumprimentador customizado ao estendê-lo.

_Código_

```ts
const MeuCumprimentador = new Cumprimentador("Olá, mundo");
MeuCumprimentador.cumprimento = "oopa";
MeuCumprimentador.mostraCumprimento();

class CumprimentadorEspecial extends Cumprimentador {
  constructor() {
    super("Cumprimentador muito especial");
  }
}
```

_Declaração_

Use `declare class` para descrever uma classe ou um objeto semelhante a classe.
Classes também podem possuir propriedades e métodos assim como um construtor.

```ts
declare class Cumprimentador {
  constructor(cumprimento: string);

  cumprimento: string;
  mostraCumprimento(): void;
}
```

## Variáveis Globais

_Documentação_

> A variável global `foo` contém o numero de ferramentas atual. 

_Código_

```ts
console.log("Metade do numero de ferramentas é " + foo / 2);
```

_Declaração_

Use `declare var` para declarar variáveis.
Se a variável é apenas-leitura, você pode usar `declare const`.
Você também pode usar `declare let` se a variável é de escopo-fechado.

```ts
/** O numero de ferramentas atual */
declare var foo: number;
```

## Global Functions

_Documentação_

> Você pode chamar a função `cumprimenta` com uma string para mostrar um cumprimento para o usuário.

_Código_

```ts
cumprimenta("olá, mundo");
```

_Declaração_

Use `declare function` para declarar funções.

```ts
declare function cumprimenta(cumprimento: string): void;
```

