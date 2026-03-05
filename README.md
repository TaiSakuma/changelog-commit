# changelog-commit

[![GitHub Marketplace](https://img.shields.io/badge/Marketplace-changelog--commit-green?logo=github)](https://github.com/marketplace/actions/changelog-commit)

A GitHub Action that generates a changelog with [git-cliff](https://git-cliff.org/), commits it, creates a release tag, and pushes both to the target branch.

## Usage

```yaml
- uses: TaiSakuma/changelog-commit@v1
  with:
    trigger-tag: ${{ github.ref_name }}
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Full example

```yaml
on:
  push:
    tags:
      - "u[0-9]+.*"

jobs:
  changelog:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: TaiSakuma/changelog-commit@v1
        id: changelog
        with:
          trigger-tag: ${{ github.ref_name }}
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - run: echo "Release tag is ${{ steps.changelog.outputs.release-tag }}"
      - run: echo "Changed: ${{ steps.changelog.outputs.changed }}"
```

## Inputs

| Name              | Description                                                                                          | Required | Default        |
| ----------------- | ---------------------------------------------------------------------------------------------------- | -------- | -------------- |
| `trigger-tag`     | Tag that triggered the workflow (e.g., `u1.2.3`)                                                     | Yes      |                |
| `trigger-tag-prefix` | Prefix to strip from the trigger tag                                                              | No       | `u`            |
| `release-tag-prefix` | Prefix for the release tag                                                                        | No       | `v`            |
| `branch`          | Branch to verify against, commit to, and push                                                        | No       | `main`         |
| `changelog-path`  | Path to the changelog file                                                                           | No       | `CHANGELOG.md` |
| `commit-parsers`  | TOML array of commit parsers to override the defaults (e.g., `[{ message = "^feat", group = "Features" }]`) | No | `""`           |
| `body`            | Tera template for the changelog body (overrides the default)                                         | No       | `""`           |

## Outputs

| Name          | Description                                           |
| ------------- | ----------------------------------------------------- |
| `release-tag` | Computed release tag (e.g., `v1.2.3`)                 |
| `version`     | Bare version number (e.g., `1.2.3`)                   |
| `changed`     | `true` or `false` — whether the changelog was updated |

## How it works

1. Checks out the target branch with full history (`fetch-depth: 0`).
2. Verifies the trigger tag exists on the target branch.
3. Strips the `trigger-tag-prefix` and prepends `release-tag-prefix` to derive the release tag.
4. Copies the bundled `cliff.toml` to a temp file. If `body` or `commit-parsers` inputs are provided, patches the config using `dist/patch-config.cjs`.
5. Runs `git-cliff` to generate the changelog and prepend it to the changelog file.
6. Commits the changelog, creates the release tag, and pushes both.

## Customization

### Custom commit parsers

Override the default commit parser groups by providing a TOML inline array:

```yaml
- uses: TaiSakuma/changelog-commit@v1
  with:
    trigger-tag: ${{ github.ref_name }}
    commit-parsers: |
      [
        { message = "^feat", group = "Features" },
        { message = "^fix", group = "Bug Fixes" },
        { message = "^docs", group = "Documentation" },
      ]
```

### Custom body template

Override the Tera template used for the changelog body:

```yaml
- uses: TaiSakuma/changelog-commit@v1
  with:
    trigger-tag: ${{ github.ref_name }}
    body: |
      {% for group, commits in commits | group_by(attribute="group") %}
      ### {{ group | upper_first }}
      {% for commit in commits %}
      - {{ commit.message }}
      {% endfor %}
      {% endfor %}
```

### Default cliff.toml

The bundled `cliff.toml` provides a default configuration that:

- Groups commits by [Conventional Commits](https://www.conventionalcommits.org/) type (feat, fix, perf, docs, refactor/style, test, build/ci/chore, revert).
- Skips `docs: update CHANGELOG` commits to avoid self-referencing entries.
- Links pull requests using GitHub remote data.
- Orders groups using HTML comment prefixes for consistent ordering.

See [`cliff.toml`](cliff.toml) for the full default configuration.

## License

[MIT](LICENSE)
