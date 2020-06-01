#!/usr/bin/env ts-node-script

import { readFile, writeFile } from 'fs/promises'
import { join as pathJoin } from 'path'

import { fetch as gitFetch, getCommonAncestor, getCommitMessages, getCommitHashesList } from '../lib/git'
import { getPlumberEnvVars, PlumberEnv } from '../lib/plumberEnv'
import { getPackageJsonVersionFromCommit, computeVersion } from '../lib/version'
import { execWithStringReturn } from '../lib/exec'

async function computeAvatarVersion(env: PlumberEnv): Promise<string> {
  // We do this so we can "compare" branches
  await gitFetch()

  const ancestorGitRef = await getCommonAncestor(env.PLUMBER_GIT_MASTER_REF, env.CI_COMMIT_SHA)

  const commitHashes = await getCommitHashesList(ancestorGitRef, env.CI_COMMIT_SHA)
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
  await execWithStringReturn(`git add ${filePath}`)

  console.log('git hook: Updated package.json version')
  return true
}

async function run(): Promise<void> {
  const env = await getPlumberEnvVars()
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
