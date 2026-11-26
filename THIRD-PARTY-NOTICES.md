# Third-party notices

`tracker.html` is a compiled single-file artifact. It bundles or loads the
components below, which remain under their own licenses. The ISC license in
[LICENSE](LICENSE) covers only the original code and documentation of this
repository.

| Component | Version | License | Upstream |
|---|---|---|---|
| Svelte | 5 | MIT | https://github.com/sveltejs/svelte |
| marked | not identifiable from the bundle | MIT | https://github.com/markedjs/marked |
| Lucide | 1.72.0 | ISC | https://github.com/lucide-icons/lucide |
| Tailwind CSS | 4.3.5 | MIT | https://github.com/tailwindlabs/tailwindcss |
| Inter, via Fontsource | 5.3.0 | SIL OFL 1.1 | https://github.com/rsms/inter |

Svelte, marked and Tailwind CSS are distributed under the MIT license; Lucide
under the ISC license; the Inter typeface under the SIL Open Font License 1.1.
The full text and the copyright line of each component are published in its
upstream repository.

## Note on the compiled artifact

`tracker.html` was produced by a bundler configured to drop legal comments, so
the copyright notices of the bundled libraries are not reproduced inside it.
The only notice that survived is the one Tailwind marks as permanent.

If you redistribute `tracker.html` and need every notice preserved verbatim,
rebuild it with legal comments retained (for example, esbuild
`legalComments: "inline"` or `legalComments: "eof"`), or ship this file
alongside it.
