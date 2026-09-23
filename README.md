# Torneo Clausura 2026 — Primera División URP

Site estático (sem build, sem backend) para acompanhar a classificação do
Torneo Clausura 2026 da Primera División de rugby do Paraguai (URP —
[Unión de Rugby del Paraguay](https://es.wikipedia.org/wiki/Uni%C3%B3n_de_Rugby_del_Paraguay)).

Site não oficial, feito por torcedores.

## O que o site faz

- Mostra a classificação atual (após 6 rodadas), com os dados oficiais da
  planilha da URP.
- Deixa qualquer visitante preencher os placares da última rodada da fase
  classificatória para **simular** quem avançaria para a Taça Oro (1º–4º) e a
  Taça Desarrollo (5º–8º). Esses placares ficam salvos só no navegador de cada
  pessoa (`localStorage`) — não são compartilhados com ninguém.
- A partir da classificação final, monta automaticamente o chaveamento da fase
  final: grupo de todos-contra-todos (3 rodadas: 03/10, 10/10, 17/10),
  semifinal (24/10) e final (31/10), para as duas taças.

## Como atualizar com resultados OFICIAIS

Os dados ficam em [`data.js`](data.js). Para tornar um resultado oficial
(deixa de ser editável pelos visitantes e passa a valer para todo mundo):

1. **Última rodada da fase classificatória** — edite o jogo correspondente em
   `ROUND7_MATCHES` e preencha o campo `official`:

   ```js
   { id: "r7-1", a: "cristo-rey", b: "asuncion", official: { scoreA: 20, scoreB: 15 } }
   ```

2. **Fase de grupos, semifinal e final das taças** — adicione a entrada em
   `OFFICIAL_PHASE2`, usando o id do jogo (visível no HTML como
   `data-match-id`, ou dedutível pelo padrão abaixo):

   ```js
   const OFFICIAL_PHASE2 = {
     "oro-r1-m1": { scoreA: 24, scoreB: 10 },
     "oro-semi-1": { scoreA: 18, scoreB: 15 },
     "oro-final": { scoreA: 22, scoreB: 19 },
   };
   ```

   Padrão dos ids: `<oro|des>-r<1|2|3>-m<1|2>` para a fase de grupos,
   `<oro|des>-semi-<1|2>` para a semifinal, `<oro|des>-final` para a final.

3. Publique (`git add`, `git commit`, `git push`) — o GitHub Pages atualiza em
   1–2 minutos.

Confrontos diretos conhecidos das 6 primeiras rodadas (usados como 1º
critério de desempate, antes da diferença de pontos) ficam em
`HEAD_TO_HEAD_WINNERS`, também em `data.js`.

## Estrutura

```
index.html   estrutura da página
style.css    visual (cores da URP), com tema claro/escuro
i18n.js      traduções (ES padrão, PT, EN) e alternância de tema
data.js      dados: times, classificação base, jogos, resultados oficiais, confrontos diretos
app.js       lógica de classificação, simulação e renderização
assets/logos/  escudos dos clubes e da URP
```

Sem dependências externas, sem build. Basta abrir `index.html` num servidor
estático (ou GitHub Pages).

## Fórmula de pontuação

`Pontos = 4 × vitórias + 2 × empates + pontos-bônus`, igual à planilha oficial.
O bônus tem duas partes:

- **Defensivo** — perder por menos de 7 pontos dá 1 ponto-bônus. Calculado
  automaticamente a partir do placar preenchido, sem precisar de nada extra.
- **Ofensivo** — vencer marcando 4 tries a mais que o adversário dá 1
  ponto-bônus. Isso não dá pra derivar só do placar final (não coletamos
  quantos tries cada time marcou), então cada jogo tem um checkbox "+ bônus
  ataque" opcional por time, pra quem souber marcar.

## Critérios de desempate

Pontos → confronto direto (`HEAD_TO_HEAD_WINNERS`, ou o resultado do próprio
jogo quando as duas equipes se enfrentaram na rodada/grupo em questão) →
diferença de pontos → pontos a favor → ordem alfabética.
