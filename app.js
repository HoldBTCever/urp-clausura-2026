// Torneo Clausura 2026 - logica de classificacao e simulacao
"use strict";

const TEAMS_BY_ID = Object.fromEntries(TEAMS.map((t) => [t.id, t]));
const STORE_KEY = "urp_clausura_2026_sim_v1";

let SIM = loadSim();

function loadSim() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY)) || {};
  } catch (e) {
    return {};
  }
}

function saveSim() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(SIM));
  } catch (e) {
    /* localStorage indisponivel (modo privado etc.) - simulacao so nao persiste */
  }
}

// Guarda o placar mesmo quando so um dos lados foi preenchido, senao um
// re-render no meio da digitacao apaga o que a pessoa acabou de digitar.
// computeStandings() e os calculos de fase seguinte ja ignoram resultado
// incompleto (scoreA/scoreB nulo) por conta propria.
function setSimResult(matchId, a, b, scoreA, scoreB, atkA, atkB) {
  if (scoreA == null && scoreB == null && !atkA && !atkB) {
    delete SIM[matchId];
  } else {
    SIM[matchId] = { sig: a + "|" + b, scoreA, scoreB, atkA: !!atkA, atkB: !!atkB };
  }
  saveSim();
}

// Resultado efetivo de um jogo: oficial tem prioridade sobre a simulacao do visitante.
// Sempre com atkA/atkB normalizados para boolean (resultado oficial pode nao os ter).
function getResult(match) {
  const raw = match.official && match.official.scoreA != null
    ? match.official
    : match.a && match.b && SIM[match.id] && SIM[match.id].sig === match.a + "|" + match.b
      ? SIM[match.id]
      : null;
  if (!raw) return null;
  return { scoreA: raw.scoreA, scoreB: raw.scoreB, atkA: !!raw.atkA, atkB: !!raw.atkB };
}

function isOfficial(match) {
  return !!(match.official && match.official.scoreA != null);
}

function zeroBase(ids) {
  const out = {};
  ids.forEach((id) => (out[id] = { pj: 0, pg: 0, pe: 0, pp: 0, bonus: 0, favor: 0, contra: 0 }));
  return out;
}

// Bonus = bonus ofensivo marcado manualmente (4+ tries de diferenca, nao da
// pra derivar so do placar) + bonus defensivo automatico (perder por menos
// de 7 pontos). Empate nao concede bonus defensivo pra ninguem.
function computeBonus(scoreA, scoreB, atkA, atkB) {
  let bonusA = atkA ? 1 : 0;
  let bonusB = atkB ? 1 : 0;
  if (scoreA !== scoreB) {
    const diff = Math.abs(scoreA - scoreB);
    if (diff < 7) {
      if (scoreA < scoreB) bonusA += 1;
      else bonusB += 1;
    }
  }
  return { bonusA, bonusB };
}

function computeStandings(baseMap, matches) {
  const acc = {};
  for (const id in baseMap) acc[id] = { ...baseMap[id] };
  matches.forEach((m) => {
    const r = getResult(m);
    if (!r || r.scoreA == null || r.scoreB == null) return;
    const A = acc[m.a];
    const B = acc[m.b];
    if (!A || !B) return;
    const { bonusA, bonusB } = computeBonus(r.scoreA, r.scoreB, r.atkA, r.atkB);
    A.pj++; B.pj++;
    A.favor += r.scoreA; A.contra += r.scoreB;
    B.favor += r.scoreB; B.contra += r.scoreA;
    A.bonus += bonusA; B.bonus += bonusB;
    if (r.scoreA > r.scoreB) { A.pg++; B.pp++; }
    else if (r.scoreA < r.scoreB) { B.pg++; A.pp++; }
    else { A.pe++; B.pe++; }
  });
  return acc;
}

// Confronto direto entre duas equipes dentro de uma lista de jogos: devolve
// o id da vencedora, ou null se nao jogaram (ainda) ou empataram.
function headToHead(aId, bId, matches) {
  for (const m of matches) {
    const isPair = (m.a === aId && m.b === bId) || (m.a === bId && m.b === aId);
    if (!isPair) continue;
    const r = getResult(m);
    if (!r || r.scoreA == null || r.scoreB == null || r.scoreA === r.scoreB) return null;
    return r.scoreA > r.scoreB ? m.a : m.b;
  }
  return null;
}

// Confronto direto da tabela principal: prioriza o registro manual de
// HEAD_TO_HEAD_WINNERS (cobre as 6 primeiras rodadas, sem dado jogo-a-jogo),
// e cai para o resultado da ultima rodada se as duas se enfrentaram nela.
function mainTableH2H(aId, bId) {
  const key = [aId, bId].sort().join("|");
  return HEAD_TO_HEAD_WINNERS[key] || headToHead(aId, bId, ROUND7_MATCHES);
}

function toRows(acc, teams, h2hFn) {
  return teams
    .map((t) => {
      const s = acc[t.id] || { pj: 0, pg: 0, pe: 0, pp: 0, bonus: 0, favor: 0, contra: 0 };
      const pts = 4 * s.pg + 2 * s.pe + s.bonus;
      return { ...t, ...s, pts, dif: s.favor - s.contra };
    })
    .sort((x, y) => {
      if (y.pts !== x.pts) return y.pts - x.pts;
      if (h2hFn) {
        const winner = h2hFn(x.id, y.id);
        if (winner) return winner === x.id ? -1 : 1;
      }
      return y.dif - x.dif || y.favor - x.favor || x.name.localeCompare(y.name);
    });
}

function formatDate(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}`;
}

function teamCellHTML(team) {
  return `<div class="team-cell"><img src="${team.logo}" alt="" class="team-logo" loading="lazy"><span class="team-name">${team.name}</span></div>`;
}

function renderMainTable(el, rows, splitAfter) {
  let html = `<table class="standings"><thead><tr>
      <th>${t("th_pos")}</th><th>${t("th_club")}</th><th title="${t("th_pj_title")}">${t("th_pj")}</th><th title="${t("th_pg_title")}">${t("th_pg")}</th><th title="${t("th_pe_title")}">${t("th_pe")}</th><th title="${t("th_pp_title")}">${t("th_pp")}</th>
      <th title="${t("th_bonus_title")}">${t("th_bonus")}</th><th title="${t("th_pts_title")}">${t("th_pts")}</th><th title="${t("th_favor_title")}">${t("th_favor")}</th><th title="${t("th_contra_title")}">${t("th_contra")}</th><th title="${t("th_dif_title")}">${t("th_dif")}</th>
    </tr></thead><tbody>`;
  rows.forEach((r, i) => {
    const pos = i + 1;
    const zone = splitAfter ? (pos <= splitAfter ? "zone-oro" : "zone-des") : "";
    html += `<tr class="${zone}">
        <td class="pos">${pos}</td>
        <td class="club">${teamCellHTML(r)}</td>
        <td>${r.pj}</td><td>${r.pg}</td><td>${r.pe}</td><td>${r.pp}</td><td>${r.bonus}</td>
        <td class="pts">${r.pts}</td><td>${r.favor}</td><td>${r.contra}</td><td>${r.dif > 0 ? "+" : ""}${r.dif}</td>
      </tr>`;
    if (splitAfter && pos === splitAfter) {
      html += `<tr class="split-row"><td colspan="11">${t("zone_split", splitAfter, rows.length)}</td></tr>`;
    }
  });
  html += "</tbody></table>";
  el.innerHTML = html;
}

function renderMiniTable(rows) {
  const wrap = document.createElement("div");
  wrap.className = "table-scroll";
  let html = `<table class="standings mini"><thead><tr>
      <th>${t("th_pos")}</th><th>${t("th_club")}</th><th>${t("th_pj")}</th><th>${t("th_pg")}</th><th>${t("th_pe")}</th><th>${t("th_pp")}</th><th>${t("th_pts")}</th><th>${t("th_dif")}</th>
    </tr></thead><tbody>`;
  rows.forEach((r, i) => {
    html += `<tr><td class="pos">${i + 1}</td><td class="club">${teamCellHTML(r)}</td>
        <td>${r.pj}</td><td>${r.pg}</td><td>${r.pe}</td><td>${r.pp}</td>
        <td class="pts">${r.pts}</td><td>${r.dif > 0 ? "+" : ""}${r.dif}</td></tr>`;
  });
  html += "</tbody></table>";
  wrap.innerHTML = html;
  return wrap;
}

function placeholderCard(text) {
  const div = document.createElement("div");
  div.className = "match-card placeholder";
  div.innerHTML = `<p>${text}</p>`;
  return div;
}

function createMatchCard(match, opts) {
  opts = opts || {};
  const teamA = TEAMS_BY_ID[match.a];
  const teamB = TEAMS_BY_ID[match.b];
  if (!teamA || !teamB) return placeholderCard(t("waiting_last_round"));

  const result = getResult(match) || {};
  const official = isOfficial(match);
  const locked = official;
  const showBonus = !!opts.showBonus;

  const bonusCheckbox = (side, team, checked) => `
        <label class="bonus-check" title="${t("atk_bonus_title")}">
          <input type="checkbox" data-atk="${side}" ${checked ? "checked" : ""} ${locked ? "disabled" : ""}>
          ${t("atk_bonus_label")}
        </label>`;

  const wrap = document.createElement("div");
  wrap.className = "match-card" + (official ? " official" : "");
  wrap.dataset.matchId = match.id;
  wrap.innerHTML = `
    ${opts.dateLabel ? `<div class="match-date">${opts.dateLabel}${official ? ` · <span class="tag-oficial">${t("official_tag")}</span>` : ""}</div>` : ""}
    <div class="match-teams">
      <div class="match-team">
        <img src="${teamA.logo}" class="match-logo" alt="">
        <span>${teamA.name}</span>
        ${showBonus ? bonusCheckbox("a", teamA, result.atkA) : ""}
      </div>
      <div class="match-score">
        <input type="number" min="0" inputmode="numeric" class="score-input" data-side="a" ${locked ? "disabled" : ""} value="${result.scoreA ?? ""}" placeholder="–">
        <span class="x">x</span>
        <input type="number" min="0" inputmode="numeric" class="score-input" data-side="b" ${locked ? "disabled" : ""} value="${result.scoreB ?? ""}" placeholder="–">
      </div>
      <div class="match-team">
        <span>${teamB.name}</span>
        <img src="${teamB.logo}" class="match-logo" alt="">
        ${showBonus ? bonusCheckbox("b", teamB, result.atkB) : ""}
      </div>
    </div>
    <p class="draw-warning" hidden>${t("draw_warning")}</p>
    <p class="bonus-note" hidden></p>
  `;

  if (!locked) {
    const inputA = wrap.querySelector('[data-side="a"]');
    const inputB = wrap.querySelector('[data-side="b"]');
    const atkAInput = wrap.querySelector('[data-atk="a"]');
    const atkBInput = wrap.querySelector('[data-atk="b"]');
    const warn = wrap.querySelector(".draw-warning");
    const bonusNote = wrap.querySelector(".bonus-note");
    const onChange = () => {
      const a = inputA.value;
      const b = inputB.value;
      const scoreA = a === "" ? null : Math.max(0, parseInt(a, 10) || 0);
      const scoreB = b === "" ? null : Math.max(0, parseInt(b, 10) || 0);
      const atkA = atkAInput ? atkAInput.checked : false;
      const atkB = atkBInput ? atkBInput.checked : false;
      if (scoreA != null && scoreB != null && scoreA === scoreB && !opts.allowDraw) {
        warn.hidden = false;
        setSimResult(match.id, match.a, match.b, null, null, false, false);
        renderAll();
        return;
      }
      warn.hidden = true;
      if (showBonus && bonusNote && scoreA != null && scoreB != null && scoreA !== scoreB && Math.abs(scoreA - scoreB) < 7) {
        const loserTeam = scoreA < scoreB ? teamA : teamB;
        bonusNote.hidden = false;
        bonusNote.textContent = t("def_bonus_note", loserTeam.name);
      } else if (bonusNote) {
        bonusNote.hidden = true;
      }
      setSimResult(match.id, match.a, match.b, scoreA, scoreB, atkA, atkB);
      renderAll();
    };
    inputA.addEventListener("input", onChange);
    inputB.addEventListener("input", onChange);
    if (atkAInput) atkAInput.addEventListener("change", onChange);
    if (atkBInput) atkBInput.addEventListener("change", onChange);
  } else if (showBonus && result.scoreA != null && result.scoreB != null && result.scoreA !== result.scoreB && Math.abs(result.scoreA - result.scoreB) < 7) {
    const bonusNote = wrap.querySelector(".bonus-note");
    const loserTeam = result.scoreA < result.scoreB ? teamA : teamB;
    bonusNote.hidden = false;
    bonusNote.textContent = t("def_bonus_note", loserTeam.name);
  }

  return wrap;
}

function roundRobin4(ids) {
  const [a, b, c, d] = ids;
  return [
    [[a, d], [b, c]],
    [[a, c], [d, b]],
    [[a, b], [c, d]],
  ];
}

function buildGroupRounds(cupKey, seedIds) {
  if (!seedIds) {
    return PHASE2_DATES.map((date, ri) => ({
      date,
      matches: [
        { id: `${cupKey}-r${ri + 1}-m1`, a: null, b: null, official: OFFICIAL_PHASE2[`${cupKey}-r${ri + 1}-m1`] || null },
        { id: `${cupKey}-r${ri + 1}-m2`, a: null, b: null, official: OFFICIAL_PHASE2[`${cupKey}-r${ri + 1}-m2`] || null },
      ],
    }));
  }
  const rounds = roundRobin4(seedIds);
  return rounds.map((pairs, ri) => ({
    date: PHASE2_DATES[ri],
    matches: pairs.map((p, pi) => {
      const id = `${cupKey}-r${ri + 1}-m${pi + 1}`;
      return { id, a: p[0], b: p[1], official: OFFICIAL_PHASE2[id] || null };
    }),
  }));
}

function renderCup(cupKey, seedIds, refs, titleKey) {
  // --- fase de grupos ---
  const rounds = buildGroupRounds(cupKey, seedIds);
  refs.groupEl.innerHTML = "";
  rounds.forEach((round, idx) => {
    const block = document.createElement("div");
    block.className = "round-block";
    block.innerHTML = `<h4>${t("round_label", idx + 1)} <span class="date">${formatDate(round.date)}</span></h4>`;
    const grid = document.createElement("div");
    grid.className = "matches-grid";
    round.matches.forEach((m) => {
      grid.appendChild(m.a && m.b ? createMatchCard(m, { allowDraw: true, showBonus: true }) : placeholderCard(t("waiting_last_round")));
    });
    block.appendChild(grid);
    refs.groupEl.appendChild(block);
  });

  const allGroupMatches = rounds.flatMap((r) => r.matches);
  let groupRows = null;
  if (seedIds) {
    const acc = computeStandings(zeroBase(seedIds), allGroupMatches);
    const groupH2H = (aId, bId) => headToHead(aId, bId, allGroupMatches);
    groupRows = toRows(acc, seedIds.map((id) => TEAMS_BY_ID[id]), groupH2H);
    const tblWrap = document.createElement("div");
    tblWrap.className = "group-table-wrap";
    tblWrap.innerHTML = `<h4>${t("group_standings")}</h4>`;
    tblWrap.appendChild(renderMiniTable(groupRows));
    refs.groupEl.appendChild(tblWrap);
  } else {
    const note = document.createElement("p");
    note.className = "hint";
    note.textContent = t("waiting_last_round_note");
    refs.groupEl.prepend(note);
  }

  const groupComplete = !!seedIds && allGroupMatches.every((m) => getResult(m));

  // --- semifinais ---
  refs.semisEl.innerHTML = "";
  const semi1Id = `${cupKey}-semi-1`;
  const semi2Id = `${cupKey}-semi-2`;
  const semi1 = {
    id: semi1Id,
    a: groupComplete ? groupRows[1].id : null,
    b: groupComplete ? groupRows[2].id : null,
    official: OFFICIAL_PHASE2[semi1Id] || null,
  };
  const semi2 = {
    id: semi2Id,
    a: groupComplete ? groupRows[0].id : null,
    b: groupComplete ? groupRows[3].id : null,
    official: OFFICIAL_PHASE2[semi2Id] || null,
  };
  [semi1, semi2].forEach((m) => {
    refs.semisEl.appendChild(m.a && m.b ? createMatchCard(m, { allowDraw: false }) : placeholderCard(t("waiting_group_stage")));
  });

  // --- final ---
  refs.finalEl.innerHTML = "";
  const r1 = getResult(semi1);
  const r2 = getResult(semi2);
  const winner1 = r1 && r1.scoreA != null && r1.scoreA !== r1.scoreB ? (r1.scoreA > r1.scoreB ? semi1.a : semi1.b) : null;
  const winner2 = r2 && r2.scoreA != null && r2.scoreA !== r2.scoreB ? (r2.scoreA > r2.scoreB ? semi2.a : semi2.b) : null;
  const finalId = `${cupKey}-final`;
  const finalMatch = { id: finalId, a: winner1, b: winner2, official: OFFICIAL_PHASE2[finalId] || null };

  if (!winner1 || !winner2) {
    refs.finalEl.appendChild(placeholderCard(t("waiting_semis")));
    refs.championEl.hidden = true;
  } else {
    refs.finalEl.appendChild(createMatchCard(finalMatch, { allowDraw: false }));
    const rf = getResult(finalMatch);
    if (rf && rf.scoreA != null && rf.scoreA !== rf.scoreB) {
      const championId = rf.scoreA > rf.scoreB ? finalMatch.a : finalMatch.b;
      const champ = TEAMS_BY_ID[championId];
      refs.championEl.hidden = false;
      refs.championEl.innerHTML = `<img src="${champ.logo}" class="champion-logo" alt=""><div class="champion-text">${t("champion_of", t(titleKey))}<br><strong>${champ.name}</strong></div>`;
    } else {
      refs.championEl.hidden = true;
    }
  }
}

// Preserva o foco/cursor de um <input> de placar entre um renderAll() e o
// seguinte - sem isso, cada tecla digitada reconstroi o DOM e tira o foco
// do campo, obrigando a pessoa a clicar de novo a cada digito.
function captureFocus() {
  const active = document.activeElement;
  if (!active || !active.classList || !active.classList.contains("score-input")) return null;
  const card = active.closest("[data-match-id]");
  if (!card) return null;
  return {
    matchId: card.dataset.matchId,
    side: active.dataset.side,
    selStart: active.selectionStart,
    selEnd: active.selectionEnd,
  };
}

function restoreFocus(info) {
  if (!info) return;
  const card = document.querySelector(`[data-match-id="${info.matchId}"]`);
  const input = card && card.querySelector(`[data-side="${info.side}"]`);
  if (!input) return;
  input.focus();
  try { input.setSelectionRange(info.selStart, info.selEnd); } catch (e) { /* tipo number nem sempre suporta */ }
}

function renderAll() {
  SIM = loadSim();
  const focusInfo = captureFocus();

  // --- ultima rodada ---
  const round7Container = document.getElementById("round7-matches");
  round7Container.innerHTML = "";
  ROUND7_MATCHES.forEach((m) => round7Container.appendChild(createMatchCard(m, { dateLabel: t("last_round_date_label"), allowDraw: true, showBonus: true })));

  const round7Done = ROUND7_MATCHES.filter((m) => getResult(m)).length;
  const round7Complete = round7Done === ROUND7_MATCHES.length;

  const acc = computeStandings(BASE_STANDINGS, ROUND7_MATCHES);
  const rowsMain = toRows(acc, TEAMS, mainTableH2H);

  const hint = document.getElementById("tabela-hint");
  hint.textContent = round7Complete ? t("hint_complete") : t("hint_incomplete");

  renderMainTable(document.getElementById("tabela-principal"), rowsMain, round7Complete ? 4 : null);

  const oroTeams = round7Complete ? rowsMain.slice(0, 4).map((r) => r.id) : null;
  const desTeams = round7Complete ? rowsMain.slice(4, 8).map((r) => r.id) : null;

  renderCup(
    "oro",
    oroTeams,
    {
      groupEl: document.getElementById("oro-groupstage"),
      semisEl: document.getElementById("oro-semis"),
      finalEl: document.getElementById("oro-final"),
      championEl: document.getElementById("oro-champion"),
    },
    "cup_oro_title"
  );

  renderCup(
    "des",
    desTeams,
    {
      groupEl: document.getElementById("des-groupstage"),
      semisEl: document.getElementById("des-semis"),
      finalEl: document.getElementById("des-final"),
      championEl: document.getElementById("des-champion"),
    },
    "cup_des_title"
  );

  restoreFocus(focusInfo);
}

document.addEventListener("DOMContentLoaded", () => {
  renderAll();
  document.getElementById("reset-sim").addEventListener("click", () => {
    if (!confirm(t("reset_confirm"))) return;
    localStorage.removeItem(STORE_KEY);
    SIM = {};
    renderAll();
  });
});
