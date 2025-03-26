import Player from "../gameobjects/Player.js";
import CollisionMatrix from '../utils/CollisionMatrix.js';
import DataSaveLoadManager from '../managers/DataSaveLoadManager.js';
import Patch from '../gameobjects/Patch.js';

export class Start extends Phaser.Scene
{
    constructor()
    {
        super('Start');
        this.money = 200;
    }

    preload() // Awake
    {
        this.load.image('background', 'assets/space.png');
        this.load.image('home', 'assets/home.png');

        this.load.image('openInventory', 'assets/openInventoryButton.png');
        this.load.image('inventory', 'assets/inventory.png');
        this.load.image('saveData', 'assets/saveDataButton.png');
        this.load.image('loadData', 'assets/loadDataButton.png');

        this.load.image('patch', 'assets/patch.png');
        this.load.image('tomato', 'assets/tomatoButton.png');
        this.load.image('potato', 'assets/potatoButton.png');

        this.load.image('tomatoSeeds', 'assets/tomatoseeds.png');
        this.load.image('potatoSeeds', 'assets/potatoseeds.png');

        this.load.image('potatoPlantLvl1', 'assets/potatoPlantLvl1.png');
        this.load.image('potatoPlantLvl2', 'assets/potatoPlantLvl2.png');
        this.load.image('potatoPlantLvl3', 'assets/potatoPlantLvl3.png');

        this.load.image('tomatoPlantLvl1', 'assets/tomatoPlantLvl1.png');
        this.load.image('tomatoPlantLvl2', 'assets/tomatoPlantLvl2.png');
        this.load.image('tomatoPlantLvl3', 'assets/tomatoPlantLvl3.png');

        this.load.spritesheet('girl_idle', 'assets/girl_idle.png', { frameWidth: 38, frameHeight: 80 });
        this.load.spritesheet('girl_walk', 'assets/girl_walk.png', { frameWidth: 38, frameHeight: 80 });
        this.load.spritesheet('chicken', 'assets/chicken.png', { frameWidth: 12, frameHeight: 13 });
    }

    create() // Start
    {
        this.isMoving = false;
        this.isInventoryVisible = false;
        this.patches = [];
        this.tomatoPlants = [];
        this.potatoPlants = [];
        this.selectedPatch = null;

        this.setBackground();
        this.setPlayer();
        this.setUI();
        this.setCollisions();

        // Set up cursor keys for movement
        this.cursors = this.input.keyboard.createCursorKeys();

        this.dataManager = new DataSaveLoadManager(this);
    }

    update() 
    {
        const speed = 300;
        const deltaTime = this.game.loop.delta / 1000; // Convert ms to seconds
        this.player.setVelocity(0, 0);
        //this.background.tilePositionX += 2;

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-speed * deltaTime);
            this.player.flipX = true;
            this.isMoving = true;
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(speed * deltaTime);
            this.player.flipX = false;
            this.isMoving = true;
        }
        else
        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-speed * deltaTime);
            this.isMoving = true;
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(speed * deltaTime);
            this.isMoving = true;
        }
        else
        {
            this.isMoving = false;
        }

        if(this.isMoving == true)
        {
            this.player.play('walk', true);
        }
        else
        {
            this.player.play('idle', true);
        }
    }

    setCollisions()
    {
        var allCategories = [];
        this.collisionMatrix = new CollisionMatrix(this);

        // Define categories
        const playerCategory = this.collisionMatrix.createAndSetCategory('player', this.player);
        const homeCategory = this.collisionMatrix.createAndSetCategory('home', this.home);
        const patchCategory = this.collisionMatrix.createAndSetCategory('patch', this.patchA2.getObject());
        
        allCategories.push(playerCategory);
        allCategories.push(homeCategory);
        allCategories.push(patchCategory);

        for(let i=0; i<this.patches.length; i++)
        {
            allCategories.push(this.collisionMatrix.createAndSetCategory('patch'+i, this.patches[i].getObject()));
        }

        this.collisionMatrix.setCollision(this.player, allCategories); // Player collides with home

        this.matter.world.on("collisionstart", (event) => {
            
            event.pairs.forEach((pair) => {
                
                if (pair.bodyA.label === "player" && pair.bodyB.label === "patch")
                {
                    if(pair.bodyB.patchObject.isPatchReadyForPlanting() == true)
                    {
                        this.enableInventoryButton();
                        this.selectedPatch = pair.bodyB.patchObject;
                    }
                    else
                    if(pair.bodyA.patchObject.isPatchReadyForHarvest() == true)
                    {
                        this.enableInventoryButton();
                        this.selectedPatch = pair.bodyB.patchObject;

                        pair.bodyB.patchObject.removePlantObject();
                        pair.bodyB.patchObject.setReadyForPlanting();

                        this.updateMoney();
                    }
                }
                else   
                if(pair.bodyB.label === "player" && pair.bodyA.label === "patch") 
                {
                    if(pair.bodyA.patchObject.isPatchReadyForPlanting() == true)
                    {
                        this.enableInventoryButton();
                        this.selectedPatch = pair.bodyA.patchObject;
                    }
                    else
                    if(pair.bodyA.patchObject.isPatchReadyForHarvest() == true)
                    {
                        this.enableInventoryButton();
                        this.selectedPatch = pair.bodyA.patchObject;

                        pair.bodyA.patchObject.removePlantObject();
                        pair.bodyA.patchObject.setReadyForPlanting();

                        this.updateMoney();
                    }
                }
            });
        });

        this.matter.world.on("collisionend", (event) => {
            
            event.pairs.forEach((pair) => {
                
                if ((pair.bodyA.label === "player" && pair.bodyB.label === "patch") ||
                    (pair.bodyB.label === "player" && pair.bodyA.label === "patch")) {
                    this.disableInventoryButton();
                    this.selectedPatch = null;
                }
            });
        });
    }

    updateMoney()
    {
        this.money += 150;
        this.moneyText.text = "$ " + this.money;
    }

    setUI()
    {
        this.uiLayer = this.add.layer();
        this.spriteLayer = this.add.layer();

        this.moneyBG = this.add.rectangle(0, 0, 160, 60, 0x0000);
        this.moneyText = this.add.text(-70, -16, "$ 100", { fontSize: "36px", fill: "#fff" });
        this.moneyText.text = "$ " + "200";
        this.moneyContainer = this.add.container(100, 50, [this.moneyBG, this.moneyText]);

        // Create button
        this.button = this.add.sprite(340, 200, 'openInventory').setScale(1.5).setInteractive().setVisible(false);
        this.saveButton = this.add.sprite(1000, 50, 'saveData').setScale(1.5).setInteractive();
        this.loadButton = this.add.sprite(1125, 50, 'loadData').setScale(1.5).setInteractive();
        
        // Create panel (hidden by default)
        //this.panel = this.add.rectangle(640, 360, 256, 256, 0xfffff).setScale(1.5);
        this.panel = this.add.sprite(640, 360, 'inventory').setScale(1.5);

        this.closeButton = this.add.text(800, 180, "X", { fontSize: "32px", fill: "#fff" })
            .setInteractive();

        this.addTomatoSeedButton = this.add.sprite(520, 260, 'tomato').setInteractive();

        this.addPotatoSeedButton = this.add.sprite(620, 260, 'potato').setInteractive();

        this.panelContainer = this.add.container(0, 0, [this.panel, this.closeButton, this.addTomatoSeedButton, this.addPotatoSeedButton]);
        this.panelContainer.setVisible(false);

        //this.uiLayer.add([this.button, this.saveButton, this.loadButton, this.panel, this.addTomatoSeedButton, this.addPotatoSeedButton]);
        this.uiLayer.setDepth(100);

        this.button.on("pointerdown", this.enableInventoryPanel, this);
        this.closeButton.on("pointerdown", this.disableInventoryPanel, this);
        this.saveButton.on("pointerdown", this.onClickSaveData, this);
        this.loadButton.on("pointerdown", this.onClickLoadData, this);

        this.addTomatoSeedButton.on("pointerdown", this.onSelectTomatoSeeds, this);
        this.addPotatoSeedButton.on("pointerdown", this.onSelectPotatoSeeds, this);
    }

    setPlayer()
    {
        console.log('Setting Player ...');

        this.player = this.matter.add.sprite(640, 250, 'girl_idle', null, { label: 'player' });
        this.player.setFixedRotation();
        this.player.setSensor(false);

        this.player.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('girl_walk', { start: 0, end: 7 }),
            frameRate: 60,
            repeat: -1
        });

        this.player.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('girl_idle', { start: 0, end: 0 }),
            frameRate: 60,
            repeat: -1
        });
    }

    setBackground()
    {
        console.log('Setting Background ...');

        this.background = this.add.rectangle(640, 360, 1280, 720, 0x55C233);
        this.home = this.matter.add.sprite(640, 100, 'home', null, { label: 'home' }).setScale(2);
        this.home.setStatic(true);

        this.patchA2 = new Patch(this);
        this.patchA2.createPatch(640, 450, 0, 0, 'patch', 'patch');
        
        
        let spacing = 120; // Adjust the spacing as needed

        let positions = [
            { x: -spacing, y: -spacing }, // Top-left
            { x: 0,        y: -spacing }, // Top-center
            { x: spacing,  y: -spacing }, // Top-right
            { x: -spacing, y: 0 },        // Left
            { x: spacing,  y: 0 },        // Right
            { x: -spacing, y: spacing },  // Bottom-left
            { x: 0,        y: spacing },  // Bottom-center
            { x: spacing,  y: spacing }   // Bottom-right
        ];

        positions.forEach(offset => {

            let patch = new Patch(this);
            patch.createPatch(this.patchA2.getX(), this.patchA2.getY(), offset.x, offset.y, 'patch', 'patch');

            this.patches.push(patch);
        });
    }

    onCompleteSaveData()
    {
        console.log("data saved successfully ");
    }

    onCompleteLoadData(loadedData)
    {
        console.log("data loaded successfully : ", loadedData);

        this.player.setPosition(loadedData.x, loadedData.y);
        this.money = loadedData.money;
        this.moneyText.text = "$ " + this.money;
    }

    onClickLoadData()
    {
        this.dataManager.loadGameState((loadedData) => this.onCompleteLoadData(loadedData));
    }

    onClickSaveData()
    {
        this.dataManager.saveGameState(this.player, this.money, (savedData) => this.onCompleteSaveData(savedData));
    }

    enableInventoryButton()
    {
        this.button.setVisible(true);
    }

    disableInventoryButton()
    {
        this.button.setVisible(false);
    }

    enableInventoryPanel()
    {
        this.panelContainer.setVisible(true);
        this.button.setVisible(false);
    }

    disableInventoryPanel()
    {
        this.panelContainer.setVisible(false);
        this.button.setVisible(true);
    }

    onSelectTomatoSeeds()
    {
        console.log('Planted tomato seeds ...');
        this.disableInventoryPanel();
        this.disableInventoryButton();

        if(this.selectedPatch != null)
        {
            let tomatoPlant = this.add.sprite(this.selectedPatch.getX(), this.selectedPatch.getY(), 'tomatoSeeds', { label: 'TomatoPlant' })
            .setScale(3);

            this.selectedPatch.setPlantObject(tomatoPlant);
            this.selectedPatch.setPlantedSeed();

            this.tomatoPlants.push(tomatoPlant);

            this.startTomatoPlantGrowth(this.tomatoPlants[this.tomatoPlants.length - 1], this.selectedPatch);
        }
    }

    onSelectPotatoSeeds()
    {
        console.log('Planted potato seeds ...');
        this.disableInventoryPanel();
        this.disableInventoryButton();

        if(this.selectedPatch != null)
        {
            let potatoPlant = this.add.sprite(this.selectedPatch.getX(), this.selectedPatch.getY(), 'potatoSeeds', { label: 'PotatoPlant' })
            .setScale(3)

            this.selectedPatch.setPlantObject(potatoPlant);
            this.selectedPatch.setPlantedSeed();

            this.potatoPlants.push(potatoPlant);
            
            this.startPotatoPlantGrowth(this.potatoPlants[this.potatoPlants.length - 1], this.selectedPatch);
        }
    }

    startPotatoPlantGrowth(plantSprite, patch) {
        // Stage 1: After 5 seconds, change to a small plant
        this.time.delayedCall(3000, () => {
            plantSprite.setTexture('potatoPlantLvl1');
        });

        //Stage 2: After 10 seconds, change to a bigger plant
        this.time.delayedCall(6000, () => {
            plantSprite.setTexture('potatoPlantLvl2');
        });

        // Stage 3: After 15 seconds, fully grown plant
        this.time.delayedCall(9000, () => {
            plantSprite.setTexture('potatoPlantLvl3');
            patch.setReadyForHarvest();
        });
    }

    startTomatoPlantGrowth(plantSprite, patch) {
        // Stage 1: After 5 seconds, change to a small plant
        this.time.delayedCall(3000, () => {
            plantSprite.setTexture('tomatoPlantLvl1');
        });

        //Stage 2: After 10 seconds, change to a bigger plant
        this.time.delayedCall(6000, () => {
            plantSprite.setTexture('tomatoPlantLvl2');
        });

        // Stage 3: After 15 seconds, fully grown plant
        this.time.delayedCall(9000, () => {
            plantSprite.setTexture('tomatoPlantLvl3');
            patch.setReadyForHarvest();
        });
    }
}

