function animateTimeline() {
	const events = document.querySelectorAll(".timeline-event");
	const triggerBottom = window.innerHeight * 0.85;

	events.forEach((event) => {
		const eventTop = event.getBoundingClientRect().top;
		if (eventTop < triggerBottom) {
			event.classList.add("active");
		}
	});
}

window.addEventListener("scroll", animateTimeline);
window.addEventListener("load", animateTimeline);
