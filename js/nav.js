// ============================================================================
// MENU DE NAVEGAÇÃO — fonte única de verdade.
// Para adicionar, remover, renomear ou reordenar uma aba, edite SÓ a lista
// abaixo. Todas as 15 páginas puxam o menu daqui automaticamente — não
// precisa editar o HTML de cada arquivo.
// ============================================================================
const TABS = [
  { href: "index.html", label: "Início" },
  { href: "equipe.html", label: "Nossa Equipe" },
  { href: "guia.html", label: "Guia de Utilização" },
  { href: "destaques.html", label: "Destaques" },
  { href: "sobre.html", label: "Sobre a Fundação Rotária" },
  { href: "doacao.html", label: "Sua doação transforma" },
  { href: "projetos.html", label: "Projetos por Área de Enfoque" },
  { href: "estat-geral.html", label: "Total de contribuição dos distritos do Brasil" },
  { href: "estat-area29.html", label: "Total de contribuição - Área 29" },
  { href: "estat-area31.html", label: "Total de contribuição - Área 31" },
  { href: "estat-fundo.html", label: "Doações por Fundo" },
  { href: "rotary-direct.html", label: "QTD Rotary Direct" },
  { href: "abtrf.html", label: "ABTRF" },
  { href: "campanhas.html", label: "Campanhas" },
  { href: "contato.html", label: "Fale Conosco" }
];

document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('tabs-relatorio');
  if (!nav) return;

  // Descobre em qual página estamos a partir do atributo data-pagina-atual
  // do próprio <script>, definido em cada arquivo HTML.
  const scriptAtual = document.querySelector('script[data-pagina-atual]');
  const paginaAtual = scriptAtual ? scriptAtual.dataset.paginaAtual : '';

  nav.innerHTML = TABS.map(t => {
    const ativo = t.href === paginaAtual ? ' ativo' : '';
    return `<a href="${t.href}" class="tab-btn${ativo}">${t.label}</a>`;
  }).join('');
});
