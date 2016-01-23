// globals
var audio = new Audio('http://datashat.net/music_for_programming_1-datassette.mp3');
audio.play();
audio.addEventListener("ended", function() { 
	  playNextSong();
	});

// functions
function playNextSong() {
	audio = new Audio(getNewSong(getMood()));
	audio.load()
}

function getNewSong(mood) {
	jQuery.get( "url", function(response) { 
		var apiResponse = JSON.parse(response);
		return apiResponse; //parse to get URL
	});
}

function getMood() {
	// single example
	$.post(
	  'https://apiv2.indico.io/fer',
	  JSON.stringify({
	    'data': "<IMAGE>" //Need the image
	  })
	).then(function(res) { 
		console.log(res); 
		return res;
	});

	// batch example
	// $.post(
	//   'https://apiv2.indico.io/fer/batch',
	//   JSON.stringify({
	//     'data': [
	//       "<IMAGE>",
	//       "<IMAGE>"
	//     ]
	//   })
	// ).then(function(res) { console.log(res) });
}