import React from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import './search.scss';

const SearchPanel = ({ onSearch }) => {
  const onChange = debounce((event) => {
    if (event.target.value.length === 0) {
      return;
    }
    onSearch(event.target.value);
  }, 1000);

  return (
    <form className="search">
      <input className="input" placeholder="Type to search..." type="text" onChange={onChange} />
    </form>
  );
};

SearchPanel.defaultProps = {
  onSearch: () => {},
};

SearchPanel.propTypes = {
  onSearch: PropTypes.func,
};

export default SearchPanel;
