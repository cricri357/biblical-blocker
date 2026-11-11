let currentBook = "GEN"
let currentChapter = 1

fetch(`https://bible.helloao.org/api/por_blj/books.json`) // pega os dados da api
    .then(request => request.json())
    .then(data => {
        const bookSelect = document.querySelector("#book-select") // pega o elemento select de livro
        const chapterSelect = document.querySelector("#chapter-select") // pega o elemento select do capitulo

        bookSelect.innerHTML = `` // zera o html do select

        data.books.forEach(book => { // para cada livro 
            let bookOption = document.createElement('option') // cria o elemento option
            bookOption.value = `${book.id}` // valor do elemento option
            bookOption.innerText = `${book.name}` // texto do elemento option com o nome do livro
            bookSelect.appendChild(bookOption) // instancia o elemento
        });

        bookSelect.addEventListener("change", () => { // ao mudar de seleção de livro
            chapterSelect.innerHTML = `` // zera o html do capitulo
            
            bookId = bookSelect.value; // pega o id do livro selecionado
            const selectedBook = data.books.find( // encontra o livro selecionado
                book => book.id === bookId
            );

            for (i = 1; i <= selectedBook.numberOfChapters; i++) { // loop para gerar as options dos capitulos do livro
                let chapterOption = document.createElement('option')
                chapterOption.value = `${i}`
                chapterOption.innerText = `${i}`
                chapterSelect.appendChild(chapterOption)
            }
        });

        bookSelect.value = currentBook; // livro atual que será carregado com a página
        bookSelect.dispatchEvent(new Event("change")); // chama o evento de criar os capitulos
        chapterSelect.value = currentChapter; // capitulo atual

        chapterSelect.addEventListener("change", () => {
            const bookId = bookSelect.value;
            const chapterNumber = chapterSelect.value;

            fetch(`https://bible.helloao.org/api/por_blj/${bookId}/${chapterNumber}.json`)
                .then(request => request.json())
                .then(data => {
                    
                });
        });

        chapterSelect.dispatchEvent(new Event("change"));
    });

const TIMER_DURATION = 5;

const chapterLabel = document.querySelector("#chapter-label");
const verseText = document.querySelector("#verse-text");
const verseReference = document.querySelector("#verse-reference");
const timerProgress = document.querySelector("#timer-progress");
const timerTrack = document.querySelector("#timer-track");
const timerCount = document.querySelector("#timer-count");
const timerMessage = document.querySelector("#timer-message");
const nextVerseButton = document.querySelector("#next-verse-button");

let currentVerseIndex = 0;
let secondsRemaining = TIMER_DURATION;
let timerInterval;

function updateTimerDisplay() {
    const elapsedPercentage =
        ((TIMER_DURATION - secondsRemaining) / TIMER_DURATION) * 100;

    timerProgress.style.width = `${elapsedPercentage}%`;
    timerCount.textContent = `${secondsRemaining} segundo(s)`;
    timerTrack.setAttribute("aria-valuenow", TIMER_DURATION - secondsRemaining);
}

function startTimer() {
    clearInterval(timerInterval);

    secondsRemaining = TIMER_DURATION;
    nextVerseButton.hidden = true;
    timerMessage.textContent = "Aguarde para avançar o versículo";
    updateTimerDisplay();

    timerInterval = setInterval(() => {
        secondsRemaining--;
        updateTimerDisplay();

        if (secondsRemaining <= 0) {
            clearInterval(timerInterval);
            timerMessage.textContent = "Tempo de leitura concluído";
            timerCount.textContent = "Você já pode avançar.";
            nextVerseButton.hidden = false;
        }
    }, 1000);
}

function showVerse(index) {
    const verse = verses[index];

    chapterLabel.textContent = verse.chapter;
    verseText.innerHTML = `<sup>${verse.number}</sup> ${verse.text}`;
    verseReference.textContent = verse.reference;
}

nextVerseButton.addEventListener("click", () => {
    currentVerseIndex = (currentVerseIndex + 1) % verses.length;
    showVerse(currentVerseIndex);
    startTimer();
});

startTimer();
