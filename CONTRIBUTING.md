# Como contribuir

## Propondo uma fase (sem programar)

Todo o conteúdo fica em `content/capitulos/`, um arquivo por capítulo. Cada fase é um bloco
como os abaixo. Copie um exemplo do mesmo tipo, mude os textos e abra um pull request. Os
testes automáticos avisam se faltar algo.

### Tipos de fase

**Explicação** (`explanation`): 1 a 3 cartões com título, texto e um emoji opcional.

**Escolher o pedido** (`choose-prompt`): uma situação, 3 ou 4 pedidos possíveis, exatamente
um `"correct": true`. Todos precisam de `feedback`. `resultPreview` é o que a IA
responderia ao pedido certo.

**Montar o pedido** (`build-prompt`): uma situação, uma lista de categorias obrigatórias
(`required`) e peças (`blocks`). Categorias: `context`, `task`, `format`, `tone`, `example`
e `noise` (armadilha). Toda peça `noise` precisa de `feedback` explicando por que não usar.

### Regras de escrita

- Português brasileiro, tom leve, frases curtas, sem jargão.
- Situações reais de um adulto: casa, família, trabalho.
- Opções erradas têm de ser plausíveis. O feedback diz o problema e o que fazer em vez disso.
- Nunca cite uma marca como "a certa". Diga "a IA".
- Não coloque dados pessoais reais nem de terceiros nos exemplos.

O `id` de cada fase precisa ser único em todo o jogo. Use o prefixo do capítulo
(`c2-`, `c3-`...). O prefixo é obrigatório: o id de toda fase do capítulo `NN-*.json`
precisa começar com `cN-` (por exemplo, fases de `04-desconfiar.json` começam com `c4-`).

Se estiver propondo um capítulo novo, adicione o arquivo em `content/capitulos/` e inclua
seu nome (sem `.json`) em `order`, em `content/capitulos.json`.

## Mudando código

- Só `svelte` como dependência de produção. Qualquer nova dependência precisa ser justificada
  no PR.
- Rode `npm test` e `npm run check` antes de abrir o PR.
- Código, nomes de arquivos e commits em inglês; textos da interface em português.
