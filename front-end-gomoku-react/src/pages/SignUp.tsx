import { useContext, useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../context'
import styles from './Login.module.css'

function SignUp() {
  const { register } = useContext(UserContext)
  const usernameInput = useRef<HTMLInputElement | null>(null)
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [cpassword, setCPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (usernameInput.current) {
      usernameInput.current.focus()
    }
  }, [])
  
  const handleSignUp = async () => {
    setErrorMessage('')
    if (password !== cpassword) {
      setErrorMessage('Passwords do not match')
      return
    }
    const result = await register(username, password)
    if (result === true) {
      navigate('/')
    } else {
      setErrorMessage(result)
    }
  }

  return (
    <main>
      <div className={styles.container}>
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
        <form action="" 
        onSubmit={(e) => {
          e.preventDefault()
          handleSignUp()
        }}
          className={styles.authentication}>
          <input type="text" 
            name="username" 
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
          <input 
            type="cpassword" 
            name="cpassword" 
            id="cpassword2" 
            value={cpassword} 
            onChange={(e) => setCPassword(e.target.value)}
            placeholder="confirm password"/>
          <button type="submit" className={styles.button}>Submit</button>
        </form>
      </div>
    </main>
  )
}

export default SignUp