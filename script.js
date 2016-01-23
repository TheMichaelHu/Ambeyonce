window.onload = function() {
  var event = document.createEvent('Event');
  var keepCheckingMood = true;
  event.initEvent('checkMood', true, true);

  navigator.getUserMedia = (navigator.getUserMedia ||
                            navigator.webkitGetUserMedia ||
                            navigator.mozGetUserMedia || 
                            navigator.msGetUserMedia);

  if (navigator.getUserMedia) {
    var vid = document.getElementById('camera-stream');

    navigator.getUserMedia(
      {
        video: true,
        audio: false
      },
      function(localMediaStream) {
        vid.src = window.URL.createObjectURL(localMediaStream); 
      },
      function(err) {
        alert('Oops, you should feel bad') 
      });

    document.addEventListener('checkMood', function() {
      var canvas = document.getElementById('canvas'); 
      canvas.width = vid.videoWidth;
      canvas.height = vid.videoHeight;
      canvas.getContext('2d').drawImage(vid, 0, 0);
      var data = canvas.toDataURL();
      document.getElementById('photo').setAttribute('src', data);

      chrome.runtime.sendMessage({from: "popup", action: "getMood", content: data});
    }, false);

  } else {
    alert('Your potato does not support getUserMedia');
  }

  window.setInterval(function() {
    if(keepCheckingMood) {
      document.dispatchEvent(event);
    }
  }, 10000);

  chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    switch (request.directive) {
      case "play-pause":
        keepCheckingMood = !keepCheckingMood;
      break;
    }});
}
