# CORAL REIGN — Palma Dorada

[![make.fun · gta6-01](https://make.fun/badge/gta6-01.svg)](https://make.fun/bounty/gta6-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-01)
[![rank](https://make.fun/badge/gta6-01/ricoxyz/coral-reign-gta6/rank.svg)](https://make.fun/bounty/gta6-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-01)
[![reward](https://make.fun/badge/gta6-01/ricoxyz/coral-reign-gta6/reward.svg)](https://make.fun/bounty/gta6-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-01)

A sun-soaked 3D WebGL coastal open-world crime game set in **Palma Dorada**, built with Three.js and zero external runtime build dependencies for the [make.fun gta6-01 bounty](https://make.fun/bounty/gta6-01).

## Running Locally

Requires **Node.js 22+** (uses standard library only, no `npm install` or build step required):

```bash
node serve.ts
```

Then open [http://localhost:8080](http://localhost:8080) in your browser. Pass `--port <port>` to use a different port (e.g. `node serve.ts --port 3000`).

To build the output bundle and `dossier.json` locally:

```bash
MAKEFUN_OUTPUT_DIR=./out node main.ts
```

## Features

- **6 Distinct Coastal & Urban Districts**: *Solana Strip*, *Coral Marina*, *Vidrio Downtown*, *Mercado Viejo*, *Palma Pier*, and *Mirador Heights*, rendered in golden-hour sunset lighting with ocean/beachfront, roads, and neon landmarks.
- **6 Vehicle Archetypes & Arcade Drift Physics**: *Coral Vortex GT*, *Solaris Aero RS*, *Mirador Cabrio V8*, *Mercado Titan 4x4*, *Dorada Armored Transport*, and *Palma PD Interceptor*.
- **6 Selectable Weapons (`1`–`6`)**: Brass Knuckles, Coral 9mm Tactical, Solana Vector SMG, Carbine AR-9, Marina Breacher 12G, and Dorada Pulse Launcher.
- **Dynamic Police Wanted System**: Escalating patrol dispatch, roadblocks, and *AIR-1* helicopter pursuit.
- **10 Multi-Stage Story Missions & Crew Abilities**: Story progression across Palma Dorada plus tactical crew abilities (`Z` swap plates, `X` field repair, `C` police jammer).
- **3 In-Vehicle Radio Stations (`R`)**: *Solana Synth FM (98.4)*, *Coral Marina Bass (104.7)*, and *Vidrio Nightwave (107.9)* backed by procedural Web Audio synthesis.
- **Persistent Career Save Slots**: 3 `localStorage` save slots accessible from the title screen and pause map.

## Controls

| Input | Action |
| :--- | :--- |
| `W A S D` / Arrow Keys | Move on foot / Drive |
| `Shift` / `Space` | Sprint (on foot) / Handbrake drift (in vehicle) |
| Mouse | Orbit camera |
| `Left Click` / `Right Click` | Fire / Aim |
| `F` | Hijack / Enter or exit vehicle |
| `1` – `6` | Select weapon slot |
| `Z` / `X` / `C` | Crew abilities (Swap Plates / Field Repair / Police Jammer) |
| `R` | Cycle in-vehicle radio stations |
| `M` / `Esc` | Toggle full pause map / menu |

## Repository Layout

- `game/` — Self-contained browser game (`index.html`, vendored `three.min.js`, and modular ES sources under `game/src/`)
- `screenshots/` — Reference captures (`01_cover_chase.jpg` through `04_title_screen.jpg`)
- `serve.ts` — Lightweight Node 22 static dev server for `game/`
- `main.ts` — Submission entrypoint bundling `game/`, `screenshots/`, and `dossier.json` via `vendor/makefun-game.ts`

## License

[MIT](LICENSE)
