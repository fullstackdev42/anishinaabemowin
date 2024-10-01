import { createCard } from './createCard';
import Phaser from 'phaser';

export class CardGrid {
    constructor(scene, gridConfiguration) {
        this.scene = scene;
        this.config = gridConfiguration;
        this.CARD_WIDTH = 98;
        this.CARD_HEIGHT = 128;
        this.TOTAL_PAIRS = 5;
        this.cards = [];
        this.wordPairs = ["card-0", "card-1", "card-2", "card-3", "card-4", "card-5"];
    }

    calculateGridPosition() {
        const scaledCardWidth = this.CARD_WIDTH * this.config.cardScale;
        const scaledCardHeight = this.CARD_HEIGHT * this.config.cardScale;
        const gridWidth = (scaledCardWidth * this.config.columns) + (this.config.paddingX * (this.config.columns - 1));
        const gridHeight = (scaledCardHeight * this.config.rows) + (this.config.paddingY * (this.config.rows - 1));
        
        // Center the grid horizontally and vertically
        this.config.x = (this.scene.sys.game.config.width - gridWidth) / 2;
        this.config.y = (this.scene.sys.game.config.height - gridHeight) / 2;
    }

    createGridCards() {
        this.calculateGridPosition();
        const cardNames = this.scene.gameState.cardNames.concat(this.scene.gameState.cardNames);
        Phaser.Utils.Array.Shuffle(cardNames);
    
        const scaledCardWidth = this.CARD_WIDTH * this.config.cardScale;
        const scaledCardHeight = this.CARD_HEIGHT * this.config.cardScale;
        const totalWidth = (this.config.columns * scaledCardWidth) + ((this.config.columns - 1) * this.config.paddingX);
        const startX = (this.scene.sys.game.config.width - totalWidth) / 2;
    
        for (let row = 0; row < this.config.rows; row++) {
            for (let col = 0; col < this.config.columns; col++) {
                const cardIndex = row * this.config.columns + col;
                if (cardIndex < cardNames.length) {
                    const x = startX + col * (scaledCardWidth + this.config.paddingX) + scaledCardWidth / 2;
                    const y = this.config.y + row * (scaledCardHeight + this.config.paddingY) + scaledCardHeight / 2;
    
                    const card = createCard({
                        scene: this.scene,
                        x,
                        y,
                        cardText: cardNames[cardIndex],
                        cardName: cardNames[cardIndex]
                    });
    
                    card.gameObject.setScale(this.config.cardScale);
                    this.cards.push(card);
                }
            }
        }
    
        return this.cards;
    }

    getCards() {
        return this.cards;
    }

    removeCard(card) {
        this.cards = this.cards.filter(c => c !== card);
    }
}