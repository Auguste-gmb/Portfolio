// Graphe : animation de Dijkstra (exploration, puis tracé du plus court chemin)
{
  const EDGES = [["A", "B", 4], ["A", "E", 3], ["B", "C", 5], ["B", "F", 6], ["C", "D", 3], ["C", "F", 2], ["C", "G", 4], ["D", "G", 5], ["E", "F", 7], ["E", "H", 4], ["E", "I", 5], ["F", "I", 3], ["F", "J", 6], ["F", "G", 5], ["G", "K", 3], ["G", "J", 4], ["H", "I", 4], ["H", "L", 5], ["I", "J", 3], ["I", "L", 6], ["I", "M", 5], ["J", "K", 4], ["J", "M", 3], ["K", "N", 4], ["L", "M", 4], ["M", "N", 5]];
  const svg = document.getElementById("graph");
  const adj = {};
  EDGES.forEach(([a, b, w]) => { (adj[a] ||= []).push([b, w]); (adj[b] ||= []).push([a, w]); });
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wait = ms => new Promise(r => setTimeout(r, still ? 0 : ms));
  const $n = k => svg.querySelector(`[data-n="${k}"]`);
  let run = 0;

  function dijkstra(src) {
    const dist = { [src]: 0 }, prev = {}, done = new Set(), order = [];
    while (true) {
      let u = null;
      for (const k in dist) if (!done.has(k) && (u === null || dist[k] < dist[u])) u = k;
      if (u === null) break;
      done.add(u); order.push(u);
      for (const [v, w] of adj[u]) if (!(v in dist) || dist[u] + w < dist[v]) { dist[v] = dist[u] + w; prev[v] = u; }
    }
    return { dist, prev, order };
  }

  async function play(dst) {
    const id = ++run, { dist, prev, order } = dijkstra("A");
    const path = [dst]; while (path[0] !== "A") path.unshift(prev[path[0]]);
    svg.querySelectorAll(".nd").forEach(g => g.classList.remove("seen", "on", "end"));
    svg.querySelectorAll(".hot").forEach(p => p.classList.remove("anim", "drawn"));
    svg.querySelectorAll(".w").forEach(w => w.classList.remove("hotw"));
    document.getElementById("dst").textContent = dst;
    document.getElementById("cost").textContent = "coût = …";
    // 1. exploration : les nœuds sont visités dans l'ordre de Dijkstra
    for (const k of order) {
      if (id !== run) return;
      $n(k).classList.add("seen");
      if (k === dst) break;
      await wait(110);
    }
    await wait(250);
    // 2. tracé du chemin, segment par segment
    $n("A").classList.add("end");
    for (let i = 0; i < path.length - 1; i++) {
      if (id !== run) return;
      const a = path[i], b = path[i + 1];
      const seg = svg.querySelector(`.hot[data-e="${a}${b}"]`);
      seg.getBoundingClientRect();
      seg.classList.add("anim", "drawn");
      (svg.querySelector(`[data-w="${a}${b}"]`) || svg.querySelector(`[data-w="${b}${a}"]`)).classList.add("hotw");
      await wait(380);
      $n(b).classList.add(b === dst ? "end" : "on");
    }
    document.getElementById("cost").textContent = "coût = " + dist[dst];
  }

  // Survol : arêtes voisines mises en avant + aperçu du chemin depuis A
  const NS = "http://www.w3.org/2000/svg";
  const prev = document.createElementNS(NS, "g"); prev.setAttribute("class", "prev");
  svg.querySelector(".hots").after(prev);
  const tipg = document.createElementNS(NS, "g"); tipg.setAttribute("class", "tipg");
  tipg.innerHTML = '<rect class="tipbg" rx="2" height="22"/><text class="tip" y="15"></text>';
  svg.appendChild(tipg);
  const all = sel => svg.querySelectorAll(sel);

  function enter(k) {
    svg.classList.add("hovering");
    const { dist, prev: pv } = dijkstra("A");
    adj[k].forEach(([v]) => {
      $n(v).classList.add("nb");
      all(`.ink .e[data-e="${k}${v}"], .ink .e[data-e="${v}${k}"], [data-w="${k}${v}"], [data-w="${v}${k}"]`).forEach(x => x.classList.add("lit"));
    });
    let html = "", c = k;
    while (c !== "A") { const p = pv[c]; html = `<path d="${svg.querySelector(`.hot[data-e="${p}${c}"]`).getAttribute("d")}"/>` + html; c = p; }
    prev.innerHTML = html;
    // étiquette
    const circ = $n(k).querySelector(".n"), x = +circ.getAttribute("cx"), y = +circ.getAttribute("cy");
    const txt = tipg.querySelector("text"), rect = tipg.querySelector("rect");
    txt.textContent = k === "A" ? "départ" : `A → ${k} · ${dist[k]}`;
    const w = txt.getComputedTextLength() + 16, left = x > 360;
    rect.setAttribute("width", w);
    tipg.setAttribute("transform", `translate(${left ? x - w - 18 : x + 18},${y - 40})`);
    txt.setAttribute("x", 8);
    tipg.classList.add("show");
  }
  function leave() {
    svg.classList.remove("hovering");
    all(".nb").forEach(x => x.classList.remove("nb"));
    all(".lit").forEach(x => x.classList.remove("lit"));
    prev.innerHTML = "";
    tipg.classList.remove("show");
  }

  // Rayon de proximité : les nœuds grossissent à l'approche du curseur,
  // le plus proche dans le rayon devient actif (pas besoin de viser pile dessus)
  const RADIUS = 80;
  const POS = {};
  all(".nd").forEach(g => { const c = g.querySelector(".n"); POS[g.dataset.n] = [+c.getAttribute("cx"), +c.getAttribute("cy")]; });
  const cur = document.createElementNS(NS, "g"); cur.setAttribute("class", "cur");
  cur.innerHTML = `<line/><circle r="${RADIUS}"/><circle class="dot" r="2.5"/>`;
  svg.insertBefore(cur, svg.querySelector(".hots"));
  const line = cur.querySelector("line");
  let active = null;

  const toSvg = e => { const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; return p.matrixTransform(svg.getScreenCTM().inverse()); };
  function nearest(x, y) {
    let best = null, bd = RADIUS;
    for (const k in POS) { const d = Math.hypot(POS[k][0] - x, POS[k][1] - y); if (d < bd) { bd = d; best = k; } }
    return best;
  }
  function setActive(k) {
    if (k === active) return;
    if (active) { $n(active).classList.remove("act"); leave(); }
    active = k;
    svg.classList.toggle("near", !!k);
    if (k) { $n(k).classList.add("act"); enter(k); }
  }

  svg.addEventListener("pointermove", e => {
    if (e.pointerType === "touch") return;
    const { x, y } = toSvg(e);
    cur.classList.add("show");
    cur.querySelectorAll("circle").forEach(c => { c.setAttribute("cx", x); c.setAttribute("cy", y); });
    for (const k in POS) {
      const d = Math.hypot(POS[k][0] - x, POS[k][1] - y);
      $n(k).style.setProperty("--s", (1 + .5 * Math.max(0, 1 - d / RADIUS) ** 2).toFixed(3));
    }
    const k = nearest(x, y);
    setActive(k);
    line.classList.toggle("on", !!k);
    if (k) { line.setAttribute("x1", x); line.setAttribute("y1", y); line.setAttribute("x2", POS[k][0]); line.setAttribute("y2", POS[k][1]); }
  });
  svg.addEventListener("pointerleave", () => {
    cur.classList.remove("show");
    for (const k in POS) $n(k).style.removeProperty("--s");
    setActive(null);
  });
  svg.addEventListener("click", e => {
    const { x, y } = toSvg(e), k = nearest(x, y);
    if (k && k !== "A") play(k);
  });

  // Clavier : Tab pour parcourir les nœuds, Entrée pour lancer
  all(".nd").forEach(g => {
    g.addEventListener("focus", () => setActive(g.dataset.n));
    g.addEventListener("blur", () => setActive(null));
    g.addEventListener("keydown", e => { if ((e.key === "Enter" || e.key === " ") && g.dataset.n !== "A") { e.preventDefault(); play(g.dataset.n); } });
  });
  setTimeout(() => play("N"), still ? 0 : 500);
}
