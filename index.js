let landing = document.querySelector("#landing");

landing.addEventListener("click", () => {
    landing.remove();
    document.querySelector("canvas").style.display = "block";
    started = true;
});

// resize vh for mobile
mobileResize();

function mobileResize() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
}

window.addEventListener("resize", () => {
    mobileResize();
});