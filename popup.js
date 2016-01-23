function clickHandler(e) {
  chrome.extension.sendMessage({directive: "play-pause"}, function(response) {
    this.close();
  });
}
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('play-button').addEventListener('click', clickHandler);
})
