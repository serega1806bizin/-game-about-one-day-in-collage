// lesson2Story.js
import { showLesson } from "./lessonDialog.js";
import { changeScene } from "./sceneManager.js";
import { hero } from "./state.js";
import { triggerLightning } from "./lightningEffect.js";
//
//  ─── ФЛАГ УРОКУ 2 ─────────────────────────────────────────
//
export let isLesson2Done = false;

//
//  ─── СТАРТ СЦЕНИ ─────────────────────────────────────────
//
export function startLesson2Scene() {
  if (isLesson2Done) {
    exitClassroom();
    return;
  };

  showLesson(
    "Кабінет фізики. На столі — куля з фіолетовими блискавками. Усі дивляться на неї, ніби вона зараз вибухне.",
    [
      { label: "Роздивитись кулю ближче", onSelect: () => beginIntro() },
      { label: "Сісти тихенько", onSelect: () => beginIntro("silent") },
    ]
  );
}

//
//  ─── ВСТУП ─────────────────────────────────────────
//
function beginIntro(type = "normal") {
  let remark = "";

  if (type === "normal") {
    remark = "Ви нахиляєтесь ближче. Блискавки ніби тягнуться до ваших пальців.";
  } else {
    remark = "Ви сідаєте тихенько, але блискавки все одно наче дивляться на вас.";
  }

  showLesson(
    remark + "\n\nПара починається. Викладач вмикає кулю — вона загоряється яскравим світлом.",
    [
      { label: "Чекаю, що він скаже", onSelect: () => teacherIntro() },
    ]
  );
}

//
//  ─── СЛОВО ВИКЛАДАЧА ─────────────────────────────────────────
//
function teacherIntro() {
  showLesson(
    "Викладач:\n«Отже, плазмова куля. Можна торкнутись — не вдарить.»",
    [
      { label: "Посміхнутись", onSelect: () => studentComment() },
      { label: "Пильніше подивитись", onSelect: () => studentComment("observe") },
    ]
  );
}

//
//  ─── РЕПЛІКА ОДНОГРУПНИКА ─────────────────────────────────────────
//
function studentComment(mode = "normal") {
  let reply = "";

  if (mode === "observe") {
    reply = "Одногрупник шепче:\n«Минулого року її включали — аж світло мигало у всьому корпусі…»";
  } else {
    reply = "Одногрупник каже:\n«Та так. Минулого року її включали — аж світло мигало у всьому корпусі.»";
  }

  showLesson(reply, [
    { label: "Посміхнутись", onSelect: () => teacherJoke() },
  ]);
}

//
//  ─── ЖАРТ ВИКЛАДАЧА ─────────────────────────────────────────
//
function teacherJoke() {
  showLesson(
    "Викладач усміхається:\n«Так, тоді хтось вирішив підключити ще чайник і зарядку одночасно.»",
    [
      { label: "Сміятись", onSelect: () => askForTouch() },
      { label: "Промовчати", onSelect: () => askForTouch() },
    ]
  );
}

//
//  ─── КЛЮЧОВЕ ПИТАННЯ ─────────────────────────────────────────
//
function askForTouch() {
  showLesson(
    "Викладач:\n«Ну що, хто хоче доторкнутись?»",
    [
      { label: "Доторкнутись", onSelect: () => touchSphere() },
      { label: "Жартом сказати щось", onSelect: () => jokePath() },
      { label: "Серйозно спитати", onSelect: () => seriousQuestions() },
      { label: "Відмовитись", onSelect: () => refuseTouch() },
    ]
  );
}

//
//  ─── ГІЛКА 1: Доторкнутись ─────────────────────────────────────────
//
function touchSphere() {
    triggerLightning();
  showLesson(
    "Ваш палець тягнеться до кулі. Блискавка легенько торкається шкіри.",
    [
      {
        label: "О, прикольно!",
        onSelect: () => teacherExplainsBeauty(),
      },
    ]
  );
}

function teacherExplainsBeauty() {
  showLesson(
    "Викладач:\n«Бачите, наука — це просто красиво.»",
    [
      { label: "Повернутись на місце", onSelect: () => endLesson() },
    ]
  );
}

//
//  ─── ГІЛКА 2: Жартувати ─────────────────────────────────────────
//
function jokePath() {
  showLesson(
    "Ви кажете:\n«А якщо потримати довше, світло знову зникне?»",
    [
      {
        label: "Почекати реакцію",
        onSelect: () => teacherJokesBack(),
      },
    ]
  );
}

function teacherJokesBack() {
  showLesson(
    "Викладач (жартома):\n«Якщо ввірю у себе — то, може, й так.»",
    [
      { label: "Доторкнутись тепер", onSelect: () => touchSphere() },
      { label: "Повернутись на місце", onSelect: () => endLesson() },
    ]
  );
}

//
//  ─── ГІЛКА 3: Серйозне питання ─────────────────────────────────────────
//
function seriousQuestions() {
  showLesson(
    "Ви питаєте:\n«А чого блискавка саме до пальця тягнеться?»",
    [
      {
        label: "Слухати відповідь",
        onSelect: () => teacherPhysics(),
      },
    ]
  );
}

function teacherPhysics() {
  showLesson(
    "Викладач:\n«Бо ти створюєш точку, де поле сильніше. Струм шукає найкоротший шлях.»",
    [
      {
        label: "А виглядає як фокус!",
        onSelect: () => teacherFinalPhysics(),
      },
    ]
  );
}

function teacherFinalPhysics() {
  showLesson(
    "Викладач:\n«От тому фізика — це чарівність у поясненнях.»",
    [
      { label: "Повернутись на місце", onSelect: () => endLesson() },
    ]
  );
}

//
//  ─── ГІЛКА 4: Відмова ─────────────────────────────────────────
//
function refuseTouch() {
  showLesson(
    "Ви кажете:\n«Та ні, я пас, ще волосся дибки стане…»",
    [
      {
        label: "Прийняти реакцію",
        onSelect: () => teacherRefuse(),
      },
    ]
  );
}

function teacherRefuse() {
  showLesson(
    "Викладач:\n«Ну як хочеш, головне — щоб не від страху.»",
    [
      {
        label: "Спостерігати, як пробує інший студент",
        onSelect: () => {
          triggerLightning();
          endLesson();
        },
      },
    ]
  );
}

//
//  ─── ФІНАЛ ─────────────────────────────────────────
//
function endLesson() {
  showLesson(
    "Ну от, експеримент пройшов успішно. Усі повертаються на місця.\n\nВикладач:\n«Фізика — не страшна. Просто інколи блискавки ви бачите на власні очі.»",
    [
      { label: "Вийти з кабінету", onSelect: () => exitClassroom() },
    ]
  );
}

function exitClassroom() {
  setTimeout(() => {
    changeScene(7); // повернення до коридору
    hero.x = 500;
    hero.y = 485;
    hero.targetX = 500;
    hero.targetY = 485;
    isLesson2Done = true;
  }, 0);
}
