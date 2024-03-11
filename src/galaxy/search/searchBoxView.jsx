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
      fetch('https://gptreq.azurewebsites.net/api/getlaw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ statement: chatText })
      })
        .then(response => response.json())
        .then(data => {
          //console.log('Success:', data);
          //get the law reference and the motivation from the data json string
          var parsedData = JSON.parse(data);
          var lagreferens = parsedData.lagreferens;
          var motivation = parsedData.motivation;
          var searchResults = scene.find(lagreferens);
          //focus on the node with the law reference if it is not undefined
          if (searchResults.length) {
            appEvents.focusOnNode.fire(searchResults[0].id);
            motivation = searchResults[0].fullName + ". " + motivation;
          }
          appEvents.setPopupVisibilityAndText.fire(true, motivation, "");
          console.log("lagreferens", lagreferens);
          console.log("motivation", motivation);
          //scene.showpopup(motivation);
          //utter the response to the user
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
        }
        )
        .catch((error) => {
          console.error('Error:', error);
        });
    }
    getLaw(chatText);



    console.log("chatText", chatText);
    
    e.preventDefault();
  }
}
