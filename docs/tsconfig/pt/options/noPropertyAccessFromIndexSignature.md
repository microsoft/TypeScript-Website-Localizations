---
display: "Sem acesso a propriedade pela assinatura do índice"
oneline: "Força o uso de acessadores indexados para chaves declaradas usando um tipo indexado"
---

Esta configuração garante a consistência entre acessar o campo pela sintaxe "ponto" (`obj.chave`), e "indexado" (`obj["chave"]`) e a forma que a propriedade é declarada no tipo.

Sem esta flag, o Typescript irá permitir que você use a sintaxe de ponto para acessar os campos que não estão definidos:

```ts twoslash
// @errors: 4111
declare function obterConfiguracoes(): configuracoesDoJogo;
// ---cut---
interface configuracoesDoJogo {
  // Propriedades diretamente conhecidas
  velocidade: "rápido" | "médio" | "lento";
  qualidade: "alta" | "baixa";

  // Assume qualquer coisa desconhecida para a interface
  // como um string.
  [chave: string]: string;
}

const configuracoes = obterConfiguracoes();
configuracoes.velocidade;
//       ^?
configuracoes.qualidade;
//       ^?

// Acessadores de chaves desconhecidas são permitidas
// neste projeto, e são do tipo `string`
configuracoes.nomeDeUsuario;
//       ^?
```

Ativar esta flag irá gerar um erro porque o campo desconhecido usa a sintaxe ponto invés da sintaxe indexada.

```ts twoslash
// @errors: 4111
// @noPropertyAccessFromIndexSignature
declare function obterConfiguracoes(): configuracoesDoJogo;
interface configuracoesDoJogo {
  velocidade: "rápido" | "médio" | "lento";
  qualidade: "alta" | "baixa";
  [chave: string]: string;
}
// ---cut---
const configuracoes = obterConfiguracoes();
configuracoes.velocidade;
configuracoes.qualidade;

// Este precisa ser configuracoes["nomeDeUsuario"]
configuracoes.nomeDeUsuario;
//       ^?
```

O objetivo desta flag é para sinalizar a intenção em sua sintaxe de chamada sobre quão certo você está sobre a existência desta propriedade.