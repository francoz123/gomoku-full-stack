import { createServer } from 'http'
import express, { Express } from 'express'
import cors from 'cors'

import authHandler from './handler/auth.handler'
import gamePlayHandler from './handler/game.handler'
import { deserializeUser } from './middleware/deserializeUser'

const app: Express = express()

app.use(
  cors({
    origin: process.env.allowHost || true,
  })
)

app.use(express.json())
app.use('/api/auth', authHandler)
app.use(deserializeUser)
app.use('/api/game', gamePlayHandler)
app.use('/api/game/gameplay/update', gamePlayHandler)

export const server = createServer(app)

export default app
