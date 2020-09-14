const X_CLASS = 'x';
const CIRCLE_CLASS = 'circle';
const MAX_TURNS = 9;

// Para cada celda, las comprobaciones a realizar para determinar si ha ganado alguien o no
const WIN_COMBS = [
    [ [ 1, 2 ], [ 3, 6 ], [ 4, 8 ] ], //Ej. la celda 0 gana si coincide con: 1 y 2, 3 y 6 o 4 y 8
    [ [ 4, 7 ] ],
    [ [ 5, 8 ], [4, 6] ],
    [ [ 4, 5 ] ],
    [], // No es necesario comprobar ya que ya se comprobará con otras celdas
    [],
    [ [ 7, 8 ], [ 2, 4 ] ],
    [],
    []
];

const cellEls = document.querySelectorAll( '[data-cell]' );
const boardEl = document.querySelector( '#board' );
const winningMessageEl = document.querySelector( '#winningMessage' );
const winningMessageTextEl = document.querySelector( '[data-winning-message-text]' );
const restartButtonEl = document.querySelector( '#restartButton' );
const turnoMessageEL = document.querySelector('[data-turno-message]');
let circleTurn;
let numTurns;

startGame();

restartButtonEl.addEventListener( 'click', startGame );

function startGame(){
    circleTurn = false;
    turnoMessageEL.innerText = `Turno: X`;
    numTurns = 0;
    cellEls.forEach( cell => {
        cell.classList.remove(X_CLASS, CIRCLE_CLASS);
        cell.removeEventListener( 'click', handleClick );
        cell.addEventListener( 'click', handleClick, { once: true } );
    });
    setBoardHoverClass();
    winningMessageEl.classList.remove('show');
}

function handleClick( event ){
    const cell = event.target;
    const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
    placeMark( cell, currentClass );
    if( checkWinner() ){
        endGame(true);
    } else if( checkDraw() ){
        endGame(false);
    }
    swapTurns();
    setBoardHoverClass();
}

function placeMark( cell, currentClass ){
    cell.classList.add(currentClass);
}

function swapTurns(){
    circleTurn = !circleTurn;
    turnoMessageEL.innerText = `Turno: ${ circleTurn ? "O" : "X" }`;
}

function setBoardHoverClass(){
    boardEl.classList.remove(X_CLASS);
    boardEl.classList.remove(CIRCLE_CLASS);
    if( circleTurn ){
        boardEl.classList.add(CIRCLE_CLASS);
    } else{
        boardEl.classList.add(X_CLASS);
    }
}

function checkWinner(){
    // Check win
    let i = 0;
    for( const cellIdxsArr of WIN_COMBS ){
        const cell = cellEls[i++];
        const isCircle = checkIsCircle(cell);
        const isX = checkIsX(cell);
        for( const [ idx1, idx2 ] of cellIdxsArr ){
            let num = 0;
            if( ( isCircle && checkIsCircle(cellEls[idx1]) ) || ( isX && checkIsX(cellEls[idx1]) ) ){
                num++;
            }
            if( ( isCircle && checkIsCircle(cellEls[idx2]) ) || ( isX && checkIsX(cellEls[idx2]) ) ){
                num++;
            }
            if( num == 2 ){
                return true;
            }
        }
    }
    return false;
}

function checkDraw(){
    return [...cellEls].every( cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS);
    });
}

function checkIsCircle( cell ){
    return cell.classList.contains(CIRCLE_CLASS);
}

function checkIsX( cell ){
    return cell.classList.contains(X_CLASS);
}

function endGame( winner ){
    if( winner ){
        winningMessageTextEl.innerText = `${circleTurn ? "Gana O" : "Gana X"}`;
    } else{
        winningMessageTextEl.innerText = "Empate";
    }
    winningMessageEl.classList.add('show');
}