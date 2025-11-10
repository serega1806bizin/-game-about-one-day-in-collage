// dialog.js

import { setPaused, gameData } from './gameData.js';
import { images } from './assets.js'; // Чтобы получить путь к choose.png
import { hero } from './state.js'; // Для сброса цели героя
import { isWalkable } from './navmask.js'; // Для возможности кликнуть по сцене после выбора

// --- HTML Элементы ---
const popupEl = document.getElementById('popup');
const popupImageEl = document.getElementById('popupImage');
const yesButton = document.getElementById('yesButton');
const noButton = document.getElementById('noButton');

/**
 * Показывает модальное окно с выбором "Купить воды?".
 */
export function showPopup() {
  if (popupEl.classList.contains('show')) return;
  
  // 1. Пауза
  setPaused(true);

  // 2. Установка изображения
  // Предполагаем, что images.choose было добавлено в assets.js
  popupImageEl.src = images.choose.src; 

  // 3. Показ
  popupEl.classList.add('show');
}

/**
 * Скрывает модальное окно и возобновляет игру.
 */
function hidePopup() {
  // 1. Скрытие
  popupEl.classList.remove('show');

  // 2. Возобновление игры
  setPaused(false);
  
  // 3. Сброс цели героя, чтобы он остановился.
  hero.targetX = hero.x;
  hero.targetY = hero.y;
}

// --- Обработчики Кнопок ---

/**
 * Логика для выбора "Да" (Красная зона).
 */
function handleYes() {
  gameData.boughtWater = true;
  console.log('Выбрано: Да, Купить воду (boughtWater:', gameData.boughtWater, ')');
  hidePopup();
}

/**
 * Логика для выбора "Нет" (Зеленая зона).
 */
function handleNo() {
  gameData.boughtWater = false;
  console.log('Выбрано: Нет, Не покупать (boughtWater:', gameData.boughtWater, ')');
  hidePopup();
}

// --- Инициализация ---

/**
 * Привязывает обработчики к кнопкам попапа.
 */
export function bindDialogButtons() {
  yesButton.addEventListener('click', handleYes);
  noButton.addEventListener('click', handleNo);
}
