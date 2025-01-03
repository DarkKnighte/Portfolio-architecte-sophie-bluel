// Attend que le DOM soit complètement chargé avant d'exécuter le code
document.addEventListener("DOMContentLoaded", function () {
  // Récupère le formulaire de connexion par son ID
  const loginForm = document.querySelector("#loginForm");

  // Ajoute un écouteur d'événement sur la soumission du formulaire
  loginForm.addEventListener("submit", async function (event) {
    // Empêche le comportement par défaut du formulaire (rechargement de la page)
    event.preventDefault();

    // Récupère les valeurs des champs email et mot de passe
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    // Appelle la fonction de connexion avec ces identifiants
    await login(email, password);
  });
});

// Fonction asynchrone qui gère la connexion
async function login(email, password) {
  // Envoie une requête POST à l'API de connexion
  const response = await fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Spécifie que le corps de la requête est en JSON
    },
    body: JSON.stringify({
      email: email,
      password: password,
    })
  });

  // Si la réponse n'est pas OK (status différent de 200-299)
  if (!response.ok) {
    alert("Votre email ou mot de passe est incorrect");
  }

  // Convertit la réponse en JSON
  const data = await response.json();

  // Stocke le token d'authentification dans le localStorage
  localStorage.setItem("token", data.token);

  // Redirige vers la page d'accueil
  window.location.href = "./index.html";
}
