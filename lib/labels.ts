/**
 * R11: option labels inside one tool group must be present, at least six
 * characters and unique. Called at module scope of each tool, so a clash
 * fails `next build` and prints both positions.
 */
export function labelProblems(labels: string[]): string[] {
  const problems: string[] = []
  const seen = new Map<string, number>()
  labels.forEach((raw, i) => {
    const label = typeof raw === 'string' ? raw.trim() : ''
    if (label === '') {
      problems.push(`option #${i + 1} has an empty label`)
      return
    }
    if (label.length < 6) problems.push(`option #${i + 1} "${label}" is shorter than six characters`)
    const key = label.toLowerCase()
    const first = seen.get(key)
    if (first !== undefined) problems.push(`options #${first + 1} and #${i + 1} both read "${label}"`)
    else seen.set(key, i)
  })
  return problems
}

export function assertOptionLabels(group: string, labels: string[]): void {
  const problems = labelProblems(labels)
  if (problems.length > 0) {
    throw new Error(`Tool option labels in "${group}" fail R11:\n  ${problems.join('\n  ')}`)
  }
}
