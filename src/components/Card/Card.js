import React, { Component } from 'react';
import './Card.scss';
import PropTypes from 'prop-types';
import { Rate } from 'antd';
import 'antd/dist/antd.css';
import { Consumer } from '../service/Context';

export default class Card extends Component {
  render() {
    const { title, dataRelease, overview, popularity, genre, posterUrl, id, rate } = this.props;

    const popularityMovie = popularity.toFixed(1);

    const imgUrl = `https://image.tmdb.org/t/p/w500${posterUrl}`;

    const Genres = (arr, obj) =>
      arr.map((el) => {
        const move = obj.find((elem) => elem.id === el);
        const key = `k${el}`;
        return <li key={key}> {move.name}</li>;
      });

    const rateMovie = (idMovie, value) => {
      const { onRate } = this.props;
      onRate(id, value);
    };

    const borderColor = () => {
      if (popularityMovie < 3) {
        return 'popularity_borderLow';
      }
      if (popularityMovie >= 3 && popularityMovie < 5) {
        return 'popularity_borderMiddle';
      }
      if (popularityMovie >= 5 && popularityMovie < 7) {
        return 'popularity_borderHigh';
      }
      if (popularityMovie >= 7) {
        return 'popularity_borderSuper';
      }
      return null;
    };

    const colorClass = `popularity ${borderColor()}`;

    const shortOverview = (str) => {
      if (str.length < 210) return `${str}...`;

      const shortText = str.slice(0, 210);
      const lastSpace = shortText.lastIndexOf(' ');
      return `${shortText.slice(0, lastSpace)}...`;
    };

    return (
      <div className="div">
        <img className="img" src={imgUrl} alt={title} />
        <div>
          {' '}
          <div className="block">
            <div className="box">
              <h3>{title}</h3>
              <div className={colorClass}>{popularityMovie}</div>
            </div>
            <span>{dataRelease}</span>

            <ul>
              <Consumer>{(value) => Genres(genre, value)}</Consumer>
            </ul>
            <div className="text">
              <p>{shortOverview(overview)}</p>
            </div>
          </div>
          <Rate allowHalf value={rate} count={10} onChange={(value) => rateMovie(id, value)} />
        </div>
      </div>
    );
  }
}

Card.defaultProps = {
  title: '',
  dataRelease: '',
  posterUrl: '',
  overview: '',
  popularity: '',
  id: 100,
  rate: 0,
  genre: [],

  onRate: () => {},
};

Card.propTypes = {
  title: PropTypes.string,

  dataRelease: PropTypes.string,
  posterUrl: PropTypes.string,
  overview: PropTypes.string,
  popularity: PropTypes.number,
  rate: PropTypes.number,
  id: PropTypes.number,

  onRate: PropTypes.func,

  genre: PropTypes.arrayOf(PropTypes.number),
};
