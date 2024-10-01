import { createCard } from './createCard';
import Phaser from 'phaser';

export class CardGrid {
    constructor(scene, gridConfiguration) {
        this.scene = scene;
        this.cards = [];
        this.wordPairs = [
            { english: "hello", ojibwe: "ahnii" },
            { english: "thank you", ojibwe: "miigwech" },
            { english: "water", ojibwe: "nibi" },
            { english: "food", ojibwe: "miijim" },
            { english: "friend", ojibwe: "niijii" }
        ];
        this.gridConfiguration = gridConfiguration;
        this.CARD_WIDTH = 98;
        this.CARD_HEIGHT = 128;
        this.TOTAL_PAIRS = this.gridConfiguration.columns * this.gridConfiguration.rows / 2;
        this.TOTAL_CARDS = this.TOTAL_PAIRS * 2;
    }

    calculateGridPosition() {
        const scaledCardWidth = this.CARD_WIDTH * this.gridConfiguration.cardScale;
        const scaledCardHeight = this.CARD_HEIGHT * this.gridConfiguration.cardScale;
        const gridWidth = (scaledCardWidth * this.gridConfiguration.columns) + (this.gridConfiguration.paddingX * (this.gridConfiguration.columns - 1));
        const gridHeight = (scaledCardHeight * this.gridConfiguration.rows) + (this.gridConfiguration.paddingY * (this.gridConfiguration.rows - 1));
        
        this.gridConfiguration.x = (this.scene.sys.game.config.width - gridWidth) / 2;
        this.gridConfiguration.y = (this.scene.sys.game.config.height - gridHeight) / 2;
    }

    createGridCards() {
        this.calculateGridPosition();

        const selectedWordPairs = Phaser.Utils.Array.Shuffle([...this.wordPairs]).slice(0, this.TOTAL_PAIRS);
        const gridWords = Phaser.Utils.Array.Shuffle([...selectedWordPairs, ...selectedWordPairs]);

        const scaledCardWidth = this.CARD_WIDTH * this.gridConfiguration.cardScale;
        const scaledCardHeight = this.CARD_HEIGHT * this.gridConfiguration.cardScale;

        this.cards = gridWords.map((pair, index) => {
            const col = index % this.gridConfiguration.columns;
            const row = Math.floor(index / this.gridConfiguration.columns);
            const x = this.gridConfiguration.x + (scaledCardWidth + this.gridConfiguration.paddingX) * col + scaledCardWidth / 2;
            const y = this.gridConfiguration.y + (scaledCardHeight + this.gridConfiguration.paddingY) * row + scaledCardHeight / 2;

            const isEnglish = index % 2 === 0;
            const cardText = isEnglish ? pair.english : pair.ojibwe;
            const cardName = `${pair.english}-${pair.ojibwe}`;

            const card = createCard({
                scene: this.scene,
                x: x,
                y: y,
                cardText: cardText,
                cardName: cardName
            });

            // Add this console.log to debug card creation
            console.log(`Created card: ${cardName} at (${x}, ${y})`);

            return card;
        });

        return this.cards;
    }

    getCards() {
        return this.cards;
    }

    removeCard(card) {
        this.cards = this.cards.filter(c => c !== card);
    }
}