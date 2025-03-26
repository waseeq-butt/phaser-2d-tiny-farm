import { Start } from './scenes/Start.js';

const config = {
    type: Phaser.AUTO,
    title: 'Survivor',
    parent: 'game-container',
    // width: 1280,
    // height: 720,
    width: window.innerWidth,
    height: window.innerHeight,
    pixelArt: false,
    scene: [
        Start
    ],
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: "matter",
        matter: {
        gravity: { y: 0 },
        debug: false,
        }
    }
}
new Phaser.Game(config);
            