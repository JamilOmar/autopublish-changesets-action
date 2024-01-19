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

# Complex Example

You can use the hasChanged output for complex publish actions:

```sh
 - name: Run Auto Publish
        id: autopublish
        uses: jamilomar/autopublish-changesets-action@v0.0.5
        with:
          commitMessage: 'chore: publish changeset'            
        env:
          GITHUB_TOKEN: ${{ secrets.PAT_TOKEN }}

      - name: Check for changesets
        id: release-changesets
        if: steps.autopublish.outputs.hadChangesets == 'true'
        run: |
            sed -e "s|'libs\/|'dist/|" pnpm-workspace.yaml > pnpm-new.yaml && mv pnpm-new.yaml pnpm-workspace.yaml
            pnpm release:ci
            echo "Modify Workspace File Back"
            sed -e "s|'dist\/|'libs/|" pnpm-workspace.yaml > pnpm-new.yaml && mv pnpm-new.yaml pnpm-workspace.yaml
            git pull --rebase --autostash
            pnpm changeset tag
            git push --follow-tags
            echo "Set Version's Output"
            echo mainApiVersion="" >>$GITHUB_OUTPUT
            echo mainAppVersion="" >>$GITHUB_OUTPUT
            pnpm set-versions
            if [ -f MAIN_API_VERSION ]; then
              echo "mainApiVersion=$(cat MAIN_API_VERSION)" >> $GITHUB_OUTPUT
              rm MAIN_API_VERSION
            else
              echo mainApiVersion="" >> $GITHUB_OUTPUT
            fi
            if [ -f MAIN_APP_VERSION ]; then
              echo "mainAppVersion=$(cat MAIN_APP_VERSION)" >> $GITHUB_OUTPUT
              rm MAIN_APP_VERSION
            else
              echo mainAppVersion="" >> $GITHUB_OUTPUT
            fi
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    outputs:
      mainApiVersion: ${{ steps.release-changesets.outputs.mainApiVersion }}
      mainAppVersion: ${{ steps.release-changesets.outputs.mainAppVersion }}

```
## License

[MIT](./LICENSE)