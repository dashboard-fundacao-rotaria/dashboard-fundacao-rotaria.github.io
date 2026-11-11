# Fundação Rotária · Rotaract Brasil

Site oficial de acompanhamento das contribuições do Rotaract Brasil à
Fundação Rotária (The Rotary Foundation), desenvolvido para a equipe de
assessoria nacional de Fundação Rotária. Reúne relatórios por distrito,
reconhecimento aos destaques mensais, informações institucionais e o
Programa de Reconhecimento do Ano Rotário 2026-27.

Site estático (HTML, CSS e JavaScript puros — sem build, sem backend,
sem banco de dados), hospedado via GitHub Pages.

---

## Sobre o projeto

O site funciona como um hub de navegação e comunicação, reunindo:

- Relatórios de contribuição por distrito, incorporados via Looker Studio
  (Google Data Studio);
- Reconhecimento mensal aos distritos com maior contribuição;
- As regras oficiais do Programa de Reconhecimento da Fundação Rotária;
- Apresentação da equipe nacional de assessoria;
- Conteúdo institucional sobre a Fundação Rotária e formas de doar;
- Portão de entrada (dirigente de distrito × membro de clube) com menu
  de vídeos tutoriais de como doar, e cotação do dólar em tempo real na
  navbar;
- Carrossel rotativo com os projetos por área de enfoque na Início, e
  atalhos pros destaques do mês, total de contribuição e como doar.

## Estrutura de páginas

| Página | Arquivo |
|---|---|
| Início | `index.html` |
| Nossa Equipe | `equipe.html` |
| Destaques | `destaques.html` |
| Programa de Reconhecimento | `reconhecimento.html` |
| Sobre a Fundação Rotária | `sobre.html` |
| Projetos por Área de Enfoque | `projetos.html` |
| Total de contribuição — Brasil / Área 29 / Área 31 | `estat-geral.html`, `estat-area29.html`, `estat-area31.html` |
| Doações por Fundo | `estat-fundo.html` |
| QTD Rotary Direct | `rotary-direct.html` |
| ABTRF | `abtrf.html` |
| Campanhas (fora do menu até ter conteúdo) | `campanhas.html` |
| Fale Conosco | `contato.html` |

O menu de navegação é gerado dinamicamente por `js/nav.js` a partir de
uma única lista (`TABS`) — todas as páginas herdam o mesmo menu
automaticamente, sem precisar editar cada arquivo HTML individualmente.

## Estrutura de pastas

```
rfr-v2/
├── index.html, equipe.html, destaques.html, ...   → páginas do site
├── css/
│   └── styles.css                                  → estilo global
├── js/
│   ├── nav.js                                       → menu (fonte única) + widget de câmbio
│   ├── portao-entrada.js                             → portão de entrada + modal de vídeo tutorial
│   ├── destaques.js                                 → destaques mensais
│   ├── equipe.js                                     → equipe nacional
│   ├── projetos.js                                   → projetos por área de enfoque
│   └── carrossel-home.js                            → carrossel de projetos na Início (lê os dados de projetos.js)
├── assets/                                           → imagens e fotos
└── README.md
```

## Tecnologias

- HTML5, CSS3 e JavaScript (ES6+), sem frameworks nem etapa de build
- Fonte DM Sans (Google Fonts)
- Relatórios incorporados via Looker Studio (Google Data Studio)
- Formulário de contato via Google Forms

## Como publicar

1. Faça o clone ou baixe este repositório.
2. Publique a pasta como está em qualquer hospedagem de site estático
   (GitHub Pages, Netlify, Vercel, etc.) — não há etapa de build.
3. Para GitHub Pages: em **Settings → Pages**, selecione a branch
   principal e a raiz do repositório como origem.

## Manutenção mensal

**Destaques** (`js/destaques.js`): a cada mês fechado, adicione um novo
bloco em `PERIODOS_MENSAIS` com os três distritos (ouro, prata, bronze)
e o valor total contribuído. A página seleciona automaticamente o mês a
exibir com base na data atual — não é necessário alterar HTML.

**Equipe** (`js/equipe.js`): edite nome, cargo, distrito e foto de cada
membro diretamente na lista `EQUIPE`.

**Projetos** (`js/projetos.js`): siga o mesmo padrão para adicionar
novos projetos por área de enfoque. O carrossel da Início (`index.html`,
motor em `js/carrossel-home.js`) lê essa mesma lista — não precisa
cadastrar os projetos em dois lugares, um novo projeto já aparece
sozinho no carrossel.

## Portão de entrada + vídeos tutoriais

`js/portao-entrada.js` mostra, na primeira página que a pessoa abrir em
cada sessão do navegador, um popup obrigatório (não é possível fechar
sem escolher) perguntando se ela é "dirigente do seu distrito" ou
"membro do seu clube". Depois da escolha, abre um menu (esse fechável)
com os vídeos tutoriais relevantes pro papel — cada papel vê uma lista
diferente (ver `MENUS` no topo do arquivo). Escolhendo um vídeo, ele
abre por cima do menu; fechando o vídeo, volta pro menu, sem precisar
escolher o papel de novo.

Os vídeos ficam hospedados no Google Drive, numa pasta compartilhada só
com a equipe — cada arquivo individual precisa estar com permissão
"Qualquer pessoa com o link → Leitor" (não "Editor") pra funcionar
embutido no site sem abrir brecha de edição. Pra adicionar ou trocar um
vídeo: cadastre o embed em `VIDEOS` e referencie a chave em `MENUS`.

## Dólar Rotário na navbar (atualizado sozinho)

`js/nav.js` (função `montarWidgetCambio`) mostra, no lugar onde antes
ficava o botão de acesso, o valor OFICIAL do Dólar Rotário — o mesmo
número publicado no topo de rotary.org.br (ex.: "Dólar Rotário -
Setembro de 2026 - R$ 5,19"). Não existe API pública pra esse valor,
então o widget lê `assets/dolar-rotario.json`, um arquivo local do
próprio site (busca same-origin, sem CORS).

Esse JSON é mantido em dia sozinho por um GitHub Action
(`.github/workflows/atualizar-dolar-rotario.yml`, roda todo dia à
meia-noite de Brasília, e também pode ser disparado manualmente em
Actions → Run workflow). Ele raspa a página da rotary.org.br
(`.github/scripts/atualizar_dolar_rotario.py`) e só commita se achar o
padrão esperado — se a Rotary mudar o layout daquela página, a
automação para de atualizar (sem sobrescrever com valor errado) e abre
uma issue automaticamente pra avisar; nesse caso o regex do script
precisa ser ajustado à mão.

## Licença e créditos

Conteúdo institucional da Fundação Rotária (The Rotary Foundation) e do
Rotaract Brasil. Desenvolvido para uso interno da equipe de assessoria
nacional de Fundação Rotária.
