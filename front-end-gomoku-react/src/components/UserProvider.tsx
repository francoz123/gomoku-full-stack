import React from 'react'
import { User, Credential } from '../types'
import { UserContext } from '../context'
import { useState } from 'react'
import { post, setToken } from '../utils/http'
import { useLocalStorage } from '../hooks'

type UserProviderProps = {
  children: React.ReactNode
}

const API_HOST = process.env.REACT_APP_API_HOST || ''//'http://localhost:8080'

export default function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useLocalStorage<User | undefined>('user', undefined)
  if (user) {
    setToken(user.token)
  }

  const [boardSize, setBS] = useState(5)

  function setBoardSize (x: number) {
    setBS(x)
  }
  
  if (user) {
    setToken(user.token)
  }
  
  const login = async (username: string, password: string) => {
    try {
      const user = await post<Credential, User>(`${API_HOST}/api/auth/login`, {
        username,
        password,
      })
      setUser(user)
      setToken(user.token)
      return true
    } catch (error) {
      if (error instanceof Error) {
        return error.message
      }
      return 'Unable to login at this moment, please try again'
    }
  }

  const register = async (username: string, password: string) => {
    try {
      const user = await post<Credential, User>(
        `${API_HOST}/api/auth/register`,
        {
          username,
          password,
        }
      )
      setUser(user)
      setToken(user.token)
      return true
    } catch (error) {
      if (error instanceof Error) {
        return error.message
      }
      return 'Unable to login at this moment, please try again'
    }
  }

  const logout = () => {
    setUser(undefined)
    setToken('')
  }

  return (
    <UserContext.Provider value={{ user, login, logout, register, setBoardSize, boardSize }}>
      {children}
    </UserContext.Provider>
  )
}
