import { createCard } from './createCard';
import Phaser from 'phaser';

export class CardGrid {
    constructor(scene) {
        this.scene = scene;
        this.cards = [];
        this.cardNames = ["card-0", "card-1", "card-2", "card-3", "card-4", "card-5"];
        this.gridConfiguration = {
            x: 100,
            y: 0,
            cardScale: 0.5,
            paddingX: 10,
            paddingY: 10,
            columns: 5,
            rows: 2
        };
        this.CARD_WIDTH = 98;
        this.CARD_HEIGHT = 128;
        this.TOTAL_PAIRS = 5;
        this.TOTAL_CARDS = this.TOTAL_PAIRS * 2;
    }

    calculateGridPosition() {
        const scaledCardHeight = this.CARD_HEIGHT * this.gridConfiguration.cardScale;
        const gridHeight = (scaledCardHeight * 2) + this.gridConfiguration.paddingY;
        this.gridConfiguration.y = (this.scene.sys.game.config.height - gridHeight) / 2;
    }

    createGridCards() {
        this.calculateGridPosition(); // Calculate grid position here

        const selectedCardNames = Phaser.Utils.Array.Shuffle([...this.cardNames]).slice(0, this.TOTAL_PAIRS);
        const gridCardNames = Phaser.Utils.Array.Shuffle([...selectedCardNames, ...selectedCardNames]);

        const scaledCardWidth = this.CARD_WIDTH * this.gridConfiguration.cardScale;
        const scaledCardHeight = this.CARD_HEIGHT * this.gridConfiguration.cardScale;

        this.cards = gridCardNames.map((name, index) => {
            const x = this.gridConfiguration.x + (scaledCardWidth + this.gridConfiguration.paddingX) * (index % this.gridConfiguration.columns);
            const y = this.gridConfiguration.y + (scaledCardHeight + this.gridConfiguration.paddingY) * Math.floor(index / this.gridConfiguration.columns);

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