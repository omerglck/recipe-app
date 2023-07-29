import { elements } from "./js/helpers.js";
import { Search } from "./js/api.js";
import { renderResult, renderLoader, clearLoader } from "./js/ui.js";

//! Olay İzleyicileri
elements.form.addEventListener("submit", hendleSubmit);

//! Funcitons
async function hendleSubmit(e) {
  e.preventDefault();
  // aratılan kelime
  const query = elements.searchInput.value;
  // inputun içi boşsa bildirim gönderdik
  if (query == "") {
    elements.notification.style.display = "flex";
  } else {
    elements.notification.style.display = "none";
  }

  // inputun içine herhangi bir şey yazarsak çalışır
  if (query) {
    // Search sınıfının bir örneğini oluştur
    const search = new Search(query);
    //istek atmaya başlamadan önce loader'ı çalıştırmalıyız ve ekrana basmalıyız
    renderLoader(elements.resultsList);
    // istek atma
    try {
      await search.getResults();
      //ekrana cevap gelmeden önce de loader'ı ekrandan kaldırmalıyız
      clearLoader();
      //gelen veriyi ekrana bas
      //console.log(search.result);  result değeri oluşturduğumuz search class'ının içinde oluşturduğumuz sonuç değişkenidir
      renderResult(search.result);
    } catch (err) {
      console.log(err);
      clearLoader();
    }
  }
}
