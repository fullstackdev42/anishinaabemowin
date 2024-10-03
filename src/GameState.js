export class GameState {
    constructor(scene) {
        this.scene = scene;
        this.wordPairs = this.generateWordPairs();
        this.cards = [];
        this.canMove = true;
    }

    generateWordPairs() {
        // Generate or fetch word pairs
        return [
            { english: 'Hello', ojibwe: 'Aaniin' },
            { english: 'Thank you', ojibwe: 'Miigwech' },
            { english: "dog", ojibwe: "animosh" },
            { english: "water", ojibwe: "biish" },
            { english: "sun", ojibwe: "giizis" },
        ];
    }

    resetState() {
        this.cards = [];
        this.canMove = true;
    }

    checkGameStatus() {
        if (this.cards.length === 0) {
            return 'win';
        }
        return 'playing';
    }

    addCard(card) {
        this.cards.push(card);
    }

    removeCard(card) {
        this.cards = this.cards.filter(c => c !== card);
    }
}
