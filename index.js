const prompt = require("prompt-sync")();
const hmac = require("./hmacGenerator.js");
const rules = require("./rules.js");
const help = require("./help.js");

class App {
  menu(args) {
    let count = 0;
    let hashTable = {};

    args.forEach((element) => {
      console.log(`${++count} - ${element}`);
      hashTable[count] = element;
    });
    console.log(`0 - exit`);
    console.log(`? - help`);
    hashTable[0] = "exit";
    hashTable["?"] = "help";

    let answer = this.ask().toString();
    if (!(answer in hashTable)) {
      return 1;
    }
    return { answer, hashTable };
  }

  launch() {
    const args = process.argv;
    args.shift();
    args.shift();

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
    const hmacFinal = hmacKey.generateHmac(pcMove);
    console.log(`HMAC: ${hmacFinal}`);

    let popMenuObj = this.popMenu(args);
    if (popMenuObj.answer == "0") {
      return;
    } else if (popMenuObj.answer == "?") {
      const hlp = new help(args);
      hlp.printHelp();
      popMenuObj = this.popMenu(args);
    }

    console.log(`Your move: ${popMenuObj.hashTable[popMenuObj.answer]}`);
    console.log(`Computer move: ${pcMove}`);

    rule.victoryLog(
      rule.victory(popMenuObj.hashTable[popMenuObj.answer], pcMove)
    );
    console.log(`HMAC key: ${hmacKey.key}`);
  }

  start() {
    this.launch();
  }

  ask() {
    let answer = prompt("Choose your move: ");
    return answer;
  }

  popMenu(args) {
    let popMenuObj = this.menu(args);
    while (!popMenuObj.hashTable?.hasOwnProperty(popMenuObj.answer)) {
      console.log("Wrong move, choose the one from the table!");
      popMenuObj = this.menu(args);
    }

    return popMenuObj;
  }
}

const app = new App();
app.start();
