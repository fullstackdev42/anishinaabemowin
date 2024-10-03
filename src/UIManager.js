export class UIManager {
    constructor(scene) {
        this.scene = scene;
    }

    createBackground() {
        this.scene.add.image(this.scene.sys.game.config.width / 2, this.scene.sys.game.config.height / 2, "background");
    }

    createTitleText() {
        this.scene.add.text(
            this.scene.sys.game.config.width / 2,
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

    showAnimatedText(text) {
        const animatedText = this.scene.add.text(
            this.scene.sys.game.config.width / 2,
            this.scene.sys.game.config.height / 2,
            text,
            {
                fontFamily: 'Arial',
                fontSize: '64px',
                color: '#ffffff',
                align: 'center',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5).setAlpha(0);

        this.scene.tweens.add({
            targets: animatedText,
            alpha: 1,
            duration: 1000,
            ease: 'Power2'
        });
    }

    showGameOverText() {
        this.showAnimatedText('Game Over');
    }

    showWinnerText() {
        this.scene.sound.play("victory");
        this.showAnimatedText('You Win!');
    }
}