// get navigation
const page1btn = document.querySelector("#page1btn");
const page2btn = document.querySelector("#page2btn");
const page3btn = document.querySelector("#page3btn");
const page4btn = document.querySelector("#page4btn");
const page5btn = document.querySelector("#page5btn");
var allpages = document.querySelectorAll(".page");
// select all elements with ".page", subtopics

function hideall() { // function to hide all pages except displayed one
    for (let onepage of allpages) { // go through all subtopic pages
        onepage.style.display = "none"; // hide it
    }
}
function show(pgno) { // function to show selected page number
    hideall();
    // select the page based on the parameter passed in
    let onepage = document.querySelector("#page" + pgno);
    onepage.style.display = "block"; //show the page
}
hideall();

// listen for clicks, show clicked page
page1btn.addEventListener("click", function () {
    show(1);
});
page2btn.addEventListener("click", function () {
    show(2);
});
page3btn.addEventListener("click", function () {
    show(3);
});
page4btn.addEventListener("click", function () {
    show(4);
});
page5btn.addEventListener("click", function () {
    show(5);
});
/****************************** Quiz (5) *************************************/
const btnSubmit = document.querySelector("#btnSubmit"); //gets quiz button
const scorebox = document.querySelector("#scorebox"); // gets score box
btnSubmit.addEventListener("click", CheckAns); // run CheckAns when submit button clicked
var q1, q2, q3, q4, q5, q6, q7, score = 0;

function CheckAns() {
    console.log("CheckAns called");
    score = 0; //reset score to 0, check ans and give score if correct

    q1 = document.querySelector("input[name='q1']:checked").value;
    console.log(q1); //check q1 value retrieved
    if (q1 == "aota") score++;

    q2 = document.querySelector("input[name='q2']:checked").value;
    console.log(q2); //check q2 value retrieved
    if (q2 == "recognition") score++;

    q3 = document.querySelector("input[name='q3']:checked").value;
    console.log(q3); //check q3 value retrieved
    if (q3 == "hearing") score++;

    q4 = document.querySelector("input[name='q4']:checked").value;
    console.log(q4); //check q4 value retrieved
    if (q4 == "3") score++;

    q5 = document.querySelector("input[name='q5']:checked").value;
    console.log(q5); //check q5 value retrieved
    if (q5 == "whistles") score++;

    q6 = document.querySelector("input[name='q6']:checked").value;
    console.log(q6); //check q6 value retrieved
    if (q6 == "yes") score++;

    q7 = document.querySelector("input[name='q7']:checked").value;
    console.log(q7); //check q7 value retrieved
    if (q7 == "50") score++;

    scorebox.innerHTML = "Score:" + score;
}

/****************************** Minigame (5) *************************************/
// get game control buttons
const startButton = document.querySelector('.startButton');
const jumpButton = document.querySelector('.jumpButton');
const resetButton = document.querySelector('.resetButton');
const dolphin = document.getElementById('gameDolphin'); // to trigger dolphin jump
const fish = document.getElementById('gameFish'); // to trigger fish jump
const scoreContainer = document.getElementById('gameScoreContainer'); // for fish point system
const scoreDisplay = document.getElementById('gameScorebox');
const oceanAudio = new Audio("./audio/oceanSound.mp3");
const dolphinAudio = new Audio("./audio/dolphinSound.mp3");

let gameScore = 0;
let hasScoredThisJump = false; // prevent multiple scores per jump
let hasCaughtFish = false;
let fishTimeoutId; // store timeout globally

// update and display score
function addgameScore(points) {
    gameScore += points;
    scoreDisplay.textContent = "Score: " + gameScore;
}
// switch from start to jump
function switchToJump() {
    startButton.style.display = 'none';
    jumpButton.style.display = 'inline-block';
}
// switch from jump to start
function switchToStart() {
    jumpButton.style.display = 'none';
    startButton.style.display = 'inline-block';
}
// GAME BEGINS - hoop, fish starts moving
startButton.addEventListener('click', function () {
    console.log('Start button clicked!');
    switchToJump(); // switch to jump button
    oceanAudio.loop = true; // loop throughout game
    oceanAudio.play(); // play ocean waves audio
    startMoving(); // hoops start moving, game begins
    scheduleFishJump(); // fish starts to wait for random time to jump, game begins
});
// RESETS GAME - stops all sounds, animations and resets score
resetButton.addEventListener('click', function () {
    console.log('Reset button clicked!');

    oceanAudio.pause(); // stop audio
    dolphinAudio.pause();
    stopMoving();

    clearTimeout(fishTimeoutId); // stop fish schedule animation

    fish.style.display = 'none'; // stop animation
    fish.classList.remove('jumping');
    dolphin.classList.remove('jumping');

    // reset score and update display
    gameScore = 0;
    scoreDisplay.textContent = "Score: 0";

    // reset hoop position
    hoopPosition = -100;
    updateHoopPositions();

    // resets jump button
    switchToStart(); // show start, hide jump
});

// collision check if elements are overlapping
function isTouching(el1, el2) {
    const rect1 = el1.getBoundingClientRect();
    const rect2 = el2.getBoundingClientRect();

    return !(
        rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom
    );
}

// dolphin jump animation
jumpButton.addEventListener('click', function () {
    console.log('Jump button clicked!');
    dolphinAudio.play(); // audio plays upon dolphin jump

    // reset score
    hasScoredThisJump = false;
    hasCaughtFish = false;

    // replaying the animation
    dolphin.classList.remove('jumping');
    // force reflow (browser trick to restart animation)
    void dolphin.offsetWidth;
    // add class so dolpin jumps
    dolphin.classList.add('jumping');

    // dolphin touches hoop (1 point)
    var lHoopCollisionCheck = setInterval(function () {
        if (!hasScoredThisJump && isTouching(dolphin, lHoop)) {
            addgameScore(1); // 1 point for going through hoop
            hasScoredThisJump = true;
            clearInterval(lHoopCollisionCheck);  // avoid repeat scoring
        }
    }, 100);

    // check if dolphin ate fish/came in contact with fish
    var fishCollisionCheck = setInterval(function () {
        if (
            !hasCaughtFish &&
            isTouching(dolphin, fish) &&
            isTouching(dolphin, scoreContainer) &&
            isTouching(fish, scoreContainer)
        ) {
            addgameScore(5); // 5 points for catching fish inside scoreContainer
            hasCaughtFish = true;
            fish.style.display = 'none'; // hide fish after caught
            clearInterval(fishCollisionCheck); // avoid repeat scoring
        }
    }, 100);

    // clean up intervals after 1 second
    setTimeout(function () {
        clearInterval(lHoopCollisionCheck);
        clearInterval(fishCollisionCheck);
    }, 1000);
});
/************************************* sprites that do not require user interaction (automatic sprites) *************************************/
// fish jump
function triggerFishJump() {
    fish.style.display = 'block'; // make it visible again
    fish.classList.remove('jumping');
    void fish.offsetWidth; // replay animation
    fish.classList.add('jumping');
}

// fish jumps at random times
function scheduleFishJump() {
    const randomDelay = Math.random() * 4000 + 2000; // between 2000ms and 6000ms (2–6 sec)

    // schedule next fish jump with random delay
    setTimeout(function () {
        triggerFishJump();
        scheduleFishJump(); // schedule next jump
    }, randomDelay);
}

// HOOP MOVEMENT FROM LEFT TO RIGHT 
const lHoop = document.getElementById('gameLHoop');
const rHoop = document.getElementById('gameRHoop');

let isMoving = false;
let animationId;
let hoopPosition = -100; // start from left, move to right
const moveSpeed = 3; // adjust hoop speed
const gameWidth = 548;
const hoopDistance = 33; // distance between LHoop and RHoop

function startMoving() {
    if (!isMoving) {
        isMoving = true;
        moveHoops();
    }
}

function stopMoving() {
    isMoving = false;
    if (animationId) {
        cancelAnimationFrame(animationId); // stop animation
    }
}

function moveHoops() {
    if (!isMoving) return;

    hoopPosition += moveSpeed;

    // when LHoop goes past the game area, reset to start
    if (hoopPosition > gameWidth) {
        hoopPosition = -100; // reset to the left
    }

    updateHoopPositions();
    animationId = requestAnimationFrame(moveHoops);
}

function updateHoopPositions() {
    lHoop.style.left = hoopPosition + 'px';
    rHoop.style.left = (hoopPosition + hoopDistance) + 'px';
}


/************************************* mobile *************************************/
// get mobile buttons
const mpage1btn = document.querySelector("#mpage1btn");
const mpage2btn = document.querySelector("#mpage2btn");
const mpage3btn = document.querySelector("#mpage3btn");
const mpage4btn = document.querySelector("#mpage4btn");
const mpage5btn = document.querySelector("#mpage5btn");
var allpages = document.querySelectorAll(".page");
// select all subtopic pages

function hideall() { // function to hide all pages except displayed one
    for (let onepage of allpages) { // go through all subtopic pages
        onepage.style.display = "none"; // hide it
    }
}
function show(pgno) { // function to show selected page number
    hideall();
    // select the page based on the parameter passed in
    let onepage = document.querySelector("#page" + pgno);
    onepage.style.display = "block"; // show the page
}
hideall();

// listen for click on buttons, display clicked page
mpage1btn.addEventListener("click", function () {
    show(1);
});
mpage2btn.addEventListener("click", function () {
    show(2);
});
mpage3btn.addEventListener("click", function () {
    show(3);
});
mpage4btn.addEventListener("click", function () {
    show(4);
});
mpage5btn.addEventListener("click", function () {
    show(5);
});

// gets mobile navbar
const mobileNavbar = document.querySelector("#mobileNavbar");
const mobileMenu = document.querySelector("#mobileMenu");

mobileNavbar.addEventListener("click", function () {
    // toggle menuShow class
    mobileMenu.classList.toggle("menuShow");

    // toggle button text
    if (mobileMenu.classList.contains("menuShow")) {
        mobileNavbar.textContent = "Close Menu";
    } else {
        mobileNavbar.textContent = "Open Menu";
    }
});