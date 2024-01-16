export type Logger = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  debug: (...args: any[]) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: (...args: any[]) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info: (...args: any[]) => void
}

export type AutoPublishOutput = {
  hasChangesets: boolean
  isPublished: boolean
}
export type GitUtilsContext = {
  owner: string
  repo: string
  branch: string
}
export type BlobResult = {
  sha: string
  url: string
}
export type Tree = {
  path?: string
  mode?: string
  type?: string
  sha?: string
  size?: number
  url?: string
}

export type TreeResult = {
  sha: string
  tree: Tree[]
  url: string
  truncated: boolean
}

export type User = {
  date: string
  email: string
  name: string
}
export type Parents = {
  sha: string
  url: string
  html_url: string
}
export type CommitResult = {
  author: User
  committer: User
  message: string
  sha: string
  url: string
  tree: Tree
  parents: Parents[]
}

export type PushCommitObject = {
  type: string
  sha: string
  url: string
}
export type PushCommitResult = {
  url: string
  ref: string
  object: PushCommitObject
  node_id: string
}

export type AutoPublishOptions = {
  owner: string
  repo: string
  branch: string
  commitMessage: string
}

export type AutoPublishFile = {
  path: string
  content?: string
  encoding?: string
  isDeleted?: boolean
}
