import { Die } from './die';

export abstract class Player {
  private die: Die = new Die();

  abstract roll(eventFactory: (callback: () => any) => void, callback: (roll: number[]) => any): void;
  abstract get index(): number;

  protected rollDie(): number {
    return this.die.roll();
  }
}

export class ComputerPlayer extends Player {
  constructor(private num: number) {
    super();
  }

  get index(): number {
    return this.num - 1;
  }

  roll(eventFactory: (callback: () => any) => void, callback: (roll: number[]) => any): void {
    callback([
      this.rollDie(),
      this.rollDie(),
      this.rollDie()
    ]);
  }

  toString() {
    return `Automaton ${this.num}`;
  }
}

export class HumanPlayer extends Player {
  constructor(private name: string) {
    super();
  }

  get index(): number {
    return 3;
  }

  roll(eventFactory: (callback: () => any) => void, callback: (roll: number[]) => any): void {
    let stop = false;

    function showRolls() {
      if (!stop) {
        process.stdout.write(this.rollDie().toString());
        process.stdout.write(' ');
        process.stdout.write(this.rollDie().toString());
        process.stdout.write(' ');
        process.stdout.write(this.rollDie().toString());
        process.stdout.write('\r');
        setTimeout(showRolls.bind(this), 10);
      }
    }
    setTimeout(showRolls.bind(this), 10);

    eventFactory(() => {
      stop = true;
      callback([
        this.rollDie(),
        this.rollDie(),
        this.rollDie()
      ]);
    });
  }

  toString() {
    return this.name;
  }
}
