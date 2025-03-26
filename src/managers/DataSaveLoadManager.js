export default class DataSaveLoadManager {
    constructor(scene) {
        this.scene = scene;
    }

    async loadGameState(onCompleteLoadDataCallback) {
        await fetch("http://localhost:3000/players/1")
            .then(res => res.json())
            .then(data => {
                console.log("Loaded Data");

                if (onCompleteLoadDataCallback) {
                    onCompleteLoadDataCallback(data);
                }
            })
            .catch(error => console.error("Load Error:", error));
    }

    async saveGameState(player, amount, onCompleteSaveDataCallback) {
        await fetch("http://localhost:3000/players/1", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ x: player.x, y: player.y, money: amount })
        })
        .then(res => {
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }
            return res.json();
        })
        .then(data => {
                console.log("Saved Data");

                if (onCompleteSaveDataCallback) {
                    onCompleteSaveDataCallback(data);
                }
        })
        .catch(error => console.error("Save Error:", error));
    }
}
