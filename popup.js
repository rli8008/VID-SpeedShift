const slider = document.getElementById("speedSlider");
const input = document.getElementById("speedInput");
const label = document.getElementById("speedLabel");
const presetButtons = document.querySelectorAll(".preset-btn");

function clamp(value) {
  return Math.min(7, Math.max(0.25, value));
}

function updateActivePreset(value) {
  presetButtons.forEach(btn => {
    Number(btn.dataset.speed) === value
      ? btn.classList.add("active")
      : btn.classList.remove("active");
  });
}

browser.tabs.query({ active: true, currentWindow: true })
  .then(([tab]) => {
    if (!tab) return;

    browser.tabs.sendMessage(tab.id, { type: "GET_SPEED" })
      .then(rate => {
        if (rate) {
          updateUI(rate);
        }
      })
      .catch(() => {
        updateUI(1);
      });
  });

function updateUI(value) {
  const clamped = clamp(value);

  slider.value = clamped;
  input.value = clamped;
  label.textContent = clamped.toFixed(2) + "×";

  updateActivePreset(clamped);
}

function applySpeed(value) {
  browser.tabs.query({ active: true, currentWindow: true })
    .then(([tab]) => {
      if (!tab) return;
      browser.tabs.sendMessage(tab.id, {
        type: "SET_SPEED",
        rate: value
      });
    });
}

/* Slider → everything */
slider.addEventListener("input", () => {
  const value = Number(slider.value);
  updateUI(value);
  applySpeed(value);
});

/* Manual input → everything */
input.addEventListener("change", () => {
  const value = clamp(Number(input.value));
  updateUI(value);
  applySpeed(value);
});

/* Preset buttons → everything */
presetButtons.forEach(button => {
  button.addEventListener("click", () => {
    const value = Number(button.dataset.speed);
    updateUI(value);
    applySpeed(value);
  });
});

/* Initialize */
updateUI(1);