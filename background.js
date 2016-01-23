// globals
var video = document.querySelector("#vid");
var canvas = document.querySelector('#canvas');
var ctx = canvas.getContext('2d');
var localMediaStream = null;
var pngdata;
var audio = new Audio('http://datashat.net/music_for_programming_1-datassette.mp3');
audio.load()
audio.addEventListener("load", function() { 
	  audio.play(); 
	});
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

// add event listener for button click
function getImage() {
  if (localMediaStream) {
    ctx.drawImage(video, 0, 0);
    document.getElementById("theimage").src = canvas.toDataURL("image/png"); //save canvas to image element
    document.getElementById("vid").setAttribute('style', 'display: none;');
    document.getElementById("canvas").setAttribute('style', 'display: block;');
    // add download attributes to savepicture
    document.getElementById("savepicture").setAttribute('href', canvas.toDataURL("image/png"));
    document.getElementById("savepicture").setAttribute('download', 'photo');
    document.getElementById("savepicture").setAttribute('style', 'display: block;');
    document.getElementById("takepicture").setAttribute('style', 'display: none;');
    // send image to background.js
    pngdata = canvas.toDataURL();
    chrome.runtime.sendMessage(pngdata);
    console.log("Sent data to background.js!")
  }
}

// error handling
var onCameraFail = function (e) {
  console.log("No Camera", e);
}

// put video stream onto canvas
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
window.URL = window.URL || window.webkitURL;
navigator.getUserMedia({audio: false, video: true}, function(stream) {
  video.src = window.URL.createObjectURL(stream);
  localMediaStream = stream;
}, onCameraFail);

getImage();
