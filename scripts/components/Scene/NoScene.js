import React from 'react';
import './NoScene.scss';
import PropTypes from 'prop-types';

const NoScene = ({label}) => (
  <div className='no-scene-container'>
    <div className="no-scene-wrapper">
      <div className="title" dangerouslySetInnerHTML={{ __html: label }} />
    </div>
  </div>
);

NoScene.propTypes = {
  label: PropTypes.string.isRequired
};

export default NoScene;
