import pt from 'date-fns/locale/pt'
import { format, parseISO } from 'date-fns'
import Mail from '../../lib/Mail'

class CancellationMail {
  get key() {
    return 'CancellationMail'
  }

  async handle({ data }) {
    console.log('A fila executou')
    const { agendamento } = data
    // Mandando por email uma mensagem sobre o cancelamento
    await Mail.sendMail({
      to: `${agendamento.provider.name}<${agendamento.provider.email}>`,
      subjet: 'Cancelamento de Agendamento',
      template: 'cancellation',
      context: {
        provider: agendamento.provider.name,
        user: agendamento.user.name,
        date: format(
          parseISO(agendamento.date),
          "'dia' dd 'de' MMMM', ás' H:mm'h",
          {
            locale: pt,
          }
        ),
      },
    })
  }
}

export default new CancellationMail()
