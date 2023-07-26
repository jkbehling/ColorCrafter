const root = document.documentElement;
let middleContainer = $(".middle-container");
const removeColorElement = document.getElementById("remove-color");
const mixSelectedColorsElement = document.getElementById("mix-selected-colors");
const historyItem = document.getElementById("history-container");
const history1 = document.getElementById("history1");
const history2 = document.getElementById("history2");
const history3 = document.getElementById("history3");
const history4 = document.getElementById("history4");
const history5 = document.getElementById("history5");
let guessNum = 1;
let gameOver = false;
let darkMode = true;

// // Get the full date and make it an int that will be used to create a random color.
// const currentDate = new Date();
// const day = String(currentDate.getDate()).padStart(2, '0');
// const month = String(currentDate.getMonth() + 1).padStart(2, '0');
// const year = currentDate.getFullYear();
// // Format the date as "ddMMYYYY"
// const seed = parseInt(`1${day}${month}${year}`);
// console.log("Seed:" + seed);


let seed = 131072023;

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


// console.log(randomNumbers); //The initial set of random numbers

// Split the list into three lists, so we can try to create significantly different colors
let firstList = randomNumbers.slice(0, 3);
let secondList = randomNumbers.slice(3, 6);
let thirdList = randomNumbers.slice(6, 9);

// Function to find the index of the maximum value in a list
function findMaxIndex(arr) {
  let maxIndex = 0;
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > arr[maxIndex]) {
      maxIndex = i;
    }
  }
  return maxIndex;
}

// Step 1: Find the index of the maximum value in each list
let firstMaxIndex = findMaxIndex(firstList);
let secondMaxIndex = findMaxIndex(secondList);
let thirdMaxIndex = findMaxIndex(thirdList);

// Step 2: Swap the first element of each list with the corresponding maximum value
[firstList[0], firstList[firstMaxIndex]] = [firstList[firstMaxIndex], firstList[0]];
[secondList[1], secondList[secondMaxIndex]] = [secondList[secondMaxIndex], secondList[1]];
[thirdList[2], thirdList[thirdMaxIndex]] = [thirdList[thirdMaxIndex], thirdList[2]];

// Put the three lists back into one list
randomNumbers = firstList.concat(secondList, thirdList);

// console.log(randomNumbers); // The sorted set of random numbers

// Use the random numbers to create the random color List
const colorList = [];
// Create three random colors
for (let i = 0; i < 3; i++) {
  const r = randomNumbers[i * 3];       // Take the first number, then the fourth, and so on
  const g = randomNumbers[i * 3 + 1];   // Take the second number, then the fifth, and so on
  const b = randomNumbers[i * 3 + 2];   // Take the third number, then the sixth, and so on

  colorList.push({ r, g, b });
}

let finalColorList = [] // This list is what will be used to create the target color;
// Get 5 more random numbers. These five numbers will determine which colors are used
let randomNumbersForFinal = generateRandomNumbers((seed*2), 5);

for (let i = 0; i < randomNumbersForFinal.length; i++) {
  finalColorList.push(colorList[(Math.floor(randomNumbersForFinal[i]*3))])
  const colorForLog = `rgb(${finalColorList[i].r}, ${finalColorList[i].g}, ${finalColorList[i].b})`
  const logStyle = "background-color: " + colorForLog + "; padding: 5px;";
  console.log("%c" + "rgb(" + finalColorList[i].r + ", " + finalColorList[i].g + ", " + finalColorList[i].b + ")", logStyle);
}

console.log(finalColorList);

// Mix the colors to create the target color
const targetColor = mixColors(finalColorList);
// console.log(targetColor);

root.style.setProperty("--target-color", `rgb(${targetColor.r}, ${targetColor.g}, ${targetColor.b})`);
root.style.setProperty("--color1", `rgb(${colorList[0].r}, ${colorList[0].g}, ${colorList[0].b})`);
root.style.setProperty("--color2", `rgb(${colorList[1].r}, ${colorList[1].g}, ${colorList[1].b})`);
root.style.setProperty("--color3", `rgb(${colorList[2].r}, ${colorList[2].g}, ${colorList[2].b})`);


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

    let craftedColor = `rgb(${colorResult.r}, ${colorResult.g}, ${colorResult.b})`
    // Grab the middle box. This will become the Crafted Color Box
    let craftedColorBox = document.getElementById("selected-color3");
    // Make the middle selected color grow first (this growth happens while the other colors merge into it)
    // Make the middle color turn into the color that the user crafted
    //$(craftedColorBox).css({'background-color': craftedColor, width: '65px', height: '65px'});
    $(craftedColorBox).css({'background-color': craftedColor, padding: '10px'});
    // Animate the other colors so they overlap on top of the middle color and fade away
    $("#selected-color1").animate({left: '43%', opacity: 0}, 500);
    $("#selected-color2").animate({left: '22%', opacity: 0}, 500);
    $("#selected-color4").animate({right: '22%', opacity: 0}, 500);
    $("#selected-color5").animate({right: '43%', opacity: 0}, 500, function() {
        // Now make the middle color rise up into the target color to see how similar they are
        // Get the screen width
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        // Set the default slide distance
        let slideDistance = '145px';

        // Check if the screen width matches any breakpoint and update the slide distance if applicable
        if (screenWidth <= 412) {
          slideDistance = '120px';
        }
        else if (screenHeight <= 1200) {
          slideDistance = '120px';
        }

        $(craftedColorBox).animate({bottom: slideDistance}, 1000, function() {
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
              $(craftedColorBoxCopy).css("opacity", "1"); // Set the opacity back to 1 on the craftedColorBoxCopy
              $(historyItem).animate({ opacity: 1 }, 500);
              selectedColorsContainer.innerHTML = ""; // Clear out the selected colors
  
              //Check to see if the user wins
              if (colorResult.r==targetColor.r & colorResult.g==targetColor.g & colorResult.b==targetColor.b) {
                let winSpan = $('<span class="you-win">You Win!</span>');
                $("#selected-colors").append(winSpan);
                winSpan.animate({ opacity: 1 }, 500);
                return;
  
              }
          
              // Increment the guess number
              guessNum += 1;
          
              // Check to see if it's game over
              if (guessNum == 6) {
                  gameOver = true;
                  gameOverText = $('<div class="game-over">Game Over</div>')
                  $(middleContainer).html(gameOverText);
                  $(gameOverText).animate({opacity: 1}, 500);
                  //selectedColorsContainer.innerHTML = ;
                  return;
              }
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

function selectColor(element) {
    if (gameOver) {
        return;
    }
    let selectedColorsCount = document.getElementById("selected-colors").childElementCount;
    if (selectedColorsCount >= 5) {
      if (element.childElementCount == 0) {
        tooMany = $('<span class="too-many">You can only select 5 colors<span>');
        $(element).append(tooMany);
        $(tooMany).animate({opacity: 1}, 500)
        .delay(1000)
        .animate({opacity: 0}, 500, function() {
          $(tooMany).remove();
        });
      }
      return;
    }
    if (selectedColorsCount == 4) {
        mixSelectedColorsElement.style.opacity = 100;
    }
    let removeColor = document.getElementById("remove-color");
    if (window.getComputedStyle(removeColor).opacity == 0) {
        removeColor.style.opacity = 100;
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
        removeColorElement.style.opacity = 0;
    }
    if (mixSelectedColorsElement.style.opacity != 0) {
        // This can always be removed because we only need it at 5
        mixSelectedColorsElement.style.opacity = 0; 
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
}

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

  