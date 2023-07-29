export class Search {
  constructor(query) {
    this.query = query;
    this.result = [];
  }

  async getResults() {
    const res = await fetch(
      `https://forkify-api.herokuapp.com/api/search?q=${this.query}`
    );
    // veriyi json'a çevirip işleme
    const data = await res.json();

    // gelen veriyi sınıf yardımıyla oluşturduğumuz objenin içine aktar
    this.result = data.recipes;
  }
}
