export function showFinalMessage() {
  const box = document.getElementById("finalMsg");
  if (!box) return;

  box.classList.add("show");

  setTimeout(() => {
    box.classList.remove("show");
  }, 3000);
}

export function showGameCompleted() {
  const box = document.getElementById("gameWin");
  if (!box) return;

  box.classList.add("show");

  setTimeout(() => {
    box.classList.remove("show");
  }, 40000);
}
