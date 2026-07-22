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
- Acesso segmentado por distrito a relatórios individuais.

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
| Campanhas | `campanhas.html` |
| Fale Conosco | `contato.html` |

O menu de navegação é gerado dinamicamente por `js/nav.js` a partir de
uma única lista (`TABS`) — todas as páginas herdam o mesmo menu
automaticamente, sem precisar editar cada arquivo HTML individualmente.

## Estrutura de pastas

```
rfr-v2/
├── index.html, equipe.html, destaques.html, ...   → páginas do site
├── distritos/                                      → páginas de acesso restrito por distrito
├── css/
│   └── styles.css                                  → estilo global
├── js/
│   ├── nav.js                                       → menu (fonte única)
│   ├── destaques.js                                 → destaques mensais
│   ├── equipe.js                                     → equipe nacional
│   ├── projetos.js                                   → projetos por área de enfoque
│   └── chaves-acesso.js                               → mapeamento de acesso por distrito
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
novos projetos por área de enfoque.

## Acesso segmentado por distrito

O site conta com um mecanismo simples de chave de acesso: cada distrito
recebe uma chave própria que o direciona à sua página individual de
relatório, dentro da pasta `distritos/`. O mapeamento entre chaves e
páginas fica em `js/chaves-acesso.js`.

**Importante:** este é um mecanismo de conveniência, não um sistema de
autenticação com segurança robusta — o código roda inteiramente no
navegador do visitante, então qualquer pessoa com conhecimento técnico
básico pode inspecionar o código-fonte da página. Não é adequado para
dados sigilosos ou de alta sensibilidade. A lista de chaves ativas e a
qual distrito cada uma pertence é mantida em uma planilha interna, fora
deste repositório.

## Licença e créditos

Conteúdo institucional da Fundação Rotária (The Rotary Foundation) e do
Rotaract Brasil. Desenvolvido para uso interno da equipe de assessoria
nacional de Fundação Rotária.
