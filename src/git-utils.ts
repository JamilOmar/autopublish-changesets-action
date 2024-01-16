import { Octokit } from '@octokit/rest'
import {
  AutoPublishFile,
  BlobResult,
  CommitResult,
  GitUtilsContext,
  PushCommitResult,
  TreeResult
} from './types'

export class GitUtils {
  constructor(auth: string, context: GitUtilsContext) {
    this.octokitClient = new Octokit({ auth, request: fetch })
    this.context = context
  }

  private octokitClient: Octokit
  private context: GitUtilsContext

  async createBlob(content: string, encoding = 'utf-8'): Promise<BlobResult> {
    const { data } = await this.octokitClient.git.createBlob({
      owner: this.context.owner,
      repo: this.context.repo,
      content,
      encoding
    })
    return { sha: data?.sha, url: data?.url }
  }
  async createTree(
    baseTree: string,
    files: AutoPublishFile[]
  ): Promise<TreeResult> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tree: any = []
    const shaForBaseTree = await this.octokitClient.git.getTree({
      owner: this.context.owner,
      repo: this.context.repo,
      tree_sha: baseTree
    })
    for (const file of files) {
      const blobData = await this.createBlob(file.content, file.encoding)
      tree.push({
        path: file.path,
        mode: '100644',
        type: 'blob',
        sha: blobData?.sha
      })
    }
    const { data } = await this.octokitClient.git.createTree({
      owner: this.context.owner,
      repo: this.context.repo,
      base_tree: shaForBaseTree.data.sha,
      tree
    })

    return {
      sha: data?.sha,
      tree: data?.tree,
      url: data?.url,
      truncated: data?.truncated
    }
  }

  async createCommit(
    message: string,
    tree: string,
    parents: string[]
  ): Promise<CommitResult> {
    const { data } = await this.octokitClient.git.createCommit({
      owner: this.context.owner,
      repo: this.context.repo,
      message,
      tree,
      parents
    })
    return {
      author: data?.author,
      committer: data?.committer,
      message: data?.message,
      sha: data?.sha,
      url: data?.url,
      tree: data?.tree,
      parents: data?.parents
    }
  }

  async pushCommit(
    commitSha: string,
    force = false
  ): Promise<PushCommitResult> {
    const { data } = await this.octokitClient.git.updateRef({
      owner: this.context.owner,
      repo: this.context.repo,
      ref: `heads/${this.context.branch}`,
      sha: commitSha,
      force
    })

    return {
      url: data?.url,
      ref: data?.ref,
      object: data?.object,
      node_id: data?.node_id
    }
  }

  async getParentSha(): Promise<string> {
    const { data } = await this.octokitClient.git.getRef({
      owner: this.context.owner,
      repo: this.context.repo,
      ref: `heads/${this.context.branch}`
    })

    return data?.object?.sha || ''
  }
}
