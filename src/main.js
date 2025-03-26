import { Start } from './scenes/Start.js';

const config = {
    type: Phaser.AUTO,
    title: 'Survivor',
    parent: 'game-container',
    width: 1280,
    height: 720,
    pixelArt: false,
    scene: [
        Start
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: "matter",
        matter: {
        gravity: { y: 0 },
        debug: true,
        }
    }
}
new Phaser.Game(config);
            