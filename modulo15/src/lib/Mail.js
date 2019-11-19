import { resolve } from 'path'
import nodemailer from 'nodemailer'
import configMail from '../config/mail'
import exphbs from 'express-handlebars'
import nodemailerhbs from 'nodemailer-express-handlebars'

class Mail {
  constructor() {
    const { host, secure, port, auth } = configMail
    this.tranporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: auth.user ? auth : null,
    })

    this.configureTempletes()
  }

  configureTempletes() {
    const viewPath = resolve(__dirname, '..', 'app', 'views', 'emails')
    this.tranporter.use(
      'compile',
      nodemailerhbs({
        viewEngine: exphbs.create({
          layoutsDir: resolve(viewPath, 'layouts'),
          partialsDir: resolve(viewPath, 'partials'),
          defaultLayout: 'default',
          extname: '.hbs',
        }),
        viewPath,
        extName: '.hbs',
      })
    )
  }

  sendMail(message) {
    return this.tranporter.sendMail({
      ...configMail.default,
      ...message,
    })
  }
}
export default new Mail()
