import { elements } from "./helpers.js";

// api'den gelen sonuçları ekrana basar

export const renderResult = (recipes) => {
  console.log(recipes);
  // her bir obje için ekrana sonuç basma
  recipes.slice(0, 10).forEach((recipe) => {
    // kart için html hazırlama
    const markup = `
    <a class="result-link">
        <img src="${recipe.image_url}"/>
        <div class="data">
        <h4>${recipe.title}</h4>
        <p>${recipe.publisher}</p>
        </div>
    </a>
    
    `;
    // oluşturduğumuz html'i ilgili yere gönderme
    elements.resultsList.insertAdjacentHTML("beforeend", markup);
  });
};

// ekrana yüklenme gifi
export const renderLoader = (parent) => {
  // loader HTML hazırlama
  const loader = `
        <div class="loader">
            <img src="./images/foodGif.gif"/>
        </div>
    `;
  // loader'ı bize gelen html elemanın içine gönderme
  parent.insertAdjacentHTML("afterbegin", loader);
};

// ekrandaki loaderı kaldıracak fonksiyon
export const clearLoader = () => {
  const loader = document.querySelector(".loader");
  // eğer ki loader varsa loader'ı HTML'den kaldır
  if (loader) {
    loader.remove();
  }
};
