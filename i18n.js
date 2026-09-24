// Traducoes da interface. Nomes de clube e datas nao sao traduzidos.
"use strict";

const I18N = {
  es: {
    eyebrow: "Unión de Rugby del Paraguay",
    title_line1: "Torneo Clausura 2026",
    title_line2: "Primera División",
    standings_title: "Clasificación",
    hint_incomplete: "Falta solo una fecha para la fase siguiente. Completá los resultados abajo para simular quién avanza a cada copa.",
    hint_complete: "Clasificación final de la fase clasificatoria (según los resultados completados abajo).",
    last_round_title: "Última fecha de la fase clasificatoria",
    sim_badge: "simulación",
    last_round_desc: "Completá los resultados para ver cómo quedaría la clasificación final y quién avanza a la Copa Oro (1º–4º) y a la Copa Desarrollo (5º–8º). Estos resultados quedan guardados solo en tu navegador — los resultados oficiales se van a agregar acá apenas se confirmen, y van a valer para todos.",
    final_phase_title: "Fase final",
    final_phase_desc: "Desde el 1º al 4º puesto (Copa Oro) y del 5º al 8º puesto (Copa Desarrollo) de la clasificación de arriba, cada grupo juega todos contra todos (3 fechas), después semifinal y final. La clasificación de la fase final arranca en cero — solo cuenta lo que pase en esos partidos.",
    cup_oro_title: "Copa Oro",
    cup_oro_sub: "1º al 4º puesto",
    cup_des_title: "Copa Desarrollo",
    cup_des_sub: "5º al 8º puesto",
    semifinal: "Semifinal",
    final: "Final",
    round_label: (n) => `Fecha ${n}`,
    group_standings: "Clasificación del grupo",
    waiting_last_round: "Esperando la definición de la última fecha",
    waiting_last_round_note: "Los cruces aparecen acá apenas se defina la última fecha de la fase clasificatoria.",
    waiting_group_stage: "Esperando el final de la fase de grupos",
    waiting_semis: "Esperando el resultado de las semifinales",
    last_round_date_label: "Última fecha",
    official_tag: "oficial",
    draw_warning: "Esta fase es eliminatoria: no puede terminar empatada, ajustá el resultado.",
    th_pos: "#", th_club: "Club", th_pj: "PJ", th_pg: "PG", th_pe: "PE", th_pp: "PP",
    th_bonus: "Bonus", th_pts: "Pts", th_favor: "A favor", th_contra: "En contra", th_dif: "Dif",
    th_pj_title: "Partidos jugados", th_pg_title: "Partidos ganados", th_pe_title: "Partidos empatados",
    th_pp_title: "Partidos perdidos", th_bonus_title: "Puntos bonus", th_pts_title: "Puntos",
    th_favor_title: "Puntos a favor", th_contra_title: "Puntos en contra", th_dif_title: "Diferencia",
    zone_split: (oro, total) => `🏆 Zona Copa Oro (1º–${oro}º) · 🥈 Zona Copa Desarrollo (${oro + 1}º–${total}º)`,
    champion_of: (cup) => `Campeón ${cup}`,
    reset_btn: "Borrar mi simulación",
    reset_confirm: "¿Borrar todos los resultados que completaste en este navegador?",
    footnote: "Clasificación después de 6 fechas según la planilla oficial de la URP (23/09/2026). Los resultados de los próximos partidos que vos completes quedan guardados solo en tu navegador (no se envían a nadie) y sirven solo para simular escenarios.",
    footer: "Sitio hecho por hinchas, para hinchas. No es un sitio oficial de la URP.",
    page_title: "Torneo Clausura 2026 — Primera División URP",
    page_desc: "Seguí la clasificación del Torneo Clausura 2026 de la Primera División de rugby de Paraguay (URP): tabla, última fecha, Copa Oro, Copa Desarrollo, semifinales y final.",
    theme_toggle: "Modo oscuro",
    atk_bonus_label: "+ bono",
    atk_bonus_title: "Bono ofensivo: marcó 4 tries más que el rival",
    def_bonus_note: (team) => `🛡️ +1 bono defensivo para ${team} (perdió por menos de 7 puntos)`,
  },
  pt: {
    eyebrow: "Unión de Rugby del Paraguay",
    title_line1: "Torneo Clausura 2026",
    title_line2: "Primera División",
    standings_title: "Classificação",
    hint_incomplete: "Falta só uma rodada para a fase seguinte. Preencha os placares abaixo para simular quem avança para cada taça.",
    hint_complete: "Classificação final da fase classificatória (considerando os placares preenchidos abaixo).",
    last_round_title: "Última rodada da fase classificatória",
    sim_badge: "simulação",
    last_round_desc: "Preencha os placares para ver como ficaria a classificação final e quem avançaria para a Taça Oro (1º–4º) e a Taça Desarrollo (5º–8º). Esses placares ficam salvos só no seu navegador — os resultados oficiais serão adicionados aqui assim que confirmados, e passam a valer para todo mundo.",
    final_phase_title: "Fase final",
    final_phase_desc: "A partir do 1º ao 4º lugar (Taça Oro) e do 5º ao 8º lugar (Taça Desarrollo) da classificação acima, cada grupo joga todos contra todos (3 rodadas), depois semifinal e final. A classificação da fase final é zerada — vale só o que acontecer nesses jogos.",
    cup_oro_title: "Taça Oro",
    cup_oro_sub: "1º ao 4º lugar",
    cup_des_title: "Taça Desarrollo",
    cup_des_sub: "5º ao 8º lugar",
    semifinal: "Semifinal",
    final: "Final",
    round_label: (n) => `Rodada ${n}`,
    group_standings: "Classificação do grupo",
    waiting_last_round: "Aguardando definição da última rodada",
    waiting_last_round_note: "Os confrontos aparecem aqui assim que a última rodada da fase classificatória for definida.",
    waiting_group_stage: "Aguardando fim da fase de grupos",
    waiting_semis: "Aguardando resultado das semifinais",
    last_round_date_label: "Última rodada",
    official_tag: "oficial",
    draw_warning: "Esta fase é eliminatória — não pode terminar empatada, ajuste o placar.",
    th_pos: "#", th_club: "Clube", th_pj: "PJ", th_pg: "PG", th_pe: "PE", th_pp: "PP",
    th_bonus: "Bonus", th_pts: "Pts", th_favor: "A favor", th_contra: "Contra", th_dif: "Dif",
    th_pj_title: "Jogos", th_pg_title: "Vitórias", th_pe_title: "Empates",
    th_pp_title: "Derrotas", th_bonus_title: "Pontos bônus", th_pts_title: "Pontos",
    th_favor_title: "Pontos a favor", th_contra_title: "Pontos em contra", th_dif_title: "Diferença",
    zone_split: (oro, total) => `🏆 Zona Taça Oro (1º–${oro}º) · 🥈 Zona Taça Desarrollo (${oro + 1}º–${total}º)`,
    champion_of: (cup) => `Campeão ${cup}`,
    reset_btn: "Limpar minha simulação",
    reset_confirm: "Limpar todos os placares que você preencheu neste navegador?",
    footnote: "Classificação após 6 rodadas conforme planilha oficial da URP (23/09/2026). Os placares dos próximos jogos preenchidos por você ficam salvos só no seu navegador (não são enviados a ninguém) e servem apenas para simular cenários.",
    footer: "Site feito por torcedores, para torcedores. Não é um site oficial da URP.",
    page_title: "Torneo Clausura 2026 — Primera División URP",
    page_desc: "Acompanhe a classificação do Torneo Clausura 2026 da Primera División de rugby do Paraguai (URP): tabela, última rodada, Taça Oro, Taça Desarrollo, semifinais e final.",
    theme_toggle: "Modo escuro",
    atk_bonus_label: "+ bônus",
    atk_bonus_title: "Bônus ofensivo: marcou 4 tries a mais que o adversário",
    def_bonus_note: (team) => `🛡️ +1 bônus defensivo para ${team} (perdeu por menos de 7 pontos)`,
  },
  en: {
    eyebrow: "Unión de Rugby del Paraguay",
    title_line1: "Torneo Clausura 2026",
    title_line2: "Primera División",
    standings_title: "Standings",
    hint_incomplete: "Only one matchday left before the next phase. Fill in the scores below to simulate who advances to each cup.",
    hint_complete: "Final standings of the regular phase (based on the scores filled in below).",
    last_round_title: "Last matchday of the regular phase",
    sim_badge: "simulation",
    last_round_desc: "Fill in the scores to see how the final standings would look and who would advance to the Gold Cup (1st–4th) and the Development Cup (5th–8th). These scores are saved only in your browser — official results will be added here once confirmed, and will then count for everyone.",
    final_phase_title: "Final phase",
    final_phase_desc: "From the 1st–4th place (Gold Cup) and 5th–8th place (Development Cup) of the standings above, each group plays a round robin (3 matchdays), then semifinal and final. The final phase standings start from zero — only what happens in these matches counts.",
    cup_oro_title: "Gold Cup",
    cup_oro_sub: "1st to 4th place",
    cup_des_title: "Development Cup",
    cup_des_sub: "5th to 8th place",
    semifinal: "Semifinal",
    final: "Final",
    round_label: (n) => `Matchday ${n}`,
    group_standings: "Group standings",
    waiting_last_round: "Waiting for the last matchday to be decided",
    waiting_last_round_note: "The fixtures show up here as soon as the last matchday of the regular phase is decided.",
    waiting_group_stage: "Waiting for the group stage to finish",
    waiting_semis: "Waiting for the semifinal results",
    last_round_date_label: "Last matchday",
    official_tag: "official",
    draw_warning: "This is a knockout stage — it can't end in a draw, adjust the score.",
    th_pos: "#", th_club: "Club", th_pj: "P", th_pg: "W", th_pe: "D", th_pp: "L",
    th_bonus: "Bonus", th_pts: "Pts", th_favor: "For", th_contra: "Against", th_dif: "Diff",
    th_pj_title: "Played", th_pg_title: "Won", th_pe_title: "Drawn",
    th_pp_title: "Lost", th_bonus_title: "Bonus points", th_pts_title: "Points",
    th_favor_title: "Points for", th_contra_title: "Points against", th_dif_title: "Difference",
    zone_split: (oro, total) => `🏆 Gold Cup zone (1st–${oro}th) · 🥈 Development Cup zone (${oro + 1}th–${total}th)`,
    champion_of: (cup) => `${cup} champion`,
    reset_btn: "Clear my simulation",
    reset_confirm: "Clear every score you filled in on this browser?",
    footnote: "Standings after 6 matchdays per the official URP spreadsheet (2026-09-23). Scores you fill in for upcoming matches are saved only in your browser (never sent anywhere) and are just for simulating scenarios.",
    footer: "Site made by fans, for fans. Not an official URP site.",
    page_title: "Torneo Clausura 2026 — Primera División URP",
    page_desc: "Follow the Torneo Clausura 2026 standings for Paraguay's Primera División rugby (URP): table, last matchday, Gold Cup, Development Cup, semifinals and final.",
    theme_toggle: "Dark mode",
    atk_bonus_label: "+ bonus",
    atk_bonus_title: "Attacking bonus: scored 4 more tries than the opponent",
    def_bonus_note: (team) => `🛡️ +1 defensive bonus for ${team} (lost by less than 7 points)`,
  },
};

const LANG_KEY = "urp_clausura_2026_lang";
const THEME_KEY = "urp_clausura_2026_theme";

function getLang() {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved && I18N[saved]) return saved;
  } catch (e) { /* localStorage indisponivel */ }
  return "es";
}

function setLang(lang) {
  if (!I18N[lang]) return;
  try { localStorage.setItem(LANG_KEY, lang); } catch (e) { /* ignore */ }
  document.documentElement.lang = lang === "pt" ? "pt-BR" : lang === "en" ? "en" : "es";
  applyStaticI18n();
  updateLangButtons();
  if (typeof renderAll === "function") renderAll();
}

function t(key, ...args) {
  const dict = I18N[getLang()] || I18N.es;
  const val = dict[key] ?? I18N.es[key];
  return typeof val === "function" ? val(...args) : val;
}

function applyStaticI18n() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  const titleEl = document.querySelector("title");
  if (titleEl) titleEl.textContent = t("page_title");
  const descEl = document.querySelector('meta[name="description"]');
  if (descEl) descEl.setAttribute("content", t("page_desc"));
}

function updateLangButtons() {
  const lang = getLang();
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });
}

// Claro e sempre o padrao (nao segue mais a preferencia do sistema); so
// muda quando a pessoa clica no toggle, e a escolha fica salva.
function getTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "dark") return "dark";
  } catch (e) { /* ignore */ }
  return "light";
}

function applyTheme(theme) {
  if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
  const btn = document.getElementById("theme-toggle");
  if (btn) {
    btn.textContent = theme === "dark" ? "☀️" : "🌙";
    btn.setAttribute("aria-label", t("theme_toggle"));
    btn.title = t("theme_toggle");
  }
}

function toggleTheme() {
  const next = getTheme() === "dark" ? "light" : "dark";
  try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* ignore */ }
  applyTheme(next);
}

document.addEventListener("DOMContentLoaded", () => {
  applyStaticI18n();
  updateLangButtons();
  applyTheme(getTheme());
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => setLang(btn.dataset.lang));
  });
  const themeBtn = document.getElementById("theme-toggle");
  if (themeBtn) themeBtn.addEventListener("click", toggleTheme);
});
