import { Player } from "src/app/model/player";
import { Tile } from "./tile";

export class Board {
    constructor(public player: Player, public tiles: Tile[][]) {
        this.player = player;
        this.tiles = tiles;
    }
}