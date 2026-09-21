#!/usr/bin/env python3
"""
Busca o valor oficial do "Dólar Rotário" publicado em rotary.org.br e
grava em assets/dolar-rotario.json — arquivo que o site lê (mesma origem,
sem CORS) pra mostrar o câmbio na navbar sem precisar de edição manual.

Esse valor é publicado pela própria Rotary Brazil Office numa tabelinha
simples no topo do site, ex:
    <table class="dolar">
      <tr><td style="text-align: left;">Dólar Rotário - Setembro de 2026 - R$ 5,19</td>...

IMPORTANTE: isso é raspagem de HTML de um site que não é nosso — se a
Rotary mudar o layout dessa página, este script para de encontrar o
padrão e (de propósito) NÃO sobrescreve o arquivo com lixo: falha alto e
mantém o último valor válido no ar. Se isso acontecer, o job do GitHub
Actions aparece como falho e alguém precisa olhar/ajustar o regex abaixo.
"""
import json
import re
import sys
import urllib.request
from datetime import datetime, timezone

URL = "https://rotary.org.br/"
DESTINO = "assets/dolar-rotario.json"

PADRAO = re.compile(
    r'class="dolar"[^>]*>.*?<td[^>]*>\s*'
    r'D[oó]lar Rot[aá]rio\s*-\s*([^-]+?)\s*-\s*R\$\s*([\d.,]+)',
    re.IGNORECASE | re.DOTALL,
)


def buscar_html(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=20) as resp:
        return resp.read().decode("utf-8", errors="replace")


def extrair(html: str):
    m = PADRAO.search(html)
    if not m:
        return None
    mes_bruto = m.group(1).strip()
    valor_bruto = m.group(2).strip()
    # "5,19" -> 5.19 (formato BR pra float)
    valor = float(valor_bruto.replace(".", "").replace(",", "."))
    return mes_bruto, valor


def main():
    html = buscar_html(URL)
    resultado = extrair(html)
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
