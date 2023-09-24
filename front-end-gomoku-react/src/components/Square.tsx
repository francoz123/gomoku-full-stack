import styles from './Square.module.css';

type squareProps = {
    id: number
    row: number
    col: number
    value: string
    pause:boolean
    pauseFunction: (pause:boolean) => void
    updateFunction: (x:number, y:number) => Promise<void>
}

// Represents a square on the board
function Square(props: squareProps) {
  const {id, row, col, value, pause, pauseFunction, updateFunction} = props;
  
  function handleClick(){
    if (!(value) && !pause) {
        updateFunction(row, col)
        pauseFunction(true)
    }
  }

  return (
    <div id={''+id} className={styles.square}  onClick={handleClick}>
        {value === 'w' && (<div className={styles.white+' '+styles.piece}></div>)}
        {value === 'b' && (<div className={styles.black+' '+styles.piece}></div>)}
    </div>
  )
}

export default Square