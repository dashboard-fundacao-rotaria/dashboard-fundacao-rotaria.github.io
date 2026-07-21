# Fundação Rotária &middot; Rotaract Brasil (v2 — multi-página)

Site estático (HTML/CSS/JS puro, sem build, sem backend), agora com
**uma página por seção**, espelhando exatamente a ordem e os nomes das
abas do relatório real no Looker Studio.

---

## ⚠ Se o CSS "sumiu" ao abrir o site

Isso quase certamente aconteceu porque, em algum momento, você abriu um
arquivo `.html` **sozinho**, fora da pasta do projeto — sem as pastas
`css/` e `js/` ao lado dele. O HTML referencia o estilo com um caminho
relativo (`css/styles.css`); se esse arquivo não estiver dentro da mesma
pasta que `css/` e `js/`, o navegador não encontra o estilo e mostra tudo
sem formatação.

**Regra simples para nunca mais acontecer:** sempre extraia o `.zip`
inteiro e abra o `index.html` **de dentro da pasta extraída** — nunca um
`.html` copiado/baixado separadamente.

---

## Estrutura de pastas

```
rfr-v2/
├── index.html            → Início (só a capa)
├── equipe.html            → Nossa Equipe
├── guia.html               → Guia de Utilização (reservada)
├── destaques.html          → Destaques
├── sobre.html               → Sobre a Fundação Rotária
├── doacao.html              → Sua doação transforma
├── projetos.html            → Projetos por Área de Enfoque
├── estat-geral.html         → Total de contribuição dos distritos do Brasil
├── estat-area29.html        → Total de contribuição - Área 29
├── estat-area31.html        → Total de contribuição - Área 31
├── estat-fundo.html         → Doações por Fundo
├── rotary-direct.html       → QTD Rotary Direct (reservada)
├── abtrf.html                → ABTRF (reservada)
├── campanhas.html            → Campanhas (reservada)
├── contato.html              → Fale Conosco
├── css/
│   └── styles.css            → todo o estilo (inclui a barra de abas)
├── js/
│   ├── nav.js                 → menu de abas (fonte única, edite só aqui)
│   ├── projetos.js           → áreas de enfoque, projetos, filtro
│   └── equipe.js              → lista da equipe nacional
├── assets/
│   ├── img/                   → fotos dos projetos (opcional, arquivo local)
│   └── equipe/                 → fotos da equipe (opcional, arquivo local)
└── README.md
```

Cada página HTML carrega o menu de abas dinamicamente a partir de
**`js/nav.js`** (fonte única — ver seção "Como editar o menu de abas"
abaixo). O `<nav>` no HTML de cada página é só um contêiner vazio,
preenchido pelo script no carregamento.

---

## Logo real e capa do Canva

Duas peças de arte real foram incorporadas:

- **Logo** (`assets/logo/rotaract-rotary-logo.png`) — substitui o "logo em
  texto" que existia antes no cabeçalho de todas as páginas.

- **Capa** (`assets/capa/capa-canva.png`) — a arte pronta do Canva
  (1920x1080) aparece como a capa em `index.html`, mas **só em telas a
  partir de 900px de largura**. Abaixo disso, o site volta para a versão
  em texto/CSS (título + subtítulo reais), responsiva.

  **Por que não usar a imagem em todas as telas:** o mesmo motivo já
  vale para qualquer imagem de fundo larga — cortar uma imagem 1920x1080
  para caber numa tela de celular estreita esconde a maior parte da
  composição. Em vez de forçar isso, a versão em texto assume no mobile.

  **Por que o texto continua no HTML mesmo escondido no desktop:** para
  não perder acessibilidade (leitor de tela) nem SEO — o texto real
  "Fundação Rotária 2026-27" fica presente no código mesmo quando a
  imagem está sendo exibida, só visualmente oculto (técnica
  `.capa-conteudo-fallback`, não é `display:none` — leitores de tela
  ainda leem normalmente).

  Se no futuro você tiver uma versão da arte do Canva pensada para
  celular (retrato, elementos reposicionados), é só adicionar um
  segundo `<img>` com uma media query para telas pequenas.

---

## Correspondência com as abas reais do relatório

Nomeei e ordenei as páginas exatamente como aparecem na barra de abas do
seu Looker Studio (confirmado no print que você enviou):

Início → Nossa Equipe → Guia de Utilização → Destaques → Sobre a
Fundação Rotária → Sua doação transforma → Projetos por Área de Enfoque →
Total de contribuição dos distritos do Brasil → Total de contribuição -
Área 29 → Total de contribuição - Área 31 → Doações por Fundo → QTD
Rotary Direct → ABTRF → Campanhas → Fale Conosco.

**Os Page IDs de Área 29 / Área 31 / Doações por Fundo continuam sendo
inferência de posição** (alta confiança, mas não checada visualmente por
você ainda) — cada uma dessas três páginas mostra um aviso amarelo
lembrando disso. Confira o título dentro de cada gráfico embutido antes
de divulgar o link publicamente.

---

## Como editar o menu de abas

O menu agora é gerado por **`js/nav.js`** — uma lista única (`TABS`) no
topo do arquivo. Para adicionar, remover, renomear ou reordenar uma aba,
edite **só essa lista**; as 15 páginas puxam o menu dali automaticamente
via JavaScript, no carregamento da página. Não precisa mais editar o
HTML de cada arquivo individualmente.

Isso funciona normalmente mesmo abrindo os arquivos direto no navegador
(sem servidor, via `file://`), porque usa uma tag `<script src="...">`
comum — diferente de um `fetch()` de HTML, que o navegador bloqueia
nesse cenário por política de segurança (CORS). Foi por isso que optei
por essa abordagem em vez de um "include" de HTML.

Cada página carrega `js/nav.js` com um atributo
`data-pagina-atual="nome-do-arquivo.html"` no próprio `<script>` — é
assim que o menu sabe qual aba marcar como ativa (rosa, sublinhada) em
cada página. Se copiar o `<head>`/rodapé de uma página pra criar uma
nova, lembre de atualizar esse atributo.

---

## Como adicionar um projeto novo

Em `js/projetos.js`, adicione um objeto na lista `PROJETOS` (mesma
estrutura de antes — ver comentários no próprio arquivo).

## Como adicionar um membro à equipe

Em `js/equipe.js`, adicione um objeto na lista `EQUIPE`.

## Como preencher as seções reservadas

`guia.html`, `rotary-direct.html`, `abtrf.html` e `campanhas.html` têm um
bloco `<div class="placeholder-reservado">` com um aviso tracejado
"Conteúdo em breve". Substitua esse bloco pelo conteúdo real quando
disponível; pode remover a classe `secao-reservada`/`tag-em-breve` depois.

---

## Configurando os painéis de Estatística

Cada painel (`estat-geral.html`, `estat-area29.html`, `estat-area31.html`,
`estat-fundo.html`) já tem o Report ID e Page ID reais aplicados. Se o
Google pedir login mesmo com o relatório marcado como público, o
problema normalmente é a credencial da fonte de dados, não a permissão
do relatório — em `Recurso → Gerenciar fontes de dados adicionadas`,
edite as credenciais de cada fonte e troque de "Credenciais do
visualizador" para "Credenciais do proprietário".

---

## Como publicar (hospedagem gratuita)

### Netlify (recomendado)
1. Crie uma conta grátis em [netlify.com](https://netlify.com).
2. Arraste a pasta `rfr-v2` inteira (não arquivos soltos) para a área de
   deploy manual.
3. O site sobe com uma URL tipo `seu-projeto.netlify.app`, com HTTPS
   automático.

---

## Limitações conhecidas

- **Sem banco de dados.** Projeto/membro novo = editar `js/projetos.js`
  ou `js/equipe.js` manualmente.
- **Menu depende de JavaScript.** Se o visitante tiver JS desativado
  (raro), a barra de abas não aparece — o conteúdo da página continua
  visível normalmente, só a navegação some. Não implementei fallback
  para esse caso por ser um cenário muito incomum hoje em dia.
- **Erros de CSS não aparecem como erro** — o navegador ignora regras
  quebradas silenciosamente; confira visualmente após qualquer edição.
- **"Enviar meu projeto" não publica nada sozinho** — leva só ao Google
  Forms.
