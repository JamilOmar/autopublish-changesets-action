import { Octokit } from '@octokit/rest'
import {  BlobResult  , CommitResult  , GitUtilsContext , PushCommitResult  , TreeResult } from './types'

export class GitUtils {
  constructor(auth: string, context: GitUtilsContext) {
    this.octokitClient = new Octokit({ auth, request: fetch })
    this.context = context
  }

  private octokitClient: Octokit
  private context: GitUtilsContext

  public async createBlob(
    content: string,
    encoding: string = 'utf-8'
  ): Promise<BlobResult> {
    const { data } = await this.octokitClient.git.createBlob({
      owner: this.context.owner,
      repo: this.context.repo,
      content,
      encoding
    })
    return { sha: data.sha, url: data.url }
  }
  public async createTree(baseTree: string, files: any[]): Promise<TreeResult> {
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

  public async createCommit(
    message: any,
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
      author: data.author,
      committer: data.committer,
      message: data.message,
      sha: data.sha,
      url: data.url,
      tree: data.tree,
      parents: data.parents
    }
  }

  public async pushCommit(
    commitSha: string,
    force: boolean = false
  ): Promise<PushCommitResult> {
    const { data } = await this.octokitClient.git.updateRef({
      owner: this.context.owner,
      repo: this.context.repo,
      ref: `heads/${this.context.branch}`,
      sha: commitSha,
      force
    })

    return {
      url: data.url,
      ref: data.ref,
      object: data.object,
      node_id: data.node_id
    }
  }

  public async getParentSha(){
    const {data} = await this.octokitClient.git.getRef(
        {
            owner: this.context.owner,
            repo: this.context.repo,
            ref: `heads/${this.context.branch}`
        
        })
  
    return data.object.sha
}
}
