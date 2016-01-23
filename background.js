chrome.tabs.create({'url': chrome.extension.getURL('popup.html')}, function(tab) {
  // Tab opened.
});

chrome.browserAction.onClicked.addListener(function() {
   chrome.tabs.create({'url': 'popup.html'}, function(window) {
   });
});

// globals

// initiate auth popup

console.log('HI');
SC.initialize({
                   client_id: 'b0a091a24c88bbd1f400dcac693b86a5',
		redirect_uri: 'https://github.com/TheMichaelHu/Ambeyonce'
                  });

SC.get('/tracks', {
  genres: 'punk', bpm: { from: 120 }
}).then(function(tracks) {
  console.log(tracks);
});
// find all tracks with the genre 'punk' that have a tempo greater than 120 bpm.
//SC.get('/tracks', {
  //genres: 'pop', bpm: { from: 120 }
//}).then(function(tracks) {
 // console.log(tracks);
//});

//var track_url = ;;
//SC.oEmbed(track_url, { auto_play: true }).then(function(oEmbed) {
 // console.log('oEmbed response: ', oEmbed);
//});

SC.get('/playlists/2050462').then(function(playlist) {
  playlist.tracks.forEach(function(track) {
    console.log(track.title);
    SC.stream('/tracks/' +track.id).then(function(player){
  player.play();
});
  });
});

//audio.play();
//audio.addEventListener("ended", function() { 
//	  playNextSong();
//	});

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
