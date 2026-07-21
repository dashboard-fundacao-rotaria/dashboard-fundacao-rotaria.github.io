// ============================================================================
// EQUIPE
// Preencha os campos entre [colchetes] com os dados reais. Os dois membros
// já preenchidos (Graziele Amorim) vieram do PDF enviado.
// "foto" pode ser uma URL ou um arquivo local em assets/equipe/ (ex:
// "assets/equipe/graziele.jpg").
// ============================================================================
const EQUIPE = [
  {
    cargo: "Diretor",
    nome: "[Nome]",
    info: "RAC de [cidade] · Distrito [nº]",
    descricao: "Responsável por [distritos/área], [o que faz na prática — ex.: apoiando os clubes nas contribuições à Fundação Rotária e acompanhando o alcance das metas].",
    foto: "https://placehold.co/128x128/f4f3f0/6b6a66?text=Foto"
  },
  {
    cargo: "ABTRF",
    nome: "[Nome]",
    info: "RAC de [cidade] · Distrito [nº]",
    descricao: "Responsável por [distritos/área], [o que faz na prática — ex.: apoiando os clubes nas contribuições à Fundação Rotária e acompanhando o alcance das metas].",
    foto: "https://placehold.co/128x128/f4f3f0/6b6a66?text=Foto"
  },
  {
    cargo: "Assessora FR",
    nome: "[Nome]",
    info: "RAC de [cidade] · Distrito [nº]",
    descricao: "Responsável por [distritos/área], [o que faz na prática — ex.: apoiando os clubes nas contribuições à Fundação Rotária e acompanhando o alcance das metas].",
    foto: "https://placehold.co/128x128/f4f3f0/6b6a66?text=Foto"
  },
  {
    cargo: "Assessor FR - Área 29",
    nome: "[Nome]",
    info: "RAC de [cidade] · Distrito [nº]",
    descricao: "Responsável por apoiar os distritos da Área 29 no fortalecimento das contribuições à Fundação Rotária, orientar sobre os critérios do programa de reconhecimento e acompanhar o progresso ao longo do Ano Rotário 2026-27.",
    foto: "https://placehold.co/128x128/f4f3f0/6b6a66?text=Foto"
  },
  {
    cargo: "Assessora FR - Área 31",
    nome: "Graziele Amorim",
    info: "Rotaract Club de Itaquaquecetuba · Distrito 4563",
    descricao: "Responsável por apoiar os distritos da Área 31 no fortalecimento das contribuições à Fundação Rotária, orientar sobre os critérios do programa de reconhecimento e acompanhar o progresso ao longo do Ano Rotário 2026-27.",
    foto: "https://placehold.co/128x128/e4177b/ffffff?text=GA"
  },
];

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('grid-equipe');
  if (!container) return;

  container.innerHTML = EQUIPE.map(m => `
    <div class="membro-equipe">
      <img class="membro-foto" src="${m.foto}" alt="${m.nome}">
      <div>
        <p class="membro-cargo">${m.cargo}</p>
        <p class="membro-nome">${m.nome}</p>
        <p class="membro-info">${m.info}</p>
        <p class="membro-desc">${m.descricao}</p>
      </div>
    </div>
  `).join('');
});
