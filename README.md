[![make.fun](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![Rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/zebhyrus/best-spot-the-difference-game-20261121-0451-entry/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![Reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/zebhyrus/best-spot-the-difference-game-20261121-0451-entry/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)

# Spot It! Cari Perbedaannya

Spot It! is an original spot-the-difference game: two near-identical scenes side by side, 7 fair-but-hidden differences per level across 3 hand-drawn scenes (a sunny garden, a harbor at dusk, a cozy kitchen), with markers on both panels, a remaining counter, hints, a timer, and a WebAudio chime on every find. Play it free at https://make.fun/bounty/best-spot-the-difference-game-20261121-0451 (referral code 9srzvfjv).

## Play locally

```
python3 -m http.server --directory game 8080
```

Then open http://localhost:8080 in desktop Chrome. Click a difference on either panel to mark it on both; H for a hint, R to restart, Esc for level select, M to mute.

## Files

- `game/index.html` — page shell, HUD, controls, overlay
- `game/style.css` — warm dark theme, panels, cards, shake animation
- `game/scenes.js` — the 3 scenes, drawn procedurally, and their 7 differences each
- `game/game.js` — game logic: clicks, timer, hints, score, stars, level flow, demo mode
- `game/audio.js` — WebAudio synth sounds (chime, blip, hint, win arpeggio)
- `main.ts` — hand-in program: copies `game/` + `screenshots/` and writes `dossier.json`
- `screenshots/` — real renders of the game in Chrome

## License

MIT — see `LICENSE`.
