export default class CollisionMatrix {
    constructor(scene) {
        this.scene = scene;
        this.categories = {};
    }

    // Create a new collision category and store it
    createAndSetCategory(name, obj) {
        if (!this.categories[name]) {
            this.categories[name] = this.scene.matter.world.nextCategory();
            obj.setCollisionCategory(this.categories[name]);
        }
        return this.categories[name];
    }

    // Get an existing category
    getCategory(name) {
        return this.categories[name] || null;
    }

    // Apply collision settings to a game object
    setCollision(obj, collidesWith = []) {
        obj.setCollidesWith(collidesWith.map(category => category || 0));
    }

    setSensor(obj, isSensor = true) {
        obj.setSensor(isSensor);
    }
}
