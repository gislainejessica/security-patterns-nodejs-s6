import AvailableService from  '../services/AvailableService'

class AvailableController {
  async index(req, res) {
    const { date } = req.query

    if (!date) {
      return res.status(400).json({ error: ' Data inválida' })
    }
    const dataSearch = Number(date)

    const available = await AvailableService.run({
       provider_id: req.params.providerId, 
       date: dataSearch
      })

    return res.json(available)
  }
}
export default new AvailableController()
