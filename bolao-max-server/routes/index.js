var express = require('express');
var router = express.Router();
var cb = require('campeonato-brasileiro');
const browser = require('browser-detect');

/* GET home page. */
router.get('/', function(req, res, next) {
    var serie = 'a';
    let bolao = require('../json/bolao.json');
    i = 0;
    const brw = browser(req.headers['user-agent']);
    console.log(brw);

    cb.tabela(serie).then(function(tabela) {
        pontuacao = (time) => { return tabela.filter(t => { return t.nome === time })[0] }
        bolao.Competidores.forEach(b => {
            let pontuacaoCompetidor = 0;
            let saldoGols = 0;
            let golsPro = 0
            b.Clubes.forEach(t => {
                pontuacaoAtual = pontuacao(t.Clube);
                if (pontuacaoAtual) {
                    t.pontos = pontuacaoAtual.pontos;
                    pontuacaoCompetidor += Number(t.pontos);
                    t.jogos = pontuacaoAtual.jogos;
                    t.vitorias = pontuacaoAtual.vitorias;
                    t.empates = pontuacaoAtual.empates;
                    t.derrotas = pontuacaoAtual.derrotas;
                    t.golsPro = pontuacaoAtual.golsPro;
                    golsPro += Number(t.golsPro);
                    t.golsContra = pontuacaoAtual.golsContra;
                    t.saldoGols = pontuacaoAtual.saldoGols;
                    saldoGols += Number(t.saldoGols);
                    t.percentual = pontuacaoAtual.percentual;
                } else {
                    throw 'Erro no time ' + t.Clube;
                }
            });
            b.Pontos = Number(pontuacaoCompetidor);
            b.Saldo_Gols = Number(saldoGols);
            b.golsPro = Number(golsPro);
        });
        bolao.Competidores = bolao.Competidores.sort((a, b) => {
            if (a.Pontos < b.Pontos) return +1;
            if (a.Pontos > b.Pontos) return -1;
            if (a.Pontos == b.Pontos && a.Saldo_Gols < b.Saldo_Gols) return +1;
            if (a.Pontos == b.Pontos && a.Saldo_Gols > b.Saldo_Gols) return -1;
            if (a.Pontos == b.Pontos && a.Saldo_Gols == b.Saldo_Gols && a.golsPro < b.golsPro) return +1;
            if (a.Pontos == b.Pontos && a.Saldo_Gols == b.Saldo_Gols && a.golsPro > b.golsPro) return -1;
            if (a.Pontos == b.Pontos && a.Saldo_Gols == b.Saldo_Gols && a.golsPro == b.golsPro) return 0;
        });
        pos = 0;
        bolao.Competidores.forEach(b => {
            pos++;
            b.Posicao = pos;
            b.Premio = pos == 1 ? 'R$ 2.000,00' : pos == 2 ? 'R$ 600,00' : pos == 3 ? 'R$ 300,00' : pos == bolao.Competidores.length ? 'R$ 100,00' : '-';
        });
        res.render('index', { bolao, brw });
    }, function(err) {
        console.log(err);
    });
});

module.exports = router;