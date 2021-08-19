import React, { Component } from 'react';
import { Alert } from 'antd';
import PropTypes from 'prop-types';
import CardList from '../CardList';

export default class RatePage extends Component {
  contentRate = () => {
    let resultContent = null;

    const { idSession, onRate, rateDate } = this.props;
    if (rateDate.length === 0) {
      resultContent = <Alert message="Вы еще не оценивали фильмы" type="warning" />;
    } else {
      resultContent = <CardList data={rateDate} idSession={idSession} onRate={onRate} />;
    }
    return resultContent;
  };

  render() {
    return <div>{this.contentRate()}</div>;
  }
}

RatePage.defaultProps = {
  idSession: '',
  onRate: () => {},
  rateDate: [],
};

RatePage.propTypes = {
  idSession: PropTypes.string,
  onRate: PropTypes.func,
  rateDate: PropTypes.instanceOf(Array),
};
