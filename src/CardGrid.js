import { createCard } from './createCard';
import { CARD_WIDTH, CARD_HEIGHT } from './constants';

export class CardGrid {
    constructor(scene, config) {
        this.scene = scene;
        this.config = config;
        this.cards = [];
    }

    createGridCards(playArea) {
        const { columns, rows, paddingX, paddingY } = this.config;
        const totalCards = columns * rows;

        // Calculate the maximum card size that fits in the play area
        const maxCardWidth = (playArea.width - (columns - 1) * paddingX) / columns;
        const maxCardHeight = (playArea.height - (rows - 1) * paddingY) / rows;

        // Determine the scale factor to maintain aspect ratio
        const scaleX = maxCardWidth / CARD_WIDTH;
        const scaleY = maxCardHeight / CARD_HEIGHT;
        const scale = Math.min(scaleX, scaleY);

        // Calculate the actual card dimensions
        const cardWidth = CARD_WIDTH * scale;
        const cardHeight = CARD_HEIGHT * scale;

        for (let i = 0; i < totalCards; i++) {
            const position = this.calculateGridPosition(i, playArea, cardWidth, cardHeight);
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

    calculateGridPosition(index, playArea, cardWidth, cardHeight) {
        const { columns, paddingX, paddingY } = this.config;

        const gridWidth = columns * cardWidth + (columns - 1) * paddingX;
        const gridHeight = Math.ceil(this.config.rows) * cardHeight + (Math.ceil(this.config.rows) - 1) * paddingY;

        const offsetX = (playArea.width - gridWidth) / 2;
        const offsetY = (playArea.height - gridHeight) / 2;

        const x = playArea.x - playArea.width / 2 + offsetX + (index % columns) * (cardWidth + paddingX) + cardWidth / 2;
        const y = playArea.y - playArea.height / 2 + offsetY + Math.floor(index / columns) * (cardHeight + paddingY) + cardHeight / 2;

        console.log(`Card ${index} position: x=${x}, y=${y}, offsetX=${offsetX}, offsetY=${offsetY}, playArea.x=${playArea.x}, playArea.y=${playArea.y}, playArea.width=${playArea.width}, playArea.height=${playArea.height}`);

        return { x, y };
    }

    getCards() {
        return this.cards;
    }

    removeCard(card) {
        this.cards = this.cards.filter(c => c !== card);
    }
}
