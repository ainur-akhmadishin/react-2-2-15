export default class SearchMovies {
  apiBase = 'https://api.themoviedb.org/3/search/movie?api_key=5ef48972310b83a9569c2449ed33b900';

  async SearchMovies(url) {
    const res = await fetch(`${this.apiBase}${url}`);
    if (res.ok) return res.json();
    throw new Error('Ошибка запроса');
  }

  async getSearch(request, page) {
    const res = await this.SearchMovies(`&query=${request}&page=${page}`);
    return res;
  }

  async createSession() {
    const res =
     await fetch(`https://api.themoviedb.org/3/authentication/guest_session/new?api_key=5ef48972310b83a9569c2449ed33b900
`);
      if (res.ok) return res;
    throw new Error('Ошибка запроса');
  }

  async rateMovies(idMovie, idSession, valueRate) {
    const rate = {
      value: valueRate,
    };

    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${idMovie}/rating?api_key=5ef48972310b83a9569c2449ed33b900&guest_session_id=${idSession}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(rate),
      }
    );
	  
	    if (res.ok) return res;
    throw new Error('Ошибка запроса');

  }

  async dataRate(idSession) {
    const res =await fetch(
      `https://api.themoviedb.org/3/guest_session/${idSession}/rated/movies?api_key=5ef48972310b83a9569c2449ed33b900`
    );
      if (res.ok) return res;
    throw new Error('Ошибка запроса');
  }
}
