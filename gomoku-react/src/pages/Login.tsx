import { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../context'
import styles from './Login.module.css'
//import Users from '../data/users.json'

// User login form
function Login() {
  const { login } = useContext(UserContext)
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const ref = useRef<HTMLInputElement | null>(null)
  
  const handleLogin = async () => {
    setErrorMessage('')
    const result = await login(username, password)
    if (result === true) {
      navigate('/')
    } else {
      setErrorMessage(result)
    }
  }
    
    useEffect(() => {
      if (ref.current) ref.current?.focus()
    }, [])

  return (
    <main>
      <div className={styles.container}>
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
        <form action="" className={styles.authentication} 
          onSubmit={(e) => {
          e.preventDefault()
          handleLogin()
        }}>
          <input 
            type="text" 
            name="username" 
            ref={ref}
            id="username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="username"/>
          <input 
            type="password"
            name="password" 
            id="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"/>
          <button type="submit" 
            className={styles.button}
            disabled={!username || !password}
          >Submit</button>
        </form>
      </div>
    </main>
)
}

export default Login