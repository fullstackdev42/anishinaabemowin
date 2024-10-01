import Phaser from 'phaser';
import { setupVolumeEvents } from './PlayUtils';

export class UIManager {
    // Define constants for header and footer heights and other values
    static HEADER_HEIGHT = 50;
    static FOOTER_HEIGHT = 50;
    static HEART_SCALE = 2;
    static HEART_MARGIN_LEFT = 140;
    static HEART_SPACE_BETWEEN = 30;

    constructor(scene) {
        this.scene = scene;
        this.hearts = [];
    }

    createHeader() {
        const headerYPosition = UIManager.HEADER_HEIGHT / 2;
        const header = this.scene.add.rectangle(
            this.scene.sys.game.config.width / 2,
            headerYPosition, // Use calculated Y position
            this.scene.sys.game.config.width,
            UIManager.HEADER_HEIGHT, // Use constant for height
            0x000000
        ).setOrigin(0.5);
        return header;
    }
    
    createFooter() {
        const footerYPosition = this.scene.sys.game.config.height - UIManager.FOOTER_HEIGHT / 2;
        const footer = this.scene.add.rectangle(
            this.scene.sys.game.config.width / 2,
            footerYPosition, // Use calculated Y position
            this.scene.sys.game.config.width,
            UIManager.FOOTER_HEIGHT, // Use constant for height
            0x000000
        ).setOrigin(0.5);
        return footer;
    }
    
    createPlayArea() {
        const playAreaYPosition = UIManager.HEADER_HEIGHT; // Start play area where header ends
        const playAreaHeight = this.scene.sys.game.config.height - UIManager.HEADER_HEIGHT - UIManager.FOOTER_HEIGHT; // Adjust play area height to account for header and footer

        const playArea = this.scene.add.rectangle(
            this.scene.sys.game.config.width / 2,
            playAreaYPosition + playAreaHeight / 2, // Center play area vertically
            this.scene.sys.game.config.width,
            playAreaHeight,
            0x1e1e1e
        ).setOrigin(0.5);

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
        const heartYPosition = header.y; // Center hearts vertically within the header

        this.hearts = Array.from(new Array(lives)).map((el, index) => {
            const heart = this.scene.add.image(this.scene.sys.game.scale.width + 1000, heartYPosition, "heart")
                .setScale(UIManager.HEART_SCALE); // Use constant for scale

            this.scene.add.tween({
                targets: heart,
                ease: Phaser.Math.Easing.Expo.InOut,
                duration: 1000,
                delay: 1000 + index * 200,
                x: UIManager.HEART_MARGIN_LEFT + UIManager.HEART_SPACE_BETWEEN * index // Use constants for margin and spacing
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
}
