
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
        <div>@TODO : Afficher l'image pour chaque élément.</div>
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
  // const edition = `<div class="modal">
  //       <h1>Mode édition</h1>
  //       <button id="edit">Editer</button>
  //     </div>`;
  // document.body.insertAdjacentHTML("afterbegin", edition);

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

  editButton.addEventListener("click", (event) => {
    modal.showModal(); // Affiche la modal
    renderWorksInModal(data.works);
  });
  quitButton.addEventListener("click", (event) => {
    modal.close(); // Ferme la modal
  });

  // @TODO : Changer le texte "Login" à "Logout" dans le header.
  document.getElementById("login");
  login.innerHTML = "Logout";
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

function deleteWork(id) {
  // @TODO: Envoyer une requête DELETE à l'API pour supprimer l'œuvre avec l'identifiant id et en utilisant le jeton d'authentification stocké dans le localStorage.
  data.works = data.works.filter(work => work.id !== id); // On ne garde que les oeuvres dont l'identifiant est différent de celui à supprimer.
  renderWorks(data.works); // On réaffiche les oeuvres après la suppression.
  renderWorksInModal(data.works); // On réaffiche les oeuvres dans la modale après la suppression.
}

// @TODO : Revoir le style général.
// @TODO : Mettre en place le mode édition.
