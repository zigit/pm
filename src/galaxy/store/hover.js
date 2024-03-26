import React from 'react';
import eventify from 'ngraph.events';

import appEvents from '../service/appEvents.js';
import scene from './scene.js';
import getBaseNodeViewModel from './baseNodeViewModel.js';
import appConfig from '../native/appConfig.js';

export default hoverStore();

var lastnodeIndex = -1;
function hoverStore() {
  var store = {};
  eventify(store);

  appEvents.nodeHover.on(prepareViewModelAndNotifyConsumers);

  return store;

  function prepareViewModelAndNotifyConsumers(hoverDetails) {
    var hoverTemplate = null;
    if (hoverDetails.nodeIndex !== undefined) {
      var viewModel = createViewModel(hoverDetails);
      hoverTemplate = createDefaultTemplate(viewModel);
    }

    store.fire('changed', hoverTemplate);
  }

  function createViewModel(model) {
    if (model === null) throw new Error('Model is not expected to be null');

    var hoverViewModel = getBaseNodeViewModel(model.nodeIndex);
    window.model = model;
    hoverViewModel.left = model.mouseInfo.x;
    hoverViewModel.top = model.mouseInfo.y;

    return hoverViewModel;
  }
}

function createDefaultTemplate(viewModel) {
  var style = {
    left: viewModel.left + 20,
    top: viewModel.top - 35
  };


  // console.log("hover: ",(appConfig.getSound()) );
  // console.log("index: ",(viewModel.nodeIndex !== lastnodeIndex) );
  // console.log("speaking: ",window.speechSynthesis.speaking );
  // console.log("id: ",viewModel.id );

  // console.log("lastnodeIndex: ",lastnodeIndex );
  // console.log("add: ",(appConfig.getSound() && viewModel.id !== lastnodeIndex && !window.speechSynthesis.speaking) );
  // console.log("acc: ", viewModel.mouseInfo);
  // console.log("active element: ",document.activeElement);
  // console.log("active chatText: ",document.getElementById('chatText'));
  // console.log("not active Text: ",!(document.activeElement === document.getElementById('chatText') || document.activeElement === document.getElementById('searchText')));
  


  if (appConfig.getSound() && !appConfig.getAutoPilot() && viewModel.id !== lastnodeIndex && !window.speechSynthesis.speaking && !(document.activeElement === document.getElementById('chatText') || document.activeElement === document.getElementById('searchText'))) {
    lastnodeIndex = viewModel.id;
    // Get the list of voices available
    let voices = window.speechSynthesis.getVoices();

    // Filter for English voices
    let swedishVoices = voices.filter(voice => voice.lang.includes('sv'));

    // Choose the first Swedish voice
    let selectedVoice = swedishVoices[0];

    // Create a new speechSynthesisUtterance object
    let utterance = new SpeechSynthesisUtterance(viewModel.fullName);

    // Set the voice
    utterance.voice = selectedVoice;

    // Set the language (optional, defaults to the language of the chosen voice)
    utterance.lang = 'sv-SE';

    // Speak the text
    window.speechSynthesis.speak(utterance);
  } 
    return (
        <div style={style} className='node-hover-tooltip'>
          {viewModel.name}
          <span className='in-degree'>{viewModel.inDegree}</span>
          <span className='out-degree'>{viewModel.outDegree}</span>
          {!appConfig.getSound() && <br/>}
          {!appConfig.getSound() && viewModel.fullName}
        </div>
      );
}
