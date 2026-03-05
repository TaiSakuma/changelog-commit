# Contributing

## PR Title Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/) for **PR titles**. Since we squash-merge, the PR title becomes the final commit message.

### Format

```text
type: description
```

### Allowed Types

| Type | Purpose |
|------|---------|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation only |
| `style` | Code style (formatting, semicolons, etc.) |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `perf` | Performance improvement |
| `test` | Adding or updating tests |
| `build` | Build system or external dependencies |
| `ci` | CI configuration |
| `chore` | Other changes that don't modify src or test files |
| `revert` | Reverts a previous commit |

### Examples

- `feat: add custom cliff.toml input`
- `fix: handle empty commit-parsers input`
- `docs: update installation instructions`

### Individual Commits

Individual commit messages within a PR are free-form. Only the PR title is enforced.

## Development

### Prerequisites

- Node.js 20+
- npm

### Setup

```bash
npm install
```

### Build

```bash
npm run build    # compile src/patch-config.ts -> dist/patch-config.cjs (esbuild)
```

The `dist/` directory **must be committed** — GitHub Actions runs the compiled output directly. After any change to `src/`, always run `npm run build` and commit the updated `dist/patch-config.cjs`.

### Test

```bash
npm test         # run tests with vitest
```

## CI

CI runs on push to `main` and on pull requests:

- **Unit tests** — runs `npm test` (Vitest + fast-check).
- **Build check** — runs `npm run build` and verifies `dist/` is up to date via `git diff --exit-code dist/`.
- **PR title validation** — ensures PR titles follow Conventional Commits format.
- **Conventional labels** — automatically labels PRs based on their title type.

## Releasing

This project uses a two-tag release flow automated by CI:

1. Tag with the `u` prefix and push:

   ```bash
   git tag u1.x.x
   git push origin u1.x.x
   ```

2. The **Generate changelog** workflow runs automatically, updating `CHANGELOG.md` and creating the `v1.x.x` tag.

3. The **Release** workflow then runs automatically, creating a GitHub Release with auto-generated notes and updating the floating major-version tag (e.g., `v1` for `v1.x.x`).

> **Note:** The initial Marketplace publication must be done manually via the GitHub web UI by creating a release and checking **"Publish this Action to the GitHub Marketplace"**. Subsequent releases are listed automatically.
