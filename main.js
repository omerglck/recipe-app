import { v4 } from "https://jspm.dev/uuid";
import {
  elements,
  setLocalStorage,
  getFromLocal,
  controlBtn,
} from "./js/helpers.js";
import { Search } from "./js/api.js";
import {
  renderResult,
  renderLoader,
  clearLoader,
  renderBasketItems,
} from "./js/ui.js";
import { Recipe } from "./js/recipe.js";

const recipe = new Recipe();
//! Olay İzleyicileri
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

// tarif detaylarını alma
const controlRecipe = async () => {
  const id = location.hash.replace("#", "");

  if (id) {
    try {
      // tarif bilgilerini al
      await recipe.getRecipe(id);
      // ekrana tarif arayüzünü bas
      recipe.renderRecipe(recipe.info);
      // tarif arayüzüne scrollu kaydır
      elements.recipeArea.scrollIntoView({ behavior: "smooth" }); //scrollIntoView ile scrollu kaydırırz ve behavior özelliği ile daha yavaş bir şekilde geçiririz
    } catch (err) {
      console.log(err);
    }
    console.log(recipe.info);
  }
};
elements.form.addEventListener("submit", hendleSubmit);
//* tekrar eden işlemlerde döngü kullanabiliriz
// window.addEventListener("hashchange", controlRecipe);
// window.addEventListener("DOMContentLoaded", controlRecipe);
["hashchange", "load"].forEach((event) =>
  window.addEventListener(event, controlRecipe)
);
// local storageda sepet dizisi varsa onu al
// ama basket değeri undifened ise [] tanımla
let basket = getFromLocal("basket") || [];

// sayfanın yükklenme olayını izle
document.addEventListener("DOMContentLoaded", () => {
  renderBasketItems(basket);
  // sepettee eleman vars abutonu göster
  controlBtn(basket);
});

// tarif alanındaki tıklanmalarda çalışır
const handleClick = (e) => {
  if (e.target.id === "add-to-basket") {
    //tarifler dizisine dön
    recipe.ingredients.forEach((title) => {
      // herbir tarif için obje oluştur id ekle
      const newItem = {
        id: v4(),
        title,
      };
      // tarifleri basket dizisiekle
      basket.push(newItem);
    });
    // sepeti local e kaydetme
    setLocalStorage("basket", basket);
    // ekrana sepet elemanlarını basma
    renderBasketItems(basket);
    // sepeti temizle butonunu göster
    controlBtn(basket);
  }
  if (e.target.id === "like-btn") {
    recipe.controlLike();
  }
};
// sepete ekle butonuna tıklanmayı izle
elements.recipeArea.addEventListener("click", handleClick);
// sepet üzerinde tıklanma olayını izler
elements.basketList.addEventListener("click", deleteItem);

// sepetten eleman kaldırma
function deleteItem(e) {
  if (e.target.id === "delete-item") {
    //kapsayıcıya erişme
    const parent = e.target.parentElement;
    // seçilen ürünü dizidne kaldırmak için id'ye erişme
    basket = basket.filter((i) => i.id !== parent.dataset.id);

    //local storage güncelleme
    setLocalStorage("basket", basket);
    parent.remove();
    // temizle butonunu kontrol eder
    controlBtn(basket);
  }
}

// temizle butonuna tıklanma olayını izler
elements.clearBtn.addEventListener("click", handleClear);

// sepeti temizleme
function handleClear() {
  // kullanıcıdan onay alma
  const res = confirm("Sepet silinecek! Emin misiniz?");
  if (res) {
    // locali temizleme
    setLocalStorage("basket", null);
    // sepet dizisini sıfırlama
    basket = [];
    // butonu ortadan kaldırma
    controlBtn(basket);
    // arayüzü temizleme
    elements.basketList.innerHTML = "";
  }
}

// like butonuna tıklanma olayını izler

// hava durumu
const apiKey = "2373995dbd82304ca8dc8117a9b7230b";
const weatherDiv = document.querySelector(".weather");
const weatherInfo = document.querySelector("#weather-info");

// ekrana bastırdık
function renderWeather(city, temperature) {
  weatherInfo.innerHTML = `${city} <span class="temperature">${temperature} derece</span>`;
}

// fonksiyona iki değer gider enlem ve boylam
async function fetchWeather(latitude, longitude) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
  try {
    // api'a istek attık ve cevabı aldık
    const response = await fetch(apiUrl);
    // gelen cevabı json'a çevirdik
    const data = await response.json();
    // konumun adı
    const cityName = data.name;
    // konumun hava sıcaklığı
    const cityTemperature = data.main.temp - 273.15;

    renderWeather(cityName, cityTemperature.toFixed(2));
  } catch (error) {
    console.log("Hava durumu alınmadı:", error);
    weatherInfo.textContent = "Hava durumu bilgisi alınamadı.";
  }
}
// konumu bulma
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      fetchWeather(latitude, longitude);
    });
  } else {
    weatherInfo.textContent = "Tarayıcınız konum hizmetini desteklemiyor.";
  }
}
getLocation();
