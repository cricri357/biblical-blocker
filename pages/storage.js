const DEFAULT_DATA = {
    currentReading: {
        book: "GEN",
        chapter: 1,
        verse: 1
    },
    versesRead: 0
};

// Recupera os dados
async function getStorageData() {
    const data = await chrome.storage.local.get("userData");
    return data.userData ?? DEFAULT_DATA;
}

// Salva os dados
async function saveStorageData(userData) {
    await chrome.storage.local.set({
        userData
    });
}

// Atualiza a posição da leitura
async function updateCurrentReading(book, chapter, verse) {
    const data = await getStorageData();

    data.currentReading = {
        book,
        chapter,
        verse
    };

    await saveStorageData(data);
}

// Adiciona versículos ao saldo
async function addVersesRead(amount = 1) {
    const data = await getStorageData();

    data.versesRead += amount;

    await saveStorageData(data);

    return data.versesRead;
}