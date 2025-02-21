


const data = {
  works: [],
  categories: []
};

window.addEventListener("DOMContentLoaded", async () => {
  // On récupère les œuvres et les catégories depuis l'API qu'on stocke globalement dans l'objet data.
  data.works = await getWorks();
  data.categories = await getCategories();
  // On affiche les œuvres et les filtres de catégories.
  renderWorks(data.works);
  const token = localStorage.getItem("token");
  if (!token && data.categories.length) {
    renderFilters(data.categories);
    } else {
    renderEditionMode();
  }
});

async function getWorks() {
  // Exemple de gestion d'erreur avec try {} catch {}
  try {
    const response = await fetch("http://localhost:5678/api/works");
    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération des œuvres", error);
    alert("Une erreur est survenue lors de la récupération des œuvres.")
  }
}

async function getCategories() {
  // Exemple de gestion d'erreur avec try {} catch {}
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    // Exemple de gestion d'erreur avec if (response.ok) {} else {} avec une alerte pour l'utilisateur si le code de statut de la réponse n'est pas 200-299.
    if (response.ok) {
      return await response.json();
    } else {
      alert("Une erreur est survenue lors de la récupération des catégories.")
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories", error);
    alert("Une erreur est survenue lors de la récupération des catégories.")
  }
}

/**
* Affiche les filtres de catégories et ajoute les écouteurs d'événements sur chacun d'entre eux.
* @param categories Liste des catégories à afficher en tant que filtres
*/
function renderFilters(categories) {
  const filters = document.querySelector(".filters");
  // Ajoute un bouton pour afficher toutes les œuvres, sans filtre.
  filters.innerHTML = `<button class="filter" data-category-id="0">Tous</button>`;
  // On itère sur les catégories pour afficher un bouton par catégorie.
  categories.forEach(category => {
    filters.innerHTML += `<button class="filter" data-category-id="${category.id}">${category.name}</button>`;
  });
  const buttons = document.querySelectorAll(".filter");
  // On ajoute un écouteur d'événement sur chaque bouton pour filtrer les œuvres.
  buttons.forEach(button => {
    button.addEventListener("click", () => {
      // On récupère l'identifiant de la catégorie à filtrer depuis l'attribut data-category-id du bouton.
      const { categoryId } = button.dataset;
      // On filtre les œuvres en fonction de la catégorie sélectionnée.
      const filteredWorks = filterWorks(data.works, Number(categoryId));
      // On affiche les œuvres filtrées.
      renderWorks(filteredWorks);
    })
  })
}

/**
* Affiche les œuvres dans la galerie
* @param works Liste des œuvres à afficher
*/
function renderWorks(works) {
  console.log("Afficher les œuvres", works);
  const gallery = document.querySelector(".gallery");
  // On vide la galerie avant d'ajouter les nouvelles œuvres.
  gallery.innerHTML = "";
  // On itère sur les œuvres pour afficher une figure par œuvre.
  works.forEach(work => {
    document.querySelector(".gallery").innerHTML += `
    <figure>
      <img src="${work.imageUrl}" alt="${work.title}">
      <figcaption>${work.title}</figcaption>
    </figure>
  `;
  });
}

/**
 * Affiche les œuvres dans la galerie de la modale
 * @param works Liste des œuvres à afficher
 */
function renderWorksInModal(works) {
  const gallery = document.querySelector(".modal-gallery");
  gallery.innerHTML = "";
  // @TODO: Définir le HTML pour chaque élément (incluant la corbeille pour la suppression)
  works.forEach(work => {
    gallery.innerHTML += `
      <div>
        <img class="modal-image" src="${work.imageUrl}">
        <button class="delete" data-id="${work.id}">🗑️</button>
      </div>
  `;
  });
  // Gère la suppression d'une œuvre en cliquant sur la corbeille.
  const buttons = document.querySelectorAll(".delete");
  buttons.forEach((button, index) => {
    button.addEventListener("click", () => {
      deleteWork(Number(button.dataset.id)); // On convertit l'identifiant en nombre avant de le passer à la fonction deleteWork.
    });
  });
}

/**
 * Affiche le mode édition
 */
function renderEditionMode() {
  // const edition = `<button id="edit">Editer</button>`;
  // document.body.innerHTML("afterbegin", edition);
  document.getElementById("project").innerHTML += `<button id="edit"><i class="fa-regular fa-pen-to-square" style="color: black;"></i> modifier</button>`;

  // @TODO : Afficher la bannière en haut de page.
  const banner = `<div class="banner">
    <i class="fa-regular fa-pen-to-square" style="color: #ffffff;"></i>
    <p id="banner-edit"> Mode édition</p>
    </div>`;
  document.body.insertAdjacentHTML("afterbegin", banner);
  // @TODO : Afficher le bouton pour ouvrir la modale au bon emplacement.

  const modal = document.querySelector("#modal");
  const editButton = document.querySelector("#edit");
  const quitButton = document.querySelector("#quit");
  const modalAdd = document.querySelector(".modal-add");
  const addButton = document.querySelector("#add");

  editButton.addEventListener("click", (event) => {
    modal.showModal(); // Affiche la modal
    renderWorksInModal(data.works);
  });
  quitButton.addEventListener("click", (event) => {
    modal.close(); // Ferme la modal
  });
  // addButton.addEventListener("click", (event) => {
  // modalAdd.showModal(); // Affiche la modal
  // });

  // @TODO : Changer le texte "Login" à "Logout" dans le header.
  document.getElementById("login");
  login.innerHTML = "logout";
  login.addEventListener("click", (event) => {
    event.preventDefault();
    localStorage.removeItem("token");
    window.location.reload();
  });

  // Ajuste le style de la page pour laisser de la place pour la bannière en haut de page.
  document.body.style.marginTop = "59px";
}

/**
* Filtrer les œuvres par catégorie.
* @param works Liste des œuvres à filtrer
* @param categoryId Identifiant de la catégorie à utiliser pour le filtrage
* @returns {[]} Liste des œuvres filtrées
*/
function filterWorks(works, categoryId) {
  if (categoryId === 0) {
    return works;
  }
  return works.filter(work => work.categoryId === categoryId);
}

async function deleteWork(id) {
  try {
    // Envoi d'une requête à l'API pour supprimer une oeuvre à partir de son identifiant :
    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
      method: "DELETE",
      headers: {
        // Ajout du jeton d'authentification dans les headers de la requête :
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    });
    // Si la réponse n'est pas OK (status différent de 200-299)
    if (!response.ok) {
      if (response.status === 401) {
        alert("Vous n'êtes pas autorisé à supprimer cette œuvre.");
      } else {
        throw new Error("Une erreur inconnue est survenue.");
      }
    } else {
      data.works = data.works.filter(work => work.id !== id); // On ne garde que les oeuvres dont l'identifiant est différent de celui à supprimer.
      renderWorks(data.works); // On réaffiche les oeuvres après la suppression.
      renderWorksInModal(data.works); // On réaffiche les oeuvres dans la modale après la suppression.
    }
  } catch (error) {
    console.error("Erreur lors de la suppression de l'œuvre", error);
    alert("Une erreur est survenue lors de la suppression de l'œuvre.")
  }
}

/**
 * Affiche le formulaire d'ajout d'une œuvre.
 */
function renderAddWorkModal() {
  const modalAdd = document.querySelector(".modal-add");
  const formHtml = `
    <form id="add-work-form">
      <label for="image">Image</label>
      <input type="file" id="image" name="image" accept="image/*" required>

      <label for="title">Titre</label>
      <input type="text" id="title" name="title" required>

      <label for="category">Catégorie</label>
      <select id="category" name="category" required>
        ${data.categories.map(
          (category) => `<option value="${category.id}">${category.name}</option>`
        ).join("")}
      </select>

      <button type="submit">Ajouter</button>
    </form>
  `;
  modalAdd.innerHTML = formHtml;

  const addWorkForm = document.getElementById("add-work-form");
  addWorkForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await addWork();
  });
}

/**
 * Ajoute une nouvelle œuvre.
 */
async function addWork() {
  const form = document.getElementById("add-work-form");
  const formData = new FormData(form);
  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: formData,
    });

    if (response.ok) {
      const newWork = await response.json();
      data.works.push(newWork); // Ajoute l'œuvre au tableau global.
      renderWorks(data.works); // Met à jour la galerie principale.
      renderWorksInModal(data.works); // Met à jour la galerie de la modale.
      document.querySelector("#add-work-form").reset(); // Réinitialise le formulaire.
      document.querySelector("#modal-add").close(); // Ferme la modale.
      alert("Œuvre ajoutée avec succès !");
    } else {
      alert("Erreur lors de l'ajout de l'œuvre.");
    }
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'œuvre", error);
    alert("Une erreur est survenue.");
  }
}

// Intégrer l'appel de la deuxième modale dans le bouton.
document.getElementById("add").addEventListener("click", () => {
  renderAddWorkModal();
  document.querySelector(".modal-add").showModal(); // Ouvre la modale.
});

// @TODO: Cacher l'input file et afficher l'encadré d'ajout d'une photo (en tant que label pour déclencher l'input file).
// @TODO: (A vérifier) Vérifier la taille de l'image avant de l'envoyer à l'API.
// @TODO: Refaire tout le style, et mieux gérer l'affichage des modales.
