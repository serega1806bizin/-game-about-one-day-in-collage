import { setPaused } from "./gameData.js";
import { hero } from "./state.js";

const popup = document.getElementById("lessonPopup");
const textEl = document.getElementById("lessonText");
const btnsEl = document.getElementById("lessonButtons");
const inputEl = document.getElementById("lessonInput");

export function showLesson(text, options, withInput = false) {
  setPaused(true);

  textEl.textContent = text;
  btnsEl.innerHTML = "";

  // показати або сховати input
  if (withInput) {
    inputEl.classList.remove("hidden");
    inputEl.value = "";
    inputEl.focus();
  } else {
    inputEl.classList.add("hidden");
  }

  options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.textContent = opt.label;

    btn.onclick = () => {
      const val = withInput ? inputEl.value.trim() : null;
      hideLesson();
      opt.onSelect(val);
    };

    btnsEl.appendChild(btn);
  });

  popup.classList.add("show");
}

function hideLesson() {
  popup.classList.remove("show");
  setPaused(false);

  hero.targetX = hero.x;
  hero.targetY = hero.y;
}
