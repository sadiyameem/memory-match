const avaliableEmojis = ['🍎','🍐','🍊','🍋','🍋‍🟩','🍌','🍉','🍇','🍓','🫐','🍈','🍒','🍑','🥭','🍍'];

let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;

let level = 'easy';
let totalSeconds = 0;
let timerInterval = null;

// DOM Elements
const board = document.getElementById('game-board');
const movesDisplay = document.getElementById('moves');
const winMessage = document.getElementById('win-message');
const loseMessage = document.getElementById('lose-message');
const timerDisplay = document.getElementById('timer');
const startMenu = document.getElementById('start-menu');
const gameContainer = document.getElementById('game-container');
const levelButtons = document.querySelectorAll('.level-btn');

// level selection
const timeLimits = {
    easy: 100,
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

// shuffle array
function shuffle(array) {
    return array.sort(() =>0.5 - Math.random());
}

// update timer display
function updateTimerDisplay() {
    const mins = String(Math.floor(totalSeconds/ 60)).padStart(2, '0');
    const secs = String(totalSeconds % 60).padStart(2, '0');
    timerDisplay.textContent = `${mins}:${secs}`;
}

// stop timer
function stopTimer() {
    clearInterval(timerInterval);
}


// reset timer
function resetTimer() {
    stopTimer();
    updateTimerDisplay();
}

// disable all cards
function disableAllCards() {
    const all = document.querySelectorAll('.card');
    all.forEach(card => card.removeEventListener('click', handleFlip));
}

// handle card click
    function handleFlip(e) {
        const card = e.currentTarget;

            if (
        card.classList.contains('flipped') ||
        flippedCards.length === 1 ||
        card === flippedCards[0]
     ) {
        return;
    }

    card.classList.add('flipped');
    flippedCards.push(card);

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
            setTimeout(() => {
                first.classList.remove('flipped');
                second.classList.remove('flipped');
                flippedCards = [];
            }, 1000);
        }
    }

}

// create board
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

// duplicate and shuffle cards
cards = shuffle([...avaliableEmojis.slice(0, pairs), ...avaliableEmojis.slice(0, pairs)]);

// clear board and set grid
    board.innerHTML = '';
    board.style.gridTemplateColumns = `repeat(${gridColumns}, 1fr)`;

    // reset stats
    moves = 0;
    matchedPairs = 0;
    movesDisplay.textContent = '0';
    winMessage.classList.add('hidden');
    loseMessage.classList.add('hidden');
    flippedCards = [];

    // create card elements
    cards.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.emoji = emoji;
        card.dataset.index = index;

        card.innerHTML = `
        <div class="inner-card">
            <div class="front"></div>
            <div class="back">${emoji}</div>
        </div>
    `;
        card.addEventListener('click', handleFlip);
        board.appendChild(card);
    });

    // set timer
    totalSeconds = timeLimits[level];
    resetTimer();
    startTimer();
}

// timer
function startTimer() {
    timerInterval = setInterval(() => {
        if (totalSeconds <= 0) {
            clearInterval(timerInterval);
            loseMessage.classList.remove('hidden');
            disableAllCards();
        } else {
            totalSeconds--;
            updateTimerDisplay();
        }
    }, 1000);
} 

// start, restart and menu
function startGame() {
    startMenu.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    createBoard();
}

function restartGame() {
    stopTimer();
    createBoard();
}

function goToMenu() {
    stopTimer();
    gameContainer.classList.add('hidden');
    startMenu.classList.remove('hidden');
}


