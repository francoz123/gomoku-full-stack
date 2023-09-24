import { useContext, useEffect, useState } from 'react'
import styles from './GameLog.module.css'
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../context';
import { GameRecord } from '../types';
import { get } from '../utils/http';

/**
 * Represents a game log showing all moves
 * in the order in wich they were played
 */
function GameLog() {
  const {id} = useParams()
  const { user } = useContext(UserContext)
  const navigate = useNavigate()

  let g: GameRecord = {
    id: undefined,
    boardSize: 0,
    gameNumber: 0,
    game: [],
    date: '',
    winner: ''
  }
  const [game, setGame] = useState(g)

  useEffect(() => {
    if (!user) navigate ('/login')
    else getGameFromServer()
  }, [])

  async function getGameFromServer() {
    const API_HOST = process.env.REACT_APP_API_HOST
      const gameRecord = await get<GameRecord>(
        `${API_HOST}/api/game/gamelog/${id}`
      )
      setGame(gameRecord)
  }

  if (!user) return <Navigate to='/login' />

  const elements = initializeElements()
  
  function initializeElements() {
    return (
        <div id='board' className={styles.board}>
        {
          game.game.map( (x, index) => 
          <div id={''+index} key={index} className={styles.row}>
            {x.map((_, i) => 
              {
                let id = index * game.boardSize + i;
                let value = game.game[index][i][0]
                let move = game.game[index][i][1]
                return (<div id={''+id} className={styles.square}>
                {value && (<div className={(value === 'b'?styles.black:styles.white)+' '+styles.piece}>{move}</div>)}
              </div>)
              }
            )}
          </div> 
          )
        }
        </div>
    )
  }

  return (
    <main>
      <div className={styles.info}>
      {game.winner !== 'Draw' ? 'Winner: ' + (game.winner==='b'?'Black':'White')
        : 'Draw Game'
      }
      </div>
          {elements}
      <div className={styles.buttonContainer}>
        <button onClick={() => navigate('/games')}>Back</button>
      </div>
    </main>
  )
}

export default GameLog