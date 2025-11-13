import { setPaused, gameData } from './gameData.js';
import { images } from './assets.js';
import { hero } from './state.js';

// HTML элементы
const popupEl = document.getElementById('popup');
const popupImageEl = document.getElementById('popupImage');
const yesButton = document.getElementById('yesButton');
const noButton = document.getElementById('noButton');
// dialog.js
const questionPopupEl = document.getElementById('questionPopup');
const questionButtons = questionPopupEl
  ? questionPopupEl.querySelectorAll('.questionButton')
  : null;
let onResolve = null;

export function openDialog(lines) {
  // ...показати UI, завантажити репліки, запустити прогортання
  return new Promise((resolve) => {
    onResolve = resolve;
  });
}

export function closeDialog() {
  // ...сховати UI
  if (onResolve) { onResolve(); onResolve = null; }
}

/** Показ модалки */
export function showPopup() {
  if (popupEl.classList.contains('show')) return;
  setPaused(true);
  popupImageEl.src = images.choose.src;
  popupEl.classList.add('show');
}

/** Скрытие */
function hidePopup() {
  popupEl.classList.remove('show');
  setPaused(false);
  hero.targetX = hero.x;
  hero.targetY = hero.y;
}

// ===== Модалка вопроса "де пара?" для сцены 2 =====

export function showQuestionPopup() {
  if (!questionPopupEl || questionPopupEl.classList.contains('show')) return;
  setPaused(true);
  questionPopupEl.classList.add('show');
}

function hideQuestionPopup() {
  if (!questionPopupEl) return;
  questionPopupEl.classList.remove('show');
  setPaused(false);
  hero.targetX = hero.x;
  hero.targetY = hero.y;
}

/** Обработка Да */
function handleYes() {
  gameData.boughtWater = true;
  console.log('Выбрано: Так');
  hidePopup();

  // Показать Game Over
  const el = document.getElementById('gameover');
  if (el) el.classList.add('show');
}

/** Обработка Нет */
function handleNo() {
  gameData.boughtWater = false;
  console.log('Выбрано: Ні');
  hidePopup();
}

/** Привязка кнопок */
export function bindDialogButtons() {
  yesButton.addEventListener('click', handleYes);
  noButton.addEventListener('click', handleNo);

  if (questionButtons) {
    questionButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        // тут потом сможешь различать ответы по data-answer
        hideQuestionPopup();
      });
    });
  }
}
