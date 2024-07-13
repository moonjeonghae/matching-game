window.onload = function() {
    const stage = document.getElementById('stage');
    const cards = Array.from(stage.children);  // 카드는 stage 자식 요소에 있음

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

    // 1. 카드 랜덤으로 배치하기
    // 1) 카드 섞기
    function shuffle(array) {
        for(let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));  // 0과 i의 값 사이의 랜덤 소수값 생성 => floor로 내림해서 정수만 남김
            [array[i], array[j]] = [array[j], array[i]];  // 배열 내의 두 요소의 위치를 서로 바꿈
        }
        return array;
    }
    shuffle(cards);

    // 2) 섞인 카드를 stage에 추가하고 이미지 경로 설정
    cards.forEach(card => {
        stage.appendChild(card);  // stage에 각 card 추가

        const imgIdx = parseInt(card.getAttribute('data-index'));  // data-index에서 숫자만 뽑아옴
        const img = card.querySelector('img');
        img.src = imagePaths[imgIdx];
    });
}