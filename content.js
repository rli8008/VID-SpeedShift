let currentRate = 1;

function applyPlaybackRate(rate) {
  currentRate = rate;
  document.querySelectorAll("video").forEach(video => {
    video.playbackRate = rate;
  });
}

browser.runtime.onMessage.addListener(message => {
  if (message.type === "SET_SPEED") {
    applyPlaybackRate(message.rate);
  }

  if (message.type === "GET_SPEED") {
    return Promise.resolve(currentRate);
  }
});