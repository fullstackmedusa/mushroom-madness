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

    if (fallingObjectY > gameContainer.clientHeight && !fallingObjectData.removed) {
        // Remove the current falling object
        fallingObjectData.removed = true;
        gameContainer.removeChild(fallingObject);
        fallingObjects.splice(fallingObjectIndex, 1);

        // Create a new falling object
        createFallingObject();
    } else {
        requestAnimationFrame(() => animateFallingObject(fallingObject));
        checkCollision(fallingObject);
    }
}




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
    } else if (parseFloat(fallingObject.style.top) >= gameContainer.clientHeight) {
        // Handle the case where the fallingObject reaches the bottom of the container
        gameContainer.removeChild(fallingObject);
        fallingObjects.splice(fallingObjects.indexOf(fallingObject), 1);
        createFallingObject(); // Create a new falling object
    }
}




// Function to start the game
function startGame() {
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
