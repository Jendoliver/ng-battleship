export class Tile {
  constructor(public used: boolean, public value: number | string, public status: string) {
      this.used = used;
      this.value = value;
      this.status = status;
  }
}