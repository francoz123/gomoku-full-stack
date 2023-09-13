export interface GameDocument extends Document {
   board: string[][] 
   moves:number[][] 
   moveNumber:number 
   boardSize: number 
   turn:string 
   date: string 
   winner: string | null 
   gameOver:boolean 
   lastMove:[number, number] | null 
   createdAt?: Date; 
   updatedAt?: Date; 
 } 
  
 const GameSchema = new mongoose.Schema({ 
   board: { type: String[][], require: true}, 
   password: { type: String, require: true}, 
   moves: {type: number[][], require: true},
   moveNumber: {type: number, require: true}, 
   boardSize: {type: number, require: true}, 
   turn:string: {type: string, require: true},
   date: {type: string, require: true}, 
   winner: {type: string | null, require: true}, 
   gameOver: {type: boolean, require: true}, 
   lastMove: {type: [number, number] | null, require: true}
   // The timestamps option tells Mongoose to assign createdAt and updatedAt fields to your schema. The type assigned is Date. 
 },{ timestamps: true }) 
  
 export default mongoose.model<GameDocument>('Game', userSchema)