import { Router } from 'express'
import UserController from './app/controllers/UserController'
import SessionController from './app/controllers/SessionController'
import FileController from './app/controllers/FileController'
import ProviderController from './app/controllers/ProviderController'
import AgendamentoController from './app/controllers/AgendamentoController'
import ScheduleController from './app/controllers/ScheduleController'
import NotificationController from './app/controllers/NotificationController'
import AvailableController from './app/controllers/AvailableController'

import validateUserStore from './app/validators/UserStore'
import validateUserUpdate from './app/validators/UserUpdate'
import validateSessionStore from './app/validators/SessionStore'
import validateAgendamentoStore from './app/validators/AgendamentoStore'



import authMidlle from './app/middlewares/auth'

import multer from 'multer'
import multerConfig from './config/multer'

const routes = new Router()
const upload = multer(multerConfig)

routes.post('/users', validateUserStore, UserController.store)
routes.post('/sessions', validateSessionStore, SessionController.store)

// Middleware global, mas que só será aplicado as rotas que seguem
routes.use(authMidlle)
routes.put('/users', validateUserUpdate, UserController.update)

routes.post('/files', upload.single('file'), FileController.store)

routes.get('/providers', ProviderController.index)
routes.get('/providers/:providerId/available', AvailableController.index)

routes.post('/agendamentos', validateAgendamentoStore, AgendamentoController.store)
routes.get('/agendamentos', AgendamentoController.index)
routes.delete('/agendamentos/:id', AgendamentoController.delete)

routes.get('/schedule', ScheduleController.index)

routes.get('/notifications', NotificationController.index)
routes.put('/notifications/:id', NotificationController.update)

export default routes
