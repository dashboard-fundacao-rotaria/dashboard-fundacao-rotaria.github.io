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
  { href: "estat-geral.html", label: "Total de contribuição dos distritos do Brasil" },
  { href: "estat-area29.html", label: "Total de contribuição - Área 29" },
  { href: "estat-area31.html", label: "Total de contribuição - Área 31" },
  { href: "estat-fundo.html", label: "Doações por Fundo" },
  { href: "rotary-direct.html", label: "QTD Rotary Direct" },
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
    const ativo = t.href === paginaAtual ? ' ativo' : '';
    return `<a href="${prefixo}${t.href}" class="tab-btn${ativo}">${t.label}</a>`;
  }).join('');

  // Envolve a barra de abas numa faixa que também comporta o botão de
  // acesso à direita, fixo (não rola junto com as abas).
  const barra = document.createElement('div');
  barra.className = 'barra-superior';
  nav.parentNode.insertBefore(barra, nav);
  barra.appendChild(nav);

  // Se estamos carregando o próprio painel do admin agora, marca a sessão
  // como "modo admin" AQUI — e não na hora do login. Assim nenhuma parte
  // do código de login precisa saber "qual chave é a admin"; quem entrega
  // essa informação é a própria página, através do data-admin que só ela
  // tem.
  if (ehPaginaAdmin) {
    sessionStorage.setItem('modoAdmin', '1');
    sessionStorage.setItem('paginaAdmin', paginaAtual);
  }

  // Selo — indica área restrita. Mostra o número do distrito quando a
  // própria página o declara (data-distrito); no painel do admin, mostra
  // um selo diferente.
  if (estaEmDistrito) {
    const selo = document.createElement('span');
    selo.className = 'selo-distrito';
    if (ehPaginaAdmin) {
      selo.textContent = 'Painel do Administrador';
    } else if (numeroDistrito) {
      selo.textContent = `Visão - Distrito ${numeroDistrito}`;
    } else {
      selo.textContent = 'Visão de Distrito';
    }
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
    const alvo = abaAtiva.offsetLeft - (nav.clientWidth / 2) + (abaAtiva.clientWidth / 2);
    nav.scrollLeft = Math.max(0, alvo);
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
