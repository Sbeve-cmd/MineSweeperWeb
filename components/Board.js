// components/Board.js
import React from 'react'
import Cell from './Cell'

function Board(props) {
  var board = props.board
  var setBoard = props.setBoard
  var gameOver = props.gameOver
  var setGameOver = props.setGameOver
  var setFlagsRemaining = props.setFlagsRemaining

  // reveal neighbors recursively
  function floodFill(b, row, col) {
    if (
      row < 0 ||
      row >= b.length ||
      col < 0 ||
      col >= b[0].length
    ) {
      return
    }
    var cell = b[row][col]
    if (cell.revealed || cell.flagged) {
      return
    }
    cell.revealed = true
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

  function revealCell(row, col) {
    if (gameOver) {
      return
    }
    // copy board
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
    var clicked = newB[row][col]
    if (clicked.revealed || clicked.flagged) {
      return
    }
    if (clicked.mine) {
      // show all mines
      for (var r = 0; r < newB.length; r++) {
        for (var c = 0; c < newB[r].length; c++) {
          if (newB[r][c].mine) {
            newB[r][c].revealed = true
          }
        }
      }
      setBoard(newB)
      setGameOver(true)
      return
    }
    floodFill(newB, row, col)
    setBoard(newB)
  }

  function flagCell(e, row, col) {
    e.preventDefault()
    if (gameOver) {
      return
    }
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
    var cell = newB[row][col]
    if (!cell.revealed) {
      cell.flagged = !cell.flagged
      if (cell.flagged) {
        setFlagsRemaining(function(prev) { return prev - 1 })
      } else {
        setFlagsRemaining(function(prev) { return prev + 1 })
      }
      setBoard(newB)
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
          onClick={function(row, col) {
            return function() {
              revealCell(row, col)
            }
          }(r, c)}
          onContextMenu={function(e, row, col) {
            return function(evt) {
              flagCell(evt, row, col)
            }
          }(null, r, c)}
        />
      )
    }
  }

  return <div className="board">{cells}</div>
}

export default Board
