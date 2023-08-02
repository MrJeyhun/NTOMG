const prompt = require("prompt-sync")();
const hmac = require("./hmacGenerator.js");
const rules = require("./rules.js");
const help = require("./help.js");

class App {
  menu(args) {
    let count = 0;
    let menuTable = {};

    args.forEach((element) => {
      console.log(`${++count} - ${element}`);
      menuTable[count] = element;
    });
    console.log(`0 - exit`);
    console.log(`? - help`);
    menuTable[0] = "exit";
    menuTable["?"] = "help";

    let answer = this.ask().toString();
    if (!(answer in menuTable)) {
      return 1;
    }
    return { answer, menuTable };
  }

  launch() {
    const args = process.argv.slice(2);

    if (!args.length) {
      console.log("The options are missing. Try again with parameters");
      console.log(
        "For example: 'node index.js ROCK PAPER SCISSORS' (remember that number of arguments should be odd and >1)"
      );
      return;
    }

    if (args.length == 1) {
      console.log(
        "The options are not enough of. Try again with more parameters"
      );
      console.log(
        "For example: 'node index.js ROCK PAPER SCISSORS' (remember that number of arguments should be odd and >1)"
      );
      return;
    }

    if (!(args.length % 2)) {
      console.log("Number of args is incorrect");
      console.log(
        "For example: 'node index.js ROCK PAPER SCISSORS' (remember that number of arguments should be odd and >1)"
      );
      return;
    }

    const duplicateElements = args.filter(
      (item, index) => args.indexOf(item) !== index
    );
    if (duplicateElements.length) {
      console.log("You should not include duplicate elements!");
      console.log(
        "For example: 'node index.js ROCK PAPER SCISSORS' (remember that number of arguments should be odd and >1)"
      );
      return;
    }

    let hmacKey = new hmac();
    let rule = new rules(args);

    const pcMove = rule.pcMove(args);
    const pcHmac = hmacKey.generateHmac(pcMove);
    console.log(`HMAC: ${pcHmac}`);

    let popMenuObj = this.popMenu(args);
    if (popMenuObj.answer == "0") {
      return;
    } else if (popMenuObj.answer == "?") {
      const hlp = new help(args);
      hlp.printHelp();
      popMenuObj = this.popMenu(args);
    }

    console.log(`Your move: ${popMenuObj.menuTable[popMenuObj.answer]}`);
    console.log(`Computer move: ${pcMove}`);

    rule.victoryLog(
      rule.victory(popMenuObj.menuTable[popMenuObj.answer], pcMove)
    );
    console.log(`HMAC key: ${hmacKey.key}`);
  }

  ask() {
    let answer = prompt("Choose your move: ");
    return answer;
  }

  popMenu(args) {
    let popMenuObj = this.menu(args);
    while (!popMenuObj.menuTable?.hasOwnProperty(popMenuObj.answer)) {
      console.log("Wrong move, choose the one from the table!");
      popMenuObj = this.menu(args);
    }

    return popMenuObj;
  }
}

const app = new App();
app.launch();
