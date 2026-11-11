fetch(`https://bible.helloao.org/api/por_blj/books.json`)
    .then(request => request.json())
    .then(data => {
        const bookSelect = document.querySelector("#book-select")
        const chapterSelect = document.querySelector("#chapter-select")

        bookSelect.innerHTML = ``

        data.books.forEach(book => { 
            let bookOption = document.createElement('option')
            bookOption.value = `${book.id}`
            bookOption.innerText = `${book.name}`
            bookOption.className = `${book.id}`
            bookOption.selected = false
            bookSelect.appendChild(bookOption)
        });

        bookSelect.addEventListener("change", () => {
            chapterSelect.innerHTML = ``
            
            bookId = bookSelect.value;
            const selectedBook = data.books.find(
                book => book.id === bookId
            );
            console.log(selectedBook.numberOfChapters)
            for (i = 1; i <= selectedBook.numberOfChapters; i++) {
                let chapterOption = document.createElement('option')
                chapterOption.value = `${i}`
                chapterOption.innerText = `${i}`
                chapterOption.className = `${i}`
                chapterOption.selected = false
                chapterSelect.appendChild(chapterOption)
            }
        });
    });

const verses = [
    {
        chapter: "SALMOS 23",
        text: "O Senhor é o meu pastor; nada me faltará.",
        reference: "Salmos 23:1",
        number: 1
    },
    {
        chapter: "JOÃO 3",
        text: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito.",
        reference: "João 3:16",
        number: 16 
    }
];

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
let currentBook = "GEN";
let currentChapter = 1;

let currentBookOption = document.querySelector(`.${currentBook}]`)
let currentChapterOption = document.querySelector(`.${currentChapter}`)
currentBookOption.selected = true
currentChapterOption.selected = true

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
