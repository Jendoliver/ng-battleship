import { Player } from "src/app/model/player";
import { Tile } from "./tile";

export class Board {
    player: Player;
    tiles: Tile[][];

    constructor(player: Player, tiles: Tile[][]) {
        this.player = player;
        this.tiles = tiles;
    }
}