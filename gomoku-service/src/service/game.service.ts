import mongoose, { DocumentDefinition, FilterQuery } from 'mongoose'
import GameModel , { GameDocument } from '../model/game.model'

export async function updateGameByGameId(gameId: string) {
  return await GameModel.findOne({ gameId }).lean()
}

export async function createGame(
  input: DocumentDefinition<GameDocument>
) {
  return GameModel.create(input)
}

export async function updateGame(
  id: string,
  input: DocumentDefinition<GameDocument>
) {
  return GameModel.findOneAndUpdate(
    {
      _id: new mongoose.Types.ObjectId(id),
    },
    input,
    { new: true } // new option to true to return the document after update was applied.
  )
}

export async function deleteGame(id: string, userId: string) {
  return GameModel.deleteOne({
    _id: new mongoose.Types.ObjectId(id),
    userId: new mongoose.Types.ObjectId(userId),
  })
}

export async function getGameByFilter(query: FilterQuery<GameDocument>) {
  return await GameModel.findOne(query).lean()
}

export async function getGamesByFilter(query: FilterQuery<GameDocument>) {
  return await GameModel.find(query).lean()
}
