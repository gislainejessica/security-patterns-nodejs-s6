import { isBefore, subHours } from 'date-fns'
import Queue from '../../lib/Queue'

import Agendamento from '../models/Agendamento'
import User from '../models/User'

import Cancellation from '../jobs/CancellationMail'
import Cache from '../../lib/Cache'

class CancelAgendamentoService {
  async run({ provider_id, user_id }){

    const agendamento = await Agendamento.findByPk(provider_id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
    })

    if (user_id !== agendamento.user_id) {
      throw new Error('Você não tem permissão para cancelar esse agendamento')
    }

    const datediffHours = subHours(agendamento.date, 2)

    if (isBefore(datediffHours, new Date())) {
      throw new Error('Cancelamento só pode ser feito com duas horas de antencedência minima')
    }

    agendamento.canceled_at = new Date()  
    await agendamento.save()
    await Queue.add(Cancellation.key, { agendamento })
    /**
     * INVALIDATE CACHE
     */
    await Cache.invalidatePrefix(`user:${user_id}:agendamentos`)

    return agendamento
  }
}

export default new CancelAgendamentoService()