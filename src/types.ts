export type Logger = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  debug: (...args: any[]) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: (...args: any[]) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info: (...args: any[]) => void
}

export type AutoPublishOutput = {
  hadChangesets: boolean
}
export type GitUtilsContext = {
  owner: string
  repo: string
  branch: string
}

export type AutoPublishOptions = {
  owner: string
  repo: string
  branch: string
  commitMessage: string
  username?: string
  email?: string
  force?: boolean
}

export type AutoPublishFile = {
  path: string
  content?: string
  encoding?: string
  isDeleted?: boolean
}
