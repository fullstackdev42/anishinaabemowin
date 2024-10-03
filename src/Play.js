import Phaser from 'phaser';
import { CardMatchLogic } from './CardMatchLogic';
import { GameState } from './GameState';

export class Play extends Phaser.Scene {
    constructor() {
        super({
            key: 'Play'
        });
    }

    init() {
        this.gameState = new GameState(this);
        this.cardMatchLogic = new CardMatchLogic(this);
        this.cameras.main.fadeIn(500);
    }

    create() {
        this.createBackground();
        this.createTitleText();
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
        this.createCardGrid(cardData);
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

    createCardGrid(cardData) {
        const padding = 20;
        const titleHeight = 100;
        const availableWidth = this.sys.game.config.width - (padding * 2);
        const availableHeight = this.sys.game.config.height - (padding * 2) - titleHeight;
        
        const columns = 2;
        const englishCards = cardData.filter(card => card.isEnglish);
        const ojibweCards = cardData.filter(card => !card.isEnglish);
        const rows = Math.max(englishCards.length, ojibweCards.length);

        const cardWidth = (availableWidth - (columns - 1) * 10) / columns;
        const cardHeight = Math.min((availableHeight - (rows - 1) * 10) / rows, 100);

        const gridSizer = this.rexUI.add.gridSizer({
            x: this.sys.game.config.width / 2,
            y: (this.sys.game.config.height + titleHeight) / 2,
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
            const card = this.createCard(data, cardWidth, cardHeight);
            gridSizer.add(card.gameObject, { column, row: index, align: 'center' });
            card.gameObject.on('pointerdown', () => this.handleCardClick(card));
        });
    }

    createCard(data, cardWidth, cardHeight) {
        const cardContainer = this.add.container(0, 0);
        const cardBackground = this.add.rectangle(0, 0, cardWidth, cardHeight, 0xffffff);
        const cardText = this.add.text(0, 0, data.text, {
            fontFamily: 'Arial',
            fontSize: '16px',
            color: '#000000',
            align: 'center',
            wordWrap: { width: cardWidth - 10 }
        }).setOrigin(0.5);

        cardContainer.add([cardBackground, cardText]);
        cardContainer.setSize(cardWidth, cardHeight);
        cardContainer.setInteractive();

        return {
            gameObject: cardContainer,
            data: data,
            revealed: false,
            hasFaceAt: (x, y) => cardContainer.getBounds().contains(x, y)
        };
    }

    handleCardClick(card) {
        if (this.gameState.canMove) {
            this.cardMatchLogic.handleCardSelect(card);
        }
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
            this.showGameOverText();
        } else if (status === 'win') {
            this.showWinnerText();
        }
    }

    showGameOverText() {
        this.showAnimatedText('Game Over');
        this.gameState.canMove = false;
    }

    showWinnerText() {
        this.sound.play("victory");
        this.showAnimatedText('You Win!');
        this.gameState.canMove = false;
    }

    showAnimatedText(text) {
        const animatedText = this.add.text(
            this.sys.game.config.width / 2,
            this.sys.game.config.height / 2,
            text,
            {
                fontFamily: 'Arial',
                fontSize: '64px',
                color: '#ffffff',
                align: 'center',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5).setAlpha(0);

        this.tweens.add({
            targets: animatedText,
            alpha: 1,
            duration: 1000,
            ease: 'Power2'
        });
    }
}