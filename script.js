const box = document.querySelectorAll(".box");

const playImg = document.querySelector(".image");
const btn = document.querySelector(".reset");
const plyrX = document.querySelector("#playerX");
const plyrO = document.querySelector("#playerO");
const tie = document.querySelector("#tie");
const plrComp = document.querySelector(".altComp");

const huPlayer = 'X';
const aiPlayer = 'O';
let isBox =
    [0, 1, 2,
        3, 4, 5,
        6, 7, 8];

const winCombos =
    [[0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]]

let isComp = true;
let XorO = true;
let hold = false;

const boxInnerText = () => {
    for ([index, boxNum] of isBox.entries()) {
        if (typeof boxNum === 'number') {
            box[index].innerText = "";
        }
        else if (boxNum === 'X') {
            box[index].innerText = "X";
        }
        else {
            box[index].innerText = "O";
        }
    }
}

const checkWinner = (Box) => {
    for (let winComb of winCombos) {
        if ((Box[winComb[0]] === Box[winComb[1]]) && (Box[winComb[1]] === Box[winComb[2]])) {
            if (Box[winComb[0]] === 'X') {
                    plyrX.innerText = `${1 + parseInt(plyrX.innerText)}`;
                    gameOver(winComb[0], winComb[1], winComb[2]);
                return -1;
            }
            else if (Box[winComb[0]] === 'O') {
                    plyrO.innerText = `${1 + parseInt(plyrO.innerText)}`;
                    gameOver(winComb[0], winComb[1], winComb[2]);
                return 1;
            }
        }
    }
    if (emptySquares().length === 0) {
            tie.innerText = `${1 + parseInt(tie.innerText)}`;
            gameOver(null, null, null);
        return 0;
    }
    return null;
}

const holdColor = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, 1000);
    })
}

const gameOver = async (a, b, c) => {
    for (boxtext of box) {
        boxtext.style.color = 'rgba(255,255,255,0.5)';
    }
    if (a !== null) {
        box[a].style.color = box[b].style.color = box[c].style.color = 'white';
    }
    hold = true;
    XorO = true;
    await holdColor()
    isBox =
        [0, 1, 2,
            3, 4, 5,
            6, 7, 8]
    boxInnerText();
    for (boxtext of box) {
        boxtext.style.color = 'rgba(255,255,255,1.0)';
    }
}

const imgReset = () => {
    isBox =
        [0, 1, 2,
            3, 4, 5,
            6, 7, 8]
    plyrO.innerText = "0";
    plyrX.innerText = '0';
    tie.innerText = '0';
    boxInnerText();
}

const reset = () => {
    isBox =
        [0, 1, 2,
            3, 4, 5,
            6, 7, 8]
    playImg.src = "icons8-person-64.png";
    plyrO.innerText = "0";
    plyrX.innerText = '0';
    tie.innerText = '0';
    isComp = true;
    XorO = true;
    boxInnerText();
}

const imgChange = () => {
    if (isComp === true) {
        playImg.src = "icons8-person-66.png";
        plrComp.innerText = "Player2"
    }
    else {
        playImg.src = "icons8-person-64.png"
        plrComp.innerText = "Computer"
    }
    XorO = true;
    isComp = !isComp;
    imgReset();
}

const boxSignChange = (num) => {
    if (typeof isBox[num] === 'number') {
        if (XorO === true) {
            isBox[num] = 'X';
        }
        else {
            isBox[num] = 'O';
        }
        XorO = !XorO;
        boxInnerText();
        checkWinner(isBox);
    }
}

function checkWin(board, player) {
    let plays = board.reduce((a, e, i) =>
        (e === player) ? a.concat(i) : a, []);
    let gameWon = null;
    for (let [index, win] of winCombos.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            gameWon = { index: index, player: player };
            break;
        }
    }
    return gameWon;
}

btn.addEventListener('click', reset);

playImg.addEventListener("click", imgChange);

for (const [index, boxNum] of box.entries()) {
    boxNum.addEventListener("click", () => {
        if (isComp) {
            if (typeof isBox[index] === 'number') {
                boxSignChange(index);
                if (emptySquares().length > 0 && !XorO) {
                    boxSignChange(minimax(isBox, aiPlayer).index);
                }
            }
        }
        else {
            boxSignChange(index);
        }
    });
}

function emptySquares() {
    return isBox.filter(s => typeof s == 'number');
}

function checkWin(board, player) {
	let plays = board.reduce((a, e, i) =>
		(e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of winCombos.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}

function minimax(newBoard, player) {
    let availSpots = emptySquares();
    if (checkWin(newBoard, huPlayer)) {
        return { score: -10 };
    } else if (checkWin(newBoard, aiPlayer)) {
        return { score: 10 };
    } else if (availSpots.length === 0) {
        return { score: 0 };
    }
    let moves = [];
    for (let i = 0; i < availSpots.length; i++) {
        let move = {};
        move.index = newBoard[availSpots[i]];
        newBoard[availSpots[i]] = player;

        if (player == aiPlayer) {
            let result = minimax(newBoard, huPlayer);
            move.score = result.score;
        } else {
            let result = minimax(newBoard, aiPlayer);
            move.score = result.score;
        }

        newBoard[availSpots[i]] = move.index;

        moves.push(move);
    }

    let bestMove;
    if (player === aiPlayer) {
        let bestScore = -10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = 10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    return moves[bestMove];
}