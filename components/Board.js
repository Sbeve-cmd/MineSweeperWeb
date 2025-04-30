// components/Board.js
import React from 'react'
import Cell from './Cell'

// Board handles game logic and renders a grid of Cell components
function Board(props) {
  // Board state, update functions, and status flags
  var board = props.board
  var setBoard = props.setBoard
  var gameOver = props.gameOver
  var setGameOver = props.setGameOver
  var setWin = props.setWin

  // recursively reveal empty neighboring cells (flood fill algorithm)
  function floodFill(b, row, col) {
    // check boundaries before processing
    if (row < 0 || row >= b.length || col < 0 || col >= b[0].length) {
      return
    }
    var cell = b[row][col]
    // stop if already revealed or flagged
    if (cell.revealed || cell.flagged) {
      return
    }
    cell.revealed = true // reveal this cell
    // if no adjacent mines, continue flood fill on neighbors
    if (!cell.mine && cell.count === 0) {
      for (var dr = -1; dr <= 1; dr++) {
        for (var dc = -1; dc <= 1; dc++) {
          if (dr !== 0 || dc !== 0) {
            floodFill(b, row + dr, col + dc)
          }
        }
      }
    }
  }

  // handle left click on a cell
  function revealCell(row, col) {
    if (gameOver) {
      return // exit if game has already ended
    }
    // deep copy current board 
    var newB = []
    for (var i = 0; i < board.length; i++) {
      newB[i] = []
      for (var j = 0; j < board[i].length; j++) {
        var c = board[i][j]
        newB[i][j] = {
          mine: c.mine,
          count: c.count,
          revealed: c.revealed,
          flagged: c.flagged
        }
      }
    }
    var clicked = newB[row][col] // get the clicked cell
    if (clicked.revealed || clicked.flagged) {
      return // ignore if cell already revealed or flagged
    }
    if (clicked.mine) {
      // reveal all mines when a mine cell is clicked
      for (var r = 0; r < newB.length; r++) {
        for (var c = 0; c < newB[r].length; c++) {
          if (newB[r][c].mine) {
            newB[r][c].revealed = true
          }
        }
      }
      setBoard(newB) // update board with all mines shown
      setGameOver(true) // end the game
      return
    }
    // reveal clicked cell and its neighbors if empty
    floodFill(newB, row, col)
    setBoard(newB) // update board state

    // check win condition: ensure all non-mine cells are revealed
    var won = true
    for (var r = 0; r < newB.length; r++) {
      for (var c = 0; c < newB[r].length; c++) {
        var cell = newB[r][c]
        if (!cell.mine && !cell.revealed) {
          won = false
          break
        }
      }
      if (!won) break
    }
    if (won) {
      setWin(true) // set win state if condition met
    }
  }

  // handle right click to toggle flag on a cell
  function flagCell(e, row, col) {
    e.preventDefault() // prevent default context menu
    if (gameOver) {
      return // do nothing if game has ended
    }
    // deep copy board for safe state update
    var newB = []
    for (var i = 0; i < board.length; i++) {
      newB[i] = []
      for (var j = 0; j < board[i].length; j++) {
        var c = board[i][j]
        newB[i][j] = {
          mine: c.mine,
          count: c.count,
          revealed: c.revealed,
          flagged: c.flagged
        }
      }
    }
    var cell = newB[row][col] // get cell to toggle
    if (!cell.revealed) {
      cell.flagged = !cell.flagged // toggle flag state
      setBoard(newB) // update board with new flag state
    }
  }

  // build flat list of Cell components
  var cells = []
  for (var r = 0; r < board.length; r++) {
    for (var c = 0; c < board[r].length; c++) {
      cells.push(
        <Cell
          key={r + '-' + c}
          cell={board[r][c]}
          onClick={() => revealCell(r, c)} // attach left click handler
          onContextMenu={(evt) => flagCell(evt, r, c)} // attach right click handler
        />
      )
    }
  }

  // render the board grid using cell components
  return <div className="board">{cells}</div>
}

export default Board
