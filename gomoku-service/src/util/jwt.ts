import jwt, { SignOptions } from 'jsonwebtoken'
import dotenv from 'dotenv'
import fs from 'fs'
var path = require('path')
dotenv.config()

export const signJwt = (payload: Object, options: SignOptions = {}) => {
  const privateKey = process.env.accessTokenPrivateKey as string
 /*  const privateKey=fs.readFileSync('./private_key.pem')
  var filename = path.join(__dirname,'/private_key.pem')
  const privateKey=fs.readFileSync(filename) */
  return jwt.sign(payload, privateKey, {
    ...(options && options),
    algorithm: 'RS256',
    expiresIn: '8h',
  })
}

export const verifyJwt = <T>(token: string): T | null => {
  try {
    const publicKey = process.env.accessTokenPublicKey as string
    return jwt.verify(token, publicKey) as T
  } catch (error) {
    return null
  }
}
