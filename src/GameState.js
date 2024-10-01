export class GameState {
    constructor(scene) {
        this.scene = scene;
        this.cardNames = ["card-0", "card-1", "card-2", "card-3", "card-4"];
        this.cards = [];
        this.cardOpened = undefined;
        this.canMove = false;
        this.lives = 10;
        this.TOTAL_PAIRS = 5;
        this.TOTAL_CARDS = this.TOTAL_PAIRS * 2;
    }

    resetState() {
        this.cardOpened = undefined;
        this.cards = [];
        this.canMove = false;
        this.lives = 10;
    }

    removeLife() {
        this.lives -= 1;
    }

    checkGameStatus() {
        if (this.lives === 0) {
            return 'gameOver';
        } else if (this.cards.length === 0) {
            return 'win';
        }
        return 'ongoing';
    }
}