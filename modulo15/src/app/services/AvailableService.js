import Agendamento from '../models/Agendamento'
import { Op } from 'sequelize'
import {
  startOfDay,
  endOfDay,
  setHours,
  setMinutes,
  setSeconds,
  format,
  isAfter,
} from 'date-fns'

class AvailableService {
  async run({ provider_id, date }){

    const agendamentos = await Agendamento.findAll({
      where: {
        provider_id,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(date), endOfDay(date)],
        },
      },
    })

    const scheule = [
      '08:00',
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
      '19:00',
      '00:00',
    ]
    const available = scheule.map(time => {
      const [hour, minute] = time.split(':')
      const value = setSeconds(
        setMinutes(setHours(date, hour), minute),
        0
      )
      return {
        time,
        value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
        available:
          isAfter(value, new Date()) &&
          !agendamentos.find(a => format(a.date, 'HH:mm') === time),
      }
    })
    return available
  }
}

export default new AvailableService()