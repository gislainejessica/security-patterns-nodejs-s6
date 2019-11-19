### Configurando ambiente para o banco de dados MongoDB
1) Criar um container no docker (servidor) criar uma intancia para trabalhos com uma base de dados MongoDB
  - `sudo docker run --name mongodbbarber -p 27017:27017 -d -t mongo`
2) Instalar o mongoose
  - `yarn add mongoose`
3) Configuaração tambem será feita no `index.js` da pasta _database_
  - Add o metodo como abaixo:

  ```js
      mongo() {
      this.connection = mongoose.connect('mongodb://localhost:27017/teste', {
        useNewUrlParser: true,
        useFindAndModify: true,
      })
    }
  ```
Já tá conectado no banco

---
### Modelos do mongo na aplicação

- Usar o mongo para __Notificação de Agendamentos__

  *Schema free é a filosofia do mongodb*

1) Criar dentro da pasta *app* uma pasta para armazenar os *schemas*
2) Criar o aquivo `Notifications.js`
    - Criado o schema é só importar e usar nos controles e onde for necessário,
  não precisa inicalizar database como no sequelize
3) Ir na controller de agendamento no metodo store para criar a notificação

### Listar notificações
1) Criar rota de notificaçoes
2) Criar Controle para Notificação `NotificationController.js`

---

### Marcar notificações como lidas
1) Criar rotas para marcar como lida

  `routes.get('/notifications/:id', NotificationController.update)`
