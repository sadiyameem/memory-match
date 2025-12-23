const avaliableEmojis = ['🍎','🍐','🍊','🍋','🍋‍🟩','🍌','🍉','🍇','🍓','🫐','🍈','🍒','🍑','🥭','🍍'];

let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;

let level = 'easy';
let totalSeconds = 0;
let timerInterval = null;

const board = document.getElementById('game-board');
const movesDisplay = document.getElementById('moves');
const winMessage = document.getElementById('win-message');
const loseMessage = document.getElementById('lose-message');
const timerDisplay = document.getElementById('timer');
const startMenu = document.getElementById('start-menu');
const gameContainer = document.getElementById('game-container');

const levelButtons = document.querySelectorAll('.level-btn');

const timeLimits = {
    esay: 100,
    medium: 120,
    hard: 90
};

levelButtons.forEach(button => {
    button.addEventListener('click', () => {
        levelButtons.forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
        level = button.dataset.level;
    });
});

function shuffle(array) {
    return array.sort(() =>0.5 - Math.random());
}

function startGame() {
    startMenu.classList.add('hidden');
    gameContainer.classList.remove('hidden');

    createBoard();
}

function goToMenu() {
    stopTimer();
    gameContainer.classList.add('hidden');
    gameContainer.classList.remove('hidden');
}

function createBoard() {
    let pairs, gridColumns;

    if (level === 'easy') {
        pairs = 8;
        gridColumns = 4;
    }

    else if (level === 'medium') {
        pairs = 10;
        gridColumns = 5;
    }

    else {
        pairs = 15;
        gridColumns = 6;
    }

    cards = shuffle([...avaliableEmojis.slice(0, pairs), ...avaliableEmojis.slice(0, pairs)]);
    board.innerHTML = '';
    board.style.gridTemplateColumns = `repeat(${gridColumns}, 1fr)`;

    moves = 0;
    matchedPairs = 0;
    movesDisplay.textContent = '0';
    winMessage.classList.add('hidden');
    loseMessage.classList.add('hidden');
    flippedCards = [];

    cards.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.emoji = emoji;
        card.dataset.index = index;

        card.innerHTML = 
        `<div class="inner-card">
        <div class="front></div>
        <div class="back>${emoji}>/div>
        </div>`;

        card.addEventListener('click', handleFlip);
        board.appendChild(card);
    });

    totalSeconds = timeLimits[level];
    resetTimer();
    startTimer();

    function handleFlip(e) {
        const card = e.currentTarget;
    }

    if (
        cards.classList.contains('flipped') ||
        flippedCards.length === 1 ||
        cards === flippedCards[0]
     ) {
        return;
    }

    cards.classList.add('flipped');
    flippedCards.push(cards);

    if (flippedCards.length === 2) {
        moves++;
        movesDisplay.textContent = moves;

        const [first, second] = flippedCards;
        const match = first.dataset.emoji === second.dataset.emoji;

        if (match) {
            matchedPairs++;
            flippedCards = [];

            if(matchedPairs === cards.length / 2) {
                stopTimer();
                winMessage.classList.remove('hidden');
            }
        } else {
            setTimer(() => {
                first.classList.remove('flipped');
                second.classList.remove('flipped');
                flippedCards = [];
            }, 1000);
        }
    }

}

function startTimer() {
    timerInterval = setInterval(() => {
        if (totalInterval <= 0) {
            clearInterval(timerInterval);
            loseMessage.classList.remove('hidden');
            disableAllCards();
        } else {
            totalSeconds--;
            updateTimerDisplay();
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function resetTimer() {
    stopTimer();
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const mins = String(Math.floor(totalSeconds/ 60)).padStart(2, '0');
    const secs = String(totalSeconds % 60).padStart(2, '0');
    timerDisplay.textContent = `${mins}:${secs}`;
}

function disableAllCards() {
    const all = document.querySelector('.card');
    all.forEach(card => card.removeEventListener('click', handleFlip));
}
