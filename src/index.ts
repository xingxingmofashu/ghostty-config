import yargs from "yargs"
import { hideBin } from "yargs/helpers"
import pkg from "../package.json"
import { ConfigCommand } from "./cli/commands/config"
import { ThemeCommand } from "./cli/commands/theme"
import { FontCommand } from "./cli/commands/font"
import { ColorCommand } from "./cli/commands/color"

const cli = yargs(hideBin(process.argv))
  .parserConfiguration({ "populate--": true })
  .scriptName("gtc")
  .wrap(yargs().terminalWidth())
  .help("help", "show help")
  .alias("h", ["help"])
  .version("version", pkg.version)
  .alias("v", ["version"])
  .command(ConfigCommand)
  .command(ThemeCommand)
  .command(FontCommand)
  .command(ColorCommand)
  .strict()

try {
  await cli.parse()
} catch (error) {
  if (error instanceof Error) {
    console.error(error.message)
  }
  process.exitCode = 1
} finally {
  process.exit()
}
