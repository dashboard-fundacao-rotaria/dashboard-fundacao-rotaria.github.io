// ============================================================================
// PORTÃO DE ENTRADA — substitui o antigo sistema de chave de acesso.
//
// Assim que a página carrega, mostra um popup que NÃO pode ser fechado sem
// escolher uma das duas opções (nada de X, nada de clicar fora, nada de
// Esc) — mesmo princípio de um aviso de idade em site adulto, só que aqui
// pra separar "dirigente de distrito" de "membro de clube".
//
// Depois da escolha, abre um MENU de tópicos (fechável) com os vídeos
// relevantes pro papel escolhido — cada papel vê uma lista diferente, ver
// MENUS abaixo. Escolhendo um tópico, abre o vídeo correspondente (esse
// modal também fechável, com X) por cima do menu — fechando o vídeo, o
// menu continua ali atrás, pra ver outro tópico sem reabrir tudo.
//
// A escolha de papel fica guardada em sessionStorage: dura enquanto a aba
// do navegador estiver aberta, então a pessoa não vê o portão de novo ao
// trocar de página dentro do site — só se abrir uma aba/sessão nova.
// Isso é uma decisão de UX minha (não foi pedido explicitamente que
// aparecesse a CADA página do site, e repetir isso a cada clique de menu
// seria bem ruim de usar); se a ideia era aparecer sempre, é só trocar
// sessionStorage por nada de cache aqui embaixo.
// ============================================================================

const CHAVE_ESCOLHA_PAPEL = 'papelVisitante';

// Cada vídeo, uma vez só — "cartao" e "boleto" são usados pelos dois
// papéis (ver MENUS logo abaixo), sem precisar duplicar o embed.
// Todo vídeo abre girado 90° (ver abrirVideo) — sem distinção por
// formato.
const VIDEOS = {
  'distrito-desktop': {
    titulo: 'Relatório de distrito (computador) — Contribuições de distrito',
    embed: 'https://drive.google.com/file/d/1plY78matwzD-o_1Gk_WlchnjwdvcoUXj/preview',
  },
  'distrito-mobile': {
    titulo: 'Relatório de distrito (celular) — Contribuições de distrito',
    embed: 'https://drive.google.com/file/d/17L_KZ5v9Au2GRpPyQljWN2xEZx3H8s66/preview',
  },
  'associado': {
    titulo: 'Relatório de associado — Rotary Club Central',
    embed: 'https://drive.google.com/file/d/17wplHHsarypwOnWaeVqI8CTjlqKQhYtA/preview',
  },
  'cartao': {
    titulo: 'Contribuição via cartão de crédito',
    embed: 'https://drive.google.com/file/d/1kqqhTLrngb8dR8YlEHk-7N1ty5se3Igw/preview',
  },
  'boleto': {
    titulo: 'Contribuição via boleto',
    embed: 'https://drive.google.com/file/d/1IeRgDJbnJmIWNrOyF7Qc31v4ZaWRXi-k/preview',
  },
  'filtro': {
    titulo: 'Utilizando filtro de pesquisa',
    embed: 'https://drive.google.com/file/d/1Mm6WV-MkJLZSPQNpr1Ncsz-Q5XUN0nM3/preview',
  },
};

// Quais tópicos (chaves de VIDEOS) cada papel vê, e em que ordem.
const MENUS = {
  distrito: ['distrito-desktop', 'distrito-mobile', 'cartao', 'boleto', 'filtro'],
  associado: ['associado', 'cartao', 'boleto'],
};

document.addEventListener('DOMContentLoaded', () => {
  // ---- Modal de vídeo (fechável) — montado sempre, mas só aberto quando
  // alguém escolhe um tópico no menu. ----
  const overlayVideo = document.createElement('div');
  overlayVideo.className = 'video-overlay';
  overlayVideo.innerHTML = `
    <div class="video-modal" role="dialog" aria-modal="true" aria-label="Vídeo tutorial">
      <button type="button" class="video-fechar" aria-label="Fechar">&times;</button>
      <h2 class="video-titulo"></h2>
      <div class="video-wrap">
        <div class="video-rotador">
          <iframe class="video-iframe" src="" title="Vídeo tutorial" frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen></iframe>
        </div>
      </div>
    </div>`;
  document.body.appendChild(overlayVideo);

  function abrirVideo(chaveVideo) {
    const v = VIDEOS[chaveVideo];
    if (!v) return;
    overlayVideo.querySelector('.video-titulo').textContent = v.titulo;
    overlayVideo.querySelector('.video-iframe').src = v.embed;
    overlayVideo.classList.add('aberto');

    // Só no mobile todo vídeo abre girado 90°, como se a tela estivesse
    // deitada — no desktop já abre certo do jeito normal (16:9), sem
    // precisar disso. O tamanho é calculado em pixels (não em %) depois
    // que a caixa já está visível.
    const wrap = overlayVideo.querySelector('.video-wrap');
    const rotador = overlayVideo.querySelector('.video-rotador');
    const noMobile = window.matchMedia('(max-width:700px)').matches;
    rotador.classList.toggle('video-rotador-girado', noMobile);
    if (noMobile) {
      requestAnimationFrame(() => {
        rotador.style.width = wrap.clientHeight + 'px';
        rotador.style.height = wrap.clientWidth + 'px';
      });
    } else {
      rotador.style.width = '';
      rotador.style.height = '';
    }
  }
  function fecharVideo() {
    overlayVideo.classList.remove('aberto');
    overlayVideo.querySelector('.video-iframe').src = ''; // para a reprodução ao fechar
  }
  overlayVideo.querySelector('.video-fechar').addEventListener('click', fecharVideo);
  overlayVideo.addEventListener('click', (e) => { if (e.target === overlayVideo) fecharVideo(); });

  // ---- Menu de tópicos (fechável) — lista os vídeos do papel escolhido.
  // Fica atrás do modal de vídeo (z-index menor, ver CSS): fechar o vídeo
  // volta pro menu, sem precisar escolher o papel de novo. ----
  const overlayMenu = document.createElement('div');
  overlayMenu.className = 'menu-overlay';
  overlayMenu.innerHTML = `
    <div class="menu-modal" role="dialog" aria-modal="true" aria-label="Vídeos tutoriais">
      <button type="button" class="menu-fechar" aria-label="Fechar">&times;</button>
      <h2>Vídeos tutoriais</h2>
      <div class="menu-topicos"></div>
    </div>`;
  document.body.appendChild(overlayMenu);

  function fecharMenu() {
    overlayMenu.classList.remove('aberto');
  }
  overlayMenu.querySelector('.menu-fechar').addEventListener('click', fecharMenu);
  overlayMenu.addEventListener('click', (e) => { if (e.target === overlayMenu) fecharMenu(); });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    fecharVideo();
    fecharMenu();
  });

  function abrirMenu(papel) {
    const topicos = MENUS[papel];
    if (!topicos) return;
    const container = overlayMenu.querySelector('.menu-topicos');
    container.innerHTML = topicos.map(chave =>
      `<button type="button" class="portao-opcao" data-video="${chave}">${VIDEOS[chave].titulo}</button>`
    ).join('');
    container.querySelectorAll('[data-video]').forEach(btn => {
      btn.addEventListener('click', () => abrirVideo(btn.dataset.video));
    });
    overlayMenu.classList.add('aberto');
  }

  // Qualquer elemento com [data-reabrir-tutorial] na página reabre o menu
  // de tópicos do papel já escolhido (o rodapé ganha um desses
  // automaticamente, logo abaixo, depois que a pessoa já escolheu um
  // papel).
  document.addEventListener('click', (e) => {
    const gatilho = e.target.closest('[data-reabrir-tutorial]');
    if (!gatilho) return;
    e.preventDefault();
    const papel = sessionStorage.getItem(CHAVE_ESCOLHA_PAPEL);
    if (papel) abrirMenu(papel);
  });

  const escolhaJaFeita = sessionStorage.getItem(CHAVE_ESCOLHA_PAPEL);

  // Na Início o link do rodapé seria redundante — o card "Vídeos
  // tutoriais" ali já faz a mesma coisa. Nas outras páginas continua
  // aparecendo, porque elas não têm esse card.
  const scriptNav = document.querySelector('script[data-pagina-atual]');
  const naHome = scriptNav && scriptNav.dataset.paginaAtual === 'index.html';

  // Link "Vídeos tutoriais" no rodapé — só depois de já ter escolhido um
  // papel (antes disso, o próprio portão está prestes a aparecer, então
  // não faz sentido oferecer o link ainda).
  const rodape = document.querySelector('.site-footer');
  if (rodape && escolhaJaFeita && !naHome) {
    const link = document.createElement('button');
    link.type = 'button';
    link.className = 'link-tutorial';
    link.setAttribute('data-reabrir-tutorial', '');
    link.textContent = 'Vídeos tutoriais';
    rodape.insertBefore(link, rodape.firstChild);
  }

  if (escolhaJaFeita) return; // já escolheu nesta sessão do navegador — não mostra o portão de novo

  // ---- Portão de entrada (NÃO fechável sem escolher) ----
  const overlayPortao = document.createElement('div');
  overlayPortao.className = 'portao-overlay aberto';
  overlayPortao.innerHTML = `
    <div class="portao-modal" role="dialog" aria-modal="true" aria-label="Identifique seu perfil">
      <h2>Antes de continuar</h2>
      <p>Antes de continuar, nos diga qual é o seu papel:</p>
      <div class="portao-opcoes">
        <button type="button" class="portao-opcao" data-papel="distrito">Sou dirigente do meu distrito</button>
        <button type="button" class="portao-opcao" data-papel="associado">Sou membro do meu clube</button>
      </div>
    </div>`;
  document.body.appendChild(overlayPortao);

  overlayPortao.querySelectorAll('.portao-opcao').forEach(btn => {
    btn.addEventListener('click', () => {
      const papel = btn.dataset.papel;
      sessionStorage.setItem(CHAVE_ESCOLHA_PAPEL, papel);
      overlayPortao.remove();
      abrirMenu(papel);
      // Agora que a escolha foi feita, adiciona o link do rodapé também
      // nesta mesma página (sem precisar recarregar) — exceto na Início,
      // que já tem o card fazendo a mesma coisa.
      if (rodape && !naHome && !rodape.querySelector('[data-reabrir-tutorial]')) {
        const link = document.createElement('button');
        link.type = 'button';
        link.className = 'link-tutorial';
        link.setAttribute('data-reabrir-tutorial', '');
        link.textContent = 'Vídeos tutoriais';
        rodape.insertBefore(link, rodape.firstChild);
      }
    });
  });
  // De propósito: SEM botão de fechar, SEM clique-fora, SEM tecla Esc
  // fechando este modal específico — só sai daqui escolhendo uma opção.
});
