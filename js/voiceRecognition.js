/**************************************************/
/** Voice recognition API bing speech microsoft **/
/**      Actuellement Hors service             **/
/***********************************************/
var fs = require('fs');
var request = require('request');
var util = require('util');

var client_id = '98dafb433df6484c9272fc94fdd0dac4';                     
var client_secret = '98dafb433df6484c9272fc94fdd0dac4'; 

var str = 'Bonjour, je suis en panne';

/****************
* Zone de test *
****************/
getAccessToken(client_id, client_secret, function(err, accessToken) {
  if(err) return console.log(err);
  console.log('Got access token: ' + accessToken);
   
  textToSpeech(str, 'test.wav', accessToken, function(err) {
    if(err) return console.log(err);
    console.log('Wrote out: ' + 'test.wav');
    });
});
 
/***************************/

// Pour prendre un token
function getAccessToken(client_id, client_secret, callback) {
  request.post({
    url: 'https://oxford-speech.cloudapp.net/token/issueToken',
    form: {
      'grant_type': 'client_credentials',
      'client_id': encodeURIComponent(client_id),
      'client_secret': encodeURIComponent(client_secret),
      'scope': 'https://speech.platform.bing.com'
    }
  }, function(err, resp, body) {
    if(err) return callback(err);
    try {
      var accessToken = JSON.parse(body).access_token;
      if(accessToken) {
        callback(null, accessToken);
      } else {
        callback(body);
      }
    } catch(e) {
      callback(e);
    }
  });
}

//tts
function textToSpeech(text, filename, accessToken, callback) {
  var ssmlTemplate = "<speak version='1.0' xml:lang='en-us'><voice xml:lang='%s' xml:gender='%s' name='%s'>%s</voice></speak>";
  request.post({
    url: 'http://speech.platform.bing.com/synthesize',
    body: util.format(ssmlTemplate, 'fr-FR', 'Female', 'Microsoft Server Speech Text to Speech Voice (fr-FR, Julie, Apollo)', text),
    encoding: null,
    headers: {
      'Authorization': 'Bearer ' + accessToken,
      'Content-Type' : 'application/ssml+xml',
      'X-Microsoft-OutputFormat' : 'riff-16khz-16bit-mono-pcm',
      'User-Agent': 'Julien'
    }
  }, function(err, resp, body) {
    if(err) return callback(err);
    fs.writeFile('../data/' + filename, body, 'binary', function (err) {
      if (err) return callback(err);
      callback(null);
    });
  });
}
