// app/page.js
'use client'

import React, { useState, useEffect } from 'react'
import Board from '../components/Board'

// createBoard generates the initial minesweeper grid with mines and counts
function createBoard() {
  var SIZE = 10 // board dimensions (rows and columns)
  var MINES = 20 // total number of mines to place
  var grid = [] // initialize empty grid array

  // fill grid with default cell objects
  for (var i = 0; i < SIZE; i++) {
    grid[i] = []
    for (var j = 0; j < SIZE; j++) {
      grid[i][j] = {
        mine: false,       // whether this cell contains a mine
        count: 0,          // adjacent mine count
        revealed: false,   // whether this cell has been revealed
        flagged: false     // whether this cell has been flagged by the player
      }
    }
  }

  // randomly place mines until reach MINES count
  var placed = 0
  while (placed < MINES) {
    var r = Math.floor(Math.random() * SIZE)
    var c = Math.floor(Math.random() * SIZE)
    if (!grid[r][c].mine) {
      grid[r][c].mine = true
      placed++
    }
  }

  // calculate adjacent mine counts for each non mine cell
  for (var r = 0; r < SIZE; r++) {
    for (var c = 0; c < SIZE; c++) {
      if (!grid[r][c].mine) {
        var count = 0
        // check all neighboring cells for mines
        for (var dr = -1; dr <= 1; dr++) {
          for (var dc = -1; dc <= 1; dc++) {
            var nr = r + dr
            var nc = c + dc
            if (
              nr >= 0 &&
              nr < SIZE &&
              nc >= 0 &&
              nc < SIZE &&
              grid[nr][nc].mine
            ) {
              count++
            }
          }
        }
        grid[r][c].count = count // assign adjacent mine count
      }
    }
  }

  return grid // return the initialized grid
}

// Home is the main component rendering the minesweeper game UI
export default function Home() {
  // state hooks for board data and game status flags
  var [board, setBoard] = useState(createBoard())
  var [gameOver, setGameOver] = useState(false)
  var [win, setWin] = useState(false)
  // state hook for elapsed time in seconds
  var [seconds, setSeconds] = useState(0)
  // constant for total mines (flag counter reference)
  var TOTAL_MINES = 20

  // effect hook to update timer every second when game is active
  useEffect(() => {
    const timer = setInterval(() => {
      if (!gameOver && !win) {
        setSeconds((s) => s + 1)
      }
    }, 1000)
    // cleanup interval on unmount or on status change
    return () => clearInterval(timer)
  }, [gameOver, win])

  // reset game state, timer, and win flag
  function resetGame() {
    setBoard(createBoard())
    setGameOver(false)
    setWin(false)
    setSeconds(0)
  }

  // calculate number of flags placed
  var flags = board.flat().filter((c) => c.flagged).length

  // render header, controls, timer, flag counter, board, and overlays based on game status
  return (
    <div className="container">
      <h1>MineSweeper</h1>
      <button onClick={resetGame}>New Game</button>
      {/* display timer */}
      <p>Time: {seconds}s</p>
      {/* display flag counter */}
      <p>Flags: {flags}/{TOTAL_MINES}</p>
      <Board
        board={board}
        setBoard={setBoard}
        gameOver={gameOver}
        setGameOver={setGameOver}
        setWin={setWin}
      />
      {win && ( // show win overlay when player wins
        <div className="overlay">
          <p>you win!</p>
          <button onClick={resetGame}>restart</button>
        </div>
      )}
      {!win && gameOver && ( // show game over overlay when player hits a mine
        <div className="overlay">
          <p>game over</p>
          <button onClick={resetGame}>restart</button>
        </div>
      )}
    </div>
  )
}
