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
//
//   imagem -> a foto grande do topo do card. Duas opções:
//     (a) URL de uma imagem já hospedada (Drive, Imgur, etc.)
//     (b) arquivo local dentro de assets/img/ — os dois projetos reais
//         já apontam pra cá (ex: "assets/img/pontes-para-o-futuro.jpg").
//         Só colocar o arquivo com esse nome exato na pasta que a foto
//         aparece sozinha, sem editar mais nada.
//     Se o arquivo ainda não existir, aparece um placeholder cinza
//     "Adicione a foto" no lugar — não quebra a página.
// ============================================================================
const PROJETOS = [
  // ---- Projetos reais já cadastrados ----
  {
    titulo: "Pontes para o Futuro",
    area: "educacao",
    descricao: "Subsídio Distrital do Rotary financiou uma oficina de informática na SASBEMC, em Cianorte (PR), levando ensino de pacote Office e navegação segura na internet a crianças, jovens e adultos em situação de vulnerabilidade — com a operação assumida pela própria instituição após a conclusão.",
    imagem: "assets/img/pontes-para-o-futuro.jpg",
    link: "https://spc.rotary.org/project?guid=5E31FE96-2883-4D69-B8C0-EE2FEEBB68C4",
    pills: [{ texto: "40 Voluntários", cor: "#92278f" }, { texto: "8 Meses", cor: "#1f1f1e" }, { texto: "US$ 4.860", cor: "#6b6a66" }],
    exemplo: false
  },
  {
    titulo: "Reciclagem em Foco",
    area: "ambiente",
    descricao: "Subsídio Distrital do Rotary equipou a Cooperativa Crescer, em Lapa (SP), com um notebook, marmiteiros e armários para os cooperados – melhorando as condições administrativas, operacionais e de trabalho de quem atua há 19 anos na coleta de material reciclável da região.",
    imagem: "assets/img/reciclagem-em-foco.jpg",
    link: "https://spc.rotary.org/project?guid=1B1CE671-DB61-4143-84F6-C3710B0514E2",
    pills: [{ texto: "70 Cooperados", cor: "#0072bc" }, { texto: "6 Meses", cor: "#1f1f1e" }, { texto: "US$ 1.675", cor: "#6b6a66" }],
    exemplo: false
  },

  // ---- Projetos-exemplo do relatório original (substituir quando houver projetos reais dessas áreas) ----
  {
    titulo: "Brinquedoteca — Casa de Acolhimento Adiles de Figueiredo Ribeiro",
    area: "paz",
    descricao: "Projeto do Rotary Club de Corumbá que equipou uma brinquedoteca na Casa de Acolhimento Institucional, atendendo crianças em situação de vulnerabilidade social. Concluído com apoio de subsídio distrital da Fundação Rotária, parceiros locais e 14 voluntários.",
    imagem: "assets/img/brinquedoteca.jpg",
    link: "https://spc.rotary.org/project?guid=acf0e8f2-38ba-4c97-a0f9-575fe712fefd&lang=pt",
    pills: [{ texto: "30 crianças", cor: "#d41367" }, { texto: "1 mês", cor: "#1f1f1e" }, { texto: "US$ 3.900", cor: "#6b6a66" }],
    exemplo: false
  },
  {
    titulo: "Projeto bebedouros — CAIA itinerante",
    area: "agua",
    descricao: "Com subsídio distrital da Fundação Rotária, o Rotary Club Foz do Iguaçu-Grande Lago instalou 6 purificadores de água nos centros de convivência do CAIA, entidade que atende crianças e adolescentes em situação de vulnerabilidade em Foz do Iguaçu (PR).",
    imagem: "assets/img/bebedouros.jpg",
    link: "https://spc.rotary.org/project?guid=dd1ef70b-d05a-4bd6-8f7a-7006b03c720e",
    pills: [{ texto: "430+ jovens", cor: "#00a9ce" }, { texto: "6 bebedouros", cor: "#1f1f1e" }, { texto: "US$ 1.200", cor: "#6b6a66" }],
    exemplo: false
  },
  {
    titulo: "Estrutura da cozinha — IDAC Maanain",
    area: "doencas",
    descricao: "Com subsídio distrital da Fundação Rotária e apoio do Rotary Club Assis-Fraternal, o projeto equipou a cozinha da comunidade terapêutica IDAC Maanain, em Assis (SP), com geladeira, fogão industrial, cuba de inox e demais itens, melhorando as condições de acolhimento de pessoas em recuperação de dependência química.",
    imagem: "assets/img/cozinha.jpg",
    link: "https://spc.rotary.org/project?guid=8b3dd1a6-198d-4cdf-be00-effd78021fb6",
    pills: [{ texto: "15 pessoas atendidas", cor: "#ee3124" }, { texto: "5,5 meses", cor: "#1f1f1e" }, { texto: "US$ 2.141", cor: "#6b6a66" }],
    exemplo: false
  },
  {
    titulo: "Cuidar: vida plena para mulheres e mães",
    area: "saude-mi",
    descricao: "Com subsídio distrital da Fundação Rotária e apoio dos clubes São Paulo-Paraíso e São Paulo-Brasil-Taiwan, o projeto adquiriu um aspirador Dia-Pump Colibri para o Hospital e Maternidade JJM, em Guarulhos (SP), reforçando o cuidado ginecológico e obstétrico oferecido pela instituição.",
    imagem: "assets/img/mulheres-e-maes.jpg",
    link: "https://spc.rotary.org/project?guid=a869d62c-cdab-42f1-b28f-ae5118760855",
    pills: [{ texto: "210 pacientes/mês", cor: "#f7941d" }, { texto: "8 meses", cor: "#1f1f1e" }, { texto: "US$ 1.543", cor: "#6b6a66" }],
    exemplo: false
  },
  {
    titulo: "Forno da esperança — geração de renda e reintegração social",
    area: "economico",
    descricao: "Com subsídio distrital da Fundação Rotária, o Rotary Club Santa Fé do Sul entregou um forno industrial, um liquidificador industrial e assadeiras à Chácara Jerusalém, casa de recuperação de dependência química, viabilizando a produção e venda de pães e bolos como fonte de renda e reintegração social.",
    imagem: "assets/img/forno-da-esperanca.jpg",
    link: "https://spc.rotary.org/project?guid=b65e2398-9580-4a16-ba34-259b2d5fefc2",
    pills: [{ texto: "20 pessoas atendidas", cor: "#8dc63f" }, { texto: "5,5 meses", cor: "#1f1f1e" }, { texto: "US$ 411", cor: "#6b6a66" }],
    exemplo: false
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
          <img src="${p.imagem}" alt="${p.titulo}" loading="lazy"
               onerror="this.onerror=null;this.src='https://placehold.co/640x400/eeeeee/999999?text=Adicione+a+foto';">
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
