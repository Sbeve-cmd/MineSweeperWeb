// app/page.js
'use client'

import React, { useState, useEffect } from 'react'
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
  var [time, setTime] = useState(0)
  var [flagsRemaining, setFlagsRemaining] = useState(15)

  useEffect(function() {
    var timerId = setInterval(function() {
      if (!gameOver) {
        setTime(function(prev) {
          return prev + 1
        })
      }
    }, 1000)
  
    return function() {
      clearInterval(timerId)
    }
  }, [])

  function resetGame() {
    setBoard(createBoard())
    setGameOver(false)
    setTime(0)
    setFlagsRemaining(15) 
  }

  return (
    
    <div className="container">
      <h1>MineSweeper</h1>
      <div className="status-bar">
        <div className="status-item">⏱️ Time: {time}s</div>
        <div className="status-item">🚩 Flags left: {flagsRemaining}</div>
      </div>
      <button onClick={resetGame}>New Game</button>
      <Board
        board={board}
        setBoard={setBoard}
        gameOver={gameOver}
        setGameOver={setGameOver}
        setFlagsRemaining={setFlagsRemaining}
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
