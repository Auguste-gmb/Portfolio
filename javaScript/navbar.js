// Menu mobile
const menuBtn = document.getElementById("menuBtn"), nav = document.getElementById("nav");
menuBtn.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
  menuBtn.textContent = open ? "Fermer" : "Menu";
});
nav.addEventListener("click", e => { if (e.target.tagName === "A") { nav.classList.remove("open"); menuBtn.textContent = "Menu"; menuBtn.setAttribute("aria-expanded", false); } });
