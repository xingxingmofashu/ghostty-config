import { $ } from "bun"

export function useColor() {
  async function list(query?: string) {
    const content = await $`ghostty +list-colors`.text()
    const colors = content
      .split("\n")
      .filter(Boolean)
      .map((color) => {
        return color
          .split("=")
          .map((c) => c.trim())
          .filter(Boolean) as [string, string]
      })

    if (query) {
      return colors.filter((c) => c[0].includes(query))
    }
    return colors
  }

  return {
    list,
  }
}
