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


//var track_url = ;;
//SC.oEmbed(track_url, { auto_play: true }).then(function(oEmbed) {
 // console.log('oEmbed response: ', oEmbed);
//});

//audio.addEventListener("ended", function() { 
//	  playNextSong();
//	});

// functions
function playNextSong(mood) {
 var type;
 var beat;
 if (mood == 'happy'){
    type = 'pop';
    beat = 140;
    }
 else if (mood == 'sad'){
    type = 'piano';
    beat =40;
     }
 else if (mood == 'angry'){
    type = 'metal';
    beat = 120;
    }
else if (mood == 'neutral'){
    type = 'dubstep';
    beat = 100;
   }
else if (mood == 'fear'){
    type = 'classical';
    beat = 120;
   }
else {
    type = 'country';
}
 console.log(type);
 SC.get('/tracks', {
    artist: 'beyonce',
    genres: type, 
    bpm: { from: 100}
    }).then(function(tracks) {
    tracks = tracks.reverse();
    tracks.forEach(function(track) {
      console.log(track.title);
      SC.stream('/tracks/' + track.id).then(function(player){
        player.play();
        console.log(track.title);
        console.log(track.id);
        player.on('finish', playNextSong);
      });
    });
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
    var obj = JSON.parse(res);
    var h = obj.results.Happy;
    var s = obj.results.Sad;
    var n = obj.results.Neutral;
    var f = obj.results.Fear;
    var a = obj.results.Angry;
    var s = obj.results.Surprise;
    var emo = Math.max(a,s,f,n,s,h);
    if (emo == s){
        playNextSong('sad');
    } 
    else if(emo == h){
        playNextSong('happy');
    } 
    else if(emo == n){
        playNextSong('neutral');
    }
    else if (emo == f){
        playNextSong('fear');
    } 
    else if (emo == a){
        playNextSong('angry');
    }
    else {
        playNextSong('surprise');
    }
    return res;
  });
}

function getMood(data) {
  response = getMoodResponse(data);
  var max = 0;
  var mood = "";
  for (var emotions in response) {
    if(response[emotions] > max) {
      max = response[emotions];
      mood = emotions;
    }
  }
  return emotions;
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
