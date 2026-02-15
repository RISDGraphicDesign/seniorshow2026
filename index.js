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

let play = document.querySelector("#play");
let landing = document.querySelector("#landing");

play.addEventListener("click", () => {
    landing.remove();
    document.querySelector("canvas").style.display = "block";
    let letters = document.querySelectorAll(".letter-static");
    letters.forEach(letter => {
        letter.classList.remove("letter-static");
        letter.classList.add("letter");
    });
    started = true;
});