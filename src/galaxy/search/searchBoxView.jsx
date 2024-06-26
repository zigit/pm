import React from 'react';
import searchBoxModel from './searchBoxModel.js';
import appConfig from '../native/appConfig.js';
import appEvents from '../service/appEvents.js';
import scene from '../store/scene.js';
import ReactDOM from 'react-dom';
import graph from '../service/graph.js';

module.exports = require('maco')(searchBar, React);

if (typeof EventSource !== "undefined") {
  console.log(
    "SSE id:" +
    window.bId
  );
  var source = new EventSource(
    "https://tala-sse.azurewebsites.net/ssesa/" +
    window.bId
  );
  var curated = new EventSource(
    "https://tala-sse.azurewebsites.net/ssesae/everyone"
  );

} else {
  document.getElementById("result").innerHTML =
    "Sorry, your browser does not support server-sent events...";
}

function searchBar(x) {
  x.render = function () {
    return (
      <div className='container row'>
        <div className='search col-xs-12 col-sm-6 col-md-4'>
        <form className='search-form' role='search' onSubmit={runSubmit}>
            <div className='input-group'>
              <input type='text'
                ref='searchText'
                id='searchText'
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
                id='chatText'
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
    var chatText = ReactDOM.findDOMNode(x.refs.chatText).value;
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
      
      //  Press x in Popup frame to hide the popup
      
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

      //  Press x in Popup frame to hide the popup
      const popup = document.getElementById('closePopupFrame');
      if (popup)
      {
        popup.click();
      } 
  
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
          // If the law reference is not found, remove the part of the law reference after and including the # character and search again
          if (!searchResults.length) {
            var index = lagreferens.indexOf('#');
            if (index > -1) {
              lagreferens = lagreferens.substring(0, index);
              console.log("lagreferens: ", lagreferens);
              searchResults = scene.find(lagreferens);
            }
          }


      

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

            // Choose the first Swedish voice
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
  
  curated.onmessage = function (event) {
    if (appConfig.getAutoPilot()) {
    appEvents.hideHelp.fire();
    appEvents.hideSearchBar.fire();
    document.getElementById("startit").style.visibility = "hidden";
    appEvents.nodeHover.fire({
      nodeIndex: undefined,
      mouseInfo: undefined
    });

    console.log(event);
    var data = event.data;
    var parsedData = JSON.parse(data);
          var lagreferens = parsedData.lagreferens;
          var motivation = parsedData.motivation;
          var searchResults = scene.find(lagreferens);
          // If the law reference is not found, remove the part of the law reference after and including the # character and search again
          if (!searchResults.length) {
            var index = lagreferens.indexOf('#');
            if (index > -1) {
              lagreferens = lagreferens.substring(0, index);
              console.log("lagreferens: ", lagreferens);
              searchResults = scene.find(lagreferens);
            }
          }


      

          //focus on the node with the law reference if it is not undefined and this.lagreferens is not same as lagreferens
          if (searchResults.length) {
          if ( this.lagreferens !== lagreferens) {
            appEvents.focusOnNode.fire(searchResults[0].id);
            this.lagreferens = lagreferens;
          }
          }
          console.log("lagreferens: ", searchResults[0].fullName);
          // Motivation is not empty, show the motivation in the popup
          if (parsedData.motivation !== "") {
            appEvents.setPopupVisibilityAndText.fire(true, motivation, "");
          }

          if (appConfig.getSound() && appConfig.getAutoPilot()) {
            //responsiveVoice.speak(motivation,"Swedish Female");

            console.log("curated: ", searchResults[0].fullName);
            // Get the list of voices available
            let voices = window.speechSynthesis.getVoices();

            // Filter for English voices
            let swedishVoices = voices.filter(voice => voice.lang.includes('sv'));

            // Choose the first English voice
            let selectedVoice = swedishVoices[0];

            // Create a new speechSynthesisUtterance object
            let utterance = new SpeechSynthesisUtterance(searchResults[0].fullName);

            // Set the voice
            utterance.voice = selectedVoice;

            // Set the language (optional, defaults to the language of the chosen voice)
            utterance.lang = 'sv-SE';

            // Speak the text
            window.speechSynthesis.speak(utterance);


          }
    }

  };

  // Reconnect to the server if the connection is lost
  source.onerror = function (event) {
    if (event.target.readyState === EventSource.CLOSED) {
      console.log("Reconnecting...");
      source = new EventSource(
        "https://tala-sse.azurewebsites.net/ssesa/" +
        window.bId
      );
    }
  };

  // Reconnect to the server if the connection is lost
  curated.onerror = function (event) {
    if (event.target.readyState === EventSource.CLOSED) {
      console.log("Reconnecting...");
      curated = new EventSource(
        "https://tala-sse.azurewebsites.net/ssesae/everyone"
      );
    }
  };

}
