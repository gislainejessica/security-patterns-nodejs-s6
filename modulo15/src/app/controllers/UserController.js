import User from '../models/User'
import File from '../models/File'

import * as Yup from 'yup'

class UserController {
  async store(req, res) {
    // Validação de entrada
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    })
    // Verificar se passou na validação
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação' })
    }

    // Verificar se usuario existe
    const userExists = await User.findOne({ where: { email: req.body.email } })
    if (userExists) {
      return res.status(400).json({ error: 'email já está cadastrado' })
    }
    const { id, provider, name, email } = await User.create(req.body)
    // Retornar apenas os dados necessarios para o frontend
    return res.json({
      id,
      name,
      email,
      provider,
    })
  }

  async update(req, res) {
    // Validação de entrada
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    })
    // Verificar se passou na validação
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação' })
    }

    const { email, oldPassword } = req.body
    const user = await User.findByPk(req.user_id)

    // Verificar se email passado é diferente(quer trocar)
    if (email !== user.email) {
      // verificar se email novo já não existe na base de dados
      if (email === User.findOne({ where: { email } })) {
        return res.status(400).json({ error: 'email já está cadastrado' })
      }
    }
    // Verificar atualização de senha
    if (
      oldPassword &&
      !(await oldPassword) === user.checkPassword(oldPassword)
    ) {
      return res.status(401).json({ error: 'senha inválida' })
    }
    await user.update(req.body)

    const { id, name, avatar } = await User.findByPk(req.user_id, {
      include:[{
        model: File,
        as: 'avatar',
        attributes:['id', 'path', 'url']
      }]
    })

    return res.json({ id, name, email, avatar })
  }
}

export default new UserController()
