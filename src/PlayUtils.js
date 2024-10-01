import Phaser from 'phaser';

export function createGameText(scene, content, color) {
    const text = scene.add.text(scene.sys.game.scale.width / 2, -1000, content,
        { align: "center", strokeThickness: 4, fontSize: 40, fontStyle: "bold", color: color }
    )
        .setOrigin(.5)
        .setDepth(3)
        .setInteractive();
    
    setupTextEvents(scene, text, color);
    return text;
}

function setupTextEvents(scene, text, defaultColor) {
    const hoverColor = "#FF7F50";
    text.on(Phaser.Input.Events.POINTER_OVER, () => {
        text.setColor(hoverColor);
        scene.input.setDefaultCursor("pointer");
    });
    text.on(Phaser.Input.Events.POINTER_OUT, () => {
        text.setColor(defaultColor);
        scene.input.setDefaultCursor("default");
    });
    text.on(Phaser.Input.Events.POINTER_DOWN, () => {
        scene.sound.play("whoosh", { volume: 1.3 });
        scene.add.tween({
            targets: text,
            ease: Phaser.Math.Easing.Bounce.InOut,
            y: -1000,
            onComplete: () => {
                scene.restartGame();
            }
        })
    });
}

export function setupVolumeEvents(scene, volumeIcon) {
    volumeIcon.on(Phaser.Input.Events.POINTER_OVER, () => {
        scene.input.setDefaultCursor("pointer");
    });
    volumeIcon.on(Phaser.Input.Events.POINTER_OUT, () => {
        scene.input.setDefaultCursor("default");
    });
    volumeIcon.on(Phaser.Input.Events.POINTER_DOWN, () => {
        toggleVolume(scene, volumeIcon);
    });
}

function toggleVolume(scene, volumeIcon) {
    if (scene.sound.volume === 0) {
        scene.sound.setVolume(1);
        volumeIcon.setTexture("volume-icon");
        volumeIcon.setAlpha(1);
    } else {
        scene.sound.setVolume(0);
        volumeIcon.setTexture("volume-icon_off");
        volumeIcon.setAlpha(.5)
    }
}

export function setupTitleEvents(scene, titleText) {
    titleText.on(Phaser.Input.Events.POINTER_OVER, () => {
        titleText.setColor("#9c88ff");
        scene.input.setDefaultCursor("pointer");
    });
    titleText.on(Phaser.Input.Events.POINTER_OUT, () => {
        titleText.setColor("#8c7ae6");
        scene.input.setDefaultCursor("default");
    });
    titleText.on(Phaser.Input.Events.POINTER_DOWN, () => {
        scene.sound.play("whoosh", { volume: 1.3 });
        scene.add.tween({
            targets: titleText,
            ease: Phaser.Math.Easing.Bounce.InOut,
            y: -1000,
            onComplete: () => {
                if (!scene.sound.get("theme-song")) {
                    scene.sound.play("theme-song", { loop: true, volume: .5 });
                }
                scene.startGame();
            }
        });
    });
}
