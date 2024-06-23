const { Command } = require("commander");
const fs = require("fs");
const textractScan = require("./textractUtils");

const program = new Command();

program
  .version("0.0.1")
  .description("Textract Lab");

program
  .command("scan <filePath>")
  .alias("s")
  .description("scans a file")
  .action(async (filePath) => {
    try {
      const data = fs.readFileSync(filePath);
      const results = await textractScan(data);
      console.log("Extracted Tables:", JSON.stringify(results, null, 2));
    } catch (error) {
      console.error("Error reading file or scanning:", error);
    }
  });

program.parse(process.argv);
