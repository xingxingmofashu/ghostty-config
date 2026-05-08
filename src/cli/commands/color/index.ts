import { cmd } from "../../utils/cmd"
import { ColorListCommand } from "./list"

export const ColorCommand = cmd({
  command: "color",
  describe: "List ghostty colors",
  builder: (yargs) => yargs.command(ColorListCommand).demandCommand(),
  handler: async () => {},
})
