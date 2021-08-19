import React, { Component } from 'react';
import { Alert, Spin, Pagination } from 'antd';
import PropTypes from 'prop-types';
import SearchMovies from '../service/SearchMovies';
import SearchPanel from '../searchPanel';
import CardList from '../CardList';

export default class SearchPage extends Component {
  state = {
    dataBase: [],
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

  onLoaded = (dataBase) => {
    this.setState({ dataBase: dataBase.results, total: dataBase.total_results, loading: false });
  };

  findMovies = () => {
    const { request, page } = this.state;
    this.api
      .getSearch(request, page)
      .then((dataBase) => dataBase.json())
      .then(this.onLoaded)
      .catch(this.onError);
  };

  newPage = () => {
    this.setState({ page: 1 });
  };

  onRate = (id, value) => {
    this.setState(({ dataBase }) => {
      const idx = dataBase.findIndex((el) => el.id === id);
      const oldItem = dataBase[idx];
      const newItem = {
        ...oldItem,
        rating: value,
      };
      const newData = [...dataBase.slice(0, idx), newItem, ...dataBase.slice(idx + 1)];

      return {
        dataBase: newData,
      };
    });

    this.databaseRate(id, value);
  };

  handlePage = (page) => {
    this.setState({ page });
  };

  onSearch = (request) => {
    this.setState({ request, loading: true });
  };

  async databaseRate(id, value) {
    const { idSession, onDatabaseRate } = this.props;

    const res = await this.api.postRateMovie(id, idSession, value);
    if (!res.ok) {
      this.setState({ error: true });
    }

    const result = await this.api.getRatedMovies(idSession);

    const data = await result.json();

    onDatabaseRate(data.results);
  }

  render() {
    const { dataBase, loading, error, total, page } = this.state;

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

    const hasDate = !(loading || error);
    const notPage = !total ? <Alert message="Ни чего не найдено" type="error" /> : null;
    const errorMessage = error ? <Alert message="Ошибка запроса!" type="error" /> : null;
    const load = loading ? (
      <div className="center">
        <Spin size="large" tip="Loading..." />
      </div>
    ) : null;
    const content = hasDate ? <CardList data={dataBase} idSession={idSession} onRate={this.onRate} /> : null;

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
  onDatabaseRate: () => {},
};

SearchPage.propTypes = {
  idSession: PropTypes.string,
  onDatabaseRate: PropTypes.func,
};
