import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import 'express-async-errors'
import routes from './routes'
import path from 'path'
import Youch from 'youch'
import * as Sentry from '@sentry/node'
import sentryConfig from './config/sentry'
import './database'

class App {
  constructor() {
    this.server = express()

    Sentry.init(sentryConfig)

    this.midllewares()
    this.routes()
    this.execptionHandler()
  }

  midllewares() {
    this.server.use(Sentry.Handlers.requestHandler())
    this.server.use(cors())
    this.server.use(express.json())
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    )
  }

  routes() {
    this.server.use(routes)
    this.server.use(Sentry.Handlers.errorHandler())
  }

  execptionHandler() {
    this.server.use(async (erro, req, res, next) => {
      if (process.env.NODE_END === 'development') {
        const errors = await new Youch(erro, req).toJSON()
        return res.status(500).json(errors)
      }
      return res.status(500).json({ error: 'Internal server error' })
    })
  }
}

export default new App().server
