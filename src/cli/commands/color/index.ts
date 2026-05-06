import { log } from "@clack/prompts"
import { cmd } from "../../utils/cmd"

export const ColorCommand = cmd({
  command: "color",
  describe: "Manage ghostty colors",
  builder: (yargs) => yargs,
  handler: async () => {
    log.info("Color command is not implemented yet")
  },
})
