const canvas = document.getElementById("skills-canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const mouse = { x: null, y: null, radius: 150 };
window.addEventListener("mousemove", (e) => {
	mouse.x = e.clientX;
	mouse.y = e.clientY;
});

// Compétences avec icônes FA et niveau (pour taille)
const nodes = [
	{ x: 100, y: 100, icon: "fa-html5", level: 90, color: "#e34c26" },
	{ x: 300, y: 120, icon: "fa-css3-alt", level: 85, color: "#264de4" },
	{ x: 200, y: 250, icon: "fa-js", level: 80, color: "#f0db4f" },
	{ x: 400, y: 300, icon: "fa-python", level: 75, color: "#306998" },
	{ x: 250, y: 400, icon: "fa-github", level: 70, color: "#fff" },
	{ x: 550, y: 200, icon: "fa-database", level: 70, color: "#4db8ff" },
];

// Vitesse aléatoire
nodes.forEach((n) => {
	n.vx = (Math.random() - 0.5) * 0.5;
	n.vy = (Math.random() - 0.5) * 0.5;
});

// Conversion icône FA en code Unicode
const faMap = {
	"fa-html5": "\uf13b",
	"fa-css3-alt": "\uf38b",
	"fa-js": "\uf3b8",
	"fa-python": "\uf3e2",
	"fa-github": "\uf09b",
	"fa-database": "\uf1c0",
};

function drawNode(n) {
	ctx.font = `${2 + n.level / 20}rem "Font Awesome 6 Brands"`;
	ctx.fillStyle = n.color;
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText(faMap[n.icon], n.x, n.y);
}

function animate() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Lignes entre nodes proches
	for (let i = 0; i < nodes.length; i++) {
		for (let j = i + 1; j < nodes.length; j++) {
			const dx = nodes[i].x - nodes[j].x;
			const dy = nodes[i].y - nodes[j].y;
			const dist = Math.sqrt(dx * dx + dy * dy);
			if (dist < 250) {
				const mDx = (nodes[i].x + nodes[j].x) / 2 - mouse.x;
				const mDy = (nodes[i].y + nodes[j].y) / 2 - mouse.y;
				const mDist = Math.sqrt(mDx * mDx + mDy * mDy);
				const highlight = Math.max(0, 1 - mDist / 200);
				ctx.strokeStyle = `rgba(107,107,255,${
					(1 - dist / 250) * 0.3 + highlight * 0.7
				})`;
				ctx.lineWidth = 1;
				ctx.beginPath();
				ctx.moveTo(nodes[i].x, nodes[i].y);
				ctx.lineTo(nodes[j].x, nodes[j].y);
				ctx.stroke();
			}
		}
	}

	// Déplacement
	nodes.forEach((n) => {
		n.x += n.vx;
		n.y += n.vy;

		if (mouse.x && mouse.y) {
			const dx = n.x - mouse.x;
			const dy = n.y - mouse.y;
			const dist = Math.sqrt(dx * dx + dy * dy);
			if (dist < mouse.radius) {
				n.x += (dx / dist) * 0.5;
				n.y += (dy / dist) * 0.5;
			}
		}

		// Rebond
		if (n.x < 50 || n.x > canvas.width - 50) n.vx *= -1;
		if (n.y < 50 || n.y > canvas.height - 50) n.vy *= -1;

		drawNode(n);
	});

	requestAnimationFrame(animate);
}
animate();

window.addEventListener("resize", () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
});
