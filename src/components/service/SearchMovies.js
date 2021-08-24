export default class SearchMovies {
  APIKEY = '5ef48972310b83a9569c2449ed33b900';

  BASEURL = 'https://api.themoviedb.org/3/';

  finalUrl = (endUrl, param = '') => `${this.BASEURL}${endUrl}?api_key=${this.APIKEY}${param}`;

  async request(url, method = 'GET', value = null) {
    const res = await fetch(url, this.getOptions(method, value));
    return res;
  }

  getOptions = (method, value) => {
    if (method === 'POST') {
      return {
        method,
        headers: { 'Content-Type': 'application/json;charset=utf-8' },
        body: JSON.stringify({ value }),
      };
    }

    return {
      method,
    };
  };

  async getNewSession() {
    const url = this.finalUrl(`authentication/guest_session/new`);

    const res = await this.request(url);
    const json = await res.json();
    return json;
  }

  async getSearch(request, page) {
    const url = this.finalUrl('search/movie', `&query=${request}&page=${page}`);

    const res = await this.request(url);
    const json = await res.json();
    return json;
  }

  async postRateMovie(idMovie, idSession, valueRate) {
    const url = this.finalUrl(`movie/${idMovie}/rating`, `&guest_session_id=${idSession}`);

    const res = await this.request(url, 'POST', valueRate);
    return res;
  }

  async getRatedMovies(idSession) {
    const url = this.finalUrl(`guest_session/${idSession}/rated/movies`);

    const res = await this.request(url);
    const json = await res.json();
    return json;
  }

  async getListGenres() {
    const url = this.finalUrl(`genre/movie/list`);
    const res = await this.request(url);
    const json = await res.json();
    return json;
  }
}
