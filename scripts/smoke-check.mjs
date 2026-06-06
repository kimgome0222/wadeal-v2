#!/usr/bin/env node
/**
 * CELLOH smoke orchestrator — no Playwright, no new packages.
 * Runs route HTTP checks + content grep while dev server is up.
 *
 * Usage:
 *   npm run dev          # terminal 1
 *   npm run smoke:check  # terminal 2
 *
 * Env: CELLOH_QA_BASE_URL (default http://localhost:3000)
 */
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const base = process.env.CELLOH_QA_BASE_URL ?? "http://localhost:3000";

function run(label, script) {
  console.log(`\n=== ${label} ===\n`);
  const result = spawnSync("bash", [script], {
    cwd: root,
    stdio: "inherit",
    env: { ...process.env, CELLOH_QA_BASE_URL: base },
  });

  if (result.status !== 0) {
    console.error(`\n${label} failed (exit ${result.status ?? 1}).`);
    process.exit(result.status ?? 1);
  }
}

console.log(`CELLOH smoke-check — base URL: ${base}`);
console.log("Ensure dev server is running (npm run dev).\n");

run("Route HTTP smoke", "scripts/qa-routes.sh");
run("Content smoke", "scripts/smoke-content.sh");

console.log("\nAll smoke checks passed.");
