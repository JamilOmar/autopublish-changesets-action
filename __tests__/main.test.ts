import autoPublish from '../src/autopublish'
import * as core from '@actions/core'
import { run } from '../src/main'
jest.mock('../src/autopublish', () => {
  const originalModule = jest.requireActual('../src/autopublish')
  return {
    __esModule: true,
    ...originalModule,
    default: jest.fn().mockResolvedValue(true)
  }
})

jest.mock('@actions/github', () => {
  const originalModule = jest.requireActual('@actions/github')
  return {
    __esModule: true,
    ...originalModule,
    context: {
      repo: {
        owner: 'owner',
        repo: 'repo'
      },
      ref: 'ref'
    },
    default: jest.fn().mockResolvedValue(true)
  }
})

describe('Main', () => {
  let chdirSpy: jest.SpyInstance
  beforeEach(() => {
    process.env.GITHUB_TOKEN = 'MOCK'
    chdirSpy = jest.spyOn(process, 'chdir').mockImplementation(() => {})
  })

  afterEach(() => {
    process.env.GITHUB_TOKEN = ''
    chdirSpy.mockRestore()
  })
  it('Check if autopublish was not called', async () => {
    process.env.GITHUB_TOKEN = ''
    await run()
    expect(autoPublish).not.toHaveBeenCalled()
  })
  it('Check if autopublish was called', async () => {
    jest.mock('../src/has-changesets', () => {
      const originalModule = jest.requireActual('../src/has-changesets')
      return {
        __esModule: true,
        ...originalModule,
        default: jest.fn().mockResolvedValue(true)
      }
    })
    await run()
    expect(autoPublish).toHaveBeenCalled()
  })

  it('should change directory if cwd input is provided', async () => {
    jest.spyOn(core, 'getInput').mockImplementation((name: string) => {
      switch (name) {
        case 'publishScript':
          return 'npm publish'
        case 'versionScript':
          return 'npm version'
        case 'commitMessage':
          return 'Test commit message'
        case 'cwd':
          return '/path/to/directory'
        default:
          return ''
      }
    })
    await run()
    expect(chdirSpy).toHaveBeenCalledWith('/path/to/directory')
  })
})
