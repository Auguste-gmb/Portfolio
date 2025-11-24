const canvas = document.getElementById("network-bg");
if (canvas) {
	const ctx = canvas.getContext("2d");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	let mouse = { x: null, y: null, radius: 200 };

	function handleMouse(e) {
		mouse.x = e.clientX;
		mouse.y = e.clientY;
	}

	window.addEventListener("mousemove", handleMouse);

	let nodes = [];
	const NUM_NODES = 50;
	const MAX_DISTANCE = 200;

	for (let i = 0; i < NUM_NODES; i++) {
		nodes.push({
			x: Math.random() * canvas.width,
			y: Math.random() * canvas.height,
			vx: (Math.random() - 0.5) * 0.6,
			vy: (Math.random() - 0.5) * 0.6,
		});
	}

	let animationId;

	function animate() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		nodes.forEach((n) => {
			if (mouse.x !== null) {
				const dx = mouse.x - n.x;
				const dy = mouse.y - n.y;
				const dist = Math.sqrt(dx * dx + dy * dy);

				if (dist < mouse.radius) {
					n.x -= (dx / dist) * 0.5;
					n.y -= (dy / dist) * 0.5;
				}
			}
			n.x += n.vx;
			n.y += n.vy;
			if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
			if (n.y < 0 || n.y > canvas.height) n.vy *= -1;

			ctx.fillStyle = "rgba(107, 107, 255, 0.9)";
			ctx.beginPath();
			ctx.arc(n.x, n.y, 3, 0, Math.PI * 2);
			ctx.fill();
		});

		for (let i = 0; i < NUM_NODES; i++) {
			for (let j = i + 1; j < NUM_NODES; j++) {
				const dx = nodes[i].x - nodes[j].x;
				const dy = nodes[i].y - nodes[j].y;
				const dist = Math.sqrt(dx * dx + dy * dy);

				if (dist < MAX_DISTANCE) {
					const mDx = (nodes[i].x + nodes[j].x) / 2 - mouse.x;
					const mDy = (nodes[i].y + nodes[j].y) / 2 - mouse.y;
					const mDist = Math.sqrt(mDx * mDx + mDy * mDy);

					const highlight = Math.max(0, 1 - mDist / 250);

					ctx.strokeStyle = `rgba(107, 107, 255, ${
						(1 - dist / MAX_DISTANCE) * (0.3 + highlight)
					})`;
					ctx.lineWidth = 1;
					ctx.beginPath();
					ctx.moveTo(nodes[i].x, nodes[i].y);
					ctx.lineTo(nodes[j].x, nodes[j].y);
					ctx.stroke();
				}
			}
		}

		animationId = requestAnimationFrame(animate);
	}

	animate();

	window.addEventListener("resize", () => {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	});

	// Nettoyer quand la page est changée (optionnel si SPA)
	window.addEventListener("beforeunload", () => {
		cancelAnimationFrame(animationId);
		window.removeEventListener("mousemove", handleMouse);
	});
}
