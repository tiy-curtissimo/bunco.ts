(process.stdin as any).setRawMode(true);
process.stdin.setEncoding('utf8');

let i = 0;

export function onCharFactory(char: string): (callback: () => any) => void {
  let stdInput = new StdInput();
  let onChar = stdInput.onChar.bind(stdInput, char);
  return onChar;
}

export class StdInput {
  line: string;
  boundRealineListener: () => void;
  readlineCallback: (input: string) => any;
  boundOnCharListener: () => void;
  onCharCallback: () => any;

  constructor() {
    this.boundRealineListener = this.readlineListener.bind(this);
  }

  readlineListener(): void {
    let c = process.stdin.read();
    if (c === '\n' || c === '\r') {
      process.stdout.write('\n');
      process.stdin.removeListener('readable', this.boundRealineListener);
      this.readlineCallback(this.line);
    }
    if (typeof c === 'string') {
      process.stdout.write(c);
      this.line += c;
    }
  }

  readline(callback: (input: string) => any): void {
    this.line = '';
    this.readlineCallback = callback;
    process.stdin.on('readable', this.boundRealineListener);
  }

  onCharListener(char: string): void {
    let c = process.stdin.read();
    if (c === char) {
      process.stdin.removeListener('readable', this.boundOnCharListener);
      this.onCharCallback();
    }
  }

  onChar(char: string, callback: () => any): void {
    this.onCharCallback = callback;
    this.boundOnCharListener = this.onCharListener.bind(this, char);
    process.stdin.on('readable', this.boundOnCharListener);
  }
}
