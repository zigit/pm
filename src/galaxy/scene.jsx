import React from 'react';
import {findDOMNode} from 'react-dom';
import HoverInfo from './hoverInfo.jsx';
import NodeDetails from './nodeDetails/nodeDetailsView.jsx';

import SteeringIndicator from './steeringIndicator.jsx';
import SearchBox from './search/searchBoxView.jsx';
import NoWebGL from './noWebgl.jsx';
import Help from './help.jsx';
import About from './about.jsx';
import Popup from './popup.jsx';
import WindowCollection from './windows/windowCollectionView.jsx';
import createNativeRenderer from './native/renderer.js';
import createKeyboardBindings from './native/sceneKeyboardBinding.js';
import appEvents from './service/appEvents.js';
import appConfig from './native/appConfig.js';

var webglEnabled = require('webgl-enabled')();

var Scene = React.createClass({
  // Initialize component state
  getInitialState: function() {
    return {
      isPopupVisible: false, // Default: Popup is not visible
      popupText: '' // Default Popup text, empty initially
    };
  },

  componentDidMount: function() {
    if (!webglEnabled) return;
    var container = findDOMNode(this.refs.graphContainer);
    this.nativeRenderer = createNativeRenderer(container);
    this.keyboard = createKeyboardBindings(container);
    this.delegateClickHandler = container.parentNode;
    this.delegateClickHandler.addEventListener('click', this.handleDelegateClick);
  },

  componentWillUnmount: function() {
    if (this.nativeRenderer) this.nativeRenderer.destroy();
    if (this.keyboard) this.keyboard.destroy();
    if (this.delegateClickHandler) this.delegateClickHandler.removeEventListener('click', this.handleDelegateClick);
  },

  handleDelegateClick: function(e) {
    var clickedEl = e.target;
    var classList = clickedEl.classList;
    var isInDegree = classList.contains('in-degree');
    var isOutDegree = !isInDegree && classList.contains('out-degree');
    var nodeId;

    if (isInDegree || isOutDegree) {
      nodeId = parseInt(clickedEl.id, 10);
      var connectionType = isInDegree ? 'in' : 'out';
      appEvents.showDegree.fire(nodeId, connectionType);
    }

    if (classList.contains('node-focus')) {
      nodeId = parseInt(clickedEl.id, 10);
      appEvents.focusOnNode.fire(nodeId);
    }
  },



  render: function() {
    // Check for WebGL support before rendering
    if (!webglEnabled) {
      return <NoWebGL />;
    }

    return (
      <div>
        <div ref='graphContainer' className='graph-full-size'></div>
        <HoverInfo />
        <NodeDetails />
        <SteeringIndicator />
        <SearchBox />
        <WindowCollection />
        <Help />
        <About />
        {/* Render Popup with visibility and text controlled by component state */}
        <Popup isVisible={this.state.isPopupVisible} text={this.state.popupText} />
      </div>
    );
  }
});

module.exports = Scene;