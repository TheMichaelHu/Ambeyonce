// globals
var audio = new Audio('http://datashat.net/music_for_programming_1-datassette.mp3');
audio.play();
audio.addEventListener("ended", function() { 
	  playNextSong();
	});

// functions
function playNextSong() {
	audio = new Audio(getNewSong(getMood()));
	audio.play()
  audio.addEventListener("ended", function() { 
    playNextSong();
  });
}

function getNewSong(mood) {
	jQuery.get( "url", function(response) { 
		var apiResponse = JSON.parse(response);
		return apiResponse; //parse to get URL
	});
}

function getMoodResponse(data) {
  $.post(
    'https://apiv2.indico.io/fer?key=17ab107868cf822a3deb50a6dff8078a',
    JSON.stringify({
      'data': data.split(',')[1]
    })
  ).then(function(res) {
    console.log(res);
    return res;
  });
}

function getMood(data) {
  response = getMoodResponse(data);
  var max = 0;
  var mood = "";
  for (var emotion in response) {
    if(response[emotion] > max) {
      max = response[emotion];
      mood = emotion;
    }
  }
  return emotion;
}

// listeners
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    switch (request.directive) {
      case "play-pause":
        if (!audio.paused) {
          audio.pause();
        } else {
          audio.play();
        }
        audio.paused = !audio.paused;
      break;
    }});

chrome.runtime.onMessage.addListener( function(message, sender, sendResponse) {
  if(message.from && message.from === "popup") {
    switch(message.action){
      case "getMood":
        getMood(message.content)
        break;
    }
  }
});
