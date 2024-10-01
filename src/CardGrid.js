import { createCard } from './createCard';
import Phaser from 'phaser';

export class CardGrid {
    constructor(scene, gridConfiguration) {
        this.scene = scene;
        this.cards = [];
        this.cardNames = ["card-0", "card-1", "card-2", "card-3", "card-4", "card-5"];
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

        const selectedCardNames = Phaser.Utils.Array.Shuffle([...this.cardNames]).slice(0, this.TOTAL_PAIRS);
        const gridCardNames = Phaser.Utils.Array.Shuffle([...selectedCardNames, ...selectedCardNames]);

        const scaledCardWidth = this.CARD_WIDTH * this.gridConfiguration.cardScale;
        const scaledCardHeight = this.CARD_HEIGHT * this.gridConfiguration.cardScale;

        this.cards = gridCardNames.map((name, index) => {
            const col = index % this.gridConfiguration.columns;
            const row = Math.floor(index / this.gridConfiguration.columns);
            const x = this.gridConfiguration.x + (scaledCardWidth + this.gridConfiguration.paddingX) * col;
            const y = this.gridConfiguration.y + (scaledCardHeight + this.gridConfiguration.paddingY) * row;

            const card = createCard({
                scene: this.scene,
                x: x,
                y: -1000,
                frontTexture: name,
                cardName: name
            });

            this.scene.add.tween({
                targets: card.gameObject,
                duration: 800,
                delay: index * 100,
                onStart: () => this.scene.sound.play("card-slide", { volume: 1.2 }),
                y: y
            });

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