#!/usr/bin/env node
/**
 * Commit identity check.
 *
 * Verifies that every author and committer in the history uses the identity
 * agreed at initialization, and that no purge term reaches the metadata.
 *
 * Usage:
 *   node scripts/check-identity.mjs
 *   node scripts/check-identity.mjs --expect "name <email@host>"
 *   node scripts/check-identity.mjs --terms "name one, name two"
 *
 * Read-only. Exits 1 when it finds something, 0 when the history is clean.
 */

import { execFileSync } from 'node:child_process'

const ARGS = process.argv.slice(2)

function arg(name) {
  const i = ARGS.indexOf(name)
  return i >= 0 && ARGS[i + 1] ? ARGS[i + 1] : null
}

function git(...args) {
  return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
}

const terms = (arg('--terms') ?? '')
  .split(',')
  .map((t) => t.trim())
  .filter(Boolean)

function emailOf(value) {
  const m = /<([^>]+)>/.exec(value)
  return (m ? m[1] : value).trim().toLowerCase()
}

let expected = arg('--expect')
if (!expected) {
  try {
    expected = git('config', '--get', 'user.email').trim()
  } catch {
    expected = ''
  }
}

if (!expected) {
  console.log('no commit identity configured: set user.name and user.email before committing')
  console.log('')
  console.log('Identity: FINDINGS (1)')
  process.exit(1)
}

const expectedEmail = emailOf(expected)

let raw
try {
  raw = git('log', '--all', '--format=%h%x09%an%x09%ae%x09%cn%x09%ce')
} catch {
  console.log('not a git repository, or the repository has no commits yet')
  process.exit(0)
}

const commits = raw
  .split(/\r?\n/)
  .filter(Boolean)
  .map((line) => {
    const [hash, an, ae, cn, ce] = line.split('\t')
    return { hash, an, ae, cn, ce }
  })

if (commits.length === 0) {
  console.log('no commits to check')
  process.exit(0)
}

const findings = []
const identities = new Map()
const termHits = new Map()

for (const c of commits) {
  for (const [role, name, email] of [
    ['author', c.an, c.ae],
    ['committer', c.cn, c.ce],
  ]) {
    const idKey = `${role}|${email.toLowerCase()}`
    if (!identities.has(idKey)) identities.set(idKey, { role, name, email, commits: 0 })
    identities.get(idKey).commits += 1

    const haystack = `${name} ${email}`.toLowerCase()
    for (const term of terms) {
      if (!haystack.includes(term.toLowerCase())) continue
      const termKey = `${term.toLowerCase()}|${role}|${email.toLowerCase()}`
      if (!termHits.has(termKey)) termHits.set(termKey, { term, role, name, email, commits: 0 })
      termHits.get(termKey).commits += 1
    }
  }
}

for (const entry of identities.values()) {
  if (entry.email.toLowerCase() !== expectedEmail) {
    const plural = entry.commits === 1 ? 'commit' : 'commits'
    findings.push(
      `${entry.role} ${entry.name} <${entry.email}> in ${entry.commits} ${plural} — not the agreed identity <${expectedEmail}>`
    )
  }
}

for (const entry of termHits.values()) {
  const plural = entry.commits === 1 ? 'commit' : 'commits'
  findings.push(
    `${entry.role} ${entry.name} <${entry.email}> in ${entry.commits} ${plural} — purge term "${entry.term}"`
  )
}

for (const f of findings) console.log(f)
console.log('')
console.log(`Identity: ${findings.length === 0 ? 'CLEAN' : `FINDINGS (${findings.length})`}`)
process.exit(findings.length === 0 ? 0 : 1)
