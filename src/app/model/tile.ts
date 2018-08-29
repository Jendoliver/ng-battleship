export class Tile {
  used: boolean;
  value: number;
  status: string;
  
  constructor(used: boolean, value: number, status: string) {
      this.used = used;
      this.value = value;
      this.status = status;
  }
}