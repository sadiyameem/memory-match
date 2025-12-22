// variables and sounds
    const flipSound = new Audio('flip.mp3');
    const winSound = new Audio('winning.mp3');

    let time = 0;
    let timerInterval;
    let timerStarted = false;

function startGame(level) {
    let moves = 0;
    document.querySelector('.moves').textContent = "Moves: 0";

    // reset and start timer
    timerStarted = false;
    clearInterval(timerInterval);
    time = 0;
    document.querySelector('.timer').textContent = "Time: 0s";

    const game= document.querySelector('.game');
    game.innerHTML = '';

    // emojis list    
    let emojis;
        if(level === 'easy') emojis = ["🍪","🍪","🍰","🍰","🥧","🥧","🧁","🧁"];
        else if(level === 'medium') emojis = ["🥩","🥩","🍳","🍳","🍲","🍲","🍅","🍅","🥕","🥕","☕","☕"];
        else if(level === 'hard') emojis = ["🍫","🍫","🦈","🦈","🦝","🦝","🦕","🦕","⭐","⭐","🌶️","🌶️","🧋","🧋","🥖","🥖"];

        // shuffle function
        function shuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];  //swap
            }
            return array;
        }

        // shuffle the emojis
        let shuf_emojis = shuffle(emojis);

        // create cards
        for (let i = 0; i < shuf_emojis.length; i++) {
            let box = document.createElement('div');
            box.className = 'item';
            box.innerHTML = shuf_emojis[i];

                        // start timer on first click
            box.onclick = function(){
            if (!timerStarted) {
                timerStarted = true;
                timerInterval = setInterval(() => {
                    time++;
                    document.querySelector('.timer').textContent = "Time: " + time + "s";
                }, 1000);
            }

            // move counter
            moves++;
            document.querySelector('.moves').textContent = "Moves: " + moves;

            // play flip sound
            flipSound.play();
            // flip card
            this.classList.add('boxOpen')
            
            // store reference to the clicked card
            let clickCard = this;

            // wait before checking match
            setTimeout(function(){

                // check is more than one card is open
                if(document.querySelectorAll('.boxOpen').length > 1){

                    // if the two open cards are matched
                    if(document.querySelectorAll('.boxOpen')[0].innerHTML == document.querySelectorAll('.boxOpen')[1].innerHTML){

                        // mark cards as matched
                        document.querySelectorAll('.boxOpen')[0].classList.add('boxMatch')
                        document.querySelectorAll('.boxOpen')[1].classList.add('boxMatch')

                        // close cards as matched
                        document.querySelectorAll('.boxOpen')[1].classList.remove('boxOpen')
                        document.querySelectorAll('.boxOpen')[0].classList.remove('boxOpen')

                        // check if all cards are matched
                        if (document.querySelectorAll('.boxMatch').length === emojis.length) {
                            clearInterval(timerInterval); // stop timer on win
                            winSound.play(); // play winning sound
                            alert('You Win!')
                        }
      
                    } else {
                        // if cards do not match, flip them back
                        document.querySelectorAll('.boxOpen')[1].classList.remove('boxOpen')
                        document.querySelectorAll('.boxOpen')[0].classList.remove('boxOpen')
                    }
                }
            },500);
        }
        }


        // add cards to the game board
        game.appendChild(box);
    }