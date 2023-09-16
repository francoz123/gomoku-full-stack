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

function validSquare(x: number, y:number, boardSize:number): boolean{
  return (x >=0 && x<=boardSize && y>=0 && y<boardSize)
}

function countPieces(yCoord:number, xCoord:number, turn:string, board:string[][], boardSize:number) {
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

      if (!validSquare(x, y, boardSize)) continue

      let square = board[y][x]

      if (square === currentTurn){
        currernCount++
        let x1 = x + dx
        let y1 = y + dy

        if (!validSquare(x1, y1, boardSize)) continue

        square = board[y1][x1]
        
        while (square === currentTurn) {
          currernCount++
          x1 += dx
          y1 += dy
          if (validSquare(x1, y1, boardSize)) square = board[y1][x1]
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

function draw(board:string[][], boardSize:number) {
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      if(board[i][j] === '') return false
    }
  }
  return true
}

function getGameRecord(id:string, board:string[], moves:number[], boardSize:number,
  gameNumber:number, date:string, winner:string) {

  let currentGame: (string | number)[][][] = []

  for (let i = 0; i < boardSize; i++) {
    currentGame[i] = [];
    for (let j = 0; j < boardSize; j++) {
      let col =  i * boardSize + j
      currentGame[i][j] = [board[col], moves[col]]
    }
  }

  return ({'id':id, 'boardSize':boardSize, 'gameNumber':gameNumber, 'game':currentGame, 'date':date, 'winner': winner})
}

const gamePlayHandler = express.Router()

gamePlayHandler.get(
  '/gamelog/:id'/* ,
  validateSchema(updateGameSchema) */,
  async (req: Request, res: Response) => {
    // TODO: decode user id from token
    let gameRecord: GameRecord = {
      id: undefined,
      boardSize: 0,
      gameNumber: 0,
      game: [],
      date: '',
      winner: ''
    }
    const game = await gameModel.findOne({_id:req.params.id}).lean()
    if (game) {console.log("Length > 1")
      gameRecord = getGameRecord(
          game._id.toString(), 
          game.board, 
          game.moves, 
          game.boardSize? game.boardSize : 0,
          game.gameNumber? game.gameNumber : 0, 
          game.date? game.date : '', 
          game.winner? game.winner : '')
    }
    console.log(gameRecord)
    res.status(200).send(gameRecord)
})

gamePlayHandler.get(
  '/games'/* ,
  validateSchema(updateGameSchema) */,
  async (req: Request, res: Response) => {
    // TODO: decode user id from token
    let gameRecords: GameRecord[] = []
    const games = await gameModel.find().lean()
    console.log(games.length)
    if (games.length > 0) {console.log("Length > 1")

      gameRecords = games.map(g => 
        {return getGameRecord(
          g._id.toString(), 
          g.board, 
          g.moves, 
          g.boardSize? g.boardSize : 0,
          g.gameNumber? g.gameNumber : 0, 
          g.date? g.date : '', 
          g.winner? g.winner : '')}
      )
    }
    console.log(gameRecords)
    res.status(200).send(gameRecords)
})

gamePlayHandler.put(
  '/gameplay'/* ,
  validateSchema(updateGameSchema) */,
  async (req: Request, res: Response) => {
    // TODO: decode user id from token
    const gameState: GameState = req.body
    console.log('After: ',gameState.moveNumber,gameState, gameState.lastMove)
    let board = gameState.board
    let moves = gameState.moves
    let boardSize = gameState.boardSize
    let lastMove = gameState.lastMove
    let turn = gameState.turn
    let winner = turn
    let gameOver = gameState.gameOver

    let id = (await gameModel.find()).length + 1
    const newG = new gameModel({
      board: board.reduce((x, v) => [...x, ...v], []), 
      moves: moves.reduce((x, v) => [...x, ...v], []),
      moveNumber: gameState.moveNumber, 
      gameNumber: id,
      boardSize: gameState.boardSize, 
      turn: gameState.turn,
      date: gameState.date, 
      winner: gameState.winner, 
      gameOver: gameOver, 
      lastMove: gameState.lastMove
    })

    if (gameState._id){
      let count = countPieces(lastMove[0], lastMove[1], turn, board, boardSize)
      if (count >= 5) {
        gameOver = true
        winner = turn
      }
      
      if (draw(board, boardSize)) {
        gameOver = true
        winner = 'Draw'
      }
      console.log('Winner', winner)
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
        winner: winner,
        gameOver: gameOver
      })
    }else {
      let newGame = await gameModel.create(newG)
      res.status(200).send({
      _id:newGame._id,
      winner: winner,
      gameOver: gameOver
    })
}})

export default gamePlayHandler