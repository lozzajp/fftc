import { cp, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const here = path.dirname(fileURLToPath(import.meta.url))
const source = path.resolve(here, '..', '..', '..', 'data')
const destination = path.resolve(here, '..', 'public', 'data')

await mkdir(destination, { recursive: true })
await cp(source, destination, { recursive: true })

console.log(`Synced data: ${source} -> ${destination}`)
