import { Player } from './player';

export class Scorecard {
  scores: number[][];

  constructor(private players: Player[]) {
    this.scores = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];
  }

  registerRoll(player: Player, round: number, roll: number[]): boolean {
    let score = roll.reduce((acc, v) => v === round ? acc + 1 : acc, 0);
    let anotherRoll = false;

    if (score === 3) {
      score = 21;
      anotherRoll
    }
    if (score > 0) {
      anotherRoll = true;
      this.scores[round - 1][player.index] += score;
    } else if (roll[0] === roll[1] && roll[1] === roll[2]) {
      score = 5;
    }
    console.log(player.toString(), roll, score);
    return anotherRoll;
  }

  score(player: Player): number {
    let max = (v: number[]) => v.reduce((acc, v) => v > acc ? v : acc, 0);
    return this.scores.reduce((acc, v) => v[player.index] === max(v) ? acc + 1 : acc, 0);
  }

  roundEnded(roundNumber: number): boolean {
    return this.scores[roundNumber - 1].find(x => x >= 21) !== undefined;
  }

  get winners(): string {
    let highScore = 0;
    let winners = [];
    for (let player of this.players) {
      let playerScore = this.score(player);
      if (playerScore > highScore) {
        highScore = playerScore;
        winners = [player];
      } else if(playerScore === highScore) {
        winners.push(player);
      }
    }
    return winners.join(', ');
  }

  toString(): string {
    let scoreStatements = [];
    for (let player of this.players) {
      let statement = [player, 'has score', this.score(player)].join(' ');
      scoreStatements.push(statement);
    }
    return scoreStatements.join('\n');
  }
}