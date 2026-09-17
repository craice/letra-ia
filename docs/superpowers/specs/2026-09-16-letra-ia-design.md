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
  "cards": [{ "title": "...", "text": "...", "illustration": "🤖" }]
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

### Identidade visual: "editorial calma"

Inspirada no clima do site da Anthropic (papel, serifa, terracota, ilustração de linha,
muito espaço), sem usar logo, nome, marca ou qualquer elemento que sugira produto oficial.
O jogo é neutro entre ferramentas.

**Tipografia (Google Fonts, ou hospedadas no repositório):**
- Newsreader (serifa) para quase tudo: títulos, textos, falas do mascote, opções de prompt.
  Itálico para subtítulos e frases de apoio.
- Instrument Sans (sem-serifa) só para rótulos pequenos em caixa alta ("Capítulo 2 · Fase 3
  de 6"), botões e números.
- Tamanho base generoso; títulos com espaçamento de letras levemente negativo.

**Paleta (variáveis CSS):**

| Papel | Cor | Uso |
|---|---|---|
| fundo | `#F0EEE6` | fundo da página |
| cartão | `#FAF9F5` | cartões, balões, opções |
| linha | `#DEDBD0` | bordas finas de 1px |
| texto | `#141413` | texto principal, botão primário |
| texto suave | `#5E5D59` | apoio, rótulos |
| destaque | `#D97757` | progresso, seleção, estrelas, botão de ação, brilho do mascote |
| acerto | `#788C5D` | feedback de sucesso |
| apoio | `#6A9BCC` | detalhes ocasionais em ilustrações |
| erro | tom terroso avermelhado, definido na implementação | feedback de erro, sempre com ícone e texto |

Tema escuro na v1 fica **fora de escopo**: a identidade depende do papel creme. Apenas
`prefers-reduced-motion` é respeitado.

**Formas:** cartões com raio de 12 a 14px e borda de 1px, sem sombra forte. Botões em
pílula. Barra de progresso fina (3px). Fases no mapa como pontos pequenos, preenchidos em
terracota quando concluídos.

**Mascote:** rosto redondo em traço fino de 1,5px na cor do texto, fundo do cartão, três
raios curtos em terracota no topo. Quatro expressões trocam apenas boca e olhos.

**Ilustrações dos cartões de explicação:** traço de linha fina monocromático com um toque
de terracota, no mesmo estilo do mascote. Emoji como fallback aceitável.

Mockup de referência: `docs/superpowers/specs/2026-09-16-letra-ia-visual-mockup.html`, variação B.

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
