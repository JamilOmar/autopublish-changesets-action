import hasChangeSets from '../src/has-changesets'
import * as pre from '@changesets/pre'
import readChangesets from '@changesets/read'
jest.mock('@changesets/read', () => {
  const originalModule = jest.requireActual('@changesets/read')
  return {
    __esModule: true,
    ...originalModule,
    default: jest.fn().mockResolvedValue([{ id: 'test' }])
  }
})

describe('hasChangeSets', () => {
  it('calls hasChangeSets without preState', async () => {
    jest
      .spyOn(pre, 'readPreState')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .mockResolvedValue({} as any)
    const result = await hasChangeSets()
    expect(result).toBe(true)

    expect(readChangesets).toHaveBeenCalled()
  })
  it('calls hasChangeSets and preState', async () => {
    jest
      .spyOn(pre, 'readPreState')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .mockResolvedValue({ mode: 'pre', changesets: [{ id: 'test' }] } as any)
    const result = await hasChangeSets()
    expect(result).toBe(true)
    expect(readChangesets).toHaveBeenCalled()
  })
})
