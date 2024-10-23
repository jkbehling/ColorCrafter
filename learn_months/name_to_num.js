const fastTime = 18;

function getQuestionText() {
    return `What is the month number for ${months[currentQuestion][0]}?`;
}

document.querySelector("body").addEventListener("keyup", function (e) {
    if (e.key === "Enter" && !gameStarted) {
        document.querySelector("#start-quiz").click();
    }
    else if (e.key === "Enter" && gameStarted) {
        const answer = document.querySelector("#answer").value;
        if (parseInt(answer) === months[currentQuestion][1]) {
            score++;
        }
        currentQuestion++;
        if (currentQuestion < months.length) {
            document.querySelector("#question").innerText = getQuestionText();
            document.querySelector("#answer").value = "";
        } else {
            document.querySelector("#question").innerText = getResultsText();
            document.querySelector("#answer").style.display = "none";
            gameStarted = false;
            stopTimer();
        }
    }
    else if (e.key === "r") {
        document.querySelector("#reset-quiz").click();
    }
});