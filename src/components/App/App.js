import React, { Component } from 'react';
import { Alert, Tabs, Spin } from 'antd';
import { Offline, Online } from 'react-detect-offline';

import RatePage from '../RatePage';
import SearchPage from '../SearchPage';

import 'antd/dist/antd.css';
import './App.scss';

import SearchMovies from '../service/SearchMovies';

import { Provider } from '../service/Context';

export default class App extends Component {
  state = {
    loading: true,
    error: false,
    idSession: '',
    genres: [],
    activeTabs: 'SearchPage',
  };

  api = new SearchMovies();

  componentDidMount() {
    this.initState();
  }

  async handleGenre() {
    const result = await this.api.getListGenres().then((res) => res.genres);
    return result;
  }

  onActiveTab = (key) => {
    this.setState({ activeTabs: key });
  };

  async newSession() {
    const result = await this.api.getNewSession().then((res) => res.guest_session_id);
    return result;
  }

  async initState() {
    try {
      const data = await this.handleGenre();
      const session = await this.newSession();
      this.setState({
        genres: data,
        idSession: session,
        loading: false,
      });
    } catch (err) {
      this.setState({
        loading: false,
        error: true,
      });
    }
  }

  render() {
    const { loading, idSession, genres, error, activeTabs } = this.state;
    const { TabPane } = Tabs;
    const errMessage = error ? <Alert message="Ошибка загрузки" type="error" /> : null;

    const load = loading ? (
      <div className="center">
        <Spin size="large" tip="Loading..." />
        <Alert message="Загружаю приложение" type="info" />
      </div>
    ) : null;

    const content = !(loading || error) ? (
      <Tabs activeKey={activeTabs} onChange={this.onActiveTab}>
        <TabPane tab="Search" key="SearchPage">
          <SearchPage idSession={idSession} onRate={this.onRate} />
        </TabPane>
        <TabPane tab="Rate" key="ratePage">
          <RatePage idSession={idSession} isOpen={activeTabs} />
        </TabPane>
      </Tabs>
    ) : null;

    return (
      <div className="head">
        <Provider value={genres}>
          <Online>
            {errMessage}
            {load}
            {content}
          </Online>
          <Offline>
            <Alert message="Отсутствует подключение к интернету" type="warning" />
          </Offline>
        </Provider>
      </div>
    );
  }
}
