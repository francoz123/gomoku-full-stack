import { useState, useContext } from 'react'
import styles from './Game.module.css'
import { Navigate, useNavigate } from 'react-router-dom';
import { Square } from '../components';
import { UserContext } from '../context';
import { GameRecord, GameState, GameUpdate } from '../types';
import { put } from '../utils/http'

/**
 * Repressents the game.
 * Prrovides fuctions to update the board and change turns,
 * as well as calculate wins and draws
 * @returns Game component
 */
function Game() {
  const { user, boardSize } = useContext(UserContext)
  const navigate = useNavigate()
  const [moveNumber, setMoveNumber] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState('');
  const [turn, setTurn] = useState('b');
  const [pause, setPause] = useState(false);

  const [board, setBoard] = useState(
    Array.from({length:boardSize}).map((_) => 
      Array.from({length:boardSize}).map((i) => '')
    )
  );

  const [moves, setMoves] = useState(
    Array.from({length:boardSize}).map((_) =>
      Array.from({length:boardSize}).map((i) => 0)
    )
  );

  const [gameState, SetGameState] = useState<GameState>(
    {
      board: board,
      moves:moves,
      moveNumber:0,
      boardSize: boardSize,
      turn:turn,
      date: getDate(),
      winner: '',
      gameOver:false,
      lastMove:[-1,-1]
    }
  )

  const [message, setMessage] = useState(
    (turn === 'b'? 'Black':'White')+' to play'
  );

  const updateServer = async (gameState:GameState) => {
    const API_HOST = process.env.REACT_APP_API_HOST
      
      if (gameState._id){
        console.log("game is ",gameState._id)
        const update = await put<GameState, GameUpdate>(
          `${API_HOST}/api/game/gameplay/update`, gameState
        )
        return update
      }else {
        const update = await put<GameState, GameUpdate>(
          `${API_HOST}/api/game/gameplay`, gameState
        )
        return update
      }
      
  }

  if (!user) return <Navigate to='/login' />
  let elements = initializeElements()

  function changeTurn() {
    setTurn(t => t = t === 'b'? 'w': 'b')
  }

  /* function validSquare(x: number, y:number): boolean{
    return (x >=0 && x<=boardSize && y>=0 && y<boardSize)
  } */

  async function updateBoard(x:number, y:number) {
    if (gameOver) return

    let newBoard = [...board]
    newBoard[x][y] = turn
    setBoard(newBoard)
    let newMoves = [...moves]
    newMoves[x][y] = moveNumber
    setMoves(newMoves)
    setMoveNumber(num => num + 1)

    SetGameState({...gameState,
      lastMove: [x,y],
      board: newBoard,
      moves: newMoves,
      moveNumber: moveNumber,
      turn: turn
    })

    console.log('before: ',moveNumber,{...gameState}, gameState.lastMove)
    const update = await updateServer({...gameState,
      lastMove: [x,y],
      board: newBoard,
      moves: newMoves,
      moveNumber: moveNumber,
      turn: turn
    })

    if (update.gameOver) {
      console.log(update.winner, typeof update.winner)
      setGameOver(update.gameOver)
      setWinner(w => update.winner)
      if (update.winner === 'Draw') {
        setMessage('Draw')
      } else setMessage((update.winner === 'w'? 'White': 'Black' ) + ' wins')
      return
    }
    SetGameState({
      ...gameState,
      _id: update._id,
      winner: update.winner,
      gameOver: update.gameOver
    })

    if (!gameOver) {
      changeTurn()
      setMessage((turn === 'w'? 'Black':'White')+' to play')
    }
    
    setPause(p => false)
  }
  
  function initializeElements() {
    return (<div id='board' className={styles.board}>
    {
      Array.from({length:boardSize}).map( (_, index) => 
      <div id={'row'+index} key={'row'+index} className={styles.row}>
        {Array.from({length:boardSize}).map((_, i) => 
          {
            let id = index * boardSize + i;
            return <Square 
              id={id}
              key={id}
              row={index}
              col={i}
              value={board[index][i]}
              pause={pause}
              pauseFunction={setPause}
              updateFunction={updateBoard}
            />
          }
        )}
      </div> 
      )
    }
    </div>)
  }

  function resetBoard() {
    let newBoard = [...board]
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        newBoard[i][j] = ''
      }
    }

    setMoveNumber(1)
    setBoard(newBoard)
    setGameOver(false)
    setTurn('b')
    setMessage('Black to play')
    setPause(false)
    SetGameState(gs => {
      return {
        ...(gs._id && {_id:gs._id}),
        board: board,
        moves:moves,
        moveNumber:0,
        boardSize: boardSize,
        turn:turn,
        date: getDate(),
        winner: '',
        gameOver:false,
        lastMove:[-1,-1]
      }
    })
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
    let date = getDate()
    games.push ({'id':id, 'boardSize':boardSize, 'game':currenGame, 'date':date, 'winner': winner})
    window.localStorage.setItem('gameLogs',JSON.stringify (games))
  }

  function getDate() {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const date = today.getDate();
    return `${month}/${date}/${year}`;
  }

  return (
    <main>
      <div className={styles.container}>
        <div id='info' className={styles.info}>{message}</div>
          {elements}
          <div  className={styles.buttonContainer}>
            <button onClick={resetBoard}>Reset</button>
            <button onClick={() => {
                if (gameOver) {
                  leaveGame()
                  navigate('/games')
                } else navigate('/')
              }
            }>
              Leave
            </button>
          </div>
        </div>
    </main>
  )//
}

export default Game