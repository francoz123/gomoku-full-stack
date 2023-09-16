import mongoose, { Document } from "mongoose"

export interface GameDocument extends Document {
   board: string[]
   moves:number[]
   moveNumber:number 
   boardSize: number 
   turn:string 
   date: string 
   winner: string
   gameOver:boolean 
   lastMove:[number, number]
   createdAt?: Date; 
   updatedAt?: Date; 
 } 
  
 const GameSchema = new mongoose.Schema({ 
   board: { type: [String], require: true}, 
   moves: {type: [Number], require: true},
   moveNumber: {type: Number, require: true}, 
   gameNumber: {type: Number, require: true},
   boardSize: {type: Number, require: true}, 
   turn: {type: String, require: true},
   date: {type: String, require: true}, 
   winner: {type: String, require: true}, 
   gameOver: {type: Boolean, require: true}, 
   lastMove: {type: [Number], require: true}
   // The timestamps option tells Mongoose to assign createdAt and updatedAt fields to your schema. The type assigned is Date. 
 },{ timestamps: true }) 
  
 export default mongoose.model/* <GameDocument> */('Game', GameSchema)