importScripts("../js/storage.js")

console.log("Blocker Bíblico iniciado!");

const unlockRule = {
    id: 1001,
    priority: 2,
    action: {
        type: "allow"
    },
    condition: {
        urlFilter: "||instagram.com^",
        resourceTypes: ["main_frame"]
    }
};

await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [1001]
});
console.log("bloqueou")

async function recievedMessage(message) {
    if (message.action === "unlockSite") {
        
        const data = await getStorageData();

        if (data.versesRead > 0) {
            console.log("permite desbloquear")
            await chrome.declarativeNetRequest.updateDynamicRules({
                addRules: [unlockRule]
            });
        }
        
    }
}

chrome.runtime.onMessage.addListener((message) => {
    recievedMessage(message)
});