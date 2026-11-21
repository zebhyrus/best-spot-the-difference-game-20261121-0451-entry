// game.js: Spot It! game logic. One scene at a time, two panels side by
// side; a click on either panel can find a difference, and every find is
// marked on BOTH panels. Wrong clicks cost 5 seconds. Hints pulse one
// unfound difference. Timer, score, stars and level flow live here.

var SpotIt = (function () {
  var canvasL = document.getElementById('canvasLeft');
  var canvasR = document.getElementById('canvasRight');
  var ctxL = canvasL.getContext('2d');
  var ctxR = canvasR.getContext('2d');
  var overlay = document.getElementById('overlay');
  var boards = document.getElementById('boards');

  var state = {
    screen: 'menu', // menu | playing | levelDone | gameDone | timeUp
    level: 0,
    found: [],
    score: 0,
    totalScore: 0,
    timeLeft: 0,
    hintsLeft: 3,
    timerId: null,
    hintPulse: null, // { diff, until }
    missFlash: null, // { x, y, until }
    muted: false
  };

  function scene() { return SCENES[state.level]; }
  function foundCount() { return state.found.length; }
  function totalDiffs() { return scene().diffs.length; }

  function fmtTime(sec) {
    var m = Math.floor(sec / 60);
    var s = sec % 60;
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  function updateHud() {
    var sc = scene();
    document.getElementById('hudLevel').textContent =
      'Level ' + (state.level + 1) + ' · ' + sc.name;
    document.getElementById('hudFound').textContent =
      'Found ' + foundCount() + ' / ' + totalDiffs() + ' · ' + (totalDiffs() - foundCount()) + ' left';
    var timerEl = document.getElementById('hudTimer');
    timerEl.textContent = fmtTime(Math.max(0, state.timeLeft));
    timerEl.classList.toggle('low', state.screen === 'playing' && state.timeLeft <= 15);
    document.getElementById('hudScore').textContent = 'Score ' + (state.totalScore + state.score);
    document.getElementById('hudHints').textContent = 'Hints ' + state.hintsLeft;
    var hintBtn = document.getElementById('btnHint');
    hintBtn.textContent = 'Hint (H) · ' + state.hintsLeft + ' left';
    hintBtn.disabled = state.screen !== 'playing' || state.hintsLeft <= 0;
    document.getElementById('btnSound').textContent =
      'Sound: ' + (state.muted ? 'off' : 'on') + ' (M)';
  }

  function drawMarker(ctx, diff) {
    ctx.strokeStyle = '#2ecc40';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(diff.x, diff.y, diff.r + 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,0.9)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(diff.x, diff.y, diff.r + 8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = '#2ecc40';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(diff.x - 8, diff.y);
    ctx.lineTo(diff.x - 2, diff.y + 7);
    ctx.lineTo(diff.x + 10, diff.y - 7);
    ctx.stroke();
  }

  function drawHintPulse(ctx, diff, now) {
    var age = (now - (state.hintPulse.since || now)) / 1000;
    var pulse = 1 + 0.25 * Math.sin(age * 8);
    ctx.strokeStyle = '#ffd54a';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(diff.x, diff.y, (diff.r + 10) * pulse, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#ffd54a';
    ctx.font = 'bold 15px Trebuchet MS, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('HINT', diff.x, diff.y - diff.r - 14);
  }

  function render() {
    var sc = scene();
    sc.draw(ctxL, false);
    sc.draw(ctxR, true);
    var now = Date.now();
    for (var i = 0; i < state.found.length; i++) {
      var d = sc.diffs[state.found[i]];
      drawMarker(ctxL, d);
      drawMarker(ctxR, d);
    }
    if (state.hintPulse && now < state.hintPulse.until) {
      var hd = sc.diffs[state.hintPulse.index];
      drawHintPulse(ctxL, hd, now);
      drawHintPulse(ctxR, hd, now);
    }
    if (state.missFlash && now < state.missFlash.until) {
      for (var k = 0; k < 2; k++) {
        var c = k === 0 ? ctxL : ctxR;
        c.strokeStyle = 'rgba(255,60,60,0.9)';
        c.lineWidth = 4;
        c.beginPath();
        c.arc(state.missFlash.x, state.missFlash.y, 16, 0, Math.PI * 2);
        c.stroke();
        c.beginPath();
        c.moveTo(state.missFlash.x - 9, state.missFlash.y - 9);
        c.lineTo(state.missFlash.x + 9, state.missFlash.y + 9);
        c.moveTo(state.missFlash.x + 9, state.missFlash.y - 9);
        c.lineTo(state.missFlash.x - 9, state.missFlash.y + 9);
        c.stroke();
      }
    }
    if (state.hintPulse && now >= state.hintPulse.until) state.hintPulse = null;
  }

  function renderLoop() {
    render();
    if (state.screen === 'playing' && state.hintPulse) {
      requestAnimationFrame(renderLoop);
    }
  }

  function stopTimer() {
    if (state.timerId) { clearInterval(state.timerId); state.timerId = null; }
  }

  function startTimer() {
    stopTimer();
    state.timerId = setInterval(function () {
      if (state.screen !== 'playing') return;
      state.timeLeft -= 1;
      if (state.timeLeft <= 10 && state.timeLeft > 0) SoundFX.tick();
      if (state.timeLeft <= 0) {
        state.timeLeft = 0;
        updateHud();
        timeUp();
        return;
      }
      updateHud();
    }, 1000);
  }

  function startLevel(index, demoFound) {
    state.level = index;
    state.found = [];
    state.score = 0;
    state.timeLeft = scene().time;
    state.hintsLeft = 3;
    state.hintPulse = null;
    state.missFlash = null;
    state.screen = 'playing';
    overlay.classList.remove('show');
    if (demoFound) {
      for (var i = 0; i < demoFound && i < totalDiffs(); i++) state.found.push(i);
      state.score = state.found.length * 100;
    }
    render();
    updateHud();
    startTimer();
  }

  function starsFor(timeLeft, total) {
    if (timeLeft > total * 0.5) return 3;
    if (timeLeft > total * 0.25) return 2;
    return 1;
  }

  function levelComplete() {
    stopTimer();
    state.screen = 'levelDone';
    var bonus = state.timeLeft * 5;
    state.score += bonus;
    var stars = starsFor(state.timeLeft, scene().time);
    SoundFX.winArpeggio();
    var last = state.level === SCENES.length - 1;
    if (last) {
      state.totalScore += state.score;
      showGameDone(stars);
      return;
    }
    overlay.innerHTML =
      '<div class="card"><h1>Level Complete!</h1>' +
      '<div class="stars">' + '★'.repeat(stars) + '☆'.repeat(3 - stars) + '</div>' +
      '<p class="big">You found all 7 differences in ' + scene().name + '!</p>' +
      '<p>Time bonus +' + bonus + ' &middot; Level score ' + state.score + '</p>' +
      '<p>Next up: ' + SCENES[state.level + 1].name + ' (' + SCENES[state.level + 1].difficulty + ', ' +
      SCENES[state.level + 1].time + 's, 7 differences)</p>' +
      '<button id="ovNext" type="button">Next level (N)</button>' +
      '<button id="ovMenu" class="ghost" type="button">Level select</button></div>';
    overlay.classList.add('show');
    document.getElementById('ovNext').addEventListener('click', nextLevel);
    document.getElementById('ovMenu').addEventListener('click', showMenu);
    updateHud();
  }

  function nextLevel() {
    state.totalScore += state.score;
    startLevel(state.level + 1, 0);
  }

  function showGameDone(stars) {
    state.screen = 'gameDone';
    overlay.innerHTML =
      '<div class="card"><h1>You found them all!</h1>' +
      '<div class="stars">' + '★'.repeat(stars) + '☆'.repeat(3 - stars) + '</div>' +
      '<p class="big">Total score: ' + state.totalScore + '</p>' +
      '<p>21 differences across 3 scenes &mdash; Taman Matahari, Pelabuhan Senja, Dapur Hangat. ' +
      'Sharp eyes! Play again and beat your time, or try with fewer hints.</p>' +
      '<button id="ovAgain" type="button">Play again (R)</button>' +
      '<button id="ovMenu2" class="ghost" type="button">Level select</button></div>';
    overlay.classList.add('show');
    document.getElementById('ovAgain').addEventListener('click', function () {
      state.totalScore = 0;
      startLevel(0, 0);
    });
    document.getElementById('ovMenu2').addEventListener('click', showMenu);
    updateHud();
  }

  function timeUp() {
    stopTimer();
    state.screen = 'timeUp';
    SoundFX.wrongBlip();
    overlay.innerHTML =
      '<div class="card"><h1>Time&rsquo;s up!</h1>' +
      '<p class="big">You found ' + foundCount() + ' / ' + totalDiffs() + ' differences.</p>' +
      '<p>The missing ones were still hiding in ' + scene().name +
      '. Take a hint next time &mdash; it pulses one unfound difference on both panels.</p>' +
      '<button id="ovRetry" type="button">Try again (R)</button>' +
      '<button id="ovMenu3" class="ghost" type="button">Level select</button></div>';
    overlay.classList.add('show');
    document.getElementById('ovRetry').addEventListener('click', function () { startLevel(state.level, 0); });
    document.getElementById('ovMenu3').addEventListener('click', showMenu);
  }

  function showMenu() {
    stopTimer();
    state.screen = 'menu';
    state.totalScore = 0;
    state.level = 0;
    state.found = [];
    state.score = 0;
    state.timeLeft = scene().time;
    state.hintsLeft = 3;
    var cards = '';
    for (var i = 0; i < SCENES.length; i++) {
      cards += '<button class="levelCard" data-level="' + i + '" type="button">' +
        '<span class="num">' + (i + 1) + '</span>' +
        '<span class="nm">' + SCENES[i].name + '</span>' +
        '<span class="df">' + SCENES[i].difficulty + ' &middot; ' + SCENES[i].time + 's &middot; 7 diffs</span></button>';
    }
    overlay.innerHTML =
      '<div class="card"><h1>SPOT IT!</h1><h2>Cari Perbedaannya</h2>' +
      '<p>Two pictures, side by side, almost the same. <b>7 differences</b> hide in every scene. ' +
      'Click a difference on either panel to mark it on both. Wrong click? &minus;5 seconds.</p>' +
      '<div class="levelGrid">' + cards + '</div>' +
      '<p>Hints (H) pulse one hidden difference &mdash; 3 per level. ' +
      'Find all 7 before the timer runs out for a time bonus and up to 3 stars.</p>' +
      '<p class="keys">Mouse: click &middot; H: hint &middot; R: restart &middot; 1/2/3: pick level &middot; Esc: menu &middot; M: sound</p></div>';
    overlay.classList.add('show');
    var btns = overlay.querySelectorAll('.levelCard');
    for (var j = 0; j < btns.length; j++) {
      btns[j].addEventListener('click', function (ev) {
        startLevel(parseInt(ev.currentTarget.getAttribute('data-level'), 10), 0);
      });
    }
    render();
    updateHud();
  }

  function useHint() {
    if (state.screen !== 'playing' || state.hintsLeft <= 0) return;
    var remaining = [];
    for (var i = 0; i < totalDiffs(); i++) {
      if (state.found.indexOf(i) === -1) remaining.push(i);
    }
    if (!remaining.length) return;
    state.hintsLeft -= 1;
    var pick = remaining[Math.floor(Math.random() * remaining.length)];
    state.hintPulse = { index: pick, until: Date.now() + 1400, since: Date.now() };
    SoundFX.hintPluck();
    updateHud();
    renderLoop();
    setTimeout(render, 1500);
  }

  function onCanvasClick(ev) {
    SoundFX.unlock();
    if (state.screen !== 'playing') return;
    var rect = ev.currentTarget.getBoundingClientRect();
    var x = (ev.clientX - rect.left) * (560 / rect.width);
    var y = (ev.clientY - rect.top) * (500 / rect.height);
    var sc = scene();
    var best = -1;
    var bestDist = 1e9;
    for (var i = 0; i < sc.diffs.length; i++) {
      if (state.found.indexOf(i) !== -1) continue;
      var d = sc.diffs[i];
      var dist = Math.hypot(x - d.x, y - d.y);
      if (dist < d.r + 10 && dist < bestDist) { best = i; bestDist = dist; }
    }
    if (best !== -1) {
      state.found.push(best);
      state.score += 100;
      SoundFX.foundChime();
      render();
      updateHud();
      if (foundCount() === totalDiffs()) levelComplete();
    } else {
      state.timeLeft = Math.max(0, state.timeLeft - 5);
      state.missFlash = { x: x, y: y, until: Date.now() + 700 };
      SoundFX.wrongBlip();
      boards.classList.remove('shake');
      void boards.offsetWidth;
      boards.classList.add('shake');
      render();
      updateHud();
      setTimeout(render, 750);
      if (state.timeLeft <= 0) timeUp();
    }
  }

  function onKey(ev) {
    var k = ev.key.toLowerCase();
    if (k === 'h') useHint();
    else if (k === 'r') {
      if (state.screen === 'playing' || state.screen === 'timeUp' || state.screen === 'gameDone') {
        if (state.screen === 'gameDone') { state.totalScore = 0; startLevel(0, 0); }
        else startLevel(state.level, 0);
      }
    }
    else if (k === 'n' && state.screen === 'levelDone') nextLevel();
    else if (k === 'escape') showMenu();
    else if (k === 'm') {
      state.muted = !state.muted;
      SoundFX.setMuted(state.muted);
      updateHud();
    }
    else if (state.screen === 'menu' && (k === '1' || k === '2' || k === '3')) {
      startLevel(parseInt(k, 10) - 1, 0);
    }
  }

  function readDemo() {
    var params = new URLSearchParams(window.location.search);
    var level = parseInt(params.get('level') || '0', 10);
    if (isNaN(level) || level < 0 || level >= SCENES.length) level = 0;
    var demo = params.get('demo') || '';
    if (demo === 'win') {
      startLevel(level, 7);
      state.found = [0, 1, 2, 3, 4, 5, 6];
      state.score = 700;
      render();
      levelComplete();
      return true;
    }
    if (demo.indexOf('found') === 0) {
      var n = parseInt(demo.slice(5), 10) || 0;
      startLevel(level, n);
      return true;
    }
    return false;
  }

  canvasL.addEventListener('click', onCanvasClick);
  canvasR.addEventListener('click', onCanvasClick);
  document.addEventListener('keydown', onKey);
  document.getElementById('btnHint').addEventListener('click', useHint);
  document.getElementById('btnRestart').addEventListener('click', function () {
    if (state.screen === 'playing' || state.screen === 'timeUp') startLevel(state.level, 0);
  });
  document.getElementById('btnMenu').addEventListener('click', showMenu);
  document.getElementById('btnSound').addEventListener('click', function () {
    state.muted = !state.muted;
    SoundFX.setMuted(state.muted);
    updateHud();
  });

  if (!readDemo()) showMenu();
})();
