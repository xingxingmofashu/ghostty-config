import { cmd } from "../../utils/cmd"
import { useColor } from "../../../color"
import { intro, log, outro } from "@clack/prompts"
import chalk from "chalk"

export const ColorListCommand = cmd({
  command: "list",
  aliases: ["ls"],
  describe: "List all colors",
  builder: (yargs) =>
    yargs.option("query", {
      type: "string",
      alias: "q",
      description: "Filter colors by name",
    }),
  handler: async (argv) => {
    try {
      const { list } = useColor()
      const colors = await list(argv.query)
      intro(`Ghostty Colors`)
      for (const [name, value] of colors) {
        log.info(`${name}: ${value} ${chalk.hex(value)("██")}`)
      }
      outro(`${colors.length} colors found`)
    } catch (error) {
      log.error(`${error instanceof Error ? error.message : "An unknown error occurred"}`)
    }
  },
})
