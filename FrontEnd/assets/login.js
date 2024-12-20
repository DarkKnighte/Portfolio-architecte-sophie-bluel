// @TODO : Créer le formulaire de connexion
// @TODO : Ajouter un écouteur d'événement sur le formulaire pour intercepter la soumission
document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.querySelector("#loginForm");
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    console.log("Formulaire soumis");
  });
});
// Documentation : https://developer.mozilla.org/fr/docs/Web/API/Event/preventDefault
// @TODO : Récupérer les valeurs des champs du formulaire

const email = document.querySelector("#email").value;
const password = document.querySelector("#password").value;

// @TODO : Utiliser l'API Fetch pour envoyer une requête de type POST à l'URL http://localhost:5678/api/users/login avec les données du formulaire
// Documentation : https://developer.mozilla.org/fr/docs/Web/API/Fetch_API/Using_Fetch

fetch(" http://localhost:5500/FrontEnd/login.html", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: email,
    password: password,
  })
});

// @TODO : Afficher un message d'erreur si les identifiants sont incorrects
if (!email || !password) {
    console.error('Votre email ou mot de passe est incorrect');
  }
// @TODO : Obtenir la réponse de l'API et stocker le token dans le localStorage
// Documentation : https://developer.mozilla.org/fr/docs/Web/API/Window/localStorage
// @TODO : Rediriger l'utilisateur vers la page d'accueil
// Documentation : https://developer.mozilla.org/fr/docs/Web/API/Location
