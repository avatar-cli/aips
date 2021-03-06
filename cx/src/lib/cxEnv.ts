import { trimmedCxExec } from './exec'

export type CxGitEnv = {
  CX_GIT_REF_NAME: string
  CX_GIT_COMMIT_HASH: string
}

export type CxDirectoriesEnv = {
  CX_PROJECT_DIR: string
}

export type CxExtraEnv = {
  CX_GIT_MAIN_REF: string
  CX_IN_CI?: string
}

export type CxEnv = NodeJS.ProcessEnv & CxGitEnv & CxDirectoriesEnv & CxExtraEnv

function inCI(): '1' | undefined {
  if (process.env.GITLAB_CI || process.env.CI) {
    return '1'
  }
}

async function getGitRefName(): Promise<string> {
  return trimmedCxExec('git rev-parse --abbrev-ref HEAD')
}

async function getGitCommitHash(): Promise<string> {
  return trimmedCxExec('git rev-parse HEAD')
}

async function getProjectDirectory(): Promise<string> {
  return trimmedCxExec('git rev-parse --show-toplevel')
}

export async function getCxEnvVars(): Promise<CxEnv> {
  const cxInCI = inCI()

  const gitEnv: CxGitEnv = {
    CX_GIT_REF_NAME: await getGitRefName(),
    CX_GIT_COMMIT_HASH: await getGitCommitHash(),
  }
  const directoriesEnv: CxDirectoriesEnv = { CX_PROJECT_DIR: await getProjectDirectory() }
  const extraEnv: CxExtraEnv = {
    CX_GIT_MAIN_REF: cxInCI ? 'origin/main' : 'main',
    CX_IN_CI: cxInCI,
  }

  if (process.env.CX_IN_CI) {
    console.log('WARNING: CX_IN_CI env var has been set in the environment, but it should be inferred at runtime')
  }

  return {
    ...process.env,
    ...gitEnv,
    ...directoriesEnv,
    ...extraEnv,
  }
}
