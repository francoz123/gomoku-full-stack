import { useContext, useEffect, useState } from 'react'
import styles from './GameLog.module.css'
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../context';
import { GameRecord } from '../types';
import { DisplayItem } from '../types';

/**
 * Represents a game log showing all moves
 * in the order in wich they were played
 */
function WatchGame() {
  const {id} = useParams()
  const { user } = useContext(UserContext)
  const navigate = useNavigate()
  const items: boolean[][] = []
  const displayArray: DisplayItem[] = []
  const [displayItems, setDisplayItems] = useState(displayArray)
  const [visible, setVisible] = useState(items)
  
  useEffect(() => {
    let copy = [...displayItems]
    copy = copy.sort((a,b) => {return Number(a.move) - Number(b.move)})
    setDisplayItems(copy)
    let count = 0
    const intervalfunction = setInterval(() => {
      let item = displayItems[count]
      let copy = [...visible]
      copy[item.row][item.col] = true
      setVisible(copy)
      count++
      if (count === displayItems.length) clearInterval(intervalfunction)
    }, 5000)
  }, [displayItems, visible])
  if (!user) return <Navigate to='/login' />

  let games: GameRecord[] 
  let gameLogs = window.localStorage.getItem('gameLogs');

  if (!gameLogs) return  <p>No games to show</p>
  else games = JSON.parse(gameLogs)

  let thisGame: GameRecord | undefined = games.find(x =>
    String(x.id) === String(id)
  )

  setVisible(
    Array.from({length:thisGame?thisGame.boardSize:0}).map((_) =>
        Array.from({length:thisGame?thisGame.boardSize:0}).map((i) => false)
    )
  )
  
  let boardSize = thisGame? thisGame.boardSize : 0
  const elements = initializeElements()

  function initializeElements() {
    return (
        <div id='board' className={styles.board}>
        {
          thisGame?.game.map( (x, index) => 
          <div id={''+index} key={index} className={styles.row}>
            {x.map((_, i) => 
              {
                let id = index * boardSize + i;
                let value = thisGame?.game[index][i][0]
                let move = thisGame?.game[index][i][1]
                if (value) setDisplayItems(
                  [...displayItems,{row:index, col:i, move:move?move:0, visible:false}]
                )
                
                return (
                  <div id={''+id} className={styles.square}>
                    {(value && visible[index][i]) && (<div className={(value === 'b'?styles.black:styles.white)+' '+styles.piece}>{move}</div>)}
                  </div>
                )
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
      {thisGame?.winner !== 'Draw' ? 'Winner: ' + thisGame?.winner
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

export default WatchGame