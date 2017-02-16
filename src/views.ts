import { Player } from './player';
import { Scorecard } from './scorecard';
import { StdInput, onCharFactory } from './stdinput';

export class WelcomeView {
  run(callback: (string) => void): void {
    process.stdout.write('What is your name, human? ');
    new StdInput().readline(callback);
  }
}

export class RoundView {
  constructor(private round: number, private scorecard: Scorecard) {
    console.log("");
    console.log("ROUND", this.round);
    console.log("-------");
  }

  run(player: Player, callback: () => void): void {
    let spaceEvent = onCharFactory(' ');
    player.roll(spaceEvent, (roll: number[]) => {
      if (this.scorecard.registerRoll(player, this.round, roll) && !this.scorecard.roundEnded(this.round)) {
        this.run(player, callback);
      } else {
        callback();
      }
    });
  }
}