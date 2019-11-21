// Carregar os models da aplicação e fazer a conexão com o banco de dados postgres criado ligado ao config database.js
import Sequelize from 'sequelize'
import mongoose from 'mongoose'

import User from '../app/models/User'
import File from '../app/models/File'
import Agendamento from '../app/models/Agendamento'

import DataConfig from '../config/database'

const models = [User, File, Agendamento]

class Database {
  constructor() {
    this.init()
    this.mongo()
  }

  init() {
    this.connection = new Sequelize(DataConfig)
    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models))
  }

  mongo() {
    this.connection = mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useFindAndModify: true,
      useUnifiedTopology: true,
    })
  }
}
export default new Database()
