const contactForm = document.getElementById("contactForm");

contactForm.addEventListener("submit", (e) => {
	e.preventDefault();

	const name = contactForm.name.value;
	const email = contactForm.email.value;
	const message = contactForm.message.value;

	// Ici tu peux envoyer vers un serveur ou API
	//alert(`Merci ${name}, votre message a été envoyé !\n\nMessage: ${message}`);

	contactForm.reset();
});

/* 

const contactForm = document.getElementById("contactForm");

contactForm.addEventListener("submit", (e) => {
	e.preventDefault();

	const name = contactForm.name.value;
	const email = contactForm.email.value;
	const message = contactForm.message.value;

	// Préparer les variables pour EmailJS
	const templateParams = {
		from_name: name,
		from_email: email,
		message: message
	};

	emailjs.send("TON_SERVICE_ID", "TON_TEMPLATE_ID", templateParams)
		.then((response) => {
			alert("Merci ! Votre message a été envoyé ✅");
			contactForm.reset();
			console.log("SUCCESS!", response.status, response.text);
		}, (error) => {
			alert("Oups… une erreur est survenue ❌");
			console.log("FAILED...", error);
		});
});


*/
