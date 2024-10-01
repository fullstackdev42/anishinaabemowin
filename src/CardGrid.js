import { CARD_WIDTH, CARD_HEIGHT } from './constants';
import { createCard } from './createCard';  // Add this import

export class CardGrid {
    constructor(scene, config) {
        this.scene = scene;
        this.config = config;
        this.cards = [];
    }

    createGrid(cardData) {
        const { x, y, paddingX, paddingY, cardScale } = this.config;
        const scaledCardWidth = CARD_WIDTH * cardScale;
        const scaledCardHeight = CARD_HEIGHT * cardScale;
        const columns = 2;
        const rows = 5;

        return cardData.map((data, index) => {
            const col = index % columns;
            const row = Math.floor(index / columns);
            const cardX = x + scaledCardWidth * col + paddingX * (col + 1);
            const cardY = y + scaledCardHeight * row + paddingY * (row + 1);

            const card = createCard({
                scene: this.scene,
                x: cardX,
                y: cardY,
                cardText: data.text,
                cardName: data.name
            });
            this.cards.push(card);
            return card;
        });
    }

    getCards() {
        return this.cards;
    }

    removeCard(card) {
        this.cards = this.cards.filter(c => c !== card);
    }
}