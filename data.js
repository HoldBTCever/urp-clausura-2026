// Dados do Torneo Clausura 2026 - Primera División - URP
// Para atualizar com resultados OFICIAIS: preencha o campo `official` do jogo
// correspondente com {scoreA, scoreB} e a tabela deixa de aceitar edição do
// visitante para aquele jogo (o placar oficial passa a valer sempre).

const TEAMS = [
  { id: "san-jose", name: "San José", logo: "assets/logos/san-jose.png", color: "#9cc2e6", text: "#0d2b45" },
  { id: "luque", name: "Luque", logo: "assets/logos/luque.png", color: "#237acb", text: "#ffffff" },
  { id: "curda", name: "Curda", logo: "assets/logos/curda.png", color: "#0c0c0c", text: "#f2c14e" },
  { id: "asuncion", name: "Asunción", logo: "assets/logos/asuncion.png", color: "#a15f01", text: "#ffffff" },
  { id: "santa-clara", name: "Santa Clara", logo: "assets/logos/santa-clara.png", color: "#1414a6", text: "#ffffff" },
  { id: "cristo-rey", name: "Cristo Rey", logo: "assets/logos/cristo-rey.png", color: "#019901", text: "#ffffff" },
  { id: "fernando", name: "Fernando", logo: "assets/logos/fernando.png", color: "#bf0000", text: "#ffffff" },
  { id: "jararas", name: "Jararás", logo: "assets/logos/jararas.png", color: "#965cca", text: "#ffffff" },
];

// Acumulado apos as 6 primeiras rodadas (fonte: planilha oficial URP, 23/09/2026)
const BASE_STANDINGS = {
  "san-jose": { pj: 6, pg: 6, pe: 0, pp: 0, bonus: 5, favor: 379, contra: 92 },
  "luque": { pj: 6, pg: 5, pe: 0, pp: 1, bonus: 6, favor: 274, contra: 120 },
  "curda": { pj: 6, pg: 4, pe: 0, pp: 2, bonus: 4, favor: 289, contra: 103 },
  "asuncion": { pj: 6, pg: 3, pe: 0, pp: 3, bonus: 5, favor: 200, contra: 143 },
  "santa-clara": { pj: 6, pg: 3, pe: 0, pp: 3, bonus: 3, favor: 134, contra: 211 },
  "cristo-rey": { pj: 6, pg: 2, pe: 0, pp: 4, bonus: 4, favor: 180, contra: 225 },
  "fernando": { pj: 6, pg: 1, pe: 0, pp: 5, bonus: 1, favor: 69, contra: 346 },
  "jararas": { pj: 6, pg: 0, pe: 0, pp: 6, bonus: 0, favor: 25, contra: 310 },
};

// Ultima rodada da fase classificatoria (antes dos playoffs) - ENCERRADA.
// official: null enquanto o resultado nao for confirmado pelo administrador do site.
//
// Curda 54x46 Luque e o placar real, confirmado pelo usuario. Os outros tres
// (r7-1, r7-2, r7-4) sao placar MINIMO PROVISORIO (30x10, pedido explicito do
// usuario) - ele sabia so quem tinha ganho, nao o placar exato. Trocar pelo
// placar real assim que ele achar (some/transmissao/grupo): isso muda
// "A favor"/"Em contra" da temporada, que hoje estao com os numeros de
// preenchimento, nao os reais.
//
// r7-1 tem 1 ponto de bonus manual (atkA) pro Cristo Rey: sem ele, 30x10 sem
// bonus da 16 pontos (12 base + 4 da vitoria), que fica ABAIXO dos 17 do
// Asuncion (que so perde, fica parado em 17) - e o usuario confirmou que a
// posicao final e Cristo Rey na frente do Asuncion. Com o bonus, os dois
// empatam em 17 e o confronto direto desse mesmo jogo desempata a favor do
// Cristo Rey. Ajuste tambem quando trocar pelo placar real.
const ROUND7_MATCHES = [
  { id: "r7-1", a: "cristo-rey", b: "asuncion", official: { scoreA: 30, scoreB: 10, atkA: true } },
  { id: "r7-2", a: "santa-clara", b: "fernando", official: { scoreA: 30, scoreB: 10 } },
  { id: "r7-3", a: "curda", b: "luque", official: { scoreA: 54, scoreB: 46 } },
  { id: "r7-4", a: "jararas", b: "san-jose", official: { scoreA: 10, scoreB: 30 } },
];

// Datas da fase final
const PHASE2_DATES = ["2026-10-03", "2026-10-10", "2026-10-17"];
const SEMI_DATE = "2026-10-24";
const FINAL_DATE = "2026-10-31";

// Resultados OFICIAIS da fase de grupos da Taça Oro / Taça Desarrollo, das
// semifinais e das finais, no formato { "<matchId>": {scoreA, scoreB} }.
// matchId segue o padrao: "<oro|des>-r<1|2|3>-m<1|2>", "<oro|des>-semi-<1|2>",
// "<oro|des>-final". Preencher aqui conforme os jogos forem confirmados.
const OFFICIAL_PHASE2 = {};

// Confrontos diretos conhecidos das 6 primeiras rodadas, usados como 1o
// criterio de desempate quando duas equipes empatam em pontos (antes da
// diferenca de pontos). Nao temos o resultado rodada-a-rodada das 6
// primeiras datas, so o total acumulado (BASE_STANDINGS) - por isso este
// registro manual: preencha aqui so os confrontos que voce souber, no
// formato "id-time-1|id-time-2" (ordem alfabetica) -> id do time vencedor.
// Confrontos da ultima rodada (ROUND7_MATCHES) nao precisam entrar aqui:
// esses ja sao considerados automaticamente pelo resultado do jogo.
const HEAD_TO_HEAD_WINNERS = {
  "curda|santa-clara": "santa-clara",
};
