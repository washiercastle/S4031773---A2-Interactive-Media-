const video = document.querySelector("#custom-video-player");
const playPauseBtn = document.querySelector("#play-pause-btn");
const playPauseImg = document.querySelector("#play-pause-img");
const progressBar = document.querySelector("#progress-bar-fill");
video.removeAttribute("controls");

// Assuming the play and pause were the missing functionalities, I will use them to 

playPauseBtn.addEventListener("click", togglePlayPause);
video.addEventListener("timeupdate", updateProgressBar);

function togglePlayPause() {
  if (video.paused || video.ended) {
    video.play();
    playPauseImg.src = "https://img.icons8.com/ios-glyphs/30/pause--v1.png";
  } else {
    video.pause();
    playPauseImg.src = "https://img.icons8.com/ios-glyphs/30/play--v1.png";
  }
}
function updateProgressBar() {
  const value = (video.currentTime / video.duration) * 100;
  progressBar.style.width = value + "%";
}

const timerDisplay = document.getElementById("timer-display");
const


// https://developer.mozilla.org/en-US/docs/Web/API/WakeLock
let wakeLock = null; // store reference

async function requestWakeLock() {
  try {
    wakeLock = await navigator.wakeLock.request("screen");
    console.log("Wake lock acquired");
    
    // Optional: re-acquire if page becomes visible again
    document.addEventListener("visibilitychange", async () => {
      if (document.visibilityState === "visible" && wakeLock === null) {
        await requestWakeLock();
      }
    });
    
  } catch (err) {
    console.log(`${err.name}, ${err.message}`);
    // Fallback: user might be on battery, or browser doesn't support wake lock
  }
}

async function releaseWakeLock() {
  if (wakeLock !== null) {
    await wakeLock.release();
    wakeLock = null;
    console.log("Wake lock released");
  }
}

// Example: request when user starts a timer or plays a video
document.getElementById("playButton").addEventListener("click", requestWakeLock);

// Add other functionalities here

// Add WakeLock
// Add Progress bar for pomodoro timer
// Wrangling location of video, anything more than 10mb, archive.io in canvas