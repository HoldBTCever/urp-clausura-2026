// Dados do Torneo Clausura 2026 - Primera División - URP
// Para atualizar com resultados OFICIAIS: preencha o campo `official` do jogo
// correspondente com {scoreA, scoreB} e a tabela deixa de aceitar edição do
// visitante para aquele jogo (o placar oficial passa a valer sempre).

const TEAMS = [
  { id: "san-jose", name: "San José", logo: "assets/logos/san-jose.png", color: "#9cc2e6", text: "#0d2b45" },
  { id: "luque", name: "Luque", logo: "assets/logos/luque.jpg", color: "#237acb", text: "#ffffff" },
  { id: "curda", name: "Curda", logo: "assets/logos/curda.png", color: "#0c0c0c", text: "#f2c14e" },
  { id: "asuncion", name: "Asunción", logo: "assets/logos/asuncion.jpg", color: "#a15f01", text: "#ffffff" },
  { id: "santa-clara", name: "Santa Clara", logo: "assets/logos/santa-clara.png", color: "#1414a6", text: "#ffffff" },
  { id: "cristo-rey", name: "Cristo Rey", logo: "assets/logos/cristo-rey.jpg", color: "#019901", text: "#ffffff" },
  { id: "fernando", name: "Fernando", logo: "assets/logos/fernando.jpg", color: "#bf0000", text: "#ffffff" },
  { id: "jararas", name: "Jararás", logo: "assets/logos/jararas.jpg", color: "#965cca", text: "#ffffff" },
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

// Ultima rodada da fase classificatoria (antes dos playoffs).
// official: null enquanto o resultado nao for confirmado pelo administrador do site.
const ROUND7_MATCHES = [
  { id: "r7-1", a: "cristo-rey", b: "asuncion", official: null },
  { id: "r7-2", a: "santa-clara", b: "fernando", official: null },
  { id: "r7-3", a: "curda", b: "luque", official: null },
  { id: "r7-4", a: "jararas", b: "san-jose", official: null },
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
