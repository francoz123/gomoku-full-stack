import { useNavigate } from 'react-router-dom';
import styles from './UserLogin.module.css';
import { useContext } from 'react';
import { UserContext } from '../context';

// Returs the login section of the header element
function UserLogin() {
  const navigate = useNavigate()
  const { user, logout } = useContext(UserContext)
  return (
    <div className={styles.login}>
        {!user && 
          <>
            <button 
              onClick={() => navigate('Login')} 
              className={styles.loginButton}>
                Login
            </button>
            <button 
              onClick={() => navigate('sign-up')} 
              className={styles.loginButton}>
                Sign up
            </button>
          </>
        }
        {user && 
          <>
            <button 
              onClick={() => navigate('games')} 
              className={styles.loginButton}>
                Previous games
            </button>
            <button 
              onClick={() => logout()} 
              className={styles.loginButton}>
                Logout
            </button>
          </>
        }
    </div>
  )
}

export default UserLogin