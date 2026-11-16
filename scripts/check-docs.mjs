#!/usr/bin/env node
/**
 * Documentation gate.
 *
 * Usage:
 *   node scripts/check-docs.mjs            report only
 *   node scripts/check-docs.mjs --strict    exit non-zero on a must finding
 *   node scripts/check-docs.mjs --json      machine-readable report
 *
 * Checks E-01 to E-13 of docs/DOC-STANDARD.md §10. No dependency, no write.
 *
 * Scope: every `.md` under `docs/**` plus the root files registered in §7.1.
 * Any other root document is never opened.
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, dirname, resolve, relative, sep } from 'node:path'

const ROOT = process.cwd()
const ARGS = process.argv.slice(2)
const STRICT = ARGS.includes('--strict')
const JSON_OUT = ARGS.includes('--json')

const SKIP_DIRS = new Set([
  '.git', '.opencode', 'node_modules', 'dist', 'build', 'bin', 'vendor',
  '.venv', '__pycache__', 'coverage', 'data', '.idea', '.vscode',
])

const CONTROL_LINE = '<!-- # Proyecto iniciado con plantilla sanju v2 -->'

const findings = []
const push = (file, line, rule, severity, message) =>
  findings.push({ file, line, rule, severity, message })

function walk(dir, out = []) {
  let entries
  try {
    entries = readdirSync(dir, { withFileTypes: true })
  } catch {
    return out
  }
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue
      walk(join(dir, entry.name), out)
    } else if (entry.name.endsWith('.md')) {
      out.push(join(dir, entry.name))
    }
  }
  return out
}

const files = walk(ROOT).map((p) => relative(ROOT, p))
const rel = (p) => p.split(sep).join('/')

// Scope: every document under docs/ plus the root files registered in the
// standard (§7.1). A root document outside the registry is never read.
const ROOT_SCOPE = new Set(['PROJECT_STATE.md', 'AGENTS.md'])
const governed = files
  .map((p) => rel(p))
  .filter((f) => f.includes('/') || ROOT_SCOPE.has(f))
const GOVERNED = new Set(governed)

const content = new Map()
for (const file of governed) content.set(file, readFileSync(join(ROOT, file), 'utf8').split(/\r?\n/))

const slug = (text) =>
  text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-')

const slugCache = new Map()
function anchorsOf(file) {
  const key = rel(file)
  if (slugCache.has(key)) return slugCache.get(key)
  const set = new Set()
  let fenced = false
  for (const line of content.get(key) ?? []) {
    if (/^\s*(```|~~~)/.test(line)) fenced = !fenced
    if (fenced) continue
    const m = /^#{1,4}\s+(.*)$/.exec(line)
    if (m) set.add(slug(m[1]))
  }
  slugCache.set(key, set)
  return set
}

const stripFences = (lines) => {
  const out = []
  let fenced = false
  for (const line of lines) {
    if (/^\s*(```|~~~)/.test(line)) {
      fenced = !fenced
      continue
    }
    if (!fenced) out.push(line)
    else out.push(null)
  }
  return out
}

const base = (p) => p.split('/').pop()

const H1_RULES = [
  [/^PROJECT_STATE\.md$/, /^# PROJECT_STATE\.md$/],
  [/^WORKFLOW\.md$/, /^# WORKFLOW\.md — way of working$/],
  [/^DECISIONS\.md$/, /^# DECISIONS\.md$/],
  [/^ARCHITECTURE\.md$/, /^# ARCHITECTURE\.md$/],
  [/^api-contract\.md$/, /^# .+ API contract — v\d+\.\d+$/],
  [/^SECURITY-BACKLOG\.md$/, /^# SECURITY-BACKLOG\.md$/],
  [/^DOCUMENTATION-BACKLOG\.md$/, /^# DOCUMENTATION-BACKLOG\.md$/],
  [/^DOC-STANDARD\.md$/, /^# Documentation standard — v\d+\.\d+$/],
  [/^GLOSSARY\.md$/, /^# GLOSSARY\.md$/],
  [/^RELEASES\.md$/, /^# RELEASES\.md$/],
  [/^AGENTS\.md$/, /^# AGENTS\.md — project instructions$/],
  [/^MODULE\.md$/, /^# Module \d{2} — .+$/],
  [/^REQUIREMENTS\.md$/, /^# Module \d{2} — REQUIREMENTS$/],
  [/^TECHNICAL\.md$/, /^# Module \d{2} — TECHNICAL$/],
  [/^CHANGELOG\.md$/, /^# Module \d{2} — CHANGELOG$/],
  [/^BACKLOG\.md$/, /^# Module \d{2} — BACKLOG \(corrections and future work\)$/],
]

const isHistory = (f) => base(f) === 'CHANGELOG.md' || f.includes('/plans/')
const isAnnex = (f) => f.includes('/ASSETS/')
const isIndex = (f) => base(f) === 'AGENTS.md' && !f.includes('/')
const isModuleFile = (f) => /^docs\/modules\/\d{2}-[^/]+\//.test(f)

for (const file of governed) {
  const f = rel(file)
  const lines = content.get(f)
  const visible = stripFences(lines)

  // E-03 — H1 on the first content line, matching the registry.
  const firstContent = lines.findIndex((l) => l.trim() !== '' && !/^\s*<!--.*-->\s*$/.test(l))
  const h1 = firstContent >= 0 ? lines[firstContent] : ''
  if (!h1.startsWith('# ')) {
    push(f, firstContent + 1, 'G-09', 'must', 'the first content line must be the H1')
  } else {
    for (const [nameRe, h1Re] of H1_RULES) {
      if (nameRe.test(base(f)) && !h1Re.test(h1)) {
        push(f, firstContent + 1, 'G-09', 'must', `H1 does not match the registry: "${h1}"`)
      }
    }
  }

  // E-11 — the recorded control comment opens PROJECT_STATE.md.
  if (base(f) === 'PROJECT_STATE.md' && lines[0].trim() !== CONTROL_LINE) {
    push(f, 1, 'G-21', 'must', 'line 1 must be the recorded control comment')
  }

  // E-02 — front block.
  const bare = (line) => line.replace(/^\s*>\s?/, '')
  if (!isHistory(f) && !isAnnex(f)) {
    for (const key of ['**Purpose:**', '**Read when:**', '**Canonical for:**', '**Do not duplicate:**']) {
      if (!lines.some((l) => bare(l).startsWith(key))) {
        push(f, 1, 'AG-02', 'must', `front block misses ${key}`)
      }
    }
    if (!lines.some((l) => bare(l).startsWith('**Last update:**'))) {
      push(f, 1, 'AG-02', 'must', 'front block misses **Last update:**')
    }
  }

  // E-10 — the date format.
  lines.forEach((line, i) => {
    const m = /^\*\*Last update:\*\*\s*(.+)$/.exec(bare(line))
    if (m && !/^\d{4}-\d{2}-\d{2}$/.test(m[1].trim())) {
      push(f, i + 1, 'G-16', 'must', '**Last update:** must be YYYY-MM-DD')
    }
  })

  // E-04 and E-12 — ascending slots, no fourth level, one separator.
  let lastSlot = 0
  let separators = 0
  visible.forEach((line, i) => {
    if (line === null) return
    const slot = /^## (\d+)\./.exec(line)
    if (slot) {
      const n = Number(slot[1])
      if (n <= lastSlot) push(f, i + 1, 'G-13', 'must', `slot ${n} does not ascend`)
      lastSlot = n
    }
    if (/^####\s/.test(line)) push(f, i + 1, 'G-13', 'must', 'fourth-level headings are forbidden')
    if (line.trim() === '---') separators += 1
  })
  if (separators > 1) push(f, 1, 'G-14', 'must', `${separators} separators; at most one is allowed`)
  if (isIndex(f) && separators > 0) push(f, 1, 'G-14', 'must', 'AGENTS.md carries no separator')

  // E-05 — no placeholder marker.
  visible.forEach((line, i) => {
    if (line === null) return
    const text = line.replace(/`[^`]*`/g, ' ')
    if (/\b(TODO|TBD|FIXME)\b/.test(text)) push(f, i + 1, 'AG-08', 'must', 'placeholder marker')
  })

  // E-06 — table shape.
  let table = null
  visible.forEach((line, i) => {
    if (line === null) return
    const isRow = /^\s*\|.*\|\s*$/.test(line)
    if (!isRow) {
      table = null
      return
    }
    const cells = line.trim().slice(1, -1).split(/(?<!\\)\|/)
    if (!table) {
      table = { columns: cells.length, start: i + 1 }
      return
    }
    if (cells.length !== table.columns) {
      push(f, i + 1, 'T-01', 'must', `row has ${cells.length} cells, header has ${table.columns}`)
    }
    if (cells.some((c) => c.trim() === '')) push(f, i + 1, 'T-02', 'must', 'empty cell; write — instead')
  })

  // E-09 and E-01 — link form and resolution.
  visible.forEach((line, i) => {
    if (line === null) return
    const linkRe = /\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g
    let m
    while ((m = linkRe.exec(line)) !== null) {
      const target = m[1]
      if (/^(https?:|mailto:|tel:)/.test(target)) continue
      if (/^file:|^[A-Za-z]:[\\/]|^\//.test(target)) {
        push(f, i + 1, 'G-18', 'must', `absolute link: ${target}`)
        continue
      }
      const [pathPart, anchor] = target.split('#')
      const targetFile = pathPart === ''
        ? f
        : rel(relative(ROOT, resolve(dirname(join(ROOT, f)), pathPart)))
      const exists = pathPart === '' || existsSync(join(ROOT, targetFile))
      if (!exists) {
        push(f, i + 1, 'G-18', 'must', `link target does not exist: ${target}`)
        continue
      }
      // E-13 — a governed document never links to a document outside the scope.
      if (pathPart !== '' && targetFile.endsWith('.md') && !GOVERNED.has(targetFile)) {
        push(f, i + 1, 'G-18', 'must', `link target is outside the documentation scope: ${target}`)
        continue
      }
      if (anchor && targetFile.endsWith('.md')) {
        if (!anchorsOf(targetFile).has(anchor.toLowerCase())) {
          push(f, i + 1, 'G-18', 'must', `anchor does not resolve: ${target}`)
        }
      }
    }
  })
}

// E-07 — module folders carry their files.
const moduleRoot = join(ROOT, 'docs', 'modules')
if (existsSync(moduleRoot)) {
  for (const entry of readdirSync(moduleRoot, { withFileTypes: true })) {
    if (!entry.isDirectory() || !/^\d{2}-/.test(entry.name)) continue
    const required = ['MODULE.md', 'TECHNICAL.md', 'CHANGELOG.md', 'BACKLOG.md']
    if (!entry.name.startsWith('00-')) required.push('REQUIREMENTS.md')
    for (const name of required) {
      if (!existsSync(join(moduleRoot, entry.name, name))) {
        push(rel(join('docs', 'modules', entry.name)), 1, 'F-01', 'must', `missing ${name}`)
      }
    }
  }
}

// E-08 — reachability from PROJECT_STATE.md and AGENTS.md (advisory).
const reachable = new Set()
const indexFiles = ['PROJECT_STATE.md', 'AGENTS.md']
for (const index of indexFiles) {
  if (!content.has(index)) continue
  for (const line of content.get(index)) {
    const linkRe = /\[[^\]]*\]\(([^)#\s]+)/g
    let m
    while ((m = linkRe.exec(line)) !== null) {
      if (/^(https?:|mailto:)/.test(m[1])) continue
      const target = rel(relative(ROOT, resolve(dirname(join(ROOT, index)), m[1])))
      if (m[1].endsWith('/')) reachable.add(target + '/')
      else if (target !== index) reachable.add(target)
    }
  }
}
for (const f of governed) {
  if (!f.startsWith('docs/')) continue
  const covered = reachable.has(f) || [...reachable].some((t) => t.endsWith('/') && f.startsWith(t))
  if (!covered) push(f, 1, 'AG-03', 'should', 'not reachable from an index file')
}

// Report.
const blocking = findings.filter((x) => x.severity === 'must')
const advisory = findings.filter((x) => x.severity !== 'must')
const sortFn = (a, b) => a.file.localeCompare(b.file) || a.line - b.line

if (JSON_OUT) {
  console.log(JSON.stringify({
    files: governed.length,
    strict: STRICT,
    ok: blocking.length === 0,
    blocking: blocking.sort(sortFn),
    advisory: advisory.sort(sortFn),
  }, null, 2))
} else {
  for (const item of [...blocking, ...advisory].sort(sortFn)) {
    console.log(`${item.file}:${item.line} [${item.severity}/${item.rule}] ${item.message}`)
  }
  console.log('')
  console.log(`Files: ${governed.length} · blocking: ${blocking.length} · advisory: ${advisory.length} · mode: ${STRICT ? 'strict' : 'report'}`)
  if (blocking.length === 0) console.log('Docs: PASS')
}

process.exit(STRICT && blocking.length > 0 ? 1 : 0)
