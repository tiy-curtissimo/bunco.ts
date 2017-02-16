import { WelcomeView, RoundView } from './views';
import { Player, ComputerPlayer, HumanPlayer } from './player';
import { Table } from './table';
import { Scorecard } from './scorecard';

export class BuncoGame {
  private welcomeView: WelcomeView = new WelcomeView();
  private table: Table;
  private players: Player[] = [];
  private scorecard: Scorecard;

  constructor() {
    this.players.push(new ComputerPlayer(1));
    this.players.push(new ComputerPlayer(2));
    this.players.push(new ComputerPlayer(3));
    this.table = new Table(this.players);
    this.scorecard = new Scorecard(this.players);
  }

  run(): void {
    this.welcomeView.run(name => {
      this.players.push(new HumanPlayer(name));

      this.runRound(1, () => {
        this.runRound(2, () => {
          this.runRound(3, () => {
            this.runRound(4, () => {
              this.runRound(5, () => {
                this.runRound(6, () => {
                  console.log("");
                  console.log("Final scores:");
                  console.log("-------------")
                  console.log(this.scorecard.toString());
                  console.log("");
                  console.log("WINNER(S):", this.scorecard.winners);
                });
              });
            });
          });
        });
      });
    });
  }

  runRound(round: number, callback: () => void): void {
    this.table.arrangePlayers();
    let view = new RoundView(round, this.scorecard);
    this.runPlayersInRound(round, view, callback);
  }

  runPlayersInRound(round: number, view: RoundView, callback: () => void): void {
    console.log("");
    view.run(this.table.player(0), () => {
      console.log("");
      if (this.scorecard.roundEnded(round)) {
        callback();
        return;
      }
      view.run(this.table.player(1), () => {
        console.log("");
        if (this.scorecard.roundEnded(round)) {
          callback();
          return;
        }
        view.run(this.table.player(2), () => {
          console.log("");
          if (this.scorecard.roundEnded(round)) {
            callback();
            return;
          }
          view.run(this.table.player(3), () => {
            if (this.scorecard.roundEnded(round)) {
              callback();
            } else {
              this.runPlayersInRound(round, view, callback);
            }
          });
        });
      });
    });
  }
}