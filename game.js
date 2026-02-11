let canvasWidth = window.innerWidth * 0.6;
let canvasHeight = window.innerHeight * 0.4;

let foxImage;
let foxX;
let foxY;
let foxWidth;
let foxHeight;


let fox;
let velocityY = 0;
let coreGravity = 1.5;
let gravity = coreGravity;


let dogArray = [];
let dogImage;
let speed = 10  ;

let frameCount = 0;
let shrink = 25;
let gameRun = true;
let letters = [];
let sundayMasthead;

let navy = "#0D2D72";
let pink = "#FFE7EB";

// Background floating letters
let bgLetters = {};
let pangramLetters = "THEQUICKBROWNFOXJUMPSOVERTHELAZYDOG";  // Unique letters only

// Game over rect animation
let gameOverRectY;
let gameOverRectTargetY;

function preload() {
  foxImage = loadImage("assets/fox.png");
  dogImage = loadImage("assets/lazydog.png");

  sundayMasthead = loadFont("fonts/SundayMasthead-Regular.otf");
}

function setup() {
  let canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent('canvas-container');
  frameRate(60);

  foxWidth = foxImage.width;
  foxHeight = foxImage.height; 
  console.log(foxImage.height)

  foxX =0;
  foxY = canvasHeight - foxHeight ;

  fox = {
  image: foxImage ,
  x: foxX,
  y: foxY,
  width: foxWidth,
  height: foxHeight,
};

  // Initialize all unique letters
  for (let i = 0; i < pangramLetters.length; i++) {
    let char = pangramLetters.charAt(i);
    bgLetters[char] = {
      char: char,
      x: 0,
      y: 0,
      collected: false,
      onScreen: false,
      size: 52  // Fixed size for all letters
    };
  }

}


function draw() {
 
  background(pink);
  stroke(navy);
  strokeWeight(3);
  line(0, canvasHeight, canvasWidth, canvasHeight);
  noStroke();
  frameCount++;

  // Draw and update background letters during gameplay
  if (gameRun) {
    updateBgLetters();
  }
  
  dogStuff(frameCount);
 
 
 
  velocityY += gravity;
  fox.y = min(velocityY + fox.y, foxY) ;
  image(fox.image, fox.x, fox.y);
  if (gameRun){
    if (keyIsDown(DOWN_ARROW)) {
      console.log("test")
      gravity = 3;
    }
    else if ((keyIsDown(UP_ARROW) || keyIsDown(32)) && fox.y == foxY ) {
      console.log("test")
      velocityY = -35;
    }
    else{
      gravity = coreGravity;
    }
} else {
  speed = 0;
  gameOver();
}
 
 

}

function dogStuff(frameCount){
 
  let randomNum = random(0,100);
  
  // Update and draw dogs
  for (let i = 0; i < dogArray.length; i++) {
    dogArray[i].x -= speed;
    image(dogArray[i].image, dogArray[i].x, dogArray[i].y);
    
    if (detectCollision(dogArray[i], fox)) {
      if (gameRun) {  // Only if game was running
    gameRun = false;
    gameOverRectY = canvasHeight + 200;  // Start below screen
    gameOverRectTargetY = canvasHeight/2;  // Target center
    setLetters();  // Call only once
  }
    }
  }
  
  // Remove dogs that are off-screen
  dogArray = dogArray.filter(dog => dog.x >= -dogImage.width);
  
  if (randomNum < 50 && frameCount % 60 == 0){
    dogArray.push({
      image: dogImage,
      x: canvasWidth,
      y: foxY +40,
      width: dogImage.width,
      height: dogImage.height,
    })
    console.log(dogArray.length);
  }
}


function detectCollision(a, b) { 
  return a.x< b.x + b.width-shrink &&
         a.x + a.width > b.x+shrink &&
         a.y < b.y + b.height-shrink && 
        a.y + a.height > b.y+shrink;
}

function setLetters(){
  let message = "GAME OVER";
 
  let totalWidth = 0;

  // Measure total width first
  fill(navy);
  textSize(24);
  for (let i = 0; i < message.length; i++) {
    totalWidth += textWidth(message[i]);
  }

  // Calculate starting X position to center the whole phrase
  let startX = canvasWidth/2 - totalWidth/2;
  let currentX = startX;
  let currentY = canvasHeight/2-90;
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
function gameOver() {
  textSize(24);
  textFont(sundayMasthead);
  textAlign(CENTER, CENTER);
 

  for (let i = 0; i < letters.length; i++) {
  let letter = letters[i];
  
  if (!letter.t) letter.t = 0;
  letter.t = min(letter.t + 0.01, 1);
  
  // Ease-out: starts fast, slows down
  let easedT = 1 - pow(1 - letter.t, 3);
  
  let path = letter.path;
  
  if (letter.t >= 1) {
    letter.currentX = letter.targetX;
    letter.currentY = letter.targetY;
  } else {
    let totalSegments = path.length - 1;
    let currentSegment = floor(easedT * totalSegments);
    currentSegment = constrain(currentSegment, 0, totalSegments - 1);
    
    let segmentT = (easedT * totalSegments) % 1;
    
    let i0 = max(currentSegment - 1, 0);
    let i1 = currentSegment;
    let i2 = min(currentSegment + 1, path.length - 1);
    let i3 = min(currentSegment + 2, path.length - 1);
    
    letter.currentX = curvePoint(path[i0].x, path[i1].x, path[i2].x, path[i3].x, segmentT);
    letter.currentY = curvePoint(path[i0].y, path[i1].y, path[i2].y, path[i3].y, segmentT);
  }
  
  text(letter.char, letter.currentX, letter.currentY);
}
}

function updateBgLetters() {
  // Max Y is where the fox can jump to (foxY is ground, velocityY of -35 with gravity 2)
  let maxJumpHeight = foxY - 150;  // Approximate max jump height
  
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
      let letterSpans = document.querySelectorAll('.letter[data-char="' + l.char + '"]:not(.collected)');
      if (letterSpans.length > 0) {
        letterSpans[0].classList.add('collected');
      }
      // Only mark as fully collected if no more uncollected spans remain
      let remainingSpans = document.querySelectorAll('.letter[data-char="' + l.char + '"]:not(.collected)');
      if (remainingSpans.length === 0) {
        l.collected = true;
      }
      console.log("Collected: " + l.char);
      continue;
    }
    
    // Draw letter
    fill(navy);
    textSize(l.size);
    text(l.char, l.x, l.y);
    
    // Mark as off-screen if it leaves (can respawn later if not collected)
    if (l.x < -50) {
      l.onScreen = false;
    }
  }
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

function windowResized() {
  canvasWidth = window.innerWidth * 0.6;
  canvasHeight = window.innerHeight * 0.4;
  resizeCanvas(canvasWidth, canvasHeight);
}