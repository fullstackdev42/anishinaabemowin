import { createCard } from './createCard';
import Phaser from 'phaser';
import { createGameText, setupVolumeEvents, setupTitleEvents } from './PlayUtils';
import { UIManager } from './UIManager';

export class Play extends Phaser.Scene {
    // All cards names
    cardNames = ["card-0", "card-1", "card-2", "card-3", "card-4", "card-5"];
    // Cards Game Objects
    cards = [];

    // History of card opened
    cardOpened = undefined;

    // Can play the game
    canMove = false;

    // Game variables
    lives = 0;

    // Card constants
    CARD_WIDTH = 98;
    CARD_HEIGHT = 128;
    TOTAL_PAIRS = 5;
    TOTAL_CARDS = this.TOTAL_PAIRS * 2;

    // Grid configuration
    gridConfiguration = {
        x: 100,
        y: 0,  // We'll calculate this in the init method
        cardScale: 0.5,
        paddingX: 10,
        paddingY: 10,
        columns: 5,
        rows: 2
    }

    constructor() {
        super({
            key: 'Play'
        });

        this.debugGraphics = null;
        this.debugText = null;
    }

    init() {
        this.uiManager = new UIManager(this);
        this.cameras.main.fadeIn(500);
        this.lives = 10;
        this.volumeButton();

        // Calculate the vertical center position for the grid
        const scaledCardHeight = this.CARD_HEIGHT * this.gridConfiguration.cardScale;
        const gridHeight = (scaledCardHeight * 2) + this.gridConfiguration.paddingY;
        this.gridConfiguration.y = (this.sys.game.config.height - gridHeight) / 2;
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
        this.createDebugOverlay();
    }

    createDebugOverlay() {
        this.debugGraphics = this.add.graphics();
        this.debugGraphics.setDepth(1000); // Ensure it's drawn on top

        this.debugText = this.add.text(10, 10, '', {
            font: '14px Arial',
            fill: '#00ff00'
        });
        this.debugText.setDepth(1001); // Ensure it's drawn on top of the graphics

        // Add a toggle key for debug info
        this.input.keyboard.on('keydown-D', () => {
            this.debugGraphics.visible = !this.debugGraphics.visible;
            this.debugText.visible = !this.debugText.visible;
        });
    }

    restartGame() {
        this.cardOpened = undefined;
        this.cameras.main.fadeOut(200 * this.cards.length);
        this.cards.reverse().map((card, index) => {
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
            delay: 200 * this.cards.length,
            callback: () => {
                this.cards = [];
                this.canMove = false;
                this.scene.restart();
                this.sound.play("card-slide", { volume: 1.2 });
            }
        })
    }

    createGridCards() {
        // Select 5 random card names from the available cardNames
        const selectedCardNames = Phaser.Utils.Array.Shuffle([...this.cardNames]).slice(0, this.TOTAL_PAIRS);
        // Create pairs and shuffle
        const gridCardNames = Phaser.Utils.Array.Shuffle([...selectedCardNames, ...selectedCardNames]);

        const scaledCardWidth = this.CARD_WIDTH * this.gridConfiguration.cardScale;
        const scaledCardHeight = this.CARD_HEIGHT * this.gridConfiguration.cardScale;

        return gridCardNames.map((name, index) => {
            const x = this.gridConfiguration.x + (scaledCardWidth + this.gridConfiguration.paddingX) * (index % this.gridConfiguration.columns);
            const y = this.gridConfiguration.y + (scaledCardHeight + this.gridConfiguration.paddingY) * Math.floor(index / this.gridConfiguration.columns);

            const newCard = this.add.sprite(x, -1000, name);
            newCard.setScale(this.gridConfiguration.cardScale);
            newCard.setInteractive();
            newCard.on('pointerdown', () => this.handleCardSelect(newCard));

            // Store the card name for matching logic
            newCard.cardName = name;

            this.add.tween({
                targets: newCard,
                duration: 800,
                delay: index * 100,
                onStart: () => this.sound.play("card-slide", { volume: 1.2 }),
                y: y
            });

            return newCard;
        });
    }

    createHearts() {
        this.uiManager.createHearts(this.lives);
    }

    volumeButton() {
        this.uiManager.createVolumeButton();
    }

    startGame() {
        this.winnerText = this.uiManager.createGameText("YOU WIN", "#8c7ae6");
        this.gameOverText = this.uiManager.createGameText("GAME OVER\nClick to restart", "#ff0000");
    
        this.hearts = this.createHearts();
        this.cards = this.createGridCards();
    
        this.time.addEvent({
            delay: 200 * this.cards.length,
            callback: () => {
                this.canMove = true;
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
        if (this.canMove) {
            const card = this.cards.find(card => card.hasFaceAt(pointer.x, pointer.y));
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
        if (this.canMove && this.cards.length) {
            const card = this.cards.find(card => card.hasFaceAt(pointer.x, pointer.y));
            if (card) {
                this.handleCardSelect(card);
            }
        }
    }

    handleCardSelect(card) {
        if (!this.canMove) return;

        if (this.selectedCard === undefined) {
            this.selectedCard = card;
            // Add visual indication that the card is selected
            card.setTint(0x00ff00);
        } else {
            if (this.selectedCard === card) {
                // Clicked the same card twice, deselect it
                this.selectedCard.clearTint();
                this.selectedCard = undefined;
            } else {
                this.canMove = false;
                if (this.selectedCard.cardName === card.cardName) {
                    this.handleMatch(this.selectedCard, card);
                } else {
                    this.handleMismatch(this.selectedCard, card);
                }
                this.checkGameStatus();
            }
        }
    }

    handleMatch(card1, card2) {
        this.sound.play("card-match");
        this.time.delayedCall(500, () => {
            card1.destroy();
            card2.destroy();
            this.cards = this.cards.filter(c => c !== card1 && c !== card2);
            this.selectedCard = undefined;
            this.canMove = true;
        });
    }

    handleMismatch(card1, card2) {
        this.sound.play("card-mismatch");
        this.cameras.main.shake(600, 0.01);
        this.time.delayedCall(1000, () => {
            card1.clearTint();
            card2.clearTint();
            this.selectedCard = undefined;
            this.removeLife();
            this.canMove = true;
        });
    }

    removeLife() {
        this.uiManager.removeLife();
        this.lives -= 1;
    }

    checkGameStatus() {
        if (this.lives === 0) {
            this.showGameOverText();
        } else if (this.cards.length === 0) {
            this.showWinnerText();
        }
    }

    showGameOverText() {
        this.showAnimatedText(this.gameOverText);
        this.canMove = false;
    }

    showWinnerText() {
        this.sound.play("victory");
        this.showAnimatedText(this.winnerText);
        this.canMove = false;
    }

    showAnimatedText(text) {
        this.uiManager.showAnimatedText(text);
    }

    update() {
        this.updateDebugInfo();
    }

    updateDebugInfo() {
        if (!this.debugGraphics.visible) return;

        this.debugGraphics.clear();

        const scaledCardWidth = this.CARD_WIDTH * this.gridConfiguration.cardScale;
        const scaledCardHeight = this.CARD_HEIGHT * this.gridConfiguration.cardScale;

        // Draw grid
        this.debugGraphics.lineStyle(1, 0x00ff00);
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 2; j++) {
                const x = this.gridConfiguration.x + (scaledCardWidth + this.gridConfiguration.paddingX) * i;
                const y = this.gridConfiguration.y + (scaledCardHeight + this.gridConfiguration.paddingY) * j;
                this.debugGraphics.strokeRect(x, y, scaledCardWidth, scaledCardHeight);
            }
        }

        // Draw card positions
        this.debugGraphics.lineStyle(2, 0xff0000);
        let debugInfo = 'Card Positions:\n';
        this.cards.forEach((card, index) => {
            const x = card.x;
            const y = card.y;
            this.debugGraphics.strokeCircle(x, y, 5);
            debugInfo += `Card ${index}: (${Math.round(x)}, ${Math.round(y)})\n`;
        });

        // Update debug text
        debugInfo += `\nGrid Configuration:\n`;
        debugInfo += `x: ${this.gridConfiguration.x}, y: ${this.gridConfiguration.y}\n`;
        debugInfo += `cardScale: ${this.gridConfiguration.cardScale}\n`;
        debugInfo += `paddingX: ${this.gridConfiguration.paddingX}, paddingY: ${this.gridConfiguration.paddingY}\n`;
        debugInfo += `cardWidth: ${scaledCardWidth}, cardHeight: ${scaledCardHeight}\n`;

        this.debugText.setText(debugInfo);
    }
}