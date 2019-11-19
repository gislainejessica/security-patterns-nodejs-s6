import Notifications from '../schemas/Notifications'
import User from '../models/User'

class NotificationController {
  async index(req, res) {
    // Verificar se provider é valido
    const isProvider = await User.findOne({
      where: { id: req.user_id, provider: true },
    })
    if (!isProvider) {
      return res
        .status(401)
        .json({ error: 'Só pode provedores podem carregar as notificações' })
    }
    const notifications = await Notifications.find({
      user: req.user_id,
    })
      .sort({ created_at: 'desc' })
      .limit(20)
    return res.json(notifications)
  }

  async update(req, res) {
    const notification = await Notifications.findByIdAndUpdate(
      req.params.id,
      {
        read: true,
      },
      { new: true }
    )
    return res.json(notification)
  }
}
export default new NotificationController()
