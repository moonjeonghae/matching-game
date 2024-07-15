window.onload = function() {
    const stage = document.getElementById('stage');
    let cards = [];

    // # 카드 생성 함수
    function createCards() {
        const cardTemplate = stage.querySelector('.card');
        stage.innerHTML = ''; // 기존 카드 템플릿 제거

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

    // 1. start 버튼 눌렀을 때 
    const startBtn = document.getElementById('start-btn');

    startBtn.addEventListener('click', () => {
        // 2-1) 카드 랜덤으로 배치하기
        cards = Array.from(stage.children);  // 카드는 stage 자식 요소에 있음
        randomCards();
        
        setTimeout(() => {
            gameStart();  // 2-2) 카드 클릭 가능
            timerActive();  // 2-3) timer 작동
        }, 1500);

        startBtn.disabled = true;
    });

    // # 카드 랜덤으로 배치하는 함수
    function randomCards() {
        // 1-1) 카드 섞기
        function shuffle(array) {
            for(let i = array.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (i + 1));  // 0과 i의 값 사이의 랜덤 소수값 생성 => floor로 내림해서 정수만 남김
                [array[i], array[j]] = [array[j], array[i]];  // 배열 내의 두 요소의 위치를 서로 바꿈
            }
        }
        shuffle(cards);

        // 1-2) 섞인 카드를 stage에 추가하고 이미지 경로 설정
        cards.forEach(card => {
            stage.appendChild(card);  // stage에 각 card 추가

            const imgIdx = parseInt(card.getAttribute('data-index'));  // data-index에서 숫자만 뽑아옴
            const img = card.querySelector('.card-front > img');
            img.src = imagePaths[imgIdx];
        });

        setTimeout(() => {
            flippedCards();  // card 애니메이션 적용되면서 보이게 하기
        }, 50);
    }

    // # 카드 선택 가능 함수
    let gameStarted = false;
    
    function gameStart() {
        gameStarted = true;
        stage.classList.add('game-started');
        activeClickAnimation();
    }

    // # 카드가 앞면으로 바뀌는 애니메이션 함수
    const $cards = document.querySelectorAll('.card');

    function flippedCards() {
        $cards.forEach(card => {
            card.classList.add('flipped');
    
            setTimeout(() => {
                card.classList.remove('flipped');
            }, 1500);
        });
    }

    // # timer 작동 함수
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


    // 2. reset 버튼 눌렀을 때
    const resetBtn = document.getElementById('reset-btn');

    resetBtn.addEventListener('click',() => reset());

    // # 초기화 함수
    function reset() {
        // 3-1) 타이머 초기화
        resetTimer();
        // 3-2) 카드 상태 초기화
        resetCards();
        // 3-3) 스코어 초기화
        resetScore();
        startBtn.disabled = false;
    }

    // # 타이머 초기화 함수
    function resetTimer() {
        time.innerText = '60s';

        if (updateTime) {
            clearInterval(updateTime);
        }
        updateTime = null;
        seconds =60;
    }

    // # 카드 상태 초기화 함수
    function resetCards() {
        gameStarted = false;
        stage.classList.remove('game-started');
        $cards.forEach(card => card.classList.remove('flipped'));
    }


    // 3. 카드 클릭 시 뒤집기 + 스코어 계산
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

        if(!clickedCard || clickedCard.classList.contains('flipped') || $flippedCards.length >= 2) return;  // 하나라도 해당되면 해당 함수 즉시 반영
        
        // 3-1) 클릭하면 카드 뒤집기
        flipCard(clickedCard);
        // 3-2) 클릭한 카드 flippedCards에 넣기
        $flippedCards.push(clickedCard);

        // 3-3) 클릭한 카드가 2개일 경우 그림의 일치/불일치 확인
        if($flippedCards.length === 2) {
            checkedMatch();
        }
    }
    
    // # 클릭시 카드 뒤집는 함수
    function flipCard(card) {
        card.classList.toggle('flipped');
    }

    // # 그림의 일치/불일치 확인 함수
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

    // # 스코어 계산 함수
    const score = document.getElementById('score-number');
    function updateScore() {
        scoreNum += 1;
        score.innerText = scoreNum * 10;
        checkGameEnd();
    }

    // # 스코어 초기화 함수
    function resetScore() {
        scoreNum = 0; 
        score.innerText = 0;
    }

    // 4. 스테이지 종료 => 결과 안내
    // 4-1) 모달 띄우기
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

    // 4-2) 성공 => 점수 계산하기
    const finalScore = document.getElementById('final-score');

    function finalScoreCalc() {
        remainingTime = seconds;
        finalScore.innerText = remainingTime + 90;
    }

    // 4-3) 다시하기 버튼 => 누르면 초기화 화면
    const replayBtn = document.getElementById('replay');

    replayBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        time.style.color = 'black';
        reset();
    });

}