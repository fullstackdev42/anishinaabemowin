export class GameState {
    constructor(scene) {
        this.scene = scene;
        this.wordPairs = [
            { english: "apple", ojibwe: "mishiimin" },
            { english: "dog", ojibwe: "animosh" },
            { english: "water", ojibwe: "nibi" },
            { english: "sun", ojibwe: "giizis" },
            { english: "tree", ojibwe: "mitig" }
        ];
        this.cards = [];
        this.cardOpened = undefined;
        this.canMove = false;
        this.lives = 10;
        this.TOTAL_PAIRS = this.wordPairs.length;
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