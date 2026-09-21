// ============================================================================
// PORTÃO DE ENTRADA — substitui o antigo sistema de chave de acesso.
//
// Assim que a página carrega, mostra um popup que NÃO pode ser fechado sem
// escolher uma das duas opções (nada de X, nada de clicar fora, nada de
// Esc) — mesmo princípio de um aviso de idade em site adulto, só que aqui
// pra separar "dirigente de distrito" de "dirigente/associado de clube".
//
// Depois da escolha, abre um segundo modal (esse sim fechável, com X) com
// um vídeo tutorial — um vídeo diferente pra cada papel escolhido.
//
// A escolha fica guardada em sessionStorage: dura enquanto a aba do
// navegador estiver aberta, então a pessoa não vê o portão de novo ao
// trocar de página dentro do site — só se abrir uma aba/sessão nova.
// Isso é uma decisão de UX minha (não foi pedido explicitamente que
// aparecesse a CADA página do site, e repetir isso a cada clique de menu
// seria bem ruim de usar); se a ideia era aparecer sempre, é só trocar
// sessionStorage por nada de cache aqui embaixo.
//
// AINDA FALTA: as URLs reais dos dois vídeos — ver "SUBSTITUIR_..." logo
// abaixo. Sem isso, o modal de vídeo abre com o espaço reservado vazio.
// ============================================================================

const CHAVE_ESCOLHA_PAPEL = 'papelVisitante';

const VIDEOS_TUTORIAL = {
  distrito: {
    titulo: 'Como doar pelo distrito',
    // Troque pela URL de EMBED do vídeo (ex: YouTube:
    // "https://www.youtube.com/embed/XXXXXXXXXXX", não a URL normal de assistir).
    embed: 'SUBSTITUIR_PELA_URL_DE_EMBED_DO_VIDEO_DISTRITO',
  },
  clube: {
    titulo: 'Como doar (dirigente ou associado de clube)',
    embed: 'SUBSTITUIR_PELA_URL_DE_EMBED_DO_VIDEO_CLUBE',
  },
};

document.addEventListener('DOMContentLoaded', () => {
  // ---- Modal de vídeo (fechável) — montado sempre, mas só aberto quando
  // alguém escolhe um papel (ou reabre pelo link no rodapé). ----
  const overlayVideo = document.createElement('div');
  overlayVideo.className = 'video-overlay';
  overlayVideo.innerHTML = `
    <div class="video-modal" role="dialog" aria-modal="true" aria-label="Como doar">
      <button type="button" class="video-fechar" aria-label="Fechar">&times;</button>
      <h2 class="video-titulo"></h2>
      <div class="video-wrap">
        <iframe class="video-iframe" src="" title="Vídeo tutorial" frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen></iframe>
      </div>
    </div>`;
  document.body.appendChild(overlayVideo);

  function abrirVideo(papel) {
    const v = VIDEOS_TUTORIAL[papel];
    if (!v) return;
    overlayVideo.querySelector('.video-titulo').textContent = v.titulo;
    overlayVideo.querySelector('.video-iframe').src = v.embed;
    overlayVideo.classList.add('aberto');
  }
  function fecharVideo() {
    overlayVideo.classList.remove('aberto');
    overlayVideo.querySelector('.video-iframe').src = ''; // para a reprodução ao fechar
  }
  overlayVideo.querySelector('.video-fechar').addEventListener('click', fecharVideo);
  overlayVideo.addEventListener('click', (e) => { if (e.target === overlayVideo) fecharVideo(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') fecharVideo(); });

  // Qualquer elemento com [data-reabrir-tutorial] na página reabre o vídeo
  // do papel já escolhido (o rodapé ganha um desses automaticamente, logo
  // abaixo, depois que a pessoa já escolheu um papel).
  document.addEventListener('click', (e) => {
    const gatilho = e.target.closest('[data-reabrir-tutorial]');
    if (!gatilho) return;
    e.preventDefault();
    const papel = sessionStorage.getItem(CHAVE_ESCOLHA_PAPEL);
    if (papel) abrirVideo(papel);
  });

  const escolhaJaFeita = sessionStorage.getItem(CHAVE_ESCOLHA_PAPEL);

  // Link "Como doar? Assista de novo" no rodapé — só depois de já ter
  // escolhido um papel (antes disso, o próprio portão está prestes a
  // aparecer, então não faz sentido oferecer o link ainda).
  const rodape = document.querySelector('.site-footer');
  if (rodape && escolhaJaFeita) {
    const link = document.createElement('button');
    link.type = 'button';
    link.className = 'link-tutorial';
    link.setAttribute('data-reabrir-tutorial', '');
    link.textContent = 'Como doar? Assista de novo';
    rodape.insertBefore(link, rodape.firstChild);
  }

  if (escolhaJaFeita) return; // já escolheu nesta sessão do navegador — não mostra o portão de novo

  // ---- Portão de entrada (NÃO fechável sem escolher) ----
  const overlayPortao = document.createElement('div');
  overlayPortao.className = 'portao-overlay aberto';
  overlayPortao.innerHTML = `
    <div class="portao-modal" role="dialog" aria-modal="true" aria-label="Identifique seu perfil">
      <h2>Antes de continuar</h2>
      <p>Pra te mostrar a orientação certa sobre como doar, conte rapidinho qual é o seu papel:</p>
      <div class="portao-opcoes">
        <button type="button" class="portao-opcao" data-papel="distrito">Sou dirigente do meu distrito</button>
        <button type="button" class="portao-opcao" data-papel="clube">Sou dirigente ou membro do meu clube</button>
      </div>
    </div>`;
  document.body.appendChild(overlayPortao);

  overlayPortao.querySelectorAll('.portao-opcao').forEach(btn => {
    btn.addEventListener('click', () => {
      const papel = btn.dataset.papel;
      sessionStorage.setItem(CHAVE_ESCOLHA_PAPEL, papel);
      overlayPortao.remove();
      abrirVideo(papel);
      // Agora que a escolha foi feita, adiciona o link do rodapé também
      // nesta mesma página (sem precisar recarregar).
      if (rodape && !rodape.querySelector('[data-reabrir-tutorial]')) {
        const link = document.createElement('button');
        link.type = 'button';
        link.className = 'link-tutorial';
        link.setAttribute('data-reabrir-tutorial', '');
        link.textContent = 'Como doar? Assista de novo';
        rodape.insertBefore(link, rodape.firstChild);
      }
    });
  });
  // De propósito: SEM botão de fechar, SEM clique-fora, SEM tecla Esc
  // fechando este modal específico — só sai daqui escolhendo uma opção.
});
