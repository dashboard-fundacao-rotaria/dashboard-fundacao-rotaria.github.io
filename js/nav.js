// ============================================================================
// MENU DE NAVEGAÇÃO — fonte única de verdade.
// Para adicionar, remover, renomear ou reordenar uma aba, edite SÓ a lista
// abaixo. Todas as 15 páginas puxam o menu daqui automaticamente — não
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
// BOTÃO DE ACESSO RESTRITO — mesma lógica do menu: um lugar só (aqui) cuida
// de gerar o botão + modal em todas as páginas. As chaves ficam em
// js/chaves-acesso.js (que precisa estar carregado ANTES deste script no
// HTML). Se esse arquivo não existir na página, o botão não aparece.
//
// O botão tem dois modos:
// - "Acesso" (páginas normais do site): abre o modal pra digitar a chave.
// - "Sair" (dentro de uma página de distrito): encerra a sessão de acesso
//   e volta pra Home. Ver TRAVA DE SESSÃO mais abaixo pra entender como a
//   sessão é controlada.
// ============================================================================
function montarBotaoAcesso(barra, estaEmDistrito, prefixo, ehPaginaAdmin) {
  if (typeof CHAVES_ACESSO === 'undefined') return; // chaves-acesso.js não carregado nesta página

  if (estaEmDistrito) {
    // "Sair" fica sempre junto do selo, na primeira linha (igual já
    // acontece no painel do admin). "Ver outro distrito", quando existe,
    // vai numa linha própria — controlado via order/flex no CSS, não por
    // agrupamento no DOM.
    const paginaAdmin = sessionStorage.getItem('paginaAdmin');
    if (!ehPaginaAdmin && sessionStorage.getItem('modoAdmin') === '1' && paginaAdmin) {
      const voltar = document.createElement('a');
      voltar.className = 'link-voltar-admin';
      voltar.href = paginaAdmin; // já está dentro de distritos/, mesmo nível
      voltar.innerHTML = '<span class="pill">← Ver outro distrito</span>';
      barra.appendChild(voltar);
    }

    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'botao-acesso';
    // Modo "Sair": não abre modal, só encerra a sessão e volta pra Home.
    botao.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg><span>Sair</span>';
    botao.addEventListener('click', () => {
      sessionStorage.removeItem('acessoAtivo');
      sessionStorage.removeItem('modoAdmin');
      sessionStorage.removeItem('paginaAdmin');
      window.location.href = prefixo + 'index.html';
    });
    barra.appendChild(botao);
    return;
  }

  const botao = document.createElement('button');
  botao.type = 'button';
  botao.className = 'botao-acesso';
  botao.setAttribute('aria-haspopup', 'dialog');
  botao.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg><span>Acesso</span>';
  barra.appendChild(botao);

  const overlay = document.createElement('div');
  overlay.className = 'acesso-overlay';
  overlay.innerHTML = `
    <div class="acesso-modal" role="dialog" aria-modal="true" aria-label="Acesso restrito">
      <button type="button" class="acesso-fechar" aria-label="Fechar">&times;</button>
      <h2>Acesso restrito</h2>
      <p>Digite a chave que você recebeu para acessar a página do seu distrito.</p>
      <input type="text" class="acesso-input" placeholder="Chave de acesso" autocomplete="off" spellcheck="false">
      <button type="button" class="acesso-entrar">Acessar</button>
      <p class="acesso-erro" hidden>Chave inválida. Confira e tente novamente.</p>
    </div>`;
  document.body.appendChild(overlay);

  const input = overlay.querySelector('.acesso-input');
  const erro = overlay.querySelector('.acesso-erro');

  function abrir() {
    overlay.classList.add('aberto');
    erro.hidden = true;
    input.value = '';
    setTimeout(() => input.focus(), 50);
  }
  function fechar() { overlay.classList.remove('aberto'); }
  function tentarEntrar() {
    const chave = input.value.trim().toUpperCase();
    const destino = CHAVES_ACESSO[chave];
    if (destino) {
      // Marca a sessão como autorizada ANTES de redirecionar. É essa marca
      // que a TRAVA DE SESSÃO (no <head> de cada página de distrito) checa
      // pra decidir se deixa ver o conteúdo ou manda de volta pra Home.
      // Zera qualquer resquício de sessão admin anterior nesta aba antes de
      // logar de novo — evita que o link "voltar ao painel" apareça pra
      // quem logou agora com uma chave normal, se a aba já tinha sido usada
      // pra admin antes sem clicar em "Sair".
      sessionStorage.removeItem('modoAdmin');
      sessionStorage.removeItem('paginaAdmin');
      sessionStorage.setItem('acessoAtivo', '1');
      window.location.href = prefixo + destino;
    } else {
      erro.hidden = false;
    }
  }

  botao.addEventListener('click', abrir);
  overlay.querySelector('.acesso-fechar').addEventListener('click', fechar);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) fechar(); });
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') tentarEntrar(); });
  overlay.querySelector('.acesso-entrar').addEventListener('click', tentarEntrar);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') fechar(); });
}

document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('tabs-relatorio');
  if (!nav) return;

  // Descobre em qual página estamos a partir do atributo data-pagina-atual
  // do próprio <script>, definido em cada arquivo HTML.
  const scriptAtual = document.querySelector('script[data-pagina-atual]');
  const paginaAtual = scriptAtual ? scriptAtual.dataset.paginaAtual : '';

  // Detecta se esta página está dentro de uma subpasta (ex: distritos/) pra
  // saber se os links do menu precisam de "../" na frente. Faz isso lendo o
  // próprio src do <script src="js/nav.js"> ou "../js/nav.js" — não depende
  // de nada além do que já está no HTML.
  const prefixo = scriptAtual && scriptAtual.getAttribute('src').startsWith('../') ? '../' : '';
  const estaEmDistrito = prefixo === '../';
  const numeroDistrito = scriptAtual ? scriptAtual.dataset.distrito : undefined;
  const ehPaginaAdmin = !!(scriptAtual && scriptAtual.dataset.admin === '1');

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
  // quase todo site. EXCETO na própria capa (index.html): lá o logo já
  // aparece grande no conteúdo da página, ficaria redundante repetir
  // ele também na navbar.
  if (paginaAtual !== 'index.html') {
    const logoLink = document.createElement('a');
    logoLink.className = 'navbar-logo';
    logoLink.href = prefixo + 'index.html';
    logoLink.setAttribute('aria-label', 'Ir para o início');
    logoLink.innerHTML = `<img src="${prefixo}assets/logo/rotaract-rotary-logo-navbar.png" alt="Rotaract Brasil · Fundação Rotária">`;
    barra.insertBefore(logoLink, hamburguer.nextSibling);
  }

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

  // Se estamos carregando o próprio painel do admin agora, marca a sessão
  // como "modo admin" AQUI — e não na hora do login. Assim nenhuma parte
  // do código de login precisa saber "qual chave é a admin"; quem entrega
  // essa informação é a própria página, através do data-admin que só ela
  // tem.
  if (ehPaginaAdmin) {
    sessionStorage.setItem('modoAdmin', '1');
    sessionStorage.setItem('paginaAdmin', paginaAtual);
  }

  // Selo — indica área restrita, com o número do distrito quando a
  // própria página o declara (data-distrito). No painel do admin NÃO
  // mostra selo — a página já tem seu próprio título "Painel do
  // Administrador" no corpo, um selo repetindo isso na navbar era
  // redundante.
  if (estaEmDistrito && !ehPaginaAdmin) {
    const selo = document.createElement('span');
    selo.className = 'selo-distrito';
    selo.textContent = numeroDistrito ? `Visão - Distrito ${numeroDistrito}` : 'Visão de Distrito';
    barra.insertBefore(selo, nav);
  }

  montarBotaoAcesso(barra, estaEmDistrito, prefixo, ehPaginaAdmin);

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
