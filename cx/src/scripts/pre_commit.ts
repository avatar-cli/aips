#!/usr/bin/env ts-node-script

import { readFile, writeFile } from 'fs/promises'
import { join as pathJoin } from 'path'

import { fetch as gitFetch, getCommonAncestor, getCommitMessages, getCommitHashesList } from '../lib/git'
import { getCxEnvVars, CxEnv } from '../lib/cxEnv'
import { getPackageJsonVersionFromCommit, computeVersion } from '../lib/version'
import { cxExec } from '../lib/exec'

async function computeAvatarVersion(env: CxEnv): Promise<string> {
  // We do this so we can "compare" branches
  await gitFetch()

  const ancestorGitRef = await getCommonAncestor(env.CX_GIT_MAIN_REF, env.CX_GIT_COMMIT_HASH)

  const commitHashes = await getCommitHashesList(ancestorGitRef, env.CX_GIT_COMMIT_HASH)
  const commitMessages = await getCommitMessages(commitHashes)

  const oldVersion = await getPackageJsonVersionFromCommit(ancestorGitRef)
  const newVersion = await computeVersion(oldVersion, commitMessages)

  return newVersion.join('.')
}

async function updatePackageJson(newVersion: string): Promise<boolean> {
  const filePath = pathJoin(__dirname, '..', '..', 'package.json')
  const packageJson: { [key: string]: any } = JSON.parse(await readFile(filePath, { encoding: 'utf8' }))

  if (packageJson?.version === newVersion) {
    return false
  }

  packageJson.version = newVersion
  await writeFile(filePath, JSON.stringify(packageJson, null, 2))
  await cxExec(`git add ${filePath}`)

  console.log('git hook: Updated package.json version')
  return true
}

async function run(): Promise<void> {
  if (!process.env.FROM_POSTCOMMIT_HOOK) {
    return
  }

  const env = await getCxEnvVars()
  const newVersion = await computeAvatarVersion(env)

  const updatedVersion = await updatePackageJson(newVersion)

  if (updatedVersion) {
    console.log('Updated package version')
  }
}

run()
  .then(() => {
    //
  })
  .catch(reason => {
    console.error(reason?.toString() ?? 'Unknown Error in pre_commit.ts')
    process.exit(1)
  })
