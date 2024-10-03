import Phaser from 'phaser';
import { GameState } from './GameState';
import { GridManager } from './GridManager';
import { UIManager } from './UIManager';

export class Play extends Phaser.Scene {
    constructor() {
        super({
            key: 'Play'
        });
    }

    init() {
        this.gameState = new GameState(this);
        this.gridManager = new GridManager(this);
        this.uiManager = new UIManager(this);
        this.cameras.main.fadeIn(500);
        this.selectedEnglishCard = null;
        this.selectedOjibweCard = null;
    }

    create() {
        this.uiManager.createBackground();
        this.uiManager.createTitleText();
        this.load.once('complete', () => {
            this.startGame();
        });
        this.load.start();
    }

    createBackground() {
        this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height / 2, "background");
    }

    createTitleText() {
        this.add.text(
            this.sys.game.config.width / 2,
            50,
            'Word Match',
            {
                fontFamily: 'Arial',
                fontSize: '32px',
                color: '#ffffff',
                align: 'center',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5);
    }

    startGame() {
        console.log('Starting game with word pairs:', this.gameState.wordPairs);
        const cardData = this.createCardData();
        console.log('Creating grid with card data:', cardData);
        this.gridManager.createCardGrid(cardData);
        this.gameState.canMove = true;
    }

    createCardData() {
        const englishCards = this.gameState.wordPairs.map(pair => ({
            text: pair.english,
            name: `${pair.english}-${pair.ojibwe}`,
            isEnglish: true
        }));
        const ojibweCards = this.gameState.wordPairs.map(pair => ({
            text: pair.ojibwe,
            name: `${pair.english}-${pair.ojibwe}`,
            isEnglish: false
        }));

        Phaser.Utils.Array.Shuffle(englishCards);
        Phaser.Utils.Array.Shuffle(ojibweCards);

        return [...englishCards, ...ojibweCards];
    }

    handleCardClick(card) {
        if (!this.gameState.canMove) return;

        if (card.data.isEnglish) {
            if (this.selectedEnglishCard) {
                this.selectedEnglishCard.setSelected(false);
            }
            this.selectedEnglishCard = card;
        } else {
            if (this.selectedOjibweCard) {
                this.selectedOjibweCard.setSelected(false);
            }
            this.selectedOjibweCard = card;
        }

        card.setSelected(true);

        if (this.selectedEnglishCard && this.selectedOjibweCard) {
            this.checkForMatch();
        }
    }

    handleCorrectMatch() {
        const fadeOutDuration = 500;
        this.selectedEnglishCard.fadeOut(fadeOutDuration, () => {
            this.selectedEnglishCard.destroy();
            this.gameState.removeCard(this.selectedEnglishCard);
            this.selectedEnglishCard = null;
        });
        this.selectedOjibweCard.fadeOut(fadeOutDuration, () => {
            this.selectedOjibweCard.destroy();
            this.gameState.removeCard(this.selectedOjibweCard);
            this.selectedOjibweCard = null;
            this.checkGameStatus();
        });
    }

    handleIncorrectMatch() {
        this.time.delayedCall(500, () => {
            this.selectedEnglishCard.setSelected(false);
            this.selectedOjibweCard.setSelected(false);
            this.selectedEnglishCard = null;
            this.selectedOjibweCard = null;
        });
    }

    restartGame() {
        this.gameState.resetState();
        this.cameras.main.fadeOut(200 * this.gameState.cards.length);
        this.gameState.cards.reverse().map((card, index) => {
            this.add.tween({
                targets: card.gameObject,
                duration: 500,
                delay: index * 100,
                y: 1000,
                onComplete: () => {
                    card.gameObject.destroy();
                }
            })
        });

        this.time.addEvent({
            delay: 200 * this.gameState.cards.length,
            callback: () => {
                this.scene.restart();
                this.sound.play("card-slide", { volume: 1.2 });
            }
        })
    }

    checkGameStatus() {
        const status = this.gameState.checkGameStatus();
        if (status === 'gameOver') {
            this.uiManager.showGameOverText();
            this.gameState.canMove = false;
        } else if (status === 'win') {
            this.uiManager.showWinnerText();
            this.gameState.canMove = false;
        }
    }

    checkForMatch() {
        if (this.selectedEnglishCard.data.name === this.selectedOjibweCard.data.name) {
            this.handleCorrectMatch();
        } else {
            this.handleIncorrectMatch();
        }
        this.gameState.canMove = false;
    }
}