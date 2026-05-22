// const video = document.querySelector("#custom-video-player");
// const playPauseBtn = document.querySelector("#play-pause-btn");
// const playPauseImg = document.querySelector("#play-pause-img");
// const progressBar = document.querySelector("#progress-bar-fill");
// video.removeAttribute("controls");

// https://pomodorokitty.com/
// This website's pomodoro is exactly how I want mine to work, so I referenced it a lot for the timer logic. 


// NAV BAR — toggle popups
// each button shows its corresponding popup, clicking again hides it
// only one popup open at a time

const navAmbienceBtn = document.getElementById("nav-ambience-btn");
const navTimerBtn = document.getElementById("nav-timer-btn");
const navAestheticBtn = document.getElementById("nav-aesthetic-btn");

const popupAmbience = document.getElementById("popup-ambience");
const popupTimer = document.getElementById("popup-timer");
const popupAesthetic = document.getElementById("popup-aesthetic");

const allPopups = [popupAmbience, popupTimer, popupAesthetic];

function togglePopup(popup) {
  const isOpen = popup.classList.contains("active");
  // close all popups first
  allPopups.forEach(p => p.classList.remove("active"));
  // if it wasnt open, open it — if it was open, leave it closed (toggle)
  if (!isOpen) popup.classList.add("active");
}

navAmbienceBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  togglePopup(popupAmbience);
});

navTimerBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  togglePopup(popupTimer);
});

navAestheticBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  togglePopup(popupAesthetic);
});

// clicking anywhere outside closes all popups
document.addEventListener("click", () => {
  allPopups.forEach(p => p.classList.remove("active"));
});

// prevent clicks inside a popup from closing it
allPopups.forEach(p => p.addEventListener("click", (e) => e.stopPropagation()));



const timerDisplay = document.getElementById("timer-display");

const playPauseBtn = document.getElementById("playpause-btn");
const playPauseImg = document.getElementById("playpause-img");
const resetBtn = document.getElementById("reset-btn");
const resetImg = document.getElementById("reset-img");
const skipToEndBtn = document.getElementById("skiptoend-btn");
const skipToEndImg = document.getElementById("skiptoend-img");
const progressCircle = document.getElementById("circle");
const customWork = document.getElementById("customwork");
const customBreak = document.getElementById("custombreak");
const nightEasterEgg = document.getElementById("night-easter-egg");





// TIMER VARIABLES
let workDuration = parseInt(customWork.value) * 60; 
// to let the duration of the work timer be determined by the user input, taking the string e.g: "25" from the input and turning it into integer for calculations.

let breakDuration = parseInt(customBreak.value) * 60;
let workTimeLeft = workDuration;
  // a copy of the original duration, this value will change, the original will not, so that when the timer resets, it can go back to the original duration set by the user.

let breakTimeLeft = breakDuration;
let intervalID = null;
let currentMode = "work";
let currentDuration = workDuration;
let currentTimeLeft = workTimeLeft;

// keeps the screen awake as long as the page is open
// no need to tie it to the timer — this is a study tool, screen should never sleep
// https://developer.mozilla.org/en-US/docs/Web/API/WakeLock
document.addEventListener("click", async () => {
  try {
    await navigator.wakeLock.request("screen");
  } catch (err) {
    console.log(`${err.name}, ${err.message}`);
  }
}, { once: true });

const radius = parseFloat(progressCircle.getAttribute('r'));
  //fetching the radius from svg, so if i change it the script will adapt to new radius. 
const circumference = 2 * Math.PI * radius;
  // same calculation as in the css, to get the circumference of the circle for the progress bar, which is used to set the stroke dasharray and dashoffset for the progress effect.
progressCircle.style.strokeDasharray = circumference;
  // Overrides any hardcoded CSS value — JS calculates the exact circumference from the SVG radius, so it stays accurate if the radius ever changes.
progressCircle.style.strokeDashoffset = circumference;
  // Starts the circle fully "undrawn" — offset equal to circumference means the dash hasn't started yet, giving us an empty ring on page load.



// Noise 
const WhiteNoiseBtn = document.getElementById("white-noise-btn");
const PinkNoiseBtn = document.getElementById("pink-noise-btn");
const BrownNoiseBtn = document.getElementById("brown-noise-btn");
const GreenNoiseBtn = document.getElementById("green-noise-btn");
// https://www.amplifonusa.com/hearing-loss/blog/green-noise-vs-white-noise 

// Inspired by the brown noise idea during class, I wanted to add more noise options for users to choose from.
// the theory behind the 4 noise types I picked out are: 
// - White noise has equal intensity across all frequencies (low mid high) 
// - Pink noise has more energy in lower frequencies so it sounds softer, less harsh
// - Brown noise has even more energy in lower frequencies than pink noise so it sounds ultra deep
// - Green noise is a variation of white noise designed to be the most pleasant, balanced and natural-sounding by emphasizing mid frequencies.


// You need to create an AudioContext before you do anything else, as everything happens inside a context

// https://mdn.github.io/webaudio-examples/audio-basics/
// https://fireship.dev/web-audio-api
// Using a mathmatic equation, they showed me how to make white noise

const audioCtx = new AudioContext();
  // the "document" for all audio
// 2 seconds of samples so the loop point isnt noticeable
const SAMPLE_RATE = audioCtx.sampleRate;
const buffer = audioCtx.createBuffer(
  1,
  SAMPLE_RATE * 2,
  SAMPLE_RATE
);
  // javascript reads audio through buffers, which are like containers for audio data. I created a buffer with 1 channel (mono). Samples are the individual numbers that the computer uses to make sound, sample rate is how many samples per second, so the total number of samples in the buffer is sample rate multiplied by the length of the audio in seconds. So this buffer can hold 1 second of mono audio at a time. 

  const channelData = buffer.getChannelData(0);
    // to fill the buffer with white noise, I need to access the individual samples and change it. At creation the buffer is empty. 
    // getChannelData(0) gives me an array of all the samples for the first channel (left). I can then loop through this array and fill it with random values between -1 and 1 to make white noise.
    // The result right now is a Float32Array, which is a special type of array that can hold decimal numbers, and is optimized for audio processing, holding the values of each sample in the buffer.

for (let i = 0; i < channelData.length; i++) {
  // this for loop is counting up to the total number of samples in the buffer, which is how many individual pieces of audio data we have to fill with noise.
  channelData[i] = Math.random() * 2 - 1;
    // this equation basically generates a random number between -1 and 1, and assigning it to each sample in that array. 
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
}

// the output
const gain = audioCtx.createGain();
gain.gain.value = 0.08;
let isPlaying = false;
let whiteNoiseSource = null;



const filter = audioCtx.createBiquadFilter();
  // Biquad filters can filter out certain frequencies. 
  // https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode
filter.type = "allpass";
// connect filter → gain → destination once, then just change the filter settings when the user clicks different noise buttons. 
filter.connect(gain);
gain.connect(audioCtx.destination);

// https://noisehack.com/generate-noise-web-audio-api/
// This blog shows how to generate pink and brown noise through mathematical equations, and how to use a lowpass filter to make green noise. I would much prefer using a noise library, but for this project, I will just settle for approximations of the noise types, since the main focus of this project is the timer, and the noise is just a nice to have feature.
// this approach is used in MDN's own Web Audio API documentation
// source: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Advanced_techniques

function startNoise() {
  if (!isPlaying) {
    audioCtx.resume();
    whiteNoiseSource = audioCtx.createBufferSource();
    whiteNoiseSource.buffer = buffer;
    whiteNoiseSource.loop = true;
    whiteNoiseSource.connect(filter);
    whiteNoiseSource.start();
    isPlaying = true;
  }
  // if already playing, just let the filter change take effect
}

WhiteNoiseBtn.addEventListener("click", () => {
  filter.type = "allpass";
  startNoise();
});

PinkNoiseBtn.addEventListener("click", () => {
  filter.type = "lowpass";
  filter.frequency.value = 1000;
  startNoise();
});

BrownNoiseBtn.addEventListener("click", () => {
  filter.type = "lowpass";
  filter.frequency.value = 200;
  startNoise();
});

GreenNoiseBtn.addEventListener("click", () => {
  filter.type = "bandpass";
  filter.frequency.value = 500;
  filter.Q.value = 0.8;
  startNoise();
});



const ambienceVolumnBtn = document.getElementById("ambience-volumn-btn");
const ambienceSlider = document.getElementById("ambience-sound-slider");

let lastGain = 0.08; // remember the last volume so mute can restore it

ambienceSlider.addEventListener("input", () => {
  gain.gain.value = parseFloat(ambienceSlider.value);
  if (ambienceSlider.value == 0) {
    ambienceVolumnBtn.src = "/stuff/noaudio.png";
  } else {
    ambienceVolumnBtn.src = "/stuff/audio.png";
  }
});

ambienceVolumnBtn.addEventListener("click", () => {
  if (gain.gain.value > 0) {
    lastGain = gain.gain.value; // save current volume before muting
    gain.gain.value = 0;
    ambienceSlider.value = 0;   // move slider to match
    ambienceVolumnBtn.src = "/stuff/noaudio.png";
  } else {
    gain.gain.value = lastGain; // restore saved volume
    ambienceSlider.value = lastGain;
    ambienceVolumnBtn.src = "/stuff/audio.png";
  }
});

const hueSlider = document.getElementById("hue-slider");
const rainBtn = document.getElementById("rain-btn");
const starBtn = document.getElementById("star-btn");
const snowBtn = document.getElementById("snow-btn");
const bgCanvas = document.getElementById("bg-canvas");
const bgCtx = bgCanvas.getContext("2d");

// keep canvas size matched to window at all times
function resizeCanvas() {
  bgCanvas.width = window.innerWidth;
  bgCanvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// --- HUE SLIDER ---
// shifts the accent colours by rotating the hue of the whole page
// hue-rotate takes degrees 0-360, cycling through the full colour wheel
// source: https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/hue-rotate
hueSlider.addEventListener("input", () => {
  document.body.style.background = `radial-gradient(circle at bottom, hsl(${hueSlider.value}, 30%, 20%) 0%, hsl(${hueSlider.value}, 20%, 8%) 50%, #000000 100%)`;
});

// --- ANIMATION STATE ---
let activeAnimation = null; // stores the requestAnimationFrame id
let activeType = null;      // which animation is running

function stopAnimation() {
  if (activeAnimation) {
    cancelAnimationFrame(activeAnimation);
    activeAnimation = null;
    activeType = null;
    // clear the canvas when stopped
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
  }
}

// --- STARS ---
// array of star objects, each with x, y, radius and opacity
// they twinkle by oscillating opacity using Math.sin
const stars = Array.from({ length: 150 }, () => ({
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight,
  r: Math.random() * 1.5 + 0.5,       // radius between 0.5 and 2
  opacity: Math.random(),              // starting opacity
  speed: Math.random() * 0.02 + 0.005 // twinkle speed
}));

function drawStars() {
  bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);

  stars.forEach(star => {
    // Math.sin oscillates between -1 and 1, we shift it to 0-1 for opacity
    star.opacity += star.speed;
    const alpha = (Math.sin(star.opacity) + 1) / 2;

    bgCtx.beginPath();
    bgCtx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    bgCtx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    bgCtx.fill();
  });

  activeAnimation = requestAnimationFrame(drawStars);
}

// --- RAIN ---
// array of raindrops, each a line falling at a slight angle
// when a drop hits the bottom it resets to the top at a random x
const drops = Array.from({ length: 120 }, () => ({
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight,
  length: Math.random() * 20 + 10,   // line length
  speed: Math.random() * 4 + 2,      // fall speed
  opacity: Math.random() * 0.4 + 0.1 // subtle, not distracting
}));

function drawRain() {
  bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);

  drops.forEach(drop => {
    drop.y += drop.speed;
    drop.x += 0.5; // slight angle

    // reset to top when it hits the bottom
    if (drop.y > bgCanvas.height) {
      drop.y = -drop.length;
      drop.x = Math.random() * bgCanvas.width;
    }

    bgCtx.beginPath();
    bgCtx.moveTo(drop.x, drop.y);
    bgCtx.lineTo(drop.x + 2, drop.y + drop.length); // slight diagonal
    bgCtx.strokeStyle = `rgba(180, 210, 255, ${drop.opacity})`;
    bgCtx.lineWidth = 1;
    bgCtx.stroke();
  });

  activeAnimation = requestAnimationFrame(drawRain);
}

// --- SNOW ---
// same idea as rain but circular dots with a gentle horizontal drift
// Math.sin on the x position gives that floaty swaying movement
const flakes = Array.from({ length: 100 }, () => ({
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight,
  r: Math.random() * 3 + 1,          // radius
  speed: Math.random() * 1 + 0.5,    // fall speed, slower than rain
  drift: Math.random() * Math.PI * 2, // starting phase for horizontal sway
  opacity: Math.random() * 0.6 + 0.2
}));

function drawSnow() {
  bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);

  flakes.forEach(flake => {
    flake.y += flake.speed;
    flake.drift += 0.02;
    flake.x += Math.sin(flake.drift) * 0.5; // gentle sway left and right

    if (flake.y > bgCanvas.height) {
      flake.y = -flake.r;
      flake.x = Math.random() * bgCanvas.width;
    }

    bgCtx.beginPath();
    bgCtx.arc(flake.x, flake.y, flake.r, 0, Math.PI * 2);
    bgCtx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
    bgCtx.fill();
  });

  activeAnimation = requestAnimationFrame(drawSnow);
}

// --- BUTTON WIRING ---
// same toggle pattern as noise buttons
// clicking active button stops it, clicking another switches
starBtn.addEventListener("click", () => {
  if (activeType === "stars") { stopAnimation(); return; }
  stopAnimation();
  activeType = "stars";
  drawStars();
});

rainBtn.addEventListener("click", () => {
  if (activeType === "rain") { stopAnimation(); return; }
  stopAnimation();
  activeType = "rain";
  drawRain();
});

snowBtn.addEventListener("click", () => {
  if (activeType === "snow") { stopAnimation(); return; }
  stopAnimation();
  activeType = "snow";
  drawSnow();
});


// --- TIMER ALERT SOUND ---
// a simple sine wave ding using the existing audioCtx
// oscillator generates a pure tone, gain envelope fades it out naturally
// source: https://developer.mozilla.org/en-US/docs/Web/API/OscillatorNode

const alertSlider = document.getElementById("alert-slider");
const alertSoundBtn = document.getElementById("alert-sound-btn");

let alertGain = audioCtx.createGain();
alertGain.gain.value = 0.5; // default volume
alertGain.connect(audioCtx.destination);

function playDing() {
  const osc = audioCtx.createOscillator();
  const env = audioCtx.createGain();

  osc.type = "sine";
  osc.frequency.value = 660; // E5 note, pleasant and clear

  const now = audioCtx.currentTime;
  env.gain.setValueAtTime(alertGain.gain.value, now);
  env.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
  // exponential ramp sounds more natural than linear — like a real bell fading out

  osc.connect(env);
  env.connect(audioCtx.destination);

  osc.start(now);
  osc.stop(now + 1.5);
}

// slider controls alert volume
alertSlider.addEventListener("input", () => {
  alertGain.gain.value = parseFloat(alertSlider.value);
  alertSoundBtn.src = alertSlider.value == 0 
    ? "/stuff/noaudio.png" 
    : "/stuff/audio.png";
});

// mute toggle
let lastAlertGain = 0.5;
alertSoundBtn.addEventListener("click", () => {
  if (alertGain.gain.value > 0) {
    lastAlertGain = alertGain.gain.value;
    alertGain.gain.value = 0;
    alertSlider.value = 0;
    alertSoundBtn.src = "/stuff/noaudio.png";
  } else {
    alertGain.gain.value = lastAlertGain;
    alertSlider.value = lastAlertGain;
    alertSoundBtn.src = "/stuff/audio.png";
  }
});














function updateProgressBar() {
  // Progress bar uses the same percentage logic as the video scrubber
    
  const minutes = Math.floor(currentTimeLeft / 60);
    // getting the rounded down minutes left
  const seconds = currentTimeLeft % 60;
    // % (modulo) gives the remainder after dividing by 60. fetching remaining seconds after taking out the minutes

  timerDisplay.textContent = `${minutes.toString().padStart(2,"0")}:${seconds.toString().padStart(2,"0")}`;
    // to update the display of the timer, using padStart to add a leading zero when the number is less than 10, so it always shows two digits for minutes and seconds.


  // calculating the offset by taking the total minus the time remaining (= ratio of time left * total time)
  const offset = circumference - (currentTimeLeft / currentDuration) * circumference;
  progressCircle.style.strokeDashoffset = offset;
}


updateProgressBar();

// The cat pomodoro used different functions for the play/pause, reset, and skip to end buttons, so I will do the same for better control over each functionality, and to make it easier to read and debug.

function switchMode() {
    //if current mode ended and is work, switch to break, and set the duration and time left to the break values, else switch to work and set the duration and time left to the work values. then update the progress bar to reflect the new mode and time left.
  if (currentTimeLeft === 0) {
    playDing();
    if (currentMode === "work") {
      currentMode = "break";
      currentDuration = breakDuration;
      currentTimeLeft = breakTimeLeft;
    } 
    else {
      currentMode = "work";
      currentDuration = workDuration;
      currentTimeLeft = workTimeLeft;
    }
  updateProgressBar();
  }
}

function togglePlayPause() {
  // if interval running, pause
    if (intervalID) {
      playPauseImg.src = "stuff/play.png";
      clearInterval(intervalID);
      intervalID = null;
      console.log("Pause interval");
    } 
    
    else {
      console.log("Start or resume interval");
      playPauseImg.src = "stuff/pause.png";
      intervalID = setInterval(() => {
      if (currentTimeLeft > 0) {
        currentTimeLeft--;
        updateProgressBar();
      } 
      else {
        clearInterval(intervalID);
        intervalID = null;
        switchMode();
        
      }
        // automatically clears interval and alerts the user when timer is 0, and never goes negative.

      
    }, 1000);
      // Delay of 1000 milliseconds (1 second) to update the timer every second

    // toggle between play and pause icons based on the state of the timer, so when the timer is running, it shows the pause icon, and when it's paused or ended, it shows the play icon.
  }};

  function Reset() {
      currentTimeLeft = currentDuration;
      updateProgressBar();
    }

  function SkipToEnd() {
    currentTimeLeft = 0;
    updateProgressBar();
    switchMode();
  }


playPauseBtn.addEventListener("click", togglePlayPause);
resetBtn.addEventListener("click", Reset);
skipToEndBtn.addEventListener("click", SkipToEnd);


  // Listen to both inputs individually because listening to customTime would cause issues with the reference when switching modes.
customWork.addEventListener("change", () => {
  workDuration = parseInt(customWork.value) * 60;
  workTimeLeft = workDuration;        // ← add this
  if (currentMode === "work") {
    currentDuration = workDuration;   // ← and this
    currentTimeLeft = workDuration;   // ← and this
    updateProgressBar();              // ← then redraw
  }
});

customBreak.addEventListener("change", () => {
  breakDuration = parseInt(customBreak.value) * 60;
  breakTimeLeft = breakDuration;
  if (currentMode === "break") {
    currentDuration = breakDuration;
    currentTimeLeft = breakDuration;
    updateProgressBar();
  }
});
   

// CatPomodoro's website had a cute easter egg where if you open the website at night, it will animate the cat's eyes differently. I thought it was a nice touch and added a bit of comfort for nightowls, to feel like they have company during the lonely night sessions.

function toggleNightEasterEgg() {
  const currentDate = new Date();
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/Date
    // Constructor: create new Date object containing the current moment in time
  const currentHour = currentDate.getHours();
    // Get hours from current time
  if (currentHour >=22 || currentHour < 5) {
    nightEasterEgg.style.display = "block";

  } else {
    nightEasterEgg.style.display = "none";
  }
}

toggleNightEasterEgg();
    







// Add other functionalities here

// Add WakeLock
// Add Progress bar for pomodoro timer
// Wrangling location of video, anything more than 10mb, archive.io in canvas