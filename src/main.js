import { Preloader } from './Preloader';
import { Play } from './Play';
import Phaser from 'phaser';

const config = {
    title: 'Word Matching Game',
    type: Phaser.AUTO,
    width: 549,
    height: 480,
    parent: 'game-container',
    backgroundColor: '#192a56',
    pixelArt: true,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [
        Preloader,
        Play
    ]
};

new Phaser.Game(config);
