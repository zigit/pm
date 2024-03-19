import React from 'react';
import searchBoxModel from './searchBoxModel.js';
import appConfig from '../native/appConfig.js';
import appEvents from '../service/appEvents.js';
import scene from '../store/scene.js';
module.exports = require('maco')(searchBar, React);

function searchBar(x) {
  x.render = function () {
    return (
      <div className='container row'>
        <div className='search col-xs-12 col-sm-6 col-md-4'>
        <form className='search-form' role='search' onSubmit={runSubmit}>
            <div className='input-group'>
              <input type='text'
                ref='searchText'
                className='form-control no-shadow' placeholder='Gå till: t.ex 1994:1219'
                onChange={runSearch}/>
                <span className='input-group-btn'>
                  <button className='btn' tabIndex='-1' type='submit'>
                    <span className='glyphicon glyphicon-search'></span>
                  </button>
                </span>
                </div>
              </form>
              
        <form className='search-form' role='search' onSubmit={runSubmitChat}>
            <div className='input-group chat'>
                <input type='text'
                ref='chatText'
                className='form-control no-shadow' placeholder='Jag undrar...'/>
                <span className='input-group-btn'>
                  <button className='btn' tabIndex='-1' type='submit'>
                    <span id="sendChat" className='glyphicon glyphicon-send'></span>
                  </button>
                </span>
                </div>
              </form>
            </div>
          </div>
    );
  };

  function runSearch(e) {
    searchBoxModel.search(e.target.value);
  }

  function runSubmit(e) {
    var searchText = ReactDOM.findDOMNode(x.refs.searchText).value;
    searchBoxModel.submit(searchText);
    e.preventDefault();
  }
  function runSubmitChat(e) {
    var chatText = React.findDOMNode(x.refs.chatText).value;
    document.getElementById('sendChat').classList.remove('glyphicon-send');
    document.getElementById('sendChat').classList.add('glyphicon-hourglass');
    document.getElementById('sendChat').classList.add('gly-spin');

    // Function to call openai API assistant that will return a response to the chatText
    // Initial response will be a json object with keys lagreferens and motivation and the values will be the law reference and the motivation and also the thread id that will be used to continue the conversation


    //call the API at https://gptreq.azurewebsites.net/api/getlaw with the chatText as value to statement json key in body
    //and the response will be a json object with keys lagreferens and motivation and the values will be the law reference and the motivation
    //the response will be used utter the response to the user using the speech synthesis API
    //and the response will be displayed in the chat window
    //the chat window will be a div with a class of chat and the response will be appended to the chat window

    function getLaw(chatText) {
      //scene.showpopup("Tänker påtala dig för olaga intrång i min privata sfär.");
      //scene.setPopupVisibilityAndText(true, "Tänker påtala dig för olaga intrång i min privata sfär.");
      //appEvents.setPopupVisibilityAndText.fire(true, "Tänker påtala dig för olaga intrång i min privata sfär.");
       //fire('setPopupVisibilityAndText', { isVisible: true, text: 'Hello from ButtonToShowPopup' });
       var sId = "";
       const xhr = new XMLHttpRequest();
       xhr.open('POST', 'https://reflagsrv.azurewebsites.net/api/lagstream', true);
       xhr.setRequestHeader('Content-Type', 'application/json');
       xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
       xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
       xhr.setRequestHeader('Access-Control-Allow-Headers', 'Content-Type');      
       xhr.onload = function() {
         if (xhr.status === 200) {
           sId = JSON.parse(xhr.responseText).sId;
           console.log("sId: ",sId);
           window.sId = sId;
         }
       };
       var body = JSON.stringify({ statement: chatText, bId: window.bId, sId: window.sId ? window.sId : "" });
       console.log("body; ", body);
       xhr.send(body);
       xhr.removeEventListener('load', getLaw);
          document.getElementById('sendChat').classList.remove('gly-spin');
          document.getElementById('sendChat').classList.remove('glyphicon-hourglass');
          document.getElementById('sendChat').classList.add('glyphicon-send');
  
    }
    getLaw(chatText);



    console.log("chatText", chatText);
    
    e.preventDefault();
  }
  source.onmessage = function (event) {
    console.log(event.data);
    var data = event.data;
    var parsedData = JSON.parse(data);
          var lagreferens = parsedData.lagreferens;
          var motivation = parsedData.motivation;
          var searchResults = scene.find(lagreferens);

          //focus on the node with the law reference if it is not undefined and this.lagreferens is not same as lagreferens
          if (searchResults.length) {
          if ( this.lagreferens !== lagreferens) {
            appEvents.focusOnNode.fire(searchResults[0].id);
            this.lagreferens = lagreferens;
          }
          }
        
          // Motivation is not empty, show the motivation in the popup
          if (parsedData.motivation !== "") {
            appEvents.setPopupVisibilityAndText.fire(true, motivation, "");
          }

          if (appConfig.getSound()) {
            //responsiveVoice.speak(motivation,"Swedish Female");
            // Get the list of voices available
            let voices = window.speechSynthesis.getVoices();

            // Filter for English voices
            let swedishVoices = voices.filter(voice => voice.lang.includes('sv'));

            // Choose the first English voice
            let selectedVoice = swedishVoices[0];

            // Create a new speechSynthesisUtterance object
            let utterance = new SpeechSynthesisUtterance(motivation);

            // Set the voice
            utterance.voice = selectedVoice;

            // Set the language (optional, defaults to the language of the chosen voice)
            utterance.lang = 'sv-SE';

            // Speak the text
            window.speechSynthesis.speak(utterance);


          }
          document.getElementById('sendChat').classList.remove('gly-spin');
          document.getElementById('sendChat').classList.remove('glyphicon-hourglass');
          document.getElementById('sendChat').classList.add('glyphicon-send');


  };
}
