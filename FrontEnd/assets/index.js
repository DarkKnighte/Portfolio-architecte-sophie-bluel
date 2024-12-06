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
  if (!token) {
    renderFilters(data.categories);
  } else {
    // @TODO : Afficher l'interface en mode connecté.
    renderFilters(data.categories);
  }
});

async function getWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  return await response.json();
}

async function getCategories() {
  const response = await fetch("http://localhost:5678/api/categories");
  return await response.json();
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
