// Rq : décommenter toutes les lignes si on veut utiliser autres chose que le fr


var synth = window.speechSynthesis;

// var voiceSelect = document.querySelector('select');

var voices = [];

function populateVoiceList() {
  voices = synth.getVoices();
  
//--- Si on veut selectionner un langage (à decommenter)
//   for(var i = 0; i < voices.length ; i++) {
//     var option = document.createElement('option');
//     option.textContent = voices[i].name + ' (' + voices[i].lang + ')';
    
//     if(voices[i].default) {
//       option.textContent += ' -- DEFAULT';
//     }

//     option.setAttribute('data-lang', voices[i].lang);
//     option.setAttribute('data-name', voices[i].name);
//     voiceSelect.appendChild(option);
//   }
}



var stt = function(txt){
    
    //Je récupère les voix disponible
    populateVoiceList();
    
    var utterThis = new SpeechSynthesisUtterance(txt);

    //   var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
    //   for(var i = 0; i < voices.length ; i++) {
    //     if(voices[i].name === selectedOption) {
    //       utterThis.voice = voices[i];
    //     }
    //   }
    
      utterThis.voice = voices[7];
      var param = utterThis.voice;
      param.default = false;
      param.lang = 'fr-FR';
      param.localService = false;
      param.name = "Google français";
      param.voiceURI = "Google français";
      utterThis.pitch = 1;
      utterThis.rate = 1;
      synth.speak(utterThis);

}
