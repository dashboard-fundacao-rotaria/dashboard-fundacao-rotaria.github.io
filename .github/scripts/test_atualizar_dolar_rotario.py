import pathlib
import unittest

from atualizar_dolar_rotario import extrair

FIXTURES = pathlib.Path(__file__).parent / "fixtures"


class TestExtrair(unittest.TestCase):
    def test_extrai_do_html_de_exemplo(self):
        html = (FIXTURES / "exemplo.html").read_text(encoding="utf-8")
        mes, valor = extrair(html)
        self.assertEqual(mes, "Setembro de 2026")
        self.assertAlmostEqual(valor, 5.19)

    def test_retorna_none_se_padrao_nao_bate(self):
        html = "<html><body>site mudou de layout</body></html>"
        self.assertIsNone(extrair(html))

    def test_rejeita_valor_fora_da_faixa_plausivel(self):
        html = (
            '<table class="dolar"><tr><td>'
            "Dólar Rotário - Setembro de 2026 - R$ 519,00"
            "</td></tr></table>"
        )
        with self.assertRaises(ValueError):
            extrair(html)


if __name__ == "__main__":
    unittest.main()
