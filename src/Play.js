import { createCard } from './createCard';
import Phaser from 'phaser';
import { createGameText, setupVolumeEvents, setupTitleEvents } from './PlayUtils';

/**
 * Card Matching Game by Francisco Pereira (Gammafp)
 * -----------------------------------------------
 *
 * Match pairs of cards in this classic game.
 * Find all matching pairs to win!
 *
 * Music credits:
 * "Fat Caps" by Audionautix is licensed under the Creative Commons Attribution 4.0 license. https://creativecommons.org/licenses/by/4.0/
 * Artist http://audionautix.com/
 */
export class Play extends Phaser.Scene
{
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

    // Grid configuration
    gridConfiguration = {
        x: 200,
        y: 50,
        paddingX: 20,
        paddingY: 10,
        cardScale: 0.4
    }

    constructor ()
    {
        super({
            key: 'Play'
        });
    }

    init ()
    {
        this.cameras.main.fadeIn(500);
        this.lives = 10;
        this.volumeButton();
    }

    create ()
    {
        this.add.image(this.gridConfiguration.x - 63, this.gridConfiguration.y - 77, "background").setOrigin(0);

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
    }

    restartGame ()
    {
        this.cardOpened = undefined;
        this.cameras.main.fadeOut(200 * this.cards.length);
        this.cards.reverse().map((card, index) => {
            this.add.tween({
                targets: card.gameObject,
                duration: 500,
                y: 1000,
                delay: index * 100,
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

    createGridCards ()
    {
        const gridCardNames = Phaser.Utils.Array.Shuffle([...this.cardNames, ...this.cardNames]);

        return gridCardNames.slice(0, 10).map((name, index) => {
            const newCard = createCard({
                scene: this,
                x: this.gridConfiguration.x + (98 * this.gridConfiguration.cardScale + this.gridConfiguration.paddingX) * (index % 2),
                y: -1000,
                frontTexture: name,
                cardName: name
            });
            newCard.gameObject.setScale(this.gridConfiguration.cardScale);
            this.add.tween({
                targets: newCard.gameObject,
                duration: 800,
                delay: index * 100,
                onStart: () => this.sound.play("card-slide", { volume: 1.2 }),
                y: this.gridConfiguration.y + (128 * this.gridConfiguration.cardScale + this.gridConfiguration.paddingY) * Math.floor(index / 2),
                onComplete: () => newCard.flip() // Flip the card to show its face
            })
            return newCard;
        });
    }

    createHearts ()
    {
        return Array.from(new Array(this.lives)).map((el, index) => {
            const heart = this.add.image(this.sys.game.scale.width + 1000, 20, "heart")
                .setScale(2)

            this.add.tween({
                targets: heart,
                ease: Phaser.Math.Easing.Expo.InOut,
                duration: 1000,
                delay: 1000 + index * 200,
                x: 140 + 30 * index // marginLeft + spaceBetween * index
            });
            return heart;
        });
    }

    volumeButton ()
    {
        const volumeIcon = this.add.image(25, 25, "volume-icon").setName("volume-icon");
        volumeIcon.setInteractive();

        setupVolumeEvents(this, volumeIcon);
    }

    startGame ()
    {
        this.winnerText = createGameText(this, "YOU WIN", "#8c7ae6");
        this.gameOverText = createGameText(this, "GAME OVER\nClick to restart", "#ff0000");

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
            const card = this.cards.find(card => card.gameObject.hasFaceAt(pointer.x, pointer.y));
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
            const card = this.cards.find(card => card.gameObject.hasFaceAt(pointer.x, pointer.y));
            if (card) {
                this.handleCardFlip(card);
            }
        }
    }

    handleCardFlip(card) {
        this.canMove = false;

        if (this.cardOpened !== undefined) {
            if (this.cardOpened.gameObject.x === card.gameObject.x && this.cardOpened.gameObject.y === card.gameObject.y) {
                this.canMove = true;
                return;
            }

            if (this.cardOpened.cardName === card.cardName) {
                this.handleMatch(card);
            } else {
                this.handleMismatch(card);
            }
            this.checkGameStatus();
        } else if (this.lives > 0 && this.cards.length > 0) {
            this.cardOpened = card;
            this.canMove = true;
        }
    }

    handleMatch(card) {
        this.sound.play("card-match");
        this.cardOpened.destroy();
        card.destroy();
        this.cards = this.cards.filter(c => c !== this.cardOpened && c !== card);
        this.cardOpened = undefined;
        this.canMove = true;
    }

    handleMismatch(card) {
        this.sound.play("card-mismatch");
        this.cameras.main.shake(600, 0.01);
        this.removeLife();
        this.cardOpened = undefined;
        this.canMove = true;
    }

    removeLife() {
        const lastHeart = this.hearts[this.hearts.length - 1];
        this.add.tween({
            targets: lastHeart,
            ease: Phaser.Math.Easing.Expo.InOut,
            duration: 1000,
            y: -1000,
            onComplete: () => {
                lastHeart.destroy();
                this.hearts.pop();
            }
        });
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
        this.sound.play("whoosh", { volume: 1.3 });
        this.add.tween({
            targets: text,
            ease: Phaser.Math.Easing.Bounce.Out,
            y: this.sys.game.scale.height / 2,
        });
    }
}