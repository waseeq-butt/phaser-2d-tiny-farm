export default class Player extends Phaser.GameObjects.Rectangle
{
    constructor(scene)
    {
        super(scene);

        scene.load.spritesheet('girl_idle', 'assets/girl_idle.png', { frameWidth: 38, frameHeight: 80 });
        scene.load.spritesheet('girl_walk', 'assets/girl_walk.png', { frameWidth: 38, frameHeight: 80 });
    }

    createObject(scene)
    {
        var playerInstance = scene.matter.add.sprite(640, 250, 'girl_idle', null, { label: 'player' });
        playerInstance.isSensor = true;
        playerInstance.setFixedRotation();

        playerInstance.anims.create({
            key: 'walk',
            frames: scene.anims.generateFrameNumbers('girl_walk', { start: 0, end: 7 }),
            frameRate: 60,
            repeat: -1
        });

        playerInstance.anims.create({
            key: 'idle',
            frames: scene.anims.generateFrameNumbers('girl_idle', { start: 0, end: 0 }),
            frameRate: 60,
            repeat: -1
        });

        return playerInstance;
    }
}