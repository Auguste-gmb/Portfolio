document.addEventListener("DOMContentLoaded", function () {
	const menuBtn = document.getElementById("menu-btn");
	const navMenu = document.getElementById("nav-menu");

	if (!menuBtn || !navMenu) return;

	function openMenu() {
		menuBtn.classList.add("active");
		navMenu.classList.add("active");
		menuBtn.setAttribute("aria-expanded", "true");
		navMenu.setAttribute("aria-hidden", "false");
		document.body.classList.add("nav-open");
	}

	function closeMenu() {
		menuBtn.classList.remove("active");
		navMenu.classList.remove("active");
		menuBtn.setAttribute("aria-expanded", "false");
		navMenu.setAttribute("aria-hidden", "true");
		document.body.classList.remove("nav-open");
	}

	menuBtn.addEventListener("click", function () {
		if (navMenu.classList.contains("active")) closeMenu();
		else openMenu();
	});

	// fermer le menu si on clique sur un lien
	navMenu.addEventListener("click", function (e) {
		if (e.target.tagName === "A") closeMenu();
	});

	// fermer avec ESC
	document.addEventListener("keydown", function (e) {
		if (e.key === "Escape" && navMenu.classList.contains("active"))
			closeMenu();
	});
});
