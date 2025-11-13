// dialog.js
import { setPaused, gameData } from "./gameData.js";
import { images } from "./assets.js";
import { hero } from "./state.js";

// === HTML элементы базового попапа з водою ===
const popupEl = document.getElementById("popup");
const popupImageEl = document.getElementById("popupImage");
const yesButton = document.getElementById("yesButton");
const noButton = document.getElementById("noButton");

// === Попап питання "де пара?" ===
const questionPopupEl = document.getElementById("questionPopup");
const questionButtons = questionPopupEl
  ? questionPopupEl.querySelectorAll(".questionButton")
  : null;

// === Попап розкладу ===
const schedulePopupEl = document.getElementById("schedulePopup");
const scheduleImageEl = document.getElementById("scheduleImage");
const closeScheduleBtn = document.getElementById("closeScheduleBtn");

let onResolve = null;

// ----------------------------------------------------
// БАЗОВИЙ ДІАЛОГ (поки що не використовується, але залишимо)
// ----------------------------------------------------
export function openDialog(lines) {
  // ...показати UI, завантажити репліки, запустити прогортання
  return new Promise((resolve) => {
    onResolve = resolve;
  });
}

export function closeDialog() {
  // ...сховати UI
  if (onResolve) {
    onResolve();
    onResolve = null;
  }
}

// ----------------------------------------------------
// ПОПАП З ВОДОЮ
// ----------------------------------------------------
export function showPopup() {
  if (popupEl.classList.contains("show")) return;
  setPaused(true);
  popupImageEl.src = images.choose.src;
  popupEl.classList.add("show");
}

function hidePopup() {
  popupEl.classList.remove("show");
  setPaused(false);
  hero.targetX = hero.x;
  hero.targetY = hero.y;
}

// Да / Ні
function handleYes() {
  gameData.boughtWater = true;
  console.log("Выбрано: Так");
  hidePopup();

  // Показать Game Over
  const el = document.getElementById("gameover");
  if (el) el.classList.add("show");
}

function handleNo() {
  gameData.boughtWater = false;
  console.log("Выбрано: Ні");
  hidePopup();
}

// ----------------------------------------------------
// ПОПАП ПИТАННЯ "ДЕ ПАРА?"
// ----------------------------------------------------
export function showQuestionPopup() {
  if (!questionPopupEl || questionPopupEl.classList.contains("show")) return;
  setPaused(true);
  questionPopupEl.classList.add("show");
}

function hideQuestionPopup() {
  if (!questionPopupEl) return;
  questionPopupEl.classList.remove("show");
  setPaused(false);
  hero.targetX = hero.x;
  hero.targetY = hero.y;
}

// ----------------------------------------------------
// ПОПАП РОЗКЛАДУ
// ----------------------------------------------------
export function showSchedulePopup() {
  console.log("📅 ВИКЛИК showSchedulePopup()");
  if (!schedulePopupEl || schedulePopupEl.classList.contains("show")) return;

  setPaused(true);
  schedulePopupEl.classList.add("show");
}

function hideSchedulePopup() {
  if (!schedulePopupEl) return;
  schedulePopupEl.classList.remove("show");
  setPaused(false);
  hero.targetX = hero.x;
  hero.targetY = hero.y;
}

// ----------------------------------------------------
// МІНІ-ДІАЛОГ З ОДНОГРУПНИКОМ
// ----------------------------------------------------
function startMateDialog() {
  const lines = [
    "- Яка зараз пара?",
    "- Я сам не знаю :("
  ];

  let i = 0;

  setPaused(true);
  hero.targetX = hero.x;
  hero.targetY = hero.y;

  let box = document.getElementById("mateDialog");
  if (!box) {
    box = document.createElement("div");
    box.id = "mateDialog";
    box.className = "overlay";
    box.innerHTML = `
      <div class="modal">
        <p id="mateText"></p>
      </div>
    `;
    document.body.appendChild(box);
  }

  const textEl = document.getElementById("mateText");
  box.classList.add("show");
  textEl.textContent = lines[i];

  function next() {
    i++;
    if (i < lines.length) {
      textEl.textContent = lines[i];
    } else {
      end();
    }
  }

  function end() {
    box.classList.remove("show");
    window.removeEventListener("keydown", handle);
    window.removeEventListener("pointerdown", handle);

    // Після відповіді одногрупника знову показуємо вибір "де пара?"
    showQuestionPopup();

    setPaused(false);
  }

  function handle(e) {
    if (e.type === "keydown" && e.key !== " " && e.key !== "Enter") return;
    next();
  }

  window.addEventListener("keydown", handle);
  window.addEventListener("pointerdown", handle);
}

// ----------------------------------------------------
// ПРИВ’ЯЗКА КНОПОК
// ----------------------------------------------------
export function bindDialogButtons() {
  // вода
  yesButton.addEventListener("click", handleYes);
  noButton.addEventListener("click", handleNo);

  // варіанти "де пара?"
  if (questionButtons) {
questionButtons.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    hideQuestionPopup();

    if (index === 0) {
      console.log("▶ Натиснута кнопка 'У куратора'");
      startCuratorDialog();
    }

    if (index === 1) {
      console.log("▶ Натиснута кнопка 'У одногрупника'");
      startMateDialog();
    }

    if (index === 2) {
      console.log("▶ Натиснута кнопка 'Подивитися у розклад'");
      showSchedulePopup();
    }
  });
});

  }

  // кнопка "Закрити" на розкладі
  if (closeScheduleBtn) {
    closeScheduleBtn.addEventListener("click", hideSchedulePopup);
  }
}

function startCuratorDialog() {
  const lines = [
    "- На вас накричали",
    "- ПОДИВИСЬ НА РОЗКЛАД!!!"
  ];

  let i = 0;

  setPaused(true);
  hero.targetX = hero.x;
  hero.targetY = hero.y;

  let box = document.getElementById("curatorDialog");
  if (!box) {
    box = document.createElement("div");
    box.id = "curatorDialog";
    box.className = "overlay";
    box.innerHTML = `
      <div class="modal">
        <p id="curatorText"></p>
      </div>
    `;
    document.body.appendChild(box);
  }

  const textEl = document.getElementById("curatorText");
  box.classList.add("show");
  textEl.textContent = lines[i];

  function next() {
    i++;
    if (i < lines.length) {
      textEl.textContent = lines[i];
    } else {
      end();
    }
  }

  function end() {
    box.classList.remove("show");

    window.removeEventListener("keydown", handle);
    window.removeEventListener("pointerdown", handle);

    // після куратора повертаємо вибір
    showQuestionPopup();

    setPaused(false);
  }

  function handle(e) {
    if (e.type === "keydown" && e.key !== " " && e.key !== "Enter") return;
    next();
  }

  window.addEventListener("keydown", handle);
  window.addEventListener("pointerdown", handle);
}
