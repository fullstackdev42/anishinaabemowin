import Phaser from 'phaser';
import { CardMatchLogic } from './CardMatchLogic';
import { GameState } from './GameState';
import { CARD_WIDTH, CARD_HEIGHT } from './constants';

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
        // Center the background image
        const background = this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height / 2, "background");

        // Add title text
        const titleText = this.add.text(
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

        // Start the game
        this.startGame();
    }

    startGame() {
        // Create the card data array
        const cardData = this.gameState.wordPairs.flatMap(pair => [
            { text: pair.english, name: `${pair.english}-${pair.ojibwe}`, isEnglish: true },
            { text: pair.ojibwe, name: `${pair.english}-${pair.ojibwe}`, isEnglish: false }
        ]);
        
        // Shuffle the card data
        Phaser.Utils.Array.Shuffle(cardData);

        // Create the grid of cards using RexUI GridSizer
        this.createCardGrid(cardData);

        // Enable input for all cards
        this.gameState.canMove = true;
    }

    createCardGrid(cardData) {
        const gridSizer = this.rexUI.add.gridSizer({
            x: this.sys.game.config.width / 2,
            y: this.sys.game.config.height / 2,
            width: this.sys.game.config.width * 0.8,
            height: this.sys.game.config.height * 0.8,
            column: 2,
            row: 5,
            columnProportions: 1,
            rowProportions: 1,
            space: {
                left: 10, right: 10, top: 10, bottom: 10,
                column: 10,
                row: 10,
            }
        });

        this.gameState.cards = cardData.map((data, index) => {
            const card = this.createCard(data);
            const col = index % 2;
            const row = Math.floor(index / 2);
            gridSizer.add(card.gameObject, { column: col, row: row });
            
            card.gameObject.on('pointerdown', () => this.handleCardClick(card));
            return card;
        });

        gridSizer.layout();
    }

    createCard(data) {
        const cardWidth = CARD_WIDTH * 0.8;
        const cardHeight = CARD_HEIGHT * 0.8;

        const cardContainer = this.add.container(0, 0);
        const cardBackground = this.add.rectangle(0, 0, cardWidth, cardHeight, 0xffffff);
        const cardText = this.add.text(0, 0, data.text, {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#000000',
            align: 'center'
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