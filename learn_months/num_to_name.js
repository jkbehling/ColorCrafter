const fastTime = 22;

function setupChoices() {
    let choices = [months[currentQuestion][0]];
    // select two random months
    while (choices.length < 3) {
        let randomMonth = months[Math.floor(Math.random() * months.length)][0];
        if (!choices.includes(randomMonth)) {
            choices.push(randomMonth);
        }
    }
    // shuffle the choices
    choices = choices.sort(() => Math.random() - 0.5);
    // Populate the choices
    document.querySelector("#answer").innerHTML = `
        <div class="choices">
            <div onclick="selectChoice('${choices[0]}')">
                <h3>${choices[0]}</h3>
                <p>(Press 1)</p>
            </div>
            <div onclick="selectChoice('${choices[1]}')">
                <h3>${choices[1]}</h3>
                <p>(Press 2)</p>
            </div>
            <div onclick="selectChoice('${choices[2]}')">
                <h3>${choices[2]}</h3>
                <p>(Press 3)</p>
            </div>
        </div>
    `;
}

function selectChoice(answer) {
    if (answer === months[currentQuestion][0]) {
        score++;
    }
    currentQuestion++;
    if (currentQuestion < months.length) {
        document.querySelector("#question").innerText = getQuestionText();
        setupChoices();
    } else {
        document.querySelector("#question").innerText = getResultsText();
        document.querySelector("#answer").style.display = "none";
        gameStarted = false;
        stopTimer();
    }
}

function getQuestionText() {
    return `What is month number ${months[currentQuestion][1]}?`;
}

document.querySelector("body").addEventListener("keyup", function (e) {;
    if (e.key === "Enter" && !gameStarted) {
        document.querySelector("#start-quiz").click();
    }
    else if (e.key === '1' && gameStarted) {
        document.querySelector("#answer > div.choices").children[0].click();
    }
    else if (e.key === '2' && gameStarted) {
        document.querySelector("#answer > div.choices").children[1].click();
    }    
    else if (e.key === '3' && gameStarted) {
        document.querySelector("#answer > div.choices").children[2].click();
    }    
    else if (e.key === "r") {
        document.querySelector("#reset-quiz").click();
    }
});