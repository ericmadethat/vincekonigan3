(function() {
  var Dot, animFrame, config, dotFactory, dots, drawDot, drawLines, dynamicCanvas, mainLoop;

  config = {
    largeDotSize: 8,
    smallDotSize: 5,
    darkGrey: 'rgba(33,33,33,0.8)',
    lightGrey: 'rgba(51,51,51,@)',
    bigDots: 8,
    littleDots: 13,
    speedModifierX: 1.3,
    speedModifierY: 1.2,
    lineDistance: 150
  };

  Dot = function(size, color, xPos, yPos, context, canvas, vectorX, vectorY, entropyX, entropyY) {
    this.color = color;
    this.size = size;
    this.x = xPos;
    this.y = yPos;
    this.context = context;
    this.parent = canvas;
    this.vectorX = vectorX;
    this.vectorY = vectorY;
    this.entropyX = entropyX;
    this.entropyY = entropyY;
    return this;
  };

  dots = [];

  mainLoop = function() {
    var canvas, context, dot, i, j, len, len1, oDot;
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    while (dots.length < config.bigDots) {
      oDot = dotFactory(config.largeDotSize, config.darkGrey, context, canvas, 1, 1);
      dots.push(oDot);
    }
    while (dots.length < config.bigDots + config.littleDots) {
      oDot = dotFactory(config.smallDotSize, config.lightGrey.replace('@', 0.8), context, canvas, -1, -1);
      dots.push(oDot);
    }
    for (i = 0, len = dots.length; i < len; i++) {
      dot = dots[i];
      drawLines(dot);
    }
    for (j = 0, len1 = dots.length; j < len1; j++) {
      dot = dots[j];
      drawDot(dot);
    }
    return animFrame(mainLoop);
  };

  drawLines = function(oDot) {
    var distance, dot, i, len, percentOfMax, results;
    results = [];
    for (i = 0, len = dots.length; i < len; i++) {
      dot = dots[i];
      if (dots.indexOf(dot) !== dots.indexOf(oDot)) {
        distance = Math.sqrt(Math.pow(Math.abs(oDot.x - dot.x), 2) + Math.pow(Math.abs(oDot.y - dot.y), 2));
        if (distance < config.lineDistance && dot.size <= oDot.size) {
          oDot.context.beginPath();
          oDot.context.moveTo(oDot.x, oDot.y);
          oDot.context.lineTo(dot.x, dot.y);
          percentOfMax = (config.lineDistance - distance) / config.lineDistance;
          oDot.context.strokeStyle = config.lightGrey.replace('@', percentOfMax);
          results.push(oDot.context.stroke());
        } else {
          results.push(void 0);
        }
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

  dynamicCanvas = function() {
    var canvas, container;
    canvas = document.getElementById('canvas');
    container = document.getElementById('container');
    canvas.width = container.clientWidth;
    return canvas.height = container.clientHeight;
  };

  dynamicCanvas();

  window.addEventListener('resize', dynamicCanvas);

  dotFactory = function(size, color, context, canvas, vectorX, vectorY) {
    return new Dot(size, color, canvas.width * Math.random(), canvas.height * Math.random(), context, canvas, vectorX, vectorY, (Math.random() * 2) - 1, (Math.random() * 2) - 1);
  };

  drawDot = function(oDot) {
    oDot.context.beginPath();
    oDot.context.arc(oDot.x, oDot.y, oDot.size / 2, 0, 2 * Math.PI, false);
    oDot.context.fillStyle = oDot.color;
    oDot.context.fill();
    if (oDot.x > oDot.parent.width - (oDot.size / 2)) {
      oDot.x = oDot.parent.width - oDot.size / 2;
    }
    if (oDot.x < oDot.size / 2) {
      oDot.x = oDot.size / 2;
    }
    if (oDot.y > oDot.parent.height - (oDot.size / 2)) {
      oDot.y = oDot.parent.height - oDot.size / 2;
    }
    if (oDot.y < oDot.size / 2) {
      oDot.y = oDot.size / 2;
    }
    if (oDot.x > (oDot.parent.width - oDot.size / 2) - 1 || oDot.x < (oDot.size / 2) + 1) {
      oDot.vectorX *= -1;
      oDot.entropyX = (Math.random() * 2) - 1;
    }
    if (oDot.y > (oDot.parent.height - oDot.size / 2) - 1 || oDot.y < (oDot.size / 2) + 1) {
      oDot.vectorY *= -1;
      oDot.entropyY = (Math.random() * 2) - 1;
    }
    oDot.x += (config.speedModifierX + oDot.entropyX) * oDot.vectorX;
    return oDot.y += (config.speedModifierY + oDot.entropyY) * oDot.vectorY;
  };

  animFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || null;

  animFrame(mainLoop);

}).call(this);