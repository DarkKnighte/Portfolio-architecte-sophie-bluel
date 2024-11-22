const data = {
    works: [],
    categories: []
  }
  
  window.addEventListener("DOMContentLoaded", async () => {
    data.works = await getWorks();
    // @TODO: Créer une fonction de récupération des catégories.
    // data.categories = await getCategories();
    renderWorks(data.works);
    // Afficher les filtres de catégorie.
    // renderFilters(data.categories);
  })
  
  async function getWorks() {
    const response= await fetch("http://localhost:5678/api/works");
    return await response.json();
  }
  
  function renderWorks(works) {
    const gallery = document.querySelector(".gallery");
    // @TODO : Boucler sur les works pour les afficher dans la galerie.
  }
  
  // @TODO: Créer une fonction de filtrage des works par catégorie.
  // @TODO: Associer un évènement à chaque filtre pour filtrer les works lorsqu'on clique dessus.