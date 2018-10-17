var bug;  // Declare object

function setup() {
  w = window.innerWidth;
  h = window.innerHeight;
  var canvas = createCanvas(w, h);
  // Create object
  bug = new Jitter();
}

function draw() {
  background(50, 89, 100);
  bug.move();
  bug.display();

  window.onresize= function() {
  var w = window.innerWidth;
  var h = window.innerHeight;
  canvas.size(w,h);
  }

}
// Jitter class
function Jitter() {
  this.x = random(width);
  this.y = random(height);
  this.diameter = random(10, 30);
  this.speed = 1;

  this.move = function() {
    this.x += random(-this.speed, this.speed);
    this.y += random(-this.speed, this.speed);
  };

  this.display = function() {
    ellipse(this.x, this.y, this.diameter, this.diameter);
  };
}