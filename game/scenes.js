// scenes.js: the three original Spot It! scenes, drawn procedurally.
// Every picture is painted by code, so the left and right panels are
// near-identical by construction and each difference is one deliberate
// change in the right panel's drawing. Coordinates live in a 560x500 space.
// A difference is { id, x, y, r, label }: where to click and what changed.

function disc(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}
function oval(ctx, x, y, rx, ry, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}
function box(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
}
function poly(ctx, points, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (var i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  ctx.fill();
}
function line(ctx, x1, y1, x2, y2, color, width) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width || 2;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}
function skyGradient(ctx, top, bottom) {
  var g = ctx.createLinearGradient(0, 0, 0, 500);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 560, 500);
}
function cloud(ctx, x, y, s) {
  disc(ctx, x, y, 22 * s, '#ffffff');
  disc(ctx, x + 22 * s, y + 4 * s, 17 * s, '#ffffff');
  disc(ctx, x - 22 * s, y + 6 * s, 15 * s, '#ffffff');
}
function bird(ctx, x, y, color) {
  ctx.strokeStyle = color || '#333344';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(x - 10, y);
  ctx.quadraticCurveTo(x - 4, y - 8, x, y);
  ctx.quadraticCurveTo(x + 4, y - 8, x + 10, y);
  ctx.stroke();
}
function flower(ctx, x, y, petal) {
  line(ctx, x, y, x, y + 26, '#2e7d32', 3);
  for (var i = 0; i < 5; i++) {
    var a = (i / 5) * Math.PI * 2;
    disc(ctx, x + Math.cos(a) * 9, y + Math.sin(a) * 9, 6, petal);
  }
  disc(ctx, x, y, 6, '#ffd54a');
}

function drawGarden(ctx, right) {
  skyGradient(ctx, '#7ec3ee', '#d8f1c0');
  // Sun: on the right panel its rays are gone.
  disc(ctx, 80, 70, 34, '#ffd93b');
  if (!right) {
    for (var i = 0; i < 8; i++) {
      var a = (i / 8) * Math.PI * 2;
      line(ctx, 80 + Math.cos(a) * 40, 70 + Math.sin(a) * 40,
        80 + Math.cos(a) * 52, 70 + Math.sin(a) * 52, '#f5a623', 4);
    }
  }
  disc(ctx, 72, 64, 4, '#333');
  disc(ctx, 88, 64, 4, '#333');
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(80, 74, 10, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();
  cloud(ctx, 250, 70, 1);
  cloud(ctx, 430, 50, 0.8);
  bird(ctx, 200, 110);
  bird(ctx, 260, 82);
  if (right) bird(ctx, 420, 92); // extra bird, right panel only
  // Hills and lawn.
  oval(ctx, 120, 520, 260, 110, '#7ec850');
  oval(ctx, 460, 530, 280, 120, '#66b83e');
  box(ctx, 0, 430, 560, 70, '#5da83c');
  // Wooden fence across the lawn; one post is missing on the right.
  box(ctx, 0, 372, 560, 6, '#a9743f');
  box(ctx, 0, 396, 560, 6, '#a9743f');
  for (var px = 30; px <= 530; px += 62) {
    if (right && px === 464) continue;
    box(ctx, px, 360, 12, 56, '#8d5a2b');
  }
  // Tree with three apples; the top apple is missing on the right.
  box(ctx, 88, 240, 22, 110, '#7a4a21');
  disc(ctx, 99, 205, 52, '#3e8e41');
  disc(ctx, 62, 232, 36, '#4da34f');
  disc(ctx, 138, 232, 36, '#4da34f');
  disc(ctx, 70, 212, 9, '#e33e2b');
  if (!right) disc(ctx, 112, 190, 9, '#e33e2b');
  disc(ctx, 96, 238, 9, '#e33e2b');
  // Little house.
  box(ctx, 330, 290, 160, 120, '#ffe8c2');
  poly(ctx, [[315, 292], [410, 225], [505, 292]], '#d95f4b');
  box(ctx, 392, 335, 36, 75, '#8d5a2b');
  disc(ctx, 424, 375, 3, '#ffd54a');
  box(ctx, 348, 308, 34, 34, '#bfe3f5');
  line(ctx, 365, 308, 365, 342, '#8d5a2b', 2);
  line(ctx, 348, 325, 382, 325, '#8d5a2b', 2);
  box(ctx, 432, 308, 34, 34, '#bfe3f5');
  line(ctx, 449, 308, 449, 342, '#8d5a2b', 2);
  line(ctx, 432, 325, 466, 325, '#8d5a2b', 2);
  // Curtains in the right window: yellow on the left, blue on the right.
  box(ctx, 434, 310, 8, 30, right ? '#4a7de0' : '#ffd54a');
  box(ctx, 456, 310, 8, 30, right ? '#4a7de0' : '#ffd54a');
  // Flower bed: the second flower is red on the left, blue on the right.
  flower(ctx, 90, 448, '#ff6b9d');
  flower(ctx, 150, 448, right ? '#4a7de0' : '#e33e2b');
  flower(ctx, 210, 448, '#ff9f1c');
  flower(ctx, 270, 448, '#b388ff');
  flower(ctx, 520, 448, '#ff6b9d');
  // Butterfly near the flowers; missing on the right.
  if (!right) {
    oval(ctx, 292, 350, 10, 14, '#ff9f1c');
    oval(ctx, 310, 350, 10, 14, '#ff6b9d');
    line(ctx, 301, 342, 301, 360, '#333', 2);
  }
  // Garden path from the door.
  oval(ctx, 410, 470, 70, 16, '#e8d8a8');
}

var SCENES = [
  {
    id: 'garden',
    name: 'Taman Matahari',
    sub: 'Sunny garden',
    time: 120,
    difficulty: 'Easy',
    draw: drawGarden,
    diffs: [
      { id: 'sunrays', x: 80, y: 70, r: 46, label: 'Sun rays missing' },
      { id: 'flower', x: 150, y: 448, r: 20, label: 'Flower changed color' },
      { id: 'extrabird', x: 420, y: 92, r: 20, label: 'Extra bird' },
      { id: 'apple', x: 112, y: 190, r: 14, label: 'Apple missing' },
      { id: 'butterfly', x: 301, y: 350, r: 18, label: 'Butterfly missing' },
      { id: 'window', x: 449, y: 325, r: 22, label: 'Window curtains changed' },
      { id: 'fence', x: 470, y: 388, r: 16, label: 'Fence post missing' }
    ]
  }
];

function drawHarbor(ctx, right) {
  skyGradient(ctx, '#3b2d5e', '#e88a4d');
  // Stars; one star is missing on the right.
  var stars = [[60, 40], [150, 30], [230, 60], [330, 35], [500, 130], [120, 90]];
  for (var i = 0; i < stars.length; i++) {
    if (right && stars[i][0] === 230) continue;
    disc(ctx, stars[i][0], stars[i][1], 3, '#fff8d0');
  }
  // Moon: full on the left, crescent on the right.
  disc(ctx, 470, 70, 28, '#fff3c4');
  if (right) disc(ctx, 482, 64, 24, '#6a4a7a');
  // Sea.
  box(ctx, 0, 250, 560, 250, '#1d4e6e');
  box(ctx, 0, 250, 560, 6, '#2f6f96');
  line(ctx, 40, 300, 200, 300, '#7fb6d6', 2);
  line(ctx, 300, 330, 520, 330, '#7fb6d6', 2);
  line(ctx, 90, 380, 260, 380, '#7fb6d6', 2);
  line(ctx, 340, 420, 500, 420, '#7fb6d6', 2);
  line(ctx, 60, 450, 220, 450, '#5a93b8', 2);
  // Moon reflection.
  for (var ry = 262; ry < 470; ry += 22) line(ctx, 452, ry, 492, ry, '#ffe9a8', 3);
  // Lighthouse with a beam that is off on the right.
  box(ctx, 62, 150, 56, 120, '#f5efe0');
  box(ctx, 62, 190, 56, 18, '#d95f4b');
  box(ctx, 62, 232, 56, 18, '#d95f4b');
  box(ctx, 56, 128, 68, 24, '#333344');
  disc(ctx, 90, 140, 10, right ? '#555566' : '#ffe27a');
  if (!right) {
    ctx.fillStyle = 'rgba(255, 226, 122, 0.35)';
    ctx.beginPath();
    ctx.moveTo(118, 140);
    ctx.lineTo(300, 110);
    ctx.lineTo(300, 172);
    ctx.closePath();
    ctx.fill();
  }
  box(ctx, 40, 270, 100, 16, '#4a3b2c');
  // Sailboat: the red stripe on its sail is gone on the right.
  poly(ctx, [[300, 330], [330, 250], [330, 330]], '#ffffff');
  if (!right) poly(ctx, [[300, 330], [330, 250], [330, 330]], '#ffffff');
  if (!right) line(ctx, 312, 296, 330, 296, '#e33e2b', 8);
  line(ctx, 330, 245, 330, 335, '#7a4a21', 3);
  poly(ctx, [[288, 330], [380, 330], [368, 356], [300, 356]], '#8d5a2b');
  line(ctx, 288, 330, 380, 330, '#5a3418', 3);
  // Little ship on the right; its cabin window is lit on the left only.
  poly(ctx, [[400, 350], [500, 350], [486, 378], [414, 378]], '#2c2c44');
  box(ctx, 428, 330, 44, 20, '#3c3c5c');
  box(ctx, 440, 336, 14, 10, right ? '#2c2c44' : '#ffd54a');
  line(ctx, 472, 330, 472, 350, '#7a4a21', 3);
  // Buoy: orange on the left, green on the right.
  disc(ctx, 180, 420, 14, right ? '#3fae5f' : '#ff7b2f');
  line(ctx, 180, 406, 180, 398, '#333', 3);
  disc(ctx, 180, 396, 4, '#ffd54a');
  line(ctx, 150, 428, 210, 428, '#7fb6d6', 2);
  bird(ctx, 150, 100, '#f5efe0');
  bird(ctx, 210, 130, '#f5efe0');
  if (right) bird(ctx, 300, 90, '#f5efe0'); // extra gull, right only
}

function drawKitchen(ctx, right) {
  box(ctx, 0, 0, 560, 500, '#f7e8c8');
  box(ctx, 0, 380, 560, 120, '#a9743f');
  line(ctx, 0, 380, 560, 380, '#7a4a21', 4);
  // Window with curtains: blue on the left, pink on the right.
  box(ctx, 50, 60, 110, 110, '#bfe3f5');
  box(ctx, 50, 60, 110, 110, '#bfe3f5');
  disc(ctx, 130, 100, 22, '#ffd93b');
  cloud(ctx, 105, 90, 0.5);
  box(ctx, 42, 52, 126, 10, '#8d5a2b');
  box(ctx, 42, 170, 126, 10, '#8d5a2b');
  box(ctx, 42, 52, 10, 128, '#8d5a2b');
  box(ctx, 158, 52, 10, 128, '#8d5a2b');
  var curtain = right ? '#ff9ecb' : '#4a7de0';
  poly(ctx, [[42, 52], [72, 52], [66, 130], [42, 130]], curtain);
  poly(ctx, [[168, 52], [138, 52], [144, 130], [168, 130]], curtain);
  // Wall clock: 3 o'clock on the left, 6 o'clock on the right.
  disc(ctx, 280, 90, 34, '#ffffff');
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(280, 90, 34, 0, Math.PI * 2);
  ctx.stroke();
  disc(ctx, 280, 90, 3, '#333');
  if (right) {
    line(ctx, 280, 90, 280, 112, '#333', 3);
    line(ctx, 280, 90, 280, 68, '#333', 2);
  } else {
    line(ctx, 280, 90, 300, 90, '#333', 3);
    line(ctx, 280, 90, 280, 68, '#333', 2);
  }
  // Framed picture: a sun on the left, a moon on the right.
  box(ctx, 440, 70, 70, 60, '#8d5a2b');
  box(ctx, 446, 76, 58, 48, '#bfe3f5');
  if (right) {
    disc(ctx, 475, 100, 14, '#fff3c4');
    disc(ctx, 481, 96, 12, '#8fa8c8');
  } else {
    disc(ctx, 475, 100, 14, '#ffd93b');
    for (var s = 0; s < 6; s++) {
      var sa = (s / 6) * Math.PI * 2;
      line(ctx, 475 + Math.cos(sa) * 18, 100 + Math.sin(sa) * 18,
        475 + Math.cos(sa) * 23, 100 + Math.sin(sa) * 23, '#f5a623', 2);
    }
  }
  // Shelf with jars.
  box(ctx, 190, 170, 190, 10, '#8d5a2b');
  box(ctx, 205, 128, 34, 42, '#e8b4b8');
  box(ctx, 252, 128, 34, 42, '#a8d8a8');
  box(ctx, 300, 128, 34, 42, '#f5d76e');
  box(ctx, 205, 128, 34, 8, '#8d5a2b');
  box(ctx, 252, 128, 34, 8, '#8d5a2b');
  box(ctx, 300, 128, 34, 8, '#8d5a2b');
  // Rug and table.
  oval(ctx, 280, 460, 190, 34, '#d95f4b');
  oval(ctx, 280, 460, 150, 24, '#ffd54a');
  box(ctx, 60, 320, 440, 16, '#c98d4b');
  box(ctx, 80, 336, 16, 90, '#8d5a2b');
  box(ctx, 464, 336, 16, 90, '#8d5a2b');
  // Mug: red on the left, green on the right.
  box(ctx, 100, 288, 40, 32, right ? '#3fae5f' : '#e33e2b');
  ctx.strokeStyle = right ? '#3fae5f' : '#e33e2b';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(146, 304, 9, -Math.PI / 2, Math.PI / 2);
  ctx.stroke();
  // Kettle with steam; the steam is gone on the right.
  poly(ctx, [[380, 320], [430, 320], [420, 268], [390, 268]], '#7a7a8c');
  line(ctx, 382, 290, 356, 272, '#7a7a8c', 8);
  disc(ctx, 405, 264, 6, '#5a5a6c');
  if (!right) {
    ctx.strokeStyle = 'rgba(150,150,170,0.85)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(398, 252);
    ctx.quadraticCurveTo(390, 238, 398, 226);
    ctx.quadraticCurveTo(406, 214, 398, 204);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(414, 252);
    ctx.quadraticCurveTo(422, 238, 414, 226);
    ctx.stroke();
  }
  // Fruit bowl: three apples on the left, two on the right.
  oval(ctx, 280, 372, 52, 16, '#4a7de0');
  disc(ctx, 258, 360, 11, '#e33e2b');
  disc(ctx, 282, 354, 11, '#e33e2b');
  if (!right) disc(ctx, 304, 360, 11, '#e33e2b');
  disc(ctx, 258, 352, 3, '#3e8e41');
  disc(ctx, 282, 346, 3, '#3e8e41');
  // Sleeping cat on the rug; its tail is gone on the right.
  oval(ctx, 470, 436, 46, 20, '#ff9f1c');
  disc(ctx, 516, 428, 14, '#ff9f1c');
  disc(ctx, 508, 416, 5, '#ff9f1c');
  disc(ctx, 522, 416, 5, '#ff9f1c');
  if (!right) {
    ctx.strokeStyle = '#ff9f1c';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(428, 440);
    ctx.quadraticCurveTo(404, 446, 410, 426);
    ctx.stroke();
  }
  line(ctx, 512, 428, 520, 428, '#333', 2);
}

SCENES.push(
  {
    id: 'harbor',
    name: 'Pelabuhan Senja',
    sub: 'Harbor at dusk',
    time: 105,
    difficulty: 'Medium',
    draw: drawHarbor,
    diffs: [
      { id: 'beam', x: 120, y: 140, r: 32, label: 'Lighthouse beam off' },
      { id: 'moon', x: 470, y: 70, r: 30, label: 'Moon changed shape' },
      { id: 'extragull', x: 300, y: 90, r: 18, label: 'Extra seagull' },
      { id: 'sail', x: 318, y: 296, r: 22, label: 'Sail stripe missing' },
      { id: 'buoy', x: 180, y: 420, r: 16, label: 'Buoy changed color' },
      { id: 'shipwindow', x: 447, y: 341, r: 16, label: 'Ship window dark' },
      { id: 'star', x: 230, y: 60, r: 12, label: 'Star missing' }
    ]
  },
  {
    id: 'kitchen',
    name: 'Dapur Hangat',
    sub: 'Cozy kitchen',
    time: 90,
    difficulty: 'Hard',
    draw: drawKitchen,
    diffs: [
      { id: 'clock', x: 280, y: 90, r: 28, label: 'Clock shows another time' },
      { id: 'mug', x: 120, y: 304, r: 18, label: 'Mug changed color' },
      { id: 'steam', x: 404, y: 230, r: 20, label: 'Kettle steam missing' },
      { id: 'apples', x: 282, y: 360, r: 18, label: 'One apple missing' },
      { id: 'cattail', x: 414, y: 436, r: 16, label: 'Cat tail missing' },
      { id: 'curtain', x: 57, y: 90, r: 22, label: 'Curtain changed color' },
      { id: 'picture', x: 475, y: 100, r: 24, label: 'Picture changed' }
    ]
  }
);
