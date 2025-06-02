let receipt = [];
let userInput, submitButton;
let stars = [];
let priceTags = [];

let cartX, basketY;
let cartImage, bgImage;
let customImages = [];
let totalImages = 12;

let fonts = ['Courier New', 'Georgia', 'Arial', 'Verdana', 'Times New Roman', 'Comic Sans MS'];

// For stacking images neatly
let stackPositions = [];

function preload() {
  for (let i = 1; i <= totalImages; i++) {
    let img = loadImage(`images/${i}.png`);
    customImages.push(img);
  }

  cartImage = loadImage("images/cart.png");
  bgImage = loadImage("bg.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  cartX = width * 0.55;
  basketY = height - 400 - 10;

  textFont('Courier');
  textSize(16);

  userInput = createInput('');
  userInput.position(40, height - 60);
  userInput.size(300);
  userInput.style('font-size', '20px');
  userInput.style('padding', '10px');

  submitButton = createButton('ADD TO CART');
  submitButton.position(userInput.x + userInput.width + 20, height - 60);
  submitButton.style('font-size', '20px');
  submitButton.style('padding', '10px 20px');
  submitButton.mousePressed(handleAdd);
}

function draw() {
  if (bgImage) {
    background(bgImage);
  } else {
    background(245);
  }

  drawReceiptArea();
  drawCartArea();
  drawBasket();
}

function drawReceiptArea() {
  let startX = 40;
  let endX = width * (1 / 3) - 40;
  let startY = 50;
  let lineSpacing = 38;

  textSize(28);
  textFont('Courier New');
 fill('#ebca50');


  for (let i = 0; i < receipt.length; i++) {
    let y = startY + i * lineSpacing;
    let entry = receipt[i];
    let split = entry.split(" – ");
    if (split.length === 2) {
      let item = split[0];
      let price = split[1];
      textAlign(LEFT);
      text(item, startX, y);
      textAlign(RIGHT);
      text(price, endX, y);
    } else {
      textAlign(LEFT);
      text(entry, startX, y);
    }
  }

  stroke(255, 40);
  line(width * (1 / 3), 0, width * (1 / 3), height); // new divider position
}


function drawCartArea() {
  for (let star of stars) {
    star.update();
    star.display();
  }

  for (let tag of priceTags) {
    tag.update();
    tag.display();
  }
}

function drawBasket() {
  let basketWidth = 550;
  let basketHeight = 550;
  let basketX = width * (1 / 3) + (width * (2 / 3) - basketWidth) / 2;
  basketY = height - 500; // moves basket 90px higher than before
  image(cartImage, basketX, basketY, basketWidth, basketHeight);
}


function handleAdd() {
  let val = userInput.value().trim();
  if (val.length > 0) {
    let price = "₹" + nf(random(0.99, 99.99), 2, 2);
    let entry = val + " – " + price;
    receipt.push(entry);

    let chosenImg = random(customImages);
    stars.push(new CustomImageObject(chosenImg, stackPositions));
    priceTags.push(new PriceTag(price));

    userInput.value('');
  }
}

class CustomImageObject {
  constructor(img) {
    this.img = img;
    // Start anywhere within the right 2/3, with padding for image width (assuming 200px wide)
    this.width = 800; // or whatever size you want
    this.height = 800;
    this.x = random(width * (1/3) + 40, width - this.width - 40);
    this.y = -this.height;  // start above the screen
    this.speed = random(2, 4);
    this.settled = false;
  }

  update() {
    if (!this.settled) {
      this.y += this.speed;
      if (this.y > height - this.height - 40) {  // stop above bottom
        this.y = height - this.height - 40;
        this.settled = true;
      }
    }
  }

  display() {
    image(this.img, this.x, this.y, this.width, this.height);
  }
}


class PriceTag {
  constructor(price) {
    this.x = random(width * (1 / 3) + 40, width - 100);
    this.y = -20;
    this.speed = random(1.5, 3);
    this.alpha = 255;
    this.price = price;

    // Random target Y somewhere in visible right half, leaving some bottom margin
    this.targetY = random(100, height - 150);

    this.settled = false;
    this.flashDirection = 1;
  }

  update() {
    if (!this.settled) {
      this.y += this.speed;
      if (this.y >= this.targetY) {
        this.y = this.targetY;
        this.settled = true;
      }
    }

    // Aggressive flicker (same as before)
    this.alpha += this.flashDirection * random(20, 50);
    if (this.alpha >= 255) {
      this.alpha = 255;
      this.flashDirection = -1;
    } else if (this.alpha <= 50) {
      this.alpha = 50;
      this.flashDirection = 1;
    }
    this.alpha += random(-10, 10);
    this.alpha = constrain(this.alpha, 50, 255);
  }

  display() {
    fill(255, this.alpha);
    textSize(38);
    textAlign(CENTER);
    textFont('Impact');
    text(this.price, this.x, this.y);
  }
}

