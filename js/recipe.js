import { elements, getFromLocal, setLocalStorage } from "./helpers.js";

export class Recipe {
  constructor() {
    // beğenilen elemanların dizisi
    this.likes = getFromLocal("likes") || [];
    //tarif hakkında tüm bilgiler
    this.info = {};
    // tarifin malzemeleri
    this.ingredients = [];
    // localden alınan elemanları ekrana basar
    this.renderLikes();
  }

  // tarif bilgilerini alma
  async getRecipe(id) {
    // verileri alma
    const res = await fetch(
      `https://forkify-api.herokuapp.com/api/get?rId=${id}`
    );
    //verileri işleme
    const data = await res.json();
    //clas'ın içerisine aktarma
    this.info = data.recipe;
    this.ingredients = data.recipe.ingredients;
  }
  // her bir tarif için tarifi temsil eden html oluşturur.
  createIngredient() {
    const html = this.ingredients
      .map(
        (ingredient) =>
          `
        <li>
            <i class="bi bi-check-circle"></i>
            <p>${ingredient}</p>
        </li>
        `
      )
      .join("");

    return html;
  }
  // tarif bilgilerini ekrana basma
  renderRecipe(recipe) {
    console.log(recipe);
    const markup = `
    <figure>
            <img
              src=${recipe.image_url}
            />
            <h1>${recipe.title}</h1>
            <p class="like-area">
              <i id="like-btn" class="bi ${
                this.isRecipeLike() ? "bi-heart-fill" : "bi-heart"
              }"></i>
            </p>
          </figure>
          
          <div class="ingredients">
            <ul>
              ${this.createIngredient()}
            </ul>
            <button id="add-to-basket">
              <i class="bi bi-cart-dash-fill"></i>
              <span>Alişveriş Sepetine Ekle</span>
            </button>
          </div>
          
          <div class="directions">
            <h2>Nasıl Pişirilir ?</h2>
            <p>
              Bu tarif dikkatlice <span>${recipe.publisher}</span> tarafından
              hazırlanmış ve test edilmiştir. Diğer detaylara onların websitesi
              üzerinden erişebilirsinzi
            </p>
            <a href=${recipe.source_url} target="_blank">Yönerge</a>
          </div>`;
    elements.recipeArea.innerHTML = markup;
  }

  // ürün daha önce likelanmış mı kontrol etsin
  isRecipeLike() {
    const found = this.likes.find((i) => i.id === this.info.recipe_id);

    return found;
  }
  // like'lama olaylarını kontrol eder
  controlLike() {
    // like'lanan ürünün ihtiyacımız olan değerlerini alma
    const newObject = {
      id: this.info.recipe_id,
      img: this.info.image_url,
      title: this.info.title,
    };
    // eleman daha önce eklenmişse çalışır
    if (this.isRecipeLike()) {
      // elemanı likes dizisinden kaldır
      this.likes = this.likes.filter((i) => i.id !== newObject.id);
    } else {
      // likes dizisine ekler
      this.likes.push(newObject);
    }
    // likelerı locale ekle
    setLocalStorage("likes", this.likes);
    // arayüzü güncel tut
    this.renderRecipe(this.info);

    // html listesini güncller
    this.renderLikes();
  }
  // render likes
  renderLikes() {
    const html = this.likes.map(
      (item) => `
    <a href=#${item.id}><img src=${item.img}
      />
      <p>${item.title}</p>
    </a>
    `
    );
    console.log(html);
    elements.likeList.innerHTML = html;
  }
}
