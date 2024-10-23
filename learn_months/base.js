let months = [
    ["January", 1],
    ["February", 2],
    ["March", 3],
    ["April", 4],
    ["May", 5],
    ["June", 6],
    ["July", 7],
    ["August", 8],
    ["September", 9],
    ["October", 10],
    ["November", 11],
    ["December", 12],
];
let gameStarted = false;
let currentQuestion = 0;
let score = 0;
let secondsElapsed = 0;
let timerInterval = null;

function startQuiz(customSetupFunction=null) {
    gameStarted = true;
    currentQuestion = 0;
    score = 0;
    months = months.sort(() => Math.random() - 0.5);
    if (customSetupFunction) {
        customSetupFunction();
    }
    document.querySelector("#start-quiz").style.display = "none";
    document.querySelector("#title").style.display = "none";
    document.querySelector("#question").style.display = "block";
    document.querySelector("#answer").value = "";
    document.querySelector("#answer").style.display = "block";
    document.querySelector("#reset-quiz").style.display = "block";
    document.querySelector("#question").innerText = getQuestionText();
    document.querySelector("#answer").focus();
    startTimer();
}

function startTimer() {
    document.querySelector("#timer").innerText = "Time: 0 seconds";
    secondsElapsed = 0;
    timerInterval = setInterval(() => {
        secondsElapsed++;
        document.querySelector("#timer").innerText = `Time: ${secondsElapsed} seconds`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function resetQuiz() {
    stopTimer();
    document.querySelector("#question").style.display = "none";
    document.querySelector("#answer").style.display = "none";
    document.querySelector("#reset-quiz").style.display = "none";
    document.querySelector("#timer").innerText = "";
    document.querySelector("#title").style.display = "block";
    document.querySelector("#start-quiz").style.display = "block";
    gameStarted = false;
}

function getResultsText() {
    if (score === months.length && secondsElapsed < fastTime) {
        return `⚡🧠 You got ${score} out of ${months.length} correct! 🧠⚡`;
    }
    else if (score === months.length) {
        return `🐢 You got ${score} out of ${months.length} correct. 🐢`;
    }
    else {
        return `🤡 You got ${score} out of ${months.length} correct... 🤡`;
    }
}