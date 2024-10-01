import Phaser from 'phaser';

export const createCard = ({
    scene,
    x,
    y,
    frontTexture,
    cardName
}) => {
    const card = scene.add.image(x, y, frontTexture)
        .setName(cardName)
        .setInteractive();

    card.setScale(0.5); // Adjust the scale as needed

    const destroy = (tweenConfig = {
        y: card.y - 1000,
        ease: 'Back.easeIn',
        duration: 500
    }) => {
        scene.tweens.add({
            targets: card,
            ...tweenConfig,
            onComplete: () => {
                card.destroy();
            }
        });
    };

    return {
        gameObject: card,
        destroy,
        cardName,
        x: card.x,
        y: card.y,
        hasFaceAt: (x, y) => card.getBounds().contains(x, y)
    };
};