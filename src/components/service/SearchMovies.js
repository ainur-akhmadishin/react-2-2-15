export default class SearchMovies {
  APIKEY = '5ef48972310b83a9569c2449ed33b900';

  BASEURL = 'https://api.themoviedb.org/3/';

  finalUrl = (endUrl, param = '') => `${this.BASEURL}${endUrl}?api_key=${this.APIKEY}${param}`;

  async request(url, method = 'get', value = null) {
    const data = {};
    if (method === 'post') {
      data.method = 'POST';
      data.headers = { 'Content-Type': 'application/json;charset=utf-8' };
      data.body = JSON.stringify(value);
    }
    const res = await fetch(url, data);
    return res;
  }

  async getNewSession() {
    const url = this.finalUrl(`authentication/guest_session/new`);

    const res = await this.request(url);

    return res;
  }

  async getSearch(request, page) {
    const url = this.finalUrl('search/movie', `&query=${request}&page=${page}`);

    const res = await this.request(url);

    return res;
  }

  async postRateMovie(idMovie, idSession, valueRate) {
    const url = this.finalUrl(`movie/${idMovie}/rating`, `&guest_session_id=${idSession}`);

    const res = await this.request(url, 'post', { value: valueRate });
    return res;
  }

  async getRatedMovies(idSession) {
    const url = this.finalUrl(`guest_session/${idSession}/rated/movies`);

    const res = await this.request(url);

    return res;
  }

  async getListGenres() {
    const url = this.finalUrl(`genre/movie/list`);

    const res = await this.request(url);

    return res;
  }
}
