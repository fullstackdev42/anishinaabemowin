import { createCard } from './createCard';
import { CARD_WIDTH, CARD_HEIGHT, CARD_SCALE } from './constants';
import Phaser from 'phaser';

export class CardGrid {
    constructor(scene, gridConfiguration) {
        this.scene = scene;
        this.config = gridConfiguration;
        this.CARD_WIDTH = 98;
        this.CARD_HEIGHT = 128;
        this.cards = [];
    }

    calculateGridDimensions() {
        const cardWidth = CARD_WIDTH * CARD_SCALE;
        const cardHeight = CARD_HEIGHT * CARD_SCALE;
        const spacingX = 10;
        const spacingY = 10;
    
        const gridWidth = (this.config.columns * cardWidth) + ((this.config.columns - 1) * spacingX);
        const gridHeight = (this.config.rows * cardHeight) + ((this.config.rows - 1) * spacingY);
    
        return { gridWidth, gridHeight, cardWidth, cardHeight, spacingX, spacingY };
    }

    calculateGridPosition() {
        const { gridWidth, gridHeight } = this.calculateGridDimensions();
        this.config.x = (this.scene.sys.game.config.width - gridWidth) / 2;
        this.config.y = (this.scene.sys.game.config.height / 3) - (gridHeight / 2);
    }

    getShuffledCardNames() {
        const cardNames = this.scene.gameState.cardNames.concat(this.scene.gameState.cardNames);
        return Phaser.Utils.Array.Shuffle(cardNames);
    }

    calculateCardPosition(row, col, scaledCardWidth, scaledCardHeight) {
        const startX = this.config.x;
        const startY = this.config.y;
        const x = startX + col * (scaledCardWidth + this.config.paddingX) + scaledCardWidth / 2;
        const y = startY + row * (scaledCardHeight + this.config.paddingY) + scaledCardHeight / 2;
        return { x, y };
    }

    createCard(cardName, position) {
        const card = createCard({
            scene: this.scene,
            x: position.x,
            y: position.y,
            cardText: cardName,
            cardName: cardName
        });
        card.gameObject.setScale(this.config.cardScale);
        return card;
    }

    createGridCards() {
        this.calculateGridPosition();
        const cardNames = this.getShuffledCardNames();
        const { cardWidth, cardHeight } = this.calculateGridDimensions();
        const scaledCardWidth = cardWidth * this.config.cardScale;
        const scaledCardHeight = cardHeight * this.config.cardScale;

        for (let row = 0; row < this.config.rows; row++) {
            for (let col = 0; col < this.config.columns; col++) {
                const cardIndex = row * this.config.columns + col;
                if (cardIndex < cardNames.length) {
                    const position = this.calculateCardPosition(row, col, scaledCardWidth, scaledCardHeight);
                    const card = this.createCard(cardNames[cardIndex], position);
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