import Phaser from 'phaser';

export class Card {
    constructor(scene, data, width, height) {
        this.scene = scene;
        this.data = data;
        this.width = width;
        this.height = height;
        this.revealed = false;
        this.selected = false;

        this.createCardObject();
    }

    createCardObject() {
        this.container = this.scene.add.container(0, 0);
        this.background = this.scene.add.rectangle(0, 0, this.width, this.height, 0xffffff);
        this.text = this.scene.add.text(0, 0, this.data.text, {
            fontFamily: 'Arial',
            fontSize: '16px',
            color: '#000000',
            align: 'center',
            wordWrap: { width: this.width - 10 }
        }).setOrigin(0.5);

        this.container.add([this.background, this.text]);
        this.container.setSize(this.width, this.height);
        this.container.setInteractive();
    }

    setPosition(x, y) {
        this.container.setPosition(x, y);
    }

    setSelected(isSelected) {
        this.selected = isSelected;
        this.background.setFillStyle(isSelected ? 0x00ff00 : 0xffffff);
    }

    destroy() {
        this.container.destroy();
    }

    hasFaceAt(x, y) {
        return this.container.getBounds().contains(x, y);
    }

    fadeOut(duration, onComplete) {
        this.scene.tweens.add({
            targets: this.container,
            alpha: 0,
            duration: duration,
            onComplete: onComplete
        });
    }
}