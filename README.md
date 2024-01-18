# Autopublish Changesets Action

[![GitHub autopublish-changesets-action](https://github.com/jamilomar/autopublish-changesets-action/actions/workflows/linter.yml/badge.svg)](https://github.com/autopublish-changesets-action/autopublish-changesets-action)
![CI](https://github.com/jamilomar/autopublish-changesets-action/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/jamilomar/autopublish-changesets-action/actions/workflows/check-dist.yml/badge.svg)](https://github.com/jamilomar/autopublish-changesets-action/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/jamilomar/autopublish-changesets-action/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/jamilomar/autopublish-changesets-action/actions/workflows/codeql-analysis.yml)
[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)

Helper action to auto-publish a changeset.


## Outputs
The action will provide one output:

hadChangeset - The result from the action indicating if there was a changeset.

## Usage
Add the action to your job and allow auto publish from your changesets in your code.
```yaml
steps:
  - name: Autopublish Action
    id: changesets
    uses: jamilomar/autopublish-changesets-action@v0.0.1
    with:
      # script to be used to publish the pr (changeset version by default)
      versionScript: changeset version
      # script to be used to publish the pr 
      publishScript: changeset publish
      # commit message
      commitMessage: 'chore: publish changeset'
      # optional cwd 
      cwd: ''
      # optional force, indicates if the github push should be forced
      force: false
          
```
## License

[MIT](./LICENSE)