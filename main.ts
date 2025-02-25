/**
 * Module for detecting floating promises in TypeScript/JavaScript code.
 *
 * Floating promises are promises that are created but never handled, which can lead
 * to silent failures and hard-to-debug issues.
 *
 * @module no-fp
 *
 * @example
 * ```bash
 * # Run floating promise detection in project root
 * deno -RWN jsr:@sigmasd/no-fp
 * ```
 *
 * ## How it works
 * 1. Creates temporary ESLint and TypeScript config files
 * 2. Runs ESLint with rules to detect unhandled promises
 * 3. Cleans up temporary files after checking
 *
 * @module
 */
import { existsSync } from "jsr:@std/fs@1.0.13";

const ESLINT_CONFIG_PATH = "./eslint.config.mjs";
const TSCONFIG_PATH = "./tsconfig.json";

async function copy(src: string, dst: string) {
  await fetch(src).then(
    async (response) => {
      const file = await Deno.open(dst, { create: true, write: true });
      await response.body?.pipeTo(file.writable);
    },
  );
}

if (import.meta.main) {
  if (existsSync(ESLINT_CONFIG_PATH)) {
    console.error("eslint.config.js exists, refusing to run");
    Deno.exit(1);
  }
  if (existsSync(TSCONFIG_PATH)) {
    console.error("tsconfig.json exists, refusing to run");
    Deno.exit(1);
  }
  await copy(import.meta.resolve(ESLINT_CONFIG_PATH), ESLINT_CONFIG_PATH);
  await copy(import.meta.resolve(TSCONFIG_PATH), TSCONFIG_PATH);

  const mode = Deno.args.at(0) === "--install" ? "install" : "run";
  if (mode === "install") {
    Deno.exit(0);
  } else if (mode === "run") {
    await new Deno.Command(Deno.execPath(), {
      args: ["run", "-ES", "-RW=.", "npm:eslint@9.21.0"],
    }).spawn().status;
    Deno.removeSync(ESLINT_CONFIG_PATH);
    Deno.removeSync(TSCONFIG_PATH);
  }
}
