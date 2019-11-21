import Agendamento from '../models/Agendamento'
import User from '../models/User'
import File from '../models/File'

import CreateAgendamentoService from '../services/CreateAgendamentoService'
import CancelAgendamentoService from '../services/CancelAgendamentoService'

class AgendamentoController {
  async index(req, res) {
    const { page = 1 } = req.query
    const agendamentos = await Agendamento.findAll({
      where: { user_id: req.user_id, canceled_at: null },
      order: ['date'],
      attributes: ['id', 'date', 'past', 'cancelable'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    })
    return res.json(agendamentos)
  }

  async store(req, res) {
    const { provider_id, date } = req.body

    const agendamento = await CreateAgendamentoService.run({
      provider_id,
      user_id: req.user_id,
      date
    })

    return res.json(agendamento)
  }

  async delete(req, res) {
    const agendamento = await CancelAgendamentoService.run({
      provider_id: req.params.id,
      user_id: req.user_id
    })
    return res.json(agendamento)
  }
}

export default new AgendamentoController()
