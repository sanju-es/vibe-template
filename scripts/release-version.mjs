#!/usr/bin/env node
/**
 * Versioned release.
 *
 * Creates an annotated tag on the current head once the checks pass, then pushes
 * the branch and that single tag. Tags are never pushed in bulk.
 *
 * Usage:
 *   node scripts/release-version.mjs --version 2.1.0 --expect "<email>"
 *   node scripts/release-version.mjs --bump patch --expect "<email>"
 *   node scripts/release-version.mjs --bump minor --dry-run
 *
 * Exit codes:
 *   0  released, or would release with --dry-run
 *   1  refused: something is not ready
 */

import { execFileSync } from 'node:child_process'

const REMOTE = 'github'
const BRANCH = 'main'
const TAG_PREFIX = 'v'

const args = process.argv.slice(2)
function arg(name) {
  const i = args.indexOf(name)
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : null
}

const dryRun = args.includes('--dry-run')
const explicit = arg('--version')
const bump = arg('--bump')
const expect = arg('--expect')

function stop(message, detail) {
  if (detail) console.log(detail)
  console.log('')
  console.log(`Release: REFUSED — ${message}`)
  process.exit(1)
}

function git(...cmd) {
  return execFileSync('git', cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim()
}

function gitOk(...cmd) {
  try {
    git(...cmd)
    return true
  } catch {
    return false
  }
}

function gate(script, extra = []) {
  try {
    execFileSync(process.execPath, [script, ...extra], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
    console.log(`  ${script}: pass`)
  } catch (error) {
    const output = `${error.stdout ?? ''}${error.stderr ?? ''}`.trim().split(/\r?\n/).slice(-8).join('\n')
    stop(`${script} did not pass`, output)
  }
}

function parseVersion(value) {
  const m = /^v?(\d+)\.(\d+)\.(\d+)$/.exec(String(value ?? '').trim())
  return m ? { text: m.slice(1, 4).join('.'), parts: m.slice(1, 4).map(Number) } : null
}

// 1. Repository state.
if (!gitOk('rev-parse', '--is-inside-work-tree')) stop('this folder is not a git repository')

const branch = git('rev-parse', '--abbrev-ref', 'HEAD')
if (branch !== BRANCH) stop(`the current branch is ${branch}, not ${BRANCH}`)

const dirty = git('status', '--porcelain')
if (dirty) stop('the working tree is not clean', dirty)

// 2. Identity of the tagger, which is published with the tag.
const name = git('config', '--get', 'user.name')
const email = git('config', '--get', 'user.email')
if (!name || !email) stop('user.name and user.email are not configured')
if (expect && email.toLowerCase() !== expect.trim().replace(/^<|>$/g, '').toLowerCase()) {
  stop(`the configured email <${email}> is not the agreed one <${expect}>`)
}
console.log(`tagger: ${name} <${email}>`)

// 3. The remote head must be the commit that is about to be tagged.
try {
  git('fetch', REMOTE, '--prune', '--quiet')
} catch {
  stop(`the remote ${REMOTE} cannot be reached`)
}
const head = git('rev-parse', 'HEAD')
const remoteHead = git('rev-parse', `${REMOTE}/${BRANCH}`)
if (head !== remoteHead) {
  stop(`the local ${BRANCH} is not the published head`, `  local  ${head.slice(0, 8)} · remote ${remoteHead.slice(0, 8)}`)
}

// 4. The same checks the maintenance mode closes with.
console.log('checks:')
gate('scripts/sanitize-check.mjs')
gate('scripts/check-docs.mjs', ['--strict'])
gate('scripts/check-identity.mjs')

// 5. Next version.
let next
if (explicit) {
  next = parseVersion(explicit)
  if (!next) stop(`--version must look like 2.1.0, got "${explicit}"`)
} else if (bump) {
  if (!['major', 'minor', 'patch'].includes(bump)) stop(`--bump must be major, minor or patch, got "${bump}"`)
  if (!gitOk('describe', '--tags', '--abbrev=0')) {
    stop('there is no previous tag: use --version for the first release')
  }
  const last = parseVersion(git('describe', '--tags', '--abbrev=0'))
  if (!last) stop('the last tag is not a version')
  const [major, minor, patch] = last.parts
  next = parseVersion(
    bump === 'major' ? `${major + 1}.0.0` : bump === 'minor' ? `${major}.${minor + 1}.0` : `${major}.${minor}.${patch + 1}`
  )
  console.log(`last tag: ${TAG_PREFIX}${last.text}`)
}

const tag = `${TAG_PREFIX}${next.text}`
if (gitOk('rev-parse', '-q', '--verify', `refs/tags/${tag}`)) stop(`the tag ${tag} already exists`)

// 6. Message: the subject of every commit since the previous tag.
const lastTag = gitOk('describe', '--tags', '--abbrev=0') ? git('describe', '--tags', '--abbrev=0') : null
const range = lastTag ? `${lastTag}..HEAD` : 'HEAD'
const subjects = git('log', '--format=- %s', range).split(/\r?\n/).filter(Boolean).slice(0, 30)
const message = [`Release ${tag}`, '', ...subjects].join('\n')

console.log('')
console.log(`tag:     ${tag} on ${head.slice(0, 8)}`)
console.log(`commits: ${subjects.length}`)

if (dryRun) {
  console.log('')
  console.log(`Release: WOULD CREATE ${tag} (dry run, nothing written)`)
  process.exit(0)
}

// 7. Tag and publish, the branch and that single tag in one push.
git('tag', '-a', tag, '-m', message)
try {
  git('push', REMOTE, BRANCH, `refs/tags/${tag}`)
} catch {
  console.log('')
  console.log(`the tag exists only in this repository; remove it with: git tag -d ${tag}`)
  stop(`the push to ${REMOTE} failed`)
}

console.log('')
console.log(`Release: PUBLISHED ${tag}`)
process.exit(0)
