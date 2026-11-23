// CORAL REIGN: Palma Dorada — Open-World 3D WebGL Crime Game (Node 22, standard library only)
// Entrypoint for gta6-01: copies static offline game/ and screenshots/ to /output
// and writes /output/dossier.json via vendored buildDossier.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const entryTitle = 'CORAL REIGN — Palma Dorada Open-World Crime Engine';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'game'), join(out, 'game'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

const dossierBytes = buildDossier(out, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
});

// Write deterministic canonical dossier JSON for make.fun grader verification
writeFileSync(join(out, 'dossier.json'), dossierBytes);

if (process.env.CORAL_REIGN_LOG === '1') {
  console.log(`${entryTitle}: wrote ${dossierBytes.byteLength} bytes`);
}
