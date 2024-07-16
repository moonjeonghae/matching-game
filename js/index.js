window.onload = function() {
    const stage = document.getElementById('stage');
    let cards = [];

    function createCards() {
        const cardTemplate = stage.querySelector('.card');
        stage.innerHTML = '';

        for (let i = 0; i < 18; i++) {
            const newCard = cardTemplate.cloneNode(true);
            newCard.setAttribute('data-index', i % 9);
            stage.appendChild(newCard);
        }
    }
    createCards();

    const imagePaths = [
        './images/insideout_1.png',
        './images/insideout_2.png',
        './images/insideout_3.png',
        './images/insideout_4.png',
        './images/insideout_5.png',
        './images/insideout_6.png',
        './images/insideout_7.png',
        './images/insideout_8.png',
        './images/insideout_9.png'
    ];

    const startBtn = document.getElementById('start-btn');

    startBtn.addEventListener('click', () => {
        cards = Array.from(stage.children);
        randomCards();
        
        setTimeout(() => {
            gameStart();
            timerActive(); 
        }, 1500);

        startBtn.disabled = true;
    });

    function randomCards() {
        function shuffle(array) {
            for(let i = array.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (i + 1));  
                [array[i], array[j]] = [array[j], array[i]];
            }
        }
        shuffle(cards);

        cards.forEach(card => {
            stage.appendChild(card);

            const imgIdx = parseInt(card.getAttribute('data-index'));
            const img = card.querySelector('.card-front > img');
            img.src = imagePaths[imgIdx];
        });

        setTimeout(() => {
            flippedCards();
        }, 50);
    }

    let gameStarted = false;
    
    function gameStart() {
        gameStarted = true;
        stage.classList.add('game-started');
        activeClickAnimation();
    }

    const $cards = document.querySelectorAll('.card');

    function flippedCards() {
        $cards.forEach(card => {
            card.classList.add('flipped');
    
            setTimeout(() => {
                card.classList.remove('flipped');
            }, 1500);
        });
    }

    const time = document.getElementById('time');
    let updateTime;
    let seconds = 60;

    function timerActive() {
        updateTime = setInterval( decreaseSeconds , 1000);
    }

    function decreaseSeconds() {
        if(seconds > 0) {
            seconds--;
            time.innerText = seconds + 's';
            time.style.color = 'black';
        }
        if(seconds <= 10) {
            time.style.color = 'red';
        }
        if (seconds === 0) {
            clearInterval(updateTime);
            checkGameEnd();
        }
    }


    const resetBtn = document.getElementById('reset-btn');

    resetBtn.addEventListener('click',() => reset());

    function reset() {
        resetTimer();
        resetCards();
        resetScore();
        startBtn.disabled = false;
    }

    function resetTimer() {
        time.innerText = '60s';

        if (updateTime) {
            clearInterval(updateTime);
        }
        updateTime = null;
        seconds =60;
    }

    function resetCards() {
        gameStarted = false;
        stage.classList.remove('game-started');
        $cards.forEach(card => card.classList.remove('flipped'));
    }


    function activeClickAnimation() {
        $cards.forEach(card => {
            card.addEventListener('click', cardClick);
        });
    }
    
    let scoreNum = 0;
    let $flippedCards = [];

    function cardClick(e) {
        if (!gameStarted) return;
    
        const clickedCard = e.target.closest('.card');

        if(!clickedCard || clickedCard.classList.contains('flipped') || $flippedCards.length >= 2) return;
        
        flipCard(clickedCard);
        $flippedCards.push(clickedCard);

        if($flippedCards.length === 2) {
            checkedMatch();
        }
    }
    
    function flipCard(card) {
        card.classList.toggle('flipped');
    }

    function checkedMatch() {
        const [card1, card2] = $flippedCards;
        const match = card1.querySelector('.card-front > img').src === card2.querySelector('.card-front > img').src;

        if(match) {
            resetFlippedCards();
            setTimeout(() => updateScore(), 500);
        } else {
            setTimeout(() => {
                flipCard(card1);
                flipCard(card2);
                resetFlippedCards();
            }, 1000)
        }
    }

    function resetFlippedCards() {
        $flippedCards = [];
    }

    const score = document.getElementById('score-number');
    function updateScore() {
        scoreNum += 1;
        score.innerText = scoreNum * 10;
        checkGameEnd();
    }

    function resetScore() {
        scoreNum = 0; 
        score.innerText = 0;
    }

    const modal = document.getElementById('finish-modal');
    const success = document.getElementById('success');
    const fail = document.getElementById('fail');
    let remainingTime = 60;

    function checkGameEnd() {
        if (scoreNum === 9 && seconds > 0) {
            clearInterval(updateTime);
            finalScoreCalc();
            showModal(success);
        } else if (scoreNum !== 9 && seconds === 0) {
            showModal(fail);
        }
    }

    function showModal(modalElement) {
        modal.style.display = 'flex';
        success.style.display = 'none';
        fail.style.display = 'none';
        modalElement.style.display = 'flex';
    }

    const finalScore = document.getElementById('final-score');

    function finalScoreCalc() {
        remainingTime = seconds;
        finalScore.innerText = remainingTime + 90;
    }

    const replayBtn = document.getElementById('replay');

    replayBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        time.style.color = 'black';
        reset();
    });
}