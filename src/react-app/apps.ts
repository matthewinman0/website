export type WebApp = {
  name: string
  description: string
  url: string
  tags?: string[]
}

export const apps: WebApp[] = [
  {
    name: "Open-Street-O-Map",
    description: "A style of Open street map that looks like an orienteering map",
    url: "https://osom.matthewinman.uk/",
    tags: ["maps", "web"]
  }
]