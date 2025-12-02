// === ELEMENTS ===
const startScreen = document.getElementById("startScreen");
const btnAbit = document.getElementById("btnAbit");
const btnStudent = document.getElementById("btnStudent");
const btnSkip = document.getElementById("btnSkip");

const abitForm = document.getElementById("abitForm");
const abitName = document.getElementById("abitName");
const abitSchool = document.getElementById("abitSchool");
const abitSpec = document.getElementById("abitSpec");

const btnYesInfo = document.getElementById("btnYesInfo");
const btnNoInfo = document.getElementById("btnNoInfo");

const phoneBlock = document.getElementById("phoneBlock");
const abitPhone = document.getElementById("abitPhone");
const btnSubmitPhone = document.getElementById("btnSubmitPhone");

const byeBlock = document.getElementById("byeBlock");
const btnStartGameFromBye = document.getElementById("btnStartGameFromBye");

// === GOOGLE FORM URL ===
const GOOGLE_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLScwKh4w8TQ2gKNci0YvOZ8zg3G19t0jhadFmF6q-Mzz8zgVHg/formResponse";

// === LOCAL STORAGE SAVE ===
function saveToLocal(data) {
  localStorage.setItem("abitData", JSON.stringify(data));
}

// === SEND TO GOOGLE FORM (ALWAYS SEND ALL FIELDS) ===
function sendToGoogleForm(isInfoWanted) {
  const fd = new FormData();

  // NAME
  fd.append(
    "entry.1527170952",
    abitName.value.trim() !== "" ? abitName.value.trim() : "--"
  );

  // SCHOOL
  fd.append(
    "entry.542459924",
    abitSchool.value.trim() !== "" ? abitSchool.value.trim() : "--"
  );

  // SPEC
  fd.append(
    "entry.1136122744",
    abitSpec.value.trim() !== "" ? abitSpec.value.trim() : "--"
  );

  // PHONE (even if they don't want — send "--")
  fd.append(
    "entry.1139989332",
    isInfoWanted
      ? (abitPhone.value.trim() !== "" ? abitPhone.value.trim() : "--")
      : "--"
  );

  // WANTS INFO
  fd.append("entry.575420519", isInfoWanted ? "Так" : "Ні");

  fetch(GOOGLE_FORM_URL, {
    method: "POST",
    mode: "no-cors",
    body: fd
  }).then(() => console.log("✔ Дані відправлено у Google Form"));
}

// === START GAME ===
function startGame() {
  startScreen.classList.remove("show");
}

// === LOGIC ===

// 1. Майбутній абітурієнт
btnAbit.addEventListener("click", () => {
  abitForm.classList.remove("hidden");
  document.getElementById("startButtons").classList.add("hidden");
});

// 2. Студент / гість
btnStudent.addEventListener("click", startGame);

// 3. Пропустити
btnSkip.addEventListener("click", startGame);

// 4. Хочу інформацію → питаємо телефон
btnYesInfo.addEventListener("click", () => {
  phoneBlock.classList.remove("hidden");
});

// 5. НЕ хоче → бажаємо успіхів + отправка
btnNoInfo.addEventListener("click", () => {
  byeBlock.classList.remove("hidden");

  const data = {
    name: abitName.value || "--",
    school: abitSchool.value || "--",
    spec: abitSpec.value || "--",
    phone: "--",
    wantsInfo: "Ні"
  };

  saveToLocal(data);
  sendToGoogleForm(false);
});

// 6. Підтверджує номер → відправляємо та стартуємо гру
btnSubmitPhone.addEventListener("click", () => {
  const data = {
    name: abitName.value || "--",
    school: abitSchool.value || "--",
    spec: abitSpec.value || "--",
    phone: abitPhone.value || "--",
    wantsInfo: "Так"
  };

  saveToLocal(data);
  sendToGoogleForm(true);
});

// 7. Старт після “Бажаємо успіхів”
btnStartGameFromBye.addEventListener("click", startGame);
