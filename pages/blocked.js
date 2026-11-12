let currentBook
let currentChapter
let currentVerse
let chapterData
let books = []

const bookSelect = document.querySelector("#book-select")
const chapterSelect = document.querySelector("#chapter-select")

fetch("https://bible.helloao.org/api/por_blj/books.json")
    .then(request => {
        if (!request.ok) {
            throw new Error("Não foi possível carregar a lista de livros.")
        }
        return request.json()
    })
    .then(data => {
        books = data.books
        console.info("[Blocker] Lista de livros carregada:", books.length)

        currentBook = "GEN"
        currentChapter = 1
        currentVerse = 1

        bookSelect.innerHTML = ""

        books.forEach(book => {
            const bookOption = document.createElement("option")
            bookOption.value = book.id
            bookOption.textContent = book.name
            bookSelect.appendChild(bookOption)
        })

        // Quando o livro muda, recria as opções de capítulo.
        bookSelect.addEventListener("change", () => {
            currentBook = bookSelect.value
            const selectedBook = books.find(book => book.id === currentBook)
            console.info("[Blocker] Livro selecionado:", selectedBook?.name, `(${currentBook})`)
            chapterSelect.innerHTML = ""

            if (!selectedBook) {
                console.error("[Blocker] Livro não encontrado:", currentBook)
                return
            }

            for (let i = 1; i <= selectedBook.numberOfChapters; i++) {
                const chapterOption = document.createElement("option")
                chapterOption.value = String(i)
                chapterOption.textContent = String(i)
                chapterSelect.appendChild(chapterOption)
            }

            // Ao trocar de livro, começa pelo capítulo 1.
            currentChapter = 1
            currentVerse = 1
            chapterSelect.value = "1"
            chapterSelect.dispatchEvent(new Event("change"))
        })

        // Quando o capítulo muda, busca seu conteúdo na API.
        chapterSelect.addEventListener("change", () => {
            currentChapter = Number(chapterSelect.value)
            currentVerse = 1
            console.info("[Blocker] Carregando capítulo:", `${currentBook} ${currentChapter}`)

            fetch(`https://bible.helloao.org/api/por_blj/${currentBook}/${currentChapter}.json`)
                .then(request => {
                    if (!request.ok) {
                        throw new Error("Não foi possível carregar este capítulo.")
                    }
                    return request.json()
                })
                .then(data => {
                    chapterData = data
                    console.info("[Blocker] Capítulo carregado. Versículos disponíveis:", data.chapter.content.filter(item => item.type === "verse").length)
                    showVerse(chapterData)
                    startTimer()
                })
                .catch(error => {
                    console.error(error)
                    timerMessage.textContent = "Erro ao carregar o capítulo."
                })
        })

        // Define o livro inicial e dispara o carregamento inicial.
        bookSelect.value = currentBook
        bookSelect.dispatchEvent(new Event("change"))
    })
    .catch(error => {
        console.error(error)
        timerMessage.textContent = "Erro ao carregar a lista de livros."
    })

const TIMER_DURATION = 3

const chapterLabel = document.querySelector("#chapter-label")
const verseText = document.querySelector("#verse-text")
const verseReference = document.querySelector("#verse-reference")
const timerProgress = document.querySelector("#timer-progress")
const timerTrack = document.querySelector("#timer-track")
const timerCount = document.querySelector("#timer-count")
const timerMessage = document.querySelector("#timer-message")
const nextVerseButton = document.querySelector("#next-verse-button")

let secondsRemaining = TIMER_DURATION
let timerInterval

function updateTimerDisplay() {
    const elapsedPercentage =
        ((TIMER_DURATION - secondsRemaining) / TIMER_DURATION) * 100

    timerProgress.style.width = `${elapsedPercentage}%`
    timerCount.textContent = `${secondsRemaining} segundo(s)`
    timerTrack.setAttribute("aria-valuenow", TIMER_DURATION - secondsRemaining)
}

function startTimer() {
    clearInterval(timerInterval)

    secondsRemaining = TIMER_DURATION
    nextVerseButton.hidden = true
    timerMessage.textContent = "Aguarde para avançar o versículo"
    updateTimerDisplay()

    timerInterval = setInterval(() => {
        secondsRemaining--
        updateTimerDisplay()

        if (secondsRemaining <= 0) {
            clearInterval(timerInterval)
            console.info("[Blocker] Temporizador concluído para:", `${currentBook} ${currentChapter}:${currentVerse}`)
            timerMessage.textContent = "Tempo de leitura concluído"
            timerCount.textContent = "Você já pode avançar."
            nextVerseButton.hidden = false
        }
    }, 1000)
}

function showVerse(data) {
    const book = data.book.name
    const chapterNumber = data.chapter.number

    const verse = data.chapter.content.find(item =>
        item.type === "verse" && item.number === currentVerse
    )

    if (!verse) {
        console.error("Versículo não encontrado:", currentVerse)
        return
    }

    console.info("[Blocker] Exibindo versículo:", `${book} ${chapterNumber}:${verse.number}`)
    chapterLabel.textContent = `${book} ${chapterNumber}`
    verseText.innerHTML = `<sup>${verse.number}</sup> ${verse.content}`
    verseReference.textContent = `${book} ${chapterNumber}:${verse.number}`
}

nextVerseButton.addEventListener("click", () => {
    if (!chapterData) return

    const nextVerse = chapterData.chapter.content.find(item =>
        item.type === "verse" && item.number > currentVerse
    )

    if (nextVerse) {
        currentVerse = nextVerse.number
        console.info("[Blocker] Avançando para o próximo versículo:", `${currentBook} ${currentChapter}:${currentVerse}`)
        showVerse(chapterData)
        startTimer()
        return
    }

    // Não há mais versículos: verifica se existe outro capítulo.
    const selectedBook = books.find(book => book.id === currentBook)

    if (currentChapter < selectedBook.numberOfChapters) {
        currentChapter++
        console.info("[Blocker] Fim do capítulo. Avançando para:", `${currentBook} ${currentChapter}`)
        chapterSelect.value = String(currentChapter)
        chapterSelect.dispatchEvent(new Event("change"))
        return
    }

    // O capítulo acabou: tenta avançar para o próximo livro.
    const bookIndex = books.findIndex(book => book.id === currentBook)
    const nextBook = books[bookIndex + 1]

    if (nextBook) {
        currentBook = nextBook.id
        console.info("[Blocker] Fim do livro. Avançando para o próximo livro:", nextBook.name, `(${nextBook.id})`)
        bookSelect.value = currentBook
        bookSelect.dispatchEvent(new Event("change"))
        return
    }

    // Não há próximo livro: a leitura chegou ao fim da Bíblia.
    console.info("[Blocker] Fim da Bíblia alcançado.")
    clearInterval(timerInterval)
    timerMessage.textContent = "Você chegou ao final da Bíblia!"
    timerCount.textContent = ""
    nextVerseButton.hidden = true
})
