// resize vh for mobile
/* mobileResize();

function mobileResize() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
}

window.addEventListener("resize", () => {
    mobileResize();
}); */


// initiate game
window.addEventListener('DOMContentLoaded', function() {
    let play = document.querySelector("#play");
    let playMobile = document.querySelector("#play-mobile");

    play.addEventListener("click", () => {
        play.innerHTML =  "<a href='index.html'>Back to Home</a>";
        playGame();
    });
    
    playMobile.addEventListener("click", () => {
        playMobile.innerHTML =  "<a href='index.html'>Back to Home</a>";
        playGame();
    });

    function playGame() {
        countdown = true;
        countdownStartTime = millis();
        
        // Set letters to 40% opacity when game starts
        document.querySelectorAll('.letter-static').forEach(el => el.classList.add('game-started'));
        
        let dogAspectRatio = dogImage.width / dogImage.height;
        let dogWidth = gifWidth / 3.8;
        let dogHeight = dogWidth / dogAspectRatio;
        
        demoDog = {
        image: dogImage,
        x: canvasWidth / 2 - dogWidth/2.8,
        y: gameBaseline - dogHeight,
        width: dogWidth,
        height: dogHeight
        };
    }

});

// load paper stack

let work = document.querySelector("#work");
let stack = document.querySelector("#stack");
var page = document.querySelector("#page");
let workCount = 200;
let gap = 70;

// stack.style.height = workCount * gap + 200 + "px";

page.style.zIndex = workCount; // to be replaced by total number of works dynamically
// page.style.top = document.querySelector(".statement").offsetHeight;


for (let i = 1; i < workCount; i++) {
    let clone = page.cloneNode(true);
    clone.style.zIndex = workCount - i;
    stack.appendChild(clone);
    clone.classList.add("page");
    clone.style.marginTop = "-" + gap + "px";
    clone.id = i;
}

let pages = document.querySelectorAll(".page");
