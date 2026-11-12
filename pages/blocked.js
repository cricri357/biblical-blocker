let currentBook;
let currentChapter;
let currentVerse;
let chapterData;
let books = [];
let versesRead = 0;
let timerInterval;

const TIMER_DURATION = 3;

const bookSelect = document.querySelector("#book-select");
const chapterSelect = document.querySelector("#chapter-select");
const versesReadBalance = document.querySelector("#verses-read-balance");
const chapterLabel = document.querySelector("#chapter-label");
const verseText = document.querySelector("#verse-text");
const verseReference = document.querySelector("#verse-reference");
const timerProgress = document.querySelector("#timer-progress");
const timerTrack = document.querySelector("#timer-track");
const timerCount = document.querySelector("#timer-count");
const timerMessage = document.querySelector("#timer-message");
const nextVerseButton = document.querySelector("#next-verse-button");

// Recupera o estado salvo e inicia o leitor.
async function initializeReader() {
    try {
        // Espera a promessa dos dados salvos e da lista de livros
        const [savedData, booksResponse] = await Promise.all([
            getStorageData(),
            fetch("https://bible.helloao.org/api/por_blj/books.json")
        ]);

        if (!booksResponse.ok) {
            throw new Error("Não foi possível carregar a lista de livros.");
        }

        // Lista de livros
        const booksData = await booksResponse.json();
        books = booksData.books;

        if (!Array.isArray(books) || books.length === 0) {
            throw new Error("A API não retornou uma lista válida de livros.");
        }

        console.info("[Blocker] Lista de livros carregada:", books.length);

        // Restaura a última posição salva. Se ela não for válida, usa GEN 1:1.
        // Leitura salva
        const savedReading = savedData.currentReading ?? {};
        // Livro salvo
        const savedBook = books.find(book => book.id === savedReading.book);
        // Livro atual é o salvo, senão será Gênesis
        currentBook = savedBook ? savedBook.id : "GEN";

        // Livro selecionado será o atual
        const selectedBook = books.find(book => book.id === currentBook);
        // Capitulo solicitado é o salvo
        const requestedChapter = Number(savedReading.chapter);
        // Capitulo atual é o solicitado, senão será o 1
        currentChapter =
            Number.isInteger(requestedChapter) &&
            requestedChapter >= 1 &&
            requestedChapter <= selectedBook.numberOfChapters
                ? requestedChapter
                : 1;

        // Verso solicitado é o salvo
        const requestedVerse = Number(savedReading.verse);
        // Verso atual é o solicitado, senão será o 1
        currentVerse =
            Number.isInteger(requestedVerse) && requestedVerse >= 1
                ? requestedVerse
                : 1;

        // Saldo salvo
        const savedBalance = Number(savedData.versesRead);
        // Versos lidos é saldo salvo, senão é 0
        versesRead =
            Number.isFinite(savedBalance) && savedBalance >= 0
                ? savedBalance
                : 0;

        updateVersesReadBalance();
        populateBookSelect();
        populateChapterSelect();

        // Valores do select
        bookSelect.value = currentBook;
        chapterSelect.value = String(currentChapter);

        await loadChapter(currentVerse);
        console.info("[Blocker] Estado restaurado:", {
            book: currentBook,
            chapter: currentChapter,
            verse: currentVerse,
            versesRead
        });
    } catch (error) {
        console.error("[Blocker] Erro ao inicializar o leitor:", error);
        timerMessage.textContent = "Não foi possível iniciar o leitor.";
    }
}

function populateBookSelect() {
    bookSelect.innerHTML = "";

    books.forEach(book => {
        const option = document.createElement("option");
        option.value = book.id;
        option.textContent = book.name;
        bookSelect.appendChild(option);
    });
}

function populateChapterSelect() {
    const selectedBook = books.find(book => book.id === currentBook);

    if (!selectedBook) {
        throw new Error(`Livro não encontrado: ${currentBook}`);
    }

    chapterSelect.innerHTML = "";

    for (let chapter = 1; chapter <= selectedBook.numberOfChapters; chapter++) {
        const option = document.createElement("option");
        option.value = String(chapter);
        option.textContent = String(chapter);
        chapterSelect.appendChild(option);
    }
}

// Carrega o capitulo da API a partir do livro, capitulo e verso atuais, senão começa no versiculo 1
async function loadChapter(verseToShow = 1) {
    try {
        timerMessage.textContent = "Carregando capítulo...";
        nextVerseButton.hidden = true;
        clearInterval(timerInterval);

        const response = await fetch(
            `https://bible.helloao.org/api/por_blj/${currentBook}/${currentChapter}.json`
        );

        if (!response.ok) {
            throw new Error(
                `Não foi possível carregar ${currentBook} ${currentChapter}.`
            );
        }

        const data = await response.json();
        chapterData = data;

        const availableVerses = data.chapter.content.filter(
            item => item.type === "verse"
        );

        if (availableVerses.length === 0) {
            throw new Error("O capítulo não possui versículos disponíveis.");
        }

        const requestedVerseExists = availableVerses.some(
            verse => verse.number === verseToShow
        );

        // Evita restaurar uma referência de versículo que não existe.
        currentVerse = requestedVerseExists
            ? verseToShow
            : availableVerses[0].number;

        console.info(
            "[Blocker] Capítulo carregado:",
            `${currentBook} ${currentChapter}`,
            "| Versículos:",
            availableVerses.length
        );

        showVerse();
        await persistCurrentReading();
        startTimer();
    } catch (error) {
        console.error("[Blocker] Erro ao carregar capítulo:", error);
        timerMessage.textContent = "Erro ao carregar o capítulo.";
    }
}

async function persistCurrentReading() {
    try {
        await updateCurrentReading(currentBook, currentChapter, currentVerse);
    } catch (error) {
        console.error("[Blocker] Erro ao salvar a posição de leitura:", error);
    }
}

function updateVersesReadBalance() {
    versesReadBalance.textContent = String(versesRead);
}

function updateTimerDisplay() {
    const elapsedPercentage =
        ((TIMER_DURATION - secondsRemaining) / TIMER_DURATION) * 100;

    timerProgress.style.width = `${elapsedPercentage}%`;
    timerCount.textContent = `${secondsRemaining} segundo(s)`;
    timerTrack.setAttribute(
        "aria-valuenow",
        String(TIMER_DURATION - secondsRemaining)
    );
}

let secondsRemaining = TIMER_DURATION;

function startTimer() {
    clearInterval(timerInterval);

    secondsRemaining = TIMER_DURATION;
    nextVerseButton.hidden = true;
    nextVerseButton.disabled = false;
    timerMessage.textContent = "Aguarde para avançar o versículo";
    updateTimerDisplay();

    timerInterval = setInterval(() => {
        secondsRemaining--;
        updateTimerDisplay();

        if (secondsRemaining <= 0) {
            clearInterval(timerInterval);

            console.info(
                "[Blocker] Temporizador concluído:",
                `${currentBook} ${currentChapter}:${currentVerse}`
            );

            timerMessage.textContent = "Tempo de leitura concluído";
            timerCount.textContent = "Você já pode avançar.";
            nextVerseButton.hidden = false;
        }
    }, 1000);
}

function showVerse() {
    const bookName = chapterData.book.name;
    const chapterNumber = chapterData.chapter.number;

    const verse = chapterData.chapter.content.find(
        item => item.type === "verse" && item.number === currentVerse
    );

    if (!verse) {
        console.error("[Blocker] Versículo não encontrado:", currentVerse);
        timerMessage.textContent = "Não foi possível encontrar este versículo.";
        return;
    }

    console.info(
        "[Blocker] Exibindo versículo:",
        `${bookName} ${chapterNumber}:${verse.number}`
    );

    chapterLabel.textContent = `${bookName} ${chapterNumber}`;

    // Filtro de objetos indesejados
    // A API pode retornar partes do conteúdo como objetos (notas).
    const verseContent = verse.content
        .filter(part => typeof part === "string")
        .join("");

    verseText.textContent = "";
    const numberElement = document.createElement("sup");
    numberElement.textContent = String(verse.number);
    verseText.append(numberElement, document.createTextNode(` ${verseContent}`));

    verseReference.textContent =
        `${bookName} ${chapterNumber}:${verse.number}`;
}

// Mudança manual de livro: começa pelo capítulo e versículo 1.
bookSelect.addEventListener("change", async () => {
    currentBook = bookSelect.value;
    currentChapter = 1;
    currentVerse = 1;

    try {
        populateChapterSelect();
        chapterSelect.value = "1";
        console.info("[Blocker] Livro selecionado:", currentBook);
        await loadChapter(1);
    } catch (error) {
        console.error("[Blocker] Erro ao trocar de livro:", error);
        timerMessage.textContent = "Não foi possível trocar de livro.";
    }
});

// Mudança manual de capítulo: começa pelo primeiro versículo.
chapterSelect.addEventListener("change", async () => {
    const selectedChapter = Number(chapterSelect.value);

    if (!Number.isInteger(selectedChapter) || selectedChapter < 1) {
        console.error("[Blocker] Número de capítulo inválido:", chapterSelect.value);
        return;
    }

    currentChapter = selectedChapter;
    currentVerse = 1;

    console.info("[Blocker] Capítulo selecionado:", currentBook, currentChapter);
    await loadChapter(1);
});

// O clique só contabiliza depois que o temporizador terminou.
// O botão é desativado durante o salvamento para evitar cliques duplicados.
nextVerseButton.addEventListener("click", async () => {
    if (!chapterData || nextVerseButton.hidden || nextVerseButton.disabled) {
        return;
    }

    nextVerseButton.disabled = true;

    try {
        versesRead = await addVersesRead(1);
        updateVersesReadBalance();

        console.info(
            "[Blocker] Versículo contabilizado:",
            `${currentBook} ${currentChapter}:${currentVerse}`,
            "| Saldo:",
            versesRead
        );
    } catch (error) {
        console.error("[Blocker] Erro ao salvar o saldo de versículos:", error);
        timerMessage.textContent = "Não foi possível salvar o versículo. Tente novamente.";
        nextVerseButton.disabled = false;
        return;
    }

    const nextVerse = chapterData.chapter.content.find(
        item => item.type === "verse" && item.number > currentVerse
    );

    if (nextVerse) {
        currentVerse = nextVerse.number;
        showVerse();
        await persistCurrentReading();
        startTimer();
        return;
    }

    const selectedBook = books.find(book => book.id === currentBook);

    if (currentChapter < selectedBook.numberOfChapters) {
        currentChapter++;
        currentVerse = 1;
        chapterSelect.value = String(currentChapter);
        await loadChapter(1);
        return;
    }

    const bookIndex = books.findIndex(book => book.id === currentBook);
    const nextBook = books[bookIndex + 1];

    if (nextBook) {
        currentBook = nextBook.id;
        currentChapter = 1;
        currentVerse = 1;
        bookSelect.value = currentBook;
        populateChapterSelect();
        chapterSelect.value = "1";
        await loadChapter(1);
        return;
    }

    console.info("[Blocker] Fim da Bíblia alcançado.");
    clearInterval(timerInterval);
    timerMessage.textContent = "Você chegou ao final da Bíblia!";
    timerCount.textContent = "";
    nextVerseButton.hidden = true;
});

// Inicia o leitor somente depois de registrar os eventos.
initializeReader();
