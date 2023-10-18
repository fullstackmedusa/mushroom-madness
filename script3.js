console.log("loaded");
const basket = document.getElementById("basket");
const gameContainer = document.getElementById("game-container");
const scoreValue = document.getElementById("score-value");
const winMessage = document.getElementById("win-message");
const loseMessage = document.getElementById("lose-message");

let score = 0;
let basketX = (gameContainer.clientWidth - basket.clientWidth) / 2;
const basketSpeed = 15;
let gameActive = true;

const images = ['imgs/poop.png','imgs/mushroom.png', 'imgs/poop.png', 'imgs/mushroom2.png', 'imgs/mushroom3.png','imgs/poop.png','imgs/mushroom4.png'];
const fallingObjects = []; // Array to store falling objects

function createFallingObjectWithDelay(delay) {
    if (!gameActive) return;
    setTimeout(() => {
        const fallingObject = document.createElement("div");
        fallingObject.className = "falling-object";
        fallingObject.id = `falling-object-${Date.now()}`; // Assign a unique ID
        fallingObject.style.left = Math.random() * (gameContainer.clientWidth - 50) + "px";
        fallingObject.style.top = "-50px";
        fallingObject.style.backgroundImage = `url(${getRandomImage()})`;
        gameContainer.appendChild(fallingObject);
        fallingObjects.push({ element: fallingObject, top: -50 });
        animateFallingObject(fallingObject); // Pass the fallingObject as an argument
    }, delay);
}



function animateFallingObject(fallingObject) {
    const fallingObjectIndex = fallingObjects.findIndex(obj => obj.element === fallingObject);
    if (fallingObjectIndex === -1) return; // Object not found, stop animation

    const fallingObjectData = fallingObjects[fallingObjectIndex];
    const fallingObjectY = fallingObjectData.top;

    fallingObjectData.top = fallingObjectY + 2;
    fallingObject.style.top = fallingObjectData.top + "px";

    if (fallingObjectY > gameContainer.clientHeight && !fallingObjectData.removed) {
        // Remove the current falling object
        fallingObjectData.removed = true;
        gameContainer.removeChild(fallingObject);
        fallingObjects.splice(fallingObjectIndex, 1);

        // Create a new falling object with a delay
        createFallingObjectWithDelay(2000); // Adjust the delay as needed (e.g., 2000 milliseconds)
    } else {
        if (!gameActive) return; // Stop animation when the game is not active
        requestAnimationFrame(() => animateFallingObject(fallingObject));
        checkCollision(fallingObject);
    }
}



function getRandomImage() {
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
}



let mouseMoveActive = true; // Flag to track whether the mousemove event listener is active

// Add event listeners for mousemove and keydown
gameContainer.addEventListener("mousemove", (e) => {
    if (!gameActive || !mouseMoveActive) return;

    const mouseX = e.clientX - gameContainer.getBoundingClientRect().left;
    const basketWidth = 50;
    const maxX = gameContainer.clientWidth - basketWidth;

    const targetX = mouseX - basketWidth / 2;
    basketX = Math.min(maxX, Math.max(0, targetX));

    basket.style.left = basketX + "px";
});

document.addEventListener("keydown", (e) => {
    if (!gameActive) return;

    if (e.key === "ArrowLeft") {
        basketX -= basketSpeed;
    } else if (e.key === "ArrowRight") {
        basketX += basketSpeed;
    }

    const basketWidth = 50;
    const maxX = gameContainer.clientWidth - basketWidth;
    basketX = Math.min(maxX, Math.max(0, basketX));

    basket.style.left = basketX + "px";

    // Disable the mousemove event listener while a key is pressed
    mouseMoveActive = false;
});

document.addEventListener("keyup", () => {
    // Re-enable the mousemove event listener when a key is released
    mouseMoveActive = true;
});



function checkCollision(fallingObject) {
    if (!gameActive) return;

    const basketRect = basket.getBoundingClientRect();
    const fallingObjectRect = fallingObject.getBoundingClientRect();
    const backgroundImage = fallingObject.style.backgroundImage;

    if (
        fallingObjectRect.left < basketRect.right &&
        fallingObjectRect.right > basketRect.left &&
        fallingObjectRect.bottom > basketRect.top &&
        fallingObjectRect.top < basketRect.bottom
    ) {
        if (backgroundImage.includes("poop.png")) {
            console.log("You Lose!");
            clearFallingObjects();
            gameActive = false;
            loseMessage.style.display = "block";
            console.log(gameActive);
        } else {
            console.log("Collision detected");
            score++;
            console.log("Score:", score);
            scoreValue.textContent = score;
            gameContainer.removeChild(fallingObject);
            fallingObjects.splice(fallingObjects.findIndex(obj => obj.element === fallingObject), 1);

            // Create a new falling object with a delay
            createFallingObjectWithDelay(0); // Create a new falling object immediately
        }
    } else if (fallingObjectRect.bottom >= gameContainer.getBoundingClientRect().bottom && gameActive) {
        // Handle the case where the fallingObject reaches the bottom of the gameContainer
        if (!backgroundImage.includes('poop.png')) {
            console.log("mushroom fell");
            score--;
            scoreValue.textContent = score;
        }
        console.log("mushroom fell");
        gameContainer.removeChild(fallingObject);
        fallingObjects.splice(fallingObjects.findIndex(obj => obj.element === fallingObject), 1);

        // Create a new falling object with a delay
        createFallingObjectWithDelay(0); // Create a new falling object immediately
    }

    if (score < 0) {
        console.log("You Lose!");
        scoreValue.textContent = "0";
        loseMessage.style.display = "block";
        
        gameActive = false; // Set gameActive to false after clearing falling objects
        clearFallingObjects();
        console.log(gameActive);
    } else if (score === 10) {
        console.log("You Win!");
        gameActive = false; // Set gameActive to false after clearing falling objects
        clearFallingObjects();
        winMessage.style.display = "block";
        console.log(gameActive);
    }
}


// Function to start the game
function startGame() {
    gameActive = true;
    score = 0;
    scoreValue.textContent = score;
    winMessage.style.display = "none";
    loseMessage.style.display = "none";
    clearFallingObjects();
    // Create the first set of falling objects with delays
    createFallingObjectWithDelay(0);
    createFallingObjectWithDelay(800); // Adjust the delay for the second object
    createFallingObjectWithDelay(1500); // Adjust the delay for the third object
}

function clearFallingObjects() {
    console.log("clear falling objects called")
    for (const fallingObject of fallingObjects) {
        if (fallingObject.element && fallingObject.element.parentNode) {
            // Remove the falling object from the DOM
            fallingObject.element.parentNode.removeChild(fallingObject.element);
        }
    }
    fallingObjects.length = 0; // Clear the fallingObjects array
}


// Start the game initially
startGame();