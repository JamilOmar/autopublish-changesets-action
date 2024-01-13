export type Logger = {
  debug: (...args: any[]) => void
  error: (...args: any[]) => void
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
  
  export type TreeResult = {
    sha: string
    tree: any[]
    url: string
    truncated: boolean
  }
  
  export type CommitResult = {
    author: any
    committer: any
    message: string
    sha: string
    url: string
    tree: any
    parents: any[]
  }
  
  export type PushCommitResult = {
    url: string
    ref: string
    object: any
    node_id: string
  }