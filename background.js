chrome.tabs.create({'url': chrome.extension.getURL('popup.html')}, function(tab) {
  // Tab opened.
});

chrome.browserAction.onClicked.addListener(function() {
   chrome.tabs.create({'url': 'popup.html'}, function(window) {
   });
});

SC.initialize({
  client_id: 'b0a091a24c88bbd1f400dcac693b86a5',
  redirect_uri: 'http://klevingluo.me/callback'
});
var M;
//playNextSong()
var playing = true;
var player;
var track = 0;

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
          if(message.from && message.from === "popup") {
            switch(message.action){
              case "next":
                playNextSong();
              break;
              case "play":
                if (playing) {
                  player.pause();
                  playing = false;
                } else {
                  player.play();
                  playing = true;
	               }
              break;
            }
          }
});

// functions
function playNextSong(mood) {
  mood = M;
  playing = false;
  var type;
 var beat;
 if (mood == 'Happy'){
    type = 'pop';
    beat = 140;
    }
 else if (mood == 'Sad'){
    type = 'piano';
    beat =40;
     }
 else if (mood == 'Angry'){
    type = 'metal';
    beat = 120;
    }
else if (mood == 'Neutral'){
    type = 'dubstep';
    beat = 100;
   }
else if (mood == 'Fear'){
    type = 'classical';
    beat = 120;
   }
else {
    type = 'country';
    beat = 80;
}

  playing = false;
  SC.get('/tracks', {
    genres: type, 
    bpm: { from: beat }
    }).then(function(tracks) {
    playTrack(tracks[track++ % tracks.length].id)
  });
}

function NextSong() {
  playNextSong(M);
  consol.log("playing next song");
}

function playTrack(id) {
  SC.stream('/tracks/' + id).then(function(newPlayer){
    player = {};
    newPlayer.on('finish', NextSong);
    newPlayer.on('no_streams', NextSong);
    newPlayer.on('no_protocol', NextSong);
    newPlayer.on('no_connection', NextSong);
    newPlayer.on('audio_error', NextSong);
    newPlayer.on('geo_blocked', NextSong);
    player = newPlayer;
    player.play();
    console.log(track.title);
    console.log(track.id);
    playing = true;
  });
}



function getNewSong(mood) {
	jQuery.get( "url", function(response) { 
		var apiResponse = JSON.parse(response);
		return apiResponse; //parse to get URL
	});
}

function getMood(data) {
  $.post(
    'https://apiv2.indico.io/fer?key=17ab107868cf822a3deb50a6dff8078a',
    JSON.stringify({
      'data': data.split(',')[1]
    })
  ).then(function(res) {
    console.log(res);
    res = JSON.parse(res);
    var max = 0;
    var mood = "";

    for (var emotion in res["results"]) {
      if(res["results"][emotion] > max) {
        max = res["results"][emotion];
        mood = emotion;
      }
    }
    chrome.runtime.sendMessage({from: "background", action: "moodGet", content: mood});
    console.log(mood);
    M = mood;
    return mood;
  });
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

playNextSong(M);
