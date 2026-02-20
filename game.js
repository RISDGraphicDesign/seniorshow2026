let canvasWidth = window.innerWidth * 0.6;
let canvasHeight = window.innerHeight * 0.4;

let gifWidth;
let gifHeight;
let gameWidth;
let gameHeight;

let scaledShrink;
let gameRun = true;
let score = 0;
let letters = [];

let started = false;
let countdown = false;
let countdownTimer = 3;
let countdownStartTime = 0;
let demoDog = null;

let foxRunImage;
let foxJumpImage;
let foxX;
let foxY;
let foxWidth;
let foxHeight;
let startGif;

let fox;
let velocityY = 0;
let coreGravity;
let gravity;
let coreVelocityY;

let targetWidth;
let targetHeight;
let aspectRatio;
let gameBaseline;

let dogArray = [];
let dogImage;
let speed;

let frameCount = 0;
let sundayMasthead;
let plusJakartaSans;

let goPhase = false;
let goStartTime = 0;
let goDuration = 0.8; // How long "GO!" stays visible (seconds)

let navy = "#0D2D72";
let pink = "#FFE7EB";

// Background floating letters
let bgLetters = {};
let pangramLetters = "THEQUICKBROWNFOXJUMPSOVERTHELAZYDOG";  // Unique letters only

// Game over rect animation
let gameOverRectY;
let gameOverRectTargetY;

function preload() {
  foxRunImage = loadImage("assets/run.gif");
  foxJumpImage = loadImage("assets/jump.gif");
  dogImage = loadImage("assets/lazydog.png");
  startGif = loadImage("assets/fox-jumping.gif");
  sundayMasthead = loadFont("fonts/SundayMasthead-Regular.otf");
  plusJakartaSans = loadFont("fonts/PlusJakartaSans-Regular.ttf");
}

function setup() { 
  console.log("GIF loaded:", startGif.width, startGif.height);
  let landingDiv = document.getElementById('canvas-container');
  let landingWidth = landingDiv.offsetWidth;
  // Change this line to get the gif-and-canvas div width instead
let containerDiv = document.getElementById('gif-and-canvas');
let containerWidth = containerDiv.offsetWidth;

targetWidth = containerWidth; // Use 100% of container, not 40% of landing
aspectRatio = startGif.width / startGif.height;
targetHeight = targetWidth / aspectRatio;

gifHeight = targetHeight*.65; 
gifWidth = targetWidth*.65;

gameWidth = targetWidth;
gameHeight = gifHeight;

  let canvas = createCanvas(targetWidth, targetHeight);
  canvasWidth = targetWidth;
  canvasHeight = targetHeight;

  gameBaseline = canvasHeight/2 + gameHeight/2
  let placeholder = document.getElementById('placeholder');
  if (placeholder) {
    placeholder.style.display = 'none';
  }
  console.log("Canvas size:", canvasWidth, canvasHeight);
    console.log("Canvas position:", canvas.position());
    console.log("Landing width:", landingWidth);
    console.log("Landing height:", landingDiv.offsetHeight);
  canvas.parent('gif-and-canvas');
canvas.style('display', 'block');

  frameRate(30);

  let foxAspectRatio = foxRunImage.width / foxRunImage.height;

  foxWidth = gifWidth/1.6;
  foxHeight = foxWidth / foxAspectRatio; 
  console.log(foxRunImage.height)

  foxX =0;
  foxY = gameBaseline - foxHeight ;

  fox = {
  image: foxRunImage ,
  x: foxX,
  y: foxY,
  width: foxWidth,
  height: foxHeight,

};

coreVelocityY = -gameHeight * 0.06;
coreGravity = gameHeight * 0.004;
gravity = coreGravity;
speed = foxWidth * 0.08;
scaledShrink = foxWidth * 0.1;
  // Initialize all unique letters
  for (let i = 0; i < pangramLetters.length; i++) {
    let char = pangramLetters.charAt(i);
    bgLetters[char] = {
      char: char,
      x: 0,
      y: 0,
      collected: false,
      onScreen: false,
      size: gameHeight * 0.15  // Scale with game size
    };
  }

}

function windowResized() {
  setup();
}

function draw() {
  if (!started && !countdown) {
    background(pink);
    noFill();
    
    image(startGif,(targetWidth/2 - gifWidth/2), (targetHeight/2-gifHeight/2), gifWidth, gifHeight);

    return;
  }
  
  // Countdown phase
  if (countdown && !started) {
  background(pink);
    
  // Fade out the gif during countdown
  let elapsed = (millis() - countdownStartTime) / 250;
  let timeLeft = Math.ceil(countdownTimer - elapsed);
  let fadeAlpha = map(elapsed, 0, countdownTimer/20, 255, 0);
    
  tint(255, fadeAlpha);
  image(startGif,(targetWidth/2 - gifWidth/2), (targetHeight/2-gifHeight/2), gifWidth, gifHeight);
  noTint();
    
  strokeWeight(4);
  stroke(navy);
  let lineProgress = map(elapsed, 0, countdownTimer, 0, canvasWidth);
  line(0, gameBaseline - 2, lineProgress, gameBaseline - 2);
    
  // Move and draw demo dog
  if (demoDog) {
    demoDog.x -= speed;
    image(demoDog.image, demoDog.x, demoDog.y, demoDog.width, demoDog.height);
    // Respawn dog if it goes off screen
  }
 
 if (goPhase) {
  let goElapsed = (millis() - goStartTime) / 1000;
  let foxProgress = map(goElapsed, 0, goDuration, -foxWidth, 0);
  let jumpArc = -sin(map(goElapsed, 0, goDuration, 0, PI)) * gameHeight * 0.3;
  if (foxJumpImage.getCurrentFrame() >= foxJumpImage.numFrames() - 1) {
    foxJumpImage.pause();
  }
  image(foxJumpImage, foxProgress, foxY + jumpArc, foxWidth, foxHeight);
}
  // Display countdown number
  fill(navy);
  noStroke();
  textFont(sundayMasthead);
  textSize(gameHeight * 0.3);
  textAlign(CENTER, CENTER);
  if (timeLeft > 0 && !goPhase) {
    text(timeLeft, canvasWidth / 2, gameBaseline - gameHeight * 0.45);
  }
    
   if (elapsed >= countdownTimer && !goPhase) {
    goPhase = true;
    goStartTime = millis();
  }
  
  if (goPhase) {
    let goElapsed = (millis() - goStartTime) / 1000;
    let goAlpha = map(goElapsed, 0, goDuration, 255, 0);
    
    fill(13, 45, 114, goAlpha); // navy with fading alpha
    text("GO!", canvasWidth / 2, gameBaseline - gameHeight * 0.45);
    
    if (goElapsed >= goDuration) {
      countdown = false;
      started = true;
      goPhase = false;
      demoDog = null;
      velocityY = 0;
      fox.y = foxY;
      score = 0;
    }
  }
    
  return;
}
 
  
  
  background(pink);

  stroke(navy);
  strokeWeight(max(2, gameHeight * 0.012));
  line(0,canvasHeight/2 + gameHeight/2 -2, canvasWidth, canvasHeight/2 + gameHeight/2 -2);
  frameCount++;
  
  if (gameRun) {
    score++;
  }

  // Draw and update background letters during gameplay
  if (gameRun) {
    updateBgLetters();
  }
  
  dogStuff(frameCount);
 
 
 
  velocityY += gravity;
  fox.y = min(velocityY + fox.y, foxY) ;
  
  // Update fox image based on jumping state
  if (fox.y < foxY) {
    if (fox.image !== foxJumpImage) {
      fox.image = foxJumpImage;
      foxJumpImage.setFrame(0);
      foxJumpImage.play();
    }
    if (foxJumpImage.getCurrentFrame() >= foxJumpImage.numFrames() - 1) {
      foxJumpImage.pause();
    }
  } else {
    if (fox.image !== foxRunImage) {
      fox.image = foxRunImage;
      foxRunImage.play();
    }
  }
  
  image(fox.image, fox.x, fox.y, fox.width, fox.height);
  if (gameRun){
    if (keyIsDown(DOWN_ARROW)) {
      console.log("test")
      gravity = coreGravity;
    }
    else if ((keyIsDown(UP_ARROW) || keyIsDown(32)) && fox.y == foxY ) {
      console.log("test")
      velocityY = coreVelocityY;
    }
    else{
      gravity = coreGravity;
    }
}else{
  speed = 0;
  fox.image.pause();
  gameOver();
}
 
 

}

function dogStuff(frameCount){
 
  let randomNum = random(0,100);
  
  // Update and draw dogs
  for (let i = 0; i < dogArray.length; i++) {
    dogArray[i].x -= speed;
    image(dogArray[i].image, dogArray[i].x, dogArray[i].y, dogArray[i].width, dogArray[i].height);
    
    if (detectCollision(dogArray[i], fox)) {
      console.log("COLLISION DETECTED");
      if (gameRun) {  // Only if game was running
    gameRun = false;
    gameOverRectY = canvasHeight + 200;  // Start below screen
    gameOverRectTargetY = canvasHeight/2;  // Target center
    setLetters();  // Call only once
  }
    }
  }
  
  // Remove dogs that are off-screen]

  let dogAspectRatio = dogImage.width/dogImage.height;
  let dogWidth = gifWidth/3.8;
  let dogHeight = dogWidth/dogAspectRatio;
  dogArray = dogArray.filter(dog => dog.x >= -dogImage.width);
 
  if (randomNum < 50 && frameCount % 60 == 0){
    dogArray.push({
      image: dogImage,
      x: canvasWidth,
      y: gameBaseline - dogHeight,
      width: dogWidth,
      height: dogHeight,
    })
    console.log(dogArray.length);
  }
}


function detectCollision(a, b) { 
  // Debug: log positions when dog is near fox
  if (a.x < b.x + b.width + 50 && a.x + a.width > b.x - 50) {
    console.log("Dog:", a.x, a.y, a.width, a.height);
    console.log("Fox:", b.x, b.y, b.width, b.height);
    console.log("scaledShrink:", scaledShrink);
  }
  return a.x < b.x + b.width - scaledShrink &&
         a.x + a.width > b.x + scaledShrink &&
         a.y < b.y + b.height - scaledShrink && 
         a.y + a.height > b.y + scaledShrink;
} 

function setLetters(){
  noStroke();
  let message = "GAME OVER";
 
  let totalWidth = 0;

  // Measure total width first
  fill(0);
  textSize(gameHeight * 0.07);
  noStroke();
  for (let i = 0; i < message.length; i++) {
    totalWidth += textWidth(message[i]);
  }

  // Calculate starting X position to center the whole phrase
  let startX = canvasWidth/2 - totalWidth/2;
  let currentX = startX;
  let currentY = gameBaseline/2*.83;
  // Store position for each letter
  
  for (let i = 0; i < message.length; i++) {
    let letterWidth = textWidth(message[i]);
    
    letters.push({
      char: message[i],
      targetX: currentX + letterWidth/2,  // Center of letter
      targetY: currentY,
      path: generateRandomWavyPath(currentX + letterWidth/2, currentY),  // Start off-screen (staggered)
      currentX: 0,
      currentY: 0,
      currentWaypoint: 0
    });
    letters[i].currentX = letters[i].path[0].x;
    letters[i].currentY = letters[i].path[0].y;
    currentX += letterWidth;  // Move to next letter positi
  }
}

function gameOver(){
  // // Animate rect flying up from bottom
  // let gameOverRectTargetY = canvasHeight/2;
  
  // fill(255);
  // let rectWidth = 180;
  // let rectHeight = 240;
  
  noStroke();
  fill(navy);
  textSize(gameHeight * 0.1);
  textFont(sundayMasthead);
  textAlign(CENTER, CENTER);
 
  text("GAME OVER", canvasWidth / 2, gameBaseline / 2 - gameHeight * 0.1);

  // for (let i = 0; i < letters.length; i++) {
  //   let letter = letters[i];
    
  //   if (!letter.t) letter.t = 0;
  //   letter.t = min(letter.t + 0.01, 1);
    
  //   // Ease-out: starts fast, slows down
  //   let easedT = 1 - pow(1 - letter.t, 3);
    
  //   let path = letter.path;
  
  //   if (letter.t >= 1) {
  //     letter.currentX = letter.targetX;
  //     letter.currentY = letter.targetY;
  //   } else {
  //     let totalSegments = path.length - 1;
  //     let currentSegment = floor(easedT * totalSegments);
  //     currentSegment = constrain(currentSegment, 0, totalSegments - 1);
      
  //     let segmentT = (easedT * totalSegments) % 1;
      
  //     let i0 = max(currentSegment - 1, 0);
  //     let i1 = currentSegment;
  //     let i2 = min(currentSegment + 1, path.length - 1);
  //     let i3 = min(currentSegment + 2, path.length - 1);
      
  //     letter.currentX = curvePoint(path[i0].x, path[i1].x, path[i2].x, path[i3].x, segmentT);
  //     letter.currentY = curvePoint(path[i0].y, path[i1].y, path[i2].y, path[i3].y, segmentT);
  //   }
  
  //   text(letter.char, letter.currentX, letter.currentY);
  // }


  // Display score and play again prompt
  textFont(plusJakartaSans);
  textSize(gameHeight * 0.05);
  fill(navy);
  noStroke();
  text("SCORE: " + score, canvasWidth / 2, gameBaseline / 2);
  textSize(gameHeight * 0.05);
  fill(navy);
  text("Tap anywhere to play again", canvasWidth / 2, gameBaseline / 2 + gameHeight * 0.06);
}


function updateBgLetters() {
  // Max Y is where the fox can jump to (foxY is ground, velocityY of -35 with gravity 2)
  let maxJumpHeight = foxY - canvasHeight/4;  // Approximate max jump height
  
  // Spawn new letters half as frequently as dogs (every 120 frames)
  if (frameCount % 120 == 0) {
    // Find letters that aren't collected and aren't on screen
    let availableLetters = [];
    for (let char in bgLetters) {
      if (!bgLetters[char].collected && !bgLetters[char].onScreen) {
        availableLetters.push(char);
      }
    }
    
    // Spawn a random available letter
    if (availableLetters.length > 0) {
      let char = availableLetters[floor(random(availableLetters.length))];
      let l = bgLetters[char];
      l.x = canvasWidth + 50;
      l.y = random(maxJumpHeight, foxY);  // Between max jump height and ground
      l.onScreen = true;
    }
  }
  
  // Update and draw letters
  textFont(sundayMasthead);
  textAlign(CENTER, CENTER);
  
  for (let char in bgLetters) {
    let l = bgLetters[char];
    
    if (!l.onScreen) continue;
    
    // Move left at same speed as dogs
    l.x -= speed;
    
    // Check collision with fox to collect letter
    let letterHitbox = {
      x: l.x - l.size/2,
      y: l.y - l.size/2,
      width: l.size,
      height: l.size
    };
    if (fox.x < letterHitbox.x + letterHitbox.width &&
        fox.x + fox.width > letterHitbox.x &&
        fox.y < letterHitbox.y + letterHitbox.height &&
        fox.y + fox.height > letterHitbox.y) {
      l.onScreen = false;
      // Find first uncollected matching letter span and add 'collected' class
      let letterSpans = document.querySelectorAll('.letter-static[data-char="' + l.char + '"]:not(.collected)');
      if (letterSpans.length > 0) { 
        letterSpans[0].classList.add('collected');
      }
      // Only mark as fully collected if no more uncollected spans remain
      let remainingSpans = document.querySelectorAll('.letter-static[data-char="' + l.char + '"]:not(.collected)');
      if (remainingSpans.length === 0) {
        l.collected = true;
      }
      console.log("Collected: " + l.char);
      continue;
    }
    
    let letterColor = navy;
    fill(letterColor);
    textSize(l.size);
    text(l.char, l.x, l.y);
    
    // Mark as off-screen if it leaves (can respawn later if not collected)
    if (l.x < -50) {
      l.onScreen = false;
    }
  }
}

function touchStarted() {
  if (started && gameRun && fox.y === foxY) {
    velocityY = coreVelocityY;
    return false; // prevent scroll ONLY during gameplay
  }
  if (!gameRun) {
    // Reset game state for countdown
    gameRun = true;
    started = false;
    countdown = true;
    countdownStartTime = millis();
    goPhase = false;
    score = 0;
    dogArray = [];
    velocityY = 0;
    letters = [];
    frameCount = 0;
    speed = foxWidth * 0.08;
    
    // Reset background letters
    for (let char in bgLetters) {
      bgLetters[char].collected = false;
      bgLetters[char].onScreen = false;
    }
    
    // Reset collected letters in HTML and set to 40% opacity
    document.querySelectorAll('.letter-static').forEach(span => {
      span.classList.remove('collected');
      span.classList.add('game-started');
    });
    
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

    foxX = 0;
    foxY = gameBaseline - foxHeight;
    fox = {
      image: foxRunImage,
      x: foxX,
      y: foxY,
      width: foxWidth,
      height: foxHeight,
    };

    // Restart running animation
    foxRunImage.play();

    draw();
    return false;
  }
  return true; // allow links & buttons to work
}

function generateRandomWavyPath(endX, endY, numPoints = 8) {
  let startX, startY;
  
  let edge = floor(random(4));
  
  if (edge === 0) {
    startX = -100;
    startY = random(0, canvasHeight);
  } else if (edge === 1) {
    startX = canvasWidth + 100;
    startY = random(0, canvasHeight);
  } else if (edge === 2) {
    startX = random(0, canvasWidth);
    startY = -100;
  } else {
    startX = random(0, canvasWidth);
    startY = canvasHeight + 100;
  }
  
  let path = [];
  
  // Randomize spiral parameters for each letter
  let numRotations = random(0, 2);  // Random number of whirls
  let maxRadius = random(20, 290);  // Random spiral size
  let rotationDirection = random() > 0.5 ? 1 : -1;  // Clockwise or counter-clockwise
  let startAngle = random(TWO_PI);  // Random starting angle
  
  for (let i = 0; i < numPoints; i++) {
    let t = i / (numPoints - 1);
    
    let x = lerp(startX, endX, t);
    let y = lerp(startY, endY, t);
    
    // Varied spiral effect
    let spiralAngle = startAngle + (t * PI * numRotations * rotationDirection);
    let spiralRadius = maxRadius * sin(t * PI);
    
    // Add randomness per point
    spiralRadius *= random(0.6, 1.4);
    spiralAngle += random(-0.3, 0.3);
    
    x += cos(spiralAngle) * spiralRadius;
    y += sin(spiralAngle) * spiralRadius;
    
    path.push({x: x, y: y});
  }
  
  return path;
}

function mousePressed() {
  // Jump on tap/click during gameplay
  if (gameRun && started && fox.y == foxY) {
    velocityY = coreVelocityY;
  }
  
  // Tap anywhere to play again when game is over
  if (!gameRun) {
    // Reset game state for countdown
    gameRun = true;
    started = false;
    countdown = true;
    countdownStartTime = millis();
    goPhase = false;
    score = 0;
    dogArray = [];
    velocityY = 0;
    letters = [];
    frameCount = 0;
    speed = foxWidth * 0.08;
    
    // Reset background letters
    for (let char in bgLetters) {
      bgLetters[char].collected = false;
      bgLetters[char].onScreen = false;
    }
    
    // Reset collected letters in HTML and set to 40% opacity
    document.querySelectorAll('.letter-static').forEach(span => {
      span.classList.remove('collected');
      span.classList.add('game-started');
    });
    
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

    foxX = 0;
    foxY = gameBaseline - foxHeight;
    fox = {
      image: foxRunImage,
      x: foxX,
      y: foxY,
      width: foxWidth,
      height: foxHeight,
    };

    // Restart running animation
    foxRunImage.play();

    draw();
    return false;
  }
}
