// Playground run
document.getElementById("runBtn").addEventListener("click", () => {
  const code = document.getElementById("code").value;
  const iframe = document.getElementById("preview");
  iframe.srcdoc = code;
});

// Load quiz dari JSON
let quizData = {};
let currentTopic = "html";

fetch("quiz/quiz_data.json")
  .then((response) => response.json())
  .then((data) => {
    quizData = data;
    renderQuiz();
  })
  .catch((error) => console.error("Error loading quiz:", error));

// Handle topic change
document.getElementById("quizTopic").addEventListener("change", (e) => {
  currentTopic = e.target.value;
  renderQuiz();
});

function renderQuiz() {
  const container = document.getElementById("quizContainer");
  container.innerHTML = "";
  if (!quizData[currentTopic]) return;
  quizData[currentTopic].forEach((item, idx) => {
    const div = document.createElement("div");
    div.className = "q";
    div.innerHTML = `<p><strong>${idx + 1}.</strong> ${item.q}</p>`;
    item.choices.forEach((c, i) => {
      const id = `q${idx}c${i}`;
      div.innerHTML += `
        <label for="${id}">
          <input type="radio" name="q${idx}" value="${i}" id="${id}"> ${c}
        </label>`;
    });
    container.appendChild(div);
  });
}

document.getElementById("submitQuiz").addEventListener("click", () => {
  if (!quizData[currentTopic]) return;
  let score = 0;
  let total = quizData[currentTopic].length;
  let allAnswered = true;

  quizData[currentTopic].forEach((item, idx) => {
    const radios = document.getElementsByName(`q${idx}`);
    let answered = false;
    for (const r of radios) {
      if (r.checked) {
        answered = true;
        if (parseInt(r.value) === item.ans) score++;
      }
    }
    if (!answered) allAnswered = false;
  });

  const resultDiv = document.getElementById("quizResult");
  if (!allAnswered) {
    resultDiv.textContent = "Jawab semua pertanyaan dulu!";
    resultDiv.className = "result error";
  } else {
    resultDiv.textContent = `Skor: ${score} / ${total} (${Math.round(
      (score / total) * 100
    )}%)`;
    resultDiv.className = "result success";
  }
});
