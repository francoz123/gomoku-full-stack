import express, { Request, Response } from 'express'
import mongoose from 'mongoose'
import validateSchema from '../middleware/validateSchema'
import { 
  CreateGameInput, 
  UpdateGameInput, 
  ReadGamesInput, 
  deleteGameSchema, 
  updateGameSchema
} from '../schema/game.schema'

import { createGame, getGameByGameId, updateGame } from '../service/game.service'
import { signJwt } from '../util/jwt'
//import WebSocket from 'ws'
import { wss } from '../websocket'
import { GameRecord, GameState, DisplayItem, GameUpdate } from '../types'
import gameModel from '../model/game.model'

let gameOver: boolean = false
let turn = ''
let board: string[][] = []
let newBoard = []
let moves: number[][] = []
let boardSize = 0

function validSquare(x: number, y:number): boolean{
  return (x >=0 && x<=boardSize && y>=0 && y<boardSize)
}

function countPieces(yCoord:number, xCoord:number) {
  let count = 1;
  let currentTurn = turn
  let counts = [[0,0,0], [0,0,0], [0,0,0]]
  // Counts in all possible directions
  for (let dy = -1; dy <= 1; dy++) { // (-1, -1), (-1, 1) etc
    for (let dx = -1; dx <= 1; dx++) {
      let currernCount = 1

      if (dx === 0 && dy === 0) continue // Skips start location
      let x = xCoord + dx
      var y = yCoord + dy

      if (!validSquare(x, y)) continue

      let square = board[y][x]

      if (square === currentTurn){
        currernCount++
        let x1 = x + dx
        let y1 = y + dy

        if (!validSquare(x1, y1)) continue

        square = board[y1][x1]
        
        while (square === currentTurn) {
          currernCount++
          x1 += dx
          y1 += dy
          if (validSquare(x1, y1)) square = board[y1][x1]
          else break
        }
        counts[1+dy][1+dx] = currernCount-1
        count = currernCount + counts[1+(-dy)][1+(-dx)]
        if (count >= 5) {
          return count
        }
        
      }
    }
  }
  return count
}

function draw() {
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      if(board[i][j] === '') return false
    }
  }
  return true
}

function leaveGame() {
  let currenGame = board.map((row, rowIndex) => {
    return row.map ((square, squareIndex) => 
      [board[rowIndex][squareIndex], moves[rowIndex][squareIndex]])
    })
  let games: GameRecord[] | any = []
  let gameLogs = window.localStorage.getItem('gameLogs');

  if (gameLogs) games = JSON.parse(gameLogs)

  let id = games.length + 1
  //let date = getDate()
  //games.push ({'id':id, 'boardSize':boardSize, 'game':currenGame, 'date':date, 'winner': winner})
  window.localStorage.setItem('gameLogs',JSON.stringify (games))
}

const gamePlayHandler = express.Router()

gamePlayHandler.put(
  '/gameplay'/* ,
  validateSchema(updateGameSchema) */,
  async (req: Request, res: Response) => {
    // TODO: decode user id from token
    const gameState: GameState = req.body

    board = gameState.board
    moves = gameState.moves
    boardSize = gameState.boardSize
    let lastMove = gameState.lastMove
    turn = gameState.turn
    let winner = gameState.winner

    const newG = new gameModel({
      board: board.reduce((x, v) => [...x, ...v], []), 
      moves: moves.reduce((x, v) => [...x, ...v], []),
      moveNumber: gameState.moveNumber, 
      boardSize: gameState.boardSize, 
      turn: gameState.turn,
      date: gameState.date, 
      winner: gameState.winner, 
      gameOver: gameOver, 
      lastMove: gameState.lastMove
    })

    if (gameState._id){
      let count = countPieces(lastMove[0], lastMove[1])
      if (count >= 5) {
        gameOver = true
        winner = turn
        //console.log('fb',count)
      }
      
      if (draw()) {
        gameOver = true
        winner = 'Draw'
        //console.log('sb',count)
      }

      const filter = {_id: gameState._id}
      const update = {
        board: board.reduce((x, v) => [...x, ...v], []), 
        moves: moves.reduce((x, v) => [...x, ...v], []), 
        lastMove: lastMove, 
        winner: winner, 
        gameOver: gameOver, 
        turn: turn,
        moveNumber: gameState.moveNumber
      }
      /* const g = await gameModel.findById(gameState._id)
      newG.gameOver = gameOver
      newG.winner = winner */
      /* if (g){
        
      } */
      await gameModel.findOneAndUpdate(filter, update)
      res.send({
        _id:gameState._id,
        winner: turn,
        gameOver: gameOver
      })
    }else {
      let newGame = await gameModel.create(newG)
      res.status(200).send({
      _id:newGame._id,
      winner: turn,
      gameOver: gameOver
    })
}})

export default gamePlayHandler