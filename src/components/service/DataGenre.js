async function DataGenre() {
  const arr = await fetch(
    'https://api.themoviedb.org/3/genre/movie/list?api_key=5ef48972310b83a9569c2449ed33b900&language=en-US'
  ).then((res) => res.json());

  return arr;
}

export default DataGenre;
