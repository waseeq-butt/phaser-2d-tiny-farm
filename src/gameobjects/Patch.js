export default class Patch {
    constructor(scene) {
        this.scene = scene;
        this.isReadyForPlanting = true;
        this.isReadytoHarvest = false;
        this.sprite = null; // Store the sprite reference
        this.plant = null;
    }

    createPatch(originX, originY, offsetX, offsetY, ref, label)
    {
        this.sprite = this.scene.matter.add.sprite(
                originX + offsetX,
                originY + offsetY,
                ref, null, { label: label }
            ).setScale(4);

        this.sprite.setStatic(true);
        this.sprite.setSensor(true);

        this.sprite.body.patchObject = this;
    }

    getX()
    {
        return this.sprite.x;
    }

    getY()
    {
        return this.sprite.y;
    }

    getObject()
    {
        return this.sprite;
    }

    setPlantObject(plant)
    {
        this.plant = plant;
    }

    removePlantObject()
    {
        this.plant.destroy();
        this.plant = null;
    }

    isPatchReadyForPlanting()
    {
        return this.isReadyForPlanting;
    }

    isPatchReadyForHarvest()
    {
        return this.isReadytoHarvest;
    }

    setPlantedSeed()
    {
        this.isReadyForPlanting = false;
    }

    setReadyForHarvest()
    {
        this.isReadytoHarvest = true;
        this.isReadyForPlanting = false;
    }

    setReadyForPlanting()
    {
        this.isReadyForPlanting = true;
        this.isReadytoHarvest = false;
    }
}
