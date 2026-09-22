// ============================================================================
// CARROSSEL DE PROJETOS — banner rotativo no topo da Home (index.html),
// no lugar de onde antes ficava a capa estática.
//
// Não tem lista de projetos própria: lê PROJETOS e AREAS, declaradas em
// js/projetos.js (por isso index.html carrega os dois scripts, nessa
// ordem) — assim os projetos em destaque aqui são sempre os mesmos (e
// na mesma cor/rótulo de área) que aparecem na aba Projetos, sem
// precisar manter duas listas sincronizadas na mão.
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  const viewport = document.getElementById('carrossel-viewport');
  const dotsEl = document.getElementById('carrossel-dots');
  const contadorEl = document.getElementById('carrossel-contador');
  const carrossel = document.getElementById('carrossel');
  if (!viewport || typeof PROJETOS === 'undefined' || typeof AREAS === 'undefined') return;

  const lista = PROJETOS.filter(p => AREAS[p.area]);
  if (lista.length === 0) return;

  viewport.innerHTML = lista.map((p, i) => `
    <div class="slide${i === 0 ? ' ativo' : ''}" style="--cor-area:${AREAS[p.area].cor}" data-i="${i}">
      <div class="slide-foto"></div>
      <div class="slide-degrade"></div>
      <span class="slide-selo-area" title="${AREAS[p.area].label}"></span>
      <div class="slide-conteudo">
        <span class="slide-eyebrow"><span class="dot"></span>${AREAS[p.area].label}</span>
        <h3>${p.titulo}</h3>
        <p>${p.descricao}</p>
        <div class="slide-pills">${(p.pills || []).map(pl => `<span>${pl.texto}</span>`).join('')}</div>
        <a class="slide-cta" href="${p.link}" target="_blank" rel="noopener">Saiba mais →</a>
      </div>
    </div>`).join('');

  // Foto via style.backgroundImage (JS, inline) — não via url() dentro de
  // variável CSS declarada aqui e usada em css/styles.css: caminho
  // relativo resolveria a partir da pasta css/, não do HTML (ver
  // comentário de .slide-foto no CSS). Setar aqui garante que resolve a
  // partir da própria página, como o de qualquer <img>.
  viewport.querySelectorAll('.slide-foto').forEach((el, i) => {
    el.style.backgroundImage = `url('${lista[i].imagem}')`;
  });

  dotsEl.innerHTML = lista.map((_, i) =>
    `<button aria-label="Ir pro projeto ${i + 1}" data-i="${i}" class="${i === 0 ? 'ativo' : ''}"></button>`
  ).join('');

  const slides = [...viewport.querySelectorAll('.slide')];
  const dots = [...dotsEl.querySelectorAll('button')];
  let atual = 0;
  let timer = null;

  function irPara(i) {
    atual = (i + lista.length) % lista.length;
    slides.forEach((s, idx) => s.classList.toggle('ativo', idx === atual));
    dots.forEach((d, idx) => d.classList.toggle('ativo', idx === atual));
    if (contadorEl) contadorEl.textContent = `${atual + 1} / ${lista.length}`;
  }

  const reduzMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function iniciarAuto() {
    if (reduzMovimento || lista.length < 2) return;
    parar();
    timer = setInterval(() => irPara(atual + 1), 3000);
  }
  function parar() { if (timer) clearInterval(timer); }

  const btnPrev = document.getElementById('carrossel-prev');
  const btnNext = document.getElementById('carrossel-next');
  if (btnPrev) btnPrev.addEventListener('click', () => { irPara(atual - 1); iniciarAuto(); });
  if (btnNext) btnNext.addEventListener('click', () => { irPara(atual + 1); iniciarAuto(); });
  dots.forEach(d => d.addEventListener('click', () => { irPara(Number(d.dataset.i)); iniciarAuto(); }));
  carrossel.addEventListener('mouseenter', parar);
  carrossel.addEventListener('mouseleave', iniciarAuto);
  carrossel.addEventListener('focusin', parar);
  carrossel.addEventListener('focusout', iniciarAuto);

  irPara(0);
  iniciarAuto();
});
