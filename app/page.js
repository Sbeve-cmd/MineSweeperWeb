// app/page.js
'use client'

import React, { useState } from 'react'
import Board from '../components/Board'

function createBoard() {
  var SIZE = 10
  var MINES = 15
  var grid = []
  for (var i = 0; i < SIZE; i++) {
    grid[i] = []
    for (var j = 0; j < SIZE; j++) {
      grid[i][j] = {
        mine: false,
        count: 0,
        revealed: false,
        flagged: false
      }
    }
  }
  var placed = 0
  while (placed < MINES) {
    var r = Math.floor(Math.random() * SIZE)
    var c = Math.floor(Math.random() * SIZE)
    if (!grid[r][c].mine) {
      grid[r][c].mine = true
      placed++
    }
  }
  for (var r = 0; r < SIZE; r++) {
    for (var c = 0; c < SIZE; c++) {
      if (!grid[r][c].mine) {
        var count = 0
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
        grid[r][c].count = count
      }
    }
  }
  return grid
}

export default function Home() {
  var [board, setBoard] = useState(createBoard())
  var [gameOver, setGameOver] = useState(false)

  function resetGame() {
    setBoard(createBoard())
    setGameOver(false)
  }

  return (
    <div className="container">
      <h1>MineSweeper</h1>
      <button onClick={resetGame}>New Game</button>
      <Board
        board={board}
        setBoard={setBoard}
        gameOver={gameOver}
        setGameOver={setGameOver}
      />
      {gameOver && (
        <div className="overlay">
          <p>Game Over</p>
          <button onClick={resetGame}>Restart</button>
        </div>
      )}
    </div>
  )
}
