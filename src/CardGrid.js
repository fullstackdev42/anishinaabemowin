import { createCard } from './createCard';
import { CARD_WIDTH, CARD_HEIGHT } from './constants';
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

        console.log(playAreaCoords);

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
        const { columns, paddingX, paddingY } = this.config;
        const cardWidth = CARD_WIDTH;
        const cardHeight = CARD_HEIGHT;
    
        const gridWidth = columns * cardWidth + (columns - 1) * paddingX;
        const gridHeight = Math.ceil(index / columns) * cardHeight + (Math.ceil(index / columns) - 1) * paddingY;
    
        const offsetX = (playAreaCoords.width - gridWidth) / 2;
        const offsetY = (playAreaCoords.height - gridHeight) / 2;
    
        const x = playAreaCoords.x + offsetX + (index % columns) * (cardWidth + paddingX);
        const y = playAreaCoords.y + offsetY + Math.floor(index / columns) * (cardHeight + paddingY);
    
        return { x, y };
    }

    getCards() {
        return this.cards;
    }

    removeCard(card) {
        this.cards = this.cards.filter(c => c !== card);
    }
}