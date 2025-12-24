import { run as runArrays } from './arrays.test.mjs'
import { run as runStrings } from './strings.test.mjs'
import { run as runLinked } from './linkedList.test.mjs'
import { run as runStackQueue } from './stackQueue.test.mjs'
import { run as runBinary } from './binarySearch.test.mjs'
import { run as runDP } from './dynamicProgramming.test.mjs'
import { run as runTree } from './tree.test.mjs'

async function main() {
  let passed = 0, failed = 0
  const merge = (r) => { passed += r.passed; failed += r.failed }
  merge(await runArrays())
  merge(await runStrings())
  merge(await runLinked())
  merge(await runStackQueue())
  merge(await runBinary())
  merge(await runDP())
  merge(await runTree())
  console.log(`algos total: ${passed} passed, ${failed} failed`)
  if (failed) process.exitCode = 1
}

main()

