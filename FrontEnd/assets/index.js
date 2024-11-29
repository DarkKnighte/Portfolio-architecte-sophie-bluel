const data = {
    works: [],
    categories: []
  }

  // const title = works.map(work => work.title);
  // const imageUrl = works.map(work => work.imageUrl);
  // const category = works.map(work => work.category);

  function renderCategory(categories) {

  window.addEventListener("DOMContentLoaded", async () => {
    data.works = await getWorks();
    // @TODO: Créer une fonction de récupération des catégories.
    data.categories = await getCategories();
    renderWorks(data.works);
    renderCategory(data.categories);
    // Afficher les filtres de catégorie.
    return data.works, data.categories;
  })
}

  async function getWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    return await response.json();
  }

  async function getCategories() {
    const response = await fetch("http://localhost:5678/api/categories");
    return await response.json();
  }

  function renderWorks(works) {
    const gallery = document.querySelector(".gallery");
    // @TODO : Boucler sur les works pour les afficher dans la galerie.
    works.forEach(work => {
        document.querySelector(".gallery").innerHTML =
            + '<img src="' + work.image + '" alt="' + work.title +'" />'
            + '<h3>' + work.title + '</h3>'
            + '<p>' + work.category + '</p>'
    });
  }

  // @TODO: Créer une fonction de filtrage des works par catégorie.
  const boutonTrier = document.querySelector(".btn-trier");
  // version 1
  boutonTrier.addEventListener("click", function() {
    const works = Array.from(data.works);
    works.sort(function(a, b) {
        return a.title.localeCompare(b.title);
    })
    console.log(works);
});
  // version 2
  // boutonTrier.addEventListener("click", function() {
  //   const works = categories.filter(function (categorie) {
  //     return categorie;
  //   });
  //   console.log(works);
  // });
  // @TODO: Associer un évènement à chaque filtre pour filtrer les works lorsqu'on clique dessus.
