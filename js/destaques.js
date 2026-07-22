// ============================================================================
// DESTAQUES DO MÊS
//
// COMO FUNCIONA A SELEÇÃO AUTOMÁTICA DE PERÍODO:
// A página abre sempre no último MÊS FECHADO (mês anterior ao atual),
// porque só dá pra saber quem foi destaque depois que o mês termina.
// Ex: em agosto/2026, abre nos destaques de julho/2026. Em setembro,
// abre nos de agosto. Isso troca sozinho todo dia 1º.
//
// O dropdown "Período" deixa a pessoa escolher outros meses já
// cadastrados manualmente — mas sempre ABRE no mês automático.
//
// PARA ADICIONAR UM NOVO MÊS (ex: quando agosto/2026 fechar):
// Copie um bloco dentro de PERIODOS_MENSAIS, ajuste "ano" (2026) e "mes"
// (7 = agosto, contando com janeiro=0), o rótulo, e a lista de destaques.
// Ele aparece sozinho no dropdown e vira o padrão quando chegar a vez dele.
//
// medalha: "prata" | "ouro" | "bronze"
// distrito: só o número (ex: "4590") — não usamos mais nome de clube nem foto
// valor: total de contribuição do distrito no período, em reais (número,
//        sem formatação — a formatação em "US$ X.XXX,XX" é feita sozinha)
// motivo: opcional; se não preencher, usa o texto genérico em
//         MOTIVO_PADRAO lá embaixo
// ============================================================================

// MODO_TESTE: deixe "true" enquanto estiver testando/ajustando o site, pra
// ver os meses já cadastrados mesmo antes da data de liberação (dia 1º do
// mês seguinte). ANTES DE PUBLICAR DE VERDADE, volte pra "false" — senão
// os dados aparecem pra qualquer visitante antes da hora.
const MODO_TESTE = true;

const MOTIVO_PADRAO = "Parabéns aos clubes e associados deste distrito pela dedicação e pelo compromisso com a Fundação Rotária!";

const NOMES_MESES = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

const PERIODO_FALLBACK = {
  chave: "fallback",
  rotuloMenu: "Ano Rotário 2025-26",
  subtitulo: "Distritos que mais contribuíram no Ano Rotário 2025-26",
  destaques: [
    { medalha: "ouro", distrito: "4563", valor: 5772.03 },
    { medalha: "prata", distrito: "4391", valor: 3725.41 },
    { medalha: "bronze", distrito: "4652", valor: 3643.25 },
  ],
};

// Cada bloco = um mês já fechado. "ano" e "mes" identificam o mês que os
// destaques SE REFEREM (não o mês em que a página vai exibi-los — esse é
// sempre o mês seguinte, calculado sozinho lá embaixo).
const PERIODOS_MENSAIS = [
  {
    ano: 2026, mes: 6, // 6 = julho (0-indexado: jan=0 ... dez=11)
    anoRotario: "2026-27",
    destaques: [
      { medalha: "prata", distrito: "[0000]", valor: null },
      { medalha: "ouro", distrito: "[0000]", valor: null },
      { medalha: "bronze", distrito: "[0000]", valor: null },
    ],
  },
  // Quando julho fechar de verdade (final de julho/2026) e você souber
  // quem foram os 3 distritos, troque os "[0000]" acima pelos números
  // reais, e o "null" do valor pelo total de contribuição (ex: 4820.50).
  // A página libera sozinha em 01/08 — não precisa mexer em mais nada
  // além disso.
  //
  // Próximo bloco pra copiar quando agosto/2026 fechar (libera 01/09):
  // {
  //   ano: 2026, mes: 7, // 7 = agosto
  //   anoRotario: "2026-27",
  //   destaques: [
  //     { medalha: "prata", distrito: "4590", valor: 4820.50 },
  //     { medalha: "ouro", distrito: "4563", valor: 5900.00 },
  //     { medalha: "bronze", distrito: "4420", valor: 3200.75 },
  //   ],
  // },
];

const ROTULO_MEDALHA = { prata: "Prata", ouro: "Ouro", bronze: "Bronze" };
// Ordem visual do pódio: prata à esquerda, ouro no meio (mais alto), bronze à direita.
const ORDEM_PODIO = { prata: 1, ouro: 2, bronze: 3 };

function todosOsPeriodos() {
  const hoje = new Date();
  const mensais = PERIODOS_MENSAIS
    // Só entra na lista (inclusive no dropdown) se a data de liberação já
    // passou — dia 1º do mês seguinte ao mês de referência. Antes disso,
    // o mês nem aparece como opção, mesmo já cadastrado no código: dá pra
    // preparar os dados com antecedência sem vazar antes da hora.
    .filter(p => MODO_TESTE || hoje >= new Date(p.ano, p.mes + 1, 1))
    .slice()
    .sort((a, b) => (b.ano - a.ano) || (b.mes - a.mes))
    .map(p => ({
      chave: `${p.ano}-${p.mes}`,
      rotuloMenu: `${NOMES_MESES[p.mes]} · Ano Rotário ${p.anoRotario}`,
      subtitulo: `Distritos que mais contribuíram no mês de ${NOMES_MESES[p.mes]}`,
      destaques: p.destaques,
    }));
  return [...mensais, PERIODO_FALLBACK];
}

function chavePeriodoAtual(periodos) {
  // Sempre segue a regra real de data — inclusive em MODO_TESTE. O modo
  // teste só libera meses pra aparecerem como OPÇÃO no dropdown antes da
  // hora; ele não muda qual período abre por padrão.
  const hoje = new Date();
  let mesRef = hoje.getMonth() - 1;
  let anoRef = hoje.getFullYear();
  if (mesRef < 0) { mesRef = 11; anoRef -= 1; }

  const chaveAlvo = `${anoRef}-${mesRef}`;
  const existe = periodos.find(p => p.chave === chaveAlvo);
  return existe ? existe.chave : PERIODO_FALLBACK.chave;
}

function formatarValor(valor) {
  if (valor === null || valor === undefined) return '';
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'USD' });
}

function renderizarPeriodo(periodo) {
  const container = document.getElementById('grid-destaques');
  const subtituloEl = document.getElementById('destaques-subtitulo');
  if (subtituloEl) subtituloEl.textContent = periodo.subtitulo;

  const ordenado = [...periodo.destaques].sort(
    (a, b) => (ORDEM_PODIO[a.medalha] || 99) - (ORDEM_PODIO[b.medalha] || 99)
  );

  container.innerHTML = ordenado.map(d => `
    <div class="card-destaque ${d.medalha}">
      <span class="medalha ${d.medalha}">${ROTULO_MEDALHA[d.medalha] || d.medalha}</span>
      <h3>Distrito ${d.distrito}</h3>
      ${d.valor != null ? `<p class="destaque-valor">${formatarValor(d.valor)}</p>` : ''}
      <p class="destaque-agradecimento">${d.motivo || MOTIVO_PADRAO}</p>
    </div>
  `).join('');
}

function proximaAtualizacaoTexto() {
  const hoje = new Date();
  const proximoDia1 = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 1);
  const mes = NOMES_MESES[proximoDia1.getMonth()];
  return `Próxima atualização em 01 de ${mes.toLowerCase()} de ${proximoDia1.getFullYear()}.`;
}

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('grid-destaques');
  const select = document.getElementById('filtro-periodo');
  if (!container) return;

  const periodos = todosOsPeriodos();
  const chaveAtual = chavePeriodoAtual(periodos);

  if (select) {
    select.innerHTML = periodos.map(p =>
      `<option value="${p.chave}"${p.chave === chaveAtual ? ' selected' : ''}>${p.rotuloMenu}</option>`
    ).join('');
    select.addEventListener('change', () => {
      const escolhido = periodos.find(p => p.chave === select.value) || PERIODO_FALLBACK;
      renderizarPeriodo(escolhido);
    });
  }

  const periodoInicial = periodos.find(p => p.chave === chaveAtual) || PERIODO_FALLBACK;
  renderizarPeriodo(periodoInicial);

  const proximaEl = document.getElementById('destaques-proxima');
  if (proximaEl) proximaEl.textContent = proximaAtualizacaoTexto();
});
