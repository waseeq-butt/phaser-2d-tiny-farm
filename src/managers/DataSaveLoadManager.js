export default class DataSaveLoadManager {
    constructor(scene) {
        this.scene = scene;

        this.binId = "67e597298561e97a50f41d66";
        this.apiKey = "$2a$10$.EwR4ZoiIEMdYoZmez7f0OALN4zAO9N2nYTmq1Qt.r7VqhpPMOEP6";
    }

    async saveGameDataToJSONBin(player, moneyAmount, onCompleteSaveDataCallback) {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${this.binId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "X-Master-Key": this.apiKey
            },
            body: JSON.stringify({
                x: player.x,
                y: player.y,
                money: moneyAmount,
                id: 1
            })
        });

        const result = await response.json();
        console.log("✅ Data Saved:", result);

        if(onCompleteSaveDataCallback){
            onCompleteSaveDataCallback(result);
        }
    }

    async loadGameDataFromJSONBin(onCompleteLoadDataCallback) {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${this.binId}/latest`, {
            headers: { "X-Master-Key": this.apiKey }
        });

        const result = await response.json();
        console.log("📜 Loaded Data:", result.record);

        if(onCompleteLoadDataCallback){
            onCompleteLoadDataCallback(result.record);
        }
    }
}
