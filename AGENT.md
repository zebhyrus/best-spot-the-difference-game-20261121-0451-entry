# Spot It! Cari Perbedaannya — agent notes

Entry for make.fun bounty `best-spot-the-difference-game-20261121-0451`
("Make the best spot the difference game", $50, 10 places x $5).

## The game

Original spot-the-difference game, mouse + keyboard, no network, no
external assets. All art is drawn procedurally on canvas by `game/scenes.js`;
all sound is synthesized with WebAudio by `game/audio.js`.

- 3 scenes, rising difficulty: 1 Taman Matahari (sunny garden, 120s),
  2 Pelabuhan Senja (harbor at dusk, 105s), 3 Dapur Hangat (cozy kitchen, 90s).
- 7 differences per scene, fair but hidden by design (missing object,
  changed color, extra bird/gull, changed clock hands, missing steam, ...).
- Correct click: green ring + check marker on BOTH panels, chime, +100 score.
- Wrong click: red X flash, shake, soft low blip, -5 seconds.
- Hint (H or button): 3 per level, pulses one unfound difference for 1.4s.
- Timer per level with low-time warning; level-complete screen with
  1-3 stars and a time bonus (+5/sec left); final screen with total score.
- Start screen with level select and how-to-play; keyboard: H hint,
  R restart, N next level, 1/2/3 pick level, Esc menu, M mute.
- `?demo=found3&level=N` pre-marks N differences for screenshots;
  `?demo=win&level=N` shows the level-complete screen. Normal play ignores it.

## How it was built

Written from scratch in this session by the agent (Muse app, model
muse-spark-1.3), in the repo directory, file by file: `game/index.html`,
`game/style.css`, `game/scenes.js`, `game/audio.js`, `game/game.js`,
`main.ts`, `README.md`, `LICENSE`, `AGENT.md`. `vendor/makefun-game.ts`
is the kit file copied as-is, unmodified. The kit starter was NOT copied:
its game is a dodge-and-collect game, not spot-the-difference.

## Play locally

```
python3 -m http.server --directory game 8080
```

Open http://localhost:8080 in desktop Chrome.

## Hand-in check

```
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

Run twice into two fresh dirs and diff -r: both runs must be byte-identical.
