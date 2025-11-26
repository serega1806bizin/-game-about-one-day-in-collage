// src/lessonDialog.js
import { setPaused } from "./gameData.js";
import { hero } from "./state.js";

// ─── СТАРЫЙ ДИАЛОГ (математика и т.п.) ─────────────────────

const popup = document.getElementById("lessonPopup");
const textEl = document.getElementById("lessonText");
const btnsEl = document.getElementById("lessonButtons");
const inputEl = document.getElementById("lessonInput");

export function showLesson(text, options, withInput = false) {
  setPaused(true);

  textEl.textContent = text;
  btnsEl.innerHTML = "";

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

// ─── НОВЫЙ ДИАЛОГ "ТЕРМИНАЛ" ДЛЯ ІНФОРМАТИКИ ───────────────

const dialog = document.getElementById("lesson-dialog");
const dialogTextEl = document.getElementById("lesson-text");
const dialogBtnsEl = document.getElementById("lesson-buttons");
const dialogInputWrapper = dialog.querySelector(".lesson-input-wrapper");
const dialogInputEl = document.getElementById("lesson-input");

export function showLessonInfo(text, options, withInput = false) {
  setPaused(true);

  dialogTextEl.textContent = text;
  dialogBtnsEl.innerHTML = "";

  if (withInput) {
    dialog.classList.remove("lesson-dialog--no-input");
    dialogInputEl.value = "";
    dialogInputEl.focus();
  } else {
    dialog.classList.add("lesson-dialog--no-input");
  }

  options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.textContent = opt.label;

    btn.onclick = () => {
      const val = withInput ? dialogInputEl.value.trim() : null;
      hideLessonInfo();
      opt.onSelect(val);
    };

    dialogBtnsEl.appendChild(btn);
  });

  dialog.classList.add("show");
}

function hideLessonInfo() {
  dialog.classList.remove("show");
  setPaused(false);

  hero.targetX = hero.x;
  hero.targetY = hero.y;
}
