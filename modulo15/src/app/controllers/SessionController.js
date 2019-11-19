import jwt from 'jsonwebtoken'
import User from '../models/User'
import File from '../models/File'

import AuthConfig from '../../config/auth'
import * as Yup from 'yup'

// Token ( payload=id; palavra chave=md5online; config=tempo de expiração)

class SessionController {
  async store(req, res) {
    // Validação de entrada
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    })
    // Verificar se passou na validação
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação' })
    }

    const { email, password } = req.body

    const user = await User.findOne({
      where: { email },
      include: [{
        model: File,
        as: 'avatar',
        attributes: ['path', 'id', 'url']
      }]
    })
    // verificar se usuario existe
    if (!user) {
      return res.status(400).json({ error: 'Usuário não existe' })
    }
    // verificar se senha está batendo
    if (!(await user.checkPassword(password))) {
      return res.status(400).json({ error: 'Senha errada' })
    }

    const { id, name, avatar, provider } = user

    return res.json({
      user: {
        id,
        name,
        email,
        provider,
        avatar
      },
      token: jwt.sign({ id }, AuthConfig.secret, {
        expiresIn: AuthConfig.expiresIn,
      }),
    })
  }
}

export default new SessionController()
