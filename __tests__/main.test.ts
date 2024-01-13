import hasChangeSets from '../src/has-changesets'
import { run } from '../src/main'
jest.mock('../src/has-changesets', () => {
  const originalModule = jest.requireActual('../src/has-changesets')
  return {
    __esModule: true,
    ...originalModule,
    default: jest.fn().mockResolvedValue(true)
  }
})

describe('Main', () => {
  it('Check if has changesets', async () => {
    await run()
    expect(hasChangeSets).toHaveBeenCalled()
  })
})
