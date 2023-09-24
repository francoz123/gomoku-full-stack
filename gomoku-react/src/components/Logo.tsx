import { Link } from 'react-router-dom';
import styles from './Header.module.css';

// Returns the logo element
function 
Logo() {
  return (
    <Link to='/' className={styles.logo}>
        Gomoku
    </Link>
  )
}

export default Logo