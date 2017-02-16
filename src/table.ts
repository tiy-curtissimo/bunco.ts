import { Player } from './player';

export class Table {
  private arrangement: Player[];

  constructor(private players: Player[]) {}

  arrangePlayers() {
    this.arrangement = [
      Math.random(),
      Math.random(),
      Math.random(),
      Math.random()
    ]
      .map((value, index) => [value, index])
      .sort((a, b) => (a[0] < b[0]) ? -1 : (a[0] > b[0])? 1 : 0)
      .map(value => value[1])
      .map(index => this.players[index]);
  }

  player(index: number) {
    return this.arrangement[index];
  }
}