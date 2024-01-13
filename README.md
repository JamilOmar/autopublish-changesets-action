# Has Changesets Action

[![GitHub Super-Linter](https://github.com/jamilomar/has-changesets-action/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/jamilomar/has-changesets-action/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/jamilomar/has-changesets-action/actions/workflows/check-dist.yml/badge.svg)](https://github.com/jamilomar/has-changesets-action/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/jamilomar/has-changesets-action/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/jamilomar/has-changesets-action/actions/workflows/codeql-analysis.yml)
[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)

Helper action to check if a changesets exists in the PR. It is really useful for auto-merge PRs.


## Outputs
The action will provide one output:

hasChangeset - The result from the action indicating if a changeset exists.


## Usage
Add the action to your job, and use the value to launch or not a changeset version with changeset publish 
```yaml
steps:
  - name: Checks for changesets
  id: changesets
  uses: jamilomar/has-changesets-action@v0.0.4

  - name: Release Changesets
    id: release-changesets
    if: steps.changesets.outputs.hasChangesets == 'true'
    run: |

      pnpm release:ci
      echo "Publishing Changes from Changesets"
      pnpm changeset version
      pnpm chageset publish
      pnpm changeset tag
      git config user.name 'github-actions[bot]'
      git config user.email 'github-actions[bot]@users.noreply.github.com'
      git add .
      git commit -m 'chore: update versions'
      git push --follow-tags
          
```
## License

[MIT](./LICENSE)