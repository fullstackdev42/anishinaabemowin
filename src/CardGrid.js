import { createCard } from './createCard';
import { CARD_WIDTH, CARD_HEIGHT, CARD_SCALE } from './constants';
import Phaser from 'phaser';

export class CardGrid {
    constructor(scene, config) {
        this.scene = scene;
        this.config = config;
        this.cards = [];
    }

    createGridCards(playArea) {
        const { columns, rows } = this.config;
        const totalCards = columns * rows;
        const playAreaCoords = this.scene.uiManager.getPlayAreaCoordinates();

        for (let i = 0; i < totalCards; i++) {
            const position = this.calculateGridPosition(i, playAreaCoords);
            const card = createCard({
                scene: this.scene,
                x: position.x,
                y: position.y,
                cardText: `Card ${i}`,
                cardName: `card-${i}`
            });
            this.cards.push(card);
        }

        return this.cards;
    }

    calculateGridPosition(index, playAreaCoords) {
        const { columns, cardScale, paddingX, paddingY } = this.config;
        const x = playAreaCoords.x + (index % columns) * (CARD_WIDTH * cardScale + paddingX);
        const y = playAreaCoords.y + Math.floor(index / columns) * (CARD_HEIGHT * cardScale + paddingY);

        return { x, y };
    }

    getCards() {
        return this.cards;
    }

    removeCard(card) {
        this.cards = this.cards.filter(c => c !== card);
    }
}