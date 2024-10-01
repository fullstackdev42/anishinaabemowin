import Phaser from 'phaser';
import { CARD_WIDTH, CARD_HEIGHT, CARD_SCALE } from './constants';

export const createCard = ({
    scene,
    x,
    y,
    cardText,
    cardName
}) => {
    // Change the rectangle dimensions from 98x128 to 128x98
    const cardBackground = scene.add.rectangle(x, y, CARD_WIDTH, CARD_HEIGHT, 0xffffff)
        .setStrokeStyle(2, 0x000000)
        .setOrigin(0.5);

    const text = scene.add.text(x, y, cardText, {
        fontFamily: 'Arial',
        fontSize: '16px',
        color: '#000000',
        align: 'center',
        wordWrap: { width: CARD_WIDTH - 8 } // Adjust word wrap width for landscape orientation
    }).setOrigin(0.5);

    const container = scene.add.container(x, y, [cardBackground, text]);
    container.setSize(CARD_WIDTH, CARD_HEIGHT);
    container.setInteractive();
    container.setScale(CARD_SCALE);

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
