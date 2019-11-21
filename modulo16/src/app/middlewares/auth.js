import jwt from 'jsonwebtoken'
import authConfig from '../../config/auth'
import { promisify } from 'util'

export default async (req, res, next) => {
  const authtoken = req.headers.authorization

  if (!authtoken) {
    return res.status(401).json({ error: 'Preciso de um token' })
  }

  const [, token] = authtoken.split(' ')

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret)
    req.user_id = decoded.id
    return next()
  } catch (erro) {
    return res.status(401).json({ error: 'Token inválido' })
  }
}
