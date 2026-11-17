importScripts("../js/storage.js");

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

// Remove uma regra dinâmica antiga ao iniciar o service worker.
async function initializeBackground() {
    try {
        await chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: [unlockRule.id]
        });
        console.log("[Blocker] Regras dinâmicas inicializadas.");
    } catch (error) {
        console.error("[Blocker] Erro ao inicializar regras:", error);
    }
}

async function receivedMessage(message) {
    if (message.action !== "unlockSite") {
        return;
    }

    console.log(`Mensagem: ${message.site}`)

    try {
        const data = await getStorageData();

        if (data.versesRead > 0) {
            await chrome.declarativeNetRequest.updateDynamicRules({
                removeRuleIds: [unlockRule.id],
                addRules: [unlockRule]
            });
            console.log("[Blocker] Site desbloqueado.");
        }
    } catch (error) {
        console.error("[Blocker] Erro ao desbloquear site:", error);
    }
}

chrome.runtime.onMessage.addListener((message) => {
    receivedMessage(message);
});

initializeBackground();
