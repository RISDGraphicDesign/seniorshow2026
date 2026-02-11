let landing = document.querySelector("#landing");

landing.addEventListener("click", () => {
    landing.remove();
    document.body.innerHTML += '<script src="game.js"></script>';
});