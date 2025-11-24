// npcDialog.js
import { setPaused } from './gameData.js';
import { hero } from './state.js';

let dialogBox;
let dialogText;

let lines = [];
let currentLine = 0;
let isActive = false;
let wasShown = false; // ← новый флаг, чтобы диалог нельзя было повторно открыть

function ensureDom() {
  if (!dialogBox) {
    dialogBox = document.createElement('div');
    dialogBox.id = 'dialogBox';
    dialogBox.innerHTML = `<p id="dialogText"></p>`;
    document.body.appendChild(dialogBox);
  }
  dialogText = document.getElementById('dialogText');
}

// --- старт діалогу ---
export function startNpcDialog() {
  // если диалог уже активен или уже был показан — не запускаем
  if (isActive || wasShown) return;

  ensureDom();

  lines = [
    '- Привіт',
    '- Привіт',
    '- Як справи?',
    '- Та наче норм.'
  ];
  currentLine = 0;
  isActive = true;

  hero.targetX = hero.x;
  hero.targetY = hero.y;

  dialogBox.classList.add('show');
  showLine();

  // реагуємо і на клавішу, і на клік
  window.addEventListener('keydown', handleNext);
  window.addEventListener('pointerdown', handleNext);
}

function showLine() {
  dialogText.textContent = lines[currentLine];
}

function handleNext(e) {
  if (e.type === 'keydown' && e.key !== ' ' && e.key !== 'Enter') return;

  currentLine++;
  if (currentLine < lines.length) {
    showLine();
  } else {
    endDialog();
  }
}

function endDialog() {
  dialogBox.classList.remove('show');
  setPaused(false);
  isActive = false;
  wasShown = true; // ← після завершення запам’ятовуємо, що вже показували

  window.removeEventListener('keydown', handleNext);
  window.removeEventListener('pointerdown', handleNext);
}
