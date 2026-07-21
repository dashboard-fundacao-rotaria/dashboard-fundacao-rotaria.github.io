// ============================================================================
// 1) ÁREAS DE ENFOQUE
// As 7 áreas oficiais usadas no relatório da Fundação Rotária, com a cor
// aproximada de cada uma (baseada nas bolinhas do PDF original).
// O "id" é o valor interno usado para filtrar — não mude sem atualizar
// também os projetos que usam essa área.
// ============================================================================
const AREAS = {
  "paz":        { label: "Promoção da Paz", cor: "#e4177b" },
  "agua":       { label: "Água, Saneamento e Higiene", cor: "#00a9ce" },
  "doencas":    { label: "Prevenção e Tratamento de Doenças", cor: "#ee3124" },
  "saude-mi":   { label: "Saúde Materno-Infantil", cor: "#f7941d" },
  "educacao":   { label: "Educação Básica e Alfabetização", cor: "#92278f" },
  "economico":  { label: "Desenvolvimento Econômico e Comunitário", cor: "#8dc63f" },
  "ambiente":   { label: "Meio Ambiente", cor: "#0072bc" },
};

// ============================================================================
// 2) PROJETOS
// Campos:
//   titulo, area (chave de AREAS), descricao, imagem, link
//   pills      -> lista de 1-3 estatísticas curtas (ex: "800+ Leitores")
//   exemplo    -> true para os projetos-modelo do relatório original.
//                 Marque como false (ou remova o campo) nos projetos reais.
//                 Isso só controla o selo "Exemplo" no card — não afeta o filtro.
// ============================================================================
const PROJETOS = [
  // ---- Projetos reais já cadastrados ----
  {
    titulo: "Pontes para o Futuro",
    area: "educacao",
    descricao: "Oficina de informática na SASBEMC (Cianorte-PR), levando ensino de pacote Office e navegação segura à comunidade.",
    imagem: "https://placehold.co/640x400/f3e3f0/92278f?text=Pontes+para+o+Futuro",
    link: "https://spc.rotary.org/project?guid=5E31FE96-2883-4D69-B8C0-EE2FEEBB68C4",
    pills: [{ texto: "8 Meses", cor: "#1f1f1e" }, { texto: "US$ 4.860", cor: "#6b6a66" }],
    exemplo: false
  },
  {
    titulo: "Reciclagem em Foco",
    area: "ambiente",
    descricao: "Equipamentos doados à Cooperativa Crescer (Lapa-SP): notebook, marmiteiros e armários para 70 cooperados.",
    imagem: "https://placehold.co/640x400/e1edf7/0072bc?text=Reciclagem+em+Foco",
    link: "https://spc.rotary.org/project?guid=1B1CE671-DB61-4143-84F6-C3710B0514E2",
    pills: [{ texto: "70 Cooperados", cor: "#0072bc" }, { texto: "6 Meses", cor: "#1f1f1e" }],
    exemplo: false
  },

  // ---- Projetos-exemplo do relatório original (substituir quando houver projetos reais dessas áreas) ----
  {
    titulo: "Projeto Exemplo: Mediação Comunitária",
    area: "paz",
    descricao: "Financiado pela Fundação Rotária, capacitou jovens líderes em técnicas de mediação de conflitos em comunidades vulneráveis, com oficinas semanais durante 6 meses.",
    imagem: "https://placehold.co/640x400/fbe3ee/e4177b?text=Media%C3%A7%C3%A3o+Comunit%C3%A1ria",
    link: "#",
    pills: [{ texto: "200+ Famílias", cor: "#e4177b" }, { texto: "6 Meses", cor: "#1f1f1e" }, { texto: "US$ 15.000", cor: "#6b6a66" }],
    exemplo: true
  },
  {
    titulo: "Projeto Exemplo: Água Limpa para Todos",
    area: "agua",
    descricao: "Instalou sistemas de filtragem de água em 3 escolas rurais, beneficiando mais de 500 alunos, com palestras sobre higiene e saneamento básico.",
    imagem: "https://placehold.co/640x400/dcf1f5/00a9ce?text=%C3%81gua+Limpa+para+Todos",
    link: "#",
    pills: [{ texto: "500+ Alunos", cor: "#00a9ce" }, { texto: "3 Escolas", cor: "#1f1f1e" }, { texto: "US$ 20.000", cor: "#6b6a66" }],
    exemplo: true
  },
  {
    titulo: "Projeto Exemplo: Vacinação em Comunidades Rurais",
    area: "doencas",
    descricao: "Campanhas de vacinação rural de difícil acesso, com equipes de saúde percorrendo vilarejos durante 4 meses, imunizando crianças e adultos.",
    imagem: "https://placehold.co/640x400/fbe0dd/ee3124?text=Vacina%C3%A7%C3%A3o+Rural",
    link: "#",
    pills: [{ texto: "1200+ Vacinados", cor: "#ee3124" }, { texto: "4 Meses", cor: "#1f1f1e" }, { texto: "US$ 25.000", cor: "#6b6a66" }],
    exemplo: true
  },
  {
    titulo: "Projeto Exemplo: Pré-Natal para Todas",
    area: "saude-mi",
    descricao: "Criou postos móveis de atendimento pré-natal em áreas carentes, oferecendo consultas, exames e orientação nutricional para gestantes sem acesso a serviços de saúde.",
    imagem: "https://placehold.co/640x400/fcecd9/f7941d?text=Pr%C3%A9-Natal+para+Todas",
    link: "#",
    pills: [{ texto: "350+ Gestantes", cor: "#f7941d" }, { texto: "8 Meses", cor: "#1f1f1e" }, { texto: "US$ 30.000", cor: "#6b6a66" }],
    exemplo: true
  },
  {
    titulo: "Projeto Exemplo: Biblioteca Comunitária",
    area: "educacao",
    descricao: "Construção de uma biblioteca comunitária com acervo de mais de 5.000 livros, além de programas de alfabetização para adultos e reforço escolar para crianças em vulnerabilidade.",
    imagem: "https://placehold.co/640x400/f3e3f0/92278f?text=Biblioteca+Comunit%C3%A1ria",
    link: "#",
    pills: [{ texto: "800+ Leitores", cor: "#92278f" }, { texto: "12 Meses", cor: "#1f1f1e" }, { texto: "US$ 35.000", cor: "#6b6a66" }],
    exemplo: true
  },
  {
    titulo: "Projeto Exemplo: Capacitação Profissional",
    area: "economico",
    descricao: "Ofereceu cursos de capacitação profissional em costura, jardinagem e informática, gerando renda e autonomia para famílias em comunidades de baixa renda.",
    imagem: "https://placehold.co/640x400/eaf4dc/8dc63f?text=Capacita%C3%A7%C3%A3o+Profissional",
    link: "#",
    pills: [{ texto: "150+ Formados", cor: "#8dc63f" }, { texto: "10 Meses", cor: "#1f1f1e" }, { texto: "US$ 22.000", cor: "#6b6a66" }],
    exemplo: true
  },
  {
    titulo: "Projeto Exemplo: Reflorestamento Urbano",
    area: "ambiente",
    descricao: "Plantio de mais de 3.000 mudas nativas em áreas degradadas da cidade, envolvendo escolas e voluntários em ações de educação ambiental e recuperação de nascentes.",
    imagem: "https://placehold.co/640x400/e1edf7/0072bc?text=Reflorestamento+Urbano",
    link: "#",
    pills: [{ texto: "3.000+ Mudas", cor: "#0072bc" }, { texto: "6 Meses", cor: "#1f1f1e" }, { texto: "US$ 18.000", cor: "#6b6a66" }],
    exemplo: true
  },
];

// ============================================================================
// A partir daqui é motor — normalmente não precisa editar para adicionar
// projeto ou área nova.
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('grid');
  const filtro = document.getElementById('filtro');
  const vazio = document.getElementById('vazio');
  const contador = document.getElementById('contador');

  if (!grid || !filtro) return;

  PROJETOS.forEach(p => {
    if (!AREAS[p.area]) {
      console.warn(
        `[projetos.js] O projeto "${p.titulo}" usa area="${p.area}", que não existe em AREAS. ` +
        `Ele só vai aparecer em "Todas as áreas", nunca num filtro específico.`
      );
    }
  });

  filtro.innerHTML =
    '<option value="todas">Todas as áreas</option>' +
    Object.entries(AREAS)
      .map(([id, a]) => `<option value="${id}">${a.label}</option>`)
      .join('');

  function render(lista) {
    grid.innerHTML = lista.map(p => {
      const areaInfo = AREAS[p.area] || { label: p.area, cor: "#888" };
      const pillsHtml = (p.pills || [])
        .map(pl => `<span class="pill-mini" style="background:${pl.cor}">${pl.texto}</span>`)
        .join('');
      const seloHtml = p.exemplo ? '<span class="selo-exemplo">Exemplo</span>' : '';

      return `
        <div class="card" data-area="${p.area}">
          <img src="${p.imagem}" alt="${p.titulo}" loading="lazy">
          <div class="card-body">
            <div class="eyebrow" style="color:${areaInfo.cor}">
              <span class="dot" style="background:${areaInfo.cor}"></span>${areaInfo.label}
              ${seloHtml}
            </div>
            <h3>${p.titulo}</h3>
            <p>${p.descricao}</p>
            <div class="pills-card">${pillsHtml}</div>
            <a class="saiba-mais" href="${p.link}" target="_blank" rel="noopener">Saiba mais →</a>
          </div>
        </div>`;
    }).join('');

    vazio.style.display = lista.length === 0 ? 'block' : 'none';
    contador.textContent = `${lista.length} projeto${lista.length === 1 ? '' : 's'}`;
  }

  filtro.addEventListener('change', () => {
    const valor = filtro.value;
    const lista = valor === 'todas' ? PROJETOS : PROJETOS.filter(p => p.area === valor);
    render(lista);
  });

  render(PROJETOS);
});
