export class Player {
    id: number;
    score: number = 0;

    constructor(id: number, score = 0) {
        this.id = id;
        this.score = score;
    }
}