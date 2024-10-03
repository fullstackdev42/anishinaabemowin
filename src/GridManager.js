import { Card } from './Card';

export class GridManager {
    constructor(scene) {
        this.scene = scene;
    }

    createCardGrid(cardData) {
        const padding = 20;
        const titleHeight = 100;
        const availableWidth = this.scene.sys.game.config.width - (padding * 2);
        const availableHeight = this.scene.sys.game.config.height - (padding * 2) - titleHeight;
        
        const columns = 2;
        const englishCards = cardData.filter(card => card.isEnglish);
        const ojibweCards = cardData.filter(card => !card.isEnglish);
        const rows = Math.max(englishCards.length, ojibweCards.length);

        const cardWidth = (availableWidth - (columns - 1) * 10) / columns;
        const cardHeight = Math.min((availableHeight - (rows - 1) * 10) / rows, 100);

        const gridSizer = this.scene.rexUI.add.gridSizer({
            x: this.scene.sys.game.config.width / 2,
            y: (this.scene.sys.game.config.height + titleHeight) / 2,
            width: availableWidth,
            height: rows * (cardHeight + 10) - 10,
            column: columns,
            row: rows,
            columnProportions: 1,
            rowProportions: 1,
            space: {
                left: padding, right: padding, top: padding, bottom: padding,
                column: 10,
                row: 10,
            }
        });

        this.addCardsToGrid(gridSizer, englishCards, 0, cardWidth, cardHeight);
        this.addCardsToGrid(gridSizer, ojibweCards, 1, cardWidth, cardHeight);

        gridSizer.layout();
    }

    addCardsToGrid(gridSizer, cards, column, cardWidth, cardHeight) {
        cards.forEach((data, index) => {
            const card = new Card(this.scene, data, cardWidth, cardHeight);
            gridSizer.add(card.container, { column, row: index, align: 'center' });
            card.container.on('pointerdown', () => this.scene.handleCardClick(card));
            this.scene.gameState.addCard(card);
        });
    }

    // Remove createCard method as it's now handled by the Card class
}
