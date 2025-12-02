// src/lesson3Story.js
import { showLessonInfo } from "./lessonDialog.js";
import { changeScene } from "./sceneManager.js";
import { hero } from "./state.js";
import { isLesson1Done } from "./lesson1Story.js";
import { isLesson2Done } from "./lesson2Story.js";
//
// ─── ФЛАГ УРОКУ 3 ─────────────────────────────────────────
//
export let isLesson3Done = false;

//
// ─── ЗАДАЧИ ПО КОМАНДАМ JS ───────────────────────────────
//
const codeTasks = [
  {
    id: "hello-world",
    title: "Задача 1: перший Hello, world!",
    description:
      "Напиши команду JavaScript, яка виведе в консоль текст:\n\n" +
      "  Hello, world!\n\n" +
      "Тобто треба щось типу console.log(...).",
    answers: [
      "console.log('Hello, world!');",
      'console.log("Hello, world!");',
      "console.log('Hello, world!')",
      'console.log("Hello, world!")'
    ]
  },
  {
    id: "hello-tech",
    title: "Задача 2: привітати технар",
    description:
      "Тепер зробимо привітання більш своїм.\n\n" +
      "Напиши команду, яка виведе:\n\n" +
      "  Hello, технар!\n\n" +
      "Знову через console.log.",
    answers: [
      "console.log('Hello, технар!');",
      'console.log("Hello, технар!");',
      "console.log('Hello, технар!')",
      'console.log("Hello, технар!")'
    ]
  },
  {
    id: "sum-console",
    title: "Задача 3: трошки математики",
    description:
      "А тепер перевіримо, що комп може рахувати.\n\n" +
      "Напиши команду, яка виведе в консоль результат виразу 2 + 3.\n\n" +
      "Наприклад, щось типу:\n" +
      "  console.log(2 + 3);",
    answers: [
      "console.log(2 + 3);",
      "console.log(2+3);",
      "console.log(2 + 3)",
      "console.log(2+3)"
    ]
  }
];

let currentTaskIndex = 0;

function normalizeCode(code) {
  return code.trim().replace(/\s+/g, " ");
}

function isAnswerCorrect(userCode, answers) {
  const normUser = normalizeCode(userCode);
  return answers.some((a) => normalizeCode(a) === normUser);
}

//
// ─── СТАРТ СЦЕНЫ УРОКА 3 ──────────────────────────────────
//
export function startLesson3Scene() {
  if (isLesson3Done) return;

  currentTaskIndex = 0;

  showLessonInfo(
    "Кабінет інформатики.\n" +
      "Монітори вже ввімкнені, хтось тихо відкрив меми у сусідній вкладці.\n\n" +
      "На дошці маркером написано великими літерами:\n" +
      '  console.log("Hello, world!");',
    [
      {
        label: "Сісти за комп'ютер",
        onSelect: () => sitDown()
      }
    ]
  );
}

function sitDown() {
  showLessonInfo(
    "Ти сідаєш за свій комп'ютер. Екран мерехтить, наче чекає команди.\n\n" +
      "Викладач заходить до кабінету, клацає мишкою і вмикає проєктор.\n" +
      "На стіні з'являється вікно браузера з відкритою консоллю.",
    [
      {
        label: "Подивитись, що він скаже",
        onSelect: () => teacherIntro()
      }
    ]
  );
}

function teacherIntro() {
  showLessonInfo(
    "Викладач:\n" +
      "«Сьогодні — практичне.\n" +
      "Кожен з вас напише свою першу програму, яка скаже світу Hello, world.\n" +
      "Почнемо з простого, але вводити будете самі — як у справжньому терміналі.»",
    [
      {
        label: "Я готовий/готова",
        onSelect: () => startCodePractice()
      }
    ]
  );
}

//
// ─── ЗАПУСК ЦИКЛА ЗАДАЧ ───────────────────────────────────
//
function startCodePractice() {
  currentTaskIndex = 0;
  showCurrentTask();
}

function showCurrentTask() {
  const task = codeTasks[currentTaskIndex];

  showLessonInfo(
    `${task.title}\n\n${task.description}\n\n` +
      "Введи команду в «термінал» нижче і натисни кнопку.",
    [
      {
        label: "Виконати команду",
        onSelect: (value) => checkCodeAnswer(value)
      }
    ],
    true // показываем поле ввода
  );
}

function checkCodeAnswer(value) {
  const raw = (value || "").trim();

  if (raw === "228" || raw === "console.log(228)") {
    return secretMeme();
  }

  const task = codeTasks[currentTaskIndex];

  if (!raw) {
    return showLessonInfo(
      "Консоль мовчить.\n" + "Без команди комп'ютер нічого не зробить.",
      [
        {
          label: "Спробувати ще раз",
          onSelect: () => showCurrentTask()
        }
      ],
      true
    );
  }

  const ok = isAnswerCorrect(raw, task.answers);

  if (ok) {
    return taskCorrect();
  }

  return taskWrong();
}

function taskCorrect() {
  showLessonInfo(
    "Уявно ти натискаєш Enter…\n" +
      "У консолі з'являється саме те, що й очікувалось.\n\n" +
      "Викладач задоволено киває:\n" +
      "«Ось, комп'ютер тебе почув.»",
    [
      {
        label: "Далі",
        onSelect: () => {
          currentTaskIndex++;
          showMoreOrEnd();
        }
      }
    ]
  );
}

function taskWrong() {
  showLessonInfo(
    "Уявно натискаєш Enter…\n" +
      "Замість нормального виводу — або нічого, або помилка в червоному.\n\n" +
      "Викладач:\n" +
      "«Це нормально. Помилки — частина програмування.\n" +
      "Подивись уважно на лапки, дужки і написання console.log.»",
    [
      {
        label: "Спробувати ще раз цю ж задачу",
        onSelect: () => showCurrentTask()
      },
      {
        label: "Давайте іншу",
        onSelect: () => {
          currentTaskIndex++;
          showMoreOrEnd();
        }
      }
    ],
    false
  );
}

function secretMeme() {
  showLessonInfo(
    "Ти вводиш щось підозріле…\n\n" +
      "Викладач піднімає брову:\n" +
      "«Я бачу, у нас тут любитель мемів.\n" +
      "Гаразд, за креатив плюсик в душі. Але давай все-таки по завданню.»",
    [
      {
        label: "Добре, поїхали по завданню",
        onSelect: () => showCurrentTask()
      }
    ]
  );
}

function showMoreOrEnd() {
  if (currentTaskIndex < codeTasks.length) {
    showLessonInfo(
      "Хочеш ще одну задачу з кодом?",
      [
        {
          label: "Так, давайте ще",
          onSelect: () => showCurrentTask()
        },
        {
          label: "Ні, на сьогодні достатньо",
          onSelect: () => endLesson3()
        }
      ]
    );
  } else {
    noMoreTasks();
  }
}

function noMoreTasks() {
  showLessonInfo(
    "Викладач усміхається:\n" +
      "«Ви сьогодні молодець, базові команди є.\n" +
      "Далі будемо змушувати комп'ютер думати складніше.»",
    [
      {
        label: "А можна складнішу задачу?",
        onSelect: () => ultraTaskIntro()
      },
      {
        label: "Мені вистачить на сьогодні",
        onSelect: () => endLesson3()
      }
    ]
  );
}

function ultraTaskIntro() {
  showLessonInfo(
    "Викладач задумливо дивиться на тебе:\n" +
      "«Добре. Дам задачу на майбутнє.\n" +
      "Не обов'язково зараз вирішувати, але цікаво спробувати.»",
    [
      {
        label: "Слухаю уважно",
        onSelect: () => ultraTaskExplain()
      }
    ]
  );
}

function ultraTaskExplain() {
  showLessonInfo(
    "«Спробуй якось написати програму, яка:\n" +
      "  1) запитує ім'я користувача (наприклад, через prompt),\n" +
      "  2) виводить Hello, ім'я,\n" +
      "  3) повторює це, поки ім'я не буде порожнім рядком,\n" +
      "  4) а потім каже щось типу: Goodbye.\n\n" +
      "Тут тобі знадобляться:\n" +
      "  — змінні,\n" +
      "  — умови,\n" +
      "  — цикли.\n\n" +
      "Але все це починається з одного простого console.log.»",
    [
      {
        label: "Запам'ятати ідею і піти з нею",
        onSelect: () => endLesson3()
      }
    ]
  );
}

function endLesson3() {
  showLessonInfo(
    "Пара добігає кінця...",
    [
      {
        label: "Вийти з кабінету",
        onSelect: () => {
          
          // 🔥 ПЕРЕВІРКА ВСІХ УРОКІВ
          if (isLesson1Done && isLesson2Done && !isLesson3Done) {
            const box = document.getElementById("finalMsg");
            box.classList.add("show");

            setTimeout(() => {
              box.classList.remove("show");
            }, 5000);
          }

          exitClassroom();
        }
      }
    ]
  );
}

function exitClassroom() {
  isLesson3Done = true;

  setTimeout(() => {
    changeScene(9);
    hero.x = 1640;
    hero.y = 485;
    hero.targetX = hero.x;
    hero.targetY = hero.y;
  }, 250);
}
