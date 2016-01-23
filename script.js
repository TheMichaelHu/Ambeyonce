window.onload = function() {

  // Normalize the various vendor prefixed versions of getUserMedia.
  navigator.getUserMedia = (navigator.getUserMedia ||
                            navigator.webkitGetUserMedia ||
                            navigator.mozGetUserMedia || 
                            navigator.msGetUserMedia);

  // Check that the browser supports getUserMedia.
  // If it doesn't show an alert, otherwise continue.
  if (navigator.getUserMedia) {
    var vid = document.getElementById('camera-stream');
    // Request the camera.
    navigator.getUserMedia(
      // Constraints
      {
        video: true,
	audio: false
      },

      // Success Callback
      function(localMediaStream) {
      	// Get a reference to the video element on the page.
//  var vid = document.getElementById('camera-stream');

  // Create an object URL for the video stream and use this 
  // to set the video source.
  vid.src = window.URL.createObjectURL(localMediaStream); 
      },

      // Error Callback
      function(err) {
        // Log the error to the console.
        console.log('The following error occurred when trying to use getUserMedia: ' + err);
      }
    );
    document.getElementById('take').addEventListener('click', function(){
      var canvas = document.getElementById('canvas'); 
      canvas.width = vid.videoWidth;
      canvas.height = vid.videoHeight;
      canvas.getContext('2d').drawImage(vid, 0, 0);
      var data = canvas.toDataURL('image/webp');
      document.getElementById('photo').setAttribute('src', data);
//      chrome.runtime.getBackgroundPage(function(bgWindow) {
//        bgWindow.popup();
//      });
      chrome.runtime.sendMessage(
        {from: "popup", action: "getMood", content: data},
        processMood
      );
      alert("test1");
   }, false);

  } else {
    alert('Sorry, your browser does not support getUserMedia');
  }
}
function processMood(response){
  window.alert("test");
}
