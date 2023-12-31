const { table } = require("table");
const rules = require("./rules");

class Help {
  constructor(args) {
    this.args = args;
  }

  printHelp() {
    console.log("Here rules of the game: ");
    const rule = new rules(this.args);

    let counter = 0;
    let currentTable = [];
    let resultTable = [["↓ PC / User →", ...this.args]];
    let victoryTable = rule.victoryLogTable(this.args);

    for (let i = 0; i < victoryTable.length; i++) {
      if (victoryTable[i] !== "") {
        currentTable.push(victoryTable[i]);
      } else {
        resultTable.push([this.args[counter], ...currentTable]);
        currentTable = [];
        counter++;
      }
    }
    console.log(table(resultTable));
  }
}

module.exports = Help;
