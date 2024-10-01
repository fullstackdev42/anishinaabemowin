import Phaser from 'phaser';
import { setupVolumeEvents } from './PlayUtils';

export class UIManager {
    constructor(scene) {
        this.scene = scene;
        this.hearts = [];
    }

    createHeader() {
        const header = this.scene.add.rectangle(
            this.scene.sys.game.config.width / 2,
            50,
            this.scene.sys.game.config.width,
            100,
            0x000000
        ).setOrigin(0.5);
        this.scene.add.text(
            this.scene.sys.game.config.width / 2,
            50,
            "Game Header",
            { fontSize: '32px', color: '#ffffff' }
        ).setOrigin(0.5);
        return header;
    }
    
    createFooter() {
        const footer = this.scene.add.rectangle(
            this.scene.sys.game.config.width / 2,
            this.scene.sys.game.config.height - 50,
            this.scene.sys.game.config.width,
            100,
            0x000000
        ).setOrigin(0.5);
        this.scene.add.text(
            this.scene.sys.game.config.width / 2,
            this.scene.sys.game.config.height - 50,
            "Game Footer",
            { fontSize: '32px', color: '#ffffff' }
        ).setOrigin(0.5);
        return footer;
    }
    
    createPlayArea() {
        const playArea = this.scene.add.rectangle(
            this.scene.sys.game.config.width / 2,
            this.scene.sys.game.config.height / 2,
            this.scene.sys.game.config.width,
            this.scene.sys.game.config.height - 200,
            0x1e1e1e
        ).setOrigin(0.5);
        return playArea;
    }

    createVolumeButton() {
        const volumeIcon = this.scene.add.image(25, 25, "volume-icon").setName("volume-icon");
        volumeIcon.setInteractive();
        setupVolumeEvents(this.scene, volumeIcon);
        return volumeIcon;
    }

    createHearts(lives) {
        const headerHeight = 100; // Assuming header height is 100
        const heartYPosition = headerHeight / 2; // Center hearts vertically within the header

        this.hearts = Array.from(new Array(lives)).map((el, index) => {
            const heart = this.scene.add.image(this.scene.sys.game.scale.width + 1000, heartYPosition, "heart")
                .setScale(2);

            this.scene.add.tween({
                targets: heart,
                ease: Phaser.Math.Easing.Expo.InOut,
                duration: 1000,
                delay: 1000 + index * 200,
                x: 140 + 30 * index // marginLeft + spaceBetween * index
            });
            return heart;
        });
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
}
