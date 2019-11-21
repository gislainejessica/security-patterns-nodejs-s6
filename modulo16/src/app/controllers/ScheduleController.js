import { startOfDay, endOfDay, parseISO } from 'date-fns'
import { Op } from 'sequelize'
import User from '../models/User'
import Agendamento from '../models/Agendamento'

class ScheduleController {
  async index(req, res) {
    const checkUserProvider = await User.findAll({
      where: { id: req.user_id, provider: true },
    })
    if (!checkUserProvider) {
      return res.status().json({ error: 'Usuario não é um provedor' })
    }
    const { date } = req.query
    const parsedDate = parseISO(date)

    const agendamentos = await Agendamento.findAll({
      where: {
        provider_id: req.user_id,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
      include:[{
        model: User,
        as: 'user',
        attributes: ['name']
      }],
      order: ['date'],
    })

    return res.json(agendamentos)
  }
}

export default new ScheduleController()
