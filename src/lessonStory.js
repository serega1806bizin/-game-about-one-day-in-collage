// src/lessonStory.js
import { showLesson } from "./lessonDialog.js";
import { changeScene } from "./sceneManager.js";
import { hero } from "./state.js";

// --- ЗАДАЧІ ---
const mathTasks = [
  { question: "3 * 4 + 6 / 2 = ?", answer: "15" },
  { question: "Половина від третини числа 30 — це?", answer: "5" },
  { question: "Було 10 яблук. 3 з’їв, 2 подарував. Скільки залишилось?", answer: "5" },
  { question: "5 + 5 * 0 + 5 = ?", answer: "10" }
];

// Суперскладна задача (фінальний бос)
const hardTask = {
  question: "Супер задача: (12 + 6) / 3 * 4 - 7 = ?",
  answer: "13"
};

// Індекси прогресу
let currentIndex = 0;
let superTaskDone = false;

// =========================================================================
//                           С Т А Р Т   С Ц Е Н И
// =========================================================================

export function startLessonScene() {
  currentIndex = 0;
  superTaskDone = false;

  showLesson("Викладач дивиться поверх окулярів. Привітатись?", [
    { label: "Кивнути мовчки", onSelect: () => beginLesson("silent") },
    { label: "Привітатись", onSelect: () => greetingChoice() },
    { label: "Зробити вигляд, що не бачу", onSelect: () => suspiciousStart() }
  ]);
}

// =========================================================================
//                           П Р И В І Т А Н Н Я
// =========================================================================

function greetingChoice() {
  showLesson("Як саме привітатись?", [
    { label: "Добрий день!", onSelect: () => beginLesson("normal") },
    { label: "Ви сьогодні дуже гарно виглядаєте!", onSelect: () => beginLesson("flirt") },
    { label: "Слава праці!", onSelect: () => beginLesson("weird") }
  ]);
}

function suspiciousStart() {
  showLesson("Викладач прищурився. «Так… цікаво.»", [
    { label: "Усміхнутись невинно", onSelect: () => beginLesson("suspicious") }
  ]);
}

// =========================================================================
//                       П О Ч А Т О К   У Р О К У
// =========================================================================

function beginLesson(type) {
  let reaction = "";

  switch (type) {
    case "silent": reaction = "«Ну хоч так…»"; break;
    case "normal": reaction = "«Приємно чути.»"; break;
    case "flirt": reaction = "«Тримай себе в руках.»"; break;
    case "weird": reaction = "«Ем… добре.»"; break;
    case "suspicious": reaction = "«Я за тобою спостерігаю.»"; break;
  }

  showLesson(`${reaction}\n\nТебе викликають до дошки. Що робити?`, [
    { label: "Іти", onSelect: () => startTaskFlow() },
    { label: "Відмовитись", onSelect: () => refuseBoard() },
    { label: "Притворитися, що погано", onSelect: () => pretendSick() },
    { label: "Мовчати", onSelect: () => teacherAngrySilent() }
  ]);
}

// =========================================================================
//                       Г І Л К И   П Е Р Е Д   З А Д А Ч А М И
// =========================================================================

function pretendSick() {
  showLesson("«Погано вам? Справді?»", [
    { label: "Так…", onSelect: () => fakeFail() },
    { label: "Та це жарт", onSelect: () => teacherAngryJoke() }
  ]);
}

function fakeFail() {
  showLesson("«Сідай. Балів не буде.»", [
    { label: "Сісти", onSelect: () => endLesson() }
  ]);
}

function teacherAngryJoke() {
  showLesson("«О, тепер точно до дошки!»", [
    { label: "Добре", onSelect: () => startTaskFlow() }
  ]);
}

function refuseBoard() {
  showLesson("«Мінус 2 бали.»", [
    { label: "Сісти", onSelect: () => endLesson() }
  ]);
}

function teacherAngrySilent() {
  showLesson("«Мовчите? Це погано.»", [
    { label: "Сісти", onSelect: () => endLesson() }
  ]);
}

// =========================================================================
//                      Ц И К Л   З А Д А Ч   (ПО КІЛЬКУ)
// =========================================================================

function startTaskFlow() {
  currentIndex = 0;
  showNextTask();
}

function showNextTask() {
  if (currentIndex >= mathTasks.length) {
    return noMoreTasks();
  }

  const task = mathTasks[currentIndex];

  showLesson(`Завдання ${currentIndex + 1}:\n${task.question}`, [
    { label: "Підтвердити", onSelect: (v) => checkAnswer(v) }
  ], true);
}

function checkAnswer(value) {
  if (value === "228") return secretMeme();

  const task = mathTasks[currentIndex];

  if (value === task.answer) {
    return taskCorrect();
  }

  return taskWrong();
}

function taskCorrect() {
  showLesson("«Правильно! Молодець.»", [
    { label: "Далі", onSelect: () => {
      currentIndex++;
      showMoreOrEnd();
    }}
  ]);
}

function taskWrong() {
  showLesson("«Неправильно, але нічого.»", [
    { label: "Спробувати іншу", onSelect: () => {
      currentIndex++;
      showMoreOrEnd();
    }}
  ]);
}

function secretMeme() {
  showLesson("«228? Ха-ха… ну хитрий ти.» +1 бал", [
    { label: "Далі", onSelect: () => {
      currentIndex++;
      showMoreOrEnd();
    }}
  ]);
}

// --- після кожної задачі ---
function showMoreOrEnd() {
  if (currentIndex < mathTasks.length) {
    showLesson("Хочеш ще одну задачу?", [
      { label: "Так, давайте ще!", onSelect: () => showNextTask() },
      { label: "Ні, вистачить", onSelect: () => endLesson() }
    ]);
  } else {
    noMoreTasks();
  }
}

// =========================================================================
//                        К О Л И   З А Д А Ч І   З А К І Н Ч И Л И С Ь
// =========================================================================

function noMoreTasks() {
  showLesson("«Ви сьогодні молодець, але задачі вже вичерпані.»", [
    { label: "А можна складнішу?", onSelect: () => showHardTask() },
    { label: "Добре, дякую", onSelect: () => endLesson() }
  ]);
}

// =========================================================================
//                     С У П Е Р   С К Л А Д Н А   З А Д А Ч А
// =========================================================================

function showHardTask() {
  if (superTaskDone) {
    return showLesson("«Супер задача вже була. Більше немає.»", [
      { label: "Окей", onSelect: () => endLesson() }
    ]);
  }

  showLesson(`Супер задача:\n${hardTask.question}`, [
    { label: "Підтвердити", onSelect: (v) => checkHard(v) }
  ], true);
}

function checkHard(v) {
  superTaskDone = true;

  if (v === hardTask.answer) {
    showLesson("«Вау… я вражений. +10 балів.»", [
      { label: "Дякую!", onSelect: () => endLesson() }
    ]);
  } else {
    showLesson("«Це дуже складно, не переймайтесь.»", [
      { label: "Окей", onSelect: () => endLesson() }
    ]);
  }
}

// =========================================================================
//                          К І Н Е Ц Ь   У Р О К У
// =========================================================================

function endLesson() {
  showLesson("Пара закінчилась.", [
    { label: "Вийти з кабінету", onSelect: () => exitClassroom() }
  ]);
}

function exitClassroom() {
  setTimeout(() => {
    changeScene(3);

    hero.x = 950;
    hero.y = 485;

  }, 250);
}
