export class Die {
  roll(): number {
    return Math.ceil(Math.random() * 6);
  }
}
