// Projets GitHub — un seul appel API, mis en cache 1 h (évite la limite de requêtes)
const USER = "Auguste-gmb";
const EXCLUDE = [USER, "Portfolio"];
const FEATURED = ""; // ✏️ nom d'un dépôt à mettre en avant (carte large), ou vide = le plus récent
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const month = d => new Date(d).toLocaleDateString("fr-FR", { month: "short", year: "numeric" });

async function getRepos() {
  const KEY = "ag-repos", now = Date.now();
  try {
    const c = JSON.parse(localStorage.getItem(KEY) || "null");
    if (c && now - c.t < 3600e3) return c.d;
  } catch (e) {}
  const r = await fetch(`https://api.github.com/users/${USER}/repos?sort=updated&per_page=100`);
  if (!r.ok) throw new Error(r.status);
  const d = (await r.json()).filter(x => !x.fork && !EXCLUDE.includes(x.name))
    .map(x => ({ name: x.name, desc: x.description, lang: x.language, url: x.html_url, up: x.pushed_at || x.updated_at }));
  try { localStorage.setItem(KEY, JSON.stringify({ t: now, d })); } catch (e) {}
  return d;
}

function renderProjects(repos) {
  const grid = document.getElementById("grid");
  if (!repos.length) { grid.innerHTML = `<p class="mono">Aucun dépôt public pour l'instant.</p>`; return; }
  let list = [...repos];
  const fi = FEATURED ? list.findIndex(r => r.name === FEATURED) : 0;
  if (fi > 0) list.unshift(list.splice(fi, 1)[0]);
  // Grille de 3 colonnes sans trou : la 1re carte est large si ça tombe juste, sinon la dernière
  const n = list.length, feat = n % 3 !== 0, wideLast = n % 3 === 1 && n > 1;
  grid.innerHTML = list.map((r, i) => `
    <a class="card${i === 0 && feat ? " feat" : ""}${i === n - 1 && wideLast ? " wide" : ""}" href="${esc(r.url)}" target="_blank" rel="noopener">
      <div class="meta mono"><span>N° ${String(i + 1).padStart(2, "0")}</span>${r.lang ? `<span class="lang">${esc(r.lang)}</span>` : ""}</div>
      <h3>${esc(r.name.replace(/[-_]/g, " "))}</h3>
      <p>${esc(r.desc || "Pas encore de description.")}</p>
      <div class="foot mono"><span>${month(r.up)}</span><span class="go">Voir le dépôt →</span></div>
    </a>`).join("");
}

function renderGauge(repos) {
  const counts = {};
  repos.forEach(r => { if (r.lang) counts[r.lang] = (counts[r.lang] || 0) + 1; });
  const rows = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const max = rows.length ? rows[0][1] : 1;
  document.getElementById("gauge").innerHTML = rows.length
    ? rows.map(([l, n]) => `<li><span class="nm">${esc(l)}</span><span class="bar"><i style="width:${Math.max(8, n / max * 100)}%"></i></span><span class="ct">${n}</span></li>`).join("")
    : `<li><span class="nm">—</span><span></span><span></span></li>`;
}

getRepos().then(r => { renderProjects(r); renderGauge(r); }).catch(() => {
  document.getElementById("grid").innerHTML = `
    <a class="card" href="https://github.com/${USER}" target="_blank" rel="noopener">
      <div class="meta mono"><span>N° —</span></div>
      <h3>Projets sur GitHub</h3>
      <p>Impossible de charger la liste pour le moment. Tous mes dépôts sont visibles directement sur GitHub.</p>
      <div class="foot mono"><span>github.com/${USER}</span><span class="go">Ouvrir →</span></div>
    </a>`;
  document.getElementById("gauge").innerHTML = `<li><span class="nm">—</span><span class="mono" style="grid-column:span 2;color:var(--mute)">Indisponible</span></li>`;
});
