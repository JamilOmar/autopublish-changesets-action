import * as core from '@actions/core'
import autoPublish from './autopublish'
import * as github from '@actions/github'
/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
    const githubToken = process.env.GITHUB_TOKEN

    if (!githubToken) {
      throw new Error(
        'Please add the GITHUB_TOKEN to the autopublish changesets action'
      )
    }
    const inputCwd = core.getInput('cwd')
    if (inputCwd) {
      core.info('changing directory to the one given as the input')
      process.chdir(inputCwd)
    }
    const publishScript = core.getInput('publishScript')
    const versionScript = core.getInput('versionScript')
    const force = core.getBooleanInput('force')

    const owner = github.context.repo.owner
    const repo = github.context.repo.repo
    const branch = github.context.ref.replace('refs/heads/', '')

    const commitMessage = core.getInput('commitMessage')
    const result = await autoPublish(
      githubToken,
      versionScript,
      publishScript,
      {
        owner,
        repo,
        branch,
        commitMessage,
        force
      },
      process.cwd(),
      core
    )

    core.setOutput('hadChangesets', result?.hadChangesets?.toString())
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
