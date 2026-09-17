# Letra IA — Design

Data: 2026-09-16
Status: aprovado em brainstorming, aguardando revisão final da spec

## 1. Objetivo

Jogo web simples e aberto, hospedado no GitHub Pages, para letramento em IA de pessoas
leigas. Ensina noções básicas de como assistentes de conversa (Claude, ChatGPT, Gemini)
funcionam e como usá-los bem, de tarefas do dia a dia até trabalho. Progressão incremental:
cada capítulo constrói sobre o anterior.

**Público:** adultos de 25 a 60 anos, sem formação técnica, que usam celular e WhatsApp.
Tom leve, sem jargão, sem infantilizar. Mobile-first e acessível para não excluir quem tem
pouca familiaridade digital.

**Idioma:** conteúdo e interface em português brasileiro. Código, arquivos e commits em inglês.

## 2. Mecânica

Jornada com desafios de prompt. A pessoa recebe uma situação cotidiana e precisa escolher
ou montar o melhor prompt. Feedback imediato explica o porquê. Progressão:

- Fases iniciais: escolher entre 3 ou 4 prompts prontos.
- Fases avançadas: montar o prompt selecionando blocos (contexto, tarefa, formato, tom,
  exemplo), evitando blocos-armadilha.

Elementos de jogo: mapa de capítulos com fases desbloqueáveis, 1 a 3 estrelas por fase,
mascote guia e certificado ao final.

## 3. Conteúdo: 6 capítulos

1. **O que é uma IA de conversa** — programa que prevê texto; não é pessoa nem buscador;
   por que erra com confiança.
2. **Pedir bem** — contexto, especificidade, formato. Receita, mensagem, lista, resumo.
3. **Conversar, não só perguntar** — refinar em rodadas, pedir reescrita, corrigir o rumo.
4. **Desconfiar na hora certa** — alucinação, datas e fatos, conferir fontes, limite de
   conhecimento.
5. **Cuidados** — dados pessoais e sigilosos, diferenças entre ferramentas, uso ético.
6. **Trabalho** — e-mail profissional, resumo de documento, planilha, apresentação,
   aprender algo novo.

Cada capítulo tem 5 a 7 fases, começando com explicação e terminando com um desafio mais
difícil. Capítulos 1 e 2 usam só `explanation` e `choose-prompt`. `build-prompt` entra a
partir do capítulo 3. Total estimado: 35 a 40 fases. Exemplos neutros quanto a ferramenta.

## 4. Stack e estrutura

**Stack:** Vite, Svelte 5, TypeScript, Vitest. Nenhuma biblioteca de UI, roteador ou estado.
CSS puro com variáveis. Dependência de runtime: só Svelte. Nova dependência exige
justificativa no PR.

```
letra-ia/
├── content/
│   ├── capitulos.json          # ordem dos capítulos: { "order": [ids] }; título e ícone ficam no arquivo de cada capítulo
│   └── capitulos/
│       ├── 01-o-que-e-ia.json
│       └── ...
├── src/
│   ├── App.svelte              # máquina de estados: qual tela mostrar
│   ├── lib/
│   │   ├── content/            # tipos TS, carregamento e validação do JSON
│   │   ├── progress/           # localStorage
│   │   └── scoring/            # estrelas e avaliação de build-prompt
│   ├── screens/                # Start, Map, Phase, Certificate
│   ├── phases/                 # Explanation, ChoosePrompt, BuildPrompt
│   └── ui/                     # componentes usados em 2+ lugares
├── tests/
├── public/
└── .github/workflows/deploy.yml
```

**Princípio:** motor guiado por dados. O código conhece tipos de fase, não capítulos.
Adicionar fase é editar JSON. Adicionar tipo de desafio é criar um componente e registrá-lo.

## 5. Modelo de conteúdo

Capítulo: `{ id, title, icon, phases: Phase[] }`. Cada fase tem `id` único global e `type`.

### `explanation`

```json
{
  "id": "ia-nao-e-pessoa",
  "type": "explanation",
  "title": "A IA não é uma pessoa",
  "cards": [{ "title": "...", "text": "...", "illustration": "robot-face" }]
}
```

1 a 3 cartões. Sem pontuação; concluir dá 3 estrelas.

### `choose-prompt`

```json
{
  "id": "receita-geladeira",
  "type": "choose-prompt",
  "situation": "Você tem ovos, tomate e pão. Quer uma ideia de jantar rápido.",
  "options": [
    { "text": "me dá uma receita", "correct": false, "feedback": "Muito vago..." },
    { "text": "Tenho ovos, tomate e pão. Sugira um jantar rápido, em até 5 passos.",
      "correct": true, "feedback": "Contexto, objetivo e formato." }
  ],
  "resultPreview": "Que tal uma omelete de tomate com torrada? 1. ..."
}
```

3 ou 4 opções, exatamente uma `correct`. Todas têm `feedback`. Tenta até acertar.

### `build-prompt`

```json
{
  "id": "email-chefe",
  "type": "build-prompt",
  "situation": "Você precisa avisar seu chefe que vai se atrasar amanhã.",
  "required": ["context", "task", "tone"],
  "blocks": [
    { "id": "b1", "category": "context", "text": "Tenho consulta médica às 8h..." },
    { "id": "b2", "category": "task", "text": "Escreva um e-mail curto avisando o atraso." },
    { "id": "b3", "category": "tone", "text": "Tom profissional, mas cordial." },
    { "id": "b4", "category": "noise", "text": "Meu CPF é 123.456.789-00.",
      "feedback": "Nunca compartilhe documentos pessoais com a IA." }
  ],
  "successFeedback": "Contexto, tarefa e tom. Esse prompt gera um e-mail pronto.",
  "resultPreview": "Olá, Ana. Amanhã tenho consulta médica..."
}
```

Categorias: `context`, `task`, `format`, `tone`, `example`, `noise`. A pessoa toca em blocos
para adicionar ou remover, depois clica em "Testar meu prompt". Avaliação:

- Sucesso quando toda categoria em `required` tem ao menos um bloco selecionado e nenhum
  bloco `noise` está selecionado.
- Feedback por problema: categoria faltando gera mensagem genérica por categoria
  ("faltou dizer o formato"); bloco `noise` selecionado mostra o `feedback` dele.

### Validação

Funções escritas à mão em `lib/content/validate.ts`, sem biblioteca de schema. Regras:
ids únicos, `type` conhecido, campos obrigatórios presentes, `choose-prompt` com exatamente
uma opção correta, `build-prompt` com todo `required` coberto por ao menos um bloco da
categoria e `feedback` em todo bloco `noise`.

## 6. Fluxo e progresso

**Telas** (máquina de estados em `App.svelte`):

1. **Início** — nome, uma frase, "Começar" ou "Continuar", link para o repositório, opção
   "Recomeçar do zero" com confirmação.
2. **Mapa** — capítulos em coluna, fases como bolinhas com estrelas. Fase atual pulsa;
   futuras travadas. Capítulo abre quando o anterior termina.
3. **Fase** — componente conforme `type`. Barra de progresso do capítulo, "Voltar ao mapa".
4. **Certificado** — quando tudo concluído. Nome digitado, data, total de estrelas,
   "Imprimir" (CSS print) e "Compartilhar" (Web Share API quando disponível).

**Estrelas:** 1 tentativa = 3, 2 tentativas = 2, 3 ou mais = 1. Refazer pode melhorar,
nunca piorar.

**Progresso** em `localStorage`, chave única com versão:

```json
{ "version": 1, "phases": { "receita-geladeira": { "stars": 2, "attempts": 2 } },
  "playerName": "Ana" }
```

Leitura validada: JSON corrompido ou versão desconhecida vira progresso zerado.
Desbloqueio é derivado (fase aberta se é a primeira ou a anterior está concluída),
não armazenado.

**Erros:** capítulo que falha ao carregar aparece como "indisponível" no mapa, o resto
funciona. `type` desconhecido mostra mensagem amigável e botão de voltar.

## 7. UI e acessibilidade

- Mobile-first, coluna única, largura máxima de leitura no desktop, alvos de toque de 44px,
  fonte do sistema, tamanho base generoso.
- Sem drag and drop: tocar adiciona, tocar de novo remove.
- Mascote em SVG inline com 4 expressões: neutro, explicando, comemorando, "hmm".
  Balão de fala nas explicações e feedbacks. Animação mínima em CSS. Aparência amigável,
  nem robô assustador nem pessoa realista.
- Feedback sempre no mesmo lugar, com cor, ícone e texto. Erro explica e convida a tentar
  de novo. Acerto mostra `resultPreview` em cartão que imita resposta de IA.
- Acessibilidade: teclado completo, foco visível, `aria-live` no feedback, contraste AA,
  `prefers-reduced-motion`.
- Sem imagens pesadas; SVG ou emoji. Deve carregar rápido em 3G.

### Identidade visual: DESIGN.md (revisão de 2026-09-17)

Substitui a identidade "editorial calma" original. A referência é o DESIGN.md de
https://www.designmd.co/d/claude, uma leitura de terceiros do site do Claude. Seguimos os
tokens; ficam de fora logo, nome, símbolo e qualquer elemento de marca da Anthropic. O jogo
continua neutro entre ferramentas.

**Tipografia (Google Fonts):**
- Cormorant Garamond 500 (substituta aberta de Copernicus) só em títulos h1 a h3, com
  espaçamento negativo (-0,3 a -0,5px). Peso 500 no celular e 700 a partir de 768px de
  largura: a Cormorant é bem mais fina que a Copernicus original e fica fraca em tela grande.
  É um desvio deliberado da regra "display nunca em negrito" do DESIGN.md.
- Inter (substituta de StyreneB) em todo o resto: corpo 17px/1,55, rótulos 12px/500 em
  caixa alta com 1,5px de espaçamento, botões.
- Pilha monoespaçada do sistema no rótulo do cartão de resposta da IA. Sem webfont extra.

**Paleta (variáveis CSS em `src/app.css`):**

| Variável | Cor | Papel no DESIGN.md |
|---|---|---|
| `--paper` | `#faf9f5` | canvas |
| `--card` | `#efe9de` | surface-card (balão do mascote, cartões) |
| `--surface-soft` | `#f5f0e8` | seleção e fase atual |
| `--line` | `#e6dfd8` | hairline |
| `--ink` | `#141413` | títulos, seleção, progresso, estrelas, botão secundário escuro |
| `--body` | `#3d3d3a` | texto corrido |
| `--ink-soft` | `#65635d` | muted. Um passo mais escuro que `#6c6a64` para manter 4,5:1 sobre `--card` |
| `--accent` | `#cc785c` | primary: só botão principal e mascote |
| `--accent-strong` | `#a9583e` | primary-active: botão pressionado, links, boca do mascote |
| `--surface-dark` / `--on-dark` | `#181715` / `#faf9f5` | cartão "O que a IA responderia" |
| `--success` / `--error` | `#5f7347` / `#b5533c` | feedback, sempre com ícone e texto |

**Coral é escasso:** progresso, seleção, pontos do mapa e estrelas usam `--ink`. Coral fica
no botão principal e no mascote.

**Contraste do botão principal:** branco sobre `#cc785c` dá 3,27:1. O rótulo usa 19px em
peso 700, que é "texto grande" pela WCAG e exige 3:1. É o único desvio do token de
tipografia de botão do DESIGN.md (14px/500), feito para manter AA.

**Formas:** cartões com raio de 12px, botões e campos com 8px, 48px de altura mínima nos
botões. Sem sombra. O ritmo creme para escuro aparece no cartão de resposta da IA.

**Mascote "Letra":** um "a" minúsculo em pixel-art (grade 13x13, SVG de retângulos,
`shape-rendering: crispEdges`), corpo coral, o bojo da letra é o rosto. Quatro expressões
(neutro, explicando, feliz, "hmm") trocam só olhos e boca. Pisca a cada 5s e dá um pulinho
quando feliz, com `steps()`; tudo desligado por `prefers-reduced-motion`. Personagem
original, no espírito pixel-art do mascote do Claude Code, sem copiá-lo. O favicon usa o
mesmo desenho.

**Ícones:** Pixelarticons (MIT), em pixel-art como o mascote. Só os SVGs usados são
copiados para `src/assets/icons/` e embutidos no build; não há pacote de ícones como
dependência. O conteúdo referencia ícones pelo nome do arquivo (`icon` do capítulo,
`illustration` do cartão) e o teste de conteúdo recusa nomes inexistentes. Emoji não é
mais usado, porque vira quadrado em sistemas sem fonte de emoji.

Tema escuro continua fora de escopo.

## 8. Testes

Simples, dois grupos, em Vitest:

- **Conteúdo:** um teste carrega todos os JSONs de `content/` e roda a validação. Falha o CI
  se algum estiver quebrado.
- **Unitários em `lib/`:** regras de estrelas, avaliação de `build-prompt`, leitura de
  progresso corrompido. Poucos casos, sem mocks elaborados.

Sem testes de componentes, sem end-to-end. UI verificada manualmente.

## 9. Repositório e deploy

- Licença MIT para código, CC BY-SA 4.0 para conteúdo.
- `README.md`: o que é, como jogar, rodar localmente, contribuir com uma fase (schema em
  linguagem simples). `CONTRIBUTING.md` curto.
- GitHub Actions em push para `main`: instala, testa, build, publica em Pages. `base` do
  Vite aponta para o nome do repositório.

## 10. Fora do escopo da v1

Avaliação por IA real, login e nuvem, ranking, conquistas, tradução, sons, novos tipos de
fase, testes de componente e end-to-end.
