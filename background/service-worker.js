importScripts("../js/storage.js");

console.log("Blocker Bíblico iniciado!");

// Domínios que a extensão permite desbloquear.
const allowedSites = ["instagram.com", "facebook.com"];

let browserInFocus = false;

chrome.windows.getLastFocused((window) => {
    browserInFocus = window.focused;
    console.log(browserInFocus);
});

chrome.windows.onFocusChanged.addListener((windowId) => {
    console.log("Janela em foco:", windowId);
    browserInFocus = windowId !== chrome.windows.WINDOW_ID_NONE
    console.log("Navegador em foco ", browserInFocus)
});

chrome.tabs.onActivated.addListener((activeInfo) => {
    console.log(`Guia em foco: ${activeInfo.tabId}`);
    console.log(`Janela em foco: ${activeInfo.windowId}`);
    chrome.tabs.query(
    { active: true, lastFocusedWindow: true },
        (tabs) => {
        console.log("Aba ativa:", tabs[0]);
        console.log("Id da aba ativa:", tabs[0]?.id);
        console.log("Endereço:", tabs[0]?.url);
        }
    );
});



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
