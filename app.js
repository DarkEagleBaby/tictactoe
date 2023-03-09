const squares = document.querySelectorAll('.square');
const currentPlayerElm = document.querySelector('.currentPlayer')
const resetBtn = document.querySelector('#reset')
const overlay = document.querySelector('.overlay');
const endOverlay = document.querySelector('.end-overlay');
const endText = document.querySelector('.end-text');
const playAgainBtn = document.querySelector('.play-again')


const circleSvg = `<svg width="100px" height="100px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#000000" stroke-width="2"/>
</svg>`;
const crossSvg = `<svg width="100px" height="100px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M19 5L4.99998 19M5.00001 5L19 19" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;


function player(sign){
    if(sign==='cross'){symbol = crossSvg}else if 
    (sign==='circle'){symbol = circleSvg} 
    function getSign(){
        return sign;
    } 
    return{getSign,symbol}
}
const P1 = player('cross');
const P2 = player('circle');

const gameBoard = ((player1,player2)=>{
    let playersTurn = P1;
    let gameOver = false;
    let boardIndex = 0;
    currentPlayerElm.innerHTML = `Current Player: ${playersTurn.symbol}`

    let board = 
    ['','','',
    '','','',
    '','',''];

    const winningcombos = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8], [6,4,2]
    ]

    const reset = function(){
        playersTurn = P1;
        gameOver = false;
        board =    ['','','',
        '','','',
        '','',''];
        squares.forEach((square)=>{
            square.innerHTML='';
            square.dataset.painted='false';
        })
        currentPlayerElm.innerHTML = `Current Player: ${playersTurn.symbol}`
    }
    const turn = (index) => {
        if(squares[index].dataset.painted === 'false' &&!gameOver){
        board[index] = playersTurn.getSign();
        updateDisplay(index);
        console.log(playersTurn.getSign())
        squares[index].dataset.painted = 'true';
        checkWin()
        playersTurn = playersTurn === P1 ? P2 : P1;
        currentPlayerElm.innerHTML = `Current Player: ${playersTurn.symbol}`
    }
        else if(!gameOver){
            squares[index].classList.add('notAllowed')
            setTimeout(()=>{squares[index].classList.remove('notAllowed')},500)
        }
      }

      const updateDisplay = (index)=>{
        squares[index].classList.remove('hovering');
        squares[index].innerHTML = playersTurn.symbol;
    }
      const checkWin = () => {
        // check if any of the winning combos are present on the board
        for (let i = 0; i < winningcombos.length; i++) {
          const [a, b, c] = winningcombos[i];
          if (board[a] !== '' && board[a] === board[b] && board[b] === board[c]) {
            console.log(`${playersTurn.getSign()} wins!`);
            gameOver = true;
            //calling gameoverscreen function
            endGameScreenWin();
          }
        }
        
        // check if all squares are full and no winner has been found
        if (board.every(square => square !== '') && !gameOver) {
          console.log('It\'s a tie!');
          gameOver = true;
          endGameScreenDraw();
        }
      }
    const getGameOver = ()=>{
        return gameOver;
      }

    const onHoverEnter = (index)=>{
        if(squares[index].dataset.painted==='false'&&!gameOver){
        squares[index].innerHTML = playersTurn.symbol;
        squares[index].classList.add('hovering');
    }
    }
    const onHoverExit = (index)=>{
        if(squares[index].dataset.painted==='false'){
            squares[index].innerHTML = ''
            squares[index].classList.remove('hovering');
        }
    }

    const endGameScreenWin = ()=>{
        endOverlay.classList.remove('hidden');
        endText.innerHTML = `${playersTurn.name} Wins!`;
    }

    const endGameScreenDraw = ()=>{
        endOverlay.classList.remove('hidden');
        endText.innerHTML = `It's a draw :( no one wins!`;
    }

    return{board,reset,turn,getGameOver,onHoverEnter,onHoverExit,playersTurn}
})()

squares.forEach((square)=>{
    square.addEventListener('click',()=>{
        gameBoard.turn(square.dataset.boardIndex);
    })
})



squares.forEach((square)=>{
    square.addEventListener('mouseenter',()=>{
        gameBoard.onHoverEnter(square.dataset.boardIndex);
    })
    square.addEventListener('mouseleave',()=>{
        gameBoard.onHoverExit(square.dataset.boardIndex);
    })
})


//visual logic and styling:
//event listeners for selecting option in initial screen:
// options to select symbol for each player
const p1CrossOpt = document.querySelector('[data-p1CrossOpt]');
const p1CircleOpt = document.querySelector('[data-p1CircleOpt]');
const p2CrossOpt = document.querySelector('[data-p2CrossOpt]');
const p2CircleOpt = document.querySelector('[data-p2CircleOpt]');

p1CrossOpt.addEventListener('click',()=>{
    p1CrossOpt.classList.add('option-selected')
    p1CrossOpt.dataset.selected='true';
    p1CircleOpt.classList.remove('option-selected')
    p1CircleOpt.dataset.selected='false';
    p2CircleOpt.classList.add('option-selected');
    p2CrossOpt.classList.remove('option-selected')

})

p1CircleOpt.addEventListener('click',()=>{
    p1CircleOpt.classList.add('option-selected')
    p1CircleOpt.dataset.selected='true';
    p1CrossOpt.classList.remove('option-selected')
    p1CrossOpt.dataset.selected='false';
    p2CrossOpt.classList.add('option-selected')
    p2CircleOpt.classList.remove('option-selected')
})


//handling the submission of player details:
const playButton = document.querySelector('#play');
const P1Name = document.querySelector('#P1Name');
const P2Name = document.querySelector('#P2Name');

playButton.addEventListener("click",(e)=>{
    e.preventDefault();
if(P1Name.value!=='' && P2Name.value!==''){
if(p1CrossOpt.dataset.selected==='true'){
    P1.name = P1Name.value;
    P2.name = P2Name.value;

}else if(p1CircleOpt.dataset.selected==='true'){
    P1.name = P2Name.value;
    P2.name = P1Name.value;


}else{return};
overlay.classList.add('hidden');
}
})

resetBtn.addEventListener('click',()=>{
    gameBoard.reset();
    overlay.classList.remove('hidden');
    //resetting overlay
    P1Name.value = '';
    P2Name.value = '';
    p1CircleOpt.classList.remove('option-selected');
    p1CrossOpt.classList.remove('option-selected');
    p2CircleOpt.classList.remove('option-selected');
    p2CrossOpt.classList.remove('option-selected');
})


//play again button - dont want to add event listener inside my module function
    
playAgainBtn.addEventListener('click',()=>{
    gameBoard.reset();
    endOverlay.classList.add('hidden');
})