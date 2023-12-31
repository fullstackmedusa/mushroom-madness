console.log("loaded");
const basket = document.getElementById("basket");
const gameContainer = document.getElementById("game-container");
const scoreValue = document.getElementById("score-value");
const winMessage = document.getElementById("win-message");
const loseMessage = document.getElementById("lose-message");

let score = 0;
let basketX = (gameContainer.clientWidth - basket.clientWidth) / 2;
const basketSpeed = 10;
let gameActive = true;

const images = ['imgs/mushroom.png', 'imgs/poop.png', 'imgs/mushroom2.png', 'imgs/mushroom3.png', 'imgs/mushroom4.png'];
const fallingObjects = []; // Array to store falling objects



// Audio element for the background music
const audio = new Audio('wandering.mp3');
audio.loop = true;
audio.muted = false;
// Sound control span
const soundControl = document.getElementById('sound');
let isMuted = false; // Track whether the audio is muted or not

// Add a click event listener to the sound control span
soundControl.addEventListener('click', toggleSound);

// Function to toggle sound on click
function toggleSound() {
    if (isMuted) {
        // If audio is muted, unmute it and change the icon to 🔈
        audio.play();
        soundControl.innerText = '🔈';
        isMuted = false;
    } else {
        // If audio is not muted, mute it and change the icon to 🔇
        audio.pause();
        soundControl.innerText = '🔇';
        isMuted = true;
    }
}





function createFallingObject() {
    const fallingObject = document.createElement("div");
    fallingObject.className = "falling-object";
    fallingObject.style.left = Math.random() * (gameContainer.clientWidth - 50) + "px";
    fallingObject.style.top = "-50px";
    fallingObject.style.backgroundImage = `url(${getRandomImage()})`;
    gameContainer.appendChild(fallingObject);
    fallingObjects.push({ element: fallingObject, top: -50 });
    animateFallingObject(fallingObject); // Pass the fallingObject as an argument
}

function animateFallingObject(fallingObject) {
    if (!gameActive) return;

    const fallingObjectIndex = fallingObjects.findIndex(obj => obj.element === fallingObject);
    if (fallingObjectIndex === -1) return; // Object not found, stop animation

    const fallingObjectData = fallingObjects[fallingObjectIndex];
    const fallingObjectY = fallingObjectData.top;

    fallingObjectData.top = fallingObjectY + 2;
    fallingObject.style.top = fallingObjectData.top + "px";

    // Check for collision with the basket
    checkCollision(fallingObject);

    if (fallingObjectY > gameContainer.clientHeight && !fallingObjectData.removed) {
        // Remove the current falling object
        fallingObjectData.removed = true;
        gameContainer.removeChild(fallingObject);
        fallingObjects.splice(fallingObjectIndex, 1);

        // Create a new falling object with a delay
        createFallingObjectWithDelay(0); // Create a new falling object immediately
    } else {
        requestAnimationFrame(() => animateFallingObject(fallingObject));
    }
}

// Rest of the code remains the same










function getRandomImage() {
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
}

// Add event listeners for mousemove and keydown
gameContainer.addEventListener("mousemove", (e) => {
    if (!gameActive) return;

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
});

// Function to stop the background music
function stopBackgroundMusic() {
    audio.pause();
}

// Function to end the game
function endGame(isWin) {
    gameActive = false;

    // Call the stopBackgroundMusic function to stop the music
    stopBackgroundMusic();

    // Display the win or lose message
    if (isWin) {
        console.log("You Win!");
        winMessage.style.display = "block";
    } else {
        console.log("You Lose!");
        loseMessage.style.display = "block";
    }
}

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
            loseMessage.style.display = "block";
            gameActive = false;
        } else if (score === 10) {
            console.log("You Win!");
            winMessage.style.display = "block";
            gameActive = false;
        } else {
            console.log("Collision detected");
            score++;
            console.log("Score:", score);
            scoreValue.textContent = score;
            gameContainer.removeChild(fallingObject);
            fallingObjects.splice(fallingObjects.indexOf(fallingObject), 1);
            createFallingObject(); // Create a new falling object
        }
    } else if (fallingObjectRect.bottom >= gameContainer.getBoundingClientRect().bottom) {
        console.log("bottom collision detected")
        if (!backgroundImage.includes('poop.png')) {
            console.log("mushroom fell");
            score--;
            scoreValue.textContent = score;
        }
        // Handle the case where the fallingObject reaches the bottom of the gameContainer
        gameContainer.removeChild(fallingObject);
        fallingObjects.splice(fallingObjects.indexOf(fallingObject), 1);
        createFallingObject(); // Create a new falling object
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

function clearFallingObjects() {
    for (const fallingObject of fallingObjects) {
        if (fallingObject.element && fallingObject.element.parentNode) {
            // Remove the falling object from the DOM
            fallingObject.element.parentNode.removeChild(fallingObject.element);
        }
    }
    fallingObjects.length = 0; // Clear the fallingObjects array
}

// Function to start the game
function startGame() {
    audio.play();
    gameActive = true;
    score = 0;
    scoreValue.textContent = score;
    winMessage.style.display = "none";
    loseMessage.style.display = "none";

    // Create the first falling object and start the game loop
    createFallingObject();
}

// Start the game initially
startGame();