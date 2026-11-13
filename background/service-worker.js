importScripts("../js/storage.js")

console.log("Blocker Bíblico iniciado!");

async function recievedMessage(message) {
    if (message.action === "unlockSite") {
        
        const data = await getStorageData();

        if (data.versesRead <= 0) {
            console.log("Não permite desbloquear")
        }
        
    }
}

chrome.runtime.onMessage.addListener((message) => {
    recievedMessage(message)
});