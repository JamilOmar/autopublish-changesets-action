/**
 * Unit tests for the action's entrypoint, src/index.ts
 */

import autoPublish from '../src/autopublish'
import hasChangesets from '../src/has-changesets'
jest.mock('@changesets/read', () => {
  const originalModule = jest.requireActual('@changesets/read')
  return {
    __esModule: true,
    ...originalModule,
    default: jest.fn().mockResolvedValue([])
  }
})
jest.mock('../src/has-changesets', () => {
  const originalModule = jest.requireActual('../src/has-changesets')
  return {
    __esModule: true,
    ...originalModule,
    default: jest.fn().mockResolvedValue(false)
  }
})
describe('autoPublish', () => {
  it('Check if hasChangesets was not called', async () => {
    await autoPublish('MOCK', '', '', {
      owner: 'owner',
      repo: 'repo',
      branch: 'branch',
      commitMessage: 'commitMessage'
    })
    expect(hasChangesets).toHaveBeenCalled()
  })
})
