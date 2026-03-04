# CLAUDE.md

## Project

This is a **GitHub Actions composite action** (`changelog-commit`) published to the GitHub Actions Marketplace.

It generates a changelog with git-cliff, commits it, creates a release tag, and pushes both to the target branch.

Extracted from [`TaiSakuma/legendary-octo-happiness`](https://github.com/TaiSakuma/legendary-octo-happiness) (`.github/actions/changelog-commit/`).

## Structure

- `action.yml` — the composite action definition
- `cliff.toml` — default git-cliff configuration
- `src/patch-config.ts` — TypeScript source for config patching
- `dist/patch-config.cjs` — compiled CJS bundle (must be committed)
- `tests/patch-config.test.ts` — tests using Vitest + fast-check

## Build & Test

```bash
npm install        # install dependencies
npm run build      # compile src/patch-config.ts → dist/patch-config.cjs (esbuild)
npm test           # run tests with vitest
```

## How patch-config works

When users provide `body` or `commit-parsers` inputs, the action copies `cliff.toml` to a temp file, then runs `node dist/patch-config.cjs <path>` to patch the TOML config in-place. The script reads `INPUT_BODY` and `INPUT_COMMIT_PARSERS` from environment variables.

## Important

The `dist/` directory **must be committed** — GitHub Actions runs the compiled output directly. After any change to `src/`, always run `npm run build` and commit the updated `dist/patch-config.cjs`.

## Releases

1. Tag with `v1.x.x` (e.g., `v1.0.0`).
2. Create a GitHub Release from the tag.
3. Check **"Publish this Action to the GitHub Marketplace"** in the release form.
4. Maintain a floating `v1` tag pointing to the latest `v1.x.x` for users who pin to the major version.

## Marketplace

- Branding: icon `file-text`, color `green`.
- The `name` and `description` fields in `action.yml` appear on the Marketplace listing.
