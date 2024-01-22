import hasChangesets from './has-changesets'
import { exec } from '@actions/exec'
import { AutoPublishOptions, AutoPublishOutput, Logger } from './types'
import resolveFrom from 'resolve-from'
import { createTokenAuth } from '@octokit/auth-token'

export default async function autoPublish(
  authToken: string,
  versionScript: string,
  publishScript: string,
  options: AutoPublishOptions,
  cwd: string = process.cwd(),
  logger: Logger = console
): Promise<AutoPublishOutput> {
  logger.debug(`cwd value: ${cwd}`)
  const allowToCommitAndPush = await hasChangesets(cwd)
  const result = { hadChangesets: allowToCommitAndPush }
  const executer = async (
    script: string,
    defaultCommand?: string
  ): Promise<void> => {
    const hasScript = !!script
    const hasDefaultCommand = !!defaultCommand
    if (hasScript) {
      const [command, ...args] = script.split(/\s+/)
      await exec(command, args, { cwd })
    } else if (hasDefaultCommand) {
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
      logger.debug(`run changeset tag`)
      await executer('', 'tag')
      const auth = createTokenAuth(authToken)
      const { token, tokenType } = await auth()
      const tokenWithPrefix =
        tokenType === 'installation' ? `x-access-token:${token}` : token

      const repositoryUrl = `https://${tokenWithPrefix}@github.com/${options.owner}/${options.repo}.git`
      await exec('git', ['pull', 'origin', options.branch], { cwd })
      await exec('git', ['add', '.'], { cwd })
      await exec(
        'git',
        ['commit', '-m', options.commitMessage || 'chore: release [skip ci]'],
        { cwd }
      )
      const args = ['push', repositoryUrl, options.branch, '--follow-tags']
      if (options.force) {
        args.push('--force')
      }

      await exec('git', args, { cwd })

      const hasPublishScript = !!publishScript
      if (hasPublishScript) {
        logger.debug(`publishScript value: ${publishScript}`)
        await executer(publishScript)
      }
    }
    return result
  } catch (error) {
    logger.error(error)
    throw error
  }
}
