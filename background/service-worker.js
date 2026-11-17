importScripts("../js/storage.js");

console.log("Blocker Bíblico iniciado!");

// Domínios que a extensão permite desbloquear.
const allowedSites = ["instagram.com", "facebook.com"];

async function receivedMessage(message, sendResponse) {
    if (message.action !== "unlockSite") {
        return;
    }

    try {
        // Confere se o domínio recebido é um dos sites configurados.
        if (!allowedSites.includes(message.site)) {
            throw new Error("Site não autorizado.");
        }

        const data = await getStorageData();

        if (Number(data.versesRead) <= 0) {
            sendResponse({
                success: false,
                error: "Saldo insuficiente."
            });
            return;
        }

        // Cria uma regra dinâmica para permitir somente o site solicitado.
        const unlockRule = {
            id: 1001,
            priority: 2,
            action: {
                type: "allow"
            },
            condition: {
                urlFilter: `||${message.site}^`,
                resourceTypes: ["main_frame"]
            }
        };

        await chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: [unlockRule.id],
            addRules: [unlockRule]
        });

        console.log(`[Blocker] Site desbloqueado: ${message.site}`);

        // Informa à página que a regra foi criada com sucesso.
        sendResponse({
            success: true,
            site: message.site
        });
    } catch (error) {
        console.error("[Blocker] Erro ao desbloquear site:", error);
        sendResponse({
            success: false,
            error: error.message
        });
    }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action !== "unlockSite") {
        return;
    }

    receivedMessage(message, sendResponse);

    // Mantém o canal aberto até a operação assíncrona responder.
    return true;
});
