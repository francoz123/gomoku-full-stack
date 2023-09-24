import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Styles  from './BoardSize.module.css';
import { UserContext } from '../context';

const maxSize = 16;

/* Returns form element that allows players to 
select the size of the board */
function BoardSize() {
  const navigate = useNavigate()
  const [value, setValue] = useState('5');
  const { setBoardSize } = useContext(UserContext)
  
  return (
    <div className={Styles.boardSizeFormContainer} id='board-size-form-container'>
      <form action="" className={Styles.boardSizeForm}>
        <label htmlFor="board-size">Select board size</label>
        <select name="board-size-select" id="board-size-select"  
          className={Styles.boardSizeSelect} 
          size={16} 
          value={value}
          onChange={(e) => setValue(e.target.value)}
        >
          {Array.from({length:maxSize}).map((_, index) => {
              return <option key={index+5} value={index+5}>{index+5} </option>
          })}
        </select>

        <StartButton onClick={
          () => {
            setBoardSize(parseInt(value))
            navigate('/game')
          }
          } />
      </form>       
    </div>
  )
}

// Submit button
function StartButton(props: {onClick: ()=>void}) {
    const { onClick } = props;
    
    return (
      <input type="button" 
        name="start-button" 
        id="startButton" 
        value="Start game" 
        className={Styles.startButton} 
        onClick={onClick}
      />
    )
}

export default BoardSize