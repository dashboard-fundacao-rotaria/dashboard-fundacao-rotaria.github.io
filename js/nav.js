// ============================================================================
// MENU DE NAVEGAÇÃO — fonte única de verdade.
// Para adicionar, remover, renomear ou reordenar uma aba, edite SÓ a lista
// abaixo. Todas as 14 páginas puxam o menu daqui automaticamente — não
// precisa editar o HTML de cada arquivo.
// ============================================================================
const TABS = [
  { href: "index.html", label: "Início" },
  { href: "equipe.html", label: "Nossa Equipe" },
  { href: "destaques.html", label: "Destaques" },
  { href: "reconhecimento.html", label: "Programa de Reconhecimento" },
  { href: "sobre.html", label: "Sobre a Fundação Rotária" },
  { href: "projetos.html", label: "Projetos por Área de Enfoque" },
  { label: "Estatísticas", grupo: [
      { href: "estat-geral.html", label: "Total de contribuição dos distritos do Brasil" },
      { href: "estat-area29.html", label: "Total de contribuição - Área 29" },
      { href: "estat-area31.html", label: "Total de contribuição - Área 31" },
      { href: "estat-fundo.html", label: "Doações por Fundo" }
  ]},
  { href: "rotary-direct.html", label: "Rotary Direct" },
  { href: "abtrf.html", label: "ABTRF" },
  { href: "campanhas.html", label: "Campanhas" },
  { href: "contato.html", label: "Fale Conosco" }
];

// ============================================================================
// WIDGET DE DÓLAR ROTÁRIO — ocupa, na navbar, o lugar onde antes ficava o
// botão "Acesso" (o sistema de chave/login foi removido do projeto
// inteiro; ver também js/portao-entrada.js pro que entrou no lugar do
// fluxo de acesso em si).
//
// Mostra o valor OFICIAL do Dólar Rotário (o mesmo publicado no topo de
// rotary.org.br), lido de assets/dolar-rotario.json — um arquivo estático
// do próprio site, então a busca é sempre same-origin (sem CORS).
//
// Esse JSON é mantido atualizado sozinho por um GitHub Action
// (.github/workflows/atualizar-dolar-rotario.yml, roda 1x por dia) que
// raspa rotary.org.br e commita o valor novo — ninguém precisa editar
// código nem planilha por causa disso. Ver o comentário daquele workflow
// e do script em .github/scripts/ pra detalhes/limitações (é raspagem de
// HTML de um site de terceiros: se a Rotary mudar o layout da página, a
// automação para de atualizar — mas sem sobrescrever com valor errado).
// ============================================================================
function montarWidgetCambio(barra, prefixo) {
  const iconeSvg = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M15 9.5c0-1.4-1.3-2.5-3-2.5s-3 1.1-3 2.5S10.3 12 12 12s3 1.1 3 2.5-1.3 2.5-3 2.5-3-1.1-3-2.5" stroke-width="1.6"></path><line x1="12" y1="5.5" x2="12" y2="7"></line><line x1="12" y1="17" x2="12" y2="18.5"></line></svg>';

  const widget = document.createElement('span');
  widget.className = 'widget-cambio';
  widget.title = 'Dólar Rotário do mês — valor oficial publicado em rotary.org.br, atualizado automaticamente.';
  widget.innerHTML = `${iconeSvg}<span class="widget-cambio-texto">Dólar Rotário…</span>`;
  barra.appendChild(widget);

  // Faixa própria pro mobile — fica FORA da navbar (logo depois dela),
  // em vez do pill de dentro da barra, que ali sobra/disputa espaço com
  // hambúrguer e logo em telas estreitas. Mesmo dado, duas apresentações
  // (troca por CSS, @media max-width:700px — ver styles.css).
  const faixaMobile = document.createElement('div');
  faixaMobile.className = 'faixa-cambio-mobile';
  faixaMobile.innerHTML = `${iconeSvg}<span class="faixa-cambio-mobile-texto">Dólar Rotário…</span>`;
  barra.parentNode.insertBefore(faixaMobile, barra.nextSibling);

  const texto = widget.querySelector('.widget-cambio-texto');
  const textoMobile = faixaMobile.querySelector('.faixa-cambio-mobile-texto');

  fetch(`${prefixo}assets/dolar-rotario.json`)
    .then(r => {
      if (!r.ok) throw new Error('assets/dolar-rotario.json não encontrado');
      return r.json();
    })
    .then(dados => {
      const valor = Number(dados && dados.valor);
      if (!valor || isNaN(valor)) throw new Error('conteúdo inesperado em dolar-rotario.json');
      const textoValor = `Dólar Rotário: R$ ${valor.toFixed(2).replace('.', ',')}`;
      texto.textContent = textoValor;
      textoMobile.textContent = textoValor;
      if (dados.mes) {
        widget.title = `Dólar Rotário — ${dados.mes} (fonte: rotary.org.br, atualizado automaticamente)`;
      }
    })
    .catch(() => {
      // Arquivo ausente, corrompido, ou automação nunca rodou ainda:
      // melhor sumir com o widget do que travar em "Dólar Rotário…".
      widget.remove();
      faixaMobile.remove();
    });
}

document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('tabs-relatorio');
  if (!nav) return;

  // Descobre em qual página estamos a partir do atributo data-pagina-atual
  // do próprio <script>, definido em cada arquivo HTML.
  const scriptAtual = document.querySelector('script[data-pagina-atual]');
  const paginaAtual = scriptAtual ? scriptAtual.dataset.paginaAtual : '';

  // Detecta se esta página está dentro de uma subpasta pra saber se os
  // links do menu precisam de "../" na frente. Faz isso lendo o próprio
  // src do <script src="js/nav.js"> ou "../js/nav.js" — não depende de
  // nada além do que já está no HTML. Hoje nenhuma página fica em
  // subpasta, mas mantém isso genérico pra não quebrar se uma nova
  // seção precisar (a lógica não é específica de nenhuma pasta).
  const prefixo = scriptAtual && scriptAtual.getAttribute('src').startsWith('../') ? '../' : '';

  nav.innerHTML = TABS.map(t => {
    if (t.grupo) {
      // Item de grupo (dropdown): fica "ativo" se a página atual for
      // qualquer uma das páginas dentro do grupo.
      const algumAtivo = t.grupo.some(sub => sub.href === paginaAtual);
      const itensMenu = t.grupo.map(sub => {
        const subAtivo = sub.href === paginaAtual ? ' ativo' : '';
        return `<a href="${prefixo}${sub.href}" class="tab-dropdown-item${subAtivo}">${sub.label}</a>`;
      }).join('');
      return `
        <div class="tab-dropdown">
          <button type="button" class="tab-btn tab-dropdown-toggle${algumAtivo ? ' ativo' : ''}">
            ${t.label} <span class="tab-dropdown-seta">&#9662;</span>
          </button>
          <div class="tab-dropdown-menu">${itensMenu}</div>
        </div>`;
    }
    const ativo = t.href === paginaAtual ? ' ativo' : '';
    return `<a href="${prefixo}${t.href}" class="tab-btn${ativo}">${t.label}</a>`;
  }).join('');

  // Dropdown de Estatísticas: abre/fecha ao clicar, fecha clicando fora
  // ou apertando Esc. Cada <div class="tab-dropdown"> cuida do seu
  // próprio estado (dá pra ter mais de um grupo no futuro sem conflito).
  nav.querySelectorAll('.tab-dropdown').forEach(dropdown => {
    const toggle = dropdown.querySelector('.tab-dropdown-toggle');
    const menu = dropdown.querySelector('.tab-dropdown-menu');
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const jaAberto = dropdown.classList.contains('aberto');
      nav.querySelectorAll('.tab-dropdown.aberto').forEach(d => d.classList.remove('aberto'));
      if (jaAberto) return;
      // position:fixed calculado na hora de abrir, não CSS puro (absolute)
      // — porque .tabs-relatorio tem overflow-x:auto, e isso faz o
      // navegador recortar overflow vertical também (efeito colateral
      // conhecido do CSS), cortando o menu se ele fosse absolute dentro
      // dela. Fixed com coordenadas calculadas por JS escapa desse corte.
      const rect = toggle.getBoundingClientRect();
      menu.style.top = `${rect.bottom + 4}px`;
      menu.style.left = `${rect.left}px`;
      dropdown.classList.add('aberto');
    });
  });
  document.addEventListener('click', () => {
    nav.querySelectorAll('.tab-dropdown.aberto').forEach(d => d.classList.remove('aberto'));
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      nav.querySelectorAll('.tab-dropdown.aberto').forEach(d => d.classList.remove('aberto'));
    }
  });
  // Fecha o dropdown se a barra rolar enquanto ele está aberto — a posição
  // é fixa (calculada uma vez, na abertura), então não acompanharia o
  // scroll e ficaria desalinhada do botão.
  nav.addEventListener('scroll', () => {
    nav.querySelectorAll('.tab-dropdown.aberto').forEach(d => d.classList.remove('aberto'));
  });

  // Envolve a barra de abas numa faixa que também comporta o botão de
  // acesso à direita, fixo (não rola junto com as abas).
  const barra = document.createElement('div');
  barra.className = 'barra-superior';
  nav.parentNode.insertBefore(barra, nav);
  barra.appendChild(nav);

  // ==========================================================================
  // MENU HAMBÚRGUER (mobile) — em telas estreitas, a barra de abas some
  // (ver CSS, @media max-width:900px) e esse botão assume no lugar dela,
  // abrindo um painel lateral com a mesma lista TABS (incluindo o grupo
  // "Estatísticas", mostrado com subtítulo + itens indentados — sem
  // dropdown aninhado dentro do painel, pra não exigir dois toques).
  // ==========================================================================
  const hamburguer = document.createElement('button');
  hamburguer.type = 'button';
  hamburguer.className = 'menu-hamburguer';
  hamburguer.setAttribute('aria-label', 'Abrir menu');
  hamburguer.setAttribute('aria-expanded', 'false');
  hamburguer.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
  barra.insertBefore(hamburguer, barra.firstChild);

  // Logo — a barra ficou vazia depois que o menu de abas virou hambúrguer
  // sempre ativo. Fica clicável e leva pra Início, como é convenção em
  // quase todo site. Aparece em TODAS as páginas, inclusive a própria
  // Início (index.html não tem mais capa com logo grande — a home hoje é
  // navbar + carrossel de projetos + atalhos).
  const logoLink = document.createElement('a');
  logoLink.className = 'navbar-logo';
  logoLink.href = prefixo + 'index.html';
  logoLink.setAttribute('aria-label', 'Ir para o início');
  logoLink.innerHTML = `<img src="${prefixo}assets/logo/rotaract-rotary-logo-navbar.png" alt="Rotaract Brasil · Fundação Rotária" width="996" height="154">`;
  barra.insertBefore(logoLink, hamburguer.nextSibling);

  const itensMenuMobile = TABS.map(t => {
    if (t.grupo) {
      const subitens = t.grupo.map(sub => {
        const subAtivo = sub.href === paginaAtual ? ' ativo' : '';
        return `<a href="${prefixo}${sub.href}" class="menu-mobile-link menu-mobile-sublink${subAtivo}">${sub.label}</a>`;
      }).join('');
      return `<p class="menu-mobile-subtitulo">${t.label}</p>${subitens}`;
    }
    const ativo = t.href === paginaAtual ? ' ativo' : '';
    return `<a href="${prefixo}${t.href}" class="menu-mobile-link${ativo}">${t.label}</a>`;
  }).join('');

  const menuMobile = document.createElement('div');
  menuMobile.className = 'menu-mobile-overlay';
  menuMobile.innerHTML = `
    <div class="menu-mobile-painel" role="dialog" aria-modal="true" aria-label="Menu">
      <div class="menu-mobile-cabecalho">
        <strong>Menu</strong>
        <button type="button" class="menu-mobile-fechar" aria-label="Fechar menu">&times;</button>
      </div>
      <nav aria-label="Navegação do relatório (mobile)">${itensMenuMobile}</nav>
    </div>`;
  document.body.appendChild(menuMobile);

  function abrirMenuMobile() {
    menuMobile.classList.add('aberto');
    hamburguer.setAttribute('aria-expanded', 'true');
  }
  function fecharMenuMobile() {
    menuMobile.classList.remove('aberto');
    hamburguer.setAttribute('aria-expanded', 'false');
  }
  hamburguer.addEventListener('click', abrirMenuMobile);
  menuMobile.querySelector('.menu-mobile-fechar').addEventListener('click', fecharMenuMobile);
  // Fecha ao tocar no fundo escurecido, mas não ao tocar dentro do painel.
  menuMobile.addEventListener('click', (e) => { if (e.target === menuMobile) fecharMenuMobile(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') fecharMenuMobile(); });

  montarWidgetCambio(barra, prefixo);

  // Centraliza a aba ativa na barra ao carregar a página. Sem isso, o
  // navegador decide sozinho onde deixar a rolagem horizontal ao
  // trocar de página — de forma inconsistente.
  //
  // Importante: só funciona certo DEPOIS que a fonte DM Sans termina
  // de carregar (document.fonts.ready) — antes disso, o texto renderiza
  // com a fonte de fallback do sistema, que tem largura diferente. Se
  // centralizar antes da fonte carregar, o layout muda logo em seguida
  // (quando a fonte chega) e a posição calculada fica errada.
  function centralizarAbaAtiva() {
    const abaAtiva = nav.querySelector('.tab-btn.ativo');
    if (!abaAtiva) return;
    // getBoundingClientRect (não offsetLeft) porque o botão do dropdown de
    // Estatísticas agora fica dentro de um wrapper com position:relative —
    // offsetLeft seria relativo a esse wrapper, não à barra toda.
    const navRect = nav.getBoundingClientRect();
    const abaRect = abaAtiva.getBoundingClientRect();
    const deltaCentro = (abaRect.left + abaRect.width / 2) - (navRect.left + navRect.width / 2);
    nav.scrollLeft = Math.max(0, nav.scrollLeft + deltaCentro);
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(centralizarAbaAtiva);
  } else {
    centralizarAbaAtiva();
  }
  // Roda de novo depois do load completo (imagens etc.), garantia extra
  // caso algo mais reflua o layout depois da fonte carregar.
  window.addEventListener('load', centralizarAbaAtiva);
});
