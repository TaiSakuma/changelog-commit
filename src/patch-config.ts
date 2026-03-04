import * as TOML from "smol-toml";
import { readFileSync, writeFileSync } from "node:fs";

export interface PatchOptions {
  body?: string;
  commitParsers?: string;
}

/**
 * Patch a git-cliff TOML config string with optional overrides.
 *
 * - `body` replaces `changelog.body`
 * - `commitParsers` is a TOML inline array that replaces `git.commit_parsers`
 */
export function patchCliffConfig(
  content: string,
  options: PatchOptions,
): string {
  const config = TOML.parse(content) as Record<string, unknown>;

  if (options.body) {
    const changelog = (config["changelog"] ?? {}) as Record<string, unknown>;
    changelog["body"] = options.body;
    config["changelog"] = changelog;
  }

  if (options.commitParsers) {
    const wrapper = TOML.parse(`x = ${options.commitParsers}`) as Record<
      string,
      unknown
    >;
    const git = (config["git"] ?? {}) as Record<string, unknown>;
    git["commit_parsers"] = wrapper["x"];
    config["git"] = git;
  }

  return TOML.stringify(config);
}

// --- CLI entry point ---
const isMain =
  typeof process !== "undefined" &&
  process.argv[1] &&
  /patch-config\.[cm]?[jt]s$/.test(process.argv[1]);

if (isMain) {
  const configPath = process.argv[2];
  if (!configPath) {
    console.error("Usage: patch-config <config-path>");
    process.exit(1);
  }

  const body = process.env["INPUT_BODY"] ?? "";
  const commitParsers = process.env["INPUT_COMMIT_PARSERS"] ?? "";

  const content = readFileSync(configPath, "utf-8");
  const patched = patchCliffConfig(content, {
    body: body || undefined,
    commitParsers: commitParsers || undefined,
  });
  writeFileSync(configPath, patched);
}
