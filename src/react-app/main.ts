import './style.css'
import { apps, type WebApp } from './apps'
import { fetchRepos, languageColor, formatDate, type GitHubRepo } from './github'

const searchInput = document.getElementById('Search') as HTMLInputElement

const USERNAME = 'matthewinman0'

function buildCard(repo: GitHubRepo): HTMLElement {
  const name = document.createElement('a')
  name.className = 'card-name'
  name.href = repo.html_url
  name.target = '_blank'
  name.rel = 'noopener noreferrer'
  name.textContent = repo.name.replace(/-/g, '-\u200B') // allow wrapping on hyphens

  const card = document.createElement('article')
  card.className = 'card'

  const nameRow = document.createElement('div')
  nameRow.className = 'card-name-row'

  const arrow = document.createElement('span')
  arrow.className = 'card-arrow'
  arrow.textContent = '↗'

  nameRow.append(name, arrow)

  const desc = document.createElement('p')
  desc.className = 'card-desc'
  desc.textContent = repo.description ?? 'No description.'

  const meta = document.createElement('div')
  meta.className = 'card-meta'

  if (repo.language) {
    const lang = document.createElement('span')
    lang.className = 'card-lang'
    lang.innerHTML = `<span class="lang-dot" style="background:${languageColor(repo.language)}"></span>${repo.language}`
    meta.appendChild(lang)
  }

  if (repo.stargazers_count > 0) {
    const stars = document.createElement('span')
    stars.className = 'card-stars'
    stars.textContent = `★ ${repo.stargazers_count}`
    meta.appendChild(stars)
  }

  const updated = document.createElement('span')
  updated.className = 'card-updated'
  updated.textContent = formatDate(repo.pushed_at)
  meta.appendChild(updated)

  card.append(nameRow, desc, meta)

  if (repo.topics.length > 0) {
    const tags = document.createElement('div')
    tags.className = 'card-tags'
    repo.topics.slice(0, 5).forEach(t => {
      const tag = document.createElement('span')
      tag.className = 'card-tag'
      tag.textContent = t
      tags.appendChild(tag)
    })
    card.appendChild(tags)
  }

  return card
}

function buildAppCard(app: WebApp): HTMLElement {
  const name = document.createElement('a')
  name.className = 'card-name'
  name.textContent = app.name

  const card = document.createElement('article')
  card.className = 'card'
  card.href = app.url

  const desc = document.createElement('p')
  desc.className = 'card-desc'
  desc.textContent = app.description

  card.append(name, desc)

  if (app.tags?.length) {
    const tags = document.createElement('div')
    tags.className = 'card-tags'

    app.tags.forEach(t => {
      const tag = document.createElement('span')
      tag.className = 'card-tag'
      tag.textContent = t
      tags.appendChild(tag)
    })

    card.appendChild(tags)
  }

  return card
}

function renderError(msg: string): void {
  const grid = document.getElementById('projects-grid')!
  grid.innerHTML = `<p class="error-msg">${msg}</p>`
}

async function init(): Promise<void> {
  const grid = document.getElementById('projects-grid')!
  const countEl = document.getElementById('project-count')!
  const appGrid = document.getElementById('app-grid')!
  const appCount = document.getElementById('app-count')!

  // stagger skeleton fade-in
  grid.innerHTML = Array.from({ length: 6 }, () =>
    `<div class="card card--skeleton"></div>`
  ).join('')

  let repos: GitHubRepo[]
  try {
    repos = await fetchRepos(USERNAME)
  } catch (e) {
    renderError('Could not reach GitHub API.')
    return
  }

  if (repos.length === 0) {
    renderError('No public repositories found.')
    return
  }

  countEl.textContent = `${repos.length} repos`

  grid.innerHTML = ''
  repos.forEach((repo, i) => {
    const card = buildCard(repo)
    card.style.animationDelay = `${i * 40}ms`
    card.classList.add('card--enter')
    grid.appendChild(card)
  })

  appGrid.innerHTML = ''
  apps.forEach(app => {
    appGrid.appendChild(buildAppCard(app))
  })

  appCount.textContent = `${apps.length} apps`


  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase()

    // filter repos
    const filteredRepos = repos.filter(r =>
      r.name.toLowerCase().includes(query) ||
      (r.description ?? '').toLowerCase().includes(query)
    )

    // filter apps
    const filteredApps = apps.filter(a =>
      a.name.toLowerCase().includes(query) ||
      a.description.toLowerCase().includes(query) ||
      a.tags?.some(t => t.toLowerCase().includes(query))
    )

    // render repos
    grid.innerHTML = ''
    filteredRepos.forEach(repo => {
      grid.appendChild(buildCard(repo))
    })

    countEl.textContent = `${filteredRepos.length} repos`

    // render apps
    appGrid.innerHTML = ''
    filteredApps.forEach(app => {
      appGrid.appendChild(buildAppCard(app))
    })

    appCount.textContent = `${filteredApps.length} apps`
  })

}

init()