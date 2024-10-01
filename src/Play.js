import Phaser from 'phaser';
import { createGameText, setupVolumeEvents, setupTitleEvents } from './PlayUtils';
import { UIManager } from './UIManager';
import { CardGrid } from './CardGrid';
import { CardMatchLogic } from './CardMatchLogic';
import { GameState } from './GameState';
import { DebugManager } from './DebugManager';

export class Play extends Phaser.Scene {
    // Card constants
    CARD_WIDTH = 98;
    CARD_HEIGHT = 128;

    // Grid configuration
    gridConfiguration = {
        x: 100,
        y: 0,  // We'll calculate this in the init method
        cardScale: 0.5,
        paddingX: 10,
        paddingY: 10,
        columns: 2,
        rows: 5
    }

    constructor() {
        super({
            key: 'Play'
        });

        this.cardGrid = null;
        this.cardMatchLogic = null;
        this.gameState = null;

        this.debugManager = null;
    }

    init() {
        this.gameState = new GameState(this);
        this.uiManager = new UIManager(this);
        this.cardGrid = new CardGrid(this, this.gridConfiguration);
        this.cameras.main.fadeIn(500);
        this.volumeButton();
        this.cardMatchLogic = new CardMatchLogic(this);

        // Calculate the vertical center position for the grid
        const scaledCardHeight = this.CARD_HEIGHT * this.gridConfiguration.cardScale;
        const gridHeight = (scaledCardHeight * 2) + this.gridConfiguration.paddingY;
        this.gridConfiguration.y = (this.sys.game.config.height - gridHeight) / 2;

        this.debugManager = new DebugManager(this);
    }

    create() {
        // Adjust the background image position
        this.add.image(0, 0, "background").setOrigin(0);

        const titleText = this.add.text(this.sys.game.scale.width / 2, this.sys.game.scale.height / 2,
            "Card Matching Game\nClick to Play",
            { align: "center", strokeThickness: 4, fontSize: 40, fontStyle: "bold", color: "#8c7ae6" }
        )
            .setOrigin(.5)
            .setDepth(3)
            .setInteractive();

        this.add.tween({
            targets: titleText,
            duration: 800,
            ease: (value) => (value > .8),
            alpha: 0,
            repeat: -1,
            yoyo: true,
        });

        setupTitleEvents(this, titleText);

        // Create debug overlay
        this.debugManager.createDebugOverlay();
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

    createGridCards() {
        return this.cardGrid.createGridCards();
    }

    createHearts() {
        this.uiManager.createHearts(this.gameState.lives);
    }

    volumeButton() {
        this.uiManager.createVolumeButton();
    }

    startGame() {
        this.winnerText = this.uiManager.createGameText("YOU WIN", "#8c7ae6");
        this.gameOverText = this.uiManager.createGameText("GAME OVER\nClick to restart", "#ff0000");
    
        this.hearts = this.createHearts();
        this.gameState.cards = this.createGridCards();
    
        this.time.addEvent({
            delay: 200 * this.gameState.cards.length,
            callback: () => {
                this.gameState.canMove = true;
            }
        });
    
        this.setupGameEvents();
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