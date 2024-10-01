import Phaser from 'phaser';
import { setupVolumeEvents } from './PlayUtils';

export class UIManager {
    // Define constants for header and footer heights and other values
    static HEADER_HEIGHT = 50;
    static FOOTER_HEIGHT = 50;
    static HEART_SCALE = 2;
    static HEART_MARGIN_LEFT = 140;
    static HEART_SPACE_BETWEEN = 30;

    constructor(scene, debugMode = false) {
        this.scene = scene;
        this.hearts = [];
        this.debugMode = debugMode;
        this.debugGraphics = null;
    }

    createHeader() {
        const headerYPosition = UIManager.HEADER_HEIGHT / 2;
        const header = this.scene.add.rectangle(
            this.scene.sys.game.config.width / 2,
            headerYPosition,
            this.scene.sys.game.config.width,
            UIManager.HEADER_HEIGHT,
            0x000000
        ).setOrigin(0.5);
        return header;
    }
    
    createFooter() {
        const footerYPosition = this.scene.sys.game.config.height - UIManager.FOOTER_HEIGHT / 2;
        const footer = this.scene.add.rectangle(
            this.scene.sys.game.config.width / 2,
            footerYPosition,
            this.scene.sys.game.config.width,
            UIManager.FOOTER_HEIGHT,
            0x000000
        ).setOrigin(0.5);
        return footer;
    }
    
    createPlayArea() {
        const playAreaYPosition = UIManager.HEADER_HEIGHT;
        const playAreaHeight = this.scene.sys.game.config.height - UIManager.HEADER_HEIGHT - UIManager.FOOTER_HEIGHT;

        const playArea = this.scene.add.rectangle(
            0, // Changed from this.scene.sys.game.config.width / 2 to 0
            playAreaYPosition + playAreaHeight / 2,
            this.scene.sys.game.config.width,
            playAreaHeight,
            0x1e1e1e
        ).setOrigin(0, 0.5); // Changed from 0.5 to 0, 0.5 to align left

        if (this.debugMode) {
            this.debugGraphics = this.scene.add.graphics();
            this.debugGraphics.lineStyle(2, 0xff0000, 1);
            this.debugGraphics.strokeRect(
                playArea.x,
                playArea.y - playArea.height / 2,
                playArea.width,
                playArea.height
            );
        }

        console.log(`Play area: x=${playArea.x}, y=${playArea.y}, width=${playArea.width}, height=${playArea.height}`);

        return playArea;
    }

    createVolumeButton() {
        const volumeIcon = this.scene.add.image(25, 25, "volume-icon").setName("volume-icon");
        volumeIcon.setInteractive();
        setupVolumeEvents(this.scene, volumeIcon);
        return volumeIcon;
    }

    createHearts(lives) {
        const header = this.createHeader();
        const heartYPosition = header.y;

        this.hearts = Array.from(new Array(lives)).map((el, index) => {
            const heart = this.scene.add.image(this.scene.sys.game.scale.width + 1000, heartYPosition, "heart")
                .setScale(UIManager.HEART_SCALE);

            this.scene.add.tween({
                targets: heart,
                ease: Phaser.Math.Easing.Expo.InOut,
                duration: 1000,
                delay: 1000 + index * 200,
                x: UIManager.HEART_MARGIN_LEFT + UIManager.HEART_SPACE_BETWEEN * index
            });
            return heart;
        });
    }

    showHearts(lives) {
        this.createHearts(lives);
    }

    removeLife() {
        const lastHeart = this.hearts[this.hearts.length - 1];
        this.scene.add.tween({
            targets: lastHeart,
            ease: Phaser.Math.Easing.Expo.InOut,
            duration: 1000,
            y: -1000,
            onComplete: () => {
                lastHeart.destroy();
                this.hearts.pop();
            }
        });
    }

    createGameText(content, color) {
        return this.scene.add.text(this.scene.sys.game.scale.width / 2, -1000, content,
            { align: "center", strokeThickness: 4, fontSize: 40, fontStyle: "bold", color: color }
        )
            .setOrigin(.5)
            .setDepth(3)
            .setInteractive();
    }

    showAnimatedText(text) {
        this.scene.sound.play("whoosh", { volume: 1.3 });
        this.scene.add.tween({
            targets: text,
            ease: Phaser.Math.Easing.Bounce.Out,
            y: this.scene.sys.game.scale.height / 2,
        });
    }

    setupClickToPlay(lives) {
        this.scene.input.once('pointerdown', () => {
            this.showHearts(lives);
        });
    }

    getPlayAreaCoordinates() {
        const playAreaYPosition = UIManager.HEADER_HEIGHT;
        const playAreaHeight = this.scene.sys.game.config.height - UIManager.HEADER_HEIGHT - UIManager.FOOTER_HEIGHT;
        const playAreaXPosition = 0;
        const playAreaWidth = this.scene.sys.game.config.width;

        return {
            x: playAreaXPosition,
            y: playAreaYPosition,
            width: playAreaWidth,
            height: playAreaHeight
        };
    }

    toggleDebugBorder() {
        if (this.debugGraphics) {
            this.debugGraphics.visible = !this.debugGraphics.visible;
        }
    }
}