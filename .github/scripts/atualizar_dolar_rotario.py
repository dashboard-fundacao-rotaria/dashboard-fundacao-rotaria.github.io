#!/usr/bin/env python3
"""
Busca o valor oficial do "Dólar Rotário" publicado em rotary.org.br e
grava em assets/dolar-rotario.json — arquivo que o site lê (mesma origem,
sem CORS) pra mostrar o câmbio na navbar sem precisar de edição manual.

Esse valor é publicado pela própria Rotary Brazil Office numa tabelinha
simples no topo do site, ex:
    <table class="dolar">
      <tr><td style="text-align: left;">Dólar Rotário - Setembro de 2026 - R$ 5,19</td>...
"""
import json
import re
import sys
import time
import urllib.error
import urllib.request
from datetime import datetime, timezone

URL = "https://rotary.org.br/"
DESTINO = "assets/dolar-rotario.json"
TENTATIVAS = 3
BACKOFF_SEGUNDOS = 5  # 5s, 10s, 20s entre tentativas

# Faixa plausível pro câmbio USD/BRL. Serve só pra pegar erro de parsing
# silencioso (ex.: casas decimais trocadas) — não é previsão econômica.
VALOR_MIN, VALOR_MAX = 0.5, 20.0

PADRAO = re.compile(
    r'class="dolar"[^>]*>.*?<td[^>]*>\s*'
    r'D[oó]lar Rot[aá]rio\s*-\s*([^-]+?)\s*-\s*R\$\s*([\d.,]+)',
    re.IGNORECASE | re.DOTALL,
)


def buscar_html(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    ultimo_erro = None
    for tentativa in range(1, TENTATIVAS + 1):
        try:
            with urllib.request.urlopen(req, timeout=20) as resp:
                return resp.read().decode("utf-8", errors="replace")
        except (urllib.error.URLError, TimeoutError) as erro:
            ultimo_erro = erro
            if tentativa < TENTATIVAS:
                espera = BACKOFF_SEGUNDOS * (2 ** (tentativa - 1))
                print(
                    f"Tentativa {tentativa}/{TENTATIVAS} falhou ({erro}); "
                    f"esperando {espera}s...",
                    file=sys.stderr,
                )
                time.sleep(espera)
    raise ultimo_erro


def extrair(html: str):
    m = PADRAO.search(html)
    if not m:
        return None
    mes_bruto = m.group(1).strip()
    valor_bruto = m.group(2).strip()
    # "5,19" -> 5.19 (formato BR pra float)
    valor = float(valor_bruto.replace(".", "").replace(",", "."))
    if not (VALOR_MIN < valor < VALOR_MAX):
        raise ValueError(
            f"valor extraído ({valor}) fora da faixa plausível "
            f"({VALOR_MIN}-{VALOR_MAX}) — provável erro de parsing, não "
            "vou gravar"
        )
    return mes_bruto, valor


def main():
    try:
        html = buscar_html(URL)
    except (urllib.error.URLError, TimeoutError) as erro:
        print(
            f"ERRO: não consegui acessar {URL} depois de {TENTATIVAS} "
            f"tentativas ({erro}). Provável instabilidade de rede, não "
            "mudança de layout. Não vou sobrescrever o arquivo existente.",
            file=sys.stderr,
        )
        sys.exit(1)

    try:
        resultado = extrair(html)
    except ValueError as erro:
        print(f"ERRO: {erro}. Não vou sobrescrever o arquivo existente.", file=sys.stderr)
        sys.exit(1)

    if resultado is None:
        print(
            "ERRO: não encontrei o padrão esperado ('Dólar Rotário - <mês> - "
            "R$ X,XX') na página. O layout da rotary.org.br pode ter mudado. "
            "Não vou sobrescrever o arquivo existente.",
            file=sys.stderr,
        )
        sys.exit(1)

    mes, valor = resultado
    dados = {
        "valor": round(valor, 4),
        "mes": mes,
        "fonte": URL,
        "atualizado_em": datetime.now(timezone.utc).isoformat(timespec="seconds"),
    }

    with open(DESTINO, "w", encoding="utf-8") as f:
        json.dump(dados, f, ensure_ascii=False, indent=2)
        f.write("\n")

    print(f"OK: Dólar Rotário {mes} = R$ {valor} salvo em {DESTINO}")


if __name__ == "__main__":
    main()
