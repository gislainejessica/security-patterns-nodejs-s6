import { startOfHour, parseISO, isBefore, format } from 'date-fns'
import pt from 'date-fns/locale/pt'

import Agendamento from '../models/Agendamento'
import User from '../models/User'
import Notification from '../schemas/Notifications'

class CreateAgendamentoService {
  async run({provider_id, user_id ,date}){
   
    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    })
    if (!isProvider) {
      throw new Error('Só pode agendar se passar um provider valido')
    }
    const horaStart = startOfHour(parseISO(date))
    if (isBefore(horaStart, new Date())) {
     throw new Error('Não dá pra fazer agendamento no passado, informe uma data futura')
    }
    const agendaCheck = await Agendamento.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: horaStart,
      },
    })

    if (agendaCheck) {
      throw new Error('Horário não está disponível para agendamento')
    }
    const agendamento = await Agendamento.create({
      provider_id,
      date: horaStart,
      user_id,
    })
    const user = await User.findByPk(user_id)
    const formatedDate = format(horaStart, "'dia' dd 'de' MMMM', ás' H:mm'h", {
      locale: pt,
    })
    await Notification.create({
      content: `Novo agendamento de ${user.name} para o ${formatedDate}`,
      user: provider_id,
    })
    return agendamento
  }
}

export default new CreateAgendamentoService()