import Phaser from 'phaser';

export const createCard = ({
    scene,
    x,
    y,
    cardText,
    cardName
}) => {
    const cardBackground = scene.add.rectangle(x, y, 98, 128, 0xffffff)
        .setStrokeStyle(2, 0x000000)
        .setOrigin(0.5);

    const text = scene.add.text(x, y, cardText, {
        fontFamily: 'Arial',
        fontSize: '16px',
        color: '#000000',
        align: 'center',
        wordWrap: { width: 90 }
    }).setOrigin(0.5);

    const container = scene.add.container(x, y, [cardBackground, text]);
    container.setSize(98, 128);
    container.setInteractive();
    container.setScale(0.5);

    container.setVisible(true);

    const destroy = (tweenConfig = {
        y: container.y - 1000,
        ease: 'Back.easeIn',
        duration: 500
    }) => {
        scene.tweens.add({
            targets: container,
            ...tweenConfig,
            onComplete: () => {
                container.destroy();
            }
        });
    };

    return {
        gameObject: container,
        destroy,
        cardName,
        x: container.x,
        y: container.y,
        hasFaceAt: (x, y) => container.getBounds().contains(x, y)
    };
};
