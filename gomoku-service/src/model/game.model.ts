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

export  type GameState = { 
   _id?: string | undefined 
   board: string[][] 
   moves:number[][] 
   moveNumber:number 
   boardSize: number 
   turn:string 
   date: string 
   winner: string | null 
   gameOver:boolean 
   lastMove:[number, number] | null 
 }
  
 const userSchema = new mongoose.Schema({ 
   username: { type: String, require: true, unique: true}, 
   password: { type: String, require: true}, 
   // The timestamps option tells Mongoose to assign createdAt and updatedAt fields to your schema. The type assigned is Date. 
 },{ timestamps: true }) 
  
 export default mongoose.model<UserDocument>('User', userSchema)