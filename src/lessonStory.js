// src/lessonStory.js
import { showLesson } from "./lessonDialog.js";
import { changeScene } from "./sceneManager.js";
import { hero } from "./state.js";

// Запускается при входе на сцену 6
export function startLessonScene() {
  showLesson("Попривітатися з викладачем?", [
    { label: "Промовчати", onSelect: () => beginLesson() },
    { label: "Так", onSelect: () => greetingChoice() }
  ]);
}

// --- 1. Як привітатись ---
function greetingChoice() {
  showLesson("Яким чином поздороватись?", [
    { label: "Доброго ранку", onSelect: () => beginLesson() },
    { label: "Ви сьогодні так гарно виглядаєте", onSelect: () => beginLesson() }
  ]);
}

// --- 2. Початок уроку: викликають до дошки ---
function beginLesson() {
  showLesson("Препод викликає тебе до дошки. Що робити?", [
    { label: "Піти", onSelect: () => taskAtBoard() },
    { label: "Відмовитись", onSelect: () => refuseBoard() },
    { label: "Промовчати", onSelect: () => teacherAngrySilent() }
  ]);
}

// --- 3. Задача з введенням відповіді ---
function taskAtBoard() {
  showLesson("Задача: 2 + 2 * 2 = ?", [
    { label: "Підтвердити", onSelect: (v) => checkAnswer(v) }
  ], true); // <-- тут показуємо input
}

function checkAnswer(value) {
  if (value === "6") {
    correctAnswer();
  } else {
    wrongAnswer();
  }
}

function correctAnswer() {
  showLesson("Правильно! Викладач хвалить тебе +5 балів 🎉", [
    { label: "Сісти за парту", onSelect: () => endLesson() }
  ]);
}

function wrongAnswer() {
  showLesson("Неправильно… Але нічого, сідайте.", [
    { label: "Сісти за парту", onSelect: () => endLesson() }
  ]);
}

// --- 4. Інші гілки ---
function refuseBoard() {
  showLesson("2 бали мінус. 2 жури.", [
    { label: "Сісти за парту", onSelect: () => endLesson() }
  ]);
}

function teacherAngrySilent() {
  showLesson("Чого ви мовчите?", [
    { label: "Сісти за парту", onSelect: () => endLesson() }
  ]);
}

// --- 5. Кінець пари → вихід з кабінету на сцену 3 ---
function endLesson() {
  showLesson("Кінець пари.", [
    { label: "ОК", onSelect: () => exitClassroom() }
  ]);
}

function exitClassroom() {
  // невелика затримка, щоб попап красиво закрився
  setTimeout(() => {
    changeScene(3);

    // Тут герой зʼявляється вже на сцені 3
    // Поставила перед правими дверима, але можешь підкрутити
   hero.x = 950;
   hero.y = 485;


  }, 250);
}
