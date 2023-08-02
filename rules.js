class Rules {
  constructor(args) {
    this.args = args;
  }

  pcMove() {
    const pcMove = this.args[Math.floor(Math.random() * this.args.length)];
    return pcMove;
  }

  victory(userInput, pcMove) {
    let middle = Math.floor(this.args.length / 2);
    let winning = [];
    let i = 0;
    let count = 0;
    while (i <= middle) {
      if (this.args.indexOf(userInput) + i >= this.args.length) {
        winning.push(this.args[count]);
        count++;
      } else {
        winning.push(this.args[this.args.indexOf(userInput) + i]);
      }
      i++;
    }

    winning.shift();
    // TODO: string values will be changed to constants
    if (userInput == pcMove) {
      return "d";
    } else if (winning.includes(pcMove)) {
      return "v";
    } else {
      return "l";
    }
  }

  victoryLog(output) {
    switch (output) {
      case "v":
        console.log("You win!");
        break;
      case "d":
        console.log("Its a draw!");
        break;
      default:
        console.log("You lose!");
        break;
    }
  }

  victoryLogShort(output) {
    switch (output) {
      case "v":
        return "Win";
      case "d":
        return "Draw";
      default:
        return "Lose";
    }
  }

  victoryLogTable(args) {
    let result = [];
    for (let i = 0; i < args.length; i++) {
      for (let j = 0; j < args.length; j++) {
        result.push(this.victoryLogShort(this.victory(args[i], args[j])));
      }
      result.push("");
    }
    return result;
  }
}

module.exports = Rules;
