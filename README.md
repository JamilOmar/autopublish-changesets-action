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
      # optional username , github user name
      username: ''
      # optional email , github email
      email: ''
          
```


# Example



```sh
        - name: Run Auto Publish
        id: autopublish
        uses: jamilomar/autopublish-changesets-action@v0.0.11
        with:
          commitMessage: 'chore: publish changeset'
          publishScript: 'pnpm changeset publish'            
        env:
          GITHUB_TOKEN: ${{ secrets.PAT_TOKEN }}

   

```

# Complex Example

You can use the hasChanged output for complex publish actions:

```sh

    
      - uses: actions/checkout@v3.5.0
        with:
          fetch-depth: 0
          token: ${{ secrets.GITHUB_TOKEN }}
          persist-credentials : false
   
      - name: Run Auto Publish
        id: autopublish
        uses: jamilomar/autopublish-changesets-action@v0.0.11
        with:
          commitMessage: 'chore: publish changeset'
          username: 'Jamil Omar'
          email: 'jamilomar@dev.com'            
        env:
          GITHUB_TOKEN: ${{ secrets.PAT_TOKEN }}

      - name: Check for changesets
        id: release-changesets
        if: steps.autopublish.outputs.hadChangesets == 'true'
        run: |
           ......
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

```
## License

[MIT](./LICENSE)