function resetGame() {
  location.reload();
}


/// generate raw elements
let gen_button = document.querySelector(".generate-board-button")
gen_button.onclick = function(event) {
  let board_input = document.querySelector(".generate-board-input")
  let board_size = board_input.value;
  let board = document.querySelector(".board-table")

  // check if valid number input
  if (board_size >= 1) {

    // build TRs
    for (let i = 0; i < board_size; i++) {
      x = document.createElement('TR')
      x.setAttribute("class", "board-width")

      // build TDs
      for (let l = 0; l < board_size; l++) {
        y = document.createElement('TD')
        y.setAttribute("class", "board-piece")
        x.appendChild(y)
      }
      board.appendChild(x)
    }
    // hide generate section
    let generate_board_div = document.querySelector('.generate')
    generate_board_div.style.display = 'none'

    // show reset button
    let reset_button = document.querySelector(".reset-button")
    reset_button.style.display = 'block';
    reset_button.onclick = function(event) {
      resetGame();
    }

    // run game code    
    initializeGame();

  } else {
    alert("Please input a number")
  }
}

function initializeGame() {
  // game setup
  let turn = true
  let pieces = document.querySelectorAll(".board-piece")
  let players = ["1", "2"]


  let announcer = document.querySelector(".turn-text")
  announcer.style.display = 'block'

  // setting
  let board_size = document.querySelector('.board-width').children.length;

  setClickEvent();

  function setClickEvent() {
    // set event listeners to each box
    for (let i = 0; i < pieces.length; i++) {

      // any clicks will check if there is a winner
      pieces[i].onclick = function(event) {
        if (event.target.innerHTML.length == 0) {
          if (turn) {
            player = 0
            event.target.innerHTML = "O"
            turn = false
            document.querySelector(".turn").innerHTML = "2"
          } else {
            player = 1
            event.target.innerHTML = "X"
            turn = true
            document.querySelector(".turn").innerHTML = "1"
          }
        }
        checkBoard(player);
      }
    }
  }

  function removeClickEvent() {
    for (let i = 0; i < pieces.length; i++) {

      // any clicks will check if there is a winner
      pieces[i].onclick = function(event) {
        return false
      }
    }
  }

  function clearBoard() {
    let x = document.querySelectorAll(".board-piece")
    for (let i = 0; i < x.length; i++) {
      x[i].innerHTML = ""
    }
  }

  function winnerFound(winner) {
    removeClickEvent();
    let turn_text = document.querySelector(".turn-text")
    turn_text.innerHTML = "Player " + players[winner] + " is has won the round!"

    let replay_button = document.querySelector(".replay-button")
    replay_button.style.display = 'block';
    replay_button.onclick = function(event) {
      this.style.display = 'none';
      turn_text.innerHTML = "Player <span class=\"turn\">1</span>'s Turn"
      document.querySelector(".turn").innerHTML = "1"
      turn = true

      clearBoard();
      setClickEvent();
    }
  }

  function gameDraw() {
    let replay_button = document.querySelector(".replay-button")
    replay_button.style.display = 'block';

    let turn_text = document.querySelector(".turn-text")
    turn_text.innerHTML = "It is a draw!"

    replay_button.onclick = function(event) {
      this.style.display = 'none';
      turn_text.innerHTML = "Player <span class=\"turn\">1</span>'s Turn"
      turn = true

      clearBoard();
      setClickEvent();
    }
  }

  function checkBoard(player) {
    let x = document.querySelectorAll(".board-piece")
    let one_d_board = []

    // build a one dimensional array board
    for (let i = 0; i < x.length; i++) {
      one_d_board.push(x[i].innerHTML)
    }

    // build a two dimensional array board
    two_d_board = one_d_board.slice(0);
    two_d_board = chunkArray(two_d_board, board_size)

    // check for win scenarios
    if ((checkRows(two_d_board)) || checkColumns(two_d_board) || checkDiagonals(two_d_board)) {
      winnerFound(player)
    } else if (!one_d_board.includes("")) {
      gameDraw();
    } else {
      return false
    }
  }

  function checkRows(board) {
    for (let i = 0; i < board.length; i++) {
      if (board[i].includes("")) {

      } else {
        if (identical(board[i]) && board[i][1] !== "") {
          return true
        } else {
          return false
        }
      }
    }
  }

  // // check columns
  function checkColumns(board) {
    let column_board = transpose(board)
      // loop thru column array
    for (let i = 0; i < column_board.length; i++) {
      // skip rows with 
      if (column_board[i].includes("")) {

      } else {
        if (identical(column_board[i])) {
          return true
        } else {
          return false
        }
      }
    }
  }

  // // check diagonals
  function checkDiagonals(board) {

    // generate diagonals
    // generate left side down
    right_diag = []
    col = 0
    for (let row = 0; row < board.length; row++) {
      right_diag.push(board[row][col])
      col += 1
    }

    // generate right side down
    left_diag = []
    col = board[0].length - 1
    for (let row = 0; row < board.length; row++) {
      left_diag.push(board[row][col])
      col -= 1
    }

    // check if theres a winning match
    if ((identical(left_diag) && !left_diag.includes("")) || (identical(right_diag) && !right_diag.includes(""))) {
      return true
    } else {
      return false
    }
  }

  function identical(array) {
    for (let i = 0; i < array.length - 1; i++) {
      // loop and check if theres a non-match
      if (array[i] !== array[i + 1]) {
        return false;
      }
    }
    return true;
  }

  function chunkArray(myArray, chunk_size) {
    var results = [];
    while (myArray.length) {
      results.push(myArray.splice(0, chunk_size));
    }
    return results;
  }

  function transpose(a) {
    return Object.keys(a[0]).map(function(c) {
      return a.map(function(r) {
        return r[c];
      });
    });
  }
}