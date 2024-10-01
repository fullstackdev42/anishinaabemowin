import Phaser from 'phaser';
import { createGameText, setupVolumeEvents, setupTitleEvents } from './PlayUtils';
import { UIManager } from './UIManager';
import { CardGrid } from './CardGrid';
import { CardMatchLogic } from './CardMatchLogic';
import { GameState } from './GameState';
import { DebugManager } from './DebugManager';
import { CARD_WIDTH, CARD_HEIGHT } from './constants';

export class Play extends Phaser.Scene {
    // Grid configuration
    gridConfiguration = {
        x: 0,
        y: 0,
        paddingX: 2,  // Reduced from 5
        paddingY: 1,  // Reduced from 2
        columns: 2,
        rows: 5,
        cardScale: 1
    }

    constructor() {
        super({
            key: 'Play'
        });
    }

    init() {
        this.gameState = new GameState(this);
        this.cardGrid = new CardGrid(this, this.gridConfiguration);
        console.log('cardGrid', this.cardGrid);
        this.cameras.main.fadeIn(500);
        this.cardMatchLogic = new CardMatchLogic(this);

        // Calculate the vertical center position for the grid
        const scaledCardHeight = CARD_HEIGHT * this.gridConfiguration.cardScale;
        const gridHeight = (scaledCardHeight * 2) + this.gridConfiguration.paddingY;
        this.gridConfiguration.y = (this.sys.game.config.height - gridHeight) / 2;

        this.debugManager = new DebugManager(this);
        this.debugManager.createDebugOverlay();
    }

    create() {
        // Center the background image
        const background = this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height / 2, "background");

        // Scale the background to cover the entire game area while maintaining aspect ratio
        const scaleX = this.sys.game.config.width / background.width;
        const scaleY = this.sys.game.config.height / background.height;
        const scale = Math.max(scaleX, scaleY);
        background.setScale(scale);

        // Initialize UIManager
        this.uiManager = new UIManager(this, true);

        // Create UI elements
        this.uiManager.createHeader();
        this.uiManager.createFooter();
        const playArea = this.uiManager.createPlayArea();

        // Add title text
        const titleText = this.add.text(
            this.sys.game.config.width / 2,
            50,
            'Word Match Game',
            {
                fontFamily: 'Arial',
                fontSize: '32px',
                color: '#ffffff',
                align: 'center',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5);

        // Call volumeButton() after UIManager is initialized
        this.volumeButton();

        // Initialize game components without creating cards
        this.gameState = new GameState(this);
        this.cardMatchLogic = new CardMatchLogic(this);

        // Initialize the CardGrid
        this.cardGrid = new CardGrid(this, {
            x: 50,  // Adjust these values as needed
            y: 100,
            paddingX: 10,
            paddingY: 10,
            cardScale: 1
        });

        // Start the game
        this.startGame();
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

    volumeButton() {
        this.uiManager.createVolumeButton();
    }

    startGame() {
        // Create the card data array
        const cardData = this.gameState.cardNames.flatMap(name => [
            { text: name, name: name },
            { text: name, name: name }
        ]);
        
        // Shuffle the card data
        Phaser.Utils.Array.Shuffle(cardData);

        // Create the grid of cards
        this.gameState.cards = this.cardGrid.createGrid(cardData);

        // Set up card interactions
        this.gameState.cards.forEach(card => {
            card.gameObject.on('pointerdown', () => this.handleCardClick(card));
        });

        // Enable input for all cards
        this.gameState.canMove = true;

        // Update debug info
        this.debugManager.updateDebugInfo(this.gameState, this.gridConfiguration);
    }

    setupGameEvents() {
        this.input.on(Phaser.Input.Events.POINTER_MOVE, (pointer) => {
            this.handlePointerMove(pointer);
        });
        this.input.on(Phaser.Input.Events.POINTER_DOWN, (pointer) => {
            this.handlePointerDown(pointer);
        });
    }

    handlePointerMove(pointer) {
        if (this.gameState.canMove) {
            const card = this.gameState.cards.find(card => card.hasFaceAt(pointer.x, pointer.y));
            if (card) {
                this.input.setDefaultCursor("pointer");
            } else {
                const go = this.input.hitTestPointer(pointer);
                if (go[0] && go[0].name !== "volume-icon") {
                    this.input.setDefaultCursor("pointer");
                } else {
                    this.input.setDefaultCursor("default");
                }
            }
        }
    }

    handlePointerDown(pointer) {
        if (this.gameState.canMove && this.gameState.cards.length) {
            const card = this.gameState.cards.find(card => card.hasFaceAt(pointer.x, pointer.y));
            if (card) {
                this.cardMatchLogic.handleCardSelect(card);
            }
        }
    }

    removeLife() {
        this.uiManager.removeLife();
        this.gameState.removeLife();
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
        this.showAnimatedText(this.gameOverText);
        this.gameState.canMove = false;
    }

    showWinnerText() {
        this.sound.play("victory");
        this.showAnimatedText(this.winnerText);
        this.gameState.canMove = false;
    }

    showAnimatedText(text) {
        this.uiManager.showAnimatedText(text);
    }

    update() {
        this.debugManager.updateDebugInfo(this.gameState, this.gridConfiguration);
    }
}
