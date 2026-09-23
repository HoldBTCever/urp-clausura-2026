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
function setSimResult(matchId, a, b, scoreA, scoreB) {
  if (scoreA == null && scoreB == null) {
    delete SIM[matchId];
  } else {
    SIM[matchId] = { sig: a + "|" + b, scoreA, scoreB };
  }
  saveSim();
}

// Resultado efetivo de um jogo: oficial tem prioridade sobre a simulacao do visitante.
function getResult(match) {
  if (match.official && match.official.scoreA != null) {
    return match.official;
  }
  if (!match.a || !match.b) return null;
  const sig = match.a + "|" + match.b;
  const s = SIM[match.id];
  if (s && s.sig === sig) return s;
  return null;
}

function isOfficial(match) {
  return !!(match.official && match.official.scoreA != null);
}

function zeroBase(ids) {
  const out = {};
  ids.forEach((id) => (out[id] = { pj: 0, pg: 0, pe: 0, pp: 0, bonus: 0, favor: 0, contra: 0 }));
  return out;
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
    A.pj++; B.pj++;
    A.favor += r.scoreA; A.contra += r.scoreB;
    B.favor += r.scoreB; B.contra += r.scoreA;
    if (r.scoreA > r.scoreB) { A.pg++; B.pp++; }
    else if (r.scoreA < r.scoreB) { B.pg++; A.pp++; }
    else { A.pe++; B.pe++; }
  });
  return acc;
}

function toRows(acc, teams) {
  return teams
    .map((t) => {
      const s = acc[t.id] || { pj: 0, pg: 0, pe: 0, pp: 0, bonus: 0, favor: 0, contra: 0 };
      const pts = 4 * s.pg + 2 * s.pe + s.bonus;
      return { ...t, ...s, pts, dif: s.favor - s.contra };
    })
    .sort((x, y) => y.pts - x.pts || y.dif - x.dif || y.favor - x.favor || x.name.localeCompare(y.name));
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
      <th>#</th><th>Clube</th><th title="Jogos">PJ</th><th title="Vitorias">PG</th><th title="Empates">PE</th><th title="Derrotas">PP</th>
      <th title="Pontos bonus">Bonus</th><th title="Pontos">Pts</th><th title="Pontos a favor">A favor</th><th title="Pontos em contra">Contra</th><th title="Diferenca">Dif</th>
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
      html += `<tr class="split-row"><td colspan="11">🏆 Zona Taça Oro (1º–${splitAfter}º) &nbsp;·&nbsp; 🥈 Zona Taça Desarrollo (${splitAfter + 1}º–${rows.length}º)</td></tr>`;
    }
  });
  html += "</tbody></table>";
  el.innerHTML = html;
}

function renderMiniTable(rows) {
  const wrap = document.createElement("div");
  wrap.className = "table-scroll";
  let html = `<table class="standings mini"><thead><tr>
      <th>#</th><th>Clube</th><th>PJ</th><th>PG</th><th>PE</th><th>PP</th><th>Pts</th><th>Dif</th>
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
  if (!teamA || !teamB) return placeholderCard("Aguardando definição dos times");

  const result = getResult(match) || {};
  const official = isOfficial(match);
  const locked = official;

  const wrap = document.createElement("div");
  wrap.className = "match-card" + (official ? " official" : "");
  wrap.dataset.matchId = match.id;
  wrap.innerHTML = `
    ${opts.dateLabel ? `<div class="match-date">${opts.dateLabel}${official ? ' · <span class="tag-oficial">oficial</span>' : ""}</div>` : ""}
    <div class="match-teams">
      <div class="match-team">
        <img src="${teamA.logo}" class="match-logo" alt="">
        <span>${teamA.name}</span>
      </div>
      <div class="match-score">
        <input type="number" min="0" inputmode="numeric" class="score-input" data-side="a" ${locked ? "disabled" : ""} value="${result.scoreA ?? ""}" placeholder="–">
        <span class="x">x</span>
        <input type="number" min="0" inputmode="numeric" class="score-input" data-side="b" ${locked ? "disabled" : ""} value="${result.scoreB ?? ""}" placeholder="–">
      </div>
      <div class="match-team">
        <span>${teamB.name}</span>
        <img src="${teamB.logo}" class="match-logo" alt="">
      </div>
    </div>
    <p class="draw-warning" hidden>Esta fase é eliminatória — não pode terminar empatada, ajuste o placar.</p>
  `;

  if (!locked) {
    const inputA = wrap.querySelector('[data-side="a"]');
    const inputB = wrap.querySelector('[data-side="b"]');
    const warn = wrap.querySelector(".draw-warning");
    const onChange = () => {
      const a = inputA.value;
      const b = inputB.value;
      const scoreA = a === "" ? null : Math.max(0, parseInt(a, 10) || 0);
      const scoreB = b === "" ? null : Math.max(0, parseInt(b, 10) || 0);
      if (scoreA != null && scoreB != null && scoreA === scoreB && !opts.allowDraw) {
        warn.hidden = false;
        setSimResult(match.id, match.a, match.b, null, null);
        renderAll();
        return;
      }
      warn.hidden = true;
      setSimResult(match.id, match.a, match.b, scoreA, scoreB);
      renderAll();
    };
    inputA.addEventListener("input", onChange);
    inputB.addEventListener("input", onChange);
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

function renderCup(cupKey, seedIds, refs, title) {
  // --- fase de grupos ---
  const rounds = buildGroupRounds(cupKey, seedIds);
  refs.groupEl.innerHTML = "";
  rounds.forEach((round, idx) => {
    const block = document.createElement("div");
    block.className = "round-block";
    block.innerHTML = `<h4>Rodada ${idx + 1} <span class="date">${formatDate(round.date)}</span></h4>`;
    const grid = document.createElement("div");
    grid.className = "matches-grid";
    round.matches.forEach((m) => {
      grid.appendChild(m.a && m.b ? createMatchCard(m, { allowDraw: true }) : placeholderCard("Aguardando definição da última rodada"));
    });
    block.appendChild(grid);
    refs.groupEl.appendChild(block);
  });

  const allGroupMatches = rounds.flatMap((r) => r.matches);
  let groupRows = null;
  if (seedIds) {
    const acc = computeStandings(zeroBase(seedIds), allGroupMatches);
    groupRows = toRows(acc, seedIds.map((id) => TEAMS_BY_ID[id]));
    const tblWrap = document.createElement("div");
    tblWrap.className = "group-table-wrap";
    tblWrap.innerHTML = "<h4>Classificação do grupo</h4>";
    tblWrap.appendChild(renderMiniTable(groupRows));
    refs.groupEl.appendChild(tblWrap);
  } else {
    const note = document.createElement("p");
    note.className = "hint";
    note.textContent = "Os confrontos aparecem aqui assim que a última rodada da fase classificatória for definida.";
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
    refs.semisEl.appendChild(m.a && m.b ? createMatchCard(m, { allowDraw: false }) : placeholderCard("Aguardando fim da fase de grupos"));
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
    refs.finalEl.appendChild(placeholderCard("Aguardando resultado das semifinais"));
    refs.championEl.hidden = true;
  } else {
    refs.finalEl.appendChild(createMatchCard(finalMatch, { allowDraw: false }));
    const rf = getResult(finalMatch);
    if (rf && rf.scoreA != null && rf.scoreA !== rf.scoreB) {
      const championId = rf.scoreA > rf.scoreB ? finalMatch.a : finalMatch.b;
      const champ = TEAMS_BY_ID[championId];
      refs.championEl.hidden = false;
      refs.championEl.innerHTML = `<img src="${champ.logo}" class="champion-logo" alt=""><div class="champion-text">Campeão ${title}<br><strong>${champ.name}</strong></div>`;
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
  ROUND7_MATCHES.forEach((m) => round7Container.appendChild(createMatchCard(m, { dateLabel: "Última rodada", allowDraw: true })));

  const round7Done = ROUND7_MATCHES.filter((m) => getResult(m)).length;
  const round7Complete = round7Done === ROUND7_MATCHES.length;

  const acc = computeStandings(BASE_STANDINGS, ROUND7_MATCHES);
  const rowsMain = toRows(acc, TEAMS);

  const hint = document.getElementById("tabela-hint");
  hint.textContent = round7Complete
    ? "Classificação final da fase classificatória (considerando os placares preenchidos abaixo)."
    : `Classificação após 6 rodadas. Faltam ${ROUND7_MATCHES.length - round7Done} jogo(s) da última rodada — preencha abaixo para simular quem avança para cada taça.`;

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
    "Taça Oro"
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
    "Taça Desarrollo"
  );

  restoreFocus(focusInfo);
}

document.addEventListener("DOMContentLoaded", () => {
  renderAll();
  document.getElementById("reset-sim").addEventListener("click", () => {
    if (!confirm("Limpar todos os placares que você preencheu neste navegador?")) return;
    localStorage.removeItem(STORE_KEY);
    SIM = {};
    renderAll();
  });
});
