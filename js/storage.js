const DEFAULT_DATA = {
    currentReading: {
        book: "GEN",
        chapter: 1,
        verse: 1
    },
    versesRead: 0
};

// Recupera os dados salvos. Se ainda não houver dados, retorna os padrões.
async function getStorageData() {
    const result = await chrome.storage.local.get("userData");
    const savedData = result.userData ?? {};

    return {
        ...DEFAULT_DATA,
        ...savedData,
        currentReading: {
            ...DEFAULT_DATA.currentReading,
            ...(savedData.currentReading ?? {})
        },
        versesRead: Number.isFinite(Number(savedData.versesRead))
            ? Math.max(0, Number(savedData.versesRead))
            : 0
    };
}

// Salva os dados do usuário.
async function saveStorageData(userData) {
    await chrome.storage.local.set({ userData });
}

// Atualiza a posição atual da leitura.
async function updateCurrentReading(book, chapter, verse) {
    if (
        typeof book !== "string" ||
        !book ||
        !Number.isInteger(chapter) ||
        chapter < 1 ||
        !Number.isInteger(verse) ||
        verse < 1
    ) {
        throw new Error("Dados inválidos para atualizar a posição de leitura.");
    }

    const data = await getStorageData();

    data.currentReading = { book, chapter, verse };

    await saveStorageData(data);
}

// Adiciona versículos ao saldo acumulado.
async function addVersesRead(amount = 1) {
    if (!Number.isInteger(amount) || amount <= 0) {
        throw new Error("A quantidade de versículos deve ser um inteiro positivo.");
    }

    const data = await getStorageData();
    data.versesRead += amount;

    await saveStorageData(data);

    return data.versesRead;
}