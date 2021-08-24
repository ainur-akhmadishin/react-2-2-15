import React, { Component } from 'react';
import { Alert, Spin, Pagination } from 'antd';
import PropTypes from 'prop-types';
import SearchMovies from '../service/SearchMovies';
import SearchPanel from '../searchPanel';
import CardList from '../CardList';

export default class SearchPage extends Component {
  state = {
    movies: [],
    loading: true,
    error: false,
    request: 'return',
    page: 1,
    total: 1,
  };

  api = new SearchMovies();

  componentDidMount() {
    this.findMovies();
  }

  componentDidUpdate(prevProps, prevState) {
    const { page, request } = this.state;

    if (page !== prevState.page) {
      this.findMovies();
    } else if (request !== prevState.request) {
      this.newPage();
      this.findMovies();
    }
  }

  onError = () => {
    this.setState({
      error: true,
      loading: false,
    });
  };

  setMoviesState = (movies) => {
    this.setState({ movies: movies.results, total: movies.total_results, loading: false });
  };

  findMovies = () => {
    const { request, page } = this.state;
    this.api
      .getSearch(request, page)
      .then((res) => res)
      .then(this.setMoviesState)
      .catch(this.onError);
  };

  newPage = () => {
    this.setState({ page: 1 });
  };

  onRate = (id, value) => {
    this.setState(({ movies }) => {
      const idx = movies.findIndex((el) => el.id === id);
      const oldItem = movies[idx];
      const newItem = {
        ...oldItem,
        rating: value,
      };
      const newData = [...movies.slice(0, idx), newItem, ...movies.slice(idx + 1)];

      return {
        movies: newData,
      };
    });

    this.movieRate(id, value);
  };

  handlePage = (page) => {
    this.setState({ page });
  };

  onSearch = (request) => {
    this.setState({ request, loading: true, total: 1 });
  };

  async movieRate(id, value) {
    const { idSession } = this.props;

    const res = await this.api.postRateMovie(id, idSession, value);
    if (!res.ok) {
      this.setState({ error: true });
    }
  }

  render() {
    const { movies, loading, error, total, page } = this.state;

    const { idSession } = this.props;

    const pagination = !(loading || !total) ? (
      <Pagination
        defaultCurrent={page}
        total={total}
        onChange={this.handlePage}
        defaultPageSize={20}
        showSizeChanger={false}
        className="pagination"
      />
    ) : null;

    const hasData = !(loading || error);
    const notPage = !total ? <Alert message="Ни чего не найдено" type="error" /> : null;
    const errorMessage = error ? <Alert message="Ошибка запроса!" type="error" /> : null;
    const load = loading ? (
      <div className="center">
        <Spin size="large" tip="Loading..." />
      </div>
    ) : null;
    const content = hasData ? <CardList data={movies} idSession={idSession} onRate={this.onRate} /> : null;

    return (
      <div>
        <SearchPanel onSearch={this.onSearch} />
        {errorMessage}
        {load}
        {notPage}
        {content}
        {pagination}
      </div>
    );
  }
}

SearchPage.defaultProps = {
  idSession: '',
};

SearchPage.propTypes = {
  idSession: PropTypes.string,
};
