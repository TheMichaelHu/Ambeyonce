window.onload = function() {
  var event = document.createEvent('Event');
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
      canvas.getContext('2d').translate(vid.videoWidth, 0);
      canvas.getContext('2d').scale(-1, 1);
      canvas.getContext('2d').drawImage(vid, 0, 0);
      var data = canvas.toDataURL();
      document.getElementById('photo').setAttribute('src', data);

      chrome.runtime.sendMessage({from: "popup", action: "getMood", content: data});
    }, false);

  } else {
    alert('Your potato does not support getUserMedia');
  }

  window.setInterval(function() {
    document.dispatchEvent(event);
  }, 2000);

  chrome.runtime.onMessage.addListener( function(message, sender, sendResponse) {
    switch(message.action){
      case "moodGet":
        $("#mood").text(message.content);
        var url = "";
        switch(message.content) {
          case "You are feeling Angry":
            url = "http://www.mrctv.org/sites/default/files/images/Angry-Beyonce.jpg ";
            break;
          case "You are feeling Surprise":
            url = "http://images.intouchweekly.com/uploads/posts/image/27459/beyonce-surprises.jpg";
            break;
          case "You are feeling Fear":
            url = "http://content.hollywire.com/sites/default/files/2013/02/04/beyonce-scared-supert-bowl.jpg";
            break;
          case "You are feeling Happy":
            url = "http://www.ew.com/sites/default/files/i/2013/09/04/Beyonce.jpg";
            break;
          case "You are feeling Sad":
            url = "http://i2.wp.com/behindthemirrorbeauty.com/wp-content/uploads/2013/11/Beyonce.jpg";
            break;
          case "You are feeling Neutral":
            url = "http://factmag-images.s3.amazonaws.com/wp-content/uploads/2013/12/beyonce-121313.jpg";
            break;
          default:
            url = "https://havekidstheysaid.files.wordpress.com/2014/05/sadface.jpg";
            break;
        }
        $("#queen-bee").attr('src', url);
        break;
    }
  });
}
