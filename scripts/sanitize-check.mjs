#!/usr/bin/env node
/**
 * Provenance check.
 *
 * Looks for anything that would reveal that the project was not written from
 * scratch: starting-point vocabulary, engineering placeholders, absolute local
 * paths, and the terms that the owner asked to purge.
 *
 * Usage:
 *   node scripts/sanitize-check.mjs
 *   node scripts/sanitize-check.mjs --terms "name one, name two"
 *
 * Read-only. Exits 1 when it finds something.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'

const ROOT = process.cwd()
const ARGS = process.argv.slice(2)
const termsIndex = ARGS.indexOf('--terms')
const ownerTerms = termsIndex >= 0 && ARGS[termsIndex + 1]
  ? ARGS[termsIndex + 1].split(',').map((t) => t.trim()).filter(Boolean)
  : []

const CONTROL_LINE = 'Proyecto iniciado con plantilla sanju v2 — https://github.com/sanju-es'

const SKIP_DIRS = new Set([
  '.git', 'node_modules', 'dist', 'build', 'bin', 'vendor', '.venv',
  '__pycache__', 'coverage', 'data', 'assets', '.idea', '.vscode',
])

// Bootstrap assets are removed at the end of the initialization, so they are
// not part of the delivered project and are not scanned.
const SKIP_FILES = new Set([
  '.opencode/agents/bootstrap.md',
  '.opencode/commands/inicializar-proyecto.md',
  '.opencode/commands/initialize-project.md',
  'scripts/sanitize-check.mjs',
  // Compiled viewer: a third-party build, not project content.
  'tracker.html',
])
const SKIP_PREFIXES = [
  '.opencode/bootstrap/',
  '.opencode/skills/bootstrap-wizard/',
]

const EXTENSIONS = new Set([
  '.md', '.json', '.jsonc', '.yml', '.yaml', '.js', '.mjs', '.cjs', '.ts',
  '.tsx', '.jsx', '.vue', '.svelte', '.go', '.py', '.rb', '.java', '.kt',
  '.sql', '.html', '.css', '.scss', '.sh', '.ps1', '.txt', '.toml', '.ini',
  '.example', '.env',
])

const PATTERNS = [
  [/\bplantilla\b/i, 'starting-point vocabulary'],
  [/\bsanju\b/i, 'starting-point vocabulary'],
  [/\btemplate\b/i, 'starting-point vocabulary'],
  [/\bscaffold(ed|ing)?\b/i, 'starting-point vocabulary'],
  [/\bboilerplate\b/i, 'starting-point vocabulary'],
  [/\bcopied from\b/i, 'copied content'],
  [/\bported from\b/i, 'copied content'],
  [/\bmigrated from\b/i, 'copied content'],
  [/\b(previous|original|former) (project|attempt|development|version|author)\b/i, 'foreign origin'],
  [/\bproyecto (base|anterior|original|previo)\b/i, 'foreign origin'],
  [/\blegacy project\b/i, 'foreign origin'],
  [/\b(TODO|TBD|FIXME)\b(?=\s|:|$|`|,|\.)/, 'unresolved placeholder'],
  [/lorem ipsum/i, 'dummy text'],
  [/\b[A-Za-z]:\\/, 'absolute local path'],
  [/\b[A-Za-z]:\/(?!\/)/, 'absolute local path'],
  [/\/Users\/[A-Za-z]/, 'absolute local path'],
  [/\/home\/[A-Za-z]/, 'absolute local path'],
]

for (const term of ownerTerms) {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  PATTERNS.push([new RegExp(escaped, 'i'), `owner term "${term}"`])
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    const path = relative(ROOT, full).split(sep).join('/')
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue
      if (SKIP_PREFIXES.some((p) => `${path}/`.startsWith(p))) continue
      walk(full, out)
      continue
    }
    if (SKIP_FILES.has(path)) continue
    const dot = entry.name.lastIndexOf('.')
    const ext = dot >= 0 ? entry.name.slice(dot).toLowerCase() : ''
    if (!EXTENSIONS.has(ext)) continue
    if (statSync(full).size > 1_000_000) continue
    out.push(path)
  }
  return out
}

const findings = []
for (const file of walk(ROOT)) {
  const lines = readFileSync(join(ROOT, file), 'utf8').split(/\r?\n/)
  lines.forEach((line, i) => {
    if (line.includes(CONTROL_LINE)) return
    // Inline code spans and fenced content are examples, not project content.
    const text = line.replace(/`[^`]*`/g, ' ')
    for (const [re, label] of PATTERNS) {
      const m = re.exec(text)
      if (m) findings.push({ file, line: i + 1, label, match: m[0].slice(0, 80) })
    }
  })
}

const base = ROOT.split(sep).pop()
if (/plantilla|sanju|template/i.test(base)) {
  console.log(`warning: the working folder name "${base}" carries the starting-point name and is part of the delivered project`)
}

for (const f of findings) console.log(`${f.file}:${f.line} [${f.label}] ${f.match}`)
console.log('')
console.log(`Provenance: ${findings.length === 0 ? 'CLEAN' : `FINDINGS (${findings.length})`}`)

process.exit(findings.length === 0 ? 0 : 1)
