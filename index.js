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
