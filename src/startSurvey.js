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

// === GOOGLE SHEETS SETTINGS ===
const SHEET_URL = "https://script.google.com/macros/s/AKfycbyIjbcN4ryZSm4IR1EFkqilljTwgzZQcxHWDN1ElTgoofQsp3s306TP-J159wHBnz3g1A/exec";

// === HELPERS ===
function saveToLocal(data) {
  localStorage.setItem("abitData", JSON.stringify(data));
}

function sendToGoogle(data) {
  fetch(SHEET_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }).catch(err => console.log("Google Sheets error:", err));
}

function startGame() {
  startScreen.classList.remove("show");
}

// === BUTTON LOGIC ===

// 1) Майбутній абітурієнт
btnAbit.addEventListener("click", () => {
  abitForm.classList.remove("hidden");
  document.getElementById("startButtons").classList.add("hidden");
});

// 2) Студент / гість
btnStudent.addEventListener("click", startGame);

// 3) Пропустити
btnSkip.addEventListener("click", startGame);

// 4) Хочу інформацію — питаємо телефон
btnYesInfo.addEventListener("click", () => {
  phoneBlock.classList.remove("hidden");
});

// 5) Не хочу інформацію — просто побажання
btnNoInfo.addEventListener("click", () => {
  byeBlock.classList.remove("hidden");

  const data = {
    name: abitName.value || "",
    school: abitSchool.value || "",
    spec: abitSpec.value || "",
    phone: "",
    wantsInfo: false
  };

  saveToLocal(data);
  sendToGoogle(data);
});

// 6) Подтверджує номер → старт гри
btnSubmitPhone.addEventListener("click", () => {
  const data = {
    name: abitName.value || "",
    school: abitSchool.value || "",
    spec: abitSpec.value || "",
    phone: abitPhone.value || "",
    wantsInfo: true
  };

  saveToLocal(data);
  sendToGoogle(data);

  startGame();
});

// 7) Старт гри після “бажаємо успіхів”
btnStartGameFromBye.addEventListener("click", startGame);
