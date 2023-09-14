import express, { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import validateSchema from '../middleware/validateSchema'
import { createUser, getUserByUsername } from '../service/auth.service'
import { signJwt } from '../util/jwt'


  function changeTurn() {
    setTurn(t => t = t === 'b'? 'w': 'b')
  }

  function validSquare(x: number, y:number): boolean{
    return (x >=0 && x<=boardSize && y>=0 && y<boardSize)
  }

  function updateBoard(x:number, y:number) {
    if (gameOver) return 0
    let newBoard = [...board]
    newBoard[x][y] = turn
    setBoard(newBoard)

    let newMoves = [...moves]
    newMoves[x][y] = moveNumber
    setMoves(newMoves)
    setMoveNumber(num => num + 1)

    if (countPieces(x, y) >= 5) {
      setGameOver(true)
      setMessage((turn === 'w'? 'White': 'Black' ) + ' wins')
      setWinner((turn === 'w'? 'White': 'Black'))
      return 5
    }

    if (draw()) {
      setGameOver(true)
      setWinner('Draw')
      setMessage('Draw')
      return
    }

    if (!gameOver) {
      changeTurn()
      setMessage((turn === 'w'? 'Black':'White')+' to play')
    }
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
            setGameOver(true)
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

  function createGame() {
    let currenGame = board.map((row, rowIndex) => {
      return row.map ((square, squareIndex) => 
        [board[rowIndex][squareIndex], moves[rowIndex][squareIndex]])
      })
    let games: GameRecord[] | any = []
    let gameLogs = window.localStorage.getItem('gameLogs');

    if (gameLogs) games = JSON.parse(gameLogs)

    let id = games.length + 1
    let date = getDate()
    games.push ({'id':id, 'boardSize':boardSize, 'game':currenGame, 'date':date, 'winner': winner})
    window.localStorage.setItem('gameLogs',JSON.stringify (games))
  }

  


const authHandler = express.Router()
// require('crypto').randomBytes(64).toString('hex')
authHandler.put(
  '/gameplay',
  validateSchema(registerSchema),
  async (req: Request<{}, {}, RegisterInput['body']>, res: Response) => {
    try {
      const { username, password } = req.body

      // check if user already exist
      // Validate if user exist in our database
      const existingUser = await getUserByUsername(username)

      if (existingUser) {
        return res.status(409).send('User Already Exist. Please Login')
      }

      //Encrypt user password
      const encryptedPassword = await bcrypt.hash(password, 10)

      // Create user in our database
      const newUser = await createUser({
        username,
        password: encryptedPassword,
      })

      // Create token
      const token = signJwt({ username, _id: newUser._id })

      // return new user with token
      res.status(200).json({ _id: newUser._id, token })
    } catch (err) {
      console.log(err)
      return res.status(500).send(err)
    }
  }
)

authHandler.post(
  '/login',
    validateSchema(loginSchema),
  async (req: Request<{}, {}, LoginInput['body']>, res: Response) => {
    try {
      // Get user input
      const { username, password } = req.body
      console.log([username, password])

      // Validate if user exist in our database
      const user = await getUserByUsername(username)

      if (user && (await bcrypt.compare(password, user.password))) {
        // Create token
        console.log('User logged in')
        console.log({ username, _id: user._id })
        const token = signJwt({ username, _id: user._id })
        console.log(token)
        // user
        return res.status(200).json({ _id: user._id, token })
      }
      return res.status(400).send('Invalid Credentials')
    } catch (err) {
      console.log(err)
      return res.status(500).send(err)
    }
  }
)

export default authHandler