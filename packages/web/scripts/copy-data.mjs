// Copies the canonical markdown data files from the repo-level data/ folder
// into public/data/ so the web app can fetch and parse them client-side at
// runtime. public/data/ is generated — do not edit directly, do not commit.
import { cp, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const here = path.dirname(fileURLToPath(import.meta.url))
const source = path.resolve(here, '..', '..', '..', 'data')
const destination = path.resolve(here, '..', 'public', 'data')

await mkdir(destination, { recursive: true })
await cp(source, destination, { recursive: true })

console.log(`Synced data: ${source} -> ${destination}`)
