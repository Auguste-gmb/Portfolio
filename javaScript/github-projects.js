// Sélectionne la grille où afficher les projets
const projectsGrid = document.querySelector(".projects-grid");

// Ton nom d'utilisateur GitHub
const githubUsername = "Auguste-gmb";

// Liste des repos à ne pas afficher
const excludeRepos = [githubUsername];

// Fonction pour récupérer les repos
async function fetchGitHubProjects() {
	try {
		const response = await fetch(
			`https://api.github.com/users/${githubUsername}/repos?sort=updated`
		);
		const repos = await response.json();

		// Filtrer les forks et les repos exclus
		const userRepos = repos.filter(
			(repo) => !repo.fork && !excludeRepos.includes(repo.name)
		);

		for (const repo of userRepos) {
			const card = document.createElement("div");
			card.classList.add("project-card");

			// Récupérer tous les langages du repo
			const langResponse = await fetch(
				`https://api.github.com/repos/${githubUsername}/${repo.name}/languages`
			);
			const languages = await langResponse.json();

			// Créer des tags pour chaque langage
			const tags = Object.keys(languages)
				.map((lang) => `<span>${lang}</span>`)
				.join(" ");

			card.innerHTML = `
                <h2>${repo.name}</h2>
                <p>${
					repo.description
						? repo.description
						: "Aucune description fournie."
				}</p>
                <div class="tags">
                    ${tags}
                </div>
                <a class="btn" href="${
					repo.html_url
				}" target="_blank">Voir plus</a>
            `;

			projectsGrid.appendChild(card);
		}
	} catch (error) {
		console.error(
			"Erreur lors de la récupération des projets GitHub:",
			error
		);

		const card = document.createElement("div");
		card.classList.add("error-msg");
		card.innerHTML = `
			<h2>ERROR</h2>
			<p>API Request limits</p>
		`;
		projectsGrid.appendChild(card);
	}
}

// Lancer la fonction au chargement
fetchGitHubProjects();
