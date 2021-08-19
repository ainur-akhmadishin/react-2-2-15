import React from 'react';
import PropTypes from 'prop-types';
import Card from '../Card';
import './CardList.scss';

const CardList = ({ data, idSession, onRate }) => {
  const elemets = data.map((el) => {
    const { title, id, overview } = el;
    const dataRelease = el.release_date;
    const posterUrl = el.poster_path;
    const popularity = el.vote_average;
    const genre = el.genre_ids;
    const rateing = el.rating ? el.rating : 0;

    return (
      <Card
        title={title}
        popularity={popularity}
        genre={genre}
        dataRelease={dataRelease}
        posterUrl={posterUrl}
        overview={overview}
        id={id}
        key={id}
        idSession={idSession}
        onRate={onRate}
        rate={rateing}
      />
    );
  });

  return <div className="list">{elemets}</div>;
};

CardList.defaultProps = {
  data: {},
  idSession: '',
  onRate: () => {},
};

CardList.propTypes = {
  data: PropTypes.instanceOf(Object),
  idSession: PropTypes.string,
  onRate: PropTypes.func,
};

export default CardList;
