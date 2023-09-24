import styles from './Games.module.css'
import { GameRecord } from '../types';
import { useNavigate } from 'react-router-dom';
import { get } from '../utils/http'
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context';

// Displays finished games and their outcomes
export default function Games() {
  const { user } = useContext(UserContext)
  const navigate = useNavigate()
  let gr: GameRecord[] = []
  const [gamesLength, setGameLength] = useState(0)
  const [games, setGames] = useState(gr)
  //let games: GameRecord[] = savedGAmes?  JSON.parse(savedGAmes) : null

  useEffect(() => {
    if (!user) navigate ('/login')
    else getGamesFromServer()
  }, [])

  async function getGamesFromServer() {
    const API_HOST = process.env.REACT_APP_API_HOST
      const gameRecords = await get<GameRecord[]>(
        `${API_HOST}/api/game/games`
      )
      
      setGames(gameRecords)
      setGameLength(gameRecords.length)
  }

  return (
    <main>
      {gamesLength===0 && <p className={styles.info}>No games available</p>}
      {gamesLength>0 && <div className={styles.container}>
        {games.map((game) => 
          (<div className={styles.logs}>
            <div className={styles.log}>
              <div className={styles.gameInfo}>
                <div className={styles.record}>
                  Game #{game.gameNumber} @{game.date}
                </div>
                <div className={styles.record}>
                  {game.winner? 
                    game.winner === 'Draw'? 'Game was a draw':'Winner: '+(game.winner==='b'?'Black':'White')
                    : 'Not completed'
                  }
                </div>
              </div>
              <button onClick={() => navigate(`/game-log/${game.id}`)}>
                View game log
              </button>
            </div>
          </div>
        )
        )}
      </div>}
    </main>
  )
}
