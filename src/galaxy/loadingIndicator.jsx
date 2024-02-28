import React from 'react';
import scene from './store/scene.js';

module.exports = require('maco')(loadingIndicator, React);

function loadingIndicator(x) {
  var loadingMessage = '';

  x.render = function() {
    return scene.isLoading() ?
        <div className='label loading'>{loadingMessage} For touchscreen use two fingers to move forward, three backwards and one to select</div> :
        null;
  };

  x.componentDidMount = function() {
    scene.on('loadProgress', updateLoadingIndicator);
  };

  x.componentWillUnmount = function () {
    scene.off('loadProgress', updateLoadingIndicator);
  };

  function updateLoadingIndicator(progress) {
    loadingMessage = `${progress.message} - ${progress.completed}`;
    x.forceUpdate();
  }
}
