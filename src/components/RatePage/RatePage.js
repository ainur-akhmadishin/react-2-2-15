import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert, Spin } from 'antd';
import SearchMovies from '../service/SearchMovies';

import CardList from '../CardList';

export default class RatePage extends Component {
  state = {
    movies: [],
    loading: false,
    error: false,
  };

  api = new SearchMovies();

  componentDidMount() {
    this.findMovies();
  }

  componentDidUpdate(prevProps) {
    const { isOpen } = this.props;

    if (isOpen !== prevProps.isOpen) {
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
    this.setState({ movies: movies.results, loading: false });
  };

  findMovies = () => {
    const { idSession } = this.props;
    this.onLoaded();
    this.api
      .getRatedMovies(idSession)
      .then((res) => res)
      .then(this.setMoviesState)
      .catch(this.onError);
  };

  onLoaded = () => {
    this.setState({ loading: true });
  };

  render() {
    const { loading, error, movies } = this.state;
    const contentRate = () => {
      let resultContent = null;
      if (movies.length === 0) {
        resultContent = <Alert message="Вы еще не оценивали фильмы" type="warning" />;
      } else {
        resultContent = <CardList data={movies} />;
      }
      return resultContent;
    };

    const hasData = !(loading || error);
    const load = loading ? (
      <div className="center">
        <Spin size="large" tip="Loading..." />
      </div>
    ) : null;

    const errorMessage = error ? <Alert message="Ошибка запроса!" type="error" /> : null;

    const content = hasData ? contentRate() : null;

    return (
      <div>
        {load}
        {errorMessage}
        {content}
      </div>
    );
  }
}

RatePage.defaultProps = {
  idSession: '',
  isOpen: '',
};

RatePage.propTypes = {
  idSession: PropTypes.string,
  isOpen: PropTypes.string,
};
