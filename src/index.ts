import * as Rx from 'rxjs';

function printRoll(index: number, lookup: number, r: number[], s: number): void {
  if (index < 3) {
    console.log(`Automaton ${lookup + 1}`, r, s);
  } else {
    console.log('Human      ', r, s);
  }
}

function dieRoll(): number {
  return Math.ceil(Math.random() * 6);
}

function roll(): number[] {
  return [ dieRoll(), dieRoll(), dieRoll() ]
};

function makeLookup(): number[] {
  return [
    Math.random(),
    Math.random(),
    Math.random(),
    Math.random()
  ]
  .map((value, index) => [value, index])
  .sort((a, b) => (a[0] < b[0]) ? -1 : (a[0] > b[0])? 1 : 0)
  .map(value => value[1]);
}

function round(roundIndex: number) {
  return Rx.Observable
    .create(subscriber => {
      console.log('');
      console.log(`ROUND ${roundIndex}`);
      console.log('-------')
      let scores = [0, 0, 0, 0];
      let order = makeLookup();

      let index = 0;
      let lookup = order[index];
      while (scores.find(x => x > 20) === undefined) {
        let r = roll();
        let s = 0;

        if (r.find(x => x === roundIndex) !== undefined) {
          s = r.reduce((acc, v) => v === roundIndex ? acc + 1 : acc, 0);
          if (r[0] === r[1] && r[1] === r[2]) {
            s = 21;
          }
          scores[lookup] += s;
          printRoll(index, lookup, r, s);
        } else {
          console.log('');
          if (r[0] === r[1] && r[1] === r[2]) {
            s = 5;
            scores[lookup] += s;
          }
          printRoll(index, lookup, r, s);
          index += 1;
          index = index % scores.length;
          lookup = order[index];
        }
      }
      subscriber.next({ round: roundIndex, scores: scores });
      subscriber.complete();
    });
}

Rx.Observable.concat(round(1), round(2))
  .concat(round(3))
  .concat(round(4))
  .concat(round(5))
  .concat(round(6))
  .reduce((acc, o: {round: number, scores: number[]}) => {
    let arr = o.scores;
    console.log(`Round ${o.round} scores:`, arr);
    let max = Math.max.apply(Math, arr);
    let index = arr.findIndex(v => v === max);
    acc[index] += 1;
    return acc;
  }, [0, 0, 0, 0])
  .map((arr: number[]) => {
    console.log('');
    console.log('-------------------------------');
    console.log('ROUND RESULTS:', arr);
    let winners = [];
    let max = Math.max.apply(Math, arr);
    for(let i = 0; i < arr.length; i += 1) {
      if (arr[i] === max) {
        winners.push(i);
      }
    }
    return winners;
  })
  .map(arr => arr.map(x => x < 3 ? `Automaton ${x}` : 'Human'))
  .subscribe(x => console.log('winner(s):', x.join(', ')));
