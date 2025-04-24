const textInput = document.getElementById("text");
const voiceSelect = document.getElementById("voiceSelect");
const pitchInput = document.getElementById("pitch");
const pitchValueDisplay = document.getElementById("pitchValue");
const volumeInput = document.getElementById("volume");
const volumeValueDisplay = document.getElementById("volumeValue");

let voices = [];
let utterance = null;

// Load voices correctly
function loadVoices() {
  voices = speechSynthesis.getVoices();
  console.log(voices);
  voiceSelect.innerHTML = "";

  voices.forEach((voice, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = `${voice.name} (${voice.lang})`;
    voiceSelect.appendChild(option);
  });
}

// Wait for voices to be ready
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = loadVoices;
} else {
  loadVoices();
}

// Live display
pitchInput.addEventListener("input", () => {
  pitchValueDisplay.textContent = pitchInput.value;
});

volumeInput.addEventListener("input", () => {
  volumeValueDisplay.textContent = volumeInput.value;
});

// Play speech
function speakText() {
  const text = textInput.value.trim();
  if (!text) {
    alert("Please enter some text.");
    return;
  }

  if (speechSynthesis.speaking) {
    speechSynthesis.cancel();
  }

  utterance = new SpeechSynthesisUtterance(text);
  const selectedVoice = voices[voiceSelect.value];

  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }

  utterance.pitch = parseFloat(pitchInput.value);
  utterance.volume = parseFloat(volumeInput.value);

  speechSynthesis.speak(utterance);
}

// Pause or Resume
function pauseSpeech() {
  if (speechSynthesis.speaking) {
    if (speechSynthesis.paused) {
      speechSynthesis.resume();
    } else {
      speechSynthesis.pause();
    }
  }
}

function populateVoiceList() {
  const voiceSelect = document.getElementById("voiceSelect");
  voiceSelect.innerHTML = ''; // Clear existing

  const voices = speechSynthesis.getVoices();

  voices.forEach(voice => {
    const option = document.createElement("option");
    option.textContent = `${voice.name} (${voice.lang})`;

    option.setAttribute('data-name', voice.name);
    option.setAttribute('data-lang', voice.lang);

    voiceSelect.appendChild(option);
  });

  // Optional: auto-select Tamil if available
  const tamilVoice = voices.find(v => v.lang.includes("ta"));
  if (tamilVoice) {
    voiceSelect.value = `${tamilVoice.name} (${tamilVoice.lang})`;
  }
}

// Load voices when they become available
if (typeof speechSynthesis !== 'undefined') {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

// Voice dropdown population
function populateVoiceList() {
  const voiceSelect = document.getElementById("voiceSelect");
  const voices = speechSynthesis.getVoices();

  voiceSelect.innerHTML = "";

  voices.forEach((voice) => {
    const option = document.createElement("option");
    option.textContent = `${voice.name} (${voice.lang})`;
    option.setAttribute("data-name", voice.name);
    option.setAttribute("data-lang", voice.lang);
    voiceSelect.appendChild(option);
  });

  // Auto-select Tamil voice if found
  const tamilVoice = voices.find((v) => v.lang.includes("ta"));
  if (tamilVoice) {
    voiceSelect.value = `${tamilVoice.name} (${tamilVoice.lang})`;
  }
}

if (typeof speechSynthesis !== "undefined") {
  speechSynthesis.onvoiceschanged = populateVoiceList;
  populateVoiceList(); // Call it right away too
}

document.getElementById("play").addEventListener("click", () => {
  const text = document.getElementById("text").value;
  const voiceSelect = document.getElementById("voiceSelect");
  const pitch = parseFloat(document.getElementById("pitch").value);
  const volume = parseFloat(document.getElementById("volume").value);

  const utterance = new SpeechSynthesisUtterance(text);
  const voices = speechSynthesis.getVoices();
  const selectedOption = voiceSelect.selectedOptions[0]?.getAttribute("data-name");
  const selectedVoice = voices.find((voice) => voice.name === selectedOption);

  if (selectedVoice) {
    utterance.voice = selectedVoice;
    utterance.lang = selectedVoice.lang || "ta-IN";
  } else {
    alert("Voice not found!");
    return;
  }

  utterance.pitch = pitch;
  utterance.volume = volume;

  speechSynthesis.cancel(); // Cancel previous speech if running
  speechSynthesis.speak(utterance);
});

const themeToggle = document.getElementById("toggleTheme");

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  // Save preference
  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("darkMode", isDark ? "enabled" : "disabled");
});

// Load preference on page load
window.addEventListener("DOMContentLoaded", () => {
  const darkMode = localStorage.getItem("darkMode");
  if (darkMode === "enabled") {
    document.body.classList.add("dark");
  }
});
