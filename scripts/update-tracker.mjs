#!/usr/bin/env node
/**
 * Visual tracker update.
 *
 * Compares the version baked into the local `tracker.html` with the newest
 * published build and, when a newer one exists, downloads it, verifies it and
 * replaces the local file.
 *
 * Usage:
 *   node scripts/update-tracker.mjs --check   # report only, writes nothing
 *   node scripts/update-tracker.mjs           # download and replace
 *   node scripts/update-tracker.mjs --file other.html --repo owner/name
 *
 * Exit codes:
 *   0  up to date, or updated
 *   1  failure: the download or the verification did not match
 *   2  the source cannot be reached
 */

import { readFileSync, writeFileSync, renameSync, existsSync, unlinkSync } from 'node:fs'
import { createHash } from 'node:crypto'

const REPO = 'sanju-es/vibe-tracker-public'
const FILE = 'tracker.html'
const API = 'https://api.github.com'
const RAW = 'https://raw.githubusercontent.com'

// Published layout: a release publishes the two assets below; a tag without a
// release falls back to the build committed in the repository.
const RELEASE_ASSET = 'tracker.html'
const RELEASE_SHA = 'tracker.html.sha256'
const TAG_ARTIFACT = 'dist/index.html'
const TAG_SHA = 'dist/index.html.sha256'

const MIN_BYTES = 50_000
const VERSION_META = /name="project-tracking-version"\s+content="([^"]+)"/

const args = process.argv.slice(2)
function arg(name, fallback) {
  const i = args.indexOf(name)
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback
}

const checkOnly = args.includes('--check')
const repo = arg('--repo', REPO)
const file = arg('--file', FILE)

function fail(message, code = 1) {
  console.log(message)
  console.log('')
  console.log(`Tracker: FAILED (${code === 2 ? 'source unreachable' : 'error'})`)
  process.exit(code)
}

function versionOf(html) {
  const m = VERSION_META.exec(html)
  return m ? m[1].trim() : null
}

function parseVersion(value) {
  const clean = String(value ?? '').trim().replace(/^v/i, '')
  const m = /^(\d+)\.(\d+)\.(\d+)/.exec(clean)
  return m ? m.slice(1, 4).map(Number) : null
}

function compare(a, b) {
  for (let i = 0; i < 3; i += 1) {
    if (a[i] !== b[i]) return a[i] - b[i]
  }
  return 0
}

function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex')
}

async function getJson(url) {
  const r = await fetch(url, {
    headers: { 'User-Agent': 'vibe-tracker-updater', Accept: 'application/vnd.github+json' },
  })
  if (!r.ok) return null
  return r.json()
}

async function getBytes(url) {
  try {
    const r = await fetch(url, { headers: { 'User-Agent': 'vibe-tracker-updater' } })
    return r.ok ? Buffer.from(await r.arrayBuffer()) : null
  } catch {
    return null
  }
}

async function getText(url) {
  const b = await getBytes(url)
  return b ? b.toString('utf8') : null
}

async function latestSource() {
  const release = await getJson(`${API}/repos/${repo}/releases/latest`)
  if (release?.assets) {
    const asset = release.assets.find((a) => a.name === RELEASE_ASSET)
    const sum = release.assets.find((a) => a.name === RELEASE_SHA)
    if (asset) {
      return {
        version: release.tag_name,
        kind: 'release',
        url: asset.browser_download_url,
        shaUrl: sum ? sum.browser_download_url : null,
      }
    }
  }

  const tags = await getJson(`${API}/repos/${repo}/tags?per_page=100`)
  if (!Array.isArray(tags) || tags.length === 0) return null

  const ranked = tags
    .map((t) => ({ name: t.name, v: parseVersion(t.name) }))
    .filter((t) => t.v)
    .sort((a, b) => compare(b.v, a.v))

  const best = ranked[0]
  if (!best) return null

  return {
    version: best.name,
    kind: 'tag',
    url: `${RAW}/${repo}/${best.name}/${TAG_ARTIFACT}`,
    shaUrl: `${RAW}/${repo}/${best.name}/${TAG_SHA}`,
  }
}

function publishedSum(text) {
  if (!text) return null
  const m = /[a-f0-9]{64}/i.exec(text)
  return m ? m[0].toLowerCase() : null
}

const localHtml = existsSync(file) ? readFileSync(file, 'utf8') : null
const localVersion = localHtml ? versionOf(localHtml) : null
const localV = parseVersion(localVersion)

if (localHtml === null) {
  console.log(`no ${file} in this folder: a full download will be proposed when the source is reachable`)
}

const source = await latestSource()
if (!source) fail(`the source cannot be reached: ${repo}`, 2)

const remoteV = parseVersion(source.version)
if (!remoteV) fail(`the newest tag is not a version: ${source.version}`, 1)

console.log(`local:  ${localVersion ?? 'absent'}`)
console.log(`remote: ${source.version} (${source.kind})`)

if (localV && compare(localV, remoteV) >= 0) {
  if (source.shaUrl) {
    const remoteSum = publishedSum(await getText(source.shaUrl))
    const localSum = sha256(readFileSync(file))
    if (remoteSum && remoteSum !== localSum) {
      console.log('')
      console.log('warning: the version matches but the published file differs; the build was replaced without a version bump')
      console.log(`  local  sha256 ${localSum}`)
      console.log(`  remote sha256 ${remoteSum}`)
    }
  }
  console.log('')
  console.log('Tracker: UP TO DATE')
  process.exit(0)
}

if (checkOnly) {
  console.log('')
  console.log(`Tracker: UPDATE AVAILABLE (${localVersion ?? 'absent'} -> ${source.version})`)
  process.exit(0)
}

const body = await getBytes(source.url)
if (!body) fail(`the artifact cannot be downloaded: ${source.url}`, 2)

if (!/^\s*<!doctype html/i.test(body.subarray(0, 64).toString('utf8'))) {
  fail('the downloaded file is not an HTML document', 1)
}
if (body.length < MIN_BYTES) {
  fail(`the downloaded file is too small (${body.length} bytes)`, 1)
}

const downloadedHtml = body.toString('utf8')
const downloadedVersion = versionOf(downloadedHtml)
if (!downloadedVersion) fail('the downloaded file has no tracker version', 1)
if (parseVersion(downloadedVersion)?.join('.') !== remoteV.join('.')) {
  fail(`the published tag says ${source.version} but the file says ${downloadedVersion}`, 1)
}

const remoteSum = source.shaUrl ? publishedSum(await getText(source.shaUrl)) : null
const downloadedSum = sha256(body)
if (remoteSum) {
  if (remoteSum !== downloadedSum) fail('the checksum does not match the published one', 1)
  console.log(`sha256: verified ${downloadedSum}`)
} else {
  console.log(`sha256: ${downloadedSum} (not published, sanity checks only)`)
}

const tmp = `${file}.tmp`
writeFileSync(tmp, body)
try {
  renameSync(tmp, file)
} catch (error) {
  if (existsSync(tmp)) unlinkSync(tmp)
  fail(`the file cannot be replaced: ${error.message}`, 1)
}

console.log('')
console.log(`Tracker: UPDATED ${localVersion ?? 'absent'} -> ${downloadedVersion} (${body.length} bytes)`)
process.exit(0)
