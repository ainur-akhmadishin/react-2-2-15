import React, { Component } from 'react';
import { Spin, Alert, Pagination, Tabs } from 'antd';
import { Offline, Online } from 'react-detect-offline';
import CardList from '../CardList';

import SearchPanel from '../searchPanel';
import 'antd/dist/antd.css';
import './App.scss';

import SearchMovies from '../service/SearchMovies';

import { Provider } from '../service/Context';
import DataGenre from '../service/DataGenre';

export default class App extends Component {
  genres = [];

  idSession = '';

  rateDate = [];

  state = {
    dataBase: [],
    loading: true,
    error: false,
    request: 'return',
    page: 1,
    total: 1,
    activeTab: 'search',
  };

  api = new SearchMovies();

  componentDidMount() {
    this.newSession();

    this.handleGenre();
	  
	  this.findMovies();

   
  }

  componentDidUpdate(prevProps, prevState) {
    const { page, request } = this.state;

    if (page !== prevState.page) {
      this.findMovies();
		
    } else if (request !== prevState.request) {
		this.newPage()
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
      .then((dataBase) => dataBase)
      .then(this.onLoaded)
      .catch(this.onError);
  };

newPage = () =>{
	this.setState({page:1})
}

  newSession = () => {
    this.api
      .createSession()
      .then((res) => res.json())
      .then((res) => {
        this.idSession = res.guest_session_id;
        return this.idSession;
      })
	  .catch(this.onError);
  };

  DatabaseRate = () => {
    this.api
      .dataRate(this.idSession)
      .then((res) => res.json())
      .then((res) => {
        this.rateDate = res.results;
        return this.rateDate;
      })
	  .catch(this.onError);
  };

  handleGenre = () => {
    DataGenre()
      .then((res) => res.genres)
      .then((res) => {
        this.genres = res;
        return this.genres;
      });
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

    this.api.rateMovies(id, this.idSession, value);
    this.DatabaseRate();
  };

  handlePage = (page) => {
    this.setState({ page });
  };

  onSearch = (request) => {
    this.setState({ request, loading: true });
  };

  changeTab = (activeKey) => {
    this.setState({
      activeTab: activeKey,
    });
    this.DatabaseRate();
  };

  render() {
    const { dataBase, loading, error, total, page, activeTab } = this.state;

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

    const { TabPane } = Tabs;

    const hasDate = !(loading || error);
    const notPage = !total ? <Alert message="Ни чего не найдено" type="error" /> : null;
    const errorMessage = error ? <Alert message="Ошибка запроса!" type="error" /> : null;
    const load = loading ? (
      <div className="center">
        <Spin size="large" tip="Loading..." />
      </div>
    ) : null;
    const content = hasDate ? <CardList data={dataBase} idSession={this.idSession} onRate={this.onRate} /> : null;

    const contentRate = () => {
      let resultContent = null;

      if (this.rateDate.length === 0) {
        resultContent = <Alert message="Вы еще не оценивали фильмы" type="warning" />;
      } else {
        resultContent = <CardList data={this.rateDate} idSession={this.idSession} onRate={this.onRate} />;
      }
      return resultContent;
    };

    const Result = () => (
      <Tabs activeKey={activeTab} onChange={this.changeTab}>
        <TabPane tab="Search" key="search">
          <SearchPanel onSearch={this.onSearch} />
          {errorMessage}
          {load}
          {notPage}
          {content}
          {pagination}
        </TabPane>

        <TabPane tab="Rate" key="rate">
          {contentRate()}
        </TabPane>
      </Tabs>
    );

    return (
      <div className="head">
        <Provider value={this.genres}>
          <Online>
            <Result />
          </Online>
          <Offline>
            <Alert message="Отсутствует подключение к интернету" type="warning" />
          </Offline>
        </Provider>
      </div>
    );
  }
}
