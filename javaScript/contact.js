// Formulaire de contact : envoi Formspree sans quitter la page
{
  const form = document.getElementById("contactForm"), msg = document.getElementById("formMsg");
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const btn = form.querySelector("button");
    btn.disabled = true; msg.className = "form-msg"; msg.textContent = "Envoi…";
    try {
      const r = await fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
      if (!r.ok) throw 0;
      form.reset();
      msg.className = "form-msg ok"; msg.textContent = "Merci ! Votre message a bien été envoyé ✅";
    } catch {
      msg.className = "form-msg err"; msg.textContent = "Oups, l'envoi a échoué. Écrivez-moi à auguste.gambu@viacesi.fr";
    }
    btn.disabled = false;
  });
}
