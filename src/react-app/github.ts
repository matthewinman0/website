export interface GitHubRepo {
  id: number
  name: string
  description: string | null
  html_url: string
  language: string | null
  stargazers_count: number
  topics: string[]
  pushed_at: string
  fork: boolean
  private: boolean
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f7df1e',
  Python: '#3572A5',
  Rust: '#dea584',
  Go: '#00ADD8',
  'C++': '#f34b7d',
  C: '#555555',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Java: '#b07219',
  Kotlin: '#A97BFF',
  Swift: '#F05138',
}

export function languageColor(lang: string | null): string {
  if (!lang) return '#555'
  return LANGUAGE_COLORS[lang] ?? '#888'
}

export async function fetchRepos(username: string): Promise<GitHubRepo[]> {
  const url = `https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`
  const res = await fetch(url, {
    headers: { Accept: 'application/vnd.github+json' },
  })
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`)
  const data: GitHubRepo[] = await res.json()
  return data.filter(r => !r.fork && !r.private)
}

export function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}