import Phaser from 'phaser';
import { SCENE_KEYS } from './constants';

const WORD_PAIRS = [
    { english: "Hello", ojibwe: "Aaniin" },
    { english: "Thank you", ojibwe: "Miigwech" },
    { english: "Water", ojibwe: "Nibi" },
    { english: "Sun", ojibwe: "Giizis" },
    { english: "Friend", ojibwe: "Niijii" }
];

const GRID_CONFIG = {
    x: 150,
    y: 50,
    paddingX: 20,
    paddingY: 20,
    cardWidth: 200,
    cardHeight: 100
};

const CARD_STYLE = {
    backgroundColor: 0xffffff,
    borderColor: 0x000000,
    borderWidth: 2
};

const TEXT_STYLE = {
    font: '24px Arial',
    color: '#000000'
};

export class Play extends Phaser.Scene {
    constructor() {
        super({ key: SCENE_KEYS.PLAY });
        this.wordCards = [];
    }

    create() {
        this.createBackground();
        this.createWordCards();
    }

    createBackground() {
        this.add.image(0, 0, 'background').setOrigin(0, 0);
    }

    createWordCards() {
        const shuffledPairs = Phaser.Utils.Array.Shuffle([...WORD_PAIRS]);
        this.wordCards = shuffledPairs.flatMap((pair, index) => [
            this.createWordCard(pair.english, 0, index),
            this.createWordCard(pair.ojibwe, 1, index)
        ]);
    }

    createWordCard(word, column, row) {
        const { x, y } = this.calculateCardPosition(column, row);
        const card = this.createCardBackground(x, y);
        const text = this.createCardText(x, y, word);
        return { card, text, word };
    }

    calculateCardPosition(column, row) {
        return {
            x: GRID_CONFIG.x + (GRID_CONFIG.cardWidth + GRID_CONFIG.paddingX) * column,
            y: GRID_CONFIG.y + (GRID_CONFIG.cardHeight + GRID_CONFIG.paddingY) * row
        };
    }

    createCardBackground(x, y) {
        const card = this.add.rectangle(x, y, GRID_CONFIG.cardWidth, GRID_CONFIG.cardHeight, CARD_STYLE.backgroundColor);
        card.setStrokeStyle(CARD_STYLE.borderWidth, CARD_STYLE.borderColor);
        return card;
    }

    createCardText(x, y, word) {
        return this.add.text(x, y, word, TEXT_STYLE).setOrigin(0.5);
    }

    // Add any additional game logic methods here
}