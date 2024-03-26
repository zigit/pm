/**
 * Prepares data for selected node details
 */
import appEvents from '../service/appEvents.js';
import scene from '../store/scene.js';
import DegreeWindowViewModel from './degreeWindowViewModel.js';

import getBaseNodeViewModel from '../store/baseNodeViewModel.js';

import eventify from 'ngraph.events';
import appConfig from '../native/appConfig.js';

export default nodeDetailsStore();

function nodeDetailsStore() {
  var api = {
    getSelectedNode: getSelectedNode
  };

  var currentNodeId, degreeVisible = false,
      currentConnectionType;

  appEvents.selectNode.on(updateDetails);
  appEvents.showDegree.on(updateDegreeDetails);

  eventify(api);

  return api;

  function updateDetails(nodeId) {
    currentNodeId = nodeId;
    updateDegreeDetails(currentNodeId, currentConnectionType);
    if (appConfig.getAutoPilot()) {
    appEvents.highlightDestinationNode.fire(currentNodeId*3);
    appEvents.nodeHover.fire({
      nodeIndex: currentNodeId,
      mouseInfo: {x:window.innerWidth/2, y:window.innerHeight/2}
    });
  }
  }

  function updateDegreeDetails(id, connectionType) {
    currentNodeId = id;

    degreeVisible = currentNodeId !== undefined;
    if (degreeVisible) {
      currentConnectionType = connectionType;
      var rootInfo = scene.getNodeInfo(id);
      var conenctions = scene.getConnected(id, connectionType);

      var viewModel = new DegreeWindowViewModel(rootInfo.name, conenctions, connectionType, id);

      appEvents.showNodeListWindow.fire(viewModel, 'degree');
    } else {
      appEvents.hideNodeListWindow.fire('degree');
    }
    api.fire('changed');
  }

  function getSelectedNode() {
    if (currentNodeId === undefined) return;

    return getBaseNodeViewModel(currentNodeId);
  }
}
