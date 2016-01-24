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
var M = 'Neutral';
var playing = true;
var player;
var track = 0;
var n = 0;
NextSong();

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
          if(message.from && message.from === "popup") {
            switch(message.action){
              case "next":
                  n = 1;
                  playNextSong(M);
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

var prev = 'Happy';
// functions
function playNextSong(mood) {
  var curr = mood;
  var type;
  var beat;
  if ((curr != prev) || (n == 1)){
    prev = curr;
    next = 0;
    if (curr == 'Happy') {
      SC.get('/playlists/188701950').then(function(list) {
        playTrack(list.tracks[track++ % list.tracks.length].id);
      });
    }
    else if (curr == 'Sad') {
      SC.get('/playlists/188799404').then(function(list) {
        playTrack(list.tracks[track++ % list.tracks.length].id);
      });
    }
    else if (curr == 'Angry') {
      SC.get('/playlists/188801285').then(function(list) {
        playTrack(list.tracks[track++ % list.tracks.length].id);
      });
    }
    else if (curr == 'Neutral') {
      SC.get('/playlists/188803240').then(function(list) {
        playTrack(list.tracks[track++ % list.tracks.length].id);
      });
    }
    else if (curr == 'Fear'){
      SC.get('/playlists/188787968').then(function(list) {
        playTrack(list.tracks[track++ % list.tracks.length].id);
      });
    }
    else {
      SC.get('/playlists/188803409').then(function(list) {
        playTrack(list.tracks[track++ % list.tracks.length].id);
      });
    }
  }
}

function NextSong() {
  if (playing) {
    playNextSong(M);
  }
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
    if(playing) {
      player.play();
    }
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
    res = JSON.parse(res);
    console.log(res['results']['Sad']);
    var max = 0;
    var mood = "";

    // Normalizing values with semi-arbitrary values
    res["results"]['Happy'] -= .042;
    res["results"]['Sad'] -= .26;
    res["results"]['Angry'] -= .15;
    res["results"]['Fear'] -= .46;
    res["results"]['Surprise'] -= .20;
    res["results"]['Neutral'] -= .05;

    for (var emotion in res["results"]) {
      if(res["results"][emotion] > max) {
        max = res["results"][emotion];
        mood = emotion;
      }
    }
    if(playing) {
      chrome.runtime.sendMessage({from: "background", action: "moodGet", content: "You are feeling " + mood});
    }
    M = mood;
    playNextSong(M);
    return mood;
  });
}

function pauseIfNoOneThere(data) {
  $.post(
    'https://apiv2.indico.io/faciallocalization?key=17ab107868cf822a3deb50a6dff8078a',
    JSON.stringify({
      'data': data.split(',')[1],
      'sensitivity': .9
    })
  ).then(function(res) {
    res = JSON.parse(res);
    if(playing && res["results"].length == 0) {
      chrome.runtime.sendMessage({from: "background", action: "moodGet", content: "Where'd you go? Press play to continue..."});
      playing = false;
      player.pause();
    }
  });
}

// listeners
chrome.runtime.onMessage.addListener( function(message, sender, sendResponse) {
  if(message.from && message.from === "popup") {
    switch(message.action){
      case "getMood":
        pauseIfNoOneThere(message.content);
        getMood(message.content);
        break;
    }
  }
});

