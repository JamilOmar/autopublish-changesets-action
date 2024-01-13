import { readPreState } from '@changesets/pre'
import readChangesets from '@changesets/read'
import { Logger } from './types'

export default async function hasChangesets(
  cwd: string = process.cwd(),
  logger: Logger = console
): Promise<boolean> {
  const preState = await readPreState(cwd)
  const changesets = await readChangesets(cwd)
  logger.debug(`readPreState value: ${JSON.stringify(preState)}`)
  logger.debug(`readChangesets value: ${JSON.stringify(changesets)}`)
  if (preState?.mode === 'pre') {
    const changesetsToFilter = new Set(preState.changesets)
    return changesets.filter(x => !changesetsToFilter.has(x.id)).length > 0
  } else {
    return changesets.length > 0
  }
}
