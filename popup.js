function playHandler(e) {
  chrome.runtime.sendMessage({from: "popup", action: "play"});
}
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('play-button').addEventListener('click', playHandler);
})

function nextHandler(e) {
  chrome.runtime.sendMessage({from: "popup", action: "next"});
}
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('next-button').addEventListener('click', nextHandler);
})