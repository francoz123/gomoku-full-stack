import { createServer } from 'http'
import express, { Express } from 'express'
import cors from 'cors'

import authHandler from './handler/auth.handler'
import gamePlayHandler from './handler/game.handler'

const app: Express = express()

app.use(
  cors({
    origin: process.env.allowHost || true,
  })
)

app.use(express.json())

app.use('/api/auth', authHandler)
app.use('/api/game', gamePlayHandler)

export const server = createServer(app)

export default app
