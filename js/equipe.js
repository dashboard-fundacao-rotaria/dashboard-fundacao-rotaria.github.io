// ============================================================================
// EQUIPE
// "foto" pode ser uma URL ou um arquivo local em assets/equipe/ (ex:
// "assets/equipe/graziele.jpg").
// ============================================================================
const EQUIPE = [
  {
    cargo: "Diretor de Fundação Rotária",
    nome: "Osmar Macedo",
    info: "Rotaract Club de Limeira · Distrito 4590",
    descricao: "Responsável por coordenar a equipe de assessoria da Fundação Rotária, orientando os assessores de área e acompanhando o desempenho dos distritos brasileiros nas contribuições ao longo do Ano Rotário 2026-27.",
    foto: "assets/equipe/osmar.jpg",
    destaque: true
  },
  {
    cargo: "ABTRF & Seguro Solidário",
    nome: "Henrique Marrey",
    info: "Rotaract Club São Paulo Alto da Mooca · Distrito 4563",
    descricao: "Responsável pela ABTRF e pelo Seguro Solidário da Fundação Rotária, apoiando clubes e distritos no acesso a esses benefícios e orientando sobre os critérios e processos envolvidos ao longo do Ano Rotário 2026-27.",
    foto: "assets/equipe/marrey.jpg"
  },
  {
    cargo: "Assessora FR",
    nome: "Kassima Campanha",
    info: "Rotary Club de Campos do Jordão · Distrito 4571",
    descricao: "Responsável por assessorar os distritos brasileiros junto à Fundação Rotária, atuando como ponte entre o Rotaract e o Rotary International no fortalecimento das contribuições e da parceria entre as duas organizações.",
    foto: "assets/equipe/kassima.jpg"
  },
  {
    cargo: "Assessor FR - Área 29",
    // Falta o sobrenome do Abraão — assim que você passar, é só completar aqui.
    nome: "Abraão",
    info: "Rotaract Club de Tenente Ananias · Distrito 4500",
    descricao: "Responsável por apoiar os distritos da Área 29 no fortalecimento das contribuições à Fundação Rotária e acompanhar o progresso ao longo do Ano Rotário 2026-27.",
    foto: "assets/equipe/abraao.jpg"
  },
  {
    cargo: "Assessora FR - Área 31",
    nome: "Graziele Amorim",
    info: "Rotaract Club de Itaquaquecetuba · Distrito 4563",
    descricao: "Responsável por apoiar os distritos da Área 31 no fortalecimento das contribuições à Fundação Rotária e acompanhar o progresso ao longo do Ano Rotário 2026-27.",
    foto: "assets/equipe/graziele.jpg"
  },
];

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('grid-equipe');
  if (!container) return;

  const cardHTML = m => `
    <div class="membro-equipe">
      <img class="membro-foto" src="${m.foto}" alt="${m.nome}">
      <div>
        <p class="membro-cargo">${m.cargo}</p>
        <p class="membro-nome">${m.nome}</p>
        <p class="membro-info">${m.info}</p>
        <p class="membro-desc">${m.descricao}</p>
      </div>
    </div>
  `;

  const diretor = EQUIPE.find(m => m.destaque);
  const resto = EQUIPE.filter(m => !m.destaque);

  const destaque = document.getElementById('destaque-equipe');
  if (destaque && diretor) {
    destaque.innerHTML = `<div class="membro-equipe-centralizado">${cardHTML(diretor)}</div>`;
  }

  container.innerHTML = resto.map(cardHTML).join('');
});
