const root = document.documentElement;
let middleContainer = $(".middle-container");
const removeColorElement = document.getElementById("remove-color");
const mixSelectedColorsElement = document.getElementById("mix-selected-colors");
const historyContainer = document.getElementById("history-container");
const history1 = document.getElementById("history1");
const history2 = document.getElementById("history2");
const history3 = document.getElementById("history3");
const history4 = document.getElementById("history4");
const history5 = document.getElementById("history5");
let guessNum = 1;
let numGuessesAllowed = 5;
let gameOver = false;
let youWin = false;
let darkMode = true;
let percentagesList = [];
let startTime = Date.now();
let endTime = Date.now(); // This will change when the game ends

// Get the full date and make it an int that will be used to create a random color.
const currentDate = new Date();
const day = String(currentDate.getDate()).padStart(2, '0');
const month = String(currentDate.getMonth() + 1).padStart(2, '0');
const year = currentDate.getFullYear();
// Format the date as "ddMMYYYY"
const seed = parseInt(`1${day}${month}${year}`);
//console.log("Seed:" + seed);


// let seed = 104082023;

// Create a list of 9 random numbers (between 0 and 255) to create the colors

// Function to generate a random number between 0 and 1 using LCG with a seed
function seededRandom(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Function to generate an array of random numbers with a seed
function generateRandomNumbers(seed, count) {
  // Initialize an array to store the random numbers
  const randomNumbers = [];

  // Generate random numbers and add them to the array
  for (let i = 0; i < count; i++) {
    seed = seededRandom(seed + i); // Change the seed for each number
    randomNumbers.push(seed);
  }

  return randomNumbers;
}

// Generate 9 random numbers with the seed
let randomNumbers = generateRandomNumbers(seed, 9);

// multiply each value in the array by 244
for (let i = 0; i < randomNumbers.length; i++) {
  randomNumbers[i] = Math.floor(randomNumbers[i] * 244);
}

function calculateColorDifferencePercentage(rgb1, rgb2) {
  const distance = Math.sqrt(
    Math.pow(rgb2.r - rgb1.r, 2) +
    Math.pow(rgb2.g - rgb1.g, 2) +
    Math.pow(rgb2.b - rgb1.b, 2)
  );

  const maxDistance = Math.sqrt(195075); // Maximum Euclidean distance between two RGB values (255^2 + 255^2 + 255^2)

  const percentageDifference = (distance / maxDistance) * 100;

  return (100-percentageDifference).toFixed(0);
} 


// console.log(randomNumbers); //The initial set of random numbers

// Split the list into three lists, so we can try to create significantly different colors
// let firstList = randomNumbers.slice(0, 3);
// let secondList = randomNumbers.slice(3, 6);
// let thirdList = randomNumbers.slice(6, 9);

// Function to find the index of the maximum value in a list
// function findMaxIndex(arr) {
//   let maxIndex = 0;
//   for (let i = 1; i < arr.length; i++) {
//     if (arr[i] > arr[maxIndex]) {
//       maxIndex = i;
//     }
//   }
//   return maxIndex;
// }

// Step 1: Find the index of the maximum value in each list
// let firstMaxIndex = findMaxIndex(firstList);
// let secondMaxIndex = findMaxIndex(secondList);
// let thirdMaxIndex = findMaxIndex(thirdList);

// Step 2: Swap the first element of each list with the corresponding maximum value
// [firstList[0], firstList[firstMaxIndex]] = [firstList[firstMaxIndex], firstList[0]];
// [secondList[1], secondList[secondMaxIndex]] = [secondList[secondMaxIndex], secondList[1]];
// [thirdList[2], thirdList[thirdMaxIndex]] = [thirdList[thirdMaxIndex], thirdList[2]];

// Put the three lists back into one list
// randomNumbers = firstList.concat(secondList, thirdList);

// console.log(randomNumbers); // The sorted set of random numbers

// Use the random numbers to create the random color List
let colorList = [];
// Create three random colors
for (let i = 0; i < 3; i++) {
  const r = randomNumbers[i * 3];       // Take the first number, then the fourth, and so on
  const g = randomNumbers[i * 3 + 1];   // Take the second number, then the fifth, and so on
  const b = randomNumbers[i * 3 + 2];   // Take the third number, then the sixth, and so on

  colorList.push({ r, g, b });
}

// Check to see if any of the colors are within 90% similarity
// If they are, generate a new color
// Function to check if any colors in the list are similar and regenerate if necessary
// Function to calculate the similarity between two colors
function calculateColorSimilarity(color1, color2) {
  // Calculate the color difference percentage using the function you provided
  const differencePercentage = calculateColorDifferencePercentage(color1, color2);

  // Check if the difference percentage is within 90% similarity
  return differencePercentage >= 80;
}

// Function to check if any colors in the list are similar and regenerate if necessary
function checkAndRegenerateColors(colorList) {
  let regenerate = false;
  let numRegens = 0;

  for (let i = 0; i < colorList.length - 1; i++) {
    for (let j = i + 1; j < colorList.length; j++) {
      if (calculateColorSimilarity(colorList[i], colorList[j])) {
        // If two colors are similar, regenerate the j-th color
        // Generate 3 random numbers with a new seed
        let moreRandomNumbers = generateRandomNumbers((seed*2), 3);

        // multiply each value in the array by 244
        for (let i = 0; i < moreRandomNumbers.length; i++) {
          moreRandomNumbers[i] = Math.floor(moreRandomNumbers[i] * 244);
        }

        colorList[j] = { r: moreRandomNumbers[0], g: moreRandomNumbers[1], b: moreRandomNumbers[2] };

        // Set the flag to indicate that colors need to be regenerated
        regenerate = true;
        numRegens += 1;
      }
    }
  }

  // If any colors were regenerated, loop and recheck
  while (regenerate) {
    regenerate = false;
    for (let i = 0; i < colorList.length - 1; i++) {
      for (let j = i + 1; j < colorList.length; j++) {
        if (calculateColorSimilarity(colorList[i], colorList[j])) {
          // If two colors are similar, regenerate the j-th color
          // Generate 3 random numbers with a new seed
          let moreRandomNumbers = generateRandomNumbers((seed*(numRegens+1)), 3);
  
          // multiply each value in the array by 244
          for (let i = 0; i < moreRandomNumbers.length; i++) {
            moreRandomNumbers[i] = Math.floor(moreRandomNumbers[i] * 244);
          }
  
          colorList[j] = { r: moreRandomNumbers[0], g: moreRandomNumbers[1], b: moreRandomNumbers[2] };
  
          // Set the flag to indicate that colors need to be regenerated
          regenerate = true;
          numRegens += 1;
        }
      }
    }
  }

  // console.log(`Num of color regenerations: ${numRegens}`)
}

// Call the function to check and regenerate colors if needed
checkAndRegenerateColors(colorList);



let finalColorList = [] // This list is what will be used to create the target color;
// Get 5 more random numbers. These five numbers will determine which colors are used
let randomNumbersForFinal = generateRandomNumbers((seed*2), 6);

for (let i = 0; i < randomNumbersForFinal.length; i++) {
  finalColorList.push(colorList[(Math.floor(randomNumbersForFinal[i]*3))])
  // Uncomment these lines to show the correct answer in the console
  // const colorForLog = `rgb(${finalColorList[i].r}, ${finalColorList[i].g}, ${finalColorList[i].b})`
  // const logStyle = "background-color: " + colorForLog + "; padding: 5px;";
  // console.log("%c" + "rgb(" + finalColorList[i].r + ", " + finalColorList[i].g + ", " + finalColorList[i].b + ")", logStyle);
}

//console.log(finalColorList);

// Mix the colors to create the target color
const targetColor = mixColors(finalColorList);
const targetColorString = `rgb(${targetColor.r}, ${targetColor.g}, ${targetColor.b})`
// console.log(targetColor);

root.style.setProperty("--target-color", targetColorString);
root.style.setProperty("--color1", `rgb(${colorList[0].r}, ${colorList[0].g}, ${colorList[0].b})`);
root.style.setProperty("--color2", `rgb(${colorList[1].r}, ${colorList[1].g}, ${colorList[1].b})`);
root.style.setProperty("--color3", `rgb(${colorList[2].r}, ${colorList[2].g}, ${colorList[2].b})`);
// root.style.setProperty("--color4", `rgb(${colorList[3].r}, ${colorList[3].g}, ${colorList[3].b})`);


// Set the favicon to be the target color
favicon = $(`<link rel="icon" type="image/svg+xml" href="data:image/svg+xml;charset=utf8,%3Csvg fill='${targetColorString}' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Cpath d='M512 256c0 .9 0 1.8 0 2.7c-.4 36.5-33.6 61.3-70.1 61.3H344c-26.5 0-48 21.5-48 48c0 3.4 .4 6.7 1 9.9c2.1 10.2 6.5 20 10.8 29.9c6.1 13.8 12.1 27.5 12.1 42c0 31.8-21.6 60.7-53.4 62c-3.5 .1-7 .2-10.6 .2C114.6 512 0 397.4 0 256S114.6 0 256 0S512 114.6 512 256zM128 288a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm0-96a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM288 96a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm96 96a32 32 0 1 0 0-64 32 32 0 1 0 0 64z'/%3E%3C/svg%3E">`);
favicon.appendTo(document.head);

// Function to calculate the average of RGB components
function mixColors(colors) {
    if (gameOver) {
        return;
    }
  const totalColors = colors.length;
  let avgR = 0, avgG = 0, avgB = 0;

  for (const color of colors) {
    avgR += color.r;
    avgG += color.g;
    avgB += color.b;
  }

  avgR = Math.round(avgR / totalColors);
  avgG = Math.round(avgG / totalColors);
  avgB = Math.round(avgB / totalColors);

  return { r: avgR, g: avgG, b: avgB };
  //return `rgb(${avgR}, ${avgG}, ${avgB})`;
}

// Function to format time in HH:mm:ss format
function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(secs).padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}
// Start countdown till next color function
function startCountdown(seconds) {
  $("#target-color").html('<div class="next-color-timer"><div>Next color</div><div id="timer"></div></div>')
  $(".next-color-timer:first-child").animate({"opacity": "1"}, 500);
  let remainingTime = seconds;

  // Update the timer display every second
  const intervalId = setInterval(() => {
    document.getElementById('timer').textContent = formatTime(remainingTime);

    if (remainingTime === 0) {
      clearInterval(intervalId);
      //Start new game
      setTimeout(() => {location.reload()}, 2000);
    } else {
      remainingTime--;
    }
  }, 1000);
}
// Function to call when the user wins
function youWinFunction() {
  youWin = true;
  let winSpan = $('<span class="you-win">You Win!</span>');
  $(middleContainer).html(winSpan);
  winSpan.animate({ opacity: 1 }, 500);
  startCountdown(getTimeUntilMidnightInSeconds());
  showShareButton();
}

function gameOverFunction() {
  gameOver = true;
  gameOverText = $('<div class="game-over">Game Over</div>')
  $(middleContainer).css({"flex-direction": "column", "height": "fit-content", "opacity": "0"});
  $(middleContainer).html(gameOverText);
  let correctAnswer = '<div class="correct-answer-text"><span>Correct Answer:</span></div><div class="history-item" style="opacity: 1">'
  for (let i = 0; i < finalColorList.length; i++) {
    correctAnswer += `<div class="selected-color" style="background-color: rgb(${finalColorList[i].r},${finalColorList[i].g},${finalColorList[i].b});"></div>`
  }
  correctAnswer += "</div>"
  correctAnswerElement = $(correctAnswer);
  $(middleContainer).append(correctAnswerElement);
  $(middleContainer).animate({opacity: 1}, 500);
  startCountdown(getTimeUntilMidnightInSeconds());
  showShareButton();
}

// function formatTime(seconds) {
//   const minutes = Math.floor(seconds / 60);
//   const remainingSeconds = seconds % 60;
  
//   return `${minutes} minutes and ${remainingSeconds} seconds`;
// }

function showShareButton() {
  // Remove the onclick attributes from the given colors
  $("#given-colors").children().each(function() {
    $(this).removeAttr("onclick");
  });

  const givenColor2 = $("#given-color2");
  const shareButton = $("<div id='share-button'></div>");
  const shareText = $(`
  <span class="share-text">Share</span>
  <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 0 384 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M280 64h40c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128C0 92.7 28.7 64 64 64h40 9.6C121 27.5 153.3 0 192 0s71 27.5 78.4 64H280zM64 112c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16H320c8.8 0 16-7.2 16-16V128c0-8.8-7.2-16-16-16H304v24c0 13.3-10.7 24-24 24H192 104c-13.3 0-24-10.7-24-24V112H64zm128-8a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"/></svg>
  `);
  shareButton.html(shareText);
  givenColor2.html(shareButton);
  givenColor2.click(function() {
    // Get the result (num of guesses)
    let result = "";
    if (guessNum == 1) {
      result = `${guessNum}/${numGuessesAllowed} 👑`;
    }
    else if (gameOver) {
      result = "Fail 🤡";
    }
    else {
      result = `${guessNum}/${numGuessesAllowed}`;
    }

    // Get the time elapsed
    let timeElapsed = formatTime((endTime - startTime) / 1000);
    let clipboardText = `Color Crafter: ${result}\nTime: ${timeElapsed}\nPercentages: `;
    for (let i = 0; i < percentagesList.length; i++) {
      clipboardText += percentagesList[i]
      if (i != percentagesList.length - 1) {
        clipboardText += ", ";
      }
    }

    navigator.clipboard.writeText(clipboardText);
    resultsCopiedText = $('<span class="copied-to-clipboard">Copied!<span>')
    shareButton.html(resultsCopiedText);
    resultsCopiedText.animate({opacity: 1}, 500)
    .delay(1000)
    .animate({opacity: 0}, 500, function() {
      shareButton.html(shareText);
    });
  })
}

function mixSelectedColors() {
    let selectedColorsContainer = document.getElementById("selected-colors");
    let selectedColors = Array.from(selectedColorsContainer.children);
    const selectedColorsLength = selectedColors.length;
    let selectedColorsList = [];
    let historyItem = document.getElementById("history"+guessNum);
    for (let i = 0; i < selectedColorsLength; i++) {
        let color = window.getComputedStyle(selectedColors[i]).backgroundColor;
        let colorDict = convertColorToDictionary(color);
        selectedColorsList.push(colorDict);
        let selectedColorCopy = selectedColors[i].cloneNode(true);
        selectedColorCopy.removeAttribute("id");
        historyItem.appendChild(selectedColorCopy);
    }

    //selectedColorsContainer.innerHTML = ""; // Clear out the selected colors
    removeColorElement.style.opacity = 0;
    mixSelectedColorsElement.style.opacity = 0;

    let colorResult = mixColors(selectedColorsList);

    let colorPercentageDifference = calculateColorDifferencePercentage(targetColor, colorResult)
    // Add this to the percentage list
    percentagesList.push(colorPercentageDifference + "%");

    let craftedColor = `rgb(${colorResult.r}, ${colorResult.g}, ${colorResult.b})`
    // Grab the left middle box. This will become the Crafted Color Box
    let craftedColorBox = document.getElementById("selected-color3");
    // Make the left middle selected color grow first (this growth happens while the other colors merge into it)
    // Make the left middle color turn into the color that the user crafted
    $(craftedColorBox).css({'background-color': craftedColor, padding: '10px'});
    // Calculate the slide distance for the middle boxes
    // Get the screen width
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    // Set the default slide distance
    let xSlideDistance = '8.5%';

    // Check if the screen width matches any breakpoint and update the slide distance if applicable
    if (screenWidth <= 412) {
      xSlideDistance = '7%';
    }
    else if (screenHeight <= 1200) {
      xSlideDistance = '7%';
    }
    // Animate the other colors so they overlap on top of the middle color and fade away
    $("#selected-color1").animate({left: '43%', opacity: 0}, 500);
    $("#selected-color2").animate({left: '22%', opacity: 0}, 500);
    $("#selected-color3").animate({left: xSlideDistance}, 500);
    $("#selected-color4").animate({right: xSlideDistance, opacity: 0}, 500);
    $("#selected-color5").animate({right: '22%', opacity: 0}, 500);
    $("#selected-color6").animate({right: '43%', opacity: 0}, 500, function() {
        // Now make the middle color rise up into the target color to see how similar they are

        // Set the default slide distance
        let ySlideDistance = '145px';

        // Check if the screen width matches any breakpoint and update the slide distance if applicable
        if (screenWidth <= 412) {
          ySlideDistance = '120px';
        }
        else if (screenHeight <= 1200) {
          ySlideDistance = '120px';
        }

        $(craftedColorBox).animate({bottom: ySlideDistance}, 1000, function() {
            // Add the similarity percentage to the crafted color
            let similarityPercentage = $('<span class="percent-span">'+colorPercentageDifference+'%</span>');
            $(craftedColorBox).append(similarityPercentage);
            $(similarityPercentage).animate({opacity: 1}, 500);
            $(craftedColorBox).delay(1000).animate({ opacity: 0}, 1000, function() {
              let craftedColorBoxCopy = craftedColorBox.cloneNode(true);
              craftedColorBoxCopy.removeAttribute("id");
              craftedColorBoxCopy.style.bottom = '0';
              let resultArrow = $('<div class="result-arrow"><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/></svg></div>');
              $(historyItem).append(resultArrow);
              $(historyItem).append(craftedColorBoxCopy);
              $(craftedColorBoxCopy).css({"opacity": "1", "left": "0"}); // Set the opacity back to 1 on the craftedColorBoxCopy
              $(historyItem).animate({ opacity: 1 }, 500);
              selectedColorsContainer.innerHTML = ""; // Clear out the selected colors
  
              //Check to see if the user wins
              if (colorResult.r==targetColor.r & colorResult.g==targetColor.g & colorResult.b==targetColor.b) {
                youWinFunction();
                confetti({
                  particleCount: 100,   // Number of confetti particles
                  spread: 70,           // Spread of particles
                  origin: { y: 0.6 },   // Starting point (top of the element)
                });
                endTime = Date.now();
                setGameState();
                return;
              }
          
              // Check to see if it's game over
              if (guessNum == numGuessesAllowed) {
                  gameOverFunction();
                  endTime = Date.now();
                  setGameState();
                  return;
              }

              // Increment the guess number
              guessNum += 1;
              // Use cookies to preserve the game state if the user refreshes
              setGameState();
            })
        });
    });

}

function convertColorToDictionary(color) {
    const regex = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/;
    const matches = color.match(regex);
    if (matches && matches.length === 4) {
      return {
        r: parseInt(matches[1]),
        g: parseInt(matches[2]),
        b: parseInt(matches[3])
      };
    }
    return null;
} 

function selectColor(element) {
    if (gameOver) {
        return;
    }
    $(element).animate({"box-shadow": "0, 0, 0"}, 500);
    let selectedColorsCount = document.getElementById("selected-colors").childElementCount;
    if (selectedColorsCount >= 6) {
      if (element.childElementCount == 0) {
        tooMany = $('<span class="too-many">You can only select 6 colors<span>');
        $(element).append(tooMany);
        $(tooMany).animate({opacity: 1}, 500)
        .delay(1000)
        .animate({opacity: 0}, 500, function() {
          $(tooMany).remove();
        });
      }
      return;
    }
    if (selectedColorsCount == 5) {
        mixSelectedColorsElement.style.opacity = 100;
        $(mixSelectedColorsElement).css({ "opacity": "100", "pointer-events": "all"})
    }

    if (window.getComputedStyle(removeColorElement).opacity == 0) {
        $(removeColorElement).css({ "opacity": "1", "pointer-events": "all" });
    }

    let selectedColor = document.createElement("div");
    selectedColor.id = "selected-color"+(selectedColorsCount+1);
    selectedColor.classList.add("selected-color");
    selectedColor.style.backgroundColor = window.getComputedStyle(element).backgroundColor;
    let chosenColors = document.getElementById("selected-colors");
    chosenColors.appendChild(selectedColor);

}

function removeColor() {
    if (gameOver) {
        return;
    }
    let selectedColors = document.getElementById("selected-colors").children;
    if (selectedColors.length > 0) {
        selectedColors[selectedColors.length - 1].remove();
    }
    if (selectedColors.length == 0) {
        $(removeColorElement).css({ "opacity": "0", "pointer-events": "none" });
    }
    if (mixSelectedColorsElement.style.opacity != 0) {
        // This can always be removed because we only need it at 5
        $(mixSelectedColorsElement).css({ "opacity": "0", "pointer-events": "none" });
    }
}

function toggleDarkMode() {
  if (darkMode) {
    root.style.setProperty("--text-color", "#202124");
    root.style.setProperty("--body-background", "#fffcf2");
    darkMode = false;
  }
  else {
    root.style.setProperty("--text-color", "white");
    root.style.setProperty("--body-background", "#202124");
    darkMode = true;
  }
  setGameState();
}

// Function to check the user's preferred theme (light or dark)
const prefersDarkTheme = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
if (prefersDarkTheme) {
  // User prefers dark theme
  
} else {
  // User prefers light theme
  toggleDarkMode();
}


// Check to see if the user has already played today using cookies

// Function to set a cookie with a specified name, value, and expiration date
function setCookie(name, value, seconds) {
  const date = new Date();
  date.setTime(date.getTime() + (seconds));
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// Function to get the time remaining until midnight in seconds
function getTimeUntilMidnightInSeconds() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0); // Set time to midnight
  const timeUntilMidnight = midnight.getTime() - now.getTime();
  return Math.floor(timeUntilMidnight / 1000); // Convert to seconds
}

// Function to get the value of a cookie by its name
function getCookie(name) {
  const cookieName = name + "=";
  const cookieArray = document.cookie.split(';');
  for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i];
      while (cookie.charAt(0) === ' ') {
          cookie = cookie.substring(1);
      }
      if (cookie.indexOf(cookieName) === 0) {
          return cookie.substring(cookieName.length, cookie.length);
      }
  }
  return "";
}

// Function to check if the user has played the game today
function hasPlayedToday() {
  const playedToday = getCookie("played_today");
  return playedToday;
}

// Function to set the current state of the game
function setGameState() {
  let inProgress = false;
  if (guessNum > 1) {
    inProgress = true;
  }
  // If it isn't game over and the user hasn't won, then inProgress will stay true.
  if (youWin || gameOver) {
    inProgress = false;
  }
  let gameData = {
    you_win: youWin,
    game_over: gameOver,
    in_progress: inProgress,
    dark_mode: darkMode,
    guess_num: guessNum,
    start_time: startTime,
    end_time: endTime,
    history: [],
  };

  let historyItems = $(historyContainer).children();
  for (let i = 0; i < historyItems.length; i++) {
    if (historyItems[i].childElementCount == 8) {
      let historyJson = {};
      let resultJson = {};

      for (let y = 0; y < historyItems[i].childElementCount; y++) {
        if (y <= 5) {
          let historyElement = historyItems[i].children[y];
          historyJson["choice" + (y + 1)] = window.getComputedStyle(historyElement).backgroundColor;
        }
        if (y == 7) {
          let resultElement = historyItems[i].children[y];
          resultJson["resultColor"] = window.getComputedStyle(resultElement).backgroundColor;
          let resultText = resultElement.children[0];
          resultJson["resultPercent"] = resultText.innerHTML;
        }
      }

      gameData.history.push({
        history: historyJson,
        result: resultJson,
      });
    }
  }

  // Convert the gameData object to a JSON string
  const gameDataJsonString = JSON.stringify(gameData);

  // Set the "game_data" cookie with the JSON string
  document.cookie = "game_data=" + encodeURIComponent(gameDataJsonString) + "; max-age=" + getTimeUntilMidnightInSeconds();
}

// Get the game data cookie. This has all of the data we need to maintain the state of the game.
const gameDataCookie = getCookie("game_data");

if (gameDataCookie) {
  // Parse the JSON data from the cookie
  const gameData = JSON.parse(decodeURIComponent(gameDataCookie));

  // Set dark mode
  if (!gameData.dark_mode == darkMode) {
    toggleDarkMode();
  }
  // Set the guess number
  guessNum = gameData.guess_num;
  // Fill in the history items
  for (let i = 1; i <= 5; i++) {
    let historyHtml = "";
    // Access the history object with the index (i-1) since arrays are 0-based
    const historyItem = gameData.history[i - 1];

    if (historyItem) {
      // Set background colors based on history data
      for (let j = 1; j <= 6; j++) {
        const choiceKey = "choice" + j;
        const choiceColor = historyItem.history[choiceKey];
        historyHtml += `<div class="selected-color" style="background-color: ${choiceColor};"></div>`;
      }

      // Add the arrow between the choices and result
      historyHtml += '<div class="result-arrow"><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/></svg></div>'

      // Set the result background color and result percentage text
      const resultColor = historyItem.result.resultColor;
      const resultPercent = historyItem.result.resultPercent;
      historyHtml += `<div class="selected-color" style="background-color: ${resultColor}; padding: 10px;"><span class="percent-span" style="opacity: 1">${resultPercent}</span></div>`;

      // Add the historyDiv to the historyContainer element
      $("#history"+i).css({"opacity": "1"}).html(historyHtml);

      // Append the current percent to the percentages list
      percentagesList.push(resultPercent);
    }
  }

  // Check to see if there was a start time
  if (gameData.start_time) {
    startTime = new Date(gameData.start_time);
  }
  // Check to see if there was an end time
  if (gameData.end_time) {
    endTime = new Date(gameData.end_time);
  }

  // Check to see if the user won
  if (gameData.you_win) {
    youWinFunction();
  }
  // Check to see if the user lost
  if (gameData.game_over) {
    gameOverFunction();
  }
  // Check to see if the game is in progress
  if (gameData.in_progress) {
    // Get the second modal
    var modal3 = document.getElementById("myModal3");
    // Show the modal
    modal3.style.display = "block";
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[2];
    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
      modal3.style.display = "none";
    }
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target == modal3) {
        modal3.style.display = "none";
      }
    }
  }
}

// else {
//     // Do whatever you want the play button to do here.
//     // For example, start the game, show a modal, etc.

//     // Once the user has played the game, set the cookie to mark today as played.
//     setCookie("played_today", "true", getTimeUntilMidnightInSeconds());
// }

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("modalButton");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Get the second modal
var modal2 = document.getElementById("myModal2");

// Get the button that opens the modal
var btn = document.getElementById("modalButton2");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[1];

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal2.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal2.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal2) {
    modal2.style.display = "none";
  }
}

function continueGame() {
  var modal3 = document.getElementById("myModal3");
  modal3.style.display = "none";
}

  