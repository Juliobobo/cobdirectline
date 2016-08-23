// var synth = window.speechSynthesis;

// var voiceSelect = document.querySelector('select');

// var voices = [];

// function populateVoiceList() {
//   voices = synth.getVoices();

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
// }

// populateVoiceList();

// if (speechSynthesis.onvoiceschanged !== undefined) {
//   speechSynthesis.onvoiceschanged = populateVoiceList;
// }

// $("#sendAndGet").on('click', function(event) {
  
//   event.preventDefault();
//   var utterThis = new SpeechSynthesisUtterance(document.getElementById("chatlog").innerHTML);
//   var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
//   for(var i = 0; i < voices.length ; i++) {
//     if(voices[i].name === selectedOption) {
//       utterThis.voice = voices[i];
//     }
//   }
//   utterThis.pitch = 1;
//   utterThis.rate = 1;
//   synth.speak(utterThis);

// });