import mongoose, { DocumentDefinition, FilterQuery } from 'mongoose'
import GameModel , { GameDocument } from '../model/game.model'

export async function getGameByGameId(gameId: string) {
  return await BookingModel.findOne({ gameId }).lean()
}

export async function getGameDetailsByUserId(userId: string) {
  return await BookingModel.findOne({ userId }).lean()
}

export async function createGame(
  input: DocumentDefinition<GameDocument>
) {
  return BookingModel.create(input)
}

export async function updateGame(
  id: string,
  userId: string,
  input: DocumentDefinition<GameDocument>
) {
  return BookingModel.findOneAndUpdate(
    {
      _id: new mongoose.Types.ObjectId(id),
      userId: new mongoose.Types.ObjectId(userId),
    },
    input,
    { new: true } // new option to true to return the document after update was applied.
  )
}

export async function deleteGame(id: string, userId: string) {
  return BookingModel.deleteOne({
    _id: new mongoose.Types.ObjectId(id),
    userId: new mongoose.Types.ObjectId(userId),
  })
}

export async function getGameByFilter(query: FilterQuery<GameDocument>) {
  return await BookingModel.findOne(query).lean()
}

export async function getGamesByFilter(query: FilterQuery<GameDocument>) {
  return await BookingModel.find(query).lean()
}
