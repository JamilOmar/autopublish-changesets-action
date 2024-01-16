import hasChangesets from './has-changesets'
import { GitUtils } from './git-utils'
import { simpleGit } from 'simple-git'
import { promisify } from 'util'
import { readFile } from 'fs'
import { join } from 'path'
import { exec } from '@actions/exec'
import { AutoPublishOptions, AutoPublishOutput, Logger } from './types'
import resolveFrom from 'resolve-from'
const readFileAsync = promisify(readFile)

export default async function autoPublish(
  auth: string,
  versionScript: string,
  publishScript: string,
  options: AutoPublishOptions,
  cwd: string = process.cwd(),
  logger: Logger = console
): Promise<AutoPublishOutput> {
  logger.debug(`cwd value: ${cwd}`)
  const allowToCommitAndPush = await hasChangesets(cwd)
  const result = { hasChangesets: allowToCommitAndPush, isPublished: false }
  const executer = async (
    script: string,
    defaultCommand: string
  ): Promise<void> => {
    if (script) {
      const [command, ...args] = script.split(/\s+/)
      await exec(command, args, { cwd })
    } else {
      await exec(
        'node',
        [resolveFrom(cwd, '@changesets/cli/bin.js'), defaultCommand],
        {
          cwd
        }
      )
    }
  }
  try {
    logger.debug(`allowToCommitAndPush value: ${allowToCommitAndPush}`)
    if (allowToCommitAndPush) {
      logger.debug(`versionScript value: ${versionScript}`)
      await executer(versionScript, 'version')
      const git = simpleGit(cwd)
      const ghUtils = new GitUtils(auth, {
        owner: options.owner,
        repo: options.repo,
        branch: options.branch
      })
      const status = await git.status()
      logger.debug(`git status value: ${JSON.stringify(status)}`)
      logger.debug(`publishScript: ${publishScript || 'publish'}`)
      await executer(publishScript, 'publish')
      const uncommittedFiles = status.not_added.concat(
        status.modified,
        status.deleted
      )
      const files = []
      for (const file of uncommittedFiles) {
        const content = (await readFileAsync(join(cwd, file))).toString()
        files.push({ path: file, content, encoding: 'utf-8' })
      }
      const tree = await ghUtils.createTree(options.branch, files)
      logger.debug(`git tree value: ${JSON.stringify(tree)}`)
      const parentSha = await ghUtils.getParentSha()
      logger.debug(`git parentSha value: ${parentSha}`)

      const commit = await ghUtils.createCommit(
        options.commitMessage,
        tree.sha,
        [parentSha]
      )
      logger.debug(`git commit value: ${JSON.stringify(commit)}`)
      const pushCommit = await ghUtils.pushCommit(commit.sha)
      logger.debug(`git push result value: ${JSON.stringify(pushCommit)}`)

      logger.debug(`publishScript value: ${publishScript}`)
      await executer(publishScript, 'publish')
      result.isPublished = true
    }
    return result
  } catch (error) {
    logger.error(error)
    return result
  }
}
